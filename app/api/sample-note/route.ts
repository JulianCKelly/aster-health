import { NextResponse } from 'next/server';
import { query } from '../../../lib/snowflake';

export async function GET() {
  try {
    const rows = await query(`
      SELECT p.FULL_NAME, p.COUNTRY_OF_ORIGIN, p.PRIMARY_LANGUAGE,
             p.INSURANCE_STATUS, p.IMMIGRATION_YEAR,
             e.ENCOUNTER_DATE, e.ENCOUNTER_TYPE, e.CHIEF_COMPLAINT,
             e.ASSESSMENT, e.FACILITY
      FROM ANALYTICS.FACT_CLINICAL_ENCOUNTERS e
      JOIN ANALYTICS.PATIENT_PROFILE_SIGNALS p ON e.PATIENT_ID = p.PATIENT_ID
      WHERE e.PATIENT_ID LIKE 'SYN-%'
      ORDER BY RANDOM()
      LIMIT 5
    `);

    if (!rows.length) {
      return NextResponse.json({ note: null });
    }

    const r = rows[0] as any;
    const note = `Patient: ${r.FULL_NAME}, DOB on file, DOS ${r.ENCOUNTER_DATE?.toString().substring(0,10)}

CC: ${r.ENCOUNTER_TYPE} — ${r.CHIEF_COMPLAINT || 'Establish care'}

HPI: Patient immigrated from ${r.COUNTRY_OF_ORIGIN} in ${r.IMMIGRATION_YEAR}. Primary language: ${r.PRIMARY_LANGUAGE}. Insurance: ${r.INSURANCE_STATUS}. Presenting for follow-up and care establishment. Medical records from country of origin not available.

Assessment: ${r.ASSESSMENT || 'See encounter notes'}

Plan:
- Request records from ${r.COUNTRY_OF_ORIGIN} provider
- Reconcile current medications with US formulary
- Schedule appropriate follow-up
- Arrange interpreter services if needed`;

    return NextResponse.json({ note });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
