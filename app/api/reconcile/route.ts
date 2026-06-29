import { NextResponse } from 'next/server';
import { query } from '../../../lib/snowflake';

export async function POST(req: Request) {
  const { patientId } = await req.json();

  try {
    // Get patient profile
    const profiles = await query(`
      SELECT * FROM ANALYTICS.PATIENT_PROFILE_SIGNALS
      WHERE PATIENT_ID = '${patientId}'
      LIMIT 1
    `);
    const profile = profiles[0];
    if (!profile) throw new Error(`Patient ${patientId} not found`);

    // Get care gaps
    const gaps = await query(`
      SELECT * FROM ANALYTICS.FACT_CARE_GAPS
      WHERE PATIENT_ID = '${patientId}'
      ORDER BY SEVERITY_RANK
    `);

    // Get encounters
    const encounters = await query(`
      SELECT * FROM ANALYTICS.FACT_CLINICAL_ENCOUNTERS
      WHERE PATIENT_ID = '${patientId}'
      ORDER BY ENCOUNTER_DATE
    `);

    // Map to reconcile schema the frontend expects
    const result = {
      patient: {
        name: profile.FULL_NAME,
        dob: 'on file',
        sources: [...new Set(encounters.map((e: any) => e.FACILITY))].map((f: any) => ({
          facility: f,
          mrn: `${patientId}-${f.substring(0,3).toUpperCase()}`
        })),
        aliases: [profile.FULL_NAME],
      },
      score: Math.max(60, 100 - (profile.TOTAL_GAPS * 5) - (profile.HIGH_SEVERITY_GAPS * 5)),
      stats: {
        fragments: encounters.length,
        unified: encounters.length,
        duplicates: 0,
        gaps: profile.TOTAL_GAPS,
        risks: profile.HIGH_SEVERITY_GAPS,
      },
      narrative: profile.PATIENT_PROFILE,
      gaps: gaps.map((g: any) => ({
        id: g.GAP_ID,
        category: g.GAP_TYPE,
        title: g.DESCRIPTION?.substring(0, 50),
        detail: g.GAP_ANALYSIS || g.DESCRIPTION,
        severity: g.SEVERITY,
        action: `Address ${g.GAP_TYPE.toLowerCase()} gap — provider aware: ${g.US_PROVIDER_AWARE ? 'yes' : 'no'}`,
      })),
      risks: gaps
        .filter((g: any) => g.SEVERITY === 'CRITICAL' || g.SEVERITY === 'HIGH')
        .slice(0, 3)
        .map((g: any) => ({
          id: g.GAP_ID,
          type: 'TRANSITION',
          title: g.GAP_TYPE,
          detail: g.GAP_ANALYSIS || g.DESCRIPTION,
          severity: g.SEVERITY,
        })),
    };

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
