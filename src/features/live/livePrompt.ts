import { error, json } from "../../shared/http";
import { ALLOWED_PACKS, ALLOWED_SITUATIONS } from "./constants";
import { fetchApprovedLines, fetchLegacyLines } from "./firestore";

export async function livePrompt(
  request: Request,
  env: Cloudflare.Env,
): Promise<Response> {
  if (request.method !== "GET") {
    return error(405, "METHOD_NOT_ALLOWED");
  }

  const url = new URL(request.url);
  const pack = url.searchParams.get("pack") || "";
  const situation = url.searchParams.get("situation") || "";

  if (!ALLOWED_PACKS.has(pack) || !ALLOWED_SITUATIONS.has(situation)) {
    return error(400, "INVALID_FILTERS");
  }

  if (!env.FIREBASE_PROJECT_ID) {
    return error(500, "FIREBASE_NOT_CONFIGURED");
  }

  try {
    const exactPrompts = await fetchApprovedLines(
      env.FIREBASE_PROJECT_ID,
      pack,
      situation,
    );
    const anyPrompts = exactPrompts.length
      ? []
      : await fetchApprovedLines(env.FIREBASE_PROJECT_ID, pack, "any");
    const legacyPrompts =
      exactPrompts.length || anyPrompts.length
        ? []
        : await fetchLegacyLines(env.FIREBASE_PROJECT_ID, pack, situation);
    const prompts = exactPrompts.length
      ? exactPrompts
      : anyPrompts.length
        ? anyPrompts
        : legacyPrompts;
    const prompt = prompts[0];

    if (!prompt) {
      return error(404, "NO_PROMPT_FOUND");
    }

    return json({
      ok: true,
      prompt,
    });
  } catch (nextError) {
    console.error("live-prompt failed", nextError);
    return error(502, "FIRESTORE_QUERY_FAILED");
  }
}
