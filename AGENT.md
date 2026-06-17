# AGENT.md

## Purpose

This repo owns Cloudflare Worker code for IceBreaker.

## Rules

- Keep Firebase Auth as the login system.
- Public read APIs move first.
- Worker verifies auth tokens for protected routes later.
- No secrets in source control.
- No broad abstractions before a second real endpoint needs them.

## First migration order

1. health
2. live
3. explore
4. top picks
5. profile

## Definition of done

- `npm run ci` passes
- deploy dry run passes
- route has one test

