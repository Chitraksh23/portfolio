import assert from "node:assert/strict";
import { site, experience, projects, skills, education, measurements } from "../src/content.mjs";
import { buildChunks } from "../src/js/chunks.mjs";
import { createIndex, search } from "../src/js/retrieval.mjs";

const index = createIndex(buildChunks({ site, experience, projects, skills, education, measurements }));
const top = (q) => search(index, q, { limit: 3 }).map((r) => r.chunk.id);

const cases = [
  ["What have you built with RAG?", (ids) => ids.some((i) => i.includes("nexus") || i.includes("finance"))],
  ["Do you have experience with LangGraph?", (ids) => ids.some((i) => i.startsWith("orion-finance"))],
  ["How do you evaluate LLMs?", (ids) => ids.some((i) => i.includes("dualmind") || i.includes("grounding") || i.includes("finance") || i.startsWith("skills-GenAI"))],
  ["Which AWS services do you use?", (ids) => ids.some((i) => i.startsWith("orion-finance") || i.startsWith("skills-Cloud"))],
  ["Which projects are deployed?", (ids) => ids.some((i) => i.startsWith("project-"))],
  ["who are you", (ids) => ids[0] === "about"],
  ["What did you do at Liquidmind?", (ids) => ids[0].startsWith("liquidmind")],
  ["Do you know Kubernetes?", (ids) => ids[0].startsWith("skills-Cloud")],
  ["Tell me about the IEEE paper", (ids) => ids.some((i) => i.includes("plant") || i.includes("ieee"))],
  ["how can I contact you", (ids) => ids[0] === "contact"],
];

for (const [q, ok] of cases) {
  const ids = top(q);
  console.log(q.padEnd(40), "->", ids.join(" | "));
  assert.ok(ok(ids), `unexpected results for "${q}"`);
}
assert.deepEqual(top("zzzzqqq"), []);
assert.deepEqual(top(""), []);
console.log("\nAll retrieval checks passed.");
