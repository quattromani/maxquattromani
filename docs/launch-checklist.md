# Launch checklist

This is the release procedure for Max Quattromani's personal site. The authoritative checklist is [ops/launch.yml](../ops/launch.yml). The [readiness view](launch-status.md) is generated from that record. It covers all 14 categories in the user's front-end launch guidance. Status is evidence, not a promise: unknown, blocked, failed, and stale reviews prevent release.

## Scope and ownership

Max Quattromani owns the content, site, domain, and release decision. The current scope is a personal portfolio, résumé, articles, reference examples, reading list, and contact by email. Privacy and accessibility statements describe the delivered behavior; they do not certify legal compliance or WCAG conformance.

Review the whole launch before a major release. A smaller change still requires current evidence for affected areas. The initial browser matrix is current Chrome, Safari, Firefox, and a physical mobile device, with keyboard, enlarged text, and an appropriate screen reader. The accessibility engineering goal is WCAG 2.2 Level AA.

## Review a candidate

1. Run `npm ci` and `npm run build` from the repository.
2. Run `npm run launch:status`. It checks the generated artifact, displays every unresolved item, and prints the source fingerprint.
3. Perform the manual checks in `ops/launch.yml`. Record the reviewer, date, exact evidence or a repository evidence path, status, and the printed source fingerprint. A pass requires an observed result. A not-applicable decision needs the same evidence and freshness as a pass.
4. Run `npm run release:check`. It fails if any required check is unresolved, evidence is absent, or a manual review no longer matches the candidate. It never approves an exception automatically.
5. After deployment, complete the checks marked `phase: after_deploy`, recording the deployed revision and actual results. Passing the pre-release gate does not prove production behavior.

For a completed manual review, set `status: pass`, `reviewed_at: YYYY-MM-DD`, `owner`, `evidence`, and `source_fingerprint` on that item. Reviews expire after 30 days and become stale immediately when relevant source changes. The fingerprint excludes checklist status and internal evidence documents so recording a review does not invalidate itself. It includes authored content, templates, scripts, dependency inputs, deployed assets, and delivery configuration.

Automated checks run on every candidate. They cover site structure, local links, private-file exclusion, policy-page presence and footer links, source/artifact matching, and common tracking/storage indicators. They supplement human review and cannot prove accessibility, source rights, legal compliance, or an absence of all tracking.

## Required coverage

The checklist tracks content and rights; critical journeys; browser and device behavior; accessibility; reproducible builds and dependencies; security; privacy and third-party services; performance and resilience; hosting and HTTPS; discovery and sharing; forms and transactions; documents, media, print, localization, and offline features; ownership and rollback; and guidance plus production verification. Missing a category is itself a failed check. Authentication, payments, uploads, and offline features remain explicit scope decisions rather than silently disappearing from the checklist.

## Current open work

The content pass is still due. HTTPS certificate issuance remains pending. Sensitive PDFs remain in the public repository and history even though the website excludes them. The full accessibility, document/media, browser, performance, rights, and recovery reviews are not complete. The new privacy page also requires checking email handling against the owner's actual practices. These items stay open until evidence supports closure.

## Publishing and recovery

GitHub Actions builds pull requests for review. Production publishing runs the strict release gate before uploading the `dist` artifact. Keep release evidence in the repository and record the deployed commit. There is no blanket override switch.

For rollback, revert the offending source change on `gh-pages`, rebuild, validate, and deploy the prior known-good content. Reassess the affected checks against that source fingerprint. If the gate identifies a genuine emergency conflict, stop and obtain a concrete, documented owner decision about the release mechanism; do not mark an unperformed check as passed.

Assign later maintenance through this checklist. Monitoring or recurring work is not scheduled automatically.

## Sources

The governing checklist is [front-end launch guidance](/Users/maxquattromani/.codex/skills/front-end-engineering/references/launch-checklist.md). The accessibility statement follows [W3C WAI guidance](https://www.w3.org/WAI/planning/statements/). Hosting disclosures follow [GitHub Pages data collection](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages). The working record in [modernization notes](modernization.md) distinguishes previous checks from reviews still due.
