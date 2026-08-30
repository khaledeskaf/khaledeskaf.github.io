const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

const header = document.getElementById("siteHeader");
const toggle = document.getElementById("menuToggle");
const menu = document.getElementById("mobileMenu");
const overlay = document.getElementById("menuOverlay");

function updateHeader() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 80);
}
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

function setMenu(open) {
  if (!menu || !toggle) return;

  menu.classList.toggle("open", open);
  menu.setAttribute("aria-hidden", String(!open));
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  document.body.classList.toggle("menu-open", open);

  if (overlay) {
    overlay.classList.toggle("open", open);
    overlay.setAttribute("aria-hidden", String(!open));
  }

  if ("inert" in menu) {
    menu.inert = !open;
  }
}

if (menu && "inert" in menu) menu.inert = true;

if (toggle) {
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    setMenu(open);
  });
}

if (overlay) overlay.addEventListener("click", () => setMenu(false));

if (menu) {
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && toggle?.getAttribute("aria-expanded") === "true") {
    setMenu(false);
    toggle.focus();
  }
});

// Progressive enhancement: reveal content only if IntersectionObserver exists.
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i % 4, 3) * 70}ms`;
    observer.observe(el);
  });
} else {
  revealElements.forEach((el) => el.classList.add("visible"));
}

const glow = document.getElementById("cursorGlow");
if (glow && window.matchMedia("(pointer:fine)").matches) {
  window.addEventListener("pointermove", (event) => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  }, { passive: true });
}
