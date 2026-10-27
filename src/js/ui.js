// Theme switch, reveal on scroll, count-up numbers and the active nav link.
// No scroll listeners: everything runs off IntersectionObserver so scrolling stays smooth.

const root = document.documentElement;
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ───── Lamplight (theme) ───── */
const btn = document.getElementById("theme");
const system = matchMedia("(prefers-color-scheme: dark)");
const stored = () => {
  try { return localStorage.getItem("theme"); } catch { return null; }
};
const current = () => root.dataset.theme || (system.matches ? "dark" : "light");

function apply(theme, persist) {
  root.dataset.theme = theme;
  btn?.setAttribute("aria-pressed", String(theme === "dark"));
  if (persist) {
    try { localStorage.setItem("theme", theme); } catch { /* storage blocked */ }
  }
}
apply(current(), false);

btn?.addEventListener("click", () => {
  const next = current() === "dark" ? "light" : "dark";
  if (document.startViewTransition && !reduce) document.startViewTransition(() => apply(next, true));
  else apply(next, true);
});
system.addEventListener("change", () => {
  if (!stored()) apply(system.matches ? "dark" : "light", false);
});

/* ───── Reveal + count-up ───── */
function countUp(el) {
  const end = Number(el.dataset.count);
  if (!Number.isFinite(end)) return;
  const t0 = performance.now();
  const dur = 1000;
  const step = (now) => {
    const t = Math.min(1, (now - t0) / dur);
    el.textContent = Math.round(end * (1 - Math.pow(1 - t, 3))).toLocaleString("en-US");
    if (t < 1) requestAnimationFrame(step);
  };
  el.textContent = "0";
  requestAnimationFrame(step);
}

const targets = document.querySelectorAll(".rv");
if ("IntersectionObserver" in window && !reduce) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add("in");
        e.target.querySelectorAll("[data-count]").forEach(countUp);
        io.unobserve(e.target);
      }
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
  );
  targets.forEach((el) => io.observe(el));
} else {
  targets.forEach((el) => el.classList.add("in"));
}

/* ───── Active section in the nav ───── */
const links = [...document.querySelectorAll("nav.main a")];
const byId = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
if ("IntersectionObserver" in window) {
  const spy = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        links.forEach((a) => a.removeAttribute("aria-current"));
        byId.get(e.target.id)?.setAttribute("aria-current", "true");
      }
    },
    { rootMargin: "-35% 0px -60% 0px" }
  );
  byId.forEach((_, id) => {
    const el = document.getElementById(id);
    if (el) spy.observe(el);
  });
}

/* ───── Open a plate when a search result links to it ───── */
function openPlate() {
  const id = location.hash.slice(1);
  if (!id) return;
  document.getElementById(id)?.querySelector("details")?.setAttribute("open", "");
}
addEventListener("hashchange", openPlate);
openPlate();
