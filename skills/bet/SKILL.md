---
name: bet
description: Use when a decision feels emotional, high-stakes, or you're judging it by its outcome. Reframes it as a bet (odds, stake, "how sure?") and separates decision quality from luck (resulting), then logs a calibrated prediction. Distilled from Annie Duke's Thinking in Bets.
---

# Bet — reframe a decision as a wager (Thinking in Bets)

One question at a time. The point is an honest probability and clean thinking, not a pep talk.

## Step 0 — Resolve anything due
Run `node "$CLAUDE_PLUGIN_ROOT/lib/ledger.mjs" due`. For each entry, ask "Did this happen?" and offer resolve / skip / snooze (see resolve command below). If none, continue silently.
- resolve: `node "$CLAUDE_PLUGIN_ROOT/lib/ledger.mjs" resolve <id> --outcome yes|no|partial --lesson "<one line>"`

## Step 1 — The decision and the alternatives
Ask for the decision and the real alternatives, including doing nothing.

## Step 2 — Frame it as a bet
For the leading option: "What are you betting will happen? Payoff if you're right, cost if you're wrong?"

## Step 3 — How sure?
"On a 0–100 scale, how confident are you it plays out that way?" Get one integer.

## Step 4 — Resulting check
"If this turns out badly, would that *prove* the decision was wrong — or could it be a good bet that lost?" Separate process from outcome.

## Step 5 — Falsifiability gate
Claim must name an observable event checkable by a review date. Push back once if not.

## Step 6 — Log it
`node "$CLAUDE_PLUGIN_ROOT/lib/ledger.mjs" append '{"skill":"bet","decision":"<short>","prediction_claim":"<falsifiable claim>","probability":<int>,"review_date":"YYYY-MM-DD","frameworks_used":["bet-framing","resulting"]}'`
Read it back in one line.
