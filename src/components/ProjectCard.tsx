interface ProjectCardProps {
  title: string;
  description: string;
  link?: string;
  github?: string;
}

const ProjectCard = ({ title, description, link, github }: ProjectCardProps) => {
  return (
    <div className="border border-primary/20 rounded-lg p-6 transition-all duration-300 hover:border-primary">
      <h3 className="text-xl text-primary mb-2 font-light">{title}</h3>
      <p className="text-primary/80 mb-4 font-light">{description}</p>
      <div className="flex gap-4">
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-secondary transition-colors font-light"
          >
            View Project
          </a>
        )}
        {github && (
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-secondary transition-colors font-light"
          >
            GitHub
          </a>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;