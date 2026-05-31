/**
 * Helper functions for interacting with the Anthropic API. This module
 * encapsulates the HTTP request and JSON parsing logic, allowing the rest
 * of the application to request model completions without worrying about
 * API details such as headers, error handling or key management.
 */

interface ClaudeRequest {
  systemPrompt: string;
  userContent: string;
  maxTokens?: number;
}

/**
 * Calls the Anthropic API using the provided system prompt and user content.
 * The model name and API key are taken from environment variables. The
 * response is assumed to be JSON; this helper will attempt to parse the
 * result and throw descriptive errors if anything goes wrong. The caller
 * should handle any thrown errors.
 */
export async function runClaudeJson({
  systemPrompt,
  userContent,
  maxTokens = 4000,
}: ClaudeRequest): Promise<any> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("Missing ANTHROPIC_API_KEY environment variable.");
  }
  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514";
  const fullPrompt = `${systemPrompt}\n\n---INPUT---\n${userContent}`;

  let response: Response;
  try {
    response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        messages: [
          {
            role: "user",
            content: fullPrompt,
          },
        ],
      }),
    });
  } catch (err: any) {
    throw new Error(`Network error: ${err.message}`);
  }

  let data: any;
  try {
    data = await response.json();
  } catch (err: any) {
    throw new Error(`Could not read API response: ${err.message}`);
  }

  if (!response.ok || data.error) {
    const errMsg = JSON.stringify(data.error || data).slice(0, 300);
    throw new Error(`Anthropic API error: ${response.status}: ${errMsg}`);
  }

  const raw = data.content?.[0]?.text;
  if (!raw) {
    throw new Error(`Empty model response. Raw data: ${JSON.stringify(data).slice(0, 300)}`);
  }

  return parseJsonSafely(raw);
}

/**
 * Attempts to parse a JSON string. If parsing fails, the function tries
 * several heuristics to repair truncated or wrapped JSON responses (e.g.
 * removing markdown fences, trimming to a closing brace, adding missing
 * closing brackets/braces). If none of these succeed, an error is thrown.
 */
function parseJsonSafely(raw: string): any {
  let cleaned = raw.replace(/```json|```/g, "").trim();

  // Direct parse
  try {
    return JSON.parse(cleaned);
  } catch {
    /* swallow */
  }

  // Trim to last complete brace or bracket
  const lastBrace = Math.max(cleaned.lastIndexOf("}"), cleaned.lastIndexOf("]"));
  if (lastBrace > 0) {
    const truncated = cleaned.slice(0, lastBrace + 1);
    try {
      return JSON.parse(truncated);
    } catch {
      // Try closing any open structures
      let attempt = truncated;
      const openBraces = (attempt.match(/{/g) || []).length - (attempt.match(/}/g) || []).length;
      const openBrackets = (attempt.match(/\[/g) || []).length - (attempt.match(/\]/g) || []).length;
      attempt += "]".repeat(Math.max(0, openBrackets)) + "}".repeat(Math.max(0, openBraces));
      try {
        return JSON.parse(attempt);
      } catch {
        /* final fall through */
      }
    }
  }

  throw new Error(
    `Could not parse model JSON. Response started: ${cleaned.slice(0, 300)}`,
  );
}