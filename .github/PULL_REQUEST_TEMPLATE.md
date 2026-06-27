<!-- See CONTRIBUTING.md and AUTHORING.md before opening this PR. -->

## What this adds

<!-- e.g. "A /barbell skill from Antifragile" — name the book + the framework. -->

## Checklist

- [ ] It **acts** on the user's input (Coach / Lens / Reviewer) — not a summary
- [ ] One question at a time; tight, not a lecture
- [ ] No reproduced book text; book + author cited in the skill's `description`
- [ ] If it makes a prediction: Step 0 resolves due items, and it logs via `lib/ledger.mjs append`
- [ ] If it's a pure lens: it logs nothing
- [ ] `node --test` passes locally
