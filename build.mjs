// Generates dist/ from src/content.mjs. No dependencies. Run: node build.mjs
import { mkdir, rm, cp, writeFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { site, marquee, experience, projects, skills, education } from "./src/content.mjs";

const root = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(root, "dist");
const src = path.join(root, "src");

const esc = (s) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const isExternal = (href) => /^https?:\/\//i.test(href);
const arrowIcon = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>`;
// style: "primary" | "ghost" renders a button-style link; true renders a small ghost button
const a = (href, label, style) => {
  const cls = style === true ? "btn btn-ghost" : style ? `btn btn-${style}` : "";
  return `<a${cls ? ` class="${cls}"` : ""} href="${esc(href)}"${isExternal(href) ? ' target="_blank" rel="noopener noreferrer"' : ""}>${esc(label)}${cls ? arrowIcon : ""}</a>`;
};
const tags = (list) =>
  list?.length ? `<ul class="tags">${list.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : "";

const c = site.contact ?? {};
const github = c.github ? c.github.replace(/^https?:\/\//, "") : "";
const title = `${site.fullName ?? site.name} | ${site.role}`;

const questions = [
  "What have you built with RAG?",
  "Do you have experience with LangGraph?",
  "How do you evaluate LLMs?",
  "Which AWS services do you use?",
  "Which projects are deployed?",
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.fullName ?? site.name,
  jobTitle: site.role,
  worksFor: { "@type": "Organization", name: site.employer },
  address: { "@type": "PostalAddress", addressLocality: site.location },
  description: site.description,
  ...(site.url ? { url: site.url } : {}),
  sameAs: [c.github, c.linkedin].filter(Boolean),
};

const rv = (i = 0, extra = "") => ` data-reveal${extra} style="--d:${i * 90}ms"`;

const roleHtml = (r, ri) => `
          <article class="role" id="role-${esc(r.id)}"${rv(ri)}>
            <header class="role-head">
              <h3>${esc(r.org)}</h3>
              <p class="role-title">${esc(r.role)}</p>
              <p class="role-meta">${[r.place, r.period].filter(Boolean).map((x) => `<span>${esc(x)}</span>`).join("")}</p>
            </header>
            ${r.summary ? `<p class="role-summary">${esc(r.summary)}</p>` : ""}
            ${
              r.highlights?.length
                ? `<div class="works">${r.highlights
                    .map(
                      (h, i) => `
              <div class="work card" data-spot${rv(i)}>
                <h4>${esc(h.title)}</h4>
                ${h.text ? `<p>${esc(h.text)}</p>` : ""}
                ${h.points?.length ? `<ul class="points">${h.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>` : ""}
                ${tags(h.tags)}
              </div>`
                    )
                    .join("")}</div>`
                : ""
            }
          </article>`;

const projectHtml = (p, i) => `
          <article class="project card${i === 0 ? " featured" : ""}" id="project-${esc(p.id)}" data-spot${rv(i === 0 ? 0 : (i - 1) % 2)}>
            <p class="project-kind">${esc(p.kind)}</p>
            <h3>${esc(p.name)}</h3>
            <p class="project-summary">${esc(p.summary)}</p>
            ${p.points?.length ? `<ul class="points">${p.points.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
            ${p.links?.length ? `<p class="project-links">${p.links.map((l) => a(l.href, l.label, true)).join("")}</p>` : ""}
            ${tags(p.stack)}
          </article>`;

const skillHtml = (s, i) => `
          <div class="skill-group card" data-spot${rv(i)}>
            <h3>${esc(s.group)}</h3>
            ${tags(s.items)}
          </div>`;

const eduHtml = (e, i) => `
          <div class="credential card" data-spot${rv(i)}>
            <p class="credential-kind">${esc(e.kind)}</p>
            <h3>${esc(e.title)}</h3>
            <p>${[e.org, e.note].filter(Boolean).map(esc).join(". ")}</p>
          </div>`;

const contactLinks = [
  c.email && a(`mailto:${c.email}`, "Email me", "primary"),
  c.linkedin && a(c.linkedin, "LinkedIn", c.email ? "ghost" : "primary"),
  c.github && a(c.github, "GitHub", c.email || c.linkedin ? "ghost" : "primary"),
  c.resume && a(c.resume, "Resume (PDF)", "ghost"),
].filter(Boolean);

const nav = [
  ["experience", "Experience"],
  ["projects", "Projects"],
  ["skills", "Skills"],
  ["education", "Education"],
  ["contact", "Contact"],
];

const sectionHead = (id, heading, sub) => `
        <div class="section-head"${rv()}>
          <h2 id="h-${id}">${esc(heading)}</h2>
          ${sub ? `<p>${esc(sub)}</p>` : ""}
        </div>`;

const marqueeItems = marquee.map((x) => `<li>${esc(x)}</li>`).join("");
const letters = [...site.name].map((ch, i) => `<span class="ch" style="--n:${i}">${esc(ch)}</span>`).join("");

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(site.description)}">
  <meta name="theme-color" content="#f4f6fb" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#0a0c13" media="(prefers-color-scheme: dark)">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(site.description)}">
  ${site.url ? `<meta property="og:url" content="${esc(site.url)}">\n  <link rel="canonical" href="${esc(site.url)}">` : ""}
  <meta name="twitter:card" content="summary">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <script>(function(){var d=document.documentElement;d.classList.add("js");try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";d.dataset.theme=t}catch(e){}})()</script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,200..800&family=Hanken+Grotesk:wght@400;500;600;700&display=swap">
  <link rel="stylesheet" href="/styles.css">
  <script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>
</head>
<body>
  <div class="progress" aria-hidden="true"><span></span></div>
  <a class="skip" href="#experience">Skip to content</a>

  <header class="top">
    <div class="wrap top-in">
      <a class="mark" href="#top"><span class="mark-dot" aria-hidden="true"></span>${esc(site.name)}</a>
      <div class="top-right">
        <nav class="main" aria-label="Sections">
          <span class="nav-pill" aria-hidden="true"></span>
          <ul>
            ${nav.map(([id, label]) => `<li><a href="#${id}">${label}</a></li>`).join("\n            ")}
          </ul>
        </nav>
        <button class="theme" id="theme" type="button" aria-label="Switch theme" title="Switch theme">
          <svg class="moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7Z"/></svg>
          <svg class="sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/></svg>
        </button>
      </div>
    </div>
  </header>

  <main>
    <section class="hero" id="top" data-spot>
      <div class="aurora" aria-hidden="true"><i></i><i></i><i></i></div>
      <div class="dots" aria-hidden="true"></div>
      <div class="wrap">
        <h1 aria-label="${esc(site.name)}"><span aria-hidden="true">${letters}</span></h1>
        <p class="lede"${rv(0).replace("0ms", "700ms")}>${esc(site.intro)}</p>
        <p class="where"${rv(0).replace("0ms", "820ms")}>${esc(site.role)} at ${esc(site.employer)}, ${esc(site.location)}</p>

        <div class="ask"${rv(0).replace("0ms", "950ms")}>
          <form id="ask-form" role="search" autocomplete="off">
            <label for="q">Ask this portfolio</label>
            <div class="field">
              <input id="q" name="q" type="search" placeholder="What have you built with RAG?" enterkeyhint="search">
              <button class="btn btn-primary" type="submit">Search</button>
            </div>
          </form>
          <ul class="chips" aria-label="Example questions">
            ${questions.map((q) => `<li><button type="button" data-question="${esc(q)}">${esc(q)}</button></li>`).join("\n            ")}
          </ul>
          <div id="answers" aria-live="polite"></div>
          <p class="fineprint">This is retrieval, not a chatbot. It ranks passages from this page with BM25 keyword matching, in your browser. No model is called and nothing is sent anywhere.</p>
          <noscript><p class="fineprint">Search needs JavaScript. Everything it searches is listed below.</p></noscript>
        </div>
      </div>
    </section>

    <div class="marquee" aria-hidden="true">
      <div class="marquee-track"><ul>${marqueeItems}</ul><ul>${marqueeItems}</ul></div>
    </div>

    <section class="section" id="experience" aria-labelledby="h-experience">
      <div class="wrap">${sectionHead("experience", "Experience", "Where I've worked on GenAI and machine learning.")}
        <div class="timeline">${experience.map(roleHtml).join("")}
        </div>
      </div>
    </section>

    <section class="section" id="projects" aria-labelledby="h-projects">
      <div class="wrap">${sectionHead("projects", "Projects", "Things I built to test ideas end to end.")}
        <div class="project-grid">${projects.map(projectHtml).join("")}
        </div>
      </div>
    </section>

    <section class="section" id="skills" aria-labelledby="h-skills">
      <div class="wrap">${sectionHead("skills", "Skills", "The tools and techniques I work with.")}
        <div class="skill-grid">${skills.map(skillHtml).join("")}
        </div>
      </div>
    </section>

    <section class="section" id="education" aria-labelledby="h-education">
      <div class="wrap">${sectionHead("education", "Education", "")}
        <div class="credential-grid">${education.map(eduHtml).join("")}
        </div>
      </div>
    </section>

    <section class="section" id="contact" aria-labelledby="h-contact">
      <div class="wrap">
        <div class="cta"${rv()}>
          <h2 id="h-contact">Get in touch</h2>
          <p>Open to conversations about AI engineering, contract work and side projects.</p>
          ${contactLinks.length ? `<div class="cta-links">${contactLinks.join("")}</div>` : ""}
        </div>
      </div>
    </section>
  </main>

  <footer class="foot">
    <div class="wrap">
      <p>${esc(site.fullName ?? site.name)}, ${esc(site.role)}</p>
      <p>${github ? `${esc(github)}. ` : ""}${new Date().getFullYear()}</p>
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
