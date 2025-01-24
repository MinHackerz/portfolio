import { type FC, useEffect } from "react"
import { motion } from "framer-motion"
import SkillBar from "@/components/SkillBar"
import ContactForm from "@/components/ContactForm"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Linkedin, Github, ChevronRight, Eye, Heart } from "lucide-react"
import { Helmet } from "react-helmet-async"

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
    <>
      <Helmet>
        <title>Data Engineer Portfolio</title>
        <meta name="description" content="Data Engineer Portfolio showcasing my projects and skills" />
      </Helmet>
      <div className="min-h-screen bg-background animate-fade-in">
        {/* Desktop Header */}
        <header className="fixed top-4 left-4 z-50 hidden md:block">
          <div className="flex flex-col items-center">
            <a href="/" className="mb-2">
              <img src="/Menajul_Sign.svg" alt="Menajul Hoque" className="w-64 h-32 object-contain" />
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
                  <img src="/Menajul_Picture.jpg" alt="Menajul Hoque" className="w-10 h-10 rounded-full object-cover" />
                </a>
                <img src="/Menajul_Sign.svg" alt="Menajul Hoque Signature" className="h-10 w-10 object-contain" />
              </div>
              <div className="flex items-center space-x-4">
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
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 pt-20 md:pt-24 pb-16 space-y-20">
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
                className="w-32 h-32 rounded-full object-cover mx-auto border-2 border-orange-500 transition-transform duration-300 ease-in-out hover:scale-110"
              />
            </div>
            <h1 className="text-4xl font-bold text-primary">Data Engineer</h1>
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
                <Card key={exp.title + exp.period} className="border-primary/10 hover:border-accent transition-colors">
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
            <Card className="border-primary/10 hover:border-accent transition-colors">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
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
              <Card className="border-primary/10 hover:border-accent transition-colors">
                <CardContent className="p-6">
                  <img
                    src="/Youtube_Channel_Statistics.png"
                    alt="YouTube Channel Statistics Analyzer"
                    className="w-full h-40 object-cover rounded-md mb-4"
                  />
                  <h3 className="text-xl text-primary font-medium mb-2">YouTube Channel Statistics Analyzer</h3>
                  <p className="text-muted mb-4">
                    An open-source Python project using the YouTube API to extract channel data and generate analytics
                    dashboards.
                  </p>
                  <div className="flex gap-4">
                    <a
                      href="https://youtube-stats.streamlit.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:text-accent/80 transition-colors font-medium flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Project
                    </a>
                    <a
                      href="https://github.com/MinHackerz/youtube-stats"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 transition-colors font-medium flex items-center"
                    >
                      <Github className="w-4 h-4 mr-1" />
                      GitHub
                    </a>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-primary/10 hover:border-accent transition-colors">
                <CardContent className="p-6">
                  <img src="/VidStats.png" alt="VidStats" className="w-full h-40 object-cover rounded-md mb-4" />
                  <h3 className="text-xl text-primary font-medium mb-2">VidStats</h3>
                  <p className="text-muted mb-4">
                    A SaaS platform empowering YouTube creators with powerful analytics and tools to grow their audience
                    and engagement.
                  </p>
                  <div className="flex gap-4">
                    <a
                      href="https://vidstats.pro"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:text-accent/80 transition-colors font-medium flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-1" />
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
            transition={{ duration: 0.5, delay: 0.45 }}
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
        <footer className="mt-20 py-6 border-t border-gray-200">
          <div className="text-center text-sm text-gray-500">
            Designed and Crafted with <Heart className="inline-block w-4 h-4 text-red-500 mx-1" /> by Menajul Hoque
          </div>
        </footer>
      </div>
    </>
  )
}

export default DataEngineer