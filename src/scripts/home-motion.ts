import { animate, inView, scroll } from "motion";

const reduceMotion =
  document.documentElement.dataset.resolvedMotion === "reduced";

if (!reduceMotion) {
  document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(1.25rem)";
  });

  inView(
    "[data-reveal]",
    (element) => {
      animate(
        element,
        { opacity: 1, transform: "translateY(0)" },
        { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
      );
    },
    { amount: 0.18 },
  );

  document
    .querySelectorAll<HTMLElement>(".orbit-leaf")
    .forEach((leaf, index) => {
      animate(
        leaf,
        {
          transform: [
            "translateY(0) rotate(0deg)",
            "translateY(-0.75rem) rotate(7deg)",
            "translateY(0) rotate(0deg)",
          ],
        },
        { duration: 4.5 + index, repeat: Infinity, ease: "easeInOut" },
      );
    });

  const visual = document.querySelector<HTMLElement>("[data-hero-visual]");
  if (visual)
    scroll(
      animate(
        visual,
        { transform: ["translateY(0)", "translateY(2.5rem)"] },
        { ease: "linear" },
      ),
      { target: visual, offset: ["start end", "end start"] },
    );
}
