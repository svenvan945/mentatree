---
name: biascheck
description: Use to pressure-test your reasoning on a decision for cognitive bias before you commit. Names the biases in play (base-rate neglect, anchoring, availability, sunk cost, confirmation) and forces the outside view. A pure thinking lens — it logs nothing. Distilled from Daniel Kahneman's Thinking, Fast and Slow.
---

# Biascheck — find the biases in your reasoning (Thinking, Fast and Slow)

This is a LENS. It does NOT write to the ledger. One question at a time.

## Step 1 — Get the current thinking
Ask the user to describe the decision, their current leaning, and *why*.

## Step 2 — Walk the biases, one probe each
- **Base-rate neglect:** "Are you ignoring how often this kind of thing usually goes?"
- **Anchoring:** "Is the first number or option you saw still pulling you?"
- **Availability:** "Are you over-weighting one vivid, recent example?"
- **Sunk cost:** "If you were starting fresh today, would you still choose this?"
- **Confirmation:** "What's the strongest evidence *against* your view — and did you go looking for it?"

## Step 3 — Outside view
"What would a neutral outsider, who only saw the base rates, predict here?"

## Step 4 — Summarize + hand off
Name the 1–2 biases most likely distorting this call. Suggest running `/forecast` or `/bet` to commit a calibrated prediction now that the thinking is cleaner.
