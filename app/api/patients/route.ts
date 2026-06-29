import { NextResponse } from 'next/server';
import { query } from '../../../lib/snowflake';

export async function GET() {
  try {
    const rows = await query(`
      SELECT
        PATIENT_ID,
        FULL_NAME,
        COUNTRY_OF_ORIGIN,
        PRIMARY_LANGUAGE,
        INSURANCE_STATUS,
        IMMIGRATION_YEAR,
        TOTAL_ENCOUNTERS,
        CROSS_BORDER_ENCOUNTERS,
        FIRST_ENCOUNTER,
        LAST_ENCOUNTER,
        TOTAL_GAPS,
        HIGH_SEVERITY_GAPS,
        GAP_TYPES,
        PATIENT_PROFILE
      FROM ANALYTICS.PATIENT_PROFILE_SIGNALS
      ORDER BY PATIENT_ID
    `);
    return NextResponse.json({ patients: rows });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
