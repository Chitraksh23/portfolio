// ─────────────────────────────────────────────────────────────
// Everything the site says lives in this file.
// Edit it, commit, push. Vercel rebuilds automatically.
// Empty strings are hidden from the page.
// ─────────────────────────────────────────────────────────────

export const site = {
  name: "Chitraksh",
  fullName: "Singisetti Chitraksh",
  role: "AI Engineer",
  employer: "Orion Innovation",
  location: "Chennai, India",

  // After your first deploy, put the live URL here (e.g. "https://chitraksh.vercel.app").
  // It turns on the canonical link and the Open Graph URL.
  url: "",

  intro: "I build production GenAI systems, and the evidence that they work.",

  focus: ["RAG systems", "agentic workflows", "LLM evaluation", "vector search", "prompt engineering"],

  about:
    "I'm an AI Engineer at Orion Innovation in Chennai, working there since November 2024. I build retrieval-augmented generation pipelines, agentic workflows and LLM evaluation for enterprise clients, including a financial document intelligence system and an internal HR knowledge assistant. Outside work I build projects to test ideas end to end, such as a deep research agent, an LLM benchmarking framework and a hallucination detector.",

  description:
    "Singisetti Chitraksh is an AI Engineer in Chennai building production GenAI systems: RAG pipelines, agentic workflows and LLM evaluation.",

  contact: {
    email: "chitraksh456@gmail.com",
    linkedin: "", // e.g. "https://www.linkedin.com/in/your-handle/"
    github: "https://github.com/chitraksh23",
    resume: "/resume.pdf", // replace public/resume.pdf to update it
    resumeFileName: "Singisetti_Chitraksh_Resume.pdf", // name of the downloaded file
  },
};

// Numbers from your own work. Counted up on screen when scrolled into view.
export const measurements = [
  { value: 40, suffix: "%", label: "less time for analysts to find answers in financial documents", source: "Orion, client project" },
  { value: 35, suffix: "%", label: "fewer hallucinations after prompt and grounding work", source: "Orion, client project" },
  { value: 25, suffix: "%", label: "higher retrieval recall from the OpenSearch RAG pipeline", source: "Orion, client project" },
  { value: 10000, suffix: "+", label: "documents ingested, chunked and indexed for Nexus", source: "Orion, Nexus" },
  { value: 40, suffix: "%", label: "faster query resolution with the HR assistant", source: "Orion, Nexus" },
  { value: 97, suffix: "%", label: "classification accuracy fusing RGB and hyperspectral features", source: "IEEE conference paper" },
];

export const experience = [
  {
    id: "orion",
    org: "Orion Innovation",
    role: "AI Engineer",
    place: "Chennai, India",
    period: "Nov 2024 to present",
    summary: "Building production GenAI systems for enterprise clients.",
    highlights: [
      {
        id: "finance",
        title: "GenAI financial document intelligence (client project)",
        text: "",
        points: [
          "Developed a GenAI document intelligence solution for financial document Q&A, cutting analyst document-search time by 40%.",
          "Built end-to-end RAG pipelines with embeddings, semantic search and an OpenSearch vector database, improving retrieval recall by 25%.",
          "Designed agentic workflows in LangGraph for multi-step orchestration, retrieval and tool integration, cutting manual follow-ups by 30%.",
          "Applied prompt engineering, few-shot prompting and context grounding, improving accuracy by 20% and cutting hallucinations by 35%.",
          "Built LLM evaluation workflows for relevance, recall, faithfulness and consistency, raising faithfulness by 15%.",
          "Used AWS S3, EC2 and Lambda for scalable document processing and LLM inference, lowering latency by 25%.",
        ],
        tags: ["RAG", "LangGraph", "OpenSearch", "LLM evaluation", "AWS"],
      },
      {
        id: "nexus",
        title: "Nexus, an enterprise GenAI knowledge assistant",
        text: "",
        points: [
          "Developed OI Nexus, an internal AI chatbot for employee questions on HR policies, hybrid work and leave, cutting query resolution time by 40% and repetitive HR tickets by 30%.",
          "Built and optimized RAG pipelines with embeddings and vector search over enterprise document repositories, improving retrieval accuracy by 25% and reducing irrelevant results by 35%.",
          "Engineered document ingestion, chunking and indexing workflows for large internal knowledge bases, processing 10,000+ documents while cutting indexing latency by 20%.",
          "Refined response quality through prompt engineering, retrieval tuning and evaluation, raising answer accuracy by 15% and user satisfaction by 20%.",
          "Partnered with HR and product stakeholders to define requirements and ship features, driving a 30% adoption increase in the first quarter.",
        ],
        tags: ["RAG", "Vector search", "Prompt engineering", "Chatbot"],
      },
    ],
  },
  {
    id: "liquidmind",
    org: "Liquidmind AI",
    role: "Software Engineer Intern",
    place: "Bangalore, India",
    period: "Jul 2024 to Nov 2024",
    summary: "Backend and document-automation work for business workflows.",
    highlights: [
      {
        id: "internship",
        title: "WhatsApp automation and OCR",
        text: "",
        points: [
          "Developed and deployed backend Flask APIs to integrate a WhatsApp bot for business automation workflows, reducing manual message-handling effort by 30%.",
          "Built an OCR pipeline using Document AI to extract structured information from unstructured documents, improving extraction accuracy and cutting manual data-entry time by 40%.",
          "Worked with senior engineers to test and refine API endpoints before release, improving reliability and reducing post-deployment bug reports.",
        ],
        tags: ["Flask", "REST APIs", "Document AI", "OCR", "WhatsApp bot"],
      },
    ],
  },
];

export const projects = [
  {
    id: "micromanus",
    latin: "Investigator visibilis",
    stage: "plate",
    name: "MicroManus",
    kind: "Deep research AI agent",
    summary:
      "A full-stack deep research agent with a visible reasoning loop, so users see the model's multi-step research and tool use as it happens. Built without LangChain or LangGraph, and live.",
    points: [
      "Added social login with OAuth and usage-based billing using Supabase and Stripe, for production-ready onboarding and metered monetization.",
      "Designed a bring-your-own-key system that encrypts user-provided API keys with AES-256-GCM, giving self-managed access to multiple LLM providers.",
      "Integrated SerpAPI for live web search grounding and deployed on Vercel as a public product.",
    ],
    stack: ["Next.js", "React", "TypeScript", "Node.js", "Supabase", "Stripe", "SerpAPI", "OpenAI API", "Claude API", "AES-256-GCM", "Vercel"],
    links: [{ label: "Live site", href: "https://micromanus-mu-five.vercel.app/" }],
  },
  {
    id: "plant-disease",
    latin: "Folium fusionis",
    stage: "plate",
    name: "Plant Disease Detection Using Feature Fusion",
    kind: "Research, IEEE conference publication",
    summary:
      "A deep learning model that fuses spatial (RGB) and spectral (hyperspectral) features to classify plant diseases. It reached 97% accuracy, 5% better than single-modality baselines.",
    points: [
      "Processed hyperspectral image data with band selection, normalization and feature extraction, and augmented 5,000+ images with OpenCV and NumPy, reducing overfitting by 15%.",
      "Fused handcrafted HOG descriptors with ResNet50 deep features, improving robustness under varying lighting.",
      "Co-authored the findings for an IEEE conference, contributing multi-modal fusion techniques to agricultural disease detection.",
    ],
    stack: ["Python", "TensorFlow", "Keras", "OpenCV", "NumPy", "Pandas", "Scikit-learn"],
    links: [],
  },
  {
    id: "dualmind",
    latin: "Iudex duplex",
    stage: "plate",
    name: "DualMind AI",
    kind: "LLM benchmarking framework",
    summary:
      "Compares Qwen2.5 and Claude Sonnet 4 on hallucination rate, bias resistance and content safety, using a 50-prompt test suite. FastAPI backend, GitHub Actions CI, deployed to Vercel, Render and Hugging Face Spaces.",
    points: [],
    stack: ["Python", "FastAPI", "GitHub Actions", "Vercel", "Render", "Hugging Face Spaces"],
    links: [{ label: "Source", href: "https://github.com/Chitraksh23/dualmind-ai-eval" }],
  },
  {
    id: "grounding-auditor",
    latin: "Veritas atomica",
    stage: "plate",
    name: "Grounding Auditor",
    kind: "Hallucination detection kit",
    summary:
      "Checks RAG output for hallucinations. It splits an answer into atomic claims, checks each claim against its sources and combines the results into a hallucination score. Built for the Lamatic AgentKit challenge with a Next.js interface.",
    points: [],
    stack: ["Next.js", "Lamatic AgentKit", "GraphQL"],
    links: [],
  },
  {
    id: "visa-advisor",
    latin: "Viator consultans",
    stage: "greenhouse",
    name: "Visa Advisor",
    kind: "Tool-calling chatbot",
    summary:
      "Suggests countries and visa routes based on your interests, then walks through the application process end to end. Uses a Groq-hosted open LLM with SerpAPI tool calling for current web results.",
    points: [],
    stack: ["Groq", "SerpAPI", "Tool calling", "Vercel"],
    links: [],
  },
  {
    id: "nse-screener",
    latin: "Taurus ursusque",
    stage: "plate",
    name: "NSE Stock Screener",
    kind: "Real-time market analysis",
    summary:
      "A real-time screener for NSE-listed stocks, connected to Angel One's SmartAPI. It computes SMMA indicators, detects crossover signals, adds an ML scoring layer and shows everything in a Streamlit dashboard. Packaged as a Windows executable.",
    points: [],
    stack: ["Python", "Streamlit", "SmartAPI", "Machine learning"],
    links: [],
  },
];

export const skills = [
  { group: "Languages", items: ["Python", "C"] },
  {
    group: "ML and deep learning",
    items: ["TensorFlow", "Keras", "PyTorch", "Scikit-learn", "Pandas", "NumPy", "Hugging Face Transformers"],
  },
  {
    group: "GenAI and LLMs",
    items: [
      "RAG",
      "LangChain",
      "LangGraph",
      "LlamaIndex",
      "OpenAI API",
      "Anthropic Claude API",
      "Prompt engineering",
      "LLM evaluation (RAGAS)",
      "Fine-tuning (LoRA, QLoRA)",
      "vLLM",
      "Ollama",
    ],
  },
  {
    group: "Agentic AI",
    items: ["AI agents", "MCP", "Function and tool calling", "Structured outputs", "Model context engineering"],
  },
  { group: "Data and vector databases", items: ["FAISS", "Chroma DB", "Pinecone", "OpenSearch", "MySQL"] },
  {
    group: "Cloud and DevOps",
    items: ["AWS", "Docker", "Kubernetes", "CI/CD", "GitHub Actions", "FastAPI", "Git", "Jupyter"],
  },
];

export const education = [
  {
    id: "amrita",
    kind: "Education",
    title: "B.Tech, Computer and Communication Engineering",
    org: "Amrita Vishwa Vidyapeetham, Coimbatore",
    note: "2020 to 2024",
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
    kind: "Publication",
    title: "Plant Disease Detection Using Feature Fusion",
    org: "IEEE conference paper",
    note: "",
  },
];
