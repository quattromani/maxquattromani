# Launch review: October 19, 2026

This review reconciles the old checklist with completed editorial, contact, HTTPS, and repository work. The canonical status remains ops/launch.yml. This is readiness evidence, not a publication approval or accessibility certification.

## Completed checks

The release builds 64 HTML pages and all 21 tests pass. Local links, required policy pages, private-file exclusion, and intentional preview/noindex behavior pass. All pages have titles, descriptions, canonical links, one main H1, alt attributes, and no heading-level skips. Four archived heading skips were corrected without changing prose. The displayed portrait was converted from a 2,357,891-byte PNG to a 107,455-byte JPEG with its dimensions retained; the supplied PNG remains the source asset.

Home, About, Career, Writing, Contact, Privacy, Accessibility, and 404 pages opened in the local browser. Chrome homepage keyboard entry displayed a visible skip-link focus ring. This is partial accessibility and browser coverage.

The dependency audit returned zero vulnerabilities across 33 dependencies. The MIT license remains; dependency directories are excluded from the artifact. Source review found no analytics, browser storage, third-party scripts, authentication, payments, or uploads. Two archived external images remain and are disclosed by Privacy. No PDFs, audio, or video are shipped. Static review does not replace rendered accessibility or network/performance testing.

GitHub Pages uses workflow deployment, the custom domain, and HTTPS enforcement. Certificate-valid HTTP-to-HTTPS checks passed for apex and www. The live host returns 404 for missing pages and max-age=600 for HTML. The live artifact is older than this candidate; post-deployment checks must verify the new release.

The new Formspree endpoint accepted the plain-language test directly into its Inbox after hosted CAPTCHA, with a success confirmation. Earlier repeated localhost messages were classified as spam. Actual mailbox receipt and Reply-To still need explicit owner confirmation.

## Owner confirmations and remaining checks

On October 19, the owner explicitly confirmed image rights, current Career details and CE hours, and actual test-email receipt. GitHub Support ticket #4877351 was submitted with authorization and confirmed Open. Purge completion remains pending Support confirmation.

Four pre-release checks remain: GitHub's sensitive-reference purge, cross-browser/physical-device coverage, complete manual accessibility coverage, and actual print-preview review. Additional writing does not block this release. Browser/accessibility work still requires Safari, Firefox, a physical phone, screen-reader use, and enlarged text/reflow. No unperformed check has been waived.

## Performance verification

Lighthouse 13.5.0 lab checks are complete. The final displayed portrait is a 107,455-byte JPEG with high fetch priority. Home scores 99 mobile and 100 desktop; mobile LCP is 1.8 seconds, versus 3.2 seconds before final optimization. See [the performance report](performance-review-2026-10-19.md) for all sampled pages, settings, and limits. Field INP remains unavailable. The Node-action warning is maintenance, not the deployment failure. Production verification follows deployment.

## Recovery and maintenance

A separate clone successfully checked out sanitized revision 32a35ed3, built 64 pages, and passed artifact checks with the installed locked dependencies. To recover, restore selected site source from a sanitized known-good revision on a new branch, rebuild and check it, refresh affected checklist evidence, and deploy through the workflow. Do not merge old unsanitized commits or restore the private backup into the public repository. The private backup is for owner-controlled recovery only.

Max owns service access, domain renewal, content, and incident decisions. Before release, confirm account recovery and domain renewal access. At the next content update, check Formspree Inbox and Spam, policies, broken links, and course progress. After the November 3 election, update status only after the result is known; update officeholding only on taking office. No automated monitoring or scheduled follow-up has been created.

## Boundaries

No GPR files, configuration, service, branch, or history were edited during this review. The personal preview remains on port 4174. Outstanding sensitive-history cleanup remains blocked in the launch gate until Support resolves it.
