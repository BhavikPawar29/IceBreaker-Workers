import { exports } from "cloudflare:workers";
import { afterEach, describe, expect, it, vi } from "vitest";

function firestoreResult(id: string, text: string, pack = "playful") {
  return [
    {
      document: {
        name: `projects/test/databases/(default)/documents/lines/${id}`,
        fields: {
          pack: { stringValue: pack },
          situation: { stringValue: "date" },
          text: { stringValue: text },
        },
      },
    },
  ];
}

function legacyFirestoreResult(id: string, text: string, category = "curious") {
  return [
    {
      document: {
        name: `projects/test/databases/(default)/documents/lines/${id}`,
        fields: {
          category: { stringValue: category },
          text: { stringValue: text },
        },
      },
    },
  ];
}

describe("worker", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("serves health", async () => {
    const response = await exports.default.fetch(
      "https://example.com/health",
    );
    const body = await response.json<{
      ok: boolean;
      service: string;
      environment: string;
    }>();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.service).toBe("icebreaker-workers");
  });

  it("returns not found for unknown routes", async () => {
    const response = await exports.default.fetch("https://example.com/nope");
    const body = await response.json<{ error: string; ok: boolean }>();

    expect(response.status).toBe(404);
    expect(body.ok).toBe(false);
    expect(body.error).toBe("NOT_FOUND");
  });

  it("rejects invalid live prompt filters", async () => {
    const response = await exports.default.fetch(
      "https://example.com/api/live-prompt?pack=bad&situation=date",
    );
    const body = await response.json<{ error: string; ok: boolean }>();

    expect(response.status).toBe(400);
    expect(body.ok).toBe(false);
    expect(body.error).toBe("INVALID_FILTERS");
  });

  it("serves a live prompt", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json(firestoreResult("line-1", "Hello there")),
      ),
    );

    const response = await exports.default.fetch(
      "https://example.com/api/live-prompt?pack=playful&situation=date",
    );
    const body = await response.json<{
      ok: boolean;
      prompt: { id: string; pack: string; situation: string; text: string };
    }>();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.prompt).toEqual({
      id: "line-1",
      pack: "playful",
      situation: "date",
      text: "Hello there",
    });
  });

  it("falls back to situation any", async () => {
    const fetchMock = vi
      .fn()
      .mockImplementationOnce(async () => Response.json([]))
      .mockImplementationOnce(async () =>
        Response.json(firestoreResult("line-2", "Fallback line")),
      );

    vi.stubGlobal("fetch", fetchMock);

    const response = await exports.default.fetch(
      "https://example.com/api/live-prompt?pack=playful&situation=date",
    );
    const body = await response.json<{
      prompt: { id: string; text: string };
    }>();

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(body.prompt.id).toBe("line-2");
    expect(body.prompt.text).toBe("Fallback line");
  });

  it("returns no prompt found when Firestore has no matches", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => Response.json([])));

    const response = await exports.default.fetch(
      "https://example.com/api/live-prompt?pack=playful&situation=date",
    );
    const body = await response.json<{ error: string; ok: boolean }>();

    expect(response.status).toBe(404);
    expect(body.ok).toBe(false);
    expect(body.error).toBe("NO_PROMPT_FOUND");
  });

  it("falls back to legacy approved lines", async () => {
    const fetchMock = vi
      .fn()
      .mockImplementationOnce(async () => Response.json([]))
      .mockImplementationOnce(async () => Response.json([]))
      .mockImplementationOnce(async () =>
        Response.json(legacyFirestoreResult("line-3", "Legacy line")),
      );

    vi.stubGlobal("fetch", fetchMock);

    const response = await exports.default.fetch(
      "https://example.com/api/live-prompt?pack=deep&situation=date",
    );
    const body = await response.json<{
      prompt: { id: string; pack: string; situation: string; text: string };
    }>();

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(body.prompt).toEqual({
      id: "line-3",
      pack: "deep",
      situation: "any",
      text: "Legacy line",
    });
  });
});
