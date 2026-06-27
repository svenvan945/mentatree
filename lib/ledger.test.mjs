import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  store, ensureStore, readAll, todayLocal,
  appendEntry, listDue, resolveEntry, scoreAll, listEntries,
} from "./ledger.mjs";

function fresh() {
  process.env.DECIDE_DIR = mkdtempSync(join(tmpdir(), "decide-test-"));
}

// --- helpers (Task 2) ---
test("readAll returns [] when the file does not exist", () => {
  fresh();
  assert.deepEqual(readAll(), []);
});

test("ensureStore creates the dir and an empty file", () => {
  fresh();
  ensureStore();
  assert.ok(existsSync(store().file));
  assert.deepEqual(readAll(), []);
});

test("readAll skips corrupt lines and keeps good ones", () => {
  fresh();
  ensureStore();
  writeFileSync(store().file, '{"id":"a","status":"open"}\nNOT JSON\n{"id":"b","status":"open"}\n');
  const all = readAll();
  assert.equal(all.length, 2);
  assert.deepEqual(all.map((e) => e.id), ["a", "b"]);
});

test("todayLocal formats local date as YYYY-MM-DD", () => {
  assert.equal(todayLocal(new Date(2026, 6, 9)), "2026-07-09"); // month is 0-based
});

// --- append (Task 3) ---
test("appendEntry stores an open record with a minted id", () => {
  fresh();
  const rec = appendEntry({ skill: "forecast", prediction_claim: "X ships", probability: 70, review_date: "2026-07-10" });
  assert.match(rec.id, /^\d{8}T\d{6}\d{0,3}Z-[a-z0-9]{1,6}$/);
  assert.equal(rec.status, "open");
  assert.equal(rec.probability, 70);
  assert.equal(rec.outcome, null);
  assert.equal(readAll().length, 1);
});

test("appendEntry allows a null review_date (undated)", () => {
  fresh();
  const rec = appendEntry({ prediction_claim: "vague", probability: 50 });
  assert.equal(rec.review_date, null);
});

test("appendEntry rejects a non-integer or out-of-range probability", () => {
  fresh();
  assert.throws(() => appendEntry({ prediction_claim: "x", probability: 150 }), /probability/);
  assert.throws(() => appendEntry({ prediction_claim: "x", probability: 1.5 }), /probability/);
});

test("appendEntry rejects an empty claim", () => {
  fresh();
  assert.throws(() => appendEntry({ prediction_claim: "  ", probability: 50 }), /prediction_claim/);
});

// --- due (Task 4) ---
test("listDue returns open entries with review_date <= the given date", () => {
  fresh();
  appendEntry({ prediction_claim: "past", probability: 60, review_date: "2026-01-01" });
  appendEntry({ prediction_claim: "future", probability: 60, review_date: "2099-01-01" });
  const due = listDue("2026-06-27");
  assert.equal(due.length, 1);
  assert.equal(due[0].prediction_claim, "past");
});

test("listDue excludes undated and resolved entries", () => {
  fresh();
  appendEntry({ prediction_claim: "undated", probability: 50 }); // null review_date
  const dated = appendEntry({ prediction_claim: "dated", probability: 50, review_date: "2026-01-01" });
  writeFileSync(store().file, JSON.stringify({ ...dated, status: "resolved" }) + "\n");
  assert.equal(listDue("2026-06-27").length, 0);
});

// --- resolve (Task 5) ---
test("resolveEntry marks an entry resolved with outcome + lesson", () => {
  fresh();
  const rec = appendEntry({ prediction_claim: "x", probability: 70, review_date: "2026-01-01" });
  const out = resolveEntry(rec.id, "yes", "learned a thing", new Date(2026, 0, 2));
  assert.equal(out.status, "resolved");
  assert.equal(out.outcome, "yes");
  assert.equal(out.resolved_date, "2026-01-02");
  assert.equal(out.lesson, "learned a thing");
  assert.equal(readAll()[0].status, "resolved");
});

test("resolveEntry rejects a bad outcome and an unknown id", () => {
  fresh();
  const rec = appendEntry({ prediction_claim: "x", probability: 70, review_date: "2026-01-01" });
  assert.throws(() => resolveEntry(rec.id, "maybe", ""), /outcome/);
  assert.throws(() => resolveEntry("nope", "yes", ""), /no entry/);
});

// --- score (Task 6) ---
function resolved(claim, prob, outcome) {
  const r = appendEntry({ prediction_claim: claim, probability: prob, review_date: "2026-01-01" });
  return resolveEntry(r.id, outcome, "");
}

test("scoreAll reports the no-score message when nothing is resolved", () => {
  fresh();
  appendEntry({ prediction_claim: "open one", probability: 50, review_date: "2099-01-01" });
  const s = scoreAll();
  assert.equal(s.resolved, 0);
  assert.equal(s.message, "1 open, 0 resolved - no score yet");
});

test("scoreAll computes Brier over yes/no and excludes partial", () => {
  fresh();
  resolved("a", 80, "yes"); // (0.8-1)^2 = 0.04
  resolved("b", 30, "no"); // (0.3-0)^2 = 0.09
  resolved("c", 50, "partial"); // excluded from Brier
  const s = scoreAll();
  assert.equal(s.resolved, 3);
  assert.equal(s.scored, 2);
  assert.equal(s.partial, 1);
  assert.ok(Math.abs(s.brier - 0.065) < 1e-9);
});

test("scoreAll buckets by decile; 100% lands in [90-100]", () => {
  fresh();
  resolved("a", 70, "yes");
  resolved("b", 100, "yes");
  const s = scoreAll();
  const b70 = s.buckets.find((b) => b.lo === 70);
  const b90 = s.buckets.find((b) => b.lo === 90);
  assert.equal(b70.total, 1);
  assert.equal(b90.total, 1); // 100 -> last bucket
});

// --- list (Task 7) ---
test("listEntries filters by status (default open)", () => {
  fresh();
  const a = appendEntry({ prediction_claim: "a", probability: 50, review_date: "2026-01-01" });
  appendEntry({ prediction_claim: "b", probability: 50, review_date: "2026-01-01" });
  resolveEntry(a.id, "yes", "");
  assert.equal(listEntries("open").length, 1);
  assert.equal(listEntries("resolved").length, 1);
  assert.equal(listEntries("all").length, 2);
});
