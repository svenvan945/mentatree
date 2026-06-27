# Mentatree

A library of **decision-making skills distilled from books**, for Claude Code — with a shared
calibration loop so you find out whether your predictions actually come true.

Read a book, turn its decision method into a skill you can *invoke* on real choices. Skills that
make a prediction feed one local ledger (`~/.decide/ledger.jsonl`); over time, `/forecast score`
shows your Brier score and calibration — are your 70%s really 70%?

## Install

```
/plugin marketplace add svenvan945/mentatree
/plugin install mentatree
```

## Skills (v0)

| Skill | Book | What it does |
|---|---|---|
| `/forecast` | Superforecasting (Tetlock) | Calibrated prediction coach; owns the review + Brier loop |
| `/bet` | Thinking in Bets (Duke) | Reframe a decision as a bet; logs a prediction |
| `/biascheck` | Thinking, Fast and Slow (Kahneman) | Names the biases in play (pure lens, logs nothing) |
| `/wrap` | Decisive (Heath) | The WRAP process for consequential either/or calls |

## The calibration loop

`/forecast` (or `/bet`, `/wrap`) logs a prediction with a probability + review date. On later
runs it resurfaces due predictions for you to grade. `/forecast score` computes your Brier score
and a decile calibration table.

## Contributing

Add your favorite book's decision framework — see `CONTRIBUTING.md` and `AUTHORING.md`.

## License

MIT.
