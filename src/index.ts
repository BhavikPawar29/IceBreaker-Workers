function json(data: unknown, init?: ResponseInit): Response {
  return Response.json(data, init);
}

function notFound(): Response {
  return json(
    {
      ok: false,
      error: "NOT_FOUND",
    },
    { status: 404 },
  );
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
        routes: ["/health"],
      });
    }

    return notFound();
  },
} satisfies ExportedHandler<Env>;

