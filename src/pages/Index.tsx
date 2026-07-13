import { type FC, useEffect, useState } from "react"
import { Mail, Github, Linkedin, ArrowUpRight } from "lucide-react"
import Footer from "@/components/Footer"
import { ThemeToggle } from "@/components/ThemeToggle"
import MinBOT from "@/components/MinBOT"

const Index: FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    document.title = "Menajul Hoque - Applied AI & Data Engineer"
  }, []);

  useEffect(() => {
    if (isChatOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isChatOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsChatOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const webProjects = [
    {
      title: "Rasid",
      year: "2026",
      description: "The most advanced invoicing platform that protects each invoices with a unique QR code to safeguard the interest of the seller and the buyer. Can be used in any country with any currency, smart inventory management, easy to use and invoices can be shared to the customer instantly via WhatsApp, SMS, Email, etc. Each and every invoice is always verifiable and traceable.",
      tech: "TypeScript, React, Tailwind CSS, Next.js",
      status: "Live",
      link: "https://rasid.in"
    },
    {
      title: "SEOBoostr",
      year: "2026",
      description: "An advanced, enterprise-grade SEO audit and monitoring platform featuring 15 modules for comprehensive performance checking and auditing. Supports live web scraping, automated checks for meta schemas, accessibility, page structure, and comprehensive dashboard reporting.",
      tech: "Next.js, Prisma, Neon Postgres, Cheerio, Recharts, Tailwind CSS v4",
      status: "In Development",
      link: "https://github.com/MinHackerz/seoboostr"
    },
    {
      title: "Govt Procurement Intelligence",
      year: "2026",
      description: "A data engineering and analytics pipeline analyzing 8.8M+ procurement records (~14 GB SQLite DBs) from India's Central Public Procurement Portal (CPPP). Tracks key fraud indicators, including single-bid contract rates and suspicious submission windows (≤7 days). Currently running locally with Flask and Datasette for interactive data exploration.",
      tech: "Flask, Python, SQLite, SQL Query Design, Datasette",
      status: "GitHub",
      link: "https://github.com/MinHackerz/govt_procurement"
    },
    {
      title: "Tadabbur",
      year: "2025",
      description: "A premium Quran study workspace built with the Quran Foundation SDK. Features an advanced Quran Reader with translations and audio recitation, bookmarks, reading goals, QuranReflect integrations, and prayer times.",
      tech: "Next.js (App Router), React, TypeScript, Tailwind CSS, Quran Foundation SDK",
      status: "Live",
      link: "https://tadabbur-iota.vercel.app/"
    },
    {
      title: "PDF SignCheck",
      year: "2025",
      description: "Free, privacy-first web application that cryptographically validates PKCS#7/CMS digital signatures in PDFs against the Mozilla CA trust store. Features zero-knowledge transient processing and includes 9 other unique PDF utility tools (like Dark Mode Converter and Bookmark Generator).",
      tech: "Next.js, React, TypeScript, Tailwind CSS, Web Cryptography",
      status: "Live",
      link: "https://pdfsigncheck.com"
    },
    {
      title: "VidStats",
      year: "2024",
      description: "The most advanced YouTube analytics platform powered by AI. Delivers comprehensive dashboards based on channel data to optimize content strategy. Features tools including AI script writer, sentiment analysis, posting scheduler, idea generator, competitor analysis, and 15+ free YouTube growth tools.",
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
      link: "https://yt-transcript-indol.vercel.app/"
    },
    {
      title: "Govt Procurement Data Analysis Pipeline",
      year: "2024",
      description: "End-to-end data analytics system tracking governmental spending metrics. Implemented structured ETL patterns using custom Python scripts to load raw CSV schemas, model relational databases, and render visual dashboard reports.",
      tech: "Python, Streamlit, PostgreSQL, Pandas",
      status: "Archive",
      link: "https://github.com/MinHackerz/wb-gov-tenders-insights"
    }
  ];

  const androidProjects = [
    {
      title: "PDF Signature Validator",
      year: "2025",
      description: "Secure, client-side Android application that parses digital signatures, retrieves public certificates, and validates structural integrity using public key infrastructure (PKI) guidelines natively on the device.",
      tech: "Kotlin, Android Jetpack, Java Cryptography Architecture (JCA)",
      status: "Live",
      link: "https://github.com/MinHackerz/Pdf-SignCheck-Android"
    },
    {
      title: "NotifyVault",
      year: "2025",
      description: "An encrypted local notification logger for Android. Employs advanced Room database structures to cache system push alerts, protected by a hardware-backed biometric verification layer to ensure total device privacy.",
      tech: "Kotlin, Android Room, BiometricPrompt API, Material 3",
      status: "Live",
      link: "https://github.com/MinHackerz/notifyvault"
    }
  ];

  const experiences = [
    {
      company: "Capgemini",
      role: "Associate Consultant",
      duration: "Oct 2023 - Present",
      description: "Consulting on enterprise-level data architectures, data warehousing, and ETL integrations. Specializing in SQL Server Integration Services (SSIS), SAP BODS, SAP Datasphere, SAP BTP, and SQL performance tuning.",
      skills: "SAP Datasphere, SAP BTP, SAP BODS, SQL Optimization, SSIS"
    },
    {
      company: "Capgemini",
      role: "Senior Analyst",
      duration: "Aug 2022 - Oct 2023",
      description: "Analyzed complex datasets, wrote Python validation scripts, and designed data pipelines. Focused on SQL Server Integration Services (SSIS) and relational SQL systems.",
      skills: "SQL, Python, SSIS, Data Analytics"
    }
  ];

  const educationList = [
    {
      institution: "Jadavpur University",
      degree: "Bachelor of Engineering in Power Engineering",
      duration: "2018 - 2022",
      details: "CGPA: 8.06/10. Focus on data modeling, systems engineering, and machine learning pipelines."
    },
    {
      institution: "Dangram I.C. High School",
      degree: "Higher Secondary (Class XII), Science",
      duration: "2015 - 2017",
      details: "Completed Higher Secondary board examinations focusing on physics, chemistry, and mathematics."
    }
  ];

  return (
    <div className="min-h-screen transition-colors duration-200 pb-28">
      <div className="w-full px-6 md:px-12 lg:px-16 pt-8 md:pt-12 pb-16 md:pb-24 lg:grid lg:grid-cols-[350px_1fr] lg:gap-24">
        
        {/* Left Column: Sticky Profile, Bio & Skills */}
        <div className={`space-y-6 lg:sticky lg:top-12 lg:h-[calc(100vh-80px)] lg:flex lg:flex-col lg:justify-start lg:gap-y-8 border-b border-zinc-100 dark:border-zinc-900/40 pb-6 mb-6 lg:border-b-0 lg:pb-0 lg:mb-0 lg:pr-12 lg:border-r lg:border-zinc-200/60 lg:dark:border-zinc-900/80 sidebar-compact-container ${isChatOpen ? "hidden lg:flex" : ""}`}>
          
          {/* Header & MinBOT Card */}
          <div className="space-y-5 sidebar-compact-header">
            <img
              src={`${import.meta.env.BASE_URL}profile-picture-png.png`}
              alt="Menajul Hoque"
              className="w-14 h-14 rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-300 border border-zinc-200 dark:border-zinc-800 sidebar-compact-image"
            />
            <div className="space-y-1">
              <div className="flex items-center justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-normal font-serif italic tracking-tight whitespace-nowrap sidebar-compact-name">Menajul Hoque</h1>
                <ThemeToggle />
              </div>
              <p className="text-[10.5px] text-zinc-500 dark:text-zinc-400 font-mono tracking-widest uppercase">Data & Applied AI</p>
            </div>

            {/* Social Icons */}
            <div className="flex gap-4">
              <a href="mailto:menajulhoque99@gmail.com" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all hover:-translate-y-0.5 duration-200">
                <Mail className="w-4 h-4" />
              </a>
              <a href="https://github.com/MinHackerz" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all hover:-translate-y-0.5 duration-200">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://www.linkedin.com/in/menajul-hoque/" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all hover:-translate-y-0.5 duration-200">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://x.com/MenajulM" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all hover:-translate-y-0.5 duration-200">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="https://peerlist.io/menajul" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all hover:-translate-y-0.5 duration-200">
                <svg viewBox="-0.5 -0.5 16 16" fill="none" className="w-4 h-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1">
                  <path d="M5.234 0.98375h4.532c2.2135625 0 4.073125 1.6644375 4.3175625 3.8644374999999997l0.15256250000000002 1.3725c0.0945 0.8502500000000001 0.0945 1.708375 0 2.558625l-0.15256250000000002 1.3725c-0.2444375 2.2000625 -2.104 3.8644374999999997 -4.3175625 3.8644374999999997H5.234c-2.213625 0 -4.0731875 -1.664375 -4.317625 -3.8644374999999997l-0.1525 -1.3725c-0.09443750000000001 -0.8502500000000001 -0.09443750000000001 -1.708375 0 -2.558625l0.1525 -1.3725c0.2444375 -2.2 2.104 -3.8644374999999997 4.317625 -3.8644374999999997Z" />
                  <path d="M5.327937499999999 11.120125000000002v-2.896125m0 0V3.8798749999999997h2.8960625c1.199625 0 2.172125 0.9724375000000001 2.172125 2.1720625h0c0 1.199625 -0.9724375000000001 2.1720625 -2.172125 2.1720625H5.327937499999999Z" />
                </svg>
              </a>
            </div>
            
            {/* MinBOT Sidebar Compact Command Button */}
            <div className="pt-2">
              <button
                onClick={() => setIsChatOpen(true)}
                className="w-full flex items-center justify-between px-3 py-2 border border-zinc-200/80 dark:border-zinc-900 rounded-xl bg-zinc-50/20 dark:bg-zinc-950/10 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:border-zinc-350 dark:hover:border-zinc-800 transition-all duration-300 group text-left shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
              >
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-medium">Ask MinBOT</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 border border-zinc-200 dark:border-zinc-800 rounded bg-white dark:bg-zinc-950 text-[8px] font-mono text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 group-hover:border-zinc-300 dark:group-hover:border-zinc-700 transition-all">
                  <span>⌘K</span>
                </div>
              </button>
            </div>
          </div>

          {/* Skills Grid */}
          <div className="space-y-4 pt-1 hidden lg:block sidebar-compact-skills">
            <h2 className="text-2xl font-normal font-serif italic tracking-tight text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-900 pb-2">
              skills
            </h2>
            <div className="space-y-0 select-none sidebar-compact-skills-grid">
              <div className="grid grid-cols-[100px_1fr] gap-4 py-2.5 border-b border-zinc-100 dark:border-zinc-900/40 hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 px-2 -mx-2 rounded transition-all duration-200 group/skill sidebar-compact-skills-row">
                <span className="text-[10.5px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-semibold group-hover/skill:text-zinc-900 dark:group-hover/skill:text-zinc-200 transition-colors sidebar-compact-skills-label">AI Eng</span>
                <span className="text-[13px] font-sans text-zinc-500 dark:text-zinc-450 leading-normal group-hover/skill:text-zinc-800 dark:group-hover/skill:text-zinc-300 transition-colors sidebar-compact-skills-text">
                  RAG · Vector Search · LLMs · AI Agents · AI Automation · MCP Server
                </span>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-4 py-2.5 border-b border-zinc-100 dark:border-zinc-900/40 hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 px-2 -mx-2 rounded transition-all duration-200 group/skill sidebar-compact-skills-row">
                <span className="text-[10.5px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-semibold group-hover/skill:text-zinc-900 dark:group-hover/skill:text-zinc-200 transition-colors sidebar-compact-skills-label">Data Eng</span>
                <span className="text-[13px] font-sans text-zinc-500 dark:text-zinc-450 leading-normal group-hover/skill:text-zinc-800 dark:group-hover/skill:text-zinc-300 transition-colors sidebar-compact-skills-text">
                  SAP Datasphere · SAP BTP · SAP BODS · SQL · Python
                </span>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-4 py-2.5 border-b border-zinc-100 dark:border-zinc-900/40 hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 px-2 -mx-2 rounded transition-all duration-200 group/skill sidebar-compact-skills-row">
                <span className="text-[10.5px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-semibold group-hover/skill:text-zinc-900 dark:group-hover/skill:text-zinc-200 transition-colors sidebar-compact-skills-label">Web Dev</span>
                <span className="text-[13px] font-sans text-zinc-500 dark:text-zinc-450 leading-normal group-hover/skill:text-zinc-800 dark:group-hover/skill:text-zinc-300 transition-colors sidebar-compact-skills-text">
                  React · Next.js · Tailwind CSS · WordPress
                </span>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-4 py-2.5 border-b border-zinc-100 dark:border-zinc-900/40 hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 px-2 -mx-2 rounded transition-all duration-200 group/skill sidebar-compact-skills-row">
                <span className="text-[10.5px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-semibold group-hover/skill:text-zinc-900 dark:group-hover/skill:text-zinc-200 transition-colors sidebar-compact-skills-label">Mobile Dev</span>
                <span className="text-[13px] font-sans text-zinc-500 dark:text-zinc-450 leading-normal group-hover/skill:text-zinc-800 dark:group-hover/skill:text-zinc-300 transition-colors sidebar-compact-skills-text">
                  Flutter · Dart · Firebase · AI Integration
                </span>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-4 py-2.5 border-b border-zinc-100 dark:border-zinc-900/40 hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 px-2 -mx-2 rounded transition-all duration-200 group/skill sidebar-compact-skills-row">
                <span className="text-[10.5px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-semibold group-hover/skill:text-zinc-900 dark:group-hover/skill:text-zinc-200 transition-colors sidebar-compact-skills-label">SEO & Ads</span>
                <span className="text-[13px] font-sans text-zinc-500 dark:text-zinc-450 leading-normal group-hover/skill:text-zinc-800 dark:group-hover/skill:text-zinc-300 transition-colors sidebar-compact-skills-text">
                  SEO · GEO · Search Console · AdSense · AdMob · GA4
                </span>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-4 py-2.5 hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 px-2 -mx-2 rounded transition-all duration-200 group/skill sidebar-compact-skills-row">
                <span className="text-[10.5px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-semibold group-hover/skill:text-zinc-900 dark:group-hover/skill:text-zinc-200 transition-colors sidebar-compact-skills-label">Tech Stack</span>
                <span className="text-[13px] font-sans text-zinc-500 dark:text-zinc-450 leading-normal group-hover/skill:text-zinc-800 dark:group-hover/skill:text-zinc-300 transition-colors sidebar-compact-skills-text">
                  TypeScript · Node.js · React · Tailwind CSS · Next.js
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Split Web & Android Projects or Chatbot */}
        <div className={isChatOpen ? "lg:sticky lg:top-12 lg:h-[calc(100vh-80px)] overflow-hidden" : "space-y-20"}>
          {isChatOpen ? (
            <MinBOT isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
          ) : (
            <>
              {/* Sub Navigation Bar for Internal Links */}
              <nav className="flex flex-wrap gap-x-6 gap-y-2 text-[10.5px] font-mono uppercase tracking-widest text-zinc-450 dark:text-zinc-500 border-b border-zinc-100 dark:border-zinc-900/40 pb-4 mb-6 select-none">
                <a href="#about" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">/ about</a>
                <a href="#experience" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">/ experience</a>
                <a href="#projects" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">/ projects</a>
                <a href="#education" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">/ education</a>
              </nav>

              {/* About Section */}
              <section id="about" className="space-y-6 scroll-mt-12">
                <h2 className="text-2xl font-normal font-serif italic tracking-tight text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-900 pb-2">
                  about
                </h2>
                <div className="space-y-4 text-[14px] leading-[1.75] text-zinc-500 dark:text-zinc-400 font-sans tracking-tight max-w-xl">
                  <p>
                    I am a Data Engineer and Applied AI developer specializing in bridging enterprise data warehousing with modern AI orchestration. Currently at Capgemini, I build analytics pipelines and cloud solutions using SAP Datasphere and BTP.
                  </p>
                  <p>
                    Outside of enterprise architecture, I design and deploy AI-powered web tools, secure document utilities, and custom reflection spaces. I focus on developing privacy-first client side encryption apps and SEO analytics systems.
                  </p>
                  <p>
                    Originally from West Bengal, I transitioned from Power Engineering at Jadavpur University to data management and LLM pipelines.
                  </p>
                </div>
              </section>

              {/* Experience Section */}
              <section id="experience" className="space-y-8 scroll-mt-12">
                <h2 className="text-2xl font-normal font-serif italic tracking-tight text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-900 pb-2">
                  experience
                </h2>
                <div className="group/list space-y-8">
                  {experiences.map((exp, index) => (
                    <div
                      key={index}
                      className="group relative flex flex-col py-2 pl-6 border-l border-zinc-100/50 dark:border-zinc-900/50 transition-all duration-300 md:group-hover/list:opacity-45 hover:!opacity-100"
                    >
                      <span className="absolute left-[-1px] top-0 bottom-0 w-[2px] transform origin-center scale-y-0 group-hover:scale-y-100 bg-zinc-400 dark:bg-zinc-650 transition-transform duration-300 ease-out z-10" />
                      <div className="w-full space-y-2">
                        <div className="flex items-baseline justify-between w-full">
                          <h3 className="text-lg font-medium font-sans tracking-tight text-zinc-900 dark:text-zinc-100">
                            {exp.role} <span className="text-zinc-400 dark:text-zinc-600 font-normal">at</span> {exp.company}
                          </h3>
                          <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-550 uppercase tracking-widest tabular-nums">
                            {exp.duration}
                          </span>
                        </div>
                        <p className="text-[13.5px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-sans tracking-tight">
                          {exp.description}
                        </p>
                        <div className="text-[11px] font-mono tracking-widest text-zinc-400 dark:text-zinc-550 uppercase pt-1">
                          {exp.skills.replace(/, /g, "  ·  ")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Mobile Skills Grid */}
              <div className="space-y-4 pt-4 block lg:hidden border-b border-zinc-100 dark:border-zinc-900/40 pb-8 mb-8">
                <h2 className="text-2xl font-normal font-serif italic tracking-tight text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-900 pb-2">
                  skills
                </h2>
                <div className="space-y-0 select-none">
                  <div className="grid grid-cols-[100px_1fr] gap-4 py-2.5 border-b border-zinc-100 dark:border-zinc-900/40 hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 px-2 -mx-2 rounded transition-all duration-200 group/skill">
                    <span className="text-[10.5px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-semibold group-hover/skill:text-zinc-900 dark:group-hover/skill:text-zinc-200 transition-colors">AI Eng</span>
                    <span className="text-[13px] font-sans text-zinc-500 dark:text-zinc-450 leading-normal group-hover/skill:text-zinc-800 dark:group-hover/skill:text-zinc-300 transition-colors">
                      RAG · Vector Search · LLMs · AI Agents · AI Automation · MCP Server
                    </span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-4 py-2.5 border-b border-zinc-100 dark:border-zinc-900/40 hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 px-2 -mx-2 rounded transition-all duration-200 group/skill">
                    <span className="text-[10.5px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-semibold group-hover/skill:text-zinc-900 dark:group-hover/skill:text-zinc-200 transition-colors">Data Eng</span>
                    <span className="text-[13px] font-sans text-zinc-500 dark:text-zinc-450 leading-normal group-hover/skill:text-zinc-800 dark:group-hover/skill:text-zinc-300 transition-colors">
                      SAP Datasphere · SAP BTP · SAP BODS · SQL · Python
                    </span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-4 py-2.5 border-b border-zinc-100 dark:border-zinc-900/40 hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 px-2 -mx-2 rounded transition-all duration-200 group/skill">
                    <span className="text-[10.5px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-semibold group-hover/skill:text-zinc-900 dark:group-hover/skill:text-zinc-200 transition-colors">Web Dev</span>
                    <span className="text-[13px] font-sans text-zinc-500 dark:text-zinc-450 leading-normal group-hover/skill:text-zinc-800 dark:group-hover/skill:text-zinc-300 transition-colors">
                      React · Next.js · Tailwind CSS · WordPress
                    </span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-4 py-2.5 border-b border-zinc-100 dark:border-zinc-900/40 hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 px-2 -mx-2 rounded transition-all duration-200 group/skill">
                    <span className="text-[10.5px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-semibold group-hover/skill:text-zinc-900 dark:group-hover/skill:text-zinc-200 transition-colors">Mobile Dev</span>
                    <span className="text-[13px] font-sans text-zinc-500 dark:text-zinc-450 leading-normal group-hover/skill:text-zinc-800 dark:group-hover/skill:text-zinc-300 transition-colors">
                      Flutter · Dart · Firebase · AI Integration
                    </span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-4 py-2.5 border-b border-zinc-100 dark:border-zinc-900/40 hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 px-2 -mx-2 rounded transition-all duration-200 group/skill">
                    <span className="text-[10.5px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-semibold group-hover/skill:text-zinc-900 dark:group-hover/skill:text-zinc-200 transition-colors">SEO & Ads</span>
                    <span className="text-[13px] font-sans text-zinc-500 dark:text-zinc-450 leading-normal group-hover/skill:text-zinc-800 dark:group-hover/skill:text-zinc-300 transition-colors">
                      SEO · GEO · Search Console · AdSense · AdMob · GA4
                    </span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-4 py-2.5 hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 px-2 -mx-2 rounded transition-all duration-200 group/skill">
                    <span className="text-[10.5px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-semibold group-hover/skill:text-zinc-900 dark:group-hover/skill:text-zinc-200 transition-colors">Tech Stack</span>
                    <span className="text-[13px] font-sans text-zinc-500 dark:text-zinc-450 leading-normal group-hover/skill:text-zinc-800 dark:group-hover/skill:text-zinc-300 transition-colors">
                      TypeScript · Node.js · React · Tailwind CSS · Next.js
                    </span>
                  </div>
                </div>
              </div>

              {/* Web Projects */}
              <section id="projects" className="space-y-8 scroll-mt-12">
                <h2 className="text-2xl font-normal font-serif italic tracking-tight text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-900 pb-2">
                  web applications
                </h2>
                <div className="group/list space-y-8">
                  {webProjects.map((project, index) => (
                    <div
                      key={index}
                      className="group relative flex flex-col py-2 pl-6 border-l border-zinc-100/50 dark:border-zinc-900/50 transition-all duration-300 md:group-hover/list:opacity-45 hover:!opacity-100"
                    >
                      {/* Dynamic absolute vertical indicator line */}
                      <span className="absolute left-[-1px] top-0 bottom-0 w-[2px] transform origin-center scale-y-0 group-hover:scale-y-100 bg-zinc-400 dark:bg-zinc-650 transition-transform duration-300 ease-out z-10" />

                      <div className="w-full space-y-2.5">
                        <div className="flex items-baseline justify-between w-full">
                          <h3 className="text-lg font-medium font-sans tracking-tight">
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-zinc-900 dark:text-zinc-100 hover:text-zinc-650 dark:hover:text-zinc-300 hover:underline decoration-1 underline-offset-4 transition-colors"
                            >
                              {project.title}
                              <ArrowUpRight className="w-3.5 h-3.5 opacity-25 group-hover:opacity-100 -translate-x-0.5 translate-y-0.5 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 text-zinc-400 dark:text-zinc-650 group-hover:text-zinc-900 dark:group-hover:text-zinc-100" />
                            </a>
                          </h3>
                          <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 dark:text-zinc-505 uppercase tracking-widest">
                            <span>{project.status}</span>
                            <span>·</span>
                            <span className="tabular-nums">{project.year}</span>
                          </div>
                        </div>

                        <p className="text-[13.5px] text-zinc-505 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 leading-relaxed font-sans tracking-tight transition-colors duration-300">
                          {project.description}
                        </p>

                        <div className="text-[11px] font-mono tracking-widest text-zinc-450 dark:text-zinc-500 uppercase pt-1">
                          {project.tech.replace(/, /g, "  ·  ")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Android Applications */}
              <section className="space-y-8">
                <h2 className="text-2xl font-normal font-serif italic tracking-tight text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-900 pb-2">
                  android applications
                </h2>
                <div className="group/list space-y-8">
                  {androidProjects.map((project, index) => (
                    <div
                      key={index}
                      className="group relative flex flex-col py-2 pl-6 border-l border-zinc-100/50 dark:border-zinc-900/50 transition-all duration-300 md:group-hover/list:opacity-45 hover:!opacity-100"
                    >
                      {/* Dynamic absolute vertical indicator line */}
                      <span className="absolute left-[-1px] top-0 bottom-0 w-[2px] transform origin-center scale-y-0 group-hover:scale-y-100 bg-zinc-400 dark:bg-zinc-650 transition-transform duration-300 ease-out z-10" />

                      <div className="w-full space-y-2.5">
                        <div className="flex items-baseline justify-between w-full">
                          <h3 className="text-lg font-medium font-sans tracking-tight">
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-zinc-900 dark:text-zinc-100 hover:text-zinc-650 dark:hover:text-zinc-300 hover:underline decoration-1 underline-offset-4 transition-colors"
                            >
                              {project.title}
                              <ArrowUpRight className="w-3.5 h-3.5 opacity-25 group-hover:opacity-100 -translate-x-0.5 translate-y-0.5 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 text-zinc-400 dark:text-zinc-650 group-hover:text-zinc-900 dark:group-hover:text-zinc-100" />
                            </a>
                          </h3>
                          <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 dark:text-zinc-550 uppercase tracking-widest">
                            <span>{project.status}</span>
                            <span>·</span>
                            <span className="tabular-nums">{project.year}</span>
                          </div>
                        </div>

                        <p className="text-[13.5px] text-zinc-505 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 leading-relaxed font-sans tracking-tight transition-colors duration-300">
                          {project.description}
                        </p>

                        <div className="text-[11px] font-mono tracking-widest text-zinc-450 dark:text-zinc-500 uppercase pt-1">
                          {project.tech.replace(/, /g, "  ·  ")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Education Section */}
              <section id="education" className="space-y-8 scroll-mt-12">
                <h2 className="text-2xl font-normal font-serif italic tracking-tight text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-900 pb-2">
                  education
                </h2>
                <div className="group/list space-y-8">
                  {educationList.map((edu, index) => (
                    <div
                      key={index}
                      className="group relative flex flex-col py-2 pl-6 border-l border-zinc-100/50 dark:border-zinc-900/50 transition-all duration-300 md:group-hover/list:opacity-45 hover:!opacity-100"
                    >
                      <span className="absolute left-[-1px] top-0 bottom-0 w-[2px] transform origin-center scale-y-0 group-hover:scale-y-100 bg-zinc-400 dark:bg-zinc-650 transition-transform duration-300 ease-out z-10" />
                      <div className="w-full space-y-2">
                        <div className="flex items-baseline justify-between w-full">
                          <h3 className="text-lg font-medium font-sans tracking-tight text-zinc-900 dark:text-zinc-100">
                            {edu.institution}
                          </h3>
                          <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-550 uppercase tracking-widest tabular-nums">
                            {edu.duration}
                          </span>
                        </div>
                        <h4 className="text-[13.5px] font-medium text-zinc-700 dark:text-zinc-300 font-sans tracking-tight">
                          {edu.degree}
                        </h4>
                        <p className="text-[13.5px] text-zinc-505 dark:text-zinc-400 leading-relaxed font-sans tracking-tight">
                          {edu.details}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>

      </div>
      {!isChatOpen && <Footer />}
    </div>
  )
}

export default Index