import { type FC, useEffect, useState, useMemo } from "react"
import {
  Mail,
  Github,
  Linkedin,
  ArrowUpRight,
  Sparkles,
  QrCode,
  Search,
  Database,
  BookOpen,
  ShieldCheck,
  BarChart2,
  Smartphone,
  Lock,
  MapPin,
  HeartHandshake,
  Music2,
  Rocket,
  Cpu,
  Layers,
  Server
} from "lucide-react"
import Footer from "@/components/Footer"
import MinBOT from "@/components/MinBOT"
import MagneticIcon from "@/components/MagneticIcon"
import ScrollIndicator from "@/components/ScrollIndicator"
import { SpotlightCard } from "@/components/SpotlightCard"
import { useActiveSection, useScrollReveal } from "@/hooks/useScrollReveal"

const Index: FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const sectionIds = useMemo(() => ["about", "projects", "architecture"], []);
  const activeSection = useActiveSection(sectionIds);

  // Scroll reveal refs for each major section
  const { ref: aboutRef, isVisible: aboutVisible } = useScrollReveal<HTMLElement>();
  const { ref: projRef, isVisible: projVisible } = useScrollReveal<HTMLElement>();
  const { ref: archRef, isVisible: archVisible } = useScrollReveal<HTMLElement>();
  const { ref: sidebarRef } = useScrollReveal<HTMLDivElement>();

  useEffect(() => {
    document.title = "Menajul Hoque — Applied AI & Data Engineer"
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
      id: "01",
      title: "Rasid",
      tag: "FINTECH & ZERO-KNOWLEDGE",
      category: "fintech",
      categories: ["web", "fintech", "security"],
      year: "2026",
      description: "A secure, trust-focused billing and invoicing platform that cryptographically seals invoices with unique QR codes, ensuring zero-knowledge authenticity. Features include automated client payment reminders, multi-channel WhatsApp/Email delivery, smart AI-powered receipt scanning, real-time inventory tracking, multi-currency support, and customizable templates for seamless invoicing.",
      tech: "TypeScript, React, Tailwind CSS, Next.js, Web Crypto",
      status: "Live",
      link: "https://rasid.in",
      favicon: "favicons/rasid.png",
      icon: QrCode,
      metrics: "Zero-Knowledge QR · WhatsApp Delivery · AI OCR",
      snapshot: "projects/rasid_snap.png",
      snapshotDark: "projects/rasid_snap_dark.svg",
      imageLight: "projects/rasid_light.svg",
      imageDark: "projects/rasid_dark.svg"
    },
    {
      id: "02",
      title: "Site Audit Score",
      tag: "SEO & SITE HEALTH AUDIT",
      category: "ai-data",
      categories: ["web", "ai-data", "seo"],
      year: "2026",
      description: "An enterprise-ready search engine optimization (SEO) audit and website monitoring dashboard featuring 15 dedicated modules. It supports real-time web scraping, automatic meta schema evaluations, performance benchmarks, accessibility analysis, page hierarchy reviews, and interactive data visualization for custom reports on site search visibility and organic ranking performance.",
      tech: "Next.js, Prisma, Neon Postgres, Cheerio, Recharts, Tailwind CSS v4",
      status: "Live",
      link: "https://siteauditscore.com",
      favicon: "favicons/seoptimised.png",
      icon: Search,
      metrics: "15 Audit Modules · Schema JSON-LD · Cheerio Scraper",
      snapshot: "projects/siteauditscore_snap.png",
      imageLight: "projects/seoptimised_light.svg",
      imageDark: "projects/seoptimised_dark.svg"
    },
    {
      id: "03",
      title: "Govt Procurement Intelligence",
      tag: "FRAUD DATA ANALYTICS",
      category: "ai-data",
      categories: ["web", "ai-data"],
      year: "2026",
      description: "An offline-first data analytics pipeline designed to identify indicators of fraud across 8.8 million public procurement transactions from India's Central Public Procurement Portal. The tool models single-bid tendencies, detects unusually short submission windows, and serves interactive querying capabilities locally through Python, Flask, and Datasette interfaces.",
      tech: "Flask, Python, SQLite, SQL Query Design, Datasette",
      status: "GitHub",
      link: "",
      favicon: "favicons/procurement.png",
      icon: Database,
      metrics: "8.8M Records · Single-Bid Detection · Datasette Engine",
      imageLight: "projects/procurement_light.svg",
      imageDark: "projects/procurement_dark.svg"
    },
    {
      id: "04",
      title: "QuranGPT",
      tag: "AI QURANIC KNOWLEDGE BASE",
      category: "ai-data",
      categories: ["web", "ai-data"],
      year: "2025",
      description: "An AI-powered Islamic knowledge engine and semantic search platform designed to provide contextual answers grounded in the Holy Quran. It utilizes advanced language models to offer insightful and accurate responses, supported by relevant verses and interpretations from the Quran.",
      tech: "Next.js, React, TypeScript, Tailwind CSS, OpenAI GPT, Quran Foundation API",
      status: "Live",
      link: "https://quran-gpt.netlify.app/",
      favicon: "favicons/qurangpt.png",
      icon: BookOpen,
      metrics: "Semantic Verse Search · Citation Grounding · Multilingual",
      snapshot: "projects/qurangpt_snap.png",
      snapshotDark: "projects/qurangpt_dark.svg",
      imageLight: "projects/qurangpt_light.svg",
      imageDark: "projects/qurangpt_dark.svg"
    },
    {
      id: "05",
      title: "PDF SignCheck",
      tag: "PKI CRYPTOGRAPHY UTILITY",
      category: "security",
      categories: ["web", "security"],
      year: "2025",
      description: "A privacy-first web utility for cryptographically validating digital signatures in PDF documents. It extracts PKCS#7/CMS signatures, validates certificate chains against 80+ trusted root CAs from the Mozilla trust store, embeds signature validity badges, and includes a full suite of client-side PDF tools like dark mode conversion and duplicate page removal.",
      tech: "Next.js, React, TypeScript, Tailwind CSS, Web Cryptography",
      status: "Live",
      link: "https://pdfsigncheck.com",
      favicon: "favicons/pdfsigncheck.png",
      icon: ShieldCheck,
      metrics: "80+ Mozilla Root CAs · PKCS#7 / CMS · 100% Client-Side",
      snapshot: "projects/pdfsigncheck_snap.png",
      imageLight: "projects/pdfsigncheck_light.svg",
      imageDark: "projects/pdfsigncheck_dark.svg"
    },
    {
      id: "06",
      title: "VidStats",
      tag: "AI CREATOR ANALYTICS",
      category: "ai-data",
      categories: ["web", "ai-data"],
      year: "2024",
      description: "A comprehensive AI-driven analytics dashboard trusted by over 800 YouTube creators to audit and optimize their publishing strategy. Features include automated video transcript summaries, sentiment analysis of user comments, competitor performance benchmarking, an AI-powered scriptwriting coprocessor, and an integrated post scheduler for maximizing organic viewer engagement.",
      tech: "React, Next.js, TypeScript, Tailwind CSS, Supabase, Gemini, GPT-4",
      status: "Live",
      link: "https://vidstats.pro",
      favicon: "favicons/vidstats.png",
      icon: BarChart2,
      metrics: "800+ Creators · Gemini Coprocessor · Sentiment AI",
      snapshot: "projects/vidstats_snap.png",
      imageLight: "projects/vidstats_light.svg",
      imageDark: "projects/vidstats_dark.svg"
    }
  ];

  const androidProjects = [
    {
      id: "07",
      title: "PDF Signature Validator",
      tag: "ON-DEVICE PKI VALIDATOR",
      category: "android",
      categories: ["android", "security"],
      year: "2025",
      description: "A secure, client-side Android application that cryptographically validates digital signatures on PDF certificates and documents. Operating entirely on-device, the app parses X.509 digital certificates, verifies document hash integrity using PKI rules, and displays detailed signing authority paths and issuer information to verify file authenticity offline.",
      tech: "Kotlin, Android Jetpack, Java Cryptography Architecture (JCA)",
      status: "Live",
      link: "https://play.google.com/store/apps/details?id=com.minhackerz.pdfsigncheck_app",
      favicon: "favicons/pdf_validator_app.png",
      icon: Smartphone,
      metrics: "X.509 Cert Chain · JCA PKI Hash · 100% Offline",
      snapshot: "projects/pdf_validator_app_snap.png",
      imageLight: "projects/pdf_validator_app_light.svg",
      imageDark: "projects/pdf_validator_app_dark.svg"
    },
    {
      id: "08",
      title: "NotifyVault",
      tag: "ENCRYPTED NOTIFICATION VAULT",
      category: "android",
      categories: ["android", "security"],
      year: "2025",
      description: "A privacy-focused, encrypted notification logger for Android devices. The app intercepts and caches incoming push notifications in a local, AES-encrypted SQLite Room database, ensuring complete user privacy. Users can categorize, search, and review historical alerts even after they are dismissed from the system tray.",
      tech: "Kotlin, Android Room, SQLite AES Encryption, Material 3",
      status: "Live",
      link: "https://play.google.com/store/apps/details?id=com.notifyvault.app",
      favicon: "favicons/notifyvault_app.png",
      icon: Lock,
      metrics: "AES-256 Room DB · Privacy First · Local Search",
      snapshot: "projects/notifyvault_app_snap.png",
      imageLight: "projects/notifyvault_app_light.svg",
      imageDark: "projects/notifyvault_app_dark.svg"
    }
  ];

  const allProjects = useMemo(() => {
    return [
      ...webProjects.map(p => ({ ...p, type: "web" as const })),
      ...androidProjects.map(p => ({ ...p, type: "android" as const }))
    ];
  }, []);

  const categories = useMemo(() => [
    { id: "all", label: "All Ships", count: allProjects.length },
    { id: "web", label: "Web & SaaS", count: webProjects.length },
    { id: "android", label: "Android & Mobile", count: androidProjects.length },
    { id: "ai-data", label: "AI & Data", count: allProjects.filter(p => p.categories.includes("ai-data")).length },
    { id: "security", label: "Security & Trust", count: allProjects.filter(p => p.categories.includes("security") || p.categories.includes("fintech")).length },
  ], [allProjects, webProjects.length, androidProjects.length]);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "all") return allProjects;
    if (selectedCategory === "web") return allProjects.filter(p => p.type === "web");
    if (selectedCategory === "android") return allProjects.filter(p => p.type === "android");
    if (selectedCategory === "ai-data") return allProjects.filter(p => p.categories.includes("ai-data"));
    if (selectedCategory === "security") return allProjects.filter(p => p.categories.includes("security") || p.categories.includes("fintech"));
    return allProjects;
  }, [allProjects, selectedCategory]);

  const renderProjectBanner = (project: typeof allProjects[0]) => {
    if ('snapshot' in project && project.snapshot) {
      if ('snapshotDark' in project && project.snapshotDark) {
        return (
          <>
            <img
              src={`${import.meta.env.BASE_URL}${project.snapshot}`}
              alt={`${project.title} Real Homepage Snapshot`}
              className="dark:hidden w-full h-full object-cover object-top select-none pointer-events-none group-hover:brightness-[1.02] transition-all"
              loading="lazy"
            />
            <img
              src={`${import.meta.env.BASE_URL}${project.snapshotDark}`}
              alt={`${project.title} Real Homepage Snapshot`}
              className="hidden dark:block w-full h-full object-cover object-top select-none pointer-events-none group-hover:brightness-[1.02] transition-all"
              loading="lazy"
            />
          </>
        );
      }
      return (
        <img
          src={`${import.meta.env.BASE_URL}${project.snapshot}`}
          alt={`${project.title} Real Homepage Snapshot`}
          className="w-full h-full object-cover object-top select-none pointer-events-none group-hover:brightness-[1.02] transition-all"
          loading="lazy"
        />
      );
    }
    return (
      <>
        <img
          src={`${import.meta.env.BASE_URL}${project.imageLight}`}
          alt={`${project.title} Screenshot`}
          className="dark:hidden w-full h-full object-cover select-none pointer-events-none"
          loading="lazy"
        />
        <img
          src={`${import.meta.env.BASE_URL}${project.imageDark}`}
          alt={`${project.title} Screenshot`}
          className="hidden dark:block w-full h-full object-cover select-none pointer-events-none"
          loading="lazy"
        />
      </>
    );
  };



  const architectureSpecs = [
    {
      num: "01",
      layer: "FRONTEND & UI ARCHITECTURE",
      title: "High-Performance Modern Web Systems",
      desc: "React 19, Next.js (App Router), TypeScript, Tailwind CSS, Vite, Web Cryptography API, View Transitions API, semantic schema markup.",
      metrics: "Sub-50ms INP · 100% Type Safe · Modern CSS",
      icon: Layers
    },
    {
      num: "02",
      layer: "DATA PIPELINES & CLOUD STORAGE",
      title: "Enterprise ETL & Data Warehousing",
      desc: "SAP Datasphere, SAP Business Data Cloud, Google BigQuery, SAP BODS, Neon Serverless Postgres, SQLite, Oracle SQL query optimization.",
      metrics: "Millions daily records · 100% SLA · Real-time CDC",
      icon: Server
    },
    {
      num: "03",
      layer: "AI & INTELLIGENT AGENTS",
      title: "Autonomous LLM Workflows & RAG",
      desc: "Gemini 2.5 Flash / Pro SDK, GPT-4o, MCP (Model Context Protocol) servers, Cheerio web extractors, vector search, Datasette query engines.",
      metrics: "Multimodal AI · Structured Output · Dynamic Scrapers",
      icon: Cpu
    },
    {
      num: "04",
      layer: "MOBILE & CRYPTOGRAPHY",
      title: "Client-Side PKI & On-Device Security",
      desc: "Kotlin, Android Jetpack, Java Cryptography Architecture (JCA), X.509 Root CA chain verification, SQLite AES Room encryption.",
      metrics: "100% Offline Validation · Zero Cloud Leakage · AES-256",
      icon: ShieldCheck
    }
  ];



  return (
    <div className="min-h-screen transition-colors duration-200 pb-4">
      {/* Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:dark:bg-zinc-950 focus:text-zinc-900 focus:dark:text-zinc-100 focus:border focus:border-zinc-200 focus:dark:border-zinc-800 focus:rounded-none focus:shadow-lg focus:outline-none font-mono text-xs"
      >
        Skip to main content
      </a>

      <div className="w-full px-6 md:px-12 lg:px-16 xl:px-20 pt-6 pb-6 md:pb-8 lg:grid lg:grid-cols-[320px_1fr] xl:grid-cols-[350px_1fr] lg:gap-14 xl:gap-16">
        
        {/* Left Column: Fixed Profile, Bio & Skills */}
        <div data-sidebar ref={sidebarRef} className={`relative lg:sticky lg:top-6 lg:self-start lg:w-[320px] xl:w-[350px] lg:flex lg:flex-col lg:gap-6 xl:gap-7 border-b border-zinc-100 dark:border-zinc-900/40 pb-6 mb-6 lg:border-b-0 lg:pb-0 lg:mb-0 lg:pr-8 xl:pr-10 sidebar-compact-container ${isChatOpen ? "hidden lg:flex" : ""}`}>
          
          {/* Full-Height Vertical Divider Line */}
          <div className="hidden lg:block absolute -top-6 -bottom-6 right-0 w-[1px] bg-zinc-200 dark:bg-zinc-800 pointer-events-none z-10" />

          {/* Boundless Vertical Divider Aurora Glow */}
          <div className="hidden lg:block absolute -top-6 -bottom-6 right-0 w-[calc(100vw-350px)] translate-x-full pointer-events-none select-none z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-sky-400/22 via-sky-400/8 via-sky-400/1.5 to-transparent dark:from-sky-400/28 dark:via-sky-400/10 dark:via-sky-400/1.5 to-transparent animate-smoke-radiation-core blur-2xl" />
            <div className="absolute inset-0 bg-gradient-to-r from-sky-400/14 via-cyan-400/5 via-sky-300/[0.005] to-transparent dark:from-sky-400/18 dark:via-cyan-400/7 dark:via-sky-300/[0.005] to-transparent animate-smoke-radiation-outer blur-3xl" />
          </div>

          {/* Semi-circular scroll indicator on the divider */}
          <ScrollIndicator />
          
          {/* Header & MinBOT Card */}
          <div className="flex flex-col items-center text-center space-y-4 sidebar-compact-header w-full">
            <img
              src={`${import.meta.env.BASE_URL}profile-picture-png.png`}
              alt="Menajul Hoque"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-300 border border-zinc-200 dark:border-zinc-800 sidebar-compact-image shadow-sm mx-auto"
            />

            <div className="space-y-1 text-center w-full flex flex-col items-center">
              <h1 className="text-xl sm:text-2xl font-normal font-dot tracking-wide whitespace-nowrap sidebar-compact-name text-center">Menajul Hoque</h1>
              <div className="flex items-center justify-center gap-1.5 pt-0.5">
                <span className="text-[11px] font-mono tracking-widest font-bold text-[#E65A1E] dark:text-[#FF7832] text-center">
                  build . ship . rise
                </span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex gap-4 justify-center items-center w-full">
              <MagneticIcon>
                <a href="mailto:menajulhoque99@gmail.com" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-200" title="Email Menajul">
                  <Mail className="w-4 h-4" />
                </a>
              </MagneticIcon>
              <MagneticIcon>
                <a href="https://github.com/MinHackerz" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-200" title="GitHub Profile">
                  <Github className="w-4 h-4" />
                </a>
              </MagneticIcon>
              <MagneticIcon>
                <a href="https://www.linkedin.com/in/menajul-hoque/" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-200" title="LinkedIn Profile">
                  <Linkedin className="w-4 h-4" />
                </a>
              </MagneticIcon>
              <MagneticIcon>
                <a href="https://x.com/MenajulM" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-200" title="X (Twitter)">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </MagneticIcon>
              <MagneticIcon>
                <a href="https://peerlist.io/menajul" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-200" title="Peerlist Profile">
                  <svg viewBox="-0.5 -0.5 16 16" fill="none" className="w-4 h-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1">
                    <path d="M5.234 0.98375h4.532c2.2135625 0 4.073125 1.6644375 4.3175625 3.8644374999999997l0.15256250000000002 1.3725c0.0945 0.8502500000000001 0.0945 1.708375 0 2.558625l-0.15256250000000002 1.3725c-0.2444375 2.2000625 -2.104 3.8644374999999997 -4.3175625 3.8644374999999997H5.234c-2.213625 0 -4.0731875 -1.664375 -4.317625 -3.8644374999999997l-0.1525 -1.3725c-0.09443750000000001 -0.8502500000000001 -0.09443750000000001 -1.708375 0 -2.558625l0.1525 -1.3725c0.2444375 -2.2 2.104 -3.8644374999999997 4.317625 -3.8644374999999997Z" />
                    <path d="M5.327937499999999 11.120125000000002v-2.896125m0 0V3.8798749999999997h2.8960625c1.199625 0 2.172125 0.9724375000000001 2.172125 2.1720625h0c0 1.199625 -0.9724375000000001 2.1720625 -2.172125 2.1720625H5.327937499999999Z" />
                  </svg>
                </a>
              </MagneticIcon>
            </div>
            
            {/* MinBOT Sidebar Command Button */}
            <div className="pt-1.5 w-full">
              <button
                onClick={() => setIsChatOpen(true)}
                className="relative w-full flex items-center justify-between px-3.5 py-2.5 rounded-none border border-zinc-200/90 dark:border-zinc-800/90 bg-gradient-to-r from-zinc-100/70 via-zinc-50/90 to-zinc-100/70 dark:from-zinc-900/60 dark:via-zinc-900/40 dark:to-zinc-900/60 hover:border-orange-500/40 dark:hover:border-orange-500/40 hover:shadow-md hover:shadow-orange-500/5 transition-all duration-300 group text-left cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

                <div className="flex items-center gap-2.5">
                  <div className="relative flex items-center justify-center">
                    <span className="relative flex h-2 w-2 flex-shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 group-hover:text-orange-500 dark:group-hover:text-orange-400 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                    <span className="text-[10.5px] font-mono uppercase tracking-widest text-zinc-700 dark:text-zinc-300 font-semibold group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                      Ask MinBOT
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 px-2 py-0.5 border border-zinc-200/90 dark:border-zinc-800 rounded-none bg-white/80 dark:bg-zinc-950/80 text-[8.5px] font-mono text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-200 group-hover:border-zinc-300 dark:group-hover:border-zinc-700 shadow-xs transition-all">
                  <span>⌘K</span>
                </div>
              </button>
            </div>
          </div>

          {/* Skills Grid */}
          <div className="space-y-4 pt-1 hidden lg:block sidebar-compact-skills">
            <h2 className="text-xl sm:text-2xl font-normal font-dot tracking-wide text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-900 pb-2">
              skills
            </h2>
            <div className="space-y-0 select-none sidebar-compact-skills-grid">
              <div className="grid grid-cols-[80px_1fr] gap-4 py-2.5 border-b border-zinc-100 dark:border-zinc-900/40 hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 px-2 -mx-2 rounded-none transition-all duration-200 group/skill sidebar-compact-skills-row">
                <span className="text-[10.5px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-550 font-semibold group-hover/skill:text-zinc-900 dark:group-hover/skill:text-zinc-200 transition-colors sidebar-compact-skills-label">AI Eng</span>
                <span className="text-[13px] font-sans text-zinc-500 dark:text-zinc-450 leading-normal group-hover/skill:text-zinc-800 dark:group-hover/skill:text-zinc-300 transition-colors sidebar-compact-skills-text">
                  RAG · Vector Search · LLMs · AI Agents · AI Automation · MCP Server
                </span>
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-4 py-2.5 border-b border-zinc-100 dark:border-zinc-900/40 hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 px-2 -mx-2 rounded-none transition-all duration-200 group/skill sidebar-compact-skills-row">
                <span className="text-[10.5px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-555 font-semibold group-hover/skill:text-zinc-900 dark:group-hover/skill:text-zinc-200 transition-colors sidebar-compact-skills-label">Data Eng</span>
                <span className="text-[13px] font-sans text-zinc-500 dark:text-zinc-450 leading-normal group-hover/skill:text-zinc-800 dark:group-hover/skill:text-zinc-300 transition-colors sidebar-compact-skills-text">
                  SAP Datasphere · SAP Business Data Cloud · BigQuery · SAP BTP · SAP BODS · SQL · Python
                </span>
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-4 py-2.5 border-b border-zinc-100 dark:border-zinc-900/40 hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 px-2 -mx-2 rounded-none transition-all duration-200 group/skill sidebar-compact-skills-row">
                <span className="text-[10.5px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-550 font-semibold group-hover/skill:text-zinc-900 dark:group-hover/skill:text-zinc-200 transition-colors sidebar-compact-skills-label">Web Dev</span>
                <span className="text-[13px] font-sans text-zinc-500 dark:text-zinc-450 leading-normal group-hover/skill:text-zinc-800 dark:group-hover/skill:text-zinc-300 transition-colors sidebar-compact-skills-text">
                  React · Next.js · Tailwind CSS · TypeScript · Vite
                </span>
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-4 py-2.5 border-b border-zinc-100 dark:border-zinc-900/40 hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 px-2 -mx-2 rounded-none transition-all duration-200 group/skill sidebar-compact-skills-row">
                <span className="text-[10.5px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-550 font-semibold group-hover/skill:text-zinc-900 dark:group-hover/skill:text-zinc-200 transition-colors sidebar-compact-skills-label">Mobile & Sec</span>
                <span className="text-[13px] font-sans text-zinc-500 dark:text-zinc-450 leading-normal group-hover/skill:text-zinc-800 dark:group-hover/skill:text-zinc-300 transition-colors sidebar-compact-skills-text">
                  Kotlin · Android Jetpack · JCA PKI · SQLite AES Encryption
                </span>
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-4 py-2.5 hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 px-2 -mx-2 rounded-none transition-all duration-200 group/skill sidebar-compact-skills-row">
                <span className="text-[10.5px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-550 font-semibold group-hover/skill:text-zinc-900 dark:group-hover/skill:text-zinc-200 transition-colors sidebar-compact-skills-label">SEO & Growth</span>
                <span className="text-[13px] font-sans text-zinc-500 dark:text-zinc-450 leading-normal group-hover/skill:text-zinc-800 dark:group-hover/skill:text-zinc-300 transition-colors sidebar-compact-skills-text">
                  Technical SEO · Schema JSON-LD · Search Console · AdSense · GA4
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Split Web & Android Projects or Chatbot */}
        <div id="main-content" className={`lg:col-start-2 min-w-0 max-w-4xl ${isChatOpen ? "lg:sticky lg:top-6 lg:h-[calc(100vh-48px)] overflow-hidden" : "space-y-16 lg:space-y-20"}`}>
          {isChatOpen ? (
            <MinBOT isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
          ) : (
            <>
              {/* Sub Navigation Bar for Internal Links */}
              <nav className="flex flex-nowrap items-center justify-between sm:justify-start gap-1.5 sm:gap-6 text-[8.5px] xs:text-[9.5px] sm:text-[10.5px] font-mono uppercase tracking-wider sm:tracking-widest text-zinc-450 dark:text-zinc-550 border-b border-zinc-100 dark:border-zinc-900/40 pb-3 mb-6 select-none overflow-x-auto scrollbar-none w-full">
                <a href="#about" className={`nav-link whitespace-nowrap hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors ${activeSection === "about" ? "active" : ""}`}>/ about</a>
                <a href="#projects" className={`nav-link whitespace-nowrap hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors ${activeSection === "projects" ? "active" : ""}`}>/ projects</a>
                <a href="#architecture" className={`nav-link whitespace-nowrap hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors ${activeSection === "architecture" ? "active" : ""}`}>/ architecture</a>
              </nav>

              {/* About Section */}
              <section ref={aboutRef} id="about" className={`scroll-reveal ${aboutVisible ? "revealed" : ""} space-y-6 scroll-mt-12`}>
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-2">
                  <h2 className="text-xl sm:text-2xl font-normal font-dot tracking-wide text-zinc-900 dark:text-zinc-100">
                    about
                  </h2>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                    <span>SEUTI PT 2</span>
                    <span>→</span>
                    <span className="text-zinc-800 dark:text-zinc-200">KOLKATA</span>
                  </div>
                </div>

                {/* Main Bio Paragraphs */}
                <div className="space-y-4 text-[15px] sm:text-[15.5px] leading-[1.75] text-zinc-700 dark:text-zinc-200 font-sans tracking-tight">
                  <p>
                    I am a <strong className="font-semibold text-zinc-900 dark:text-zinc-100">Data Engineer & Applied AI Developer</strong> based in Kolkata, bridging enterprise data warehousing with modern AI models and autonomous agent workflows. I architect high-performance cloud data pipelines, distributed ETL systems, and autonomous AI agents using SAP Datasphere, BigQuery, and modern LLM frameworks.
                  </p>
                  <p>
                    Originally from <strong className="font-semibold text-zinc-900 dark:text-zinc-100">Seuti Part 2</strong>—an international border village in Cooch Behar near the India-Bangladesh border—I moved to Kolkata to pursue Power Engineering at <a href="https://www.jaduniv.edu.in/" target="_blank" rel="noopener noreferrer" className="text-zinc-900 dark:text-zinc-100 hover:text-zinc-650 dark:hover:text-zinc-300 hover:underline decoration-1 underline-offset-4 font-medium transition-colors">Jadavpur University</a>. While modeling 20MW wind power stations and ocean wave energy converters in MATLAB and Simulink, I discovered SQL and Python, pivoting my engineering career toward cloud data architecture and intelligent software.
                  </p>
                </div>

                {/* Highlight Cards Grid - Sharp Edged */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  <div className="p-4 rounded-none border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/40 dark:bg-zinc-900/30 space-y-1.5 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300">
                    <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-sky-600 dark:text-sky-400 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                      <span>Border Town Roots</span>
                    </div>
                    <p className="text-[13px] text-zinc-650 dark:text-zinc-350 leading-relaxed">
                      Grew up in Seuti Part 2 near the India-Bangladesh border. Developed strong resilience and a habit of cycling miles daily for private tuition.
                    </p>
                  </div>

                  <div className="p-4 rounded-none border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/40 dark:bg-zinc-900/30 space-y-1.5 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300">
                    <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
                      <HeartHandshake className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>Community Relief</span>
                    </div>
                    <p className="text-[13px] text-zinc-650 dark:text-zinc-350 leading-relaxed">
                      Drove COVID-19 relief operations across North Bengal through <em className="not-italic font-medium text-zinc-800 dark:text-zinc-200">Eksathe Banchbo</em> (built by JU seniors), delivering food & medicines to isolated families.
                    </p>
                  </div>

                  <div className="p-4 rounded-none border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/40 dark:bg-zinc-900/30 space-y-1.5 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300">
                    <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-orange-600 dark:text-orange-400 font-semibold">
                      <Rocket className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400 shrink-0" />
                      <span>Relentless Builder Grit</span>
                    </div>
                    <p className="text-[13px] text-zinc-650 dark:text-zinc-350 leading-relaxed">
                      Built 20+ sites starting on Blogger & WordPress. Pivoted into full-stack Next.js & Android development—building <em className="not-italic text-zinc-800 dark:text-zinc-200 font-medium">Rasid</em>, <em className="not-italic text-zinc-800 dark:text-zinc-200 font-medium">vidstats.pro</em> (800+ users), PDF Signature Validator, and NotifyVault.
                    </p>
                  </div>

                  <div className="p-4 rounded-none border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/40 dark:bg-zinc-900/30 space-y-1.5 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300">
                    <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold">
                      <Music2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span>Beyond Code</span>
                    </div>
                    <p className="text-[13px] text-zinc-650 dark:text-zinc-350 leading-relaxed">
                      Learning acoustic guitar (named <em className="not-italic font-medium text-zinc-800 dark:text-zinc-200">Gulbahar</em>) & ukulele with late-night singing after 1 AM. Loves South Indian thrillers, mass cinema, sci-fi, & <em className="not-italic text-zinc-800 dark:text-zinc-200">The Alchemist</em>.
                    </p>
                  </div>
                </div>
              </section>



              {/* Projects Section with Sharp Edged Boxes and Top Screenshots */}
              <section ref={projRef} id="projects" className={`scroll-reveal ${projVisible ? "revealed" : ""} space-y-4 scroll-mt-12`}>
                {/* 1. Section Header Row */}
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-2.5">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl sm:text-2xl font-normal font-dot tracking-wide whitespace-nowrap text-zinc-900 dark:text-zinc-100">
                      production projects
                    </h2>
                    <span className="px-2.5 py-0.5 whitespace-nowrap shrink-0 rounded-none bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10.5px] font-mono font-bold border border-orange-500/25">
                      {allProjects.length} SHIPS
                    </span>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                    <span>LIVE DEPLOYMENTS</span>
                  </div>
                </div>

                {/* 2. Filter Taxonomy Bar - Smooth Horizontal Scroll on Mobile */}
                <div className="w-full overflow-hidden">
                  <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none pb-1 pt-0.5 select-none w-full">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-3 py-1.5 sm:py-1 rounded-none text-[10.5px] sm:text-[11px] font-mono tracking-wider transition-all duration-200 cursor-pointer shrink-0 border whitespace-nowrap ${
                          selectedCategory === cat.id
                            ? "bg-[#E65A1E] text-white border-[#E65A1E] dark:bg-[#FF7832] dark:text-zinc-950 dark:border-[#FF7832] font-semibold shadow-xs"
                            : "bg-zinc-100/70 dark:bg-zinc-900/50 text-zinc-650 dark:text-zinc-400 border-zinc-200/80 dark:border-zinc-800/80 hover:bg-zinc-200/70 dark:hover:bg-zinc-800/70 hover:text-zinc-900 dark:hover:text-zinc-100"
                        }`}
                      >
                        {cat.label} ({cat.count})
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  {filteredProjects.map((project) => {
                    return (
                      <SpotlightCard key={project.title}>
                        {/* 1. Project Real Screenshot / Visual Preview Banner at Top of Box - Sharp Edged */}
                        <div className="w-full aspect-[16/9] sm:h-44 rounded-none overflow-hidden border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-100/60 dark:bg-zinc-950/60 relative group-hover:scale-[1.01] transition-transform duration-300 shadow-2xs">
                          {project.link ? (
                            <a href={project.link} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                              {renderProjectBanner(project)}
                            </a>
                          ) : (
                            <div className="w-full h-full">
                              {renderProjectBanner(project)}
                            </div>
                          )}
                        </div>

                        {/* 2. Telemetry Tag Row */}
                        <div className="flex items-center justify-between text-[9.5px] font-mono tracking-wider text-zinc-400 dark:text-zinc-500 pt-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-orange-600 dark:text-orange-400 font-bold">[{project.id}]</span>
                            <span className="uppercase font-semibold text-zinc-600 dark:text-zinc-400">{project.tag}</span>
                          </div>
                          <span className="tabular-nums font-semibold">{project.year}</span>
                        </div>

                        {/* 3. Card Header with Icon, Title, Status */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3.5">
                            <div className="w-9 h-9 rounded-none border border-zinc-200/90 dark:border-zinc-800/90 bg-zinc-100/60 dark:bg-zinc-900/60 flex items-center justify-center p-1.5 group-hover:border-zinc-300 dark:group-hover:border-zinc-700 transition-colors shrink-0 overflow-hidden">
                              <img
                                src={`${import.meta.env.BASE_URL}${project.favicon}`}
                                alt={project.title}
                                className="w-full h-full object-contain rounded-none dark:brightness-110"
                              />
                            </div>
                            <div>
                              <h3 className="text-lg font-medium font-sans tracking-tight text-zinc-900 dark:text-zinc-100">
                                {project.link ? (
                                  <a
                                    href={project.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 hover:text-zinc-650 dark:hover:text-zinc-300 hover:underline decoration-1 underline-offset-4 transition-colors"
                                  >
                                    {project.title}
                                    <ArrowUpRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 -translate-x-0.5 translate-y-0.5 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-100" />
                                  </a>
                                ) : (
                                  <span>{project.title}</span>
                                )}
                              </h3>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest shrink-0">
                            <span className={`px-2.5 py-0.5 rounded-none border font-semibold ${
                              project.status === "Live"
                                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                                : "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20"
                            }`}>
                              {project.status}
                            </span>
                          </div>
                        </div>

                        {/* 4. Description */}
                        <p className="text-[13.5px] sm:text-[14px] text-zinc-650 dark:text-zinc-300 leading-relaxed font-sans tracking-tight">
                          {project.description}
                        </p>

                        {/* 5. Metrics Bar - Sharp Edged */}
                        <div className="px-2.5 py-1.5 rounded-none bg-zinc-100/70 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between text-[9.5px] font-mono text-zinc-500 dark:text-zinc-400">
                          <span className="text-zinc-700 dark:text-zinc-300 font-medium">{project.metrics}</span>
                        </div>

                        {/* 6. Tech Stack Badges - Sharp Edged */}
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {project.tech.split(", ").map((item, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[10px] sm:text-[10.5px] font-mono tracking-wider font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-200/50 dark:bg-zinc-800/60 px-2.5 py-0.5 rounded-none border border-zinc-300/50 dark:border-zinc-700/50 group-hover:border-zinc-400/60 dark:group-hover:border-zinc-600/60 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800 transition-colors"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </SpotlightCard>
                    );
                  })}
                </div>
              </section>

              {/* 360° Technical Architecture Specs Section - Sharp Edged */}
              <section ref={archRef} id="architecture" className={`scroll-reveal ${archVisible ? "revealed" : ""} space-y-6 scroll-mt-12`}>
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-2">
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-xl sm:text-2xl font-normal font-dot tracking-wide text-zinc-900 dark:text-zinc-100">
                      360° technical architecture
                    </h2>
                    <span className="px-2 py-0.5 rounded-none bg-sky-500/10 text-sky-600 dark:text-sky-400 text-[10px] font-mono font-bold border border-sky-500/20">
                      CORE SPECS
                    </span>
                  </div>
                  <div className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                    <span>STACK INTELLIGENCE</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {architectureSpecs.map((spec) => {
                    const IconComponent = spec.icon;
                    return (
                      <div
                        key={spec.num}
                        className="p-5 rounded-none border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/40 dark:bg-zinc-900/30 space-y-3 hover:border-orange-500/30 dark:hover:border-orange-500/30 transition-all duration-300 group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-none bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                              <IconComponent className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 tracking-wider">
                              [{spec.num} // {spec.layer}]
                            </span>
                          </div>
                        </div>

                        <h3 className="text-base font-medium font-sans text-zinc-900 dark:text-zinc-100 tracking-tight">
                          {spec.title}
                        </h3>

                        <p className="text-[13px] text-zinc-650 dark:text-zinc-350 leading-relaxed font-sans">
                          {spec.desc}
                        </p>

                        <div className="pt-1.5 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
                          <span className="text-zinc-700 dark:text-zinc-300 font-semibold">{spec.metrics}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>



              {/* Footer */}
              {!isChatOpen && <Footer />}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Index