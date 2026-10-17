# Administrative page review

Scope: Contact, Privacy, Accessibility, Sitemap, the not-found page, and the old form confirmation route. Reviewed October 16, 2026. The purpose is to help readers choose a destination, understand an action before taking it, and recover when an address or browser feature does not work.

## Contact behavior

The personal email address is rendered from `_config.yml`; the official office destination comes from `_data/profile.yml`. The native email link works without script. Script progressively reveals an optional topic selector and copy action. Topic selection changes only the email subject and local guidance. The website neither composes a message body nor sends or stores a submission.

Copying writes only the public email address, after an explicit click. Success is announced only after the write resolves. Unavailable or denied clipboard access focuses and selects the address for manual copying. The persistent status is exposed to assistive technology without a timed dismissal. Native labels, controls, visible focus, and responsive panels support the interaction. CSS hides enhancement-only controls when scripting is unavailable. Print hides interactive controls while retaining the address and county link.

The personal site makes no response-time promise and does not present its mailbox as an official filing channel. The county link opens in the same tab and delegates current office contacts and services to the official county page.

## Policy and recovery pages

Privacy now describes email preparation, clipboard behavior, hosting logs, and automatic third-party image requests in archived writing. It does not invent retention periods or statutory rights. Accessibility states a WCAG 2.2 AA target without claiming conformance, identifies historical material as incompletely reviewed, and gives an email route with practical reporting and alternate-format instructions.

The sitemap groups current destinations and lists the dated writing archive; retired, preview, error, and old-confirmation routes are excluded from indexing. The not-found page offers Home, Writing, Sitemap, and a broken-link report. The old thank-you route explicitly says it does not confirm delivery; it does not redirect automatically or imply a submitted form.

## Evidence and limits

- Build and local-target checks passed for all 64 release pages.
- Five contact/recovery tests passed (included in the existing release-test command used by CI): native fallback, encoded topic subjects, copy success, copy denial/unavailability, and sitemap/noindex boundaries.
- Three editorial tests and nine launch-gate tests passed.
- Artifact review found two remote images in the atomic-development archive, consistent with the privacy disclosure.
- Browser visual and assistive technology checks remain unverified; automated behavior tests are not a substitute for them. No WCAG conformance or successful email delivery is claimed.

Sources reviewed October 16, 2026: [county office](https://gagecountyne.gov/county-assessor/), [GitHub Pages data collection](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#data-collection), [Clipboard.writeText](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText), and [WCAG 2.2](https://www.w3.org/TR/WCAG22/).

The stale technology colophon was also updated to reflect the actual site and hosting. The local preview was confirmed to respond successfully.

The guidance checkpoint found no material conflict. These contact and recovery patterns are local implementations of the established accessibility and editorial rules; no global guidance change is proposed. Publication remains subject to the launch gate.
