# Launch readiness

Generated from [the canonical checklist](../ops/launch.yml). Run `npm run launch:status` to refresh this view. This snapshot describes the candidate, not the live site's complete readiness.

Source fingerprint: `d4b92a3c9d9447a9fda064e0c808cfa53e3e213798c22b34f9654da701ea5422`

20 pre-release checks remain unresolved. Production verification follows deployment.

| Check | Status | Owner | Evidence or next step |
| --- | --- | --- | --- |
| Review biography, résumé, dates, claims, and historical examples | Not checked | Max Quattromani | Existing wording was preserved; the editorial pass is still due. |
| Confirm rights and attribution for images, media, and downloadable files | Not checked | Max Quattromani | Evidence still required. |
| Exercise home, résumé, writing, contact, footer, deep links, and not-found journeys | Not checked | Max Quattromani | Evidence still required. |
| Review current Chrome, Safari, Firefox, a physical mobile device, and enlarged text | Not checked | Max Quattromani | Evidence still required. |
| Review keyboard, screen reader, headings, labels, contrast, reflow, and reduced motion | Not checked | Max Quattromani | Initial Chrome navigation and dialog checks are recorded in docs/modernization.md; full coverage is still due. |
| Build integrity, local links, required pages, policy links, and private-file exclusion | Pass | Max Quattromani | Automated artifact verification ran for this source fingerprint; see scripts/release.mjs. |
| Review dependency findings and preserve licenses | Not checked | Max Quattromani | Evidence still required. |
| Resolve the sensitive PDFs still in the public repository and its history | Blocked | Max Quattromani | Website artifact excludes Documents, but public repository/history remediation remains unresolved. Do not open or republish the files. |
| Review mixed content, external resources, headers, and trust boundaries | Not checked | Max Quattromani | Evidence still required. |
| Verify privacy disclosures against actual requests, storage, hosting, and email handling | Not checked | Max Quattromani | Evidence still required. |
| Privacy and accessibility pages remain present and linked on every page | Pass | Max Quattromani | Automated policies verification ran for this source fingerprint; see scripts/release.mjs. |
| The no-tracking statement remains consistent with the delivered scripts | Pass | Max Quattromani | Automated tracking verification ran for this source fingerprint; see scripts/release.mjs. |
| Measure representative loading and stability; check asset sizes and failure fallbacks | Not checked | Max Quattromani | Evidence still required. |
| Valid domain certificate and HTTP-to-HTTPS redirect on apex and www | Blocked | Max Quattromani | GitHub certificate authorization is pending; HTTPS hostname verification failed on October 13, 2026. |
| Verify Pages source, redirects, deep-route status, cache behavior, and retained assets | Not checked | Max Quattromani | Evidence still required. |
| Review titles, descriptions, canonical URLs, sitemap, RSS, robots, icons, and sharing | Not checked | Max Quattromani | Evidence still required. |
| Verify mailto contact and clearly distinguish sample forms from working submissions | Not checked | Max Quattromani | Evidence still required. |
| Authentication, payments, and uploads | Not checked | Max Quattromani | The current personal site has no account, payment, or upload service. Reopen if one is introduced. |
| Review PDF accessibility, print, audio alternatives, and video captions | Not checked | Max Quattromani | Evidence still required. |
| Localization, offline storage, device permissions, and background services | Not checked | Max Quattromani | No translated experience, service worker, device-permission feature, or offline data store is implemented. Reopen when scope changes. |
| Document and exercise rollback; confirm domain and service ownership | Not checked | Max Quattromani | Evidence still required. |
| Assign maintenance and incident follow-up without implying unscheduled monitoring | Not checked | Max Quattromani | Evidence still required. |
| Review the complete experience against the project guidance before release | Not checked | Max Quattromani | Evidence still required. |
| Verify the exact deployed artifact, critical routes, certificates, and policy pages | Not checked | Max Quattromani | Evidence still required. |
