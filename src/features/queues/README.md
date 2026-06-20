# Queues

Will own queue producers and consumers when background work is needed.

## Future uses

- moderation jobs
- cleanup jobs
- analytics rollups

## Responsibilities

- keep slow work off request paths
- make queue message payloads small and explicit

## Not here

- request routing
- direct UI responses

