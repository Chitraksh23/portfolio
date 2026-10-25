import { site, experience, projects, skills, education } from "./content.mjs";
import { buildChunks } from "./chunks.mjs";
import { createIndex, search, highlight, esc } from "./retrieval.mjs";

const form = document.getElementById("ask-form");
const input = document.getElementById("q");
const answers = document.getElementById("answers");
const chips = document.querySelectorAll("[data-question]");

const index = createIndex(buildChunks({ site, experience, projects, skills, education }));

function resultHtml(r, i) {
  const hits = new Set();
  const take = (text) => {
    const out = highlight(text, r.matched);
    out.hits.forEach((w) => hits.add(w));
    return out.html;
  };
  const title = take(r.chunk.title);
  const text = take(r.chunk.text);
  const tags = (r.chunk.tags ?? []).map((t) => `<li>${take(t)}</li>`).join("");
  const where = r.chunk.where ? `<span>${esc(r.chunk.where)}</span>` : "";
  const matched = hits.size ? `<p class="matched">Matched: ${[...hits].map(esc).join(", ")}</p>` : "";

  return `
    <li class="result" style="--i:${i}">
      <div class="result-meta">
        <span class="result-section">${esc(r.chunk.section)}</span>
        ${where}
        <span class="score">score ${r.score.toFixed(2)}</span>
      </div>
      <h3>${title}</h3>
      <p>${text}</p>
      ${tags ? `<ul class="tags">${tags}</ul>` : ""}
      ${matched}
      <a class="jump" href="#${esc(r.chunk.anchor)}">See it in ${esc(r.chunk.section)}</a>
    </li>`;
}

function run(raw) {
  const query = raw.trim();
  const url = new URL(location.href);
  if (query) url.searchParams.set("q", query);
  else url.searchParams.delete("q");
  history.replaceState(null, "", url);

  if (!query) {
    answers.innerHTML = "";
    return;
  }

  const results = search(index, query, { limit: 3 });
  if (!results.length) {
    answers.innerHTML = `<p class="empty">Nothing on this page matches “${esc(
      query
    )}”. Try one of the questions above, or a tool name like LangGraph or AWS.</p>`;
    return;
  }
  answers.innerHTML =
    `<p class="status">${results.length} passage${results.length === 1 ? "" : "s"} from this page, best match first.</p>` +
    `<ol class="results">${results.map(resultHtml).join("")}</ol>`;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  run(input.value);
});

chips.forEach((btn) =>
  btn.addEventListener("click", () => {
    input.value = btn.dataset.question;
    run(input.value);
    input.focus({ preventScroll: true });
  })
);

const initial = new URLSearchParams(location.search).get("q");
if (initial) {
  input.value = initial;
  run(initial);
}
