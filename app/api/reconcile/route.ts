import { NextRequest, NextResponse } from 'next/server';
import { runClaudeJson } from '../../../lib/anthropic';
import { PROMPT_RECONCILE } from '../../../lib/prompts';

// API route for the Continuity Engine. Accepts multiple source records
// across borders/providers and returns a unified patient record, gaps and
// risks. The request body must include an `input` field with the raw
// records.
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
    const result = await runClaudeJson({ systemPrompt: PROMPT_RECONCILE, userContent: input, maxTokens: 4000 });
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}