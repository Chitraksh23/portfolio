// ─────────────────────────────────────────────────────────────
// Everything the site says lives in this file.
// Edit it, commit, push. Vercel rebuilds automatically.
// Empty strings are hidden from the page.
// ─────────────────────────────────────────────────────────────

export const site = {
  name: "Chitraksh",
  role: "AI Engineer",
  employer: "Orion Innovation",
  location: "Chennai, India",

  // After your first deploy, put the live URL here (e.g. "https://chitraksh.vercel.app").
  // It turns on the canonical link and the Open Graph URL.
  url: "",

  intro:
    "I build production GenAI systems: RAG pipelines, agent workflows, and the evaluation that shows whether they work.",

  about:
    "I'm an AI Engineer at Orion Innovation in Chennai. I work on retrieval-augmented generation, vector search, prompt engineering and LLM evaluation. Outside client work I build projects to test ideas end to end: a deep research agent, an LLM benchmarking framework and a hallucination detector.",

  description:
    "Chitraksh is an AI Engineer in Chennai building production GenAI systems: RAG pipelines, agent workflows and LLM evaluation.",

  contact: {
    email: "", // e.g. "you@example.com"
    linkedin: "", // e.g. "https://www.linkedin.com/in/your-handle/"
    github: "https://github.com/chitraksh23",
    resume: "", // e.g. "/resume.pdf" after dropping resume.pdf into /public
  },
};

export const experience = [
  {
    id: "orion",
    org: "Orion Innovation",
    role: "AI Engineer",
    place: "Chennai, India",
    period: "", // e.g. "2025 to present"
    summary: "Building production GenAI systems for enterprise clients.",
    highlights: [
      {
        id: "nexus",
        title: "Nexus, an enterprise knowledge assistant",
        text: "A RAG-based assistant that answers questions from an organization's own knowledge. I work on the retrieval pipelines, vector search and prompt engineering behind it.",
        tags: ["RAG", "Vector search", "Prompt engineering"],
      },
      {
        id: "bank",
        // Swap "a global bank" for "HSBC" if your client agreement allows naming them publicly.
        title: "Financial document Q&A for a global bank",
        text: "A generative AI document intelligence solution that answers questions over financial documents.",
        points: [
          "Built end-to-end RAG pipelines with embeddings, semantic search and an OpenSearch vector database.",
          "Designed multi-step agent workflows in LangGraph covering retrieval, tool integration and context-aware responses.",
          "Raised answer accuracy and cut hallucinations with prompt engineering, few-shot prompting, context grounding and token optimization.",
          "Built evaluation workflows that score relevance, recall, faithfulness and consistency.",
          "Ran document processing and LLM inference on AWS using S3, EC2 and Lambda.",
        ],
        tags: ["Python", "LangGraph", "OpenSearch", "AWS", "LLM evaluation"],
      },
    ],
  },
  {
    id: "liquidmind",
    org: "Liquidmind AI",
    role: "Intern",
    place: "Bangalore, India",
    period: "",
    summary: "Internship at an AI company in Bangalore.",
    highlights: [],
  },
];

export const projects = [
  {
    id: "micromanus",
    name: "MicroManus",
    kind: "Deep research agent",
    summary:
      "A full-stack deep research agent that searches the web and shows its reasoning loop as it works. It has Google and GitHub sign-in, usage-based billing and bring-your-own-key model support. Built without LangChain or LangGraph, and deployed.",
    stack: ["Next.js", "Supabase", "Stripe", "SerpAPI", "Claude API", "AES-256-GCM", "pdf-lib"],
    links: [{ label: "Live site", href: "https://micromanus-mu-five.vercel.app/" }],
  },
  {
    id: "dualmind",
    name: "DualMind AI",
    kind: "LLM benchmarking framework",
    summary:
      "Compares Qwen2.5 and Claude Sonnet 4 on hallucination rate, bias resistance and content safety, using a 50-prompt test suite. FastAPI backend, GitHub Actions CI, deployed to Vercel, Render and Hugging Face Spaces.",
    stack: ["Python", "FastAPI", "GitHub Actions", "Vercel", "Render", "Hugging Face Spaces"],
    links: [{ label: "Source", href: "https://github.com/Chitraksh23/dualmind-ai-eval" }],
  },
  {
    id: "grounding-auditor",
    name: "Grounding Auditor",
    kind: "Hallucination detection kit",
    summary:
      "Checks RAG output for hallucinations. It splits an answer into atomic claims, checks each claim against its sources and combines the results into a hallucination score. Built for the Lamatic AgentKit challenge with a Next.js interface.",
    stack: ["Next.js", "Lamatic AgentKit", "GraphQL"],
    links: [],
  },
  {
    id: "visa-advisor",
    name: "Visa Advisor",
    kind: "Tool-calling chatbot",
    summary:
      "Suggests countries and visa routes based on your interests, then walks through the application process end to end. Uses a Groq-hosted open LLM with SerpAPI tool calling for current web results.",
    stack: ["Groq", "SerpAPI", "Tool calling", "Vercel"],
    links: [],
  },
  {
    id: "nse-screener",
    name: "NSE Stock Screener",
    kind: "Real-time market analysis",
    summary:
      "A real-time screener for NSE-listed stocks, connected to Angel One's SmartAPI. It computes SMMA indicators, detects crossover signals, adds an ML scoring layer and shows everything in a Streamlit dashboard. Packaged as a Windows executable.",
    stack: ["Python", "Streamlit", "SmartAPI", "Machine learning"],
    links: [],
  },
];

export const skills = [
  {
    group: "Generative AI",
    items: [
      "Retrieval-augmented generation",
      "Embeddings and semantic search",
      "Prompt engineering",
      "Few-shot prompting",
      "Agentic workflows",
      "Tool calling",
      "LLM evaluation",
      "Hallucination detection",
    ],
  },
  {
    group: "Frameworks and data",
    items: ["Python", "LangGraph", "FastAPI", "Streamlit", "Next.js", "OpenSearch", "Supabase"],
  },
  {
    group: "Cloud and delivery",
    items: ["AWS (S3, EC2, Lambda)", "Vercel", "Render", "Hugging Face Spaces", "GitHub Actions"],
  },
];

export const education = [
  {
    id: "amrita",
    kind: "Education",
    title: "B.Tech, Computer and Communication Engineering",
    org: "Amrita Vishwa Vidyapeetham",
    note: "",
  },
  {
    id: "aws-ccp",
    kind: "Certification",
    title: "AWS Certified Cloud Practitioner",
    org: "Amazon Web Services",
    note: "",
  },
  {
    id: "ieee",
    kind: "Research",
    title: "Plant disease detection model",
    org: "IEEE publication",
    note: "An academic project on detecting plant diseases that led to an IEEE publication.",
  },
];
