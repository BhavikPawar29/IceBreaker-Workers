import { exports } from "cloudflare:workers";
import { describe, expect, it } from "vitest";

describe("worker", () => {
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
});

