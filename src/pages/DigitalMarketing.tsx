import { type FC, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import SkillBar from "@/components/SkillBar"
import ContactForm from "@/components/ContactForm"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Linkedin, Github, ChevronRight, Eye, Briefcase, X, Heart } from "lucide-react"
import { Helmet } from "react-helmet-async"

const AchievementModal: FC<{ src: string; alt: string; onClose: () => void }> = ({ src, alt, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.8 }}
      className="relative max-w-4xl w-full mx-4"
      onClick={(e) => e.stopPropagation()}
    >
      <img src={src || "/placeholder.svg"} alt={alt} className="w-full h-auto rounded-lg shadow-xl" />
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-colors"
        aria-label="Close modal"
      >
        <X size={24} />
      </button>
    </motion.div>
  </motion.div>
)

const AchievementCard: FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="cursor-pointer overflow-hidden rounded-lg shadow-md"
        onClick={() => setIsOpen(true)}
      >
        <img src={src || "/placeholder.svg"} alt={alt} className="w-full h-auto object-cover" />
      </motion.div>
      <AnimatePresence>
        {isOpen && <AchievementModal src={src} alt={alt} onClose={() => setIsOpen(false)} />}
      </AnimatePresence>
    </>
  )
}

const DigitalMarketing: FC = () => {
  useEffect(() => {
    document.title = "Menajul Hoque | Digital Marketing Portfolio"
  }, [])

  const skills = [
    { skill: "SEO", level: 4 },
    { skill: "Content Marketing", level: 4 },
    { skill: "Social Media Marketing", level: 3 },
    { skill: "Google Analytics", level: 4 },
    { skill: "Google Ads", level: 3 },
    { skill: "Email Marketing", level: 3 },
    { skill: "WordPress", level: 4 },
  ]

  const projects = [
    {
      name: "IG Tools",
      description:
        "A WordPress website featuring over 100 productivity tools for social media, SEO, and web development.",
      image: "/IGTools.png",
      links: [{ url: "https://igtoolsapk.in", label: "View Project" }],
    },
    {
      name: "Mock Nest",
      description:
        "A mock test providing website that helps candidates prepare themselves with relevant questions for any competitive test.",
      image: "/MockNest.png",
      links: [{ url: "https://mocknest.com", label: "View Project" }],
    },
    {
      name: "VidStats",
      description:
        "A SaaS platform that empowers YouTube creators by providing powerful analytics and tools to help them grow their audience and engagement.",
      image: "/VidStats.png",
      links: [{ url: "https://vidstats.pro", label: "View Project" }],
    },
  ]

  const experience = {
    title: "Digital Marketing Specialist (Freelance)",
    company: "Fiverr.com",
    period: "2020 - 2022",
    description:
      "Provided comprehensive digital marketing services to diverse clients, leveraging skills in SEO, content marketing, and social media strategy. Improved online presence and engagement for small to medium-sized businesses across various industries.",
    achievements: [
      "Increased organic traffic by an average of 40% for client websites through targeted SEO strategies",
      "Developed and executed content marketing plans that boosted client engagement rates by 25%",
      "Managed social media campaigns resulting in a 50% increase in follower growth and interaction",
      "Implemented Google Analytics and Google Ads campaigns, achieving a 30% improvement in conversion rates",
    ],
  }

  const achievements = [
    { src: "/Achievement1.png", alt: "Achievement 1" },
    { src: "/Achievement2.png", alt: "Achievement 2" },
    { src: "/Achievement3.png", alt: "Achievement 3" },
    { src: "/Achievement4.png", alt: "Achievement 4" },
    { src: "/Achievement5.png", alt: "Achievement 5" },
  ]

  return (
    <>
      <Helmet>
        <title>Digital Marketing Portfolio</title>
        <meta name="description" content="Digital Marketing Portfolio showcasing my projects and skills" />
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

        {/* Main Content */}
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
            <h1 className="text-4xl font-bold text-primary">Digital Marketing Specialist</h1>
            <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed">
              Experienced in creating and optimizing digital marketing strategies, with a focus on SEO, content
              marketing, and analytics to drive growth and engagement.
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
            <Card className="border-primary/10 hover:border-accent transition-colors">
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
            <Card className="border-primary/10 hover:border-accent transition-colors">
              <CardContent className="p-6">
                <h3 className="text-xl text-primary font-medium mb-2">Bachelor of Engineering in Power Engineering</h3>
                <p className="text-muted">Jadavpur University</p>
                <p className="text-muted">CGPA: 8.06</p>
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
              {projects.map((project, index) => (
                <Card key={project.name} className="border-primary/10 hover:border-accent transition-colors">
                  <CardContent className="p-6">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.name}
                      className="w-full h-40 object-cover rounded-md mb-4"
                    />
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
            transition={{ duration: 0.5, delay: 0.45 }}
          >
            <h2 className="text-2xl font-semibold text-primary relative">
              Achievements
              <span className="block h-1 w-16 bg-accent mt-1 rounded"></span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {achievements.map((achievement, index) => (
                <AchievementCard key={index} src={achievement.src} alt={achievement.alt} />
              ))}
            </div>
          </motion.section>

          <motion.section
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
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

export default DigitalMarketing