const button = document.querySelector(".menu-button");
const navigation = document.querySelector("#primary-nav");
if (button && navigation) {
  const mobile = window.matchMedia("(max-width: 600px)");
  const setExpanded = (expanded) => {
    button.setAttribute("aria-expanded", String(expanded));
    navigation.dataset.collapsed = String(!expanded);
  };
  const sync = () => {
    button.hidden = !mobile.matches;
    setExpanded(!mobile.matches);
  };
  button.addEventListener("click", () =>
    setExpanded(button.getAttribute("aria-expanded") !== "true"),
  );
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      mobile.matches &&
      button.getAttribute("aria-expanded") === "true"
    ) {
      setExpanded(false);
      button.focus();
    }
  });
  mobile.addEventListener("change", sync);
  sync();
}
for (const trigger of document.querySelectorAll("[data-open-dialog]")) {
  const dialog = document.getElementById(trigger.dataset.openDialog);
  if (!(dialog instanceof HTMLDialogElement)) continue;
  trigger.addEventListener("click", () => dialog.showModal());
  dialog
    .querySelector("[data-close-dialog]")
    ?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      const box = dialog.getBoundingClientRect();
      if (
        event.clientX < box.left ||
        event.clientX > box.right ||
        event.clientY < box.top ||
        event.clientY > box.bottom
      )
        dialog.close();
    }
  });
  dialog.addEventListener("close", () => trigger.focus());
}

const address = document.querySelector("#contact-address");
const copyEmail = document.querySelector("[data-copy-email]");
const copyStatus = document.querySelector("[data-copy-status]");
if (address && copyEmail && copyStatus) {
  copyEmail.hidden = false;
  copyEmail.addEventListener("click", async () => {
    copyStatus.textContent = "Copying email address…";
    try {
      await navigator.clipboard.writeText(address.value);
      copyStatus.textContent =
        "Email address copied. Paste it into your email service.";
    } catch {
      address.focus();
      address.select();
      copyStatus.textContent =
        "Automatic copying isn’t available. The address is selected so you can copy it yourself.";
    }
  });
}

const contactForm = document.querySelector("#contact-form");
if (contactForm) {
  const sendButton = contactForm.querySelector("[data-send-message]");
  const fields = contactForm.querySelector("fieldset");
  const feedback = contactForm.querySelector("[data-form-status]");
  const errors = contactForm.querySelectorAll("[data-field-error]");
  for (const name of ["name", "message"]) {
    const field = contactForm.elements.namedItem(name);
    field.addEventListener("input", () => field.setCustomValidity(""));
  }
  let sending = false;
  const buttonLabel = sendButton.textContent;
  const restoreControls = () => {
    sending = false;
    fields.disabled = contactForm.dataset.configured !== "true";
    sendButton.disabled = fields.disabled;
    sendButton.textContent = buttonLabel;
    contactForm.removeAttribute("aria-busy");
  };
  if (typeof window !== "undefined")
    window.addEventListener("pageshow", (event) => {
      if (event.persisted) {
        restoreControls();
        feedback.textContent = "";
      }
    });
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (sending) return;
    feedback.textContent = "";
    feedback.dataset.state = "";
    for (const error of errors) {
      error.textContent = "";
      contactForm.elements
        .namedItem(error.dataset.fieldError)
        ?.removeAttribute("aria-invalid");
    }
    if (
      contactForm.dataset.configured !== "true" ||
      !/^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(contactForm.action)
    ) {
      feedback.textContent =
        "The form isn’t available yet. Please use the email address below.";
      return;
    }
    for (const name of ["name", "message"]) {
      const field = contactForm.elements.namedItem(name);
      field.setCustomValidity(
        field.value.trim() ? "" : "Please complete this field.",
      );
    }
    if (!contactForm.reportValidity()) return;
    const payload = new FormData(contactForm);
    if (payload.get("_gotcha")) {
      feedback.textContent =
        "The message couldn’t be sent. Please use the email address below.";
      feedback.dataset.state = "error";
      return;
    }
    for (const name of ["name", "email", "message"])
      payload.set(name, String(payload.get(name)).trim());
    if (contactForm.dataset.delivery === "hosted") {
      for (const name of ["name", "email", "message"])
        contactForm.elements.namedItem(name).value = payload.get(name);
      sending = true;
      sendButton.disabled = true;
      sendButton.textContent = "Opening verification…";
      contactForm.setAttribute("aria-busy", "true");
      feedback.textContent =
        "Continuing to Formspree for verification and delivery confirmation…";
      try {
        HTMLFormElement.prototype.submit.call(contactForm);
      } catch {
        restoreControls();
        feedback.textContent =
          "Verification couldn’t open. Your text is still here. Please use the email address below.";
        feedback.dataset.state = "error";
      }
      return;
    }
    sending = true;
    fields.disabled = true;
    sendButton.disabled = true;
    sendButton.textContent = "Sending…";
    contactForm.setAttribute("aria-busy", "true");
    feedback.textContent = "Sending your message…";
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: payload,
        headers: { Accept: "application/json" },
        credentials: "omit",
        signal: controller.signal,
      });
      const result = await response.json();
      if (!response.ok || result.ok === false || result.errors?.length) {
        let firstInvalid;
        for (const issue of result.errors || []) {
          const field = contactForm.elements.namedItem(issue.field);
          const error = [...errors].find(
            (node) => node.dataset.fieldError === issue.field,
          );
          if (field && error) {
            error.textContent = "Please check this field and try again.";
            field.setAttribute("aria-invalid", "true");
            firstInvalid ||= field;
          }
        }
        fields.disabled = false;
        firstInvalid?.focus();
        feedback.textContent =
          response.status === 429
            ? "Too many messages right now. Please wait before trying again, or use email. Your text is still here."
            : "Your message was not accepted. Please review the form or use email instead. Your text is still here.";
        feedback.dataset.state = "error";
        return;
      }
      contactForm.reset();
      feedback.textContent =
        "Thank you. Your message was accepted for delivery. You don’t need to send it again.";
      feedback.dataset.state = "success";
    } catch {
      feedback.textContent =
        "Delivery couldn’t be confirmed. Your text is still here. You can try again or use the email address below.";
      feedback.dataset.state = "error";
    } finally {
      clearTimeout(timeout);
      restoreControls();
    }
  });
}
