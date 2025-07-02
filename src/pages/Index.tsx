import { type FC, useEffect } from "react"
import { ExternalLink } from "lucide-react"
import Footer from "@/components/Footer"
import { ThemeToggle } from "@/components/ThemeToggle"

const Index: FC = () => {
  useEffect(() => {
    document.title = "Menajul Hoque"
  }, []);

  const projects = [
    {
      title: "VidStats",
      year: "2024",
      description: "AI-powered YouTube analytics platform delivering comprehensive dashboards based on channel data to optimize content strategy. Features advanced tools including script writer, sentiment analysis, posting scheduler, content idea generator, competitor analysis, universal share, content optimizer, video transcriptor, and 15+ free YouTube growth tools.",
      tech: "React, Next.js, TypeScript, Tailwind CSS, Supabase, Gemini, GPT-4",
      status: "Live",
      link: "https://vidstats.pro"
    },
    {
      title: "Youtube Transcript",
      year: "2024",
      description: "Advanced transcript generation tool that provides structured YouTube video transcripts with accurate translation support for 125+ languages. Integrates Gemini API for intelligent summarization of generated transcripts.",
      tech: "Vite.js, React, Tailwind CSS, Gemini API",
      status: "Live",
      link: "https://youtubetranscript.in"
    },
    {
      title: "QuranGPT",
      year: "2023",
      description: "AI-powered chatbot web application that answers user questions with references from the Holy Quran. Initially developed on WordPress, then evolved to Next.js for enhanced performance and user experience.",
      tech: "Next.js, WordPress, React, AI APIs",
      status: "Live",
      link: "https://quran-gpt.netlify.app/"
    },
    {
      title: "IG Tools APK",
      year: "2023",
      description: "Comprehensive Instagram tools platform featuring 100+ productivity tools across YouTube, LinkedIn, Instagram, and other social media platforms. Provides creators with essential utilities for content management, analytics, and growth optimization.",
      tech: "WordPress, PHP, HTML, CSS, JavaScript, APIs",
      status: "Live",
      link: "https://igtoolsapk.in"
    }
  ];

  return (
    <div className="min-h-screen transition-colors duration-200">
      {/* Desktop theme toggle - fixed position */}
      <div className="desktop-theme-toggle">
        <ThemeToggle />
      </div>
      
      <div className="max-w-xl mx-auto px-6 pt-8 pb-8">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center">
              <img
                src="/Menajul_Picture.jpg"
                alt="Menajul Hoque"
                className="w-14 h-14 rounded-full object-cover mr-6"
              />
              <div>
                <h1 className="name-style">Menajul Hoque</h1>
                <p className="text-subtle mt-1">kolkata, in.</p>
              </div>
            </div>
            {/* Mobile theme toggle - inline */}
            <div className="mobile-theme-toggle">
              <ThemeToggle />
            </div>
          </div>

          <div className="text-gray-700 leading-relaxed space-y-6">
            <p className="hover-border">
              I'm a data engineer and full-stack developer passionate about building scalable solutions and meaningful digital experiences. Exploring the intersection of data science, web development, and digital marketing.
            </p>
            <p className="hover-border">
              Currently working as a Data Engineer at Capgemini for the past 3 years, developing robust data pipelines using SAP BODS and cloud-based solutions on HANA Cloud. I maintain and optimize existing legacy ETL systems built on PL/SQL procedures in Oracle SQL Server while modernizing data infrastructure for enterprise clients. My work focuses on bridging traditional data warehousing with modern cloud architectures to deliver scalable, efficient data solutions.
            </p>
          </div>
        </header>

        {/* About Me Section */}
        <section className="mb-12">
          <h2 className="mb-8">about me</h2>
          <div className="text-gray-700 leading-relaxed space-y-6">
            <p className="hover-border">
              My journey began with childhood curiosity. In class 2, I remember seeing a picture in my textbook where someone exclaimed, "পল্টু ওই দেখ আকাশে প্লেন উড়ছে!" ("Poltu, look! A plane is flying in the sky!"). I asked my brother how to create a plane, and his straightforward answer was, "To create a plane, you have to become an engineer." From that moment, a dream quietly took root in my mind.
            </p>
            <p className="hover-border">
              Growing up in a remote village in West Bengal, where accessing basic education was challenging, becoming an engineer seemed impossible. Yet somehow, I managed to complete my matriculation in 2015 and got admitted to Al-Ameen Mission, graduating in 2017. It was there I began understanding the path to engineering. I dreamed of mechanical engineering, but fate had different plans—I was admitted to the Power Engineering department at Jadavpur University in 2018.
            </p>
            <p className="hover-border">
              University brought unexpected freedom, and my focus began to drift. I discovered SQL and found myself drawn to data. This curiosity led me to Capgemini, where I've been working as a data engineer for the past three years. During the lockdowns, with only a laptop for company, I channeled my engineering passion into building. I learned WordPress, created multiple websites—one even generated revenue before getting hacked. In 2022, I discovered ChatGPT and transitioned to Next.js, building products like QuranGPT and youtubetranscript.in. Now, alongside my full-time role, I spend weekends developing VidStats, my most ambitious personal project yet.
            </p>
          </div>
        </section>

        {/* Projects Section */}
        <section className="mb-12">
          <h2 className="mb-8">experiments</h2>
          <p className="text-subtle pb-4 hover-border" style={{ marginBottom: '24px' }}>
            Technical projects and experiments exploring data engineering, web development, and digital tools.
          </p>
          
          <div className="space-y-12">
            {projects.map((project, index) => (
              <div 
                key={index}
                className="project-item group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-title-link"
                    >
                      <h3 className="font-medium">{project.title}</h3>
                    </a>
                    {project.status === 'Live' && (
                      <span className="live-dot"></span>
                    )}
                        </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted">{project.year}</span>
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="external-link-wrapper"
                    >
                      <ExternalLink className="external-link w-3 h-3 text-gray-400" />
                    </a>
                  </div>
                </div>
                
                <p className="text-subtle leading-relaxed hover-border mb-2">
                  {project.description}
                </p>
                
                <p className="text-xs text-muted hover-border">
                  {project.tech}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Connect Section */}
        <section className="mb-12">
          <h2 className="mb-8">connect</h2>
          <div className="text-gray-700 leading-relaxed">
            <p className="hover-border">
              contact me on{" "}
              <a 
                href="https://www.linkedin.com/in/menajul-hoque/" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
              ·
              <a 
                href="https://github.com/MinHackerz" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              {" "}— or send me an email at{" "}
              <a href="mailto:menajulhoque99@gmail.com">
                menajulhoque99@gmail.com
              </a>
            </p>
          </div>
        </section>

        {/* Skills/Tech Stack */}
        <section className="mb-12">
          <h2 className="mb-8">colophon</h2>
          <div className="text-gray-700 leading-relaxed">
            <p className="text-subtle hover-border" style={{ marginBottom: '24px' }}>The technologies and tools behind my work.</p>
            
            <div className="skills-table">
              <div className="table-row">
                <div className="table-cell category">Data Engineering</div>
                <div className="table-cell technologies hover-border">SAP BODS, Oracle SQL, Microsoft SQL Server, SSIS, Python</div>
              </div>
              <div className="table-row">
                <div className="table-cell category">Web Development</div>
                <div className="table-cell technologies hover-border">React, TypeScript, Node.js, Next.js, Tailwind CSS</div>
              </div>
              <div className="table-row">
                <div className="table-cell category">Cloud & DevOps</div>
                <div className="table-cell technologies hover-border">Hana Cloud</div>
              </div>
              <div className="table-row">
                <div className="table-cell category">Analytics</div>
                <div className="table-cell technologies hover-border">Power BI, Excel</div>
              </div>
              <div className="table-row">
                <div className="table-cell category">Digital Marketing</div>
                <div className="table-cell technologies hover-border">WordPress, On-Page SEO, Off-Page SEO, Google Analytics, Google Search Console</div>
              </div>
            </div>
          </div>
        </section>
        </div>
      
      <Footer />
    </div>
  )
}

export default Index