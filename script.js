const header = document.getElementById("header");
const toggle = document.getElementById("menuToggle");
const menu = document.getElementById("menu");
const links = document.querySelectorAll(".menu__link");
const sections = document.querySelectorAll("main section[id]");

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
});

links.forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 820) closeMenu();
});

const onScroll = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 10);
};

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const setActive = (id) => {
  links.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
  });
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);

sections.forEach((section) => observer.observe(section));