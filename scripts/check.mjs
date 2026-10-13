import fs from "node:fs/promises";
import path from "node:path";
import * as cheerio from "cheerio";
const walk = async (directory) =>
  (
    await Promise.all(
      (await fs.readdir(directory, { withFileTypes: true })).map(
        async (item) =>
          item.isDirectory()
            ? walk(path.join(directory, item.name))
            : path.join(directory, item.name),
      ),
    )
  ).flat();
const files = await walk("dist");
const issues = [];
const warnings = new Set();
for (const file of files.filter((name) => name.endsWith(".html"))) {
  const $ = cheerio.load(await fs.readFile(file, "utf8"));
  if ($("main").length !== 1 || !$("title").text() || $("h1").length < 1)
    issues.push(`${file}: missing document landmarks, title, or heading`);
  for (const route of ["/privacy/", "/accessibility/"])
    if (!$(`footer a[href="${route}"]`).length)
      issues.push(`${file}: missing footer policy link ${route}`);
  for (const script of $("script[src]").toArray())
    if ($(script).attr("src") !== "/assets/site.js")
      issues.push(`${file}: undeclared script ${$(script).attr("src")}`);
  if (
    $("script:not([src])")
      .toArray()
      .some((script) => $(script).attr("type") !== "application/ld+json")
  )
    issues.push(`${file}: undeclared inline executable script`);
  const ids = new Set();
  for (const node of $("[id]").toArray()) {
    const id = $(node).attr("id");
    if (ids.has(id)) issues.push(`${file}: duplicate id ${id}`);
    ids.add(id);
  }
  if (
    $('amp-img,amp-analytics,script[src*="jquery"],script[src*="ampproject"]')
      .length
  )
    issues.push(`${file}: legacy runtime present`);
  for (const el of $(
    "a[href],img[src],source[src],script[src],link[rel=stylesheet]",
  ).toArray()) {
    const ref = $(el).attr("href") || $(el).attr("src");
    if (!ref || /^(https?:|mailto:|tel:|data:|javascript:)/.test(ref)) {
      if (el.tagName === "img" && ref?.startsWith("http:"))
        warnings.add(`Remote HTTP image: ${ref}`);
      continue;
    }
    const pathname = ref.split(/[?#]/)[0];
    if (!pathname) continue;
    let target = path.normalize(
      pathname.startsWith("/")
        ? path.join("dist", decodeURI(pathname))
        : path.join(path.dirname(file), decodeURI(pathname)),
    );
    try {
      const stat = await fs.stat(target);
      if (stat.isDirectory()) await fs.access(path.join(target, "index.html"));
    } catch {
      issues.push(`${file}: missing local target ${ref}`);
    }
  }
}
if (files.some((name) => name.startsWith("dist/Documents/")))
  issues.push("Private Documents included in release");
console.log(
  `${files.filter((name) => name.endsWith(".html")).length} HTML pages checked.`,
);
for (const warning of warnings) console.log(`Warning: ${warning}`);
for (const issue of [...new Set(issues)]) console.error(issue);
if (issues.length) process.exitCode = 1;
