(function () {
  const storageKey = "planteller-display-settings";
  const root = document.documentElement;
  const defaults = {
    theme: "system",
    contrast: "system",
    motion: "system"
  };

  function readSettings() {
    try {
      return Object.assign({}, defaults, JSON.parse(window.localStorage.getItem(storageKey) || "{}"));
    } catch (error) {
      return Object.assign({}, defaults);
    }
  }

  function saveSettings(settings) {
    window.localStorage.setItem(storageKey, JSON.stringify(settings));
  }

  function applySettings(settings) {
    root.dataset.theme = settings.theme;
    root.dataset.contrast = settings.contrast;
    root.dataset.motion = settings.motion;
  }

  const settings = readSettings();
  applySettings(settings);

  function createSettingsWidget() {
    const widget = document.createElement("div");
    widget.className = "display-settings";
    widget.dataset.displaySettings = "";
    widget.innerHTML = `
      <button class="settings-toggle" type="button" aria-label="Anzeige-Einstellungen öffnen" aria-expanded="false" aria-controls="display-settings-panel" data-settings-toggle>
        <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
          <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"></path>
          <path d="M19.4 15a1.8 1.8 0 0 0 .36 1.98l.04.04a2.1 2.1 0 0 1-2.97 2.97l-.04-.04a1.8 1.8 0 0 0-1.98-.36 1.8 1.8 0 0 0-1.1 1.66V21.3a2.1 2.1 0 0 1-4.2 0v-.06a1.8 1.8 0 0 0-1.1-1.66 1.8 1.8 0 0 0-1.98.36l-.04.04a2.1 2.1 0 0 1-2.97-2.97l.04-.04A1.8 1.8 0 0 0 3.8 15a1.8 1.8 0 0 0-1.66-1.1H2.1a2.1 2.1 0 0 1 0-4.2h.06A1.8 1.8 0 0 0 3.8 8.6a1.8 1.8 0 0 0-.36-1.98l-.04-.04a2.1 2.1 0 0 1 2.97-2.97l.04.04a1.8 1.8 0 0 0 1.98.36 1.8 1.8 0 0 0 1.1-1.66V2.1a2.1 2.1 0 0 1 4.2 0v.06a1.8 1.8 0 0 0 1.1 1.66 1.8 1.8 0 0 0 1.98-.36l.04-.04a2.1 2.1 0 0 1 2.97 2.97l-.04.04A1.8 1.8 0 0 0 19.4 8.6a1.8 1.8 0 0 0 1.66 1.1h.06a2.1 2.1 0 0 1 0 4.2h-.06A1.8 1.8 0 0 0 19.4 15Z"></path>
        </svg>
      </button>
      <form class="settings-panel" id="display-settings-panel" data-settings-panel hidden>
        <fieldset>
          <legend>Darstellung</legend>
          <label><input type="radio" name="theme" value="system" data-setting> System</label>
          <label><input type="radio" name="theme" value="light" data-setting> Hell</label>
          <label><input type="radio" name="theme" value="dark" data-setting> Dunkel</label>
        </fieldset>
        <fieldset>
          <legend>Kontrast</legend>
          <label><input type="radio" name="contrast" value="system" data-setting> System</label>
          <label><input type="radio" name="contrast" value="standard" data-setting> Standard</label>
          <label><input type="radio" name="contrast" value="high" data-setting> Hoch</label>
        </fieldset>
        <fieldset>
          <legend>Bewegung</legend>
          <label><input type="radio" name="motion" value="system" data-setting> System</label>
          <label><input type="radio" name="motion" value="reduced" data-setting> Reduziert</label>
        </fieldset>
      </form>
    `;
    return widget;
  }

  const nav = document.querySelector(".site-header .nav");
  if (nav && !document.querySelector("[data-display-settings]")) {
    nav.appendChild(createSettingsWidget());
  }

  const navToggle = document.querySelector("[data-nav-toggle]");
  const navMenu = document.querySelector("[data-nav-menu]");

  function setNavOpen(isOpen) {
    if (!navToggle || !navMenu) return;
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Navigation schließen" : "Navigation öffnen");
    navMenu.classList.toggle("is-open", isOpen);
  }

  if (navToggle && navMenu) {
    document.body.classList.add("nav-js");
    setNavOpen(false);
    navToggle.addEventListener("click", () => {
      setNavOpen(navToggle.getAttribute("aria-expanded") !== "true");
    });
    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        setNavOpen(false);
      });
    });
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || navToggle.getAttribute("aria-expanded") !== "true") return;
      setNavOpen(false);
      navToggle.focus();
    });
  }

  document.querySelectorAll("[data-display-settings]").forEach((widget) => {
    const toggle = widget.querySelector("[data-settings-toggle]");
    const panel = widget.querySelector("[data-settings-panel]");
    if (!toggle || !panel) return;

    function setOpen(isOpen) {
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Anzeige-Einstellungen schließen" : "Anzeige-Einstellungen öffnen");
      panel.hidden = !isOpen;
    }

    function syncControls() {
      widget.querySelectorAll("[data-setting]").forEach((input) => {
        input.checked = settings[input.name] === input.value;
      });
    }

    syncControls();
    setOpen(false);

    toggle.addEventListener("click", () => {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    widget.querySelectorAll("[data-setting]").forEach((input) => {
      input.addEventListener("change", () => {
        settings[input.name] = input.value;
        applySettings(settings);
        saveSettings(settings);
        syncControls();
        window.dispatchEvent(new CustomEvent("planteller-settings-change", { detail: Object.assign({}, settings) }));
      });
    });

    document.addEventListener("click", (event) => {
      if (!widget.contains(event.target)) setOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || panel.hidden) return;
      setOpen(false);
      toggle.focus();
    });
  });
})();
