import { NextResponse } from 'next/server';
import { query } from '../../../lib/snowflake';

export async function POST(req: Request) {
  const { patientId } = await req.json();

  try {
    const encounters = await query(`
      SELECT * FROM ANALYTICS.FACT_CLINICAL_ENCOUNTERS
      WHERE PATIENT_ID = '${patientId}'
      ORDER BY ENCOUNTER_DATE
    `);

    const labs = await query(`
      SELECT * FROM ANALYTICS.FACT_LAB_RESULTS
      WHERE PATIENT_ID = '${patientId}'
      ORDER BY COLLECTION_DATE
    `);

    if (!encounters.length) throw new Error(`No encounters found for ${patientId}`);

    const first: any = encounters[0];
    const last: any = encounters[encounters.length - 1];

    const timeline = [
      ...encounters.map((e: any) => ({
        id: e.ENCOUNTER_ID,
        date: new Date(e.ENCOUNTER_DATE).toISOString().substring(0, 10),
        type: 'ENCOUNTER',
        title: `${e.ENCOUNTER_TYPE} — ${e.FACILITY}`,
        detail: e.ASSESSMENT || e.CHIEF_COMPLAINT,
        source: e.FACILITY,
        confidence: 'HIGH',
        is_cross_border: e.IS_CROSS_BORDER,
      })),
      ...labs.map((l: any) => ({
        id: l.LAB_ID,
        date: new Date(l.COLLECTION_DATE).toISOString().substring(0, 10),
        type: 'LAB',
        title: l.TEST_NAME,
        detail: `${l.RESULT_VALUE} ${l.UNIT || ''} ${l.FLAG && l.FLAG !== 'N' ? '(' + l.RESULT_STATUS + ')' : ''}`.trim(),
        source: l.FACILITY || l.COUNTRY,
        confidence: 'HIGH',
      })),
    ].sort((a, b) => (a.date || '').localeCompare(b.date || ''));

    const sources = [...new Set(encounters.map((e: any) => e.FACILITY))];

    const result = {
      patient: {
        name: first.FULL_NAME,
        dob: 'on file',
        aliases: [first.FULL_NAME],
      },
      summary: {
        events: timeline.length,
        sources: sources.length,
        range: `${new Date(first.ENCOUNTER_DATE).getFullYear()}-${new Date(last.ENCOUNTER_DATE).getFullYear()}`,
        quality: 'HIGH',
      },
      timeline,
      discrepancies: encounters
        .filter((e: any) => e.IS_CROSS_BORDER)
        .map((e: any) => ({
          field: 'care_location',
          note: `Cross-border encounter at ${e.FACILITY} (${e.COUNTRY})`,
          severity: 'MEDIUM',
        })),
    };

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
