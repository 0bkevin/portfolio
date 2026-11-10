// Tap or click an image inside article or case study content to see it full size in a native
// dialog; tap again or press Escape to close. Images that are already links are left alone.

const getDialog = (): HTMLDialogElement => {
  const existing = document.getElementById("image-zoom");
  if (existing instanceof HTMLDialogElement) return existing;

  const dialog = document.createElement("dialog");
  dialog.id = "image-zoom";
  dialog.className = "image-zoom";
  dialog.setAttribute("aria-label", "Enlarged image");
  const image = document.createElement("img");
  image.alt = "";
  const hint = document.createElement("p");
  hint.className = "image-zoom-hint";
  hint.textContent = "tap or press esc to close";
  dialog.append(image, hint);
  dialog.addEventListener("click", () => dialog.close());
  document.body.append(dialog);
  return dialog;
};

document.addEventListener("click", (event) => {
  if (!(event.target instanceof HTMLImageElement)) return;
  const source = event.target;
  if (!source.closest(".prose") || source.closest("a")) return;

  const dialog = getDialog();
  const image = dialog.querySelector("img");
  if (!image) return;
  image.src = source.currentSrc || source.src;
  image.alt = source.alt;
  dialog.showModal();
});
