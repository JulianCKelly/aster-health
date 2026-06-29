# Aster Health

**Healthcare data infrastructure for people who live across borders.**

When someone moves between health systems — between countries, between insurers, between any kind of border — their medical history fragments. Records sit in incompatible formats, different languages, separate institutions that were never built to talk to each other. A patient arriving in Los Angeles from Mumbai carries years of care in a form no US provider can read, trust, or act on. So the labs get re-run. The vaccines get repeated. The chronic conditions get re-diagnosed from scratch. The cost is paid in money, in time, and sometimes in outcomes.

Aster is the infrastructure that puts the record back together.

This started from watching a family member navigate exactly this problem; the fragmentation, the repetition, the quiet way a health system assumes your history began the day you walked through its door. Aster is being built to begin in the immigration corridor, where the pain is most acute and the existing connections to providers run deepest, and to expand outward from there into general cross-system record continuity.

## What this demo proves

Four tools, each demonstrating one layer of the problem and the infrastructure response:

- **Record Navigator** — ingests fragmented records from multiple sources (different formats, languages, identifier systems) and produces a single coherent clinical timeline with normalized dates and FHIR resource mapping.
- **Pipeline Auditor** — audits a data schema or pipeline config for HIPAA exposure, data quality gaps, and interoperability problems, ranked by severity with specific remediation.
- **Coding Assistant** — extracts codable concepts from a clinical note and maps them to ICD-10, CPT, LOINC, and RxNorm, with justification and confidence on each.
- **Continuity Engine** — the thesis in one screen. Takes records from multiple sources, reconciles patient identity across them, detects duplicate events, surfaces gaps in care, and flags continuity risks — then scores the whole reconciliation.

Each tool runs against a shared patient narrative — Priya Sharma, an immigrant from Mumbai with records at both Apollo Hospital and Kaiser Permanente Los Angeles — so the cross-border problem is visible end to end rather than abstract.

## Architecture

A Next.js frontend talks to server-side API routes, which call the Anthropic API. Keeping inference server-side keeps the API key out of the client and removes the output-size limits of a browser sandbox. The longer-term system extends this into a multi-stage ingestion pipeline — classification, format-specific extraction, schema normalization, and quality review — with human escalation on low-confidence output. This demo is the proof of concept for the output layer. The pipeline layer — HL7/FHIR ingestion, dbt-modeled clinical facts, Snowflake Cortex LLM enrichment — is built in [aster-analytics](https://github.com/JulianCKelly/aster-analytics) and is the production moat.

Intended structure: Public Benefit Corporation, mission-aligned capital only.

---

## Project Structure

```
├── app/           # Next.js app router pages
│   ├── api/       # Server API routes to call Anthropic
│   ├── auditor/
│   ├── coder/
│   ├── navigator/
│   ├── reconcile/
│   └── page.tsx   # Root page with sidebar and navigation
├── components/    # Shared UI components
├── lib/           # Shared libraries (prompts, constants, API helpers)
├── package.json   # Project dependencies and scripts
├── next.config.js # Next.js configuration
├── tsconfig.json  # TypeScript configuration
└── .env.local.example # Environment variable template
```

## Getting Started

1. Install dependencies (requires Node.js 18+):

   ```bash
   npm install
   ```

2. Copy `.env.local.example` to `.env.local` and fill in your Anthropic API key and model:

   ```bash
   cp .env.local.example .env.local
   # then edit .env.local
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## Notes

This demo is intended for illustration purposes only. Do **not** upload real patient information (PHI) into the app. The backend proxy simply forwards requests to Anthropic; in a production environment you would implement additional logging, rate limiting, authentication, audit trails, and database integration.

## Related

[aster-analytics](https://github.com/JulianCKelly/aster-analytics) — the Snowflake + dbt + Cortex pipeline that serves as the data infrastructure layer this interface is built on.
