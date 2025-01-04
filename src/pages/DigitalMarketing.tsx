import { FC } from "react";
import { Link } from "react-router-dom";
import { Mail, Linkedin, Github } from "lucide-react";
import SkillBar from "@/components/SkillBar";
import ContactForm from "@/components/ContactForm";

const DigitalMarketing: FC = () => {
  const skills = [
    { name: "WordPress", level: 5 },
    { name: "SEO", level: 4 },
    { name: "Google Analytics", level: 4 },
    { name: "Google AdSense", level: 4 },
    { name: "Google Search Console", level: 4 },
  ];

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      {/* Header */}
      <header className="border-b border-primary/10 bg-background/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <img
                src="/placeholder.svg"
                alt="Menajul Hoque"
                className="w-10 h-10 rounded-full object-cover border border-accent/20"
              />
            </Link>
            <Link to="/">
              <img
                src="/placeholder.svg"
                alt="Signature"
                className="h-8 object-contain"
              />
            </Link>
          </div>
          <div className="flex items-center space-x-6 text-sm text-muted">
            <a 
              href="mailto:menajulhoque99@gmail.com" 
              className="flex items-center hover:text-accent transition-colors"
            >
              <Mail className="w-4 h-4 mr-2" />
              menajulhoque99@gmail.com
            </a>
            <a 
              href="https://www.linkedin.com/in/menajul-hoque/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center hover:text-accent transition-colors"
            >
              <Linkedin className="w-4 h-4 mr-2" />
              LinkedIn
            </a>
            <a 
              href="https://github.com/MinHackerz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center hover:text-accent transition-colors"
            >
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto pt-24 px-4">
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

        <section className="mb-12">
          <h2 className="text-2xl font-light text-primary mb-6">Contact Me</h2>
          <ContactForm />
        </section>
      </div>
    </div>
  );
};

export default DigitalMarketing;