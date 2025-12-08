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
      <h2 className="mb-6 text-xl font-normal tracking-tight">projects</h2>

      <div className="space-y-8">
        {projects.map((project, index) => (
          <div
            key={index}
            className="group relative flex flex-col items-start transition-opacity hover:opacity-100"
          >
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <div className="flex items-baseline justify-between w-full mb-1">
                <h3 className="text-lg font-normal group-hover:underline decoration-1 underline-offset-4">
                  {project.title}
                </h3>
                <span className="text-sm text-gray-400 font-mono tabular-nums">
                  {project.year}
                </span>
              </div>

              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-2 font-serif text-lg">
                {project.description}
              </p>

              <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                {project.tech}
              </div>
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}

export default EnhancedExperiments
