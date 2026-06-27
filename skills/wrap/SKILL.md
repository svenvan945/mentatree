---
name: wrap
description: Use for a consequential either/or decision you keep going back and forth on. Runs the Heath brothers' WRAP process (Widen options, Reality-test assumptions, Attain distance, Prepare to be wrong) and optionally logs a calibrated prediction. Distilled from Decisive by Chip & Dan Heath.
---

# WRAP — a process for consequential decisions (Decisive)

One question at a time.

## Step 0 — Resolve anything due
Run `node "$CLAUDE_PLUGIN_ROOT/lib/ledger.mjs" due`. For each, ask "Did this happen?" and offer
resolve / skip / snooze: `node "$CLAUDE_PLUGIN_ROOT/lib/ledger.mjs" resolve <id> --outcome yes|no|partial --lesson "<line>"`.

## W — Widen options
"You've framed this as X-or-Y. What's a third option? What would you do if both were forbidden?"

## R — Reality-test assumptions
"What's the one assumption that, if wrong, breaks this decision? How could you cheaply test it before committing?"

## A — Attain distance
"What would you tell your best friend to do here? What will you care about in 10 minutes / 10 months / 10 years?"

## P — Prepare to be wrong
Premortem: "It's the review date and this decision failed. What happened?" Set a tripwire that would tell you to change course.

## Falsifiability gate + log (optional)
If the user lands on a decision with a checkable outcome, run the falsifiability gate (observable
event + review date; push back once), then:
`node "$CLAUDE_PLUGIN_ROOT/lib/ledger.mjs" append '{"skill":"wrap","decision":"<short>","prediction_claim":"<claim>","probability":<0-100>,"review_date":"YYYY-MM-DD","frameworks_used":["WRAP"]}'`
