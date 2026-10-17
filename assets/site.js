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

// Email stays usable without script. Enhancements only prepare a subject or copy the public address.
const address = document.querySelector("#contact-address");
const emailLink = document.querySelector("[data-contact-email]");
const topic = document.querySelector("#contact-topic");
const topicHelp = document.querySelector("#contact-topic-help");
const topicContainer = document.querySelector("[data-contact-topics]");
if (address && emailLink && topic && topicHelp && topicContainer) {
  const updateTopic = () => {
    const selected = topic.selectedOptions[0];
    emailLink.href = `mailto:${address.value}?subject=${encodeURIComponent(selected.value)}`;
    topicHelp.textContent = selected.dataset.hint;
  };
  topic.addEventListener("change", updateTopic);
  updateTopic();
  topicContainer.hidden = false;
}
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
