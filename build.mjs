// Generates dist/ from src/content.mjs. No dependencies. Run: node build.mjs
import { mkdir, rm, cp, writeFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { site, experience, projects, skills, education, measurements } from "./src/content.mjs";

const root = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(root, "dist");
const src = path.join(root, "src");

/* ───── helpers ───── */
const esc = (s) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const isExternal = (href) => /^https?:\/\//i.test(href);
const num = (n) => n.toLocaleString("en-US");
const pad = (n) => String(n).padStart(2, "0");

const icons = {
  arrow: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>`,
  download: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14"/></svg>`,
  mail: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>`,
};

// Small seeded generator so the hand-drawn edges are the same on every build.
function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
}

// A wobbly hand-drawn rectangle, stretched to its box with a non-scaling stroke.
function sketch(seed) {
  const r = rng(seed);
  const j = (a) => (r() - 0.5) * a;
  const f = (n) => n.toFixed(2);
  const one = (amp) => {
    const p = [
      [1 + j(amp), 1 + j(amp)],
      [99 + j(amp), 1 + j(amp)],
      [99 + j(amp), 99 + j(amp)],
      [1 + j(amp), 99 + j(amp)],
    ];
    let d = `M${f(p[0][0])} ${f(p[0][1])}`;
    for (let i = 0; i < 4; i++) {
      const A = p[i];
      const B = p[(i + 1) % 4];
      d += ` Q${f((A[0] + B[0]) / 2 + j(amp * 1.6))} ${f((A[1] + B[1]) / 2 + j(amp * 1.6))} ${f(B[0])} ${f(B[1])}`;
    }
    return d;
  };
  return `<svg class="sketch" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="${one(1.1)}"/><path class="again" d="${one(1.9)}"/></svg>`;
}

// A fern sprig for the hero corner.
function sprig() {
  const P = [[40, 270], [30, 190], [80, 110], [150, 10]];
  const at = (t) => {
    const u = 1 - t;
    return [0, 1].map((k) => u ** 3 * P[0][k] + 3 * u * u * t * P[1][k] + 3 * u * t * t * P[2][k] + t ** 3 * P[3][k]);
  };
  const leaf = "M0 0C9 -12 26 -12 40 0C26 12 9 12 0 0Z";
  let leaves = "";
  for (let i = 1; i <= 11; i++) {
    const t = i / 12;
    const [x, y] = at(t);
    const [x2, y2] = at(t + 0.01);
    const ang = (Math.atan2(y2 - y, x2 - x) * 180) / Math.PI;
    const side = i % 2 ? 1 : -1;
    leaves += `<path d="${leaf}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(ang + side * 52).toFixed(1)}) scale(${(1.25 - t * 0.7).toFixed(2)})"/>`;
  }
  const [tx, ty] = at(1);
  leaves += `<path d="${leaf}" transform="translate(${tx} ${ty}) rotate(-62) scale(0.55)"/>`;
  return `<svg class="sprig" viewBox="0 0 200 290" aria-hidden="true"><path class="stem" d="M40 270C30 190 80 110 150 10"/>${leaves}</svg>`;
}

const squig = () =>
  `<svg class="squig" viewBox="0 0 120 10" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M2 5 Q 12 0 22 5 T 42 5 T 62 5 T 82 5 T 102 5 T 118 5"/></svg>`;

const link = (href, label, { style = "", icon = "", download = "" } = {}) => {
  const cls = ["btn", style].filter(Boolean).join(" ");
  const ext = isExternal(href) && !download ? ' target="_blank" rel="noopener noreferrer"' : "";
  const dl = download ? ` download="${esc(download)}"` : "";
  return `<a class="${cls}" href="${esc(href)}"${ext}${dl}>${icon}${esc(label)}</a>`;
};

const rv = (i = 0) => ` class="rv" style="--d:${i * 70}ms"`;
const rvc = (cls, i = 0) => ` class="${cls} rv" style="--d:${i * 70}ms"`;
const tags = (list) => (list?.length ? `<ul class="tags">${list.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : "");
const points = (list) => (list?.length ? `<ul class="points">${list.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>` : "");

const c = site.contact ?? {};
const fullName = site.fullName ?? site.name;
const [first, ...rest] = fullName.split(" ");
const title = `${fullName} | ${site.role}`;
const github = c.github ? c.github.replace(/^https?:\/\//, "") : "";
const year = new Date().getFullYear();

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: fullName,
  jobTitle: site.role,
  worksFor: { "@type": "Organization", name: site.employer },
  address: { "@type": "PostalAddress", addressLocality: site.location },
  description: site.description,
  ...(site.url ? { url: site.url } : {}),
  sameAs: [c.github, c.linkedin].filter(Boolean),
};

const questions = [
  "What have you built with RAG?",
  "Do you have experience with LangGraph?",
  "How do you evaluate LLMs?",
  "Which AWS services do you use?",
  "What did you do at Liquidmind?",
];

const nav = [
  ["measurements", "Measurements"],
  ["expeditions", "Expeditions"],
  ["specimens", "Specimens"],
  ["try-it", "Try it"],
  ["toolkit", "Toolkit"],
  ["contact", "Send word"],
];

const resumeBtn = (style) =>
  c.resume ? link(c.resume, "Resume (PDF)", { style, icon: icons.download, download: c.resumeFileName || "resume.pdf" }) : "";
const contactButtons = (primaryResume) =>
  [
    resumeBtn(primaryResume ? "primary" : ""),
    c.email && link(`mailto:${c.email}`, "Email me", { icon: icons.mail }),
    c.linkedin && link(c.linkedin, "LinkedIn", { icon: icons.arrow }),
    c.github && link(c.github, "GitHub", { icon: icons.arrow }),
  ]
    .filter(Boolean)
    .join("\n          ");

const chapterHead = (id, kicker, heading, sub) => `
      <div${rvc("chapter-head")}>
        <p class="hand">${esc(kicker)}</p>
        <h2 id="h-${id}">${esc(heading)}</h2>
        ${squig()}
        ${sub ? `<p class="sub">${esc(sub)}</p>` : ""}
      </div>`;

/* ───── sections ───── */
const statHtml = (m, i) => `
        <li${rvc("stat", i)}>
          <span class="num"><span data-count="${m.value}">${num(m.value)}</span>${esc(m.suffix)}</span>
          <p>${esc(m.label)}</p>
          <span class="hand">${esc(m.source)}</span>
        </li>`;

const expHtml = (r, i) => `
        <li class="exp rv" id="role-${esc(r.id)}" style="--d:${i * 70}ms">
          <div class="exp-meta">
            <span class="idx">${pad(i + 1)}</span>
            ${r.period ? `<p>${esc(r.period)}</p>` : ""}
            ${r.place ? `<p>${esc(r.place)}</p>` : ""}
          </div>
          <div class="exp-main">
            <h3>${esc(r.org)}</h3>
            <p class="exp-role">${esc(r.role)}</p>
            ${r.summary ? `<p class="exp-summary">${esc(r.summary)}</p>` : ""}
            ${(r.highlights ?? [])
              .map(
                (h) => `
            <div class="work">
              <h4>${esc(h.title)}</h4>
              ${h.text ? `<p>${esc(h.text)}</p>` : ""}
              ${points(h.points)}
              ${tags(h.tags)}
            </div>`
              )
              .join("")}
          </div>
        </li>`;

const schooling = education.filter((e) => e.kind === "Education");
const badges = education.filter((e) => e.kind !== "Education");
const entryHtml = (e) => `
          <div class="entry">
            <p class="hand">${esc(e.kind)}</p>
            <h4>${esc(e.title)}</h4>
            <p>${[e.org, e.note].filter(Boolean).map(esc).join(", ")}</p>
          </div>`;

const plates = projects.filter((p) => p.stage !== "greenhouse");
const growing = projects.filter((p) => p.stage === "greenhouse");
const tilts = [-0.9, 0.7, 0.5, -0.6, 0.8, -0.5];

const plateHtml = (p, i, label) => `
        <article class="plate rv" id="project-${esc(p.id)}" style="--d:${(i % 2) * 70}ms;--tilt:${tilts[i % tilts.length]}deg">
          ${sketch(101 + i * 17)}
          ${label === "growing" ? `<span class="tape">growing</span>` : `<p class="hand no">Plate ${pad(i + 1)}</p>`}
          <h3>${esc(p.name)}</h3>
          ${p.latin ? `<p class="latin">${esc(p.latin)}</p>` : ""}
          <p class="kind">${esc(p.kind)}</p>
          <p class="summary">${esc(p.summary)}</p>
          ${
            p.points?.length
              ? `<details class="more"><summary>read the plate</summary>${points(p.points)}</details>`
              : ""
          }
          ${tags(p.stack)}
          ${
            p.links?.length
              ? `<p class="plate-links">${p.links.map((l) => link(l.href, l.label, { icon: icons.arrow })).join("")}</p>`
              : ""
          }
        </article>`;

const kitHtml = (s, i) => `
        <div${rvc("kit", i)}>
          <p class="hand">${esc(s.group)}</p>
          <ul class="tags">${s.items.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
        </div>`;

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(site.description)}">
  <meta name="theme-color" content="#f5efe1" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#16120c" media="(prefers-color-scheme: dark)">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(site.description)}">
  ${site.url ? `<meta property="og:url" content="${esc(site.url)}">\n  <link rel="canonical" href="${esc(site.url)}">` : ""}
  <meta name="twitter:card" content="summary">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <script>(function(){var d=document.documentElement;d.classList.add("js");try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";d.dataset.theme=t}catch(e){}})()</script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&family=Fraunces:opsz,wght@9..144,400..800&family=Newsreader:ital,opsz,wght@0,6..72,400..700;1,6..72,400..600&display=swap">
  <link rel="stylesheet" href="/styles.css">
  <script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>
</head>
<body>
  <a class="skip" href="#measurements">Skip to content</a>

  <header class="top">
    <div class="wrap top-in">
      <a class="brand" href="#top">${esc(site.name.toLowerCase())}<span>.</span></a>
      <nav class="main" aria-label="Sections">
        <ul>
          ${nav.map(([id, label]) => `<li><a href="#${id}">${label}</a></li>`).join("\n          ")}
        </ul>
      </nav>
      <div class="top-right">
        ${c.resume ? `<a class="top-resume" href="${esc(c.resume)}" download="${esc(c.resumeFileName || "resume.pdf")}">Resume</a>` : ""}
        <button class="lamp" id="theme" type="button" aria-pressed="false" title="Switch between daylight and lamplight">
          <span class="lamp-track" aria-hidden="true"><span class="lamp-knob"></span></span>
          <span>lamplight</span>
        </button>
      </div>
    </div>
  </header>

  <main>
    <section class="hero" id="top">
      <div class="wrap">
        ${sprig()}
        <p class="hand status">${esc(site.role)} at ${esc(site.employer)}, ${esc(site.location)}</p>
        <h1>${esc(first)}<span class="l2">${esc(rest.join(" "))}</span></h1>
        <p class="lede">${esc(site.intro)}</p>
        <ul class="focus">${(site.focus ?? []).map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
        <p class="blurb">${esc(site.about)}</p>
        <div class="actions">
          ${contactButtons(true)}
        </div>
        <p class="hand hint">↓ measurements, plates and a small search inside</p>
      </div>
    </section>

    <section class="chapter" id="measurements" aria-labelledby="h-measurements">
      <div class="wrap">${chapterHead("measurements", "Chapter I", "Measurements", "Numbers from my own work, taken from my resume.")}
        <ul class="stats">${measurements.map(statHtml).join("")}
        </ul>
      </div>
    </section>

    <section class="chapter" id="expeditions" aria-labelledby="h-expeditions">
      <div class="wrap">${chapterHead("expeditions", "Chapter II", "Expeditions", "Where I've worked, newest first.")}
        <ol class="exps">${experience.map(expHtml).join("")}
        </ol>
        <div class="pair" id="schooling">
          <div${rv()}>
            <h3>Schooling</h3>${squig()}${schooling.map(entryHtml).join("")}
          </div>
          <div${rv(1)}>
            <h3>Ribbons and badges</h3>${squig()}${badges.map(entryHtml).join("")}
          </div>
        </div>
      </div>
    </section>

    <section class="chapter" id="specimens" aria-labelledby="h-specimens">
      <div class="wrap">${chapterHead("specimens", "Chapter III", "Specimens", "Projects I built to test ideas end to end. Open a plate for the details.")}
        <div class="plates">${plates.map((p, i) => plateHtml(p, i, "plate")).join("")}
        </div>
        ${
          growing.length
            ? `<div class="growing" id="greenhouse">
          <div${rvc("chapter-head")}>
            <p class="hand">Still growing</p>
            <h3 style="font-size:clamp(1.8rem,4vw,2.6rem)">Greenhouse</h3>
            ${squig()}
          </div>
          <div class="plates">${growing.map((p, i) => plateHtml(p, i + plates.length, "growing")).join("")}
          </div>
        </div>`
            : ""
        }
      </div>
    </section>

    <section class="chapter" id="try-it" aria-labelledby="h-try-it">
      <div class="wrap">${chapterHead("try-it", "Chapter IV", "Try it", "A small retrieval experiment: ask a question and it finds the matching passages on this page.")}
        <div class="ask rv">
          ${sketch(909)}
          <form id="ask-form" role="search" autocomplete="off">
            <label for="q">Ask this notebook</label>
            <div class="field">
              <input id="q" name="q" type="search" placeholder="What have you built with RAG?" enterkeyhint="search">
              <button class="btn primary" type="submit">Search</button>
            </div>
          </form>
          <ul class="chips" aria-label="Example questions">
            ${questions.map((q) => `<li><button type="button" data-question="${esc(q)}">${esc(q)}</button></li>`).join("\n            ")}
          </ul>
          <div id="answers" aria-live="polite"></div>
          <p class="fineprint">This is retrieval, not a chatbot. It ranks passages from this page with BM25 keyword matching, in your browser. No model is called and nothing is sent anywhere.</p>
          <noscript><p class="fineprint">Search needs JavaScript. Everything it searches is listed on this page.</p></noscript>
        </div>
      </div>
    </section>

    <section class="chapter" id="toolkit" aria-labelledby="h-toolkit">
      <div class="wrap">${chapterHead("toolkit", "Chapter V", "Toolkit", "What I reach for.")}
        <div class="kits">${skills.map(kitHtml).join("")}
        </div>
      </div>
    </section>

    <section class="chapter" id="contact" aria-labelledby="h-contact">
      <div class="wrap">
        <div class="send rv">
          ${sketch(4242)}
          <p class="hand">Chapter VI</p>
          <h2 id="h-contact">Send word</h2>
          ${squig()}
          <p>Open to conversations about AI engineering, contract work and side projects.</p>
          <div class="actions">
          ${contactButtons(true)}
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer class="foot">
    <div class="wrap">
      <p>Notebook of ${esc(fullName)}, ${esc(site.location)}</p>
      <p>${github ? `${esc(github)}, ` : ""}${year}</p>
    </div>
  </footer>
  <script type="module" src="/js/ui.js"></script>
  <script type="module" src="/js/main.js"></script>
</body>
</html>
`;

await rm(dist, { recursive: true, force: true });
await mkdir(path.join(dist, "js"), { recursive: true });
await writeFile(path.join(dist, "index.html"), html);
await cp(path.join(src, "styles.css"), path.join(dist, "styles.css"));
await cp(path.join(src, "content.mjs"), path.join(dist, "js", "content.mjs"));
for (const f of await readdir(path.join(src, "js"))) {
  await cp(path.join(src, "js", f), path.join(dist, "js", f));
}
if (existsSync(path.join(root, "public"))) {
  await cp(path.join(root, "public"), dist, { recursive: true });
}
console.log(`Built dist/ (${(html.length / 1024).toFixed(1)} KB HTML)`);
