import { NextRequest, NextResponse } from 'next/server';
import { runClaudeJson } from '../../../lib/anthropic';
import { PROMPT_AUDITOR } from '../../../lib/prompts';

// Handles POST requests for the Pipeline Auditor. Expects a JSON body
// containing an `input` string with a SQL schema or pipeline configuration.
export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }
  const input = body?.input;
  if (!input || typeof input !== 'string' || !input.trim()) {
    return NextResponse.json({ error: 'Missing input text.' }, { status: 400 });
  }
  try {
    const result = await runClaudeJson({ systemPrompt: PROMPT_AUDITOR, userContent: input, maxTokens: 4000 });
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}