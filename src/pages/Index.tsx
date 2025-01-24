import { type FC, useEffect } from "react"
import { Database, Globe, Megaphone, Heart } from "lucide-react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"

const Index: FC = () => {
  useEffect(() => {
    document.title = "Menajul Hoque Portfolio | Home"
  }, [])

  const roles = [
    {
      title: "Data Engineer",
      icon: Database,
      path: "/data-engineer",
      description: "Building robust data pipelines and analytics solutions",
    },
    {
      title: "Web Developer",
      icon: Globe,
      path: "/web-developer",
      description: "Creating modern and responsive web applications",
    },
    {
      title: "Digital Marketer",
      icon: Megaphone,
      path: "/digital-marketing",
      description: "Driving growth through digital marketing strategies",
    },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-between p-4 animate-fade-in">
      <div className="max-w-4xl mx-auto w-full flex-grow">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/" className="inline-block">
            <img
              src="/Menajul_Picture.jpg"
              alt="Menajul Hoque"
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover transition-all duration-300 hover:border hover:border-orange-500"
            />
          </Link>
          <img src="/Menajul_Signature.svg" alt="Signature" className="h-12 mx-auto object-contain opacity-70 mb-4" />
          <h1 className="text-2xl font-bold mb-2 relative inline-block px-4 py-1">
            <span className="relative z-10 text-white">Menajul Hoque</span>
            <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-75 blur-lg animate-pulse rounded-full scale-110"></span>
            <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 animate-shimmer rounded-full scale-110"></span>
          </h1>
          <p className="text-muted text-lg mt-4">
            Data Engineer | Full-Stack Developer | Digital Marketer | Entrepreneur
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role, index) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={role.path} className="group block">
                <div className="p-6 rounded-lg bg-background border border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all duration-300 h-full flex flex-col group">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mr-4 transition-colors group-hover:bg-orange-100">
                      <role.icon className="w-5 h-5 text-primary transition-colors group-hover:text-orange-700" />
                    </div>
                    <h2 className="text-primary text-xl font-semibold transition-colors group-hover:text-orange-700">
                      {role.title}
                    </h2>
                  </div>
                  <p className="text-muted text-sm flex-grow group-hover:text-orange-700">{role.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      <footer className="mt-20 py-6 border-t border-gray-200 w-full">
        <div className="text-center text-sm text-gray-500">
          Designed and Crafted with <Heart className="inline-block w-4 h-4 text-red-500 mx-1" /> by Menajul Hoque
        </div>
      </footer>
    </div>
  )
}

export default Index