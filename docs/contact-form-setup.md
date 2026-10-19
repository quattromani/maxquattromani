# Contact form delivery

## Integration choice

This site is static HTML with first-party JavaScript hosted on GitHub Pages. It needs no React app or third-party browser SDK. It uses Formspree to accept messages, with a standard HTML POST as the baseline. Names, email addresses, topics, and messages have native labels and validation. A hidden `_gotcha` field adds the provider-supported honeypot; it is not a guarantee against spam.

The signed-in Formspree dashboard was reviewed on October 19, 2026. The form used in the user's supplied JavaScript snippets, `mbojbyqx`, exists in the account and its settings show notifications targeting the site's public email address, an enabled submission archive, enabled reCAPTCHA, and disabled Formshield. No account settings were changed. Several other similarly named forms exist; they were not deleted or repurposed.

The dashboard's HTML endpoint display uses an email-based path while its JavaScript snippets identify the form by ID. The implementation uses the dashboard-confirmed form ID in `https://formspree.io/f/mbojbyqx`, consistent with Formspree's ID-based integration. Read-only GET requests return 405 for both paths and do not establish successful delivery. A live end-to-end submission is still required before launch.

## Configuration

`_data/contact.yml` owns the public endpoint and delivery mode. Empty endpoints disable the form safely and preserve the email fallback. The build rejects endpoints outside `https://formspree.io/f/FORM_ID` and unknown delivery modes. No API secret is required or stored.

The selected `delivery: hosted` preserves the account's current CAPTCHA protection. Client validation runs, and the submit action sends the normal HTML form to Formspree for verification and its confirmation/error screen. Fields remain enabled during that transition so their contents are included in the POST. Returning through browser history restores the controls. The site does not claim success before the provider confirms it.

An alternative `delivery: ajax` supports inline status, a 15-second timeout, duplicate-submit prevention, provider field errors, rate limits, and preserved text on failure. Do not select it while hosted CAPTCHA requires a challenge that has not been integrated. Add a supported CAPTCHA token integration first if inline verification is wanted; do not disable protection just to make AJAX appear to work.

## Remaining dashboard and launch work

1. Keep the original form enabled and its notification recipient set to `max@maxquattromani.com`.
2. Consider turning Formshield on as an additional server-side spam filter. Keep reCAPTCHA enabled. These settings were inspected but not changed.
3. Optionally give the form a distinctive name such as “Personal website contact” to distinguish it from the similarly named forms.
4. Verify the recipient address in Formspree if the account requests it. The account login email can be managed separately; no password, private API key, paid upgrade, or HTTP API access is required for this form integration.
5. Submit one deliberate test through the actual form, complete the verification yourself, and confirm both provider acceptance and receipt in the intended inbox. Check Spam if necessary. Confirm replies go to the visitor address. This has not been done by the agent.
6. Before launch, verify validation, mobile and keyboard use, CAPTCHA accessibility/fallback, and behavior without JavaScript. Preserve email as the alternative channel. If account settings or additional verification providers change, recheck Privacy.

## Sources

Reviewed October 19, 2026: [HTML form setup](https://help.formspree.io/articles/building-your-form/building-an-html-form), [AJAX integration](https://help.formspree.io/articles/building-your-form/submit-forms-with-javascript-ajax), [honeypot](https://help.formspree.io/articles/building-your-form/honeypot-spam-filtering), [reCAPTCHA settings](https://help.formspree.io/articles/form-and-project-settings/recaptcha-settings/), and [Formspree privacy](https://formspree.io/legal/privacy-policy/).
