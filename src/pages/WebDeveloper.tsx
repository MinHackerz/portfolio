import { FC } from "react";
import { SkillBar } from "@/components/SkillBar";

const WebDeveloper: FC = () => {
  const skills = [
    { name: "Next.js", level: 3 },
    { name: "TypeScript", level: 3 },
    { name: "Tailwind CSS", level: 2 },
    { name: "HTML", level: 3 },
    { name: "CSS", level: 3 },
    { name: "JavaScript", level: 3 },
    { name: "Supabase", level: 2 },
  ];

  const projects = [
    {
      name: "Quran GPT",
      description: "An AI-powered platform that uses the Gemini Pro API to provide Islamic query responses with references.",
      links: [
        { url: "https://quran-gpt.netlify.app/", label: "View Project 1" },
        { url: "https://quran-gpt-new.vercel.app/", label: "View Project 2" },
      ],
    },
    {
      name: "IG Tools",
      description: "A WordPress website featuring over 100 productivity tools for social media, SEO, and web development.",
      links: [
        { url: "https://igtoolsapk.in", label: "View Project" },
      ],
    },
    {
      name: "VidStats",
      description: "A SaaS platform that empowers YouTube creators by providing powerful analytics and tools to help them grow their audience and engagement.",
      links: [
        { url: "https://vidstats.pro", label: "View Project" },
      ],
    },
    {
      name: "Mock Nest",
      description: "A mock test providing website that helps candidates prepare themselves with relevant questions for any competitive test.",
      links: [
        { url: "https://mocknest.com", label: "View Project" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background p-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-light text-primary mb-8">Web Developer</h1>
        
        <section className="mb-12">
          <h2 className="text-2xl font-light text-primary mb-4">About Me</h2>
          <p className="text-text/80 leading-relaxed">
            As a web developer, I specialize in creating modern, responsive web applications 
            using cutting-edge technologies. My focus is on delivering clean, efficient code 
            and exceptional user experiences through thoughtful design and implementation.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-light text-primary mb-6">Skills</h2>
          <div className="space-y-4">
            {skills.map((skill) => (
              <SkillBar 
                key={skill.name}
                name={skill.name}
                level={skill.level}
                maxLevel={4}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-light text-primary mb-6">Projects</h2>
          <div className="grid gap-6">
            {projects.map((project) => (
              <div key={project.name} className="p-6 border border-primary/20 rounded-lg">
                <h3 className="text-xl font-light text-primary mb-2">{project.name}</h3>
                <p className="text-text/80 mb-4">{project.description}</p>
                <div className="flex gap-4">
                  {project.links.map((link) => (
                    <a 
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-secondary transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default WebDeveloper;