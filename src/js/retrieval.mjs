// A small BM25 search over the portfolio's own passages.
// Keyword matching with light stemming and a short synonym list.
// No model, no network: everything runs in the visitor's browser.

const STOP = new Set(
  (
    "a an the of and or to in on for with is are was were be been do does did you your yours i me my mine " +
    "what which who whom how why when where have has had can could would should about tell show it its " +
    "this that these those at by from as into than then there their they them we our us any some project projects"
  ).split(" ")
);

const TOKEN = /[a-z0-9][a-z0-9+#]*/g;

export function stem(word) {
  let w = word;
  if (w.length > 5 && w.endsWith("ing")) w = w.slice(0, -3);
  else if (w.length > 4 && w.endsWith("ies")) w = w.slice(0, -3) + "y";
  else if (w.length > 4 && w.endsWith("ed")) w = w.slice(0, -2);
  else if (w.length > 3 && w.endsWith("s") && !w.endsWith("ss")) w = w.slice(0, -1);
  return w;
}

export function tokenize(text) {
  return (String(text).toLowerCase().match(TOKEN) ?? []).filter((w) => !STOP.has(w)).map(stem);
}

// Query word -> related words that get a lower weight.
const SYNONYMS = {
  rag: ["retrieval", "augmented", "vector", "embedding"],
  llm: ["language", "model", "prompt", "generative"],
  genai: ["generative", "llm", "rag"],
  evaluate: ["evaluation", "benchmark", "faithfulness"],
  evaluation: ["evaluate", "benchmark", "faithfulness", "hallucination"],
  eval: ["evaluation", "benchmark"],
  hallucination: ["grounding", "grounded", "faithfulness"],
  agent: ["agentic", "workflow", "langgraph", "tool"],
  cloud: ["aws", "lambda", "ec2", "s3"],
  aws: ["cloud", "lambda", "ec2", "s3"],
  deploy: ["vercel", "render", "live"],
  live: ["deploy", "vercel"],
  frontend: ["next.js", "next", "ui"],
  backend: ["fastapi", "api"],
  search: ["retrieval", "semantic", "vector", "opensearch"],
  database: ["opensearch", "supabase", "vector"],
  certification: ["certified", "aws"],
  certificate: ["certified", "aws"],
  research: ["ieee", "publication"],
  paper: ["ieee", "publication"],
  stock: ["nse", "market"],
  skill: ["python", "framework"],
  stack: ["python", "framework", "aws"],
};
const SYN = new Map(Object.entries(SYNONYMS).map(([k, v]) => [stem(k), v.map(stem)]));

// Phrases that point at a specific passage regardless of keywords.
const INTENTS = [
  { re: /\b(who|about|yourself|introduce|background)\b/i, id: "about", bonus: 3 },
  { re: /\b(contact|email|reach|hire|hiring|linkedin|github|resume|cv)\b/i, id: "contact", bonus: 3 },
  { re: /\bprojects?\b/i, section: "Projects", bonus: 1.5 },
];

export function analyze(query) {
  const terms = new Map();
  for (const t of tokenize(query)) terms.set(t, 1);
  for (const t of [...terms.keys()]) {
    for (const s of SYN.get(t) ?? []) if (!terms.has(s)) terms.set(s, 0.4);
  }
  return terms;
}

export function createIndex(chunks) {
  const docs = chunks.map((chunk) => {
    const terms = tokenize([chunk.title, chunk.text, (chunk.tags ?? []).join(" ")].join(" "));
    const tf = new Map();
    for (const t of terms) tf.set(t, (tf.get(t) ?? 0) + 1);
    return { chunk, tf, len: terms.length || 1 };
  });
  const df = new Map();
  for (const d of docs) for (const t of d.tf.keys()) df.set(t, (df.get(t) ?? 0) + 1);
  const avg = docs.reduce((sum, d) => sum + d.len, 0) / (docs.length || 1);
  return { docs, df, avg, N: docs.length };
}

export function search(index, query, { limit = 3 } = {}) {
  const K1 = 1.4;
  const B = 0.75;
  const terms = analyze(query);
  const active = INTENTS.filter((i) => i.re.test(query));
  if (!terms.size && !active.length) return [];
  const bonusFor = (chunk) =>
    active.reduce((sum, i) => sum + (i.id === chunk.id || i.section === chunk.section ? i.bonus : 0), 0);

  const results = [];
  for (const d of index.docs) {
    let score = bonusFor(d.chunk);
    const matched = new Set();
    for (const [term, weight] of terms) {
      const f = d.tf.get(term);
      if (!f) continue;
      const df = index.df.get(term);
      const idf = Math.log(1 + (index.N - df + 0.5) / (df + 0.5));
      score += (weight * idf * (f * (K1 + 1))) / (f + K1 * (1 - B + (B * d.len) / index.avg));
      matched.add(term);
    }
    if (score > 0) results.push({ chunk: d.chunk, score, matched });
  }
  results.sort((x, y) => y.score - x.score);
  return results.slice(0, limit);
}

export function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Returns escaped HTML with matching words wrapped in <mark>, plus the words hit.
export function highlight(text, matched) {
  const s = String(text);
  const re = new RegExp(TOKEN.source, "gi");
  const hits = new Set();
  let html = "";
  let last = 0;
  let m;
  while ((m = re.exec(s))) {
    const word = m[0];
    const lower = word.toLowerCase();
    html += esc(s.slice(last, m.index));
    if (!STOP.has(lower) && matched.has(stem(lower))) {
      html += `<mark>${esc(word)}</mark>`;
      hits.add(lower);
    } else {
      html += esc(word);
    }
    last = m.index + word.length;
  }
  html += esc(s.slice(last));
  return { html, hits };
}
