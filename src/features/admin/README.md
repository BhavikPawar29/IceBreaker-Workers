# Admin

Will own admin-only APIs after user-facing reads and protected user writes are stable.

## Future routes

- `GET /api/admin/review-lines`
- `POST /api/admin/lines/:id/moderate`
- `PATCH /api/admin/lines/:id/live-metadata`
- `POST /api/admin/users/:uid/ban`
- `DELETE /api/admin/users/:uid/ban`

## Responsibilities

- require verified Firebase user
- verify admin role
- moderate lines
- manage bans
- update live metadata

## Not here

- AI auto-approval
- payments
- public feed reads

