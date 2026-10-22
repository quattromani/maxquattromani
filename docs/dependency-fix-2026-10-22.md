# Markdown parser security fix

Dependabot alert #16 identified GHSA-gfr2-rv44-r23c (CVE-2026-111758), a high-severity algorithmic-complexity denial of service in markdown-it's multi-line reference parsing. The locked 14.3.2 release was vulnerable; 14.3.3 is the patched release in the same major version. Both package.json and package-lock.json are updated.

This site parses repository-authored Markdown during its build. Visitors cannot submit Markdown for server-side rendering, and markdown-it is not shipped as a browser dependency. The build tool still warrants patching.

Verification on October 22: zero npm audit vulnerabilities, 70 pages pass artifact checks, all 22 tests pass, and generated files are byte-identical before and after the dependency update except release-source fingerprint metadata. A roughly 200 KB unclosed-reference input rendered in 154 ms. This smoke check is evidence of the repaired path, not a formal complexity proof.

Upstream advisory: https://github.com/markdown-it/markdown-it/security/advisories/GHSA-gfr2-rv44-r23c

Publication remains gated. The new civic article import invalidated earlier fingerprint-bound approvals; only the dependency item is refreshed by this focused fix. Cross-browser/device, manual accessibility, print-preview, and GitHub Support purge requirements remain unresolved. Prior performance measurements cover Home, About, Contact, and Writing before the new article content, not the new article pages. The launch checklist must accurately revalidate affected approvals before deployment; no blanket override was introduced.
