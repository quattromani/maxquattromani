import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";

export const groups = [
  "content",
  "journeys",
  "browsers",
  "accessibility",
  "build",
  "security",
  "privacy",
  "performance",
  "hosting",
  "discovery",
  "forms",
  "alternate_outputs",
  "operations",
  "verification",
];
const requiredIds = [
  "content_review",
  "rights",
  "navigation",
  "browsers",
  "accessibility_review",
  "artifact",
  "dependencies",
  "sensitive_repository_files",
  "security_review",
  "privacy_review",
  "policy_routes",
  "tracking_inventory",
  "performance",
  "https",
  "delivery",
  "discovery",
  "forms",
  "account_transactions",
  "documents_media",
  "localization_offline",
  "recovery",
  "followup",
  "guidance",
  "production_verification",
];
const automatedIds = {
  artifact: "artifact",
  policy_routes: "policies",
  tracking_inventory: "tracking",
};
export async function sourceFingerprint() {
  const files = execFileSync(
    "git",
    ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
    { encoding: "utf8" },
  )
    .split("\0")
    .filter(Boolean);
  const hash = crypto.createHash("sha256");
  for (const file of [...new Set(files)].sort()) {
    if (
      /^(Documents|DAM|node_modules|dist|docs|ops|css|js|_layouts)\//.test(
        file,
      ) ||
      /(^|\/)\.DS_Store$/.test(file)
    )
      continue;
    if (
      !/\.(html|markdown|mjs|js|css|yml|json|jpg|jpeg|png|gif|webp|svg|pdf|mp3|webm|ico)$/.test(
        file,
      ) &&
      !["CNAME", "robots.txt", "LICENSE"].includes(file)
    )
      continue;
    try {
      hash.update(file + "\0");
      hash.update(await fs.readFile(file));
      hash.update("\0");
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
  return hash.digest("hex");
}
export function assessChecks(record, fingerprint, now = new Date()) {
  const errors = [];
  if (
    record.version !== 1 ||
    !record.owner ||
    !record.target ||
    !Array.isArray(record.checks)
  )
    return { errors: ["Launch record is incomplete"], pending: [] };
  for (const group of groups)
    if (
      !record.groups?.includes(group) ||
      !record.checks.some((check) => check.group === group)
    )
      errors.push(`Missing launch category: ${group}`);
  for (const id of requiredIds)
    if (!record.checks.some((check) => check.id === id))
      errors.push(`Missing required check: ${id}`);
  const ids = new Set();
  const pending = [];
  for (const check of record.checks) {
    if (
      !check.id ||
      ids.has(check.id) ||
      !check.title ||
      !groups.includes(check.group)
    )
      errors.push(`Invalid or duplicate check: ${check.id}`);
    ids.add(check.id);
    if (
      !["pass", "fail", "blocked", "not_checked", "not_applicable"].includes(
        check.status,
      )
    )
      errors.push(`Invalid status: ${check.id}`);
    if (check.automated !== automatedIds[check.id])
      errors.push(`Incorrect verification method: ${check.id}`);
    if (check.automated) {
      if (!["artifact", "policies", "tracking"].includes(check.automated))
        errors.push(`Unknown automated check: ${check.id}`);
      continue;
    }
    if (
      check.phase &&
      (check.id !== "production_verification" || check.phase !== "after_deploy")
    )
      errors.push(`Incorrect review phase: ${check.id}`);
    if (
      check.id === "production_verification" &&
      check.phase !== "after_deploy"
    )
      errors.push("Production verification must follow deployment");
    const reviewDate = new Date(check.reviewed_at);
    const age = now - reviewDate;
    const approved = ["pass", "not_applicable"].includes(check.status);
    const current =
      approved &&
      check.source_fingerprint === fingerprint &&
      Number.isFinite(age) &&
      age >= 0 &&
      age <= 30 * 86400000 &&
      !!check.evidence?.trim() &&
      !!(check.owner || record.owner);
    if (!current)
      pending.push({
        ...check,
        effective_status: approved
          ? check.reviewed_at && check.source_fingerprint
            ? "stale"
            : "not_checked"
          : check.status,
      });
  }
  return { errors, pending };
}
