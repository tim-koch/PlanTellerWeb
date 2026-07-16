const dialog = document.querySelector<HTMLDialogElement>("[data-lightbox]");
const dialogImage = dialog?.querySelector<HTMLImageElement>(
  "[data-lightbox-image]",
);
const closeButton = dialog?.querySelector<HTMLButtonElement>(
  "[data-lightbox-close]",
);
let lastTrigger: HTMLButtonElement | null = null;

document
  .querySelectorAll<HTMLButtonElement>("[data-gallery-zoom]")
  .forEach((button) => {
    button.addEventListener("click", () => {
      const images = button.querySelectorAll<HTMLImageElement>("img");
      const source =
        Array.from(images).find(
          (image) =>
            getComputedStyle(image.closest("[data-theme-picture]")!).display !==
            "none",
        ) ?? images[0];
      if (!dialog || !dialogImage || !source) return;
      lastTrigger = button;
      dialogImage.src = source.currentSrc || source.src;
      dialogImage.alt = source.alt;
      dialog.showModal();
      closeButton?.focus();
    });
  });

const closeLightbox = () => {
  if (!dialog?.open) return;
  dialog.close();
};

const resetLightbox = () => {
  if (dialogImage) {
    dialogImage.src = "";
    dialogImage.alt = "";
  }
  lastTrigger?.focus();
  lastTrigger = null;
};

closeButton?.addEventListener("click", closeLightbox);
dialog?.addEventListener("click", (event) => {
  if (event.target === dialog) closeLightbox();
});
dialog?.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeLightbox();
});
dialog?.addEventListener("close", resetLightbox);

export {};
