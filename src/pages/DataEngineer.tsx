import { FC } from "react";
import SkillBar from "@/components/SkillBar";

const DataEngineer: FC = () => {
  const skills = [
    { name: "SAP BODS", level: 4 },
    { name: "Oracle SQL", level: 4 },
    { name: "Microsoft SQL Server", level: 3 },
    { name: "Python", level: 2 },
    { name: "Power BI", level: 3 },
    { name: "Excel", level: 3 },
    { name: "ETL", level: 4 },
    { name: "Data Warehousing", level: 4 },
    { name: "Data Modeling", level: 2 },
    { name: "Big Data", level: 2 },
  ];

  return (
    <div className="min-h-screen bg-background p-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-light text-primary mb-8">Data Engineer</h1>
        
        <section className="mb-12">
          <h2 className="text-2xl font-light text-primary mb-4">About Me</h2>
          <p className="text-text/80 leading-relaxed">
            I'm a results-driven Data Engineer with a strong background in ETL development and data analysis. 
            My expertise lies in designing and implementing robust data pipelines, optimizing data workflows, 
            and translating complex business requirements into efficient, scalable technical solutions.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-light text-primary mb-6">Skills</h2>
          <div className="space-y-4">
            {skills.map((skill) => (
              <SkillBar 
                key={skill.name}
                skill={skill.name}
                level={skill.level}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-light text-primary mb-6">Projects</h2>
          <div className="grid gap-6">
            <div className="p-6 border border-primary/20 rounded-lg">
              <h3 className="text-xl font-light text-primary mb-2">YouTube Channel Statistics Analyzer</h3>
              <p className="text-text/80 mb-4">
                An open-source Python project that uses the YouTube API to extract channel data 
                and generate analytics dashboards.
              </p>
              <div className="flex gap-4">
                <a 
                  href="https://youtube-stats.streamlit.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-secondary transition-colors"
                >
                  View Project
                </a>
                <a 
                  href="https://github.com/MinHackerz/youtube-stats"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-secondary transition-colors"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DataEngineer;
