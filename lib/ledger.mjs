// lib/ledger.mjs - shared calibration ledger for Mentatree decision skills.
// Zero deps. Append-only JSONL at ~/.decide/ledger.jsonl (override with DECIDE_DIR).
import { readFileSync, existsSync, mkdirSync, appendFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

export function store() {
  const dir = process.env.DECIDE_DIR || join(homedir(), ".decide");
  return { dir, file: join(dir, "ledger.jsonl") };
}

export function ensureStore() {
  const { dir, file } = store();
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  if (!existsSync(file)) writeFileSync(file, "");
}

export function readAll() {
  const { file } = store();
  if (!existsSync(file)) return [];
  const out = [];
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const t = line.trim();
    if (!t) continue;
    try {
      out.push(JSON.parse(t));
    } catch {
      process.stderr.write("warn: skipping corrupt ledger line\n");
    }
  }
  return out;
}

export function todayLocal(d = new Date()) {
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function mintId(now = new Date()) {
  const ts = now.toISOString().replace(/[-:.]/g, "");
  return `${ts}-${Math.random().toString(36).slice(2, 8)}`;
}

export function appendEntry(obj, now = new Date()) {
  const claim = typeof obj.prediction_claim === "string" ? obj.prediction_claim.trim() : "";
  if (!claim) throw new Error("prediction_claim is required");
  const p = obj.probability;
  if (!Number.isInteger(p) || p < 0 || p > 100) throw new Error("probability must be an integer 0-100");
  ensureStore();
  const rec = {
    id: mintId(now),
    created: now.toISOString(),
    skill: obj.skill || null,
    decision: obj.decision || null,
    alternatives: obj.alternatives || null,
    prediction_claim: claim,
    probability: p,
    review_date: obj.review_date || null,
    frameworks_used: Array.isArray(obj.frameworks_used) ? obj.frameworks_used : [],
    status: "open",
    resolved_date: null,
    outcome: null,
    lesson: null,
  };
  appendFileSync(store().file, JSON.stringify(rec) + "\n");
  return rec;
}

export function listDue(dateStr = todayLocal()) {
  return readAll().filter((e) => e.status === "open" && e.review_date && e.review_date <= dateStr);
}

export function resolveEntry(id, outcome, lesson = "", now = new Date()) {
  if (!["yes", "no", "partial"].includes(outcome)) throw new Error("outcome must be yes|no|partial");
  const all = readAll();
  const idx = all.findIndex((e) => e.id === id);
  if (idx === -1) throw new Error(`no entry with id ${id}`);
  all[idx] = { ...all[idx], status: "resolved", resolved_date: todayLocal(now), outcome, lesson: lesson || null };
  writeFileSync(store().file, all.map((e) => JSON.stringify(e)).join("\n") + (all.length ? "\n" : ""));
  return all[idx];
}

export function scoreAll() {
  const all = readAll();
  const open = all.filter((e) => e.status === "open").length;
  const resolved = all.filter((e) => e.status === "resolved");
  if (resolved.length === 0) {
    return { resolved: 0, open, message: `${open} open, 0 resolved - no score yet` };
  }
  const scored = resolved.filter((e) => e.outcome === "yes" || e.outcome === "no");
  const partial = resolved.filter((e) => e.outcome === "partial").length;
  let brier = null;
  if (scored.length) {
    const sum = scored.reduce((s, e) => {
      const p = e.probability / 100;
      const o = e.outcome === "yes" ? 1 : 0;
      return s + (p - o) ** 2;
    }, 0);
    brier = sum / scored.length;
  }
  const buckets = Array.from({ length: 10 }, (_, i) => ({ lo: i * 10, hi: i * 10 + 10, total: 0, yes: 0 }));
  for (const e of scored) {
    let b = Math.floor(e.probability / 10);
    if (b > 9) b = 9; // 100% -> [90-100]
    buckets[b].total++;
    if (e.outcome === "yes") buckets[b].yes++;
  }
  return { resolved: resolved.length, scored: scored.length, partial, brier, buckets: buckets.filter((b) => b.total) };
}

export function listEntries(status = "open") {
  const all = readAll();
  return status === "all" ? all : all.filter((e) => e.status === status);
}

function getFlag(args, name) {
  const i = args.indexOf(name);
  return i >= 0 && i + 1 < args.length ? args[i + 1] : null;
}

function toHuman(cmd, obj) {
  if (cmd === "score") {
    if (obj.message) return obj.message + "\n";
    let s = `Brier: ${obj.brier == null ? "n/a" : obj.brier.toFixed(3)}  (resolved ${obj.resolved}, scored ${obj.scored}, partial ${obj.partial})\n`;
    for (const b of obj.buckets) s += `  [${b.lo}-${b.hi}): ${b.yes}/${b.total} came true\n`;
    return s;
  }
  if (Array.isArray(obj)) {
    if (!obj.length) return "(none)\n";
    return obj.map((e) => `${e.id}  p=${e.probability}%  due=${e.review_date ?? "-"}  ${e.prediction_claim}`).join("\n") + "\n";
  }
  return JSON.stringify(obj, null, 2) + "\n";
}

export function main(argv) {
  const cmd = argv[0];
  const human = argv.includes("--human");
  const out = (obj) => process.stdout.write(human ? toHuman(cmd, obj) : JSON.stringify(obj) + "\n");
  switch (cmd) {
    case "append": out(appendEntry(JSON.parse(argv[1]))); break;
    case "due": out(listDue(getFlag(argv, "--date") || undefined)); break;
    case "resolve": out(resolveEntry(argv[1], getFlag(argv, "--outcome"), getFlag(argv, "--lesson") || "")); break;
    case "score": out(scoreAll()); break;
    case "list": out(listEntries(getFlag(argv, "--status") || "open")); break;
    default: process.stderr.write(`unknown command: ${cmd}\n`); process.exitCode = 1;
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    main(process.argv.slice(2));
  } catch (e) {
    process.stderr.write(`error: ${e.message}\n`);
    process.exitCode = 1;
  }
}
