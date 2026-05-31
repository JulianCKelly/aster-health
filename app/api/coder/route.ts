import { NextRequest, NextResponse } from 'next/server';
import { runClaudeJson } from '../../../lib/anthropic';
import { PROMPT_CODER } from '../../../lib/prompts';

// API route for the Coding Assistant. Accepts clinical notes and returns
// codified diagnoses, procedures, labs and medications from the model.
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
    const result = await runClaudeJson({ systemPrompt: PROMPT_CODER, userContent: input, maxTokens: 4000 });
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}