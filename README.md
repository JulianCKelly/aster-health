# Aster Health

**Healthcare data infrastructure for people who live across borders.**

When someone moves between health systems — between countries, between insurers, between any kind of border — their medical history fragments. Records sit in incompatible formats, different languages, separate institutions that were never built to talk to each other. A patient arriving in Los Angeles from Mumbai carries years of care in a form no US provider can read, trust, or act on. So the labs get re-run. The vaccines get repeated. The chronic conditions get re-diagnosed from scratch. The cost is paid in money, in time, and sometimes in outcomes.

Aster is the infrastructure that puts the record back together.

This started from watching a family member navigate exactly this problem: the fragmentation, the repetition, the quiet way a health system assumes your history began the day you walked through its door. Aster is being built to begin in the immigration corridor, where the pain is most acute and the existing connections to providers run deepest, and to expand outward from there into general cross-system record continuity.

## What this demo proves

Four tools, each demonstrating one layer of the problem and the infrastructure response:

- **Record Navigator** — reads live patient data from the Snowflake warehouse and renders a single coherent clinical timeline with normalized dates, FHIR resource mapping, and cross-border encounter flags.
- **Pipeline Auditor** — audits a data schema or pipeline config for HIPAA exposure, data quality gaps, and interoperability problems, ranked by severity with specific remediation. Runs live Anthropic inference.
- **Coding Assistant** — extracts codable concepts from a clinical note (including live notes pulled from the warehouse) and maps them to ICD-10, CPT, LOINC, and RxNorm, with justification and confidence on each. Runs live Anthropic inference.
- **Continuity Engine** — the thesis in one screen. Reads pre-computed Cortex reconciliation data from Snowflake: patient identity reconciled across multiple source systems, duplicate events detected, care gaps surfaced, continuity risks flagged, and the whole reconciliation scored.

Each tool runs against nine synthetic patients — four hand-crafted clinical narratives and five Synthea-generated FHIR R4 patients with cross-border immigration overlays — so the cross-border problem is visible end to end rather than abstract.

## Architecture

A Next.js frontend talks to server-side API routes. Two tools (Pipeline Auditor, Coding Assistant) call the Anthropic API for live inference. Two tools (Record Navigator, Continuity Engine) query Snowflake directly via RSA key-pair authenticated connections, reading from pre-computed dbt models and Cortex LLM outputs built by [aster-analytics](https://github.com/JulianCKelly/aster-analytics).

Keeping inference server-side keeps the API key out of the client and removes the output-size limits of a browser sandbox. The Snowflake integration demonstrates the full stack: a Dagster-orchestrated pipeline generates FHIR data, loads it into Snowflake, runs dbt transformations and Cortex LLM enrichment, and surfaces the results here in the interface layer.

Intended structure: Public Benefit Corporation, mission-aligned capital only.

---

## Project Structure

    app/
    ├── api/
    │   ├── chat/          # Anthropic inference routes (Auditor, Coding Assistant)
    │   ├── patients/      # Patient list from Snowflake PATIENT_PROFILE_SIGNALS
    │   └── sample-note/   # Random Synthea encounter note from Snowflake
    ├── auditor/           # Pipeline Auditor
    ├── coder/             # Coding Assistant
    ├── navigator/         # Record Navigator (Snowflake)
    ├── reconcile/         # Continuity Engine (Snowflake)
    └── page.tsx           # Root page with sidebar and navigation
    components/            # Shared UI components
    lib/
    ├── snowflake.ts       # Snowflake connection with RSA key-pair auth
    └── prompts/           # Anthropic prompt templates

## Getting Started

    # 1. Install dependencies (requires Node.js 18+)
    npm install

    # 2. Configure environment
    cp .env.local.example .env.local
    # Add ANTHROPIC_API_KEY to .env.local

    # 3. Configure Snowflake credentials
    # Add account, username, private key path to .env.local

    # 4. Run the development server
    npm run dev

    # 5. Open http://localhost:3000

## Notes

Demo only. Synthetic patient data. Do not upload real patient information (PHI).

## Related

[aster-analytics](https://github.com/JulianCKelly/aster-analytics) — the Snowflake + dbt + Cortex + Dagster pipeline that serves as the data infrastructure layer this interface is built on.
