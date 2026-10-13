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
