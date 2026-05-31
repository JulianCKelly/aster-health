/**
 * Simple client‑side helper for invoking the Aster API endpoints. Each
 * module calls a distinct route (navigator, auditor, coder, reconcile). This
 * helper wraps the fetch call and error handling so the pages remain
 * succinct.
 */
export async function callAsterTool(tool: string, input: string): Promise<any> {
  const response = await fetch(`/api/${tool}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `${tool} failed`);
  }
  return data;
}