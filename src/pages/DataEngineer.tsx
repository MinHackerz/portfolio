import { FC } from "react";
import SkillBar from "@/components/SkillBar";
import ContactForm from "@/components/ContactForm";

const DataEngineer: FC = () => {
  const skills = [
    { skill: "SAP BODS", level: 4 },
    { skill: "Oracle SQL", level: 4 },
    { skill: "Microsoft SQL Server", level: 3 },
    { skill: "Python", level: 2 },
    { skill: "Power BI", level: 3 },
    { skill: "Excel", level: 3 },
    { skill: "ETL", level: 4 },
    { skill: "Data Warehousing", level: 4 },
    { skill: "Data Modeling", level: 2 },
    { skill: "Big Data", level: 2 },
  ];

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
  ];

  return (
    <div className="min-h-screen bg-background p-8 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-20">
        <section className="space-y-8">
          <h1 className="text-5xl font-light text-text">Data Engineer</h1>
          <p className="text-lg text-muted leading-relaxed max-w-2xl">
            I'm a results-driven Data Engineer with a strong background in ETL development and data analysis. 
            My expertise lies in designing and implementing robust data pipelines, optimizing data workflows, 
            and translating complex business requirements into efficient, scalable technical solutions.
          </p>
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl font-light text-text">Experience</h2>
          <div className="space-y-12">
            {experiences.map((exp) => (
              <div key={exp.title + exp.period} className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl text-text">{exp.title}</h3>
                    <p className="text-muted">{exp.company}</p>
                  </div>
                  <span className="text-muted">{exp.period}</span>
                </div>
                <ul className="list-disc list-inside space-y-2 text-muted">
                  {exp.description.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl font-light text-text">Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
            {skills.map((skill) => (
              <SkillBar 
                key={skill.skill}
                skill={skill.skill}
                level={skill.level}
              />
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl font-light text-text">Projects</h2>
          <div className="space-y-8">
            <div className="p-6 border border-gray-200 rounded-lg hover:border-accent transition-colors">
              <h3 className="text-xl text-text mb-3">YouTube Channel Statistics Analyzer</h3>
              <p className="text-muted mb-4">
                An open-source Python project that uses the YouTube API to extract channel data 
                and generate analytics dashboards.
              </p>
              <div className="flex gap-4">
                <a 
                  href="https://youtube-stats.streamlit.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-text transition-colors"
                >
                  View Project
                </a>
                <a 
                  href="https://github.com/MinHackerz/youtube-stats"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-text transition-colors"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl font-light text-text">Contact</h2>
          <ContactForm />
        </section>
      </div>
    </div>
  );
};

export default DataEngineer;