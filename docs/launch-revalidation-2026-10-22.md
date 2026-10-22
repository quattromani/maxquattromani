# Launch revalidation: October 22, 2026

The current 70-page production build passes artifact/link checks and all 22 tests. A whole-artifact scan found one main H1 per page, no heading skips, image alternative attributes, and titles/descriptions/canonicals on every page. The five civic articles appear in Writing, sitemap, and now RSS. Preview redirects remain excluded from indexing.

## New-article performance and accessibility

Lighthouse 13.5.0 mobile audits of the locally served production build:

| Route | Performance | Automated accessibility | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 99 | 100 | 1.8 s | 0 ms | 0.069 |
| the-letter | 100 | 100 | 1.0 s | 0 ms | 0 |
| assessment-season-ends-budget-season-begins | 99 | 100 | 1.1 s | 0 ms | 0.064 |
| assessment-up-protest-denied-taxes | 99 | 100 | 1.1 s | 0 ms | 0.064 |
| before-you-walk-into-a-property-protest | 99 | 100 | 2.0 s | 0 ms | 0.064 |
| watch-the-tax-roll-move | 99 | 100 | 2.0 s | 0 ms | 0.064 |

Numeric results and settings are in launch-audits-2026-10-22.json. The lab budgets are LCP below 2.5 seconds, TBT below 200 ms, and CLS below 0.1. These samples meet them. TBT is not field INP; no real-user Core Web Vitals claim is made. Full WCAG conformance is not established by these scores. The audit's visible-label/accessibility-name mismatch was corrected by including the visible mq. name in the home link's accessible label.

## Browser and keyboard coverage

Chrome checked Home, Contact, and all five civic articles at requested viewport widths 320, 375, and 1280. The initial Home overflow at the narrowest width was corrected with a responsive heading size; the recheck reports scroll width equal to client width (305 CSS px). Native tables retain local horizontal scrolling where necessary. The mobile menu opens and closes from keyboard activation; the skip link has visible focus. Viewport overrides were reset. This is emulation, not a physical-phone test. Safari, Firefox, screen-reader interaction, actual browser text enlargement, and full contrast/state verification remain incomplete.

## Print review

Chrome PDF exports of Home, Career, Contact, The Letter, and all four imported civic articles were rendered for visual inspection. Reviewed samples include first pages, a middle article page, the original letter's last page, and the assessment article's annual-value table. Contact originally wasted pages on a nonfunctional printed form; print styles now hide the form and retain the email and county-office information in one readable page. Article print typography and section spacing were tightened. Assessment data disclosures are expanded by default in the reading edition so the figures are available without interaction and appear in print. The four-column annual table is legible and within page bounds. Source wording is unchanged; adjacent labels and values received separating whitespace. These are browser print-output checks, not a PDF/UA certification. Test exports remain outside the public artifact.

## Security, privacy, hosting, and service checks

The dependency audit reports zero vulnerabilities. GitHub alert #16 now reports fixed. Repository histories and production artifact exclude Documents; private backups remain outside the repository. No client analytics, storage, third-party scripts, authentication, payments, or uploads were added. Imported editions link to original GPR interactions rather than copying its application code. Existing Formspree native verification, success/error behavior, and owner-confirmed delivery remain valid; no additional messages were sent.

Certificate-valid requests from HTTP apex and www both end at https://maxquattromani.com/ with HTTP 200. The Pages API confirms workflow publishing, the expected custom domain, and HTTPS enforcement. The current candidate is not deployed; actual production verification must follow release. The earlier sanitized rollback exercise remains applicable to this static build process. Ownership and maintenance responsibilities are unchanged.

## GitHub Support

Ticket #4877351 was checked directly in the signed-in portal on October 22. It remains Open, with only the original owner request and no Support response. Sensitive-reference/cache purge cannot be marked complete. No follow-up message was sent.

## Remaining release requirements

Three pre-release checks remain unresolved: Support's sensitive-data purge, cross-browser/physical-device coverage, and manual accessibility coverage. No exception or blanket override has been recorded. All other reviews are refreshed against the current source fingerprint with their actual scope. Production verification remains a separate post-deployment check. GPR was not edited.

## Owner iPhone results

On October 22, Max reported successful physical-device testing in Safari on a larger iPhone believed to be in the iPhone 15 family. The menu, article reading, rotation, contact controls, and larger text all worked. These are owner-reported observations, not automated results; the precise device model was not independently confirmed. This closes the physical iPhone portion of browser coverage. Desktop Safari, Firefox, and the remaining manual accessibility checks, including screen-reader interaction, remain unverified.

The headshot metadata scrub changed source hashes after the prior review. Decoded pixels and dimensions were verified identical, and the rebuilt 70-page artifact passed checks. Existing completed reviews were carried forward to this metadata-only fingerprint; no unperformed browser or accessibility review was approved.
