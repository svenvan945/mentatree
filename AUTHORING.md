# Authoring a Mentatree skill

A Mentatree skill turns one decision framework from a book into something an agent can *run* on
a real decision. Copy `templates/SKILL.template.md` to `skills/<slug>/SKILL.md` and fill it in.

## Extract the framework, not the book
For the framework you're encoding, capture:
- **Name** — what it's called.
- **When to use** — the trigger situation (goes in the `description`).
- **Steps** — the procedure, as one-question-at-a-time prompts.
- **Failure modes** — what people get wrong (fold these into the probes).
- **Examples** — concrete, so the agent's questions stay grounded.

## The one hard rule: it must ACT
The bar for this library: a skill acts on the user's real input. Pick a shape —
**Coach** (asks questions), **Lens** (analyzes reasoning, logs nothing), or **Reviewer**
(critiques the user's work). A skill that just recites the book's summary will be rejected.

## If it makes a prediction, feed the spine
Any skill that ends in a forecast/decision should log it with `lib/ledger.mjs append` and resolve
due items at Step 0, so the user's calibration accrues across the whole library. Pure lenses skip it.

## Never reproduce book text
Distill in your own words. Cite the book + author in the `description`. No quotes, no copied passages.
