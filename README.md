# Chitraksh, portfolio

A fast static portfolio with no runtime dependencies. The page is generated from one content file, and a small "Ask this portfolio" box retrieves passages from that same content (BM25 keyword search in the browser, no LLM, no API keys).

## Edit your content

Everything lives in `src/content.mjs`. Empty strings are hidden.

Fill these in before you share the link:

| Field | Where | Example |
| --- | --- | --- |
| Email | `site.contact.email` | `you@example.com` |
| LinkedIn | `site.contact.linkedin` | `https://www.linkedin.com/in/your-handle/` |
| Resume | `site.contact.resume` | `/resume.pdf` (put `resume.pdf` in `public/`) |
| Live URL | `site.url` | `https://your-name.vercel.app` |
| Dates | `experience[].period` | `2025 to present` |
| Repo links | `projects[].links` | `{ label: "Source", href: "https://github.com/..." }` |

The Orion bank project is anonymized as "a global bank". Rename it in `experience[0].highlights[1].title` if your client agreement allows.

## Run locally

```bash
npm run dev      # builds, then serves dist/ with npx serve
npm test         # sanity checks for the search box
```

Needs Node 18 or newer. There is nothing to `npm install`.

## Deploy on Vercel

1. Push this folder to a new GitHub repo:
   ```bash
   git init && git add . && git commit -m "Portfolio"
   git branch -M main
   git remote add origin https://github.com/chitraksh23/portfolio.git
   git push -u origin main
   ```
2. On vercel.com choose **Add New, Project**, import the repo, and click **Deploy**. `vercel.json` already sets the build command (`node build.mjs`) and output directory (`dist`).
3. After the first deploy, set `site.url` in `src/content.mjs` and push again.

Or from the terminal: `npx vercel --prod`.

## Structure

```
src/content.mjs        all text, links and projects
src/styles.css         design tokens and layout
src/js/chunks.mjs      content -> searchable passages
src/js/retrieval.mjs   BM25 index, synonyms, highlighting
src/js/main.js         search box behavior
build.mjs              writes dist/index.html and copies assets
public/                files copied as-is (favicon, resume.pdf)
test/                  retrieval checks
```
