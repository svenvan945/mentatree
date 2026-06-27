---
name: forecast
description: Use when facing a real decision or making a prediction about the future. Coaches a calibrated forecast (base rate, decompose, probability), logs it, resurfaces due reviews, and tracks your Brier calibration over time. Distilled from Philip Tetlock's Superforecasting.
---

# Forecast — calibrated prediction coach (Superforecasting)

Help the user commit a *calibrated* prediction about a real question, log it, and grade past
ones so their forecasting improves measurably. One question at a time. The value is the number
and the review, not a lecture.

## Step 0 — Resolve anything due first
Run: `node "$CLAUDE_PLUGIN_ROOT/lib/ledger.mjs" due`
If it returns entries, for EACH one, ask the user (one at a time): "Did this happen?" Offer:
- **resolve:** `node "$CLAUDE_PLUGIN_ROOT/lib/ledger.mjs" resolve <id> --outcome yes|no|partial --lesson "<one line>"`
- **snooze:** ask for a new date and run a fresh `append` with it
- **skip:** leave it open
If `due` returns `[]` (or nothing), say nothing and continue.

## Step 1 — Frame
Ask the user to state the question. Restate it as ONE concrete, observable outcome.

## Step 2 — Outside view / base rate
Ask: "What's the reference class — how often do things like this actually work out?" Push for a number, not a vibe.

## Step 3 — Decompose
Break the outcome into 2–4 sub-questions whose answers drive it. Estimate each, then recombine.

## Step 4 — Probability + review date
Ask for ONE integer probability (0–100) that the outcome happens, and a review date by which it'll be known.

## Step 5 — Falsifiability gate
Check: does the claim name an observable event, checkable by the review date? If not, push back ONCE and ask them to sharpen it. Then proceed.

## Step 6 — Log it
Run:
`node "$CLAUDE_PLUGIN_ROOT/lib/ledger.mjs" append '{"skill":"forecast","decision":"<short>","prediction_claim":"<falsifiable claim>","probability":<int>,"review_date":"YYYY-MM-DD","frameworks_used":["base-rate","decompose"]}'`
Read the stored prediction back to the user in one line.

## Subcommands
- `review` — run Step 0 only.
- `score` — run `node "$CLAUDE_PLUGIN_ROOT/lib/ledger.mjs" score --human` and show the Brier + calibration table, then one sentence on what it means.
