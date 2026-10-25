// Theme switch, scroll reveal, nav indicator, progress bar and pointer glow.
// Everything degrades to a normal static page if this file fails to load.

const root = document.documentElement;
const reduce = matchMedia("(prefers-reduced-motion: reduce)");
const dark = matchMedia("(prefers-color-scheme: dark)");

/* ───── Theme ───── */
const themeBtn = document.getElementById("theme");
const stored = () => {
  try { return localStorage.getItem("theme"); } catch { return null; }
};
const currentTheme = () => root.dataset.theme || (dark.matches ? "dark" : "light");

function applyTheme(next, persist) {
  root.dataset.theme = next;
  if (persist) {
    try { localStorage.setItem("theme", next); } catch { /* storage blocked */ }
  }
  themeBtn?.setAttribute("aria-label", next === "dark" ? "Switch to light theme" : "Switch to dark theme");
}
applyTheme(currentTheme(), false);

themeBtn?.addEventListener("click", (e) => {
  const next = currentTheme() === "dark" ? "light" : "dark";
  if (!document.startViewTransition || reduce.matches) {
    applyTheme(next, true);
    return;
  }
  const x = e.clientX || innerWidth / 2;
  const y = e.clientY || 0;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const transition = document.startViewTransition(() => applyTheme(next, true));
  transition.ready.then(() => {
    root.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      { duration: 650, easing: "cubic-bezier(0.22, 0.8, 0.2, 1)", pseudoElement: "::view-transition-new(root)" }
    );
  }).catch(() => {});
});

// Follow the system setting until the visitor picks one themselves.
dark.addEventListener("change", () => {
  if (!stored()) applyTheme(dark.matches ? "dark" : "light", false);
});

/* ───── Reveal on scroll ───── */
const revealTargets = [...document.querySelectorAll("[data-reveal]")];
function settle(el) {
  // Hand the element back to its normal hover transitions once it has appeared.
  setTimeout(() => {
    el.removeAttribute("data-reveal");
    el.classList.remove("in");
    el.style.removeProperty("--d");
  }, 1100 + (parseInt(el.style.getPropertyValue("--d")) || 0));
}
if ("IntersectionObserver" in window && !reduce.matches) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("in");
        io.unobserve(entry.target);
        settle(entry.target);
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.06 }
  );
  revealTargets.forEach((el) => io.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add("in"));
}

/* ───── Scroll progress + header state ───── */
const bar = document.querySelector(".progress span");
const header = document.querySelector(".top");
let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const max = root.scrollHeight - innerHeight;
    if (bar) bar.style.transform = `scaleX(${max > 0 ? Math.min(scrollY / max, 1) : 0})`;
    header?.classList.toggle("scrolled", scrollY > 8);
    ticking = false;
  });
}
addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ───── Active section indicator ───── */
const nav = document.querySelector("nav.main");
const pill = document.querySelector(".nav-pill");
const links = [...document.querySelectorAll("nav.main a")];
const byId = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
let activeId = null;

function setActive(id) {
  activeId = id;
  links.forEach((a) => a.removeAttribute("aria-current"));
  const link = byId.get(id);
  if (!link || !pill) {
    if (pill) pill.style.opacity = "0";
    return;
  }
  link.setAttribute("aria-current", "true");
  const n = nav.getBoundingClientRect();
  const a = link.getBoundingClientRect();
  pill.style.opacity = "1";
  pill.style.width = `${a.width}px`;
  pill.style.transform = `translateX(${a.left - n.left + nav.scrollLeft}px)`;
  link.scrollIntoView?.({ block: "nearest", inline: "center", behavior: reduce.matches ? "auto" : "smooth" });
}

if ("IntersectionObserver" in window) {
  const spy = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
    { rootMargin: "-45% 0px -50% 0px" }
  );
  ["top", ...byId.keys()].forEach((id) => {
    const el = document.getElementById(id);
    if (el) spy.observe(el);
  });
}
addEventListener("resize", () => activeId && setActive(activeId), { passive: true });

/* ───── Pointer glow ───── */
document.addEventListener(
  "pointermove",
  (e) => {
    const el = e.target.closest?.("[data-spot]");
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  },
  { passive: true }
);
