import fs from "node:fs/promises";
import { sourceFingerprint } from "./release-state.mjs";
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
  if (!source || (source.meta.preview && !process.argv.includes("--preview")))
    continue;
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
const retiredPrefixes = [
  "/ADA/",
  "/audit/",
  "/email/",
  "/styleguide/",
  "/patterns/",
  "/sandbox/",
  "/amp/",
  "/templates/",
  "/sites/",
  "/SDLC/",
];
for (const page of pages)
  page.retired = retiredPrefixes.some((prefix) => page.url.startsWith(prefix));
const posts = pages
  .filter((page) => page.post)
  .sort((a, b) => b.date.localeCompare(a.date))
  .map((page) => ({ ...page.meta, url: page.url, date: page.date }));
const site = {
  ...config,
  data,
  posts,
  pages: pages
    .filter(
      (page) =>
        !page.post && !page.retired && !page.meta.preview && !page.meta.noindex,
    )
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
        (["class", "role"].includes(key) &&
          page.meta.presentation !== "current") ||
        ["style", "tabindex", "layout", "on"].includes(key) ||
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
  ["About", "/about/"],
  ["Career", "/resume/"],
  ["Writing", "/writing/"],
  ["Contact", "/contact/"],
];
const resources = [
  ["Career and selected work", "/resume/"],
  ["Writing", "/writing/"],
  ["Reading list", "/reading/"],
];
const links = (items, url) =>
  items
    .map(
      ([label, href]) =>
        `<a href="${href}"${url === href ? ' aria-current="page"' : ""}>${label}</a>`,
    )
    .join("");
const articleList = (items = posts) =>
  `<ol class="article-list">${items.map((post, index) => `<li><span class="article-number">${String(index + 1).padStart(2, "0")}</span><a href="${post.url}">${escape(post.title)}</a><time datetime="${post.date}">${post.preview ? "Written " : ""}${formatDate(post.date)}${post.preview ? " (preview)" : post.archived ? " (archive)" : ""}</time><span aria-hidden="true">↗</span></li>`).join("")}</ol>`;
const writingSections = () => {
  const entries = [
    ...posts,
    ...pages
      .filter((page) => page.meta.article)
      .map((page) => ({
        ...page.meta,
        url: page.url,
        date: page.meta.written,
        preview: page.meta.preview,
      })),
  ];
  const unknown = entries.filter(
    (entry) =>
      !data.writing.sections.some(
        (section) => section.id === entry.writing_section,
      ),
  );
  if (unknown.length)
    throw new Error(
      "Writing entries require a known section: " +
        unknown.map((entry) => entry.title).join(", "),
    );
  return data.writing.sections
    .map((section) => {
      const items = entries
        .filter((entry) => entry.writing_section === section.id)
        .sort((a, b) => String(b.date).localeCompare(String(a.date)));
      if (!items.length && !process.argv.includes("--preview")) return "";
      return `<section class="writing-category" aria-labelledby="writing-${section.id}"><div class="prose"><h2 id="writing-${section.id}">${escape(section.title)}</h2><p>${escape(section.description)}</p>${items.some((item) => item.archived) && section.archive_note ? `<p class="archive-intro">${escape(section.archive_note)}</p>` : ""}</div>${items.length ? articleList(items) : '<p class="prose">No pieces added yet.</p>'}</section>`;
    })
    .join("");
};
const portrait = (className) =>
  `<img class="${className}" src="${escape(site.data.profile.portrait.src)}" alt="${escape(site.data.profile.portrait.alt)}" width="${site.data.profile.portrait.width}" height="${site.data.profile.portrait.height}" decoding="async">`;
const template = await fs.readFile("templates/page.html", "utf8");
async function shell(page, body) {
  return engine.parseAndRender(template, {
    site,
    page,
    title: cheerio
      .load(String(page.meta.title || site.title), {}, false)
      .text(),
    description: page.meta.description || "",
    navigation: links(nav, page.url),
    resources: links(resources, page.url),
    policies: links(
      [
        ["Privacy policy", "/privacy/"],
        ["Accessibility", "/accessibility/"],
      ],
      page.url,
    ),
    body,
  });
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
  "humans.txt",
]) {
  try {
    await fs.mkdir(path.dirname(path.join(out, name)), { recursive: true });
    await fs.cp(name, path.join(out, name), {
      recursive: true,
      filter: (source) => path.basename(source) !== ".DS_Store",
    });
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
  if (page.retired) {
    page.meta.title = "Historical page retired";
    page.meta.description = "This historical resource is no longer maintained.";
    rendered =
      '<p>This historical page is no longer maintained. Its source remains in the project history.</p><p><a href="/resume/">Read my career background</a> or <a href="/accessibility/">view the accessibility statement</a>.</p>';
  }
  if (page.post || page.meta.format === "markdown")
    rendered = md.render(rendered);
  let body = normalize(rendered, page);
  const textOf = (nodes) =>
    nodes
      .map((node) =>
        node.type === "text" ? node.data : textOf(node.children || []),
      )
      .join(" ");
  if (page.post) posts.find((post) => post.url === page.url).content = body;
  const originalContent = textOf(
    cheerio.load(body, {}, false).root().contents().toArray(),
  );
  if (page.meta.article) {
    const image = site.data.profile.portrait;
    const dateLabel = page.meta.written
      ? `Written <time datetime="${escape(page.meta.written)}">${formatDate(page.meta.written)}</time>`
      : "Draft. Publication date to be confirmed.";
    const byline = `<div class="article-byline"><img src="${escape(image.src)}" alt="" width="48" height="48" class="author-avatar" decoding="async"><div><a href="/about/">${escape(site.data.profile.name)}</a><p>${dateLabel}</p></div></div>`;
    body = `<article aria-labelledby="article-title"><header class="article-heading"><p class="eyebrow">Article preview</p><h1 id="article-title">${titleHtml(page.meta.title)}</h1><p class="article-deck">${escape(page.meta.description)}</p>${byline}</header>${page.meta.historical ? '<aside class="archive-note">This first civic essay is preserved as originally written.</aside>' : ""}<div class="prose post-content">${body}</div></article>`;
  } else if (page.url === "/" && page.meta.presentation === "current") {
    body = `<section class="hero"><p class="eyebrow">Development, leadership, and public service</p><h1>Max<br>Quattromani<span>.</span></h1></section><section class="profile-section"><div class="section-label"><h2>Background and direction</h2>${portrait("home-portrait")}</div><div class="profile-copy">${body}</div></section>`;
  } else if (page.url === "/") {
    const $ = cheerio.load(body, {}, false);
    body = `<section class="hero"><p class="eyebrow">Digital Strategist • Marketing Leader • Front-End Architect</p><h1>Max<br>Quattromani<span>.</span></h1><div class="hero-bottom"><p>${$("h3").first().html()}</p><a class="text-link" href="/about/">About Me <span aria-hidden="true">↗</span></a></div></section><section class="profile-section"><div class="section-label"><span aria-hidden="true">01 /</span><h2>${page.meta.title}</h2></div><div class="profile-copy">${$("p").first().html()}</div></section><section class="writing-section"><div class="section-label"><span aria-hidden="true">02 /</span><h2>Articles</h2></div>${articleList()}</section>`;
  } else if (page.url === "/writing/") {
    body = `<header class="page-heading"><p class="eyebrow">Max Quattromani</p><h1>Writing<span>.</span></h1></header><div class="prose">${body}</div>${writingSections()}`;
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
    if (page.post)
      body = `<p>This is historical writing, originally published ${formatDate(page.date)}. Technical examples may need updates before reuse.</p>${$.html()}`;
    else body = $.html();
    body = `<header class="page-heading"><p class="eyebrow">${page.post ? "Writing archive" : "Max Quattromani"}</p><h1 id="${escape(page.meta.class || "page-title")}">${titleHtml(page.meta.title)}<span>.</span></h1>${page.post ? `<time datetime="${page.date}">${formatDate(page.date)}</time>` : ""}</header><div class="prose${page.post ? " post-content" : ""}">${body}</div>`;
    if (page.url === "/about/") {
      const $ = cheerio.load(body, {}, false);
      const prose = $(".prose").remove();
      body = `${$.html()}<div class="biography">${portrait("about-portrait")}${prose.toString()}</div>`;
    }
  }
  const destination = page.post
    ? path.join(out, page.url, "index.html")
    : path.join(out, page.relative);
  await fs.mkdir(path.dirname(destination), { recursive: true });
  const output = await shell(page, body);
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
    .filter(
      (page) =>
        page.relative !== "404.html" &&
        !page.retired &&
        !page.meta.preview &&
        !page.meta.noindex,
    )
    .map((page) => `<url><loc>${escape(site.url + page.url)}</loc></url>`)
    .join("")}</urlset>`,
);
await fs.writeFile(
  path.join(out, "feed.xml"),
  `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Max Quattromani</title><description>${escape(site.description)}</description><link>${site.url}/</link><atom:link href="${site.url}/feed.xml" rel="self" type="application/rss+xml"/>${posts
    .slice(0, 10)
    .map(
      (post) =>
        `<item><title>${escape(post.title)}</title><description>${escape(post.content)}</description><pubDate>${new Date(post.date).toUTCString()}</pubDate><link>${site.url}${post.url}</link><guid isPermaLink="true">${site.url}${post.url}</guid>${[...(post.tags || []), ...(post.categories || [])].map((category) => `<category>${escape(category)}</category>`).join("")}</item>`,
    )
    .join("")}</channel></rss>`,
);
console.log(
  `Built ${pages.length} pages, including ${posts.length} articles, into dist.`,
);

await fs.writeFile(
  path.join(out, "release-source.json"),
  JSON.stringify({
    fingerprint: await sourceFingerprint(),
    preview: process.argv.includes("--preview"),
  }),
);
