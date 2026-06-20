# Live

Owns the live conversation prompt API.

## Current route

- `GET /api/live-prompt?pack=playful&situation=date`

## Responsibilities

- validate `pack` and `situation`
- read approved lines
- fall back to `situation=any`
- fall back to legacy approved lines
- return one minimal prompt payload

## Not here

- voting
- profile data
- admin moderation
- AI generation

