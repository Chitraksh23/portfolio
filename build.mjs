// Generates dist/ from src/content.mjs. No dependencies. Run: node build.mjs
import { mkdir, rm, cp, writeFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { site, experience, projects, skills, education } from "./src/content.mjs";

const root = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(root, "dist");
const src = path.join(root, "src");

const esc = (s) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const isExternal = (href) => /^https?:\/\//i.test(href);
const a = (href, label) =>
  `<a href="${esc(href)}"${isExternal(href) ? ' target="_blank" rel="noopener noreferrer"' : ""}>${esc(label)}</a>`;
const tags = (list) =>
  list?.length ? `<ul class="tags">${list.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : "";

const c = site.contact ?? {};
const github = c.github ? c.github.replace(/^https?:\/\//, "") : "";
const title = `${site.name} | ${site.role}`;

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
  name: site.name,
  jobTitle: site.role,
  worksFor: { "@type": "Organization", name: site.employer },
  address: { "@type": "PostalAddress", addressLocality: site.location },
  description: site.description,
  ...(site.url ? { url: site.url } : {}),
  sameAs: [c.github, c.linkedin].filter(Boolean),
};

const roleHtml = (r) => `
        <article class="role" id="role-${esc(r.id)}">
          <header class="role-head">
            <h3>${esc(r.org)}</h3>
            <p class="role-title">${esc(r.role)}</p>
            <p class="role-meta">${[r.place, r.period].filter(Boolean).map((x) => `<span>${esc(x)}</span>`).join("")}</p>
          </header>
          ${r.summary ? `<p class="role-summary">${esc(r.summary)}</p>` : ""}
          ${(r.highlights ?? [])
            .map(
              (h) => `
          <div class="work">
            <h4>${esc(h.title)}</h4>
            <p>${esc(h.text)}</p>
            ${h.points?.length ? `<ul class="points">${h.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>` : ""}
            ${tags(h.tags)}
          </div>`
            )
            .join("")}
        </article>`;

const projectHtml = (p) => `
        <article class="project" id="project-${esc(p.id)}">
          <h3>${esc(p.name)}</h3>
          <p class="project-kind">${esc(p.kind)}</p>
          <p>${esc(p.summary)}</p>
          ${tags(p.stack)}
          ${p.links?.length ? `<p class="project-links">${p.links.map((l) => a(l.href, l.label)).join("")}</p>` : ""}
        </article>`;

const skillHtml = (s) => `
        <div class="skill-group">
          <h3>${esc(s.group)}</h3>
          <p>${s.items.map(esc).join(", ")}</p>
        </div>`;

const eduHtml = (e) => `
        <div class="credential">
          <p class="credential-kind">${esc(e.kind)}</p>
          <h3>${esc(e.title)}</h3>
          <p>${[e.org, e.note].filter(Boolean).map(esc).join(". ")}</p>
        </div>`;

const contactLinks = [
  c.email && a(`mailto:${c.email}`, "Email"),
  c.linkedin && a(c.linkedin, "LinkedIn"),
  c.github && a(c.github, "GitHub"),
  c.resume && a(c.resume, "Resume (PDF)"),
].filter(Boolean);

const nav = [
  ["experience", "Experience"],
  ["projects", "Projects"],
  ["skills", "Skills"],
  ["education", "Education"],
  ["contact", "Contact"],
];

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(site.description)}">
  <meta name="theme-color" content="#f3f5f9" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#10121a" media="(prefers-color-scheme: dark)">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(site.description)}">
  ${site.url ? `<meta property="og:url" content="${esc(site.url)}">\n  <link rel="canonical" href="${esc(site.url)}">` : ""}
  <meta name="twitter:card" content="summary">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,200..800&family=Hanken+Grotesk:wght@400;500;600;700&display=swap">
  <link rel="stylesheet" href="/styles.css">
  <script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>
</head>
<body>
  <a class="skip" href="#experience">Skip to content</a>
  <div class="wrap">
    <header class="top">
      <a class="mark" href="#top">${esc(site.name)}</a>
      <nav aria-label="Sections">
        <ul>
          ${nav.map(([id, label]) => `<li><a href="#${id}">${label}</a></li>`).join("\n          ")}
        </ul>
      </nav>
    </header>

    <main>
      <section class="hero" id="top">
        <h1>${esc(site.name)}</h1>
        <p class="lede">${esc(site.intro)}</p>
        <p class="where">${esc(site.role)} at ${esc(site.employer)}, ${esc(site.location)}</p>

        <div class="ask">
          <form id="ask-form" role="search" autocomplete="off">
            <label for="q">Ask this portfolio</label>
            <div class="field">
              <input id="q" name="q" type="search" placeholder="What have you built with RAG?" enterkeyhint="search">
              <button type="submit">Search</button>
            </div>
          </form>
          <ul class="chips" aria-label="Example questions">
            ${questions.map((q) => `<li><button type="button" data-question="${esc(q)}">${esc(q)}</button></li>`).join("\n            ")}
          </ul>
          <div id="answers" aria-live="polite"></div>
          <p class="fineprint">This is retrieval, not a chatbot. It ranks passages from this page with BM25 keyword matching, in your browser. No model is called and nothing is sent anywhere.</p>
          <noscript><p class="fineprint">Search needs JavaScript. Everything it searches is listed below.</p></noscript>
        </div>
      </section>

      <section class="section" id="experience" aria-labelledby="h-experience">
        <h2 id="h-experience">Experience</h2>
        <div>${experience.map(roleHtml).join("")}
        </div>
      </section>

      <section class="section" id="projects" aria-labelledby="h-projects">
        <h2 id="h-projects">Projects</h2>
        <div>${projects.map(projectHtml).join("")}
        </div>
      </section>

      <section class="section" id="skills" aria-labelledby="h-skills">
        <h2 id="h-skills">Skills</h2>
        <div>${skills.map(skillHtml).join("")}
        </div>
      </section>

      <section class="section" id="education" aria-labelledby="h-education">
        <h2 id="h-education">Education</h2>
        <div>${education.map(eduHtml).join("")}
        </div>
      </section>

      <section class="section" id="contact" aria-labelledby="h-contact">
        <h2 id="h-contact">Contact</h2>
        <div>
          <p class="contact-lede">Open to conversations about AI engineering, contract work and side projects.</p>
          ${contactLinks.length ? `<p class="contact-links">${contactLinks.join("")}</p>` : ""}
        </div>
      </section>
    </main>

    <footer class="foot">
      <p>${esc(site.name)}${github ? `, ${esc(github)}` : ""}. ${new Date().getFullYear()}.</p>
    </footer>
  </div>
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
