import { FC } from "react";
import { motion } from "framer-motion";
import SkillBar from "@/components/SkillBar";
import ContactForm from "@/components/ContactForm";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Linkedin, Github, ChevronRight } from 'lucide-react';

const DataEngineer: FC = () => {
  const skills = [
    { skill: "SAP BODS", level: 4 },
    { skill: "Oracle SQL", level: 4 },
    { skill: "Microsoft SQL Server", level: 3 },
    { skill: "Python", level: 2 },
    { skill: "Power BI", level: 3 },
    { skill: "Excel", level: 3 },
    { skill: "ETL", level: 4 },
    { skill: "Data Warehousing", level: 3 },
    { skill: "Data Modeling", level: 3 },
    { skill: "Big Data", level: 2 },
  ];

  const experiences = [
    {
      title: "Associate Consultant",
      company: "Capgemini",
      period: "2023 - Present",
      description: [
        "Led the development and optimization of data pipelines, improving overall processing efficiency.",
        "Addressed complex data configuration issues, enhancing data integrity and reliability.",
        "Developed and maintained ETL pipelines using BODS tools, ensuring smooth data integration.",
        "Collaborated with cross-functional teams to align data engineering solutions with key business objectives.",
      ],
    },
    {
      title: "Senior Analyst",
      company: "Capgemini",
      period: "2022 - 2023",
      description: [
        "Engineered ETL processes to transfer 1M+ daily records from Excel to Microsoft SQL Server Data Warehouse",
        "Designed and implemented Power BI dashboards for resource utilization and performance analytics",
        "Optimized low-performing data pipelines, reducing runtime by 35% and improving system efficiency",
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

      <main className="max-w-4xl mx-auto px-4 pt-24 pb-16 space-y-20">
        <motion.section 
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-primary">
            Data Engineer
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            Results-driven Data Engineer specializing in ETL development, data analysis, and scalable data solutions.
          </p>
        </motion.section>

        <motion.section 
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-2xl font-semibold text-primary">Experience</h2>
          <div className="space-y-6">
            {experiences.map((exp, index) => (
              <Card key={exp.title + exp.period} className="border-primary/10">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl text-primary font-medium">{exp.title}</h3>
                      <p className="text-muted">{exp.company} | {exp.period}</p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-muted">
                    {exp.description.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <ChevronRight className="w-4 h-4 mr-2 mt-1 text-accent flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>

        <motion.section 
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
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
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl font-semibold text-primary">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-primary/10">
              <CardContent className="p-6">
                <img src="/Youtube_Channel_Statistics.png" alt="YouTube Channel Statistics Analyzer" className="w-full h-40 object-cover rounded-md mb-4" />
                <h3 className="text-xl text-primary font-medium mb-2">YouTube Channel Statistics Analyzer</h3>
                <p className="text-muted mb-4">
                  An open-source Python project using the YouTube API to extract channel data and generate analytics dashboards.
                </p>
                <div className="flex gap-4">
                  <a 
                    href="https://youtube-stats.streamlit.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-accent/80 transition-colors font-medium"
                  >
                    View Project
                  </a>
                  <a 
                    href="https://github.com/MinHackerz/youtube-stats"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    GitHub
                  </a>
                </div>
              </CardContent>
            </Card>
            <Card className="border-primary/10">
              <CardContent className="p-6">
                <img src="/VidStats.png" alt="VidStats" className="w-full h-40 object-cover rounded-md mb-4" />
                <h3 className="text-xl text-primary font-medium mb-2">VidStats</h3>
                <p className="text-muted mb-4">
                  A SaaS platform empowering YouTube creators with powerful analytics and tools to grow their audience and engagement.
                </p>
                <div className="flex gap-4">
                  <a 
                    href="https://vidstats.pro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-accent/80 transition-colors font-medium"
                  >
                    View Project
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        <motion.section 
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
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

export default DataEngineer;