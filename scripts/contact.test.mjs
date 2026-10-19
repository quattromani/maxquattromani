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
  const copy = {
    hidden: true,
    addEventListener(_, handler) {
      this.click = handler;
    },
  };
  const elements = {
    "#contact-address": address,
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
  return { elements, address, copy };
}

test("contact form has native labels, validation, spam trap, and email fallback", () => {
  assert.equal($("form#contact-form[method=post]").length, 1);
  for (const name of ["name", "email", "subject", "message"]) {
    const field = $(`[name="${name}"]`);
    assert.equal(field.length, 1);
    assert.ok(field.is("[required]"));
    assert.equal($(`label[for="${field.attr("id")}"]`).length, 1);
  }
  assert.equal($("[name=email]").attr("type"), "email");
  assert.ok($("[name=_gotcha]").closest("[hidden]").length);
  assert.equal($("[data-form-status]").attr("role"), "status");
  assert.equal($(`a[href="mailto:${email}"]`).length, 1);
  const enabled = $("#contact-form").attr("data-configured") === "true";
  assert.equal($("#contact-form fieldset").is("[disabled]"), !enabled);
  if (enabled)
    assert.match(
      $("#contact-form").attr("action"),
      /^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/,
    );
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

function submitting({
  configured = true,
  delivery = "ajax",
  valid = true,
  honeypot = "",
  request = async () => ({ ok: true, json: async () => ({ ok: true }) }),
} = {}) {
  const fields = {};
  for (const [name, value] of Object.entries({
    name: " Example Writer ",
    email: "reader@example.com",
    subject: "A piece of writing",
    message: " A question about your article. ",
    _gotcha: honeypot,
  })) {
    fields[name] = {
      value,
      setCustomValidity(value) {
        this.validation = value;
      },
      addEventListener() {},
      setAttribute(key, value) {
        this[key] = value;
      },
      removeAttribute(key) {
        delete this[key];
      },
      focus() {
        this.focused = true;
      },
    };
  }
  const errors = ["name", "email", "message"].map((name) => ({
    dataset: { fieldError: name },
    textContent: "",
  }));
  const fieldset = { disabled: !configured };
  const button = { disabled: !configured, textContent: "Send message" };
  const status = { textContent: "", dataset: {} };
  const nodes = {
    "[data-send-message]": button,
    fieldset,
    "[data-form-status]": status,
  };
  const calls = [];
  const form = {
    action: configured ? "https://formspree.io/f/testfixture" : "",
    dataset: { configured: String(configured), delivery },
    elements: { namedItem: (name) => fields[name] || null },
    querySelector: (selector) => nodes[selector],
    querySelectorAll: () => errors,
    addEventListener(_, callback) {
      this.submit = () => callback({ preventDefault() {} });
    },
    reportValidity: () =>
      valid && !Object.values(fields).some((field) => field.validation),
    setAttribute(key, value) {
      this[key] = value;
    },
    removeAttribute(key) {
      delete this[key];
    },
    reset() {
      this.resets = (this.resets || 0) + 1;
    },
  };
  class Payload {
    constructor() {
      this.values = Object.fromEntries(
        Object.entries(fields).map(([name, field]) => [name, field.value]),
      );
    }
    get(name) {
      return this.values[name];
    }
    set(name, value) {
      this.values[name] = value;
    }
  }
  let deadline;
  const pageEvents = {};
  vm.runInNewContext(script, {
    document: {
      querySelector: (selector) => (selector === "#contact-form" ? form : null),
      querySelectorAll: () => [],
    },
    window: {
      addEventListener: (name, callback) => {
        pageEvents[name] = callback;
      },
    },
    HTMLFormElement: {
      prototype: {
        submit() {
          this.nativeSubmissions = (this.nativeSubmissions || 0) + 1;
        },
      },
    },
    FormData: Payload,
    AbortController,
    setTimeout: (callback) => {
      deadline = callback;
      return 1;
    },
    clearTimeout() {},
    fetch: async (...args) => {
      calls.push(args);
      return request(...args);
    },
  });
  return {
    form,
    fields,
    fieldset,
    button,
    status,
    errors,
    calls,
    expire: () => deadline(),
    pageEvents,
  };
}

test("unconfigured, invalid, blank, and spam-trap submissions never leave the browser", async () => {
  for (const options of [
    { configured: false },
    { valid: false },
    { honeypot: "bot" },
  ]) {
    const fixture = submitting(options);
    await fixture.form.submit();
    assert.equal(fixture.calls.length, 0);
    assert.equal(fixture.form.resets, undefined);
  }
  const blank = submitting();
  blank.fields.message.value = "   ";
  await blank.form.submit();
  assert.equal(blank.calls.length, 0);
});

test("submission locks repeat sends, trims the payload, and resets only after acceptance", async () => {
  let finish;
  const fixture = submitting({
    request: () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  });
  const pending = fixture.form.submit();
  assert.equal(fixture.button.disabled, true);
  assert.equal(fixture.fieldset.disabled, true);
  assert.equal(fixture.form["aria-busy"], "true");
  await fixture.form.submit();
  assert.equal(fixture.calls.length, 1);
  assert.equal(fixture.calls[0][1].body.get("name"), "Example Writer");
  assert.equal(fixture.calls[0][1].credentials, "omit");
  finish({ ok: true, json: async () => ({ ok: true }) });
  await pending;
  assert.equal(fixture.form.resets, 1);
  assert.equal(fixture.button.disabled, false);
  assert.equal(fixture.status.dataset.state, "success");
});

test("rejections and network failures keep the message and restore the controls", async () => {
  for (const request of [
    async () => ({
      ok: false,
      status: 422,
      json: async () => ({
        errors: [{ field: "email", message: "Invalid email" }],
      }),
    }),
    async () => ({ ok: false, status: 429, json: async () => ({}) }),
    async () => {
      throw new Error("Offline");
    },
    async () => ({
      ok: true,
      json: async () => {
        throw new Error("Unexpected HTML");
      },
    }),
  ]) {
    const fixture = submitting({ request });
    await fixture.form.submit();
    assert.equal(fixture.form.resets, undefined);
    assert.equal(
      fixture.fields.message.value,
      " A question about your article. ",
    );
    assert.equal(fixture.button.disabled, false);
    assert.equal(fixture.fieldset.disabled, false);
    assert.equal(fixture.status.dataset.state, "error");
    assert.match(fixture.status.textContent, /still here/);
  }
});

test("timeout aborts the request without claiming delivery or clearing the message", async () => {
  const fixture = submitting({
    request: (_, { signal }) =>
      new Promise((_, reject) =>
        signal.addEventListener("abort", () => reject(new Error("Aborted"))),
      ),
  });
  const pending = fixture.form.submit();
  fixture.expire();
  await pending;
  assert.equal(fixture.form.resets, undefined);
  assert.match(fixture.status.textContent, /couldn’t be confirmed/);
  assert.equal(fixture.button.disabled, false);
});

test("hosted CAPTCHA flow posts natively without disabling payload fields or claiming success", async () => {
  const fixture = submitting({ delivery: "hosted" });
  await fixture.form.submit();
  assert.equal(fixture.form.nativeSubmissions, 1);
  assert.equal(fixture.calls.length, 0);
  assert.equal(fixture.fieldset.disabled, false);
  assert.equal(fixture.button.disabled, true);
  assert.match(fixture.status.textContent, /verification/);
  assert.notEqual(fixture.status.dataset.state, "success");
  await fixture.form.submit();
  assert.equal(fixture.form.nativeSubmissions, 1);
  fixture.pageEvents.pageshow({ persisted: true });
  assert.equal(fixture.button.disabled, false);
  assert.equal(fixture.form.resets, undefined);
});
