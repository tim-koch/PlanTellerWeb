import {
  createCollectionDeepLink,
  readCollectionShareToken,
} from "../lib/collection-share";

const tokenElement = document.querySelector<HTMLElement>("[data-share-token]");
const openButton = document.querySelector<HTMLAnchorElement>("[data-open-app]");
const copyButton =
  document.querySelector<HTMLButtonElement>("[data-copy-token]");
const status = document.querySelector<HTMLElement>("[data-share-status]");
const token = readCollectionShareToken(new URL(location.href));

function announce(message: string, error = false) {
  if (!status) return;
  status.textContent = message;
  status.dataset.error = String(error);
}

if (tokenElement && openButton && copyButton) {
  if (token) {
    tokenElement.textContent = token;
    openButton.href = createCollectionDeepLink(token);
    copyButton.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(token);
        announce("Freigabe-Code wurde kopiert.");
      } catch {
        announce(
          "Kopieren war nicht möglich. Bitte markiere den Code manuell.",
          true,
        );
      }
    });
  } else {
    tokenElement.textContent = "Kein Freigabe-Code im Link gefunden";
    openButton.removeAttribute("href");
    openButton.setAttribute("aria-disabled", "true");
    copyButton.disabled = true;
    announce("Bitte teile das Buch oder Menü erneut aus der App.", true);
  }
}
