import {
  createAppDeepLink,
  isAppLinkRoute,
  readAppLinkToken,
} from "../lib/app-link";

const container = document.querySelector<HTMLElement>("[data-app-link-route]");
const tokenElement =
  container?.querySelector<HTMLElement>("[data-share-token]");
const openButton =
  container?.querySelector<HTMLAnchorElement>("[data-open-app]");
const copyButton =
  container?.querySelector<HTMLButtonElement>("[data-copy-token]");
const status = container?.querySelector<HTMLElement>("[data-share-status]");
const route = container?.dataset.appLinkRoute;

function announce(message: string, error = false) {
  if (!status) return;
  status.textContent = message;
  status.dataset.error = String(error);
}

if (
  container &&
  tokenElement &&
  openButton &&
  copyButton &&
  isAppLinkRoute(route)
) {
  const token = readAppLinkToken(new URL(location.href), route);
  if (token) {
    tokenElement.textContent = token;
    openButton.href = createAppDeepLink(route, token);
    copyButton.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(token);
        announce(container.dataset.copiedMessage ?? "Code wurde kopiert.");
      } catch {
        announce(
          "Kopieren war nicht möglich. Bitte markiere den Code manuell.",
          true,
        );
      }
    });
  } else {
    tokenElement.textContent = "Kein gültiger Code im Link gefunden";
    openButton.removeAttribute("href");
    openButton.setAttribute("aria-disabled", "true");
    copyButton.disabled = true;
    announce(
      container.dataset.missingMessage ?? "Bitte fordere einen neuen Link an.",
      true,
    );
  }
}
