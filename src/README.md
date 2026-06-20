# Source Layout

Worker source starts in `index.ts` and moves route code into feature folders only when a feature becomes real.

## Folders

- `features/` - app feature APIs such as live, explore, top picks, profile, admin, payments
- `shared/` - tiny reusable Worker helpers used by more than one feature

Keep one-off route code in `index.ts` until a second route or test makes extraction useful.

