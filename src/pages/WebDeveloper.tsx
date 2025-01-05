import { FC, useEffect } from "react";
import { motion } from "framer-motion";
import SkillBar from "@/components/SkillBar";
import ContactForm from "@/components/ContactForm";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Linkedin, Github, ChevronRight, Eye } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

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
    <>
      <Helmet>
        <title>Web Developer Portfolio</title>
        <meta name="description" content="Web Developer Portfolio showcasing my projects and skills" />
      </Helmet>
      <div className="min-h-screen bg-background animate-fade-in">
        {/* Desktop Header */}
        <header className="fixed top-4 left-4 z-50 hidden md:block">
          <div className="flex flex-col items-center">
            <a href="/" className="mb-2">
              <img
                src="/Menajul_Sign.svg"
                alt="Menajul Hoque"
                className="w-64 h-32 object-contain"
              />
            </a>
            <div className="flex flex-col space-y-4 mt-2">
              <a 
                href="mailto:menajulhoque99@gmail.com" 
                className="text-muted hover:text-accent transition-colors" 
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a 
                href="https://www.linkedin.com/in/menajul-hoque/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted hover:text-accent transition-colors" 
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="https://github.com/MinHackerz" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted hover:text-accent transition-colors" 
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </header>

        {/* Mobile Header */}
        <header className="fixed top-0 left-0 right-0 z-50 md:hidden">
          <div className="mx-4 my-2 bg-background/80 backdrop-blur-sm border border-primary/10 rounded-full">
            <div className="px-4 py-2 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <a href="/">
                  <img
                    src="/Menajul_Picture.jpg"
                    alt="Menajul Hoque"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </a>
                <img
                  src="/Menajul_Sign.svg"
                  alt="Menajul Hoque Signature"
                  className="h-10 w-10 object-contain"
                />
              </div>
              <div className="flex items-center space-x-4">
                <a href="mailto:menajulhoque99@gmail.com" className="text-muted hover:text-accent transition-colors" aria-label="Email">
                  <Mail className="w-5 h-5" />
                </a>
                <a href="https://www.linkedin.com/in/menajul-hoque/" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent transition-colors" aria-label="LinkedIn">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="https://github.com/MinHackerz" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent transition-colors" aria-label="GitHub">
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 pt-20 md:pt-48 pb-16 space-y-20">
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
            <h2 className="text-2xl font-semibold text-primary relative">
              Skills
              <span className="block h-1 w-16 bg-accent mt-1 rounded"></span>
            </h2>
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
            <h2 className="text-2xl font-semibold text-primary relative">
              Featured Projects
              <span className="block h-1 w-16 bg-accent mt-1 rounded"></span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project, index) => (
                <Card key={project.name} className="border-primary/10 hover:border-accent transition-colors">
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
                          <Eye className="w-4 h-4 mr-1" />
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.section>

          <motion.section 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-2xl font-semibold text-primary relative">
              Get in Touch
              <span className="block h-1 w-16 bg-accent mt-1 rounded"></span>
            </h2>
            <div className="border border-gray-300 hover:border-orange-500 transition-colors rounded-lg p-4">
              <CardContent className="p-6">
                <ContactForm />
              </CardContent>
            </div>
          </motion.section>
        </main>
      </div>
    </>
  );
};

export default WebDeveloper;