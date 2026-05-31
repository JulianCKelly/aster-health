// Centralised prompt definitions for the Aster demo.

// Sample data used to pre‑populate the input fields across tools. These
// fragments represent a fictional patient with records at multiple
// facilities. Use these samples to demonstrate the workflow without
// exposing real PHI.
export const SAMPLE_FRAGMENTS = `=== Apollo Hospital Mumbai — Discharge Summary ===
Patient: Priya Sharma
DOB: 15/03/1989
MRN: APL-MUM-44291
Admission: 12/06/2020, Discharge: 15/06/2020
Diagnosis: Type 2 Diabetes Mellitus with mild diabetic retinopathy
HbA1c on admission: 9.2%
Started on Metformin 500mg BD
Vaccinations: BCG (1989), Hep B 3 doses (1989), MMR x2 (1990, 1995), Tdap (2014), Covaxin x2 (2021)

=== Kaiser Permanente LA — Establish Care ===
Patient: Sharma, Priya
DOB: 03/15/1989
MRN: KP-LA-887234
Date: 2024-08-14
CC: Establish care, USCIS I-693 prep
Assessment: T2DM suboptimally controlled, needs I-693 exam
Plan: Increase Metformin to 1000mg BID, order labs

=== LabCorp Results ===
Patient ID: KP-LA-887234
Date: 2024-08-15
HbA1c: 7.4% (H)
Fasting Glucose: 142 (H)
Creatinine: 0.9, eGFR: 89`;

export const SAMPLE_NOTE = `Patient: Priya Sharma, DOB 03/15/1989, DOS 08/14/2024

CC: Establish care, blurry vision right eye, increased thirst

HPI: 35yo F with PMH T2DM, recent immigrant. Increased thirst and polyuria x2 weeks.
Blurry vision right eye x1 month. On Metformin 500mg BID.

PE: BMI 28.4. Mild non-proliferative diabetic retinopathy right eye.
Decreased monofilament sensation bilaterally.

Assessment:
1. Type 2 DM, uncontrolled (HbA1c 7.4%)
2. Mild non-proliferative diabetic retinopathy, right eye
3. Diabetic peripheral neuropathy

Plan:
- Increase Metformin to 1000mg BID
- Add Glipizide 5mg daily
- Refer ophthalmology
- HbA1c in 3 months
- Office visit, established, 25 minutes`;

export const SAMPLE_SCHEMA = `CREATE TABLE patient_records (
  id INT,
  full_name VARCHAR(255),
  ssn VARCHAR(11),
  date_of_birth DATE,
  diagnosis TEXT,
  medication TEXT,
  notes TEXT
);

CREATE TABLE lab_results (
  id INT,
  patient_id INT,
  test_name VARCHAR(100),
  result_value DECIMAL,
  collected_on DATE
);`;

// Prompts tuned for a ~1000 token response. They instruct the model to
// return concise, structured JSON without extra markdown or preamble.
export const PROMPT_NAVIGATOR = `You are a FHIR record navigator. Extract clinical events from these patient records into a unified timeline.

Return ONLY this JSON, no markdown, no preamble:
{
  "patient": {"name": "...", "dob": "YYYY-MM-DD", "aliases": ["..."]},
  "summary": {"events": N, "sources": N, "range": "YYYY-YYYY", "quality": "HIGH|MEDIUM|LOW"},
  "timeline": [
    {"id": "1", "date": "YYYY-MM-DD", "type": "ENCOUNTER|DIAGNOSIS|MEDICATION|PROCEDURE|LAB|IMMUNIZATION", "title": "...", "detail": "brief", "source": "...", "confidence": "HIGH|MEDIUM|LOW"}
  ],
  "discrepancies": [{"field": "...", "note": "brief", "severity": "HIGH|MEDIUM|LOW"}]
}

Max 6 timeline events. Max 3 discrepancies. Keep details brief.`;

export const PROMPT_AUDITOR = `You are a healthcare data pipeline auditor. Analyze for HIPAA, data quality, and interoperability issues.

Return ONLY this JSON, no markdown:
{
  "summary": {"critical": N, "high": N, "medium": N, "low": N, "overall": "CRITICAL|HIGH|MEDIUM|LOW", "total": N},
  "findings": [
    {"id": "1", "severity": "CRITICAL|HIGH|MEDIUM|LOW", "category": "HIPAA|DATA QUALITY|INTEROPERABILITY", "title": "...", "explanation": "one sentence", "fix": "one sentence"}
  ]
}

Max 6 findings. Keep text concise.`;

export const PROMPT_CODER = `You are a medical coder. Extract codable items from this clinical note and map to ICD-10, CPT, LOINC, or RxNorm.

Return ONLY this JSON, no markdown:
{
  "summary": {"total": N, "dx": N, "px": N, "labs": N, "meds": N, "primary": "ICD-10 code + description"},
  "codes": [
    {"id": "1", "system": "ICD-10|CPT|LOINC|RxNorm", "code": "...", "description": "...", "justification": "brief quote/paraphrase", "confidence": "HIGH|MEDIUM|LOW"}
  ]
}

Max 7 codes. Keep justifications brief.`;

export const PROMPT_RECONCILE = `You are a cross-border health record reconciliation engine. Unify these records, identify duplicates, gaps, and continuity risks.

Return ONLY this JSON, no markdown:
{
  "patient": {"name": "...", "dob": "YYYY-MM-DD", "sources": [{"facility": "...", "mrn": "..."}], "aliases": ["..."]},
  "score": 0-100,
  "stats": {"fragments": N, "unified": N, "duplicates": N, "gaps": N, "risks": N},
  "narrative": "2 sentences on the patient's reconciled story",
  "gaps": [{"id": "1", "category": "VACCINATION|CHRONIC|FOLLOWUP|SCREENING", "title": "...", "detail": "brief", "severity": "HIGH|MEDIUM|LOW", "action": "brief"}],
  "risks": [{"id": "1", "type": "MEDICATION|IDENTITY|DATA|TRANSITION", "title": "...", "detail": "brief", "severity": "HIGH|MEDIUM|LOW"}]
}

Max 3 gaps, max 3 risks. Keep all text brief.`;