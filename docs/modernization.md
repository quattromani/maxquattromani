# Personal site modernization

## Scope and brief

Rebuild the presentation from the existing words, articles, links, images, and data. Preserve public routes and content for a subsequent editorial pass. Audience: prospective collaborators and readers seeking Max's work, experience, and technical writing. Use an editorial rather than a dashboard composition: warm paper, dark ink, restrained rust, oversized name, clear typographic hierarchy, and generous readable measures. Five guiding words: personal, thoughtful, clear, confident, durable. Existing site is the content reference; its AMP, off-canvas navigation, CSS, and JavaScript are not design precedents. No taste skill was installed; the user authorized a fresh direction on October 13, 2026.

## Architecture

Existing page files, Markdown posts, and `_data` remain authoritative content. A small Node build reads their Liquid expressions, normalizes obsolete presentation markup, and renders a new shared shell. No old styles or scripts enter the output. Generated files live in `dist`, never in authored source. Deployment is GitHub Pages through Actions. Historical descriptions of AMP, Sass, and equipment are deliberately preserved for the later content review.

## Acceptance criteria

All existing public page and article routes build. Existing substantive copy remains intact. Navigation, contact links, and article links work without JavaScript. Images use native HTML. Narrow screens have no page overflow. Keyboard focus is visible; menus expose their state. No private Documents folder or obsolete runtime scripts enter the release. Review representative home, content, résumé, and article pages. Verify DNS and HTTPS separately from the presentation build.

## Hosting findings

October 13, 2026: Pages builds from `gh-pages`, custom domain `maxquattromani.com`, HTTPS enforcement disabled. Apex A records are `192.30.252.153` and `192.30.252.154`; TLS presents `*.github.com` and fails hostname validation. Current GitHub documentation specifies `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, and `185.199.111.153`; www should CNAME to `quattromani.github.io`. Preserve mail and other service records. Source: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site

The public repository contains apparently sensitive PDFs in Documents. Those files were not opened and are excluded from the new website artifact. This does not remove existing public Git history. History cleanup requires a separate scoped decision.

## Verification

The build produces 62 HTML pages, including 12 articles and the standalone AMP experiment, using the new shell. The build verifies that every word in the normalized source content remains in the rendered page. The output check passes for document landmarks, headings, duplicate IDs, all local asset and navigation targets, and the Documents exclusion. All installed dependencies pass npm audit.

Browser review in Chrome covered the home, About, résumé, article, and modal templates. A 390-pixel viewport had no horizontal page overflow. Mobile navigation exposes its state, Escape dismisses it and restores focus. Modal open, Escape close, and trigger focus restoration were verified. Desktop home, About, and article compositions were inspected. Safari, Firefox, physical mobile devices, screen readers, and remote historical link availability remain unverified; this is not a full accessibility certification.

DNS values were updated in Network Solutions and independently verified against the authoritative nameserver. Email records were left intact. GitHub's custom domain was reapplied to restart certificate provisioning after the initial request remained pending. HTTPS requires a valid certificate before enforcement can be enabled.

The guidance checkpoint found no material divergence from the authorized scope. Preserving outdated source prose is a deliberate requirement for this presentation pass; the subsequent editorial pass must update the technology descriptions and time-sensitive claims.

The first production workflow completed successfully. A final maintenance pass preserves the original RSS format and full article content, moves the new document shell into an editable template, excludes Finder metadata from copied assets, and removes obsolete Ruby manifests, Grunt tasks, and the debug log. These removals retire unused tooling; public prose stays unchanged.

## Editorial brief: October 2026

The audience now includes residents, journalists, colleagues, and professional acquaintances searching for Max as he prepares for an anticipated move into county administration. Their first questions are who he is, what he has done, what his present status is, and where to direct assessment matters. The personal site remains a biography, not an official county service.

Interpretation: clear, grounded, restrained, personal, accountable. Preserve the existing editorial design while replacing the recruiting pitch with concrete career contributions. Primary destinations are About, Career, Writing, and Contact; Home is reached through the name. Career includes selected work. Historical essays keep dates and contextual notices. Obsolete demonstration and advice routes retain retirement notices with noindex and are omitted from the sitemap; Git preserves their source. The old résumé PDF is excluded from the release.

The maintained profile data owns career start and transition wording. The historical résumé supports the selected chronology, pending owner confirmation. Internal review and draft documents record the evidence and missing details. No election result, current officeholding, certification roster, or official policy is asserted. Education wording and unsupported numerical outcomes remain outside the public draft.

Validation: generated-page checks and nine launch-gate tests passed. Editorial artifact tests cover election status, retirement routing, obsolete PDF exclusion, and dated writing. Browser preview was blocked by browser security policy; the revised layout remains visually unverified. Launch approval is still pending, including career confirmation, accessibility review, HTTPS, and sensitive repository material. No global guidance divergence is proposed.


## Reading list

The current reading page renders user-selected books and a separately labeled research model from `_data/reading.yml`. It replaces the obsolete technical bookmark list and is restored to the sitemap, linked from About and the footer. Favorite status and reading frequency come from the user. Linked sources establish titles and author names without implying a particular edition, translation, or personal interpretation.


## Portrait placement

The user-provided portrait is stored as `images/max-quattromani-portrait.png`; the original Desktop file is preserved. Canonical image path, dimensions, and alternative text are in `_data/profile.yml`. Home pairs the portrait with the background section; About places it beside the biography and stacks it above the text on narrow screens. Both retain the full image without cropping and explicit dimensions reserve its space during loading.


## Author portraits and article preview

Large Home and About portraits retain their full rectangular composition with an 8px corner radius. Article bylines use a 48px circular CSS mask, an empty alternative beside the author name, and an About link. This distinguishes a small author identifier from the larger biographical photograph. [W3C avatar guidance](https://design-system.w3.org/styles/avatars.html) supports the circular identity pattern.

`preview/article/index.html` is an unpublished article specimen, built only by `npm run build:preview`. Its `preview: true` flag excludes it from ordinary release builds, navigation, and sitemaps; preview output is noindex. The sample contains no invented publication date or article. Before publishing a real piece, supply the manuscript, title, description, publication date, sources, and any necessary editorial disclosures, then replace sample text and draft metadata.


## Writing organization

Writing has four subject lanes: Civic, Legal, Technology, and Personal. Archive is an independent status, not a category. Post frontmatter owns the subject and archive status; `_data/writing.yml` defines the sections and context. Older post bodies and URLs are unchanged. The first civic essay appears only in preview. Empty sections are visible while developing the local preview and omitted from release output until there is content. No published legal-writing claim is made by an empty section.


## Home editorial perspective

The user confirmed a degree in technical communications and asked that the introduction foreground information-seeking behavior and information design. Home now treats web development and business systems as applications of that perspective, while retaining concrete career evidence and accurate election status. The degree field is maintained in `_data/profile.yml`; no additional academic credentials or honors are inferred.
