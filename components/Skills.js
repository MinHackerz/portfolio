import React, { useState, useEffect } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';

const skills = [
  { name: 'SAP BODS', rating: 4 },
  { name: 'Oracle SQL', rating: 4 },
  { name: 'Microsoft SQL Server', rating: 3.7 },
  { name: 'WordPress', rating: 4 },
  { name: 'SEO', rating: 4 },
  { name: 'Python', rating: 3 },
  { name: 'Power BI', rating: 3.5 },
  { name: 'Google Analytics', rating: 3.7 },
  { name: 'Google AdSense', rating: 3.7 },
  { name: 'Excel', rating: 4 },
  { name: 'PowerPoint', rating: 3 },
  { name: 'Word', rating: 3.5 },
];

const SkillRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  return (
    <div className="flex">
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={`full-${i}`} className="text-yellow-400" />
      ))}
      {hasHalfStar && <FaStarHalfAlt className="text-yellow-400" />}
      {[...Array(emptyStars)].map((_, i) => (
        <FaRegStar key={`empty-${i}`} className="text-yellow-400" />
      ))}
    </div>
  );
};

const Skills = () => {
  const [hoveredSkill, setHoveredSkill] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <section id="skills" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800" data-aos="fade-up">
          Skills
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="glassmorphism p-6 transition duration-300 transform hover:scale-105"
              onMouseEnter={() => setHoveredSkill(index)}
              onMouseLeave={() => setHoveredSkill(null)}
              data-aos="fade-up"
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{skill.name}</h3>
              <SkillRating rating={skill.rating} />
              {hoveredSkill === index && (
                <div className="mt-4">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${skill.rating * 20}%` }}></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;