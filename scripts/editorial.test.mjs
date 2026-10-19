import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import * as cheerio from "cheerio";

test("current biography avoids recruiting copy and premature officeholding", async () => {
  for (const route of ["index.html", "about/index.html", "resume/index.html"]) {
    const html = await fs.readFile(`dist/${route}`, "utf8");
    const text = cheerio.load(html)("main").text();
    assert.doesNotMatch(
      text,
      /open to new opportunities|looking for opportunities|industry-recognized|widely adopted|assessor-elect|assessor-apparent/i,
    );
  }
  const home = await fs.readFile("dist/index.html", "utf8");
  assert.match(home, /candidate for Gage County Assessor/);
  assert.match(home, /subject to the election result/);
});

test("retired resources retain destinations without presenting obsolete instructions", async () => {
  const html = await fs.readFile("dist/ADA/index.html", "utf8");
  const $ = cheerio.load(html);
  assert.equal($("meta[name=robots]").attr("content"), "noindex, follow");
  assert.match($("main").text(), /no longer maintained/);
  const sitemap = await fs.readFile("dist/sitemap.xml", "utf8");
  assert.doesNotMatch(sitemap, /\/ADA\/|\/styleguide\//);
  await assert.rejects(fs.access("dist/resume/Max_Quattromani_resume.pdf"));
});

test("historical writing retains dates and context", async () => {
  const html = await fs.readFile(
    "dist/atomic-design-and-development/index.html",
    "utf8",
  );
  const $ = cheerio.load(html);
  assert.ok($("main time[datetime]").length);
  assert.match($("main").text(), /historical writing, originally published/);
});
