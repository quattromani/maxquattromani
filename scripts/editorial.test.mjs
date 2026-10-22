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

test("GPR reading editions include published articles only and retain source context", async () => {
  const records = JSON.parse(await fs.readFile('_sources/writing/gpr/provenance.json', 'utf8'));
  assert.equal(records.length, 4);
  const index = cheerio.load(await fs.readFile('dist/writing/index.html', 'utf8'));
  for (const record of records) {
    const metadata = JSON.parse(await fs.readFile(`_sources/writing/gpr/${record.slug}/metadata.json`, 'utf8'));
    assert.equal(metadata.published, true);
    assert.equal(metadata.draft, false);
    const route = `/writing/${record.slug}/`;
    assert.equal(index(`#writing-civic`).closest("section").find(`a[href="${route}"]`).length, 1);
    const $ = cheerio.load(await fs.readFile(`dist${route}index.html`, 'utf8'));
    assert.equal($('main h1').length, 1);
    assert.ok($('main a').toArray().some(a => $(a).attr('href') === record.original));
    assert.match($('main').text(), /Time-sensitive details reflect its original publication date/);
    assert.equal($('main script, main input, main button, main video, main audio').length, 0);
    assert.equal($('main time').attr('datetime'), metadata.publishDate.slice(0, 10));
  }
  assert.doesNotMatch(index('main').text(), /TIF and the Big BUT|Cost Is Personal|How to Choose Comparable Properties/);
  const taxRoll = cheerio.load(await fs.readFile('dist/writing/watch-the-tax-roll-move/index.html', 'utf8'));
  assert.match(taxRoll('main').text(), /Equal movement changes the levy/);
});
