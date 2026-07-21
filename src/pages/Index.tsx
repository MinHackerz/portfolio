import { type FC, useEffect, useState, useMemo } from "react"
import { Mail, Github, Linkedin, ArrowUpRight, Sparkles } from "lucide-react"
import Footer from "@/components/Footer"
import MinBOT from "@/components/MinBOT"
import MagneticIcon from "@/components/MagneticIcon"
import ScrollIndicator from "@/components/ScrollIndicator"
import { useActiveSection, useScrollReveal } from "@/hooks/useScrollReveal"

const Index: FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const sectionIds = useMemo(() => ["about", "experience", "projects", "education"], []);
  const activeSection = useActiveSection(sectionIds);

  // Scroll reveal refs for each major section
  const { ref: aboutRef, isVisible: aboutVisible } = useScrollReveal<HTMLElement>();
  const { ref: expRef, isVisible: expVisible } = useScrollReveal<HTMLElement>();
  const { ref: projRef, isVisible: projVisible } = useScrollReveal<HTMLElement>();
  const { ref: androidRef, isVisible: androidVisible } = useScrollReveal<HTMLElement>();
  const { ref: eduRef, isVisible: eduVisible } = useScrollReveal<HTMLElement>();
  const { ref: sidebarRef, isVisible: sidebarVisible } = useScrollReveal<HTMLDivElement>();

  useEffect(() => {
    document.title = "Menajul Hoque - Applied AI & Data Engineer"
  }, []);

  useEffect(() => {
    if (isChatOpen) {
      window.scrollTo(0, 0);
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
      description: "A secure, trust-focused billing and invoicing platform that cryptographically seals invoices with unique QR codes, ensuring zero-knowledge authenticity. Features include automated client payment reminders, multi-channel WhatsApp/Email delivery, smart AI-powered receipt scanning, real-time inventory tracking, multi-currency support, and customizable templates for seamless invoicing.",
      tech: "TypeScript, React, Tailwind CSS, Next.js",
      status: "Live",
      link: "https://rasid.in"
    },
    {
      title: "SEOBoostr",
      year: "2026",
      description: "An enterprise-ready search engine optimization (SEO) audit and website monitoring dashboard featuring 15 dedicated modules. It supports real-time web scraping, automatic meta schema evaluations, performance benchmarks, accessibility analysis, page hierarchy reviews, and interactive data visualization for custom reports on site search visibility and organic ranking performance.",
      tech: "Next.js, Prisma, Neon Postgres, Cheerio, Recharts, Tailwind CSS v4",
      status: "In Development",
      link: "https://github.com/MinHackerz/seoboostr"
    },
    {
      title: "Govt Procurement Intelligence",
      year: "2026",
      description: "An offline-first data analytics pipeline designed to identify indicators of fraud across 8.8 million public procurement transactions from India's Central Public Procurement Portal. The tool models single-bid tendencies, detects unusually short submission windows, and serves interactive querying capabilities locally through Python, Flask, and Datasette interfaces.",
      tech: "Flask, Python, SQLite, SQL Query Design, Datasette",
      status: "GitHub",
      link: ""
    },
    {
      title: "Tadabbur",
      year: "2025",
      description: "An immersive, distraction-free Quranic study workspace and companion platform utilizing the Quran Foundation SDK. It offers an advanced text reader with multiple translations and high-quality audio recitation, integrated bookmarking, personal reading progress goals, social reflection feeds via QuranReflect, and location-based prayer timing integrations.",
      tech: "Next.js (App Router), React, TypeScript, Tailwind CSS, Quran Foundation SDK",
      status: "Live",
      link: "https://tadabbur-iota.vercel.app/"
    },
    {
      title: "PDF SignCheck",
      year: "2025",
      description: "A privacy-first web utility for cryptographically validating digital signatures in PDF documents. It extracts PKCS#7/CMS signatures, validates certificate chains against 80+ trusted root CAs from the Mozilla trust store, embeds signature validity badges, and includes a full suite of client-side PDF tools like dark mode conversion and duplicate page removal.",
      tech: "Next.js, React, TypeScript, Tailwind CSS, Web Cryptography",
      status: "Live",
      link: "https://pdfsigncheck.com"
    },
    {
      title: "VidStats",
      year: "2024",
      description: "A comprehensive AI-driven analytics dashboard trusted by over 800 YouTube creators to audit and optimize their publishing strategy. Features include automated video transcript summaries, sentiment analysis of user comments, competitor performance benchmarking, an AI-powered scriptwriting coprocessor, and an integrated post scheduler for maximizing organic viewer engagement.",
      tech: "React, Next.js, TypeScript, Tailwind CSS, Supabase, Gemini, GPT-4",
      status: "Live",
      link: "https://vidstats.pro"
    },
    {
      title: "Youtube Transcript",
      year: "2024",
      description: "A high-speed transcript generation and summarization utility that processes YouTube videos in over 125 languages. Integrating the Google Gemini API, it extracts clean, time-stamped text layouts from videos, translates transcripts on-the-fly, and generates structured executive summaries, key takeaways, and action items in seconds.",
      tech: "Vite.js, React, Tailwind CSS, Gemini API",
      status: "Live",
      link: "https://yt-transcript-indol.vercel.app/"
    }
  ];

  const androidProjects = [
    {
      title: "PDF Signature Validator",
      year: "2025",
      description: "A secure, client-side Android application that cryptographically validates digital signatures on PDF certificates and documents. Operating entirely on-device, the app parses X.509 digital certificates, verifies document hash integrity using PKI rules, and displays detailed signing authority paths and issuer information to verify file authenticity offline.",
      tech: "Kotlin, Android Jetpack, Java Cryptography Architecture (JCA)",
      status: "Live",
      link: "https://play.google.com/store/apps/details?id=com.minhackerz.pdfsigncheck_app"
    },
    {
      title: "NotifyVault",
      year: "2025",
      description: "A privacy-focused, encrypted notification logger for Android devices. The app intercepts and caches incoming push notifications in a local, AES-encrypted SQLite Room database, ensuring complete user privacy. Users can categorize, search, and review historical alerts even after they are dismissed from the system tray.",
      tech: "Kotlin, Android Room, SQLite AES Encryption, Material 3",
      status: "Live",
      link: "https://github.com/MinHackerz/notifyvault"
    }
  ];

  const experiences = [
    {
      company: "Capgemini",
      companyLink: "https://www.capgemini.com/",
      role: "Associate Consultant",
      duration: "Oct 2023 - Present",
      description: "Consulting on enterprise data systems, data warehousing, and ETL integration. Specializing in SAP Datasphere, SAP BTP, SAP BODS, SSIS, and SQL tuning.",
      skills: "SAP Datasphere, SAP BTP, SAP BODS, SQL Optimization, SSIS"
    },
    {
      company: "Capgemini",
      companyLink: "https://www.capgemini.com/",
      role: "Senior Analyst",
      duration: "Aug 2022 - Oct 2023",
      description: "Analyzed complex datasets, wrote Python validation scripts, and designed data pipelines. Focused on SSIS and relational SQL databases.",
      skills: "SQL, Python, SSIS, Data Analytics"
    }
  ];

  const educationList = [
    {
      institution: "Jadavpur University",
      institutionLink: "https://www.jaduniv.edu.in/",
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
    <div className="min-h-screen transition-colors duration-200 pb-4">
      {/* Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:dark:bg-zinc-950 focus:text-zinc-900 focus:dark:text-zinc-100 focus:border focus:border-zinc-200 focus:dark:border-zinc-800 focus:rounded-xl focus:shadow-lg focus:outline-none font-mono text-xs"
      >
        Skip to main content
      </a>

      <div className="w-full px-6 md:px-12 lg:px-16 pt-6 lg:pt-6 pb-6 md:pb-8 lg:grid lg:grid-cols-[350px_1fr] lg:gap-24">
        
        {/* Left Column: Fixed Profile, Bio & Skills (Stays 100% fixed to viewport on desktop) */}
        <div data-sidebar ref={sidebarRef} className={`relative space-y-4 lg:fixed lg:top-6 lg:w-[320px] xl:w-[350px] lg:h-[calc(100vh-48px)] lg:flex lg:flex-col lg:justify-between lg:py-2 border-b border-zinc-100 dark:border-zinc-900/40 pb-6 mb-6 lg:border-b-0 lg:pb-0 lg:mb-0 lg:pr-8 xl:pr-12 sidebar-compact-container ${isChatOpen ? "hidden lg:flex" : ""}`}>
          
          {/* Full-Height Vertical Divider Line (Extends 100% from top to bottom edge-to-edge) */}
          <div className="hidden lg:block absolute -top-16 -bottom-16 right-0 w-[1px] bg-zinc-200 dark:bg-zinc-800 pointer-events-none z-10" />

          {/* Boundless Vertical Divider Aurora Glow — Pure Sky Blue Atmosphere */}
          <div className="hidden lg:block absolute -top-16 -bottom-16 right-0 w-[calc(100vw-350px)] translate-x-full pointer-events-none select-none z-0">
            {/* Core Sky Blue Radiation Layer */}
            <div className="absolute inset-0 bg-gradient-to-r from-sky-400/22 via-sky-400/8 via-sky-400/1.5 to-transparent dark:from-sky-400/28 dark:via-sky-400/10 dark:via-sky-400/1.5 to-transparent animate-smoke-radiation-core blur-2xl" />
            {/* Outer Ambient Sky Blue Radiation Layer */}
            <div className="absolute inset-0 bg-gradient-to-r from-sky-400/14 via-cyan-400/5 via-sky-300/[0.005] to-transparent dark:from-sky-400/18 dark:via-cyan-400/7 dark:via-sky-300/[0.005] to-transparent animate-smoke-radiation-outer blur-3xl" />
          </div>

          {/* Semi-circular scroll indicator on the divider */}
          <ScrollIndicator />
          
          {/* Header & MinBOT Card — Centered on mobile, left-aligned on desktop */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left space-y-4 sidebar-compact-header w-full">
            <img
              src={`${import.meta.env.BASE_URL}profile-picture-png.png`}
              alt="Menajul Hoque"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-300 border border-zinc-200 dark:border-zinc-800 sidebar-compact-image shadow-sm mx-auto lg:mx-0"
            />
            <div className="space-y-1 text-center lg:text-left">
              <h1 className="text-xl sm:text-2xl font-normal font-serif italic tracking-tight whitespace-nowrap sidebar-compact-name">Menajul Hoque</h1>
              <p className="text-[10.5px] text-zinc-500 dark:text-zinc-400 font-mono tracking-widest uppercase">Data & Applied AI</p>
            </div>

            {/* Social Icons — Centered on mobile, left-aligned on desktop */}
            <div className="flex gap-4 justify-center lg:justify-start w-full">
              <MagneticIcon>
                <a href="mailto:menajulhoque99@gmail.com" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-200">
                  <Mail className="w-4 h-4" />
                </a>
              </MagneticIcon>
              <MagneticIcon>
                <a href="https://github.com/MinHackerz" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-200">
                  <Github className="w-4 h-4" />
                </a>
              </MagneticIcon>
              <MagneticIcon>
                <a href="https://www.linkedin.com/in/menajul-hoque/" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-200">
                  <Linkedin className="w-4 h-4" />
                </a>
              </MagneticIcon>
              <MagneticIcon>
                <a href="https://x.com/MenajulM" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-200">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </MagneticIcon>
              <MagneticIcon>
                <a href="https://peerlist.io/menajul" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-200">
                  <svg viewBox="-0.5 -0.5 16 16" fill="none" className="w-4 h-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1">
                    <path d="M5.234 0.98375h4.532c2.2135625 0 4.073125 1.6644375 4.3175625 3.8644374999999997l0.15256250000000002 1.3725c0.0945 0.8502500000000001 0.0945 1.708375 0 2.558625l-0.15256250000000002 1.3725c-0.2444375 2.2000625 -2.104 3.8644374999999997 -4.3175625 3.8644374999999997H5.234c-2.213625 0 -4.0731875 -1.664375 -4.317625 -3.8644374999999997l-0.1525 -1.3725c-0.09443750000000001 -0.8502500000000001 -0.09443750000000001 -1.708375 0 -2.558625l0.1525 -1.3725c0.2444375 -2.2 2.104 -3.8644374999999997 4.317625 -3.8644374999999997Z" />
                    <path d="M5.327937499999999 11.120125000000002v-2.896125m0 0V3.8798749999999997h2.8960625c1.199625 0 2.172125 0.9724375000000001 2.172125 2.1720625h0c0 1.199625 -0.9724375000000001 2.1720625 -2.172125 2.1720625H5.327937499999999Z" />
                  </svg>
                </a>
              </MagneticIcon>
            </div>
            
            {/* MinBOT Sidebar Command Button — Premium Glassmorphic AI Copilot Badge */}
            <div className="pt-1.5 w-full">
              <button
                onClick={() => setIsChatOpen(true)}
                className="relative w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-zinc-200/90 dark:border-zinc-800/90 bg-gradient-to-r from-zinc-100/70 via-zinc-50/90 to-zinc-100/70 dark:from-zinc-900/60 dark:via-zinc-900/40 dark:to-zinc-900/60 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 hover:shadow-md hover:shadow-emerald-500/5 transition-all duration-300 group text-left cursor-pointer overflow-hidden"
              >
                {/* Subtle shimmer sheen on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

                <div className="flex items-center gap-2.5">
                  {/* Live AI Pulse Indicator */}
                  <div className="relative flex items-center justify-center">
                    <span className="relative flex h-2 w-2 flex-shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                    <span className="text-[10.5px] font-mono uppercase tracking-widest text-zinc-700 dark:text-zinc-300 font-semibold group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                      Ask MinBOT
                    </span>
                  </div>
                </div>

                {/* Tactile Keycap Badge */}
                <div className="flex items-center gap-1 px-2 py-0.5 border border-zinc-200/90 dark:border-zinc-800 rounded-md bg-white/80 dark:bg-zinc-950/80 text-[8.5px] font-mono text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-200 group-hover:border-zinc-300 dark:group-hover:border-zinc-700 shadow-xs transition-all">
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
              <div className="grid grid-cols-[80px_1fr] gap-4 py-2.5 border-b border-zinc-100 dark:border-zinc-900/40 hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 px-2 -mx-2 rounded transition-all duration-200 group/skill sidebar-compact-skills-row">
                <span className="text-[10.5px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-550 font-semibold group-hover/skill:text-zinc-900 dark:group-hover/skill:text-zinc-200 transition-colors sidebar-compact-skills-label">AI Eng</span>
                <span className="text-[13px] font-sans text-zinc-500 dark:text-zinc-450 leading-normal group-hover/skill:text-zinc-800 dark:group-hover/skill:text-zinc-300 transition-colors sidebar-compact-skills-text">
                  RAG · Vector Search · LLMs · AI Agents · AI Automation · MCP Server
                </span>
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-4 py-2.5 border-b border-zinc-100 dark:border-zinc-900/40 hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 px-2 -mx-2 rounded transition-all duration-200 group/skill sidebar-compact-skills-row">
                <span className="text-[10.5px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-550 font-semibold group-hover/skill:text-zinc-900 dark:group-hover/skill:text-zinc-200 transition-colors sidebar-compact-skills-label">Data Eng</span>
                <span className="text-[13px] font-sans text-zinc-500 dark:text-zinc-450 leading-normal group-hover/skill:text-zinc-800 dark:group-hover/skill:text-zinc-300 transition-colors sidebar-compact-skills-text">
                  SAP Datasphere · SAP BTP · SAP BODS · SQL · Python
                </span>
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-4 py-2.5 border-b border-zinc-100 dark:border-zinc-900/40 hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 px-2 -mx-2 rounded transition-all duration-200 group/skill sidebar-compact-skills-row">
                <span className="text-[10.5px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-550 font-semibold group-hover/skill:text-zinc-900 dark:group-hover/skill:text-zinc-200 transition-colors sidebar-compact-skills-label">Web Dev</span>
                <span className="text-[13px] font-sans text-zinc-500 dark:text-zinc-450 leading-normal group-hover/skill:text-zinc-800 dark:group-hover/skill:text-zinc-300 transition-colors sidebar-compact-skills-text">
                  React · Next.js · Tailwind CSS · WordPress
                </span>
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-4 py-2.5 border-b border-zinc-100 dark:border-zinc-900/40 hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 px-2 -mx-2 rounded transition-all duration-200 group/skill sidebar-compact-skills-row">
                <span className="text-[10.5px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-550 font-semibold group-hover/skill:text-zinc-900 dark:group-hover/skill:text-zinc-200 transition-colors sidebar-compact-skills-label">Mobile Dev</span>
                <span className="text-[13px] font-sans text-zinc-500 dark:text-zinc-450 leading-normal group-hover/skill:text-zinc-800 dark:group-hover/skill:text-zinc-300 transition-colors sidebar-compact-skills-text">
                  Flutter · Dart · Firebase · AI Integration
                </span>
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-4 py-2.5 border-b border-zinc-100 dark:border-zinc-900/40 hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 px-2 -mx-2 rounded transition-all duration-200 group/skill sidebar-compact-skills-row">
                <span className="text-[10.5px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-550 font-semibold group-hover/skill:text-zinc-900 dark:group-hover/skill:text-zinc-200 transition-colors sidebar-compact-skills-label">SEO & Ads</span>
                <span className="text-[13px] font-sans text-zinc-500 dark:text-zinc-450 leading-normal group-hover/skill:text-zinc-800 dark:group-hover/skill:text-zinc-300 transition-colors sidebar-compact-skills-text">
                  SEO · GEO · Search Console · AdSense · AdMob · GA4
                </span>
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-4 py-2.5 hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 px-2 -mx-2 rounded transition-all duration-200 group/skill sidebar-compact-skills-row">
                <span className="text-[10.5px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-550 font-semibold group-hover/skill:text-zinc-900 dark:group-hover/skill:text-zinc-200 transition-colors sidebar-compact-skills-label">Tech Stack</span>
                <span className="text-[13px] font-sans text-zinc-500 dark:text-zinc-450 leading-normal group-hover/skill:text-zinc-800 dark:group-hover/skill:text-zinc-300 transition-colors sidebar-compact-skills-text">
                  TypeScript · Node.js · React · Tailwind CSS · Next.js
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Split Web & Android Projects or Chatbot */}
        <div id="main-content" className={`lg:col-start-2 ${isChatOpen ? "lg:sticky lg:top-12 lg:h-[calc(100vh-80px)] overflow-hidden" : "space-y-20"}`}>
          {isChatOpen ? (
            <MinBOT isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
          ) : (
            <>
              {/* Sub Navigation Bar for Internal Links — Single line on mobile, left-aligned on desktop */}
              <nav className="flex flex-nowrap items-center justify-between sm:justify-start gap-1.5 sm:gap-6 text-[8.5px] xs:text-[9.5px] sm:text-[10.5px] font-mono uppercase tracking-wider sm:tracking-widest text-zinc-450 dark:text-zinc-550 border-b border-zinc-100 dark:border-zinc-900/40 pb-3 mb-6 select-none overflow-x-auto scrollbar-none w-full">
                <a href="#about" className={`nav-link whitespace-nowrap hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors ${activeSection === "about" ? "active" : ""}`}>/ about</a>
                <a href="#experience" className={`nav-link whitespace-nowrap hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors ${activeSection === "experience" ? "active" : ""}`}>/ experience</a>
                <a href="#projects" className={`nav-link whitespace-nowrap hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors ${activeSection === "projects" ? "active" : ""}`}>/ projects</a>
                <a href="#education" className={`nav-link whitespace-nowrap hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors ${activeSection === "education" ? "active" : ""}`}>/ education</a>
              </nav>

              {/* About Section */}
              <section ref={aboutRef} id="about" className={`scroll-reveal ${aboutVisible ? "revealed" : ""} space-y-6 scroll-mt-12`}>
                <h2 className="text-2xl font-normal font-serif italic tracking-tight text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-900 pb-2">
                  about
                </h2>
                <div className="space-y-4 text-[15.5px] leading-[1.7] text-zinc-800 dark:text-zinc-200 font-sans tracking-tight max-w-xl">
                  <p>
                    I am a Data Engineer and Applied AI developer. I connect enterprise data systems with AI models. At <a href="https://www.capgemini.com/" target="_blank" rel="noopener noreferrer" className="text-zinc-900 dark:text-zinc-100 hover:text-zinc-650 dark:hover:text-zinc-300 hover:underline decoration-1 underline-offset-4 transition-colors">Capgemini</a>, I build data pipelines and cloud solutions using SAP Datasphere and BTP.
                  </p>
                  <p>
                    In my free time, I build AI web tools, secure document utilities, and custom web apps. I focus on privacy-first client-side encryption and SEO analytics systems.
                  </p>
                  <p>
                    Based in West Bengal, I transitioned from Power Engineering at <a href="https://www.jaduniv.edu.in/" target="_blank" rel="noopener noreferrer" className="text-zinc-900 dark:text-zinc-100 hover:text-zinc-650 dark:hover:text-zinc-300 hover:underline decoration-1 underline-offset-4 transition-colors">Jadavpur University</a> to data management and LLM pipelines.
                  </p>
                </div>
              </section>

              {/* Experience Section */}
              <section ref={expRef} id="experience" className={`scroll-reveal ${expVisible ? "revealed" : ""} space-y-8 scroll-mt-12`}>
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
                            {exp.role} <span className="text-zinc-400 dark:text-zinc-600 font-normal">at</span> <a href={exp.companyLink} target="_blank" rel="noopener noreferrer" className="hover:text-zinc-650 dark:hover:text-zinc-300 hover:underline decoration-1 underline-offset-4 transition-colors">{exp.company}</a>
                          </h3>
                          <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-550 uppercase tracking-widest tabular-nums">
                            {exp.duration}
                          </span>
                        </div>
                        <p className="text-[14.5px] text-zinc-800 dark:text-zinc-200 leading-relaxed font-sans tracking-tight">
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
                  <div className="grid grid-cols-[80px_1fr] gap-4 py-2.5 border-b border-zinc-100 dark:border-zinc-900/40 hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 px-2 -mx-2 rounded transition-all duration-200 group/skill">
                    <span className="text-[10.5px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-semibold group-hover/skill:text-zinc-900 dark:group-hover/skill:text-zinc-200 transition-colors">AI Eng</span>
                    <span className="text-[13px] font-sans text-zinc-505 dark:text-zinc-450 leading-normal group-hover/skill:text-zinc-800 dark:group-hover/skill:text-zinc-300 transition-colors">
                      RAG · Vector Search · LLMs · AI Agents · AI Automation · MCP Server
                    </span>
                  </div>
                  <div className="grid grid-cols-[80px_1fr] gap-4 py-2.5 border-b border-zinc-100 dark:border-zinc-900/40 hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 px-2 -mx-2 rounded transition-all duration-200 group/skill">
                    <span className="text-[10.5px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-semibold group-hover/skill:text-zinc-900 dark:group-hover/skill:text-zinc-200 transition-colors">Data Eng</span>
                    <span className="text-[13px] font-sans text-zinc-505 dark:text-zinc-450 leading-normal group-hover/skill:text-zinc-800 dark:group-hover/skill:text-zinc-300 transition-colors">
                      SAP Datasphere · SAP BTP · SAP BODS · SQL · Python
                    </span>
                  </div>
                  <div className="grid grid-cols-[80px_1fr] gap-4 py-2.5 border-b border-zinc-100 dark:border-zinc-900/40 hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 px-2 -mx-2 rounded transition-all duration-200 group/skill">
                    <span className="text-[10.5px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-semibold group-hover/skill:text-zinc-900 dark:group-hover/skill:text-zinc-200 transition-colors">Web Dev</span>
                    <span className="text-[13px] font-sans text-zinc-505 dark:text-zinc-450 leading-normal group-hover/skill:text-zinc-800 dark:group-hover/skill:text-zinc-300 transition-colors">
                      React · Next.js · Tailwind CSS · WordPress
                    </span>
                  </div>
                  <div className="grid grid-cols-[80px_1fr] gap-4 py-2.5 border-b border-zinc-100 dark:border-zinc-900/40 hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 px-2 -mx-2 rounded transition-all duration-200 group/skill">
                    <span className="text-[10.5px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-semibold group-hover/skill:text-zinc-900 dark:group-hover/skill:text-zinc-200 transition-colors">Mobile Dev</span>
                    <span className="text-[13px] font-sans text-zinc-505 dark:text-zinc-450 leading-normal group-hover/skill:text-zinc-800 dark:group-hover/skill:text-zinc-300 transition-colors">
                      Flutter · Dart · Firebase · AI Integration
                    </span>
                  </div>
                  <div className="grid grid-cols-[80px_1fr] gap-4 py-2.5 border-b border-zinc-100 dark:border-zinc-900/40 hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 px-2 -mx-2 rounded transition-all duration-200 group/skill">
                    <span className="text-[10.5px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-semibold group-hover/skill:text-zinc-900 dark:group-hover/skill:text-zinc-200 transition-colors">SEO & Ads</span>
                    <span className="text-[13px] font-sans text-zinc-505 dark:text-zinc-450 leading-normal group-hover/skill:text-zinc-800 dark:group-hover/skill:text-zinc-300 transition-colors">
                      SEO · GEO · Search Console · AdSense · AdMob · GA4
                    </span>
                  </div>
                  <div className="grid grid-cols-[80px_1fr] gap-4 py-2.5 hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 px-2 -mx-2 rounded transition-all duration-200 group/skill">
                    <span className="text-[10.5px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-semibold group-hover/skill:text-zinc-900 dark:group-hover/skill:text-zinc-200 transition-colors">Tech Stack</span>
                    <span className="text-[13px] font-sans text-zinc-505 dark:text-zinc-450 leading-normal group-hover/skill:text-zinc-800 dark:group-hover/skill:text-zinc-300 transition-colors">
                      TypeScript · Node.js · React · Tailwind CSS · Next.js
                    </span>
                  </div>
                </div>
              </div>

              {/* Web Projects */}
              <section ref={projRef} id="projects" className={`scroll-reveal ${projVisible ? "revealed" : ""} space-y-8 scroll-mt-12`}>
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
                          <h3 className="text-lg font-medium font-sans tracking-tight text-zinc-900 dark:text-zinc-100">
                            {project.link ? (
                              <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 hover:text-zinc-650 dark:hover:text-zinc-300 hover:underline decoration-1 underline-offset-4 transition-colors"
                              >
                                {project.title}
                                <ArrowUpRight className="w-3.5 h-3.5 opacity-25 group-hover:opacity-100 -translate-x-0.5 translate-y-0.5 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 text-zinc-400 dark:text-zinc-650 group-hover:text-zinc-900 dark:group-hover:text-zinc-100" />
                              </a>
                            ) : (
                              <span className="inline-flex items-center gap-1.5">{project.title}</span>
                            )}
                          </h3>
                          <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 dark:text-zinc-555 uppercase tracking-widest">
                            <span>{project.status}</span>
                            <span>·</span>
                            <span className="tabular-nums">{project.year}</span>
                          </div>
                        </div>

                        <p className="text-[14.5px] text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-950 dark:group-hover:text-zinc-50 leading-relaxed font-sans tracking-tight transition-colors duration-300">
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
              <section ref={androidRef} className={`scroll-reveal ${androidVisible ? "revealed" : ""} space-y-8`}>
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
                          <h3 className="text-lg font-medium font-sans tracking-tight text-zinc-900 dark:text-zinc-100">
                            {project.link ? (
                              <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 hover:text-zinc-650 dark:hover:text-zinc-300 hover:underline decoration-1 underline-offset-4 transition-colors"
                              >
                                {project.title}
                                <ArrowUpRight className="w-3.5 h-3.5 opacity-25 group-hover:opacity-100 -translate-x-0.5 translate-y-0.5 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 text-zinc-400 dark:text-zinc-650 group-hover:text-zinc-900 dark:group-hover:text-zinc-100" />
                              </a>
                            ) : (
                              <span className="inline-flex items-center gap-1.5">{project.title}</span>
                            )}
                          </h3>
                          <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 dark:text-zinc-550 uppercase tracking-widest">
                            <span>{project.status}</span>
                            <span>·</span>
                            <span className="tabular-nums">{project.year}</span>
                          </div>
                        </div>

                        <p className="text-[14.5px] text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-950 dark:group-hover:text-zinc-50 leading-relaxed font-sans tracking-tight transition-colors duration-300">
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
              <section ref={eduRef} id="education" className={`scroll-reveal ${eduVisible ? "revealed" : ""} space-y-8 scroll-mt-12`}>
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
                            {edu.institutionLink ? (
                              <a href={edu.institutionLink} target="_blank" rel="noopener noreferrer" className="hover:text-zinc-650 dark:hover:text-zinc-300 hover:underline decoration-1 underline-offset-4 transition-colors">
                                {edu.institution}
                              </a>
                            ) : edu.institution}
                          </h3>
                          <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-550 uppercase tracking-widest tabular-nums">
                            {edu.duration}
                          </span>
                        </div>
                        <h4 className="text-[14.5px] font-medium text-zinc-850 dark:text-zinc-150 font-sans tracking-tight">
                          {edu.degree}
                        </h4>
                        <p className="text-[14.5px] text-zinc-800 dark:text-zinc-200 leading-relaxed font-sans tracking-tight">
                          {edu.details}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
              {/* Footer inside right column so sidebar grid spans full page height */}
              {!isChatOpen && <Footer />}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Index