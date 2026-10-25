// Turns the content file into small passages the search box can retrieve.
// Pure data in, plain objects out. Runs in the browser and in tests.

export function buildChunks({ site, experience, projects, skills, education }) {
  const chunks = [];

  chunks.push({
    id: "about",
    section: "About",
    where: "",
    title: "About me",
    text: site.about,
    tags: [site.role, site.employer, site.location].filter(Boolean),
    anchor: "top",
  });

  for (const role of experience) {
    const base = { section: "Experience", where: role.org, anchor: `role-${role.id}` };
    chunks.push({
      ...base,
      id: role.id,
      title: `${role.role} at ${role.org}`,
      text: role.summary,
      tags: [],
    });
    for (const h of role.highlights ?? []) {
      chunks.push({ ...base, id: `${role.id}-${h.id}`, title: h.title, text: h.text, tags: h.tags ?? [] });
      (h.points ?? []).forEach((point, i) => {
        chunks.push({ ...base, id: `${role.id}-${h.id}-${i}`, title: h.title, text: point, tags: h.tags ?? [] });
      });
    }
  }

  for (const p of projects) {
    chunks.push({
      id: `project-${p.id}`,
      section: "Projects",
      where: p.kind,
      title: p.name,
      text: p.summary,
      tags: p.stack ?? [],
      anchor: `project-${p.id}`,
    });
  }

  for (const s of skills) {
    chunks.push({
      id: `skills-${s.group}`,
      section: "Skills",
      where: s.group,
      title: s.group,
      text: s.items.join(", "),
      tags: [],
      anchor: "skills",
    });
  }

  for (const e of education) {
    chunks.push({
      id: `education-${e.id}`,
      section: "Education",
      where: e.kind,
      title: e.title,
      text: [e.org, e.note].filter(Boolean).join(". "),
      tags: [],
      anchor: "education",
    });
  }

  const c = site.contact ?? {};
  const ways = [
    c.email && `email ${c.email}`,
    c.linkedin && "LinkedIn",
    c.github && "GitHub",
    c.resume && "my resume",
  ].filter(Boolean);
  if (ways.length) {
    chunks.push({
      id: "contact",
      section: "Contact",
      where: "",
      title: "Get in touch",
      text: `You can reach me through ${ways.join(", ")}. Links are in the contact section.`,
      tags: [],
      anchor: "contact",
    });
  }

  return chunks;
}
