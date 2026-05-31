import { NextRequest, NextResponse } from 'next/server';
import { runClaudeJson } from '../../../lib/anthropic';
import { PROMPT_NAVIGATOR } from '../../../lib/prompts';

/**
 * API route for the Record Navigator. Accepts a POST request with a JSON
 * body containing an `input` string (the raw patient records). It returns
 * the parsed JSON response from the Anthropic model or an error
 * description with the appropriate HTTP status.
 */
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
    const result = await runClaudeJson({ systemPrompt: PROMPT_NAVIGATOR, userContent: input, maxTokens: 4000 });
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}