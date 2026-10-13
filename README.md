# Max Quattromani

Personal site hosted on GitHub Pages at https://maxquattromani.com.

## Develop and verify

Use Node 22 or newer. Install with `npm ci`, build with `npm run build`, and validate the output with `npm run check`. Run `npm run dev` to build and preview at http://localhost:4173. Run the build again after editing content; the preview does not watch source files.

## Content

Edit the existing page files, `_posts`, and `_data`. `_includes` contains the reusable content referenced by pages. Existing wording, dates, images, and routes were preserved during modernization. Historical descriptions of the old technology and sample code remain for the next editorial pass.

`scripts/build.mjs` reads the existing Liquid and Markdown content, removes obsolete AMP and styling hooks, and renders the current document shell. New styles and behavior are in `assets/site.css` and `assets/site.js`. `dist` is generated and ignored. The build checks content word preservation, and the checker validates local links, images, page structure, and the private-file boundary.

## Design system

The presentation uses warm paper (`#f3f0e8`), dark ink (`#242923`), muted text (`#62675e`), and rust emphasis (`#97462e`). Georgia gives names and headings their editorial voice; system sans serif supports navigation and sustained body text. Shared colors, measure, and gutters are CSS variables. Home has a typographic introduction, a profile section, and a numbered article list. Interior pages share a page heading and readable prose measure.

Navigation stays usable without JavaScript. On narrow screens a button enhances it with an expanded state and Escape dismissal. Native disclosure and dialog elements replace the old accordion and modal behavior; dialogs restore focus to the trigger. Keyboard focus, reduced motion, and print styles are included.

## Delivery

The workflow in `.github/workflows/pages.yml` builds and validates on pushes to `gh-pages`, then deploys only `dist` with GitHub Pages Actions. Set the repository's Pages build source to GitHub Actions when activating the release. Keep the custom domain `maxquattromani.com`. Never upload the repository root as the Pages artifact.

The private `Documents` folder, source tooling, legacy CSS and JavaScript, and original DAM files are excluded. This artifact exclusion does not remove files already in public Git history.

The former Jekyll layouts, Grunt tooling, and CSS are retained as historical source, but they do not participate in the modern build. The current build replaces their runtime behavior. See [modernization notes](docs/modernization.md) for scope, DNS findings, and verification evidence.
