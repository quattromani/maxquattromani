import fs from "node:fs/promises";
import path from "node:path";
import yaml from "js-yaml";
import { Liquid } from "liquidjs";
import MarkdownIt from "markdown-it";
import * as cheerio from "cheerio";

const root = process.cwd();
const out = path.join(root, "dist");
const engine = new Liquid({
  root: path.join(root, "_includes"),
  extname: "",
  jekyllInclude: true,
});
const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
engine.registerFilter("date_to_string", formatDate);
engine.registerTag("highlight", {
  parse(tag, tokens) {
    this.tokens = [];
    this.language = tag.args.trim().split(" ")[0];
    while (tokens.length) {
      const token = tokens.shift();
      if (token.name === "endhighlight") return;
      this.tokens.push(token);
    }
    throw new Error("Unclosed highlight block");
  },
  render() {
    return `<pre><code class="language-${escape(this.language)}">${escape(this.tokens.map((token) => token.getText()).join(""))}</code></pre>`;
  },
});
const md = new MarkdownIt({ html: true, linkify: true });
const split = (text) => {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  return match
    ? { meta: yaml.load(match[1]) || {}, body: text.slice(match[0].length) }
    : null;
};
const escape = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
const walk = async (dir) =>
  (
    await Promise.all(
      (await fs.readdir(dir, { withFileTypes: true }))
        .filter(
          (item) =>
            !item.name.startsWith(".") &&
            ![
              "node_modules",
              "dist",
              "Documents",
              "DAM",
              "scripts",
              "docs",
              "assets",
              "css",
              "js",
              "images",
              "_layouts",
              "_data",
              "_includes",
            ].includes(item.name),
        )
        .map(async (item) =>
          item.isDirectory()
            ? walk(path.join(dir, item.name))
            : path.join(dir, item.name),
        ),
    )
  ).flat();
const data = {};
for (const name of await fs.readdir("_data"))
  if (/\.ya?ml$/.test(name))
    data[name.replace(/\.ya?ml$/, "")] = yaml.load(
      await fs.readFile(`_data/${name}`, "utf8"),
    );
const config = yaml.load(await fs.readFile("_config.yml", "utf8"));
const files = await walk(root);
const pages = [];
for (const file of files.filter((file) => /\.(html|markdown|md)$/.test(file))) {
  const text = await fs.readFile(file, "utf8");
  let source = split(text);
  if (!source && file.endsWith("amp/index.html")) {
    const $ = cheerio.load(text);
    source = {
      meta: { title: $("title").text(), class: "amp" },
      body: $("body").html(),
    };
  }
  if (!source) continue;
  const relative = path.relative(root, file);
  const post = relative.startsWith("_posts/");
  const slug = path
    .basename(file)
    .replace(/^\d{4}-\d{2}-\d{2}-/, "")
    .replace(/\.(markdown|md)$/, "");
  const url = post
    ? "/" +
      (source.meta.permalink || slug)
        .replace(/^\//, "")
        .replace(":title", slug)
        .replace(/\/$/, "") +
      "/"
    : relative === "index.html"
      ? "/"
      : "/" + relative.replace(/index\.html$/, "");
  pages.push({
    ...source,
    post,
    file,
    relative,
    url,
    date: post ? path.basename(file).slice(0, 10) : undefined,
  });
}
const posts = pages
  .filter((page) => page.post)
  .sort((a, b) => b.date.localeCompare(a.date))
  .map((page) => ({ ...page.meta, url: page.url, date: page.date }));
const site = {
  ...config,
  data,
  posts,
  pages: pages
    .filter((page) => !page.post)
    .map((page) => ({ ...page.meta, url: page.url })),
};

// Discard legacy presentation and runtime dependencies while preserving source prose.
function normalize(html, page) {
  const $ = cheerio.load(html, {}, false);
  $("script, style, link, amp-analytics").remove();
  $("main").each((_, node) => $(node).replaceWith($(node).contents()));
  $("video")
    .attr("poster", "/styleguide/assets/videos/big-buck-bunny_poster.jpg")
    .find("source")
    .remove();
  $("video").append(
    '<source src="/styleguide/assets/videos/big_buck_bunny.webm" type="video/webm">',
  );
  $('object[type="application/x-shockwave-flash"]').remove();
  $("*")
    .contents()
    .filter((_, node) => node.type === "comment")
    .remove();
  $(".accordion > ul > li").each((_, node) => {
    const el = $(node);
    const heading = el.children("h6").first();
    const children = el.children("ul");
    if (children.length)
      el.replaceWith(
        $("<details></details>")
          .append($("<summary></summary>").html(heading.html()))
          .append(children),
      );
  });
  $(".modal-container").each((_, node) => {
    const el = $(node);
    const dialog = $("<dialog></dialog>").attr("id", el.attr("id"));
    const heading = el
      .find("h3")
      .first()
      .attr("id", el.attr("id") + "-title");
    dialog.attr("aria-labelledby", heading.attr("id"));
    dialog
      .append(heading)
      .append(el.find(".modal-body").first())
      .append(
        '<button type="button" data-close-dialog aria-label="Close modal">×</button>',
      );
    el.closest(".modal").replaceWith(dialog);
  });
  $(".modal-button").each((_, node) => {
    const el = $(node);
    el.attr(
      "data-open-dialog",
      el.attr("arial-controls") || "modal" + el.attr("id"),
    );
    el.removeAttr("arial-controls");
  });
  $("a[href]").each((_, node) => {
    const link = $(node);
    const href = link.attr("href");
    if (href === "writing") link.attr("href", "/writing/");
    if (href?.startsWith("quattromani.github.io/"))
      link.attr("href", "https://" + href);
    if (href === "/css/ui/2014/11/30/prototyping/")
      link.attr("href", "/prototyping/");
    if (
      page.relative.startsWith("patterns/") &&
      href === path.basename(path.dirname(page.relative))
    )
      link.attr("href", page.url);
  });
  $("amp-img").each((_, node) => {
    const el = $(node);
    const image = $("<img>");
    for (const key of ["src", "alt", "width", "height"])
      if (el.attr(key)) image.attr(key, el.attr(key));
    image.attr("loading", "lazy");
    el.replaceWith(image);
  });
  $("amp-youtube").each((_, node) =>
    $(node).replaceWith(
      `<a href="https://www.youtube.com/watch?v=${escape($(node).attr("data-videoid"))}">YouTube</a>`,
    ),
  );
  $("span.h2").each((_, node) => {
    const el = $(node);
    const heading = $("<h2></h2>").html(el.html());
    if (el.attr("id")) heading.attr("id", el.attr("id"));
    el.replaceWith(heading);
  });
  $("*").each((_, node) => {
    const el = $(node);
    for (const key of Object.keys(node.attribs || {}))
      if (
        ["class", "style", "role", "tabindex", "layout", "on"].includes(key) ||
        key.startsWith("on")
      )
        el.removeAttr(key);
    if (el.attr("src")?.startsWith("http://"))
      el.attr("src", el.attr("src").replace("http://", "https://"));
    if (el.attr("target") === "_blank") el.attr("rel", "noopener noreferrer");
  });
  // Browser-native disclosures replace obsolete accordion wrappers.
  $("input[type=checkbox]")
    .filter((_, node) =>
      /accordion|modal|offcanvas/.test($(node).attr("id") || ""),
    )
    .each((_, node) => $(node).remove());
  const ids = new Set();
  $("[id]").each((_, node) => {
    const el = $(node);
    const id = el.attr("id");
    if (ids.has(id)) el.removeAttr("id");
    else ids.add(id);
  });
  return $.html();
}
const nav = [
  ["About Me", "/about/"],
  ["Resume", "/resume/"],
  ["Writing", "/writing/"],
  ["Sites", "/sites/"],
  ["Contact", "/contact/"],
];
const resources = [
  ["Style Guide", "/styleguide/"],
  ["Email Guidelines", "/email/"],
  ["SDLC", "/SDLC/"],
  ["Reading", "/reading/"],
];
const links = (items, url) =>
  items
    .map(
      ([label, href]) =>
        `<a href="${href}"${url === href ? ' aria-current="page"' : ""}>${label}</a>`,
    )
    .join("");
const articleList = () =>
  `<ol class="article-list">${posts.map((post, index) => `<li><span class="article-number">${String(index + 1).padStart(2, "0")}</span><a href="${post.url}">${escape(post.title)}</a><time datetime="${post.date}">${formatDate(post.date)}</time><span aria-hidden="true">↗</span></li>`).join("")}</ol>`;
function shell(page, body) {
  const title = page.meta.title || site.title;
  const cleanTitle = cheerio.load(String(title), {}, false).text();
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(cleanTitle)} | Max Quattromani</title><meta name="description" content="${escape(page.meta.description || "")}"><link rel="canonical" href="${site.url}${page.url}"><link rel="icon" href="/favicon.ico"><link rel="stylesheet" href="/assets/site.css"><script src="/assets/site.js" defer></script></head><body><a class="skip-link" href="#content">Skip to main content</a><header class="site-header"><a class="wordmark" href="/" aria-label="Max Quattromani home">mq<span aria-hidden="true">.</span></a><button class="menu-button" aria-expanded="false" aria-controls="primary-nav" hidden>Menu</button><nav id="primary-nav" aria-label="Main navigation">${links(nav, page.url)}</nav></header><main id="content" class="${page.url === "/" ? "home" : "inner-page"}">${body}</main><footer class="site-footer"><div class="footer-top"><a class="footer-name" href="/">Max<br>Quattromani<span>.</span></a><nav aria-label="Resources">${links(resources, page.url)}</nav><nav aria-label="Social links"><a href="https://github.com/quattromani">Github ↗</a><a href="http://codepen.io/quattromani/">Codepen ↗</a><a href="https://dribbble.com/maxquattromani">Dribbble ↗</a></nav></div><div class="footer-bottom"><span>Copyright Me. Everything. Every year, forever.</span><a href="/sitemap/">Sitemap</a></div></footer></body></html>`;
}
await fs.rm(out, { recursive: true, force: true });
await fs.mkdir(out, { recursive: true });
for (const name of [
  "images",
  "assets",
  "favicon.ico",
  "apple-touch-icon.png",
  "CNAME",
  "robots.txt",
  "resume/Max_Quattromani_resume.pdf",
  "styleguide/assets",
  "sandbox/image-overlay/images",
  "amp/education.jpg",
  "humans.txt",
]) {
  try {
    await fs.mkdir(path.dirname(path.join(out, name)), { recursive: true });
    await fs.cp(name, path.join(out, name), { recursive: true });
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}
for (const page of pages) {
  let rendered = await engine.parseAndRender(page.body, {
    site,
    page: { ...page.meta, url: page.url, date: page.date, path: page.relative },
    post: page.meta,
  });
  if (page.post) rendered = md.render(rendered);
  let body = normalize(rendered, page);
  const textOf = (nodes) =>
    nodes
      .map((node) =>
        node.type === "text" ? node.data : textOf(node.children || []),
      )
      .join(" ");
  const originalContent = textOf(
    cheerio.load(body, {}, false).root().contents().toArray(),
  );
  if (page.url === "/") {
    const $ = cheerio.load(body, {}, false);
    body = `<section class="hero"><p class="eyebrow">Digital Strategist • Marketing Leader • Front-End Architect</p><h1>Max<br>Quattromani<span>.</span></h1><div class="hero-bottom"><p>${$("h3").first().html()}</p><a class="text-link" href="/about/">About Me <span aria-hidden="true">↗</span></a></div></section><section class="profile-section"><div class="section-label"><span aria-hidden="true">01 /</span><h2>${page.meta.title}</h2></div><div class="profile-copy">${$("p").first().html()}</div></section><section class="writing-section"><div class="section-label"><span aria-hidden="true">02 /</span><h2>Articles</h2></div>${articleList()}</section>`;
  } else if (page.url === "/writing/") {
    body = `<header class="page-heading"><p class="eyebrow">Max Quattromani</p><h1>Writing<span>.</span></h1></header><div class="prose">${cheerio.load(body, {}, false)("img").toString()}</div>${articleList()}`;
  } else {
    const $ = cheerio.load(body, {}, false);
    const heading = $("h1").first();
    if (
      heading.length &&
      !page.post &&
      heading.text().trim() ===
        cheerio
          .load(String(page.meta.title || ""), {}, false)
          .text()
          .trim()
    )
      heading.remove();
    $("h1").each((_, node) => {
      const el = $(node);
      el.replaceWith($("<h2></h2>").attr("id", el.attr("id")).html(el.html()));
    });
    body = `<header class="page-heading"><p class="eyebrow">${page.post ? "Articles" : "Max Quattromani"}</p><h1 id="${escape(page.meta.class || "page-title")}">${titleHtml(page.meta.title)}<span>.</span></h1>${page.post ? `<time datetime="${page.date}">${formatDate(page.date)}</time>` : ""}</header><div class="prose${page.post ? " post-content" : ""}">${$.html()}</div>`;
  }
  const destination = page.post
    ? path.join(out, page.url, "index.html")
    : path.join(out, page.relative);
  await fs.mkdir(path.dirname(destination), { recursive: true });
  const output = shell(page, body);
  const visibleText = textOf(cheerio.load(output)("main").contents().toArray());
  const words = (text) =>
    (text.match(/[\p{L}\p{N}]+/gu) || []).reduce(
      (map, word) => (map.set(word, (map.get(word) || 0) + 1), map),
      new Map(),
    );
  const before = words(originalContent),
    after = words(visibleText);
  const missing = [...before].filter(
    ([word, count]) => (after.get(word) || 0) < count,
  );
  if (missing.length)
    throw new Error(
      `Content review ${page.relative}: ${missing.map(([word]) => word).join(" ")}`,
    );
  await fs.writeFile(destination, output);
}
function titleHtml(title) {
  return escape(cheerio.load(String(title || ""), {}, false).text());
}
await fs.writeFile(path.join(out, ".nojekyll"), "");
await fs.writeFile(
  path.join(out, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages
    .filter((page) => page.relative !== "404.html")
    .map((page) => `<url><loc>${escape(site.url + page.url)}</loc></url>`)
    .join("")}</urlset>`,
);
await fs.writeFile(
  path.join(out, "feed.xml"),
  `<?xml version="1.0" encoding="UTF-8"?><feed xmlns="http://www.w3.org/2005/Atom"><title>Max Quattromani</title><id>${site.url}/</id><updated>${posts[0].date}T00:00:00Z</updated>${posts.map((post) => `<entry><title>${escape(post.title)}</title><id>${site.url}${post.url}</id><link href="${site.url}${post.url}"/><updated>${post.date}T00:00:00Z</updated></entry>`).join("")}</feed>`,
);
console.log(
  `Built ${pages.length} pages, including ${posts.length} articles, into dist.`,
);
