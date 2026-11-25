const header = document.getElementById("header");
const toggle = document.getElementById("menuToggle");
const menu = document.getElementById("menu");
const hero = document.getElementById("inicio");
const links = document.querySelectorAll(".menu__link");
const sections = document.querySelectorAll("main section[id]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let lastY = window.scrollY;
let ticking = false;

const showHeader = () => header.classList.remove("is-hidden");
const hideHeader = () => header.classList.add("is-hidden");

const closeMenu = () => {
  menu.classList.remove("is-open");
  toggle.classList.remove("is-active");
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Abrir menú");
};

toggle.addEventListener("click", () => {
  const isOpen = menu.classList.toggle("is-open");
  toggle.classList.toggle("is-active", isOpen);
  toggle.setAttribute("aria-expanded", String(isOpen));
  toggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
  showHeader();
});

links.forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

header.addEventListener("focusin", showHeader);

const updateHeader = () => {
  const y = window.scrollY;
  header.classList.toggle("is-scrolled", y > 10);
  header.classList.toggle("is-over-hero", y < hero.offsetHeight - 140);

  if (y < 80 || menu.classList.contains("is-open")) {
    showHeader();
    lastY = y;
    return;
  }

  const delta = y - lastY;
  if (Math.abs(delta) < 6) return;

  if (delta > 0) hideHeader();
  else showHeader();

  lastY = y;
};

window.addEventListener(
  "scroll",
  () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateHeader();
      ticking = false;
    });
  },
  { passive: true }
);

window.addEventListener("resize", () => {
  if (window.innerWidth > 820) closeMenu();
  updateHeader();
});

updateHeader();

const setActive = (id) => {
  links.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
  });
};

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);

sections.forEach((section) => sectionObserver.observe(section));

const revealSelector =
  ".eyebrow, .section__title, .section__intro, .subtitle, .card, .step, .perk, .member, .product__media, .product__body, .location, .contact, .cta__box";

if (!reduceMotion && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add("is-visible");
        revealObserver.unobserve(el);
        setTimeout(() => {
          el.classList.remove("reveal", "is-visible");
          el.style.removeProperty("--d");
        }, 1600);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );

  document.querySelectorAll(revealSelector).forEach((el) => {
    const siblings = Array.from(el.parentElement.children).filter((child) => child.matches(revealSelector));
    const index = siblings.indexOf(el);
    el.style.setProperty("--d", Math.min(index * 0.1, 0.4) + "s");
    el.classList.add("reveal");
    revealObserver.observe(el);
  });
}