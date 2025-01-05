import { FC, useEffect } from "react";
import { motion } from "framer-motion";
import SkillBar from "@/components/SkillBar";
import ContactForm from "@/components/ContactForm";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from 'lucide-react';
import PortfolioHeader from "@/components/PortfolioHeader";

const WebDeveloper: FC = () => {
  useEffect(() => {
    document.title = 'Menajul Hoque | Web Developer Portfolio';
  }, []);

  const skills = [
    { skill: "Next.js", level: 3 },
    { skill: "TypeScript", level: 3 },
    { skill: "Tailwind CSS", level: 2 },
    { skill: "HTML", level: 3 },
    { skill: "CSS", level: 3 },
    { skill: "JavaScript", level: 3 },
    { skill: "Supabase", level: 2 },
  ];

  const projects = [
    {
      name: "Quran GPT",
      description: "An AI-powered platform that uses the Gemini Pro API to provide Islamic query responses with references.",
      image: "/QuranGPT.png",
      links: [
        { url: "https://quran-gpt.netlify.app/", label: "View Project 1" },
        { url: "https://quran-gpt-new.vercel.app/", label: "View Project 2" },
      ],
    },
    {
      name: "IG Tools",
      description: "A WordPress website featuring over 100 productivity tools for social media, SEO, and web development.",
      image: "/IGTools.png",
      links: [
        { url: "https://igtoolsapk.in", label: "View Project" },
      ],
    },
    {
      name: "VidStats",
      description: "A SaaS platform that empowers YouTube creators by providing powerful analytics and tools to help them grow their audience and engagement.",
      image: "/VidStats.png",
      links: [
        { url: "https://vidstats.pro", label: "View Project" },
      ],
    },
    {
      name: "Mock Nest",
      description: "A mock test providing website that helps candidates prepare themselves with relevant questions for any competitive test.",
      image: "/MockNest.png",
      links: [
        { url: "https://mocknest.com", label: "View Project" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <PortfolioHeader />

      <main className="max-w-4xl mx-auto px-4 pt-24 pb-16 space-y-20">
        <motion.section 
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-primary">
            Web Developer
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            Specializing in modern, responsive web applications using cutting-edge technologies. 
            Focused on delivering clean, efficient code and exceptional user experiences.
          </p>
        </motion.section>

        <motion.section 
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-2xl font-semibold text-primary">Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {skills.map((skill) => (
              <SkillBar 
                key={skill.skill}
                skill={skill.skill}
                level={skill.level}
              />
            ))}
          </div>
        </motion.section>

        <motion.section 
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold text-primary">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Card className="border-primary/10 hover:border-accent/50 transition-colors">
                  <CardContent className="p-6">
                    <img src={project.image} alt={project.name} className="w-full h-40 object-cover rounded-md mb-4" />
                    <h3 className="text-xl text-primary font-medium mb-2">{project.name}</h3>
                    <p className="text-muted mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-4">
                      {project.links.map((link) => (
                        <a 
                          key={link.url}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:text-accent/80 transition-colors font-medium flex items-center"
                        >
                          {link.label}
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section 
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl font-semibold text-primary">Get in Touch</h2>
          <Card className="border-primary/10">
            <CardContent className="p-6">
              <ContactForm />
            </CardContent>
          </Card>
        </motion.section>
      </main>
    </div>
  );
};

export default WebDeveloper;
