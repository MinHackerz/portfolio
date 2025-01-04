import { FC } from "react";
import SkillBar from "@/components/SkillBar";
import ContactForm from "@/components/ContactForm";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

const DataEngineer: FC = () => {
  const skills = [
    { skill: "SAP BODS", level: 5 },
    { skill: "Oracle SQL", level: 5 },
    { skill: "Microsoft SQL Server", level: 4 },
    { skill: "Python", level: 3 },
    { skill: "Power BI", level: 4 },
    { skill: "Excel", level: 4 },
    { skill: "ETL", level: 5 },
    { skill: "Data Warehousing", level: 5 },
    { skill: "Data Modeling", level: 3 },
    { skill: "Big Data", level: 3 },
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
    <div className="min-h-screen bg-background animate-fade-in">
      {/* Header */}
      <header className="border-b border-primary/10 bg-background/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src="/placeholder.svg"
              alt="Menajul Hoque"
              className="w-10 h-10 rounded-full object-cover border border-accent/20"
            />
            <img
              src="/placeholder.svg"
              alt="Signature"
              className="h-8 object-contain"
            />
          </div>
          <div className="flex items-center space-x-6 text-sm text-muted">
            <a href="mailto:contact@example.com" className="flex items-center hover:text-accent">
              <Mail className="w-4 h-4 mr-2" />
              contact@example.com
            </a>
            <a href="tel:+1234567890" className="flex items-center hover:text-accent">
              <Phone className="w-4 h-4 mr-2" />
              +1234567890
            </a>
            <span className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Location, Country
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 pt-24 pb-16 space-y-24">
        <section className="text-center space-y-4">
          <h1 className="text-6xl font-light text-primary bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Data Engineer
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            I'm a results-driven Data Engineer with a strong background in ETL development and data analysis. 
            My expertise lies in designing and implementing robust data pipelines, optimizing data workflows, 
            and translating complex business requirements into efficient, scalable technical solutions.
          </p>
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl font-light text-primary bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Experience
          </h2>
          <div className="grid gap-8">
            {experiences.map((exp) => (
              <Card key={exp.title + exp.period} className="border-primary/10 hover:border-accent/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl text-primary mb-1">{exp.title}</h3>
                      <p className="text-muted">{exp.company}</p>
                    </div>
                    <span className="text-accent font-light">{exp.period}</span>
                  </div>
                  <ul className="space-y-2 text-muted">
                    {exp.description.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2 text-accent">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl font-light text-primary bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Skills
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
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
          <h2 className="text-3xl font-light text-primary bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Featured Project
          </h2>
          <Card className="border-primary/10 hover:border-accent/50 transition-colors">
            <CardContent className="p-6">
              <h3 className="text-xl text-primary mb-3">YouTube Channel Statistics Analyzer</h3>
              <p className="text-muted mb-6">
                An open-source Python project that uses the YouTube API to extract channel data 
                and generate analytics dashboards.
              </p>
              <div className="flex gap-6">
                <a 
                  href="https://youtube-stats.streamlit.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-accent transition-colors"
                >
                  View Project
                </a>
                <a 
                  href="https://github.com/MinHackerz/youtube-stats"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-accent transition-colors"
                >
                  GitHub
                </a>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl font-light text-primary bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Contact
          </h2>
          <Card className="border-primary/10">
            <CardContent className="p-6">
              <ContactForm />
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default DataEngineer;