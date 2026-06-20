import { livePrompt } from "./features/live/livePrompt";
import { error, json } from "./shared/http";

function notFound(): Response {
  return error(404, "NOT_FOUND");
}

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return json({
        ok: true,
        service: "icebreaker-workers",
        environment: env.ENVIRONMENT,
      });
    }

    if (url.pathname === "/") {
      return json({
        ok: true,
        service: "icebreaker-workers",
        routes: ["/health", "/api/live-prompt"],
      });
    }

    if (url.pathname === "/api/live-prompt") {
      return livePrompt(request, env);
    }

    return notFound();
  },
} satisfies ExportedHandler<Cloudflare.Env>;
