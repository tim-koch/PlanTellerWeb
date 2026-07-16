import {
  DEFAULT_DISPLAY_SETTINGS,
  DISPLAY_SETTINGS_KEY,
  type DisplaySettings,
} from "../lib/site";

const root = document.documentElement;
const media = {
  theme: matchMedia("(prefers-color-scheme: dark)"),
  contrast: matchMedia("(prefers-contrast: more)"),
  motion: matchMedia("(prefers-reduced-motion: reduce)"),
};

function readSettings(): DisplaySettings {
  try {
    return {
      ...DEFAULT_DISPLAY_SETTINGS,
      ...JSON.parse(localStorage.getItem(DISPLAY_SETTINGS_KEY) || "{}"),
    };
  } catch {
    return { ...DEFAULT_DISPLAY_SETTINGS };
  }
}

function applySettings(settings: DisplaySettings) {
  root.dataset.theme = settings.theme;
  root.dataset.contrast = settings.contrast;
  root.dataset.motion = settings.motion;
  root.dataset.resolvedTheme =
    settings.theme === "system"
      ? media.theme.matches
        ? "dark"
        : "light"
      : settings.theme;
  root.dataset.resolvedContrast =
    settings.contrast === "system"
      ? media.contrast.matches
        ? "high"
        : "standard"
      : settings.contrast;
  root.dataset.resolvedMotion =
    settings.motion === "reduced" ||
    (settings.motion === "system" && media.motion.matches)
      ? "reduced"
      : "standard";
  document.dispatchEvent(
    new CustomEvent("planteller-theme-change", { detail: settings }),
  );
}

const settings = readSettings();
applySettings(settings);
Object.values(media).forEach((query) =>
  query.addEventListener("change", () => applySettings(settings)),
);

document
  .querySelectorAll<HTMLElement>("[data-display-settings]")
  .forEach((widget) => {
    const toggle = widget.querySelector<HTMLButtonElement>(
      "[data-settings-toggle]",
    );
    const panel = widget.querySelector<HTMLFormElement>(
      "[data-settings-panel]",
    );
    if (!toggle || !panel) return;
    const setOpen = (open: boolean) => {
      panel.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute(
        "aria-label",
        open
          ? "Anzeige-Einstellungen schließen"
          : "Anzeige-Einstellungen öffnen",
      );
    };
    panel.querySelectorAll<HTMLInputElement>("input").forEach((input) => {
      input.checked =
        settings[input.name as keyof DisplaySettings] === input.value;
      input.addEventListener("change", () => {
        if (!input.checked) return;
        const key = input.name as keyof DisplaySettings;
        settings[key] = input.value as never;
        localStorage.setItem(DISPLAY_SETTINGS_KEY, JSON.stringify(settings));
        applySettings(settings);
      });
    });
    toggle.addEventListener("click", () => setOpen(Boolean(panel.hidden)));
    document.addEventListener("click", (event) => {
      if (!widget.contains(event.target as Node)) setOpen(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !panel.hidden) {
        setOpen(false);
        toggle.focus();
      }
    });
  });

const header = document.querySelector<HTMLElement>("[data-site-header]");
const headerInner = document.querySelector<HTMLElement>("[data-header-inner]");
const updateHeader = () => {
  const compact = window.scrollY > 20;
  header?.classList.toggle("border-[var(--line)]", compact);
  headerInner?.classList.toggle("!min-h-16", compact);
};
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const menuToggle =
  document.querySelector<HTMLButtonElement>("[data-menu-toggle]");
const menu = document.querySelector<HTMLElement>("[data-mobile-menu]");
if (menuToggle && menu) {
  const setMenuOpen = (open: boolean) => {
    menu.hidden = !open;
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute(
      "aria-label",
      open ? "Navigation schließen" : "Navigation öffnen",
    );
    if (open) menu.querySelector<HTMLAnchorElement>("a")?.focus();
  };
  menuToggle.addEventListener("click", () => setMenuOpen(Boolean(menu.hidden)));
  menu
    .querySelectorAll("a")
    .forEach((link) =>
      link.addEventListener("click", () => setMenuOpen(false)),
    );
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !menu.hidden) {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });
}
