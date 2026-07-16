import { initForm } from "@formspree/ajax/dist/index.mjs";

type ContactCategory =
  "allgemein" | "beta" | "fehler" | "datenschutz" | "konto-loeschen";

const categories: Record<ContactCategory, string> = {
  allgemein: "Allgemeine Frage",
  beta: "Beta-Anfrage",
  fehler: "Fehlermeldung",
  datenschutz: "Datenschutzanfrage",
  "konto-loeschen": "Kontolöschung",
};

const form = document.querySelector<HTMLFormElement>("#contact-form");
const category = form?.querySelector<HTMLSelectElement>("#anliegen");
const subject = form?.querySelector<HTMLInputElement>("[data-contact-subject]");

function selectedCategory(): ContactCategory {
  const value = category?.value as ContactCategory;
  return value in categories ? value : "allgemein";
}

function syncSubject() {
  if (subject)
    subject.value = `PlanTeller Website – ${categories[selectedCategory()]}`;
}

if (form && category) {
  const requested = new URLSearchParams(location.search).get(
    "anliegen",
  ) as ContactCategory | null;
  category.value =
    requested && requested in categories ? requested : "allgemein";
  syncSubject();
  category.addEventListener("change", syncSubject);

  initForm({
    formElement: form,
    formId: "mojgjzlv",
    useDefaultStyles: false,
    data: { quelle: () => location.pathname },
  });
}
