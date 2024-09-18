import React, { useState, useEffect } from 'react';
import { FaBriefcase, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Experience = () => {
  const [expandedExp, setExpandedExp] = useState(null);

  const experiences = [
    {
      title: 'Associate Consultant',
      company: 'Capgemini',
      period: '2023 - Present',
      responsibilities: [
        'Led the development and optimization of data pipelines, improving overall processing efficiency.',
        'Addressed complex data configuration issues, enhancing data integrity and reliability.',
        'Developed and maintained ETL pipelines using BODS tools, ensuring smooth data integration.',
        'Collaborated with cross-functional teams to align data engineering solutions with key business objectives.',
      ],
    },
    {
      title: 'Senior Analyst',
      company: 'Capgemini',
      period: '2022 - 2023',
      responsibilities: [
        'Engineered ETL processes to transfer 1M+ daily records from Excel to Microsoft SQL Server Data Warehouse',
        'Designed and implemented Power BI dashboards for resource utilization and performance analytics',
        'Optimized low-performing data pipelines, reducing runtime by 35% and improving system efficiency',
      ],
    },
    {
      title: 'Excel Automation Intern',
      company: 'Internship Studio',
      period: 'September 2020 - October 2020',
      responsibilities: [
        'Designed an Excel Dashboard with Data of an e-Commerce website to analyze different KPI\'s such as sales, revenue, customer satisfaction, and inventory management.',
      ],
    },
  ];

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <section id="experience" className="py-20 bg-gray-100">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800" data-aos="fade-right">
          Work Experience
        </h2>
        <div className="max-w-3xl mx-auto">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="mb-8 glassmorphism p-6 transition duration-300"
              data-aos="fade-right"
              data-aos-delay={index * 200}
            >
              <div
                className="flex items-center justify-between mb-4 cursor-pointer"
                onClick={() => setExpandedExp(expandedExp === index ? null : index)}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary text-white flex items-center justify-center rounded-full mr-4">
                    <FaBriefcase size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{exp.title}</h3>
                    <p className="text-gray-600">{exp.company}</p>
                  </div>
                </div>
                <p className="text-gray-600">{exp.period}</p>
              </div>
              {expandedExp === index && (
                <ul className="list-disc list-inside mt-4">
                  {exp.responsibilities.map((resp, idx) => (
                    <li key={idx} className="text-gray-700 mb-1">
                      {resp}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;