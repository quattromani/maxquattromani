import fs from "node:fs/promises";
import { spawnSync } from "node:child_process";
import yaml from "js-yaml";
import * as cheerio from "cheerio";
import { sourceFingerprint, assessChecks } from "./release-state.mjs";
const strict = process.argv.includes("--strict");
const record = yaml.load(await fs.readFile("ops/launch.yml", "utf8"));
const fingerprint = await sourceFingerprint();
const result = assessChecks(record, fingerprint);
const failures = [...result.errors];
let artifact;
try {
  artifact = JSON.parse(await fs.readFile("dist/release-source.json", "utf8"));
} catch {
  failures.push("Build the website before reviewing readiness.");
}
if (artifact?.fingerprint !== fingerprint)
  failures.push("The website artifact is stale; rebuild it.");
if (artifact?.preview)
  failures.push(
    "Preview artifacts cannot be released; run the ordinary build.",
  );
const check = spawnSync(process.execPath, ["scripts/check.mjs"], {
  stdio: "inherit",
});
if (check.status !== 0) failures.push("Artifact checks failed.");
for (const name of ["privacy", "accessibility"]) {
  try {
    const $ = cheerio.load(
      await fs.readFile(`dist/${name}/index.html`, "utf8"),
    );
    if (
      !$("main").text().includes(record.owner) ||
      !$('a[href^="mailto:"]').length
    )
      failures.push(`${name}: missing owner or feedback contact`);
  } catch {
    failures.push(`${name} page is missing`);
  }
}
const scripts = await fs.readFile("dist/assets/site.js", "utf8").catch(() => {
  failures.push("Delivered script is missing.");
  return "";
});
if (
  /document\.cookie|localStorage|sessionStorage|sendBeacon|google-analytics|googletagmanager|gtag\(/i.test(
    scripts,
  )
)
  failures.push(
    "Tracking/storage code requires privacy review and a revised inventory.",
  );
console.log(
  `\nRelease: ${record.release}\nSource fingerprint: ${fingerprint}\nTarget: ${record.target}`,
);
for (const item of record.checks.filter((item) => item.automated))
  console.log(
    `AUTOMATED ${item.id}: ${failures.length ? "see failures" : "pass"}`,
  );
for (const item of result.pending)
  console.log(
    `${item.phase === "after_deploy" ? "AFTER DEPLOY" : "BEFORE RELEASE"} ${item.effective_status.toUpperCase()} ${item.id}: ${item.title}`,
  );
for (const failure of failures) console.error(`FAIL: ${failure}`);
const blockers = result.pending.filter((item) => item.phase !== "after_deploy");
console.log(
  `\n${blockers.length} unresolved release checks; ${result.pending.filter((item) => item.phase === "after_deploy").length} post-deployment checks.`,
);
if (failures.length || (strict && blockers.length)) process.exitCode = 1;

const rows = record.checks.map((item) => {
  const pending = result.pending.find((check) => check.id === item.id);
  const status = item.automated
    ? failures.length
      ? "Check failures"
      : "Pass"
    : pending
      ? {
          not_checked: "Not checked",
          blocked: "Blocked",
          fail: "Fail",
          stale: "Stale",
        }[pending.effective_status] || pending.effective_status
      : "Pass";
  const evidence = item.automated
    ? `Automated ${item.automated} verification ran for this source fingerprint; see scripts/release.mjs.`
    : item.evidence || "Evidence still required.";
  return `| ${item.title} | ${status} | ${item.owner || record.owner} | ${evidence} |`;
});
await fs.writeFile(
  "docs/launch-status.md",
  `# Launch readiness\n\nGenerated from [the canonical checklist](../ops/launch.yml). Run \`npm run launch:status\` to refresh this view. This snapshot describes the candidate, not the live site's complete readiness.\n\nSource fingerprint: \`${fingerprint}\`\n\n${blockers.length} pre-release checks remain unresolved. Production verification follows deployment.\n\n| Check | Status | Owner | Evidence or next step |\n| --- | --- | --- | --- |\n${rows.join("\n")}\n`,
);
