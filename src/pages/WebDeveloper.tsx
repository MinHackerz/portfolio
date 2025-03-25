import { type FC, useEffect } from "react"
import { motion } from "framer-motion"
import SkillBar from "@/components/SkillBar"
import ContactForm from "@/components/ContactForm"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Linkedin, Github, ChevronRight, Eye, Briefcase, Heart } from "lucide-react"
import { Helmet } from "react-helmet-async"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

const FullStackDeveloper: FC = () => {
  useEffect(() => {
    document.title = "Menajul Hoque | Full-Stack Developer Portfolio"
  }, [])

  const experience = {
    title: "Individual Learner",
    company: "Loneliness & LLMs",
    period: "2020 - Present",
    description:
      "As an end-to-end web developer, I've been focusing on building and improving VidStats, a SaaS platform for YouTube creators. This journey has been a testament to my ability to learn, adapt, and implement full-stack solutions independently.",
    achievements: [
      "Designed and developed the entire VidStats platform from concept to deployment",
      "Implemented complex data analytics features to provide valuable insights for YouTube creators",
      "Integrated various APIs and services to enhance platform functionality",
      "Optimized performance and user experience through iterative development and user feedback",
      "Managed all aspects of the project including frontend, backend, database, and DevOps",
    ],
  }

  const skills = [
    { skill: "Next.js", level: 3 },
    { skill: "TypeScript", level: 3 },
    { skill: "Tailwind CSS", level: 2 },
    { skill: "HTML", level: 3 },
    { skill: "CSS", level: 3 },
    { skill: "JavaScript", level: 3 },
    { skill: "Supabase", level: 2 },
  ]

  const projects = [
    {
      name: "YT Stats",
      description:
        "A modern landing page that redirects users to advanced YouTube analytics tools, helping creators optimize their channel growth and performance.",
      image: "/ytstats-pro.webp",
      links: [{ url: "https://ytstats.pro", label: "View Project" }],
    },
    {
      name: "YouTube Transcript",
      description:
        "An AI-powered website that provides free transcripts of YouTube videos reformatted with punctuation using AI. Users can summarize the transcript, generate captions, and translate content into over 125 languages.",
      image: "/youtubetranscript-demo.gif",
      links: [{ url: "https://youtubetranscript.com", label: "View Project" }],
    },
    {
      name: "Quran GPT",
      description:
        "An AI-powered platform that uses the Gemini Pro API to provide Islamic query responses with references.",
      image: "/QuranGPT.png",
      links: [
        { url: "https://quran-gpt.netlify.app/", label: "View Project 1" },
        { url: "https://quran-gpt-new.vercel.app/", label: "View Project 2" },
      ],
    },
    {
      name: "IG Tools",
      description:
        "A WordPress website featuring over 100 productivity tools for social media, SEO, and web development.",
      image: "/IGTools.png",
      links: [{ url: "https://igtoolsapk.in", label: "View Project" }],
    },
    {
      name: "VidStats",
      description:
        "A SaaS platform that empowers YouTube creators by providing powerful analytics and tools to help them grow their audience and engagement.",
      image: "/VidStats.png",
      links: [{ url: "https://vidstats.pro", label: "View Project" }],
    },
    {
      name: "Mock Nest",
      description:
        "A mock test providing website that helps candidates prepare themselves with relevant questions for any competitive test.",
      image: "/MockNest.png",
      links: [{ url: "https://mocknest.com", label: "View Project" }],
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
          <title>Full-Stack Developer Portfolio</title>
          <meta name="description" content="Full-Stack Developer Portfolio showcasing my projects and skills" />
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
            <h1 className="text-4xl font-bold text-primary text-gradient">Full-Stack Developer</h1>
            <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed">
              Specializing in modern, responsive web applications using cutting-edge technologies. Focused on delivering
              clean, efficient code and exceptional user experiences across the entire stack.
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
            <Card className="bg-glass card-gradient border-gradient">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Briefcase className="w-6 h-6 text-accent mr-2" />
                  <h3 className="text-xl text-primary font-medium">{experience.title}</h3>
                </div>
                <p className="text-muted mb-2">
                  {experience.company} | {experience.period}
                </p>
                <p className="text-muted mb-4">{experience.description}</p>
                <ul className="list-disc list-inside space-y-2">
                  {experience.achievements.map((achievement, index) => (
                    <li key={index} className="text-muted">
                      {achievement}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
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
            transition={{ duration: 0.5, delay: 0.2 }}
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
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-2xl font-semibold text-primary relative">
              Featured Projects
              <span className="block h-1 w-16 bg-accent mt-1 rounded"></span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project, index) => (
                <Card key={project.name} className="bg-glass card-gradient border-gradient">
                  <CardContent className="p-6">
                    <div className="relative group overflow-hidden rounded-md mb-4">
                      <img
                        src={project.image || "/placeholder.svg"}
                        alt={project.name}
                        className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                        <div className="p-3 w-full">
                          <div className="flex flex-wrap gap-2">
                            {project.links.map((link) => (
                              <a
                                key={link.url}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white hover:text-orange-300 transition-colors font-medium flex items-center bg-black/30 px-2 py-1 rounded-full text-sm"
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                {link.label}
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
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
            transition={{ duration: 0.5, delay: 0.4 }}
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

export default FullStackDeveloper