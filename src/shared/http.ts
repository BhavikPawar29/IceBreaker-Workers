export function json(data: unknown, init?: ResponseInit): Response {
  return Response.json(data, init);
}

export function error(status: number, code: string): Response {
  return json(
    {
      ok: false,
      error: code,
    },
    { status },
  );
}

