# Contact form delivery

## Integration choice

This site is static HTML with first-party JavaScript hosted on GitHub Pages. It needs no React app or third-party browser SDK. It uses Formspree to accept messages, with a standard HTML POST as the baseline. Names, email addresses, topics, and messages have native labels and validation. A hidden `_gotcha` field adds the provider-supported honeypot; it is not a guarantee against spam.

On October 19, 2026, a live test of `mbojbyqx` reached hosted reCAPTCHA but returned "This form isn't set up yet" after the user completed verification. The dashboard archive contained no submissions. Its presence in the dashboard did not establish a working endpoint.

A dedicated form, **Personal website contact**, was created in the signed-in Chrome dashboard with endpoint `https://formspree.io/f/mgaobkpr` and recipient `max@maxquattromani.com`. Form Enabled, Email Notifications, Submission Archive, Formshield, and reCAPTCHA are enabled. Existing forms were left unchanged, including `xegdjkax`, which targets a different address.

Live testing through port 4174 completed on October 19, 2026. The user completed hosted CAPTCHA and Formspree displayed its successful-submission confirmation. Three repeated test messages containing a localhost URL were classified as spam; one was marked Not Spam and moved into the Formspree Inbox. A fresh plain-language message without a URL then appeared directly in the Formspree Inbox without manual reclassification. The provider did not expose the reason for the earlier classifications. The owner explicitly confirmed mailbox receipt on October 19, 2026. The agent did not independently access the mailbox.

## Configuration

`_data/contact.yml` owns the public endpoint and delivery mode. Empty endpoints disable the form safely and preserve the email fallback. The build rejects endpoints outside `https://formspree.io/f/FORM_ID` and unknown delivery modes. No API secret is required or stored.

The selected `delivery: hosted` preserves the account's current CAPTCHA protection. Client validation runs, and the submit action sends the normal HTML form to Formspree for verification and its confirmation/error screen. Fields remain enabled during that transition so their contents are included in the POST. Returning through browser history restores the controls. The site does not claim success before the provider confirms it.

An alternative `delivery: ajax` supports inline status, a 15-second timeout, duplicate-submit prevention, provider field errors, rate limits, and preserved text on failure. Do not select it while hosted CAPTCHA requires a challenge that has not been integrated. Add a supported CAPTCHA token integration first if inline verification is wanted; do not disable protection just to make AJAX appear to work.

## Remaining dashboard and launch work

1. Keep the dedicated form enabled, with notifications to `max@maxquattromani.com`, Formshield, and reCAPTCHA enabled.
2. Provider confirmation and acceptance into the Formspree Inbox are verified. Mailbox receipt is owner-confirmed. Reply-To is supplied by the form email field; independently checking reply behavior remains a post-deployment check. Check the Formspree Spam tab periodically for false positives.
3. Before launch, verify mobile and keyboard use, CAPTCHA accessibility/fallback, and behavior without JavaScript. Preserve email as the alternative channel. If verification providers change, recheck Privacy.
4. The account login email is separate from the notification recipient. No password, private API key, paid upgrade, or HTTP API access is required for this integration.

## Sources

Reviewed October 19, 2026: [HTML form setup](https://help.formspree.io/articles/building-your-form/building-an-html-form), [AJAX integration](https://help.formspree.io/articles/building-your-form/submit-forms-with-javascript-ajax), [honeypot](https://help.formspree.io/articles/building-your-form/honeypot-spam-filtering), [reCAPTCHA settings](https://help.formspree.io/articles/form-and-project-settings/recaptcha-settings/), and [Formspree privacy](https://formspree.io/legal/privacy-policy/).


## Preview identity

Use `npm run dev` in this repository, then open `http://127.0.0.1:4174/contact/`. Port 4173 is used by Guided Parcel Review in the shared workspace. The preview is bound to the loopback interface. Before reporting a preview as ready, confirm both the page title (`Contact | Max Quattromani`) and the form action (`https://formspree.io/f/mgaobkpr`), rather than accepting an HTTP 200 response alone. A successful response from another local project does not verify this site.
