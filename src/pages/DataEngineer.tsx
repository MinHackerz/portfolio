import { type FC, useEffect } from "react"
import { motion } from "framer-motion"
import SkillBar from "@/components/SkillBar"
import ContactForm from "@/components/ContactForm"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Linkedin, Github, ChevronRight, Eye, Heart } from "lucide-react"
import { Helmet } from "react-helmet-async"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ProjectCard from "@/components/ProjectCard"
import { Project } from "@/types/project"

const DataEngineer: FC = () => {
  useEffect(() => {
    document.title = "Menajul Hoque | Data Engineer Portfolio"
  }, [])

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
  ]

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
  ]

  const education = {
    degree: "Bachelor of Engineering in Power Engineering",
    university: "Jadavpur University",
    cgpa: 8.06,
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <Helmet>
          <title>Data Engineer Portfolio</title>
          <meta name="description" content="Data Engineer Portfolio showcasing my projects and skills" />
        </Helmet>
        <div className="max-w-4xl mx-auto px-4 pt-20 md:pt-24 pb-16 space-y-20 relative z-10">
          <motion.section
            className="text-center space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="hidden md:block mb-4">
              <img
                src="/Menajul_Picture.jpg"
                alt="Menajul Hoque"
                className="w-32 h-32 rounded-full object-cover mx-auto border-2 border-orange-500 transition-transform duration-300 ease-in-out hover:scale-110 shadow-lg"
              />
            </div>
            <h1 className="text-4xl font-bold text-primary text-gradient">Data Engineer</h1>
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
            <h2 className="text-2xl font-semibold text-primary relative">
              Experience
              <span className="block h-1 w-16 bg-accent mt-1 rounded"></span>
            </h2>
            <div className="space-y-6">
              {experiences.map((exp, index) => (
                <Card key={exp.title + exp.period} className="bg-glass card-gradient border-gradient">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl text-primary font-medium">{exp.title}</h3>
                        <p className="text-muted">
                          {exp.company} | {exp.period}
                        </p>
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
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <h2 className="text-2xl font-semibold text-primary relative">
              Educational Qualification
              <span className="block h-1 w-16 bg-accent mt-1 rounded"></span>
            </h2>
            <Card className="bg-glass card-gradient border-gradient">
              <CardContent className="p-6">
                <h3 className="text-xl text-primary font-medium mb-2">{education.degree}</h3>
                <p className="text-muted">{education.university}</p>
                <p className="text-muted">CGPA: {education.cgpa}</p>
              </CardContent>
            </Card>
          </motion.section>

          <motion.section
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <h2 className="text-2xl font-semibold text-primary relative">
              Skills
              <span className="block h-1 w-16 bg-accent mt-1 rounded"></span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 bg-glass p-6 rounded-lg border-gradient">
              {skills.map((skill) => (
                <SkillBar key={skill.skill} skill={skill.skill} level={skill.level} />
              ))}
            </div>
          </motion.section>

          <motion.section
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <h2 className="text-2xl font-semibold text-primary relative">
              Featured Projects
              <span className="block h-1 w-16 bg-accent mt-1 rounded"></span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-glass card-gradient border-gradient">
                <CardContent className="p-6">
                  <div className="relative group overflow-hidden rounded-md mb-4">
                    <img
                      src="/ytstats-pro.webp"
                      alt="YT Stats"
                      className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-3 w-full">
                        <div className="flex flex-wrap gap-2">
                          <a
                            href="https://ytstats.pro"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white hover:text-orange-300 transition-colors font-medium flex items-center bg-black/30 px-2 py-1 rounded-full text-sm"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View Project
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl text-primary font-medium mb-2">YT Stats</h3>
                  <p className="text-muted mb-4">
                    A modern landing page that redirects users to advanced YouTube analytics tools, helping creators optimize their channel growth and performance.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-glass card-gradient border-gradient">
                <CardContent className="p-6">
                  <div className="relative group overflow-hidden rounded-md mb-4">
                    <img
                      src="/youtubetranscript-demo.gif"
                      alt="YouTube Transcript"
                      className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-3 w-full">
                        <div className="flex flex-wrap gap-2">
                          <a
                            href="https://youtubetranscript.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white hover:text-orange-300 transition-colors font-medium flex items-center bg-black/30 px-2 py-1 rounded-full text-sm"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View Project
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl text-primary font-medium mb-2">YouTube Transcript</h3>
                  <p className="text-muted mb-4">
                    An AI-powered website that provides free transcripts of YouTube videos reformatted with punctuation using AI. Users can summarize the transcript, generate captions, and translate content into over 125 languages.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-glass card-gradient border-gradient">
                <CardContent className="p-6">
                  <div className="relative group overflow-hidden rounded-md mb-4">
                    <img
                      src="/Youtube_Channel_Statistics.png"
                      alt="YouTube Channel Statistics Analyzer"
                      className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-3 w-full">
                        <div className="flex flex-wrap gap-2">
                          <a
                            href="https://youtube-stats.streamlit.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white hover:text-orange-300 transition-colors font-medium flex items-center bg-black/30 px-2 py-1 rounded-full text-sm"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View Project
                          </a>
                          <a
                            href="https://github.com/MinHackerz/youtube-stats"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white hover:text-orange-300 transition-colors font-medium flex items-center bg-black/30 px-2 py-1 rounded-full text-sm"
                          >
                            <Github className="w-3 h-3 mr-1" />
                            GitHub
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl text-primary font-medium mb-2">YouTube Channel Statistics Analyzer</h3>
                  <p className="text-muted mb-4">
                    An open-source Python project using the YouTube API to extract channel data and generate analytics
                    dashboards.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-glass card-gradient border-gradient">
                <CardContent className="p-6">
                  <div className="relative group overflow-hidden rounded-md mb-4">
                    <img 
                      src="/VidStats.png" 
                      alt="VidStats" 
                      className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-3 w-full">
                        <div className="flex flex-wrap gap-2">
                          <a
                            href="https://vidstats.pro"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white hover:text-orange-300 transition-colors font-medium flex items-center bg-black/30 px-2 py-1 rounded-full text-sm"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View Project
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl text-primary font-medium mb-2">VidStats</h3>
                  <p className="text-muted mb-4">
                    A SaaS platform empowering YouTube creators with powerful analytics and tools to grow their audience
                    and engagement.
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.section>

          <motion.section
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
          >
            <h2 className="text-2xl font-semibold text-primary relative">
              Get in Touch
              <span className="block h-1 w-16 bg-accent mt-1 rounded"></span>
            </h2>
            <div className="bg-glass border-gradient rounded-lg p-4">
              <CardContent className="p-6">
                <ContactForm />
              </CardContent>
            </div>
          </motion.section>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default DataEngineer