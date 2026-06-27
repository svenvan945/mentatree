---
name: <skill-slug>
description: Use when <trigger situation>. <What it does in one line>. Distilled from <Book Title> by <Author>.
---

# <Skill Name> — <one-line> (<Book Title>)

<!-- PICK ONE SHAPE, then delete this comment:
     Coach  = asks the user questions one at a time and (optionally) logs a prediction
     Lens   = analyzes the user's reasoning; logs NOTHING
     Reviewer = critiques a thing the user already made -->

## Step 0 — Resolve anything due   (ONLY if this skill logs predictions; otherwise delete)
Run `node "$CLAUDE_PLUGIN_ROOT/lib/ledger.mjs" due`. For each, ask "Did this happen?" and offer
resolve / skip / snooze:
`node "$CLAUDE_PLUGIN_ROOT/lib/ledger.mjs" resolve <id> --outcome yes|no|partial --lesson "<line>"`

## Steps
Write the book's framework as numbered steps, ONE question per step. Every step must ACT on the
user's real input — do not summarize the book. Keep it tight.

## Falsifiability gate + log   (ONLY if this skill makes a prediction; otherwise delete)
The claim must name an observable event checkable by the review date; push back once if not. Then:
`node "$CLAUDE_PLUGIN_ROOT/lib/ledger.mjs" append '{"skill":"<slug>","decision":"<short>","prediction_claim":"<claim>","probability":<0-100>,"review_date":"YYYY-MM-DD","frameworks_used":["<...>"]}'`

## Library rules
- ACT, don't summarize. If it only explains the book, it's not a skill.
- Never reproduce book text — distill the framework in your own words.
- One question at a time.
