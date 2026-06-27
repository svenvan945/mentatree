# Contributing to Mentatree

Add a book's decision skill in three steps.

1. **Fork & branch.**
2. **Add your skill:** copy `templates/SKILL.template.md` to `skills/<slug>/SKILL.md` and fill it
   in. Read `AUTHORING.md` first.
3. **Open a PR.**

## Review checklist (what a maintainer checks)
- [ ] It **acts** on the user's input (Coach / Lens / Reviewer) — not a summary.
- [ ] One question at a time; tight, not a lecture.
- [ ] No reproduced book text; book + author cited in `description`.
- [ ] If it predicts: Step 0 resolves due items, and it logs via `lib/ledger.mjs append`.
- [ ] If it's a pure lens: it logs nothing.
- [ ] `node --test` still passes.

Run the tests before pushing: `npm test`.
