import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import yaml from "js-yaml";
import { assessChecks } from "./release-state.mjs";
const seed = yaml.load(await fs.readFile("ops/launch.yml", "utf8"));
const now = new Date("2026-10-13T18:00:00Z");
const approved = () => ({
  ...structuredClone(seed),
  checks: seed.checks.map((check) => ({
    ...check,
    status: "pass",
    owner: "Max Quattromani",
    evidence: "Verified the candidate in the documented environment.",
    reviewed_at: "2026-10-13",
    source_fingerprint: "current",
  })),
});
test("current evidence clears the manual checklist", () =>
  assert.equal(assessChecks(approved(), "current", now).pending.length, 0));
test("a change invalidates manual approvals", () =>
  assert.ok(
    assessChecks(approved(), "changed", now).pending.some(
      (check) =>
        check.id === "privacy_review" && check.effective_status === "stale",
    ),
  ));
test("a pass without evidence or a review date remains unresolved", () => {
  const record = approved();
  delete record.checks[0].evidence;
  delete record.checks[1].reviewed_at;
  assert.equal(assessChecks(record, "current", now).pending.length, 2);
});
test("not-applicable decisions require current evidence too", () => {
  const record = approved();
  const check = record.checks.find(
    (check) => check.id === "account_transactions",
  );
  check.status = "not_applicable";
  delete check.source_fingerprint;
  assert.ok(
    assessChecks(record, "current", now).pending.some(
      (item) => item.id === check.id,
    ),
  );
});
test("old or future reviews cannot clear a release", () => {
  const record = approved();
  record.checks[0].reviewed_at = "2026-08-01";
  record.checks[1].reviewed_at = "2026-12-01";
  assert.equal(assessChecks(record, "current", now).pending.length, 2);
});
test("required checks cannot silently disappear", () => {
  const record = approved();
  record.checks = record.checks.filter((check) => check.id !== "https");
  assert.ok(
    assessChecks(record, "current", now).errors.some((error) =>
      error.includes("https"),
    ),
  );
});
test("manual reviews cannot be converted to automated passes", () => {
  const record = approved();
  record.checks[0].automated = "artifact";
  assert.ok(assessChecks(record, "current", now).errors.length);
});
test("duplicate IDs and missing categories are errors", () => {
  const record = approved();
  record.checks.push({ ...record.checks[0] });
  record.groups.pop();
  assert.ok(assessChecks(record, "current", now).errors.length >= 2);
});

test("pre-release checks cannot be moved past deployment", () => {
  const record = approved();
  record.checks.find((check) => check.id === "https").phase = "after_deploy";
  assert.ok(
    assessChecks(record, "current", now).errors.some((error) =>
      error.includes("phase"),
    ),
  );
});
