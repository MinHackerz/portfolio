import React, { useState, useEffect } from 'react';
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';

const ProjectCard = ({ project, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="glassmorphism p-6 rounded-lg transition-all duration-300 transform hover:scale-105 relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-aos="fade-left"
      data-aos-delay={index * 200}
    >
      <div
        className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 opacity-0 transition-opacity duration-300 z-0"
        style={{ opacity: isHovered ? 0.2 : 0 }}
      ></div>
      <div className="relative z-10">
        <h3 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-white transition-colors duration-300">
          {project.title}
        </h3>
        <p className="text-gray-600 mb-4 group-hover:text-gray-200 transition-colors duration-300">
          {project.description}
        </p>
        <div className="flex space-x-4">
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-white transition-colors duration-300 flex items-center"
          >
            <FaExternalLinkAlt className="mr-2" /> View Project
          </a>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-white transition-colors duration-300 flex items-center"
            >
              <FaGithub className="mr-2" /> GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const Projects = () => {
  const projects = [
    {
      title: 'YouTube Channel Statistics Analyzer',
      description:
        'Developed an open-source Python project using YouTube API to extract channel data and generate analytics dashboards',
      link: 'https://youtube-stats.streamlit.app/',
      github: 'https://github.com/MinHackerz/youtube-stats',
    },
    {
      title: 'Quran GPT',
      description:
        'Created an AI-powered platform using Gemini Pro API for Islamic query responses with references',
      link: 'https://quran-gpt.netlify.app/',
      github: null,
    },
    {
      title: 'IG Tools',
      description:
        'Designed and developed a WordPress website featuring 100+ productivity tools for social media, SEO, and web development',
      link: 'https://igtoolsapk.in/',
      github: null,
    },
  ];

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <section id="projects" className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800" data-aos="fade-left">
          Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;