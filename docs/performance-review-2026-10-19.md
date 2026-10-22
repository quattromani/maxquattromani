# Performance review: October 19, 2026

Lighthouse 13.5.0 audited the ordinary production build served locally on port 4174. Mobile uses Lighthouse's default simulated mobile throttling; desktop uses its desktop preset. No form was submitted by these audits. These are local lab results, not field measurements or proof of production CDN behavior. Audit settings and numeric results are preserved in the adjacent JSON file.

| Page/profile | Score | LCP | Total blocking time | CLS |
|---|---:|---:|---:|---:|
| home-mobile | 99 | 1.8 s | 0 ms | 0.069 |
| home-desktop | 100 | 0.4 s | 0 ms | 0 |
| about-mobile | 99 | 1.8 s | 0 ms | 0.069 |
| contact-mobile | 99 | 0.9 s | 0 ms | 0.069 |
| writing-mobile | 100 | 1.0 s | 0 ms | 0 |

The initial mobile home audit scored 92 with 3.2-second LCP. Resizing the supplied portrait to a 600-by-800 JPEG (107,455 bytes) and giving the discoverable portrait high fetch priority brought final home LCP to 1.8 seconds. The original PNG remains as source material; presentation uses the smaller JPEG. Explicit image aspect dimensions are retained. No third-party fonts or scripts block primary page rendering.

All sampled final pages meet the chosen lab budgets of LCP below 2.5 seconds, CLS below 0.1, and total blocking time below 200 milliseconds. Total blocking time is a lab responsiveness proxy, not field INP. Real-user INP and 75th-percentile Core Web Vitals are unavailable and are not claimed. Recheck production performance after deployment. Legacy archive images can be larger; they remain deferred optimization unless a relevant page demonstrates a problem.
