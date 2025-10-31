import { type FC } from "react"
import { ExternalLink, Globe, Code, Calendar } from "lucide-react"

interface Project {
  title: string
  year: string
  description: string
  tech: string
  status: string
  link: string
}

interface EnhancedExperimentsProps {
  projects: Project[]
}

const EnhancedExperiments: FC<EnhancedExperimentsProps> = ({ projects }) => {

  return (
    <section className="mb-12">
      <h2 className="mb-8">experiments</h2>
      <p className="text-subtle pb-4 hover-border" style={{ marginBottom: '24px' }}>
        Technical projects and experiments exploring data engineering, web development, and digital tools.
      </p>
      
      <div className="relative">
        {/* Main content */}
        <div className="space-y-8">
          {projects.map((project, index) => (
            <div 
              key={index}
              className="project-item group relative"
            >
              {/* Enhanced project card */}
              <div className="project-card bg-white dark:bg-transparent rounded-lg p-6 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/20 relative">
                {/* Project link in top right corner */}
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-4 right-4 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 z-10"
                  title={`Visit ${project.title}`}
                >
                  <ExternalLink className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </a>

                <div className="flex items-center gap-4 mb-4 pr-12">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-700">
                    <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-200">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      {project.status === 'Live' && (
                        <span className="live-dot"></span>
                      )}
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {project.year}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-subtle leading-relaxed mb-4 text-gray-700 dark:text-gray-300">
                  {project.description}
                </p>
                
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <p className="text-xs text-muted font-mono">
                    {project.tech}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default EnhancedExperiments
