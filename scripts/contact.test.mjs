import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";
import * as cheerio from "cheerio";

const script = await fs.readFile("assets/site.js", "utf8");
const html = await fs.readFile("dist/contact/index.html", "utf8");
const $ = cheerio.load(html);
const email = $("#contact-address").attr("value");
function contact(clipboard) {
  const address = {
    value: email,
    focus() {
      this.focused = true;
    },
    select() {
      this.selected = true;
    },
  };
  const topic = {
    selectedOptions: [
      {
        value: "Personal correspondence",
        dataset: { hint: "Introduce yourself." },
      },
    ],
    addEventListener(_, handler) {
      this.change = handler;
    },
  };
  const copy = {
    hidden: true,
    addEventListener(_, handler) {
      this.click = handler;
    },
  };
  const elements = {
    "#contact-address": address,
    "#contact-topic": topic,
    "#contact-topic-help": {},
    "[data-contact-topics]": { hidden: true },
    "[data-contact-email]": {},
    "[data-copy-email]": copy,
    "[data-copy-status]": {},
  };
  vm.runInNewContext(script, {
    document: {
      querySelector: (selector) => elements[selector] || null,
      querySelectorAll: () => [],
    },
    navigator: { clipboard },
  });
  return { elements, address, topic, copy };
}

test("contact retains a working email route before enhancement", () => {
  assert.equal($("form").length, 0);
  assert.ok(
    $("[data-contact-email]")
      .attr("href")
      .startsWith(`mailto:${email}?subject=`),
  );
  assert.ok($("[data-copy-email]").is("[hidden]"));
  assert.ok($("[data-contact-topics]").is("[hidden]"));
  assert.equal($("[data-copy-status]").attr("role"), "status");
  assert.equal($("label[for=contact-topic]").length, 1);
  assert.equal($("label[for=contact-address]").length, 1);
});

test("topic selection prepares a subject without sending or navigating", () => {
  const { elements, topic } = contact();
  topic.selectedOptions = [
    {
      value: "Writing & questions?",
      dataset: { hint: "Include the article link." },
    },
  ];
  topic.change();
  assert.equal(
    elements["[data-contact-email]"].href,
    `mailto:${email}?subject=Writing%20%26%20questions%3F`,
  );
  assert.equal(
    elements["#contact-topic-help"].textContent,
    "Include the article link.",
  );
  assert.equal(elements["[data-contact-topics]"].hidden, false);
});

test("copy reports success only after writing the email address", async () => {
  const copied = [];
  const { elements, copy } = contact({
    writeText: async (value) => copied.push(value),
  });
  await copy.click();
  assert.deepEqual(copied, [email]);
  assert.match(
    elements["[data-copy-status]"].textContent,
    /Email address copied/,
  );
});

test("unavailable or denied clipboard access selects the address for manual copying", async () => {
  for (const clipboard of [
    undefined,
    {
      writeText: async () => {
        throw new Error("Denied");
      },
    },
  ]) {
    const { elements, address, copy } = contact(clipboard);
    await copy.click();
    assert.equal(address.focused, true);
    assert.equal(address.selected, true);
    assert.match(
      elements["[data-copy-status]"].textContent,
      /copy it yourself/,
    );
  }
});

test("recovery pages do not imply a successful submission or enter sitemaps", async () => {
  const sitemap = await fs.readFile("dist/sitemap.xml", "utf8");
  assert.doesNotMatch(sitemap, /thank-you|404\.html|\/preview\//);
  const legacy = cheerio.load(
    await fs.readFile("dist/thank-you/index.html", "utf8"),
  );
  assert.match(
    legacy("main").text(),
    /does not confirm that a message was sent or received/,
  );
  assert.equal(legacy("meta[name=robots]").attr("content"), "noindex, follow");
  for (const route of [
    "404.html",
    "sitemap/index.html",
    "privacy/index.html",
    "accessibility/index.html",
  ]) {
    const page = cheerio.load(await fs.readFile(`dist/${route}`, "utf8"));
    assert.equal(page("main h1").length, 1, route);
  }
});
