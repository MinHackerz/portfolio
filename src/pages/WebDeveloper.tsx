import { FC } from "react";
import { motion } from "framer-motion";
import SkillBar from "@/components/SkillBar";
import ContactForm from "@/components/ContactForm";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Linkedin, Github, ChevronRight } from 'lucide-react';

const WebDeveloper: FC = () => {
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
      {/* Header */}
      <header className="fixed top-4 left-1/2 transform -translate-x-1/2 w-full max-w-5xl z-50">
        <div className="mx-4 bg-background/80 backdrop-blur-sm border border-primary/10 rounded-full">
          <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <a href="/">
                <img
                  src="/Menajul_Picture.jpg"
                  alt="Menajul Hoque"
                  className="w-10 h-10 rounded-full object-cover border border-accent/20 cursor-pointer"
                />
              </a>
              <img
                src="/Menajul_Signature.png"
                alt="Signature"
                className="h-8 object-contain"
              />
            </div>
            <div className="flex items-center space-x-6">
              <a href="mailto:menajulhoque99@gmail.com" className="text-muted hover:text-accent transition-colors">
                <Mail className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/in/menajul-hoque/" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://github.com/MinHackerz" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
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