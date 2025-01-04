import { FC } from "react";
import SkillBar from "@/components/SkillBar";

const DigitalMarketing: FC = () => {
  const skills = [
    { name: "WordPress", level: 3 },
    { name: "SEO", level: 3 },
    { name: "Google Analytics", level: 3 },
    { name: "Google AdSense", level: 3 },
    { name: "Google Search Console", level: 3 },
  ];

  const projects = [
    {
      name: "IG Tools",
      description: "A WordPress website featuring over 100 productivity tools for social media, SEO, and web development.",
      url: "https://igtoolsapk.in",
    },
    {
      name: "Mock Nest",
      description: "A mock test providing website that helps candidates prepare themselves with relevant questions for any competitive test.",
      url: "https://mocknest.com",
    },
  ];

  return (
    <div className="min-h-screen bg-background p-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-light text-primary mb-8">Digital Marketing</h1>
        
        <section className="mb-12">
          <h2 className="text-2xl font-light text-primary mb-4">About Me</h2>
          <p className="text-text/80 leading-relaxed">
            With experience in digital marketing, I specialize in creating and optimizing 
            WordPress websites, implementing technical SEO strategies, and leveraging analytics 
            tools to drive traffic and engagement. My expertise includes both on-page and 
            off-page SEO, as well as setting up and managing Google Analytics and AdSense.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-light text-primary mb-6">Skills</h2>
          <div className="space-y-4">
            {skills.map((skill) => (
              <SkillBar 
                key={skill.name}
                skill={skill.name}
                level={skill.level}
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
                <a 
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-secondary transition-colors"
                >
                  View Project
                </a>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DigitalMarketing;