import { type FC, useEffect, useState } from "react"
import { Mail, Github, Linkedin, Sparkles } from "lucide-react"
import Footer from "@/components/Footer"
import MinBOT from "@/components/MinBOT"

type Project = {
  title: string
  short: string
  link: string
  favicon: string
}

const projects: Project[] = [
  {
    title: "Rasid",
    short: "Invoicing with cryptographically sealed, QR-verifiable invoices.",
    link: "https://rasid.in",
    favicon: "favicons/rasid.png",
  },
  {
    title: "MacClip",
    short: "Fast, private clipboard manager for Mac.",
    link: "https://macclip.app/",
    favicon: "favicons/macclip.png",
  },
  {
    title: "Track My Subscriptions",
    short: "Private Android tracker for renewals, trials and price hikes.",
    link: "https://track-my-subscriptions.netlify.app/",
    favicon: "favicons/subtrack.png",
  },
  {
    title: "Site Audit Score",
    short: "SEO audit and site health dashboard with 15 modules.",
    link: "https://siteauditscore.com",
    favicon: "favicons/seoptimised.png",
  },
  {
    title: "Govt Procurement Intelligence",
    short: "Fraud signals across 8.8M public procurement records.",
    link: "",
    favicon: "favicons/procurement.png",
  },
  {
    title: "QuranGPT",
    short: "AI answers grounded in verses of the Quran.",
    link: "https://quran-gpt.netlify.app/",
    favicon: "favicons/qurangpt.png",
  },
  {
    title: "PDF SignCheck",
    short: "Verify PDF digital signatures privately in the browser.",
    link: "https://pdfsigncheck.com",
    favicon: "favicons/pdfsigncheck.png",
  },
  {
    title: "VidStats",
    short: "AI analytics for YouTube creators.",
    link: "https://vidstats.pro",
    favicon: "favicons/vidstats.svg",
  },
  {
    title: "PDF Signature Validator",
    short: "Android app that verifies PDF signatures offline.",
    link: "https://play.google.com/store/apps/details?id=com.minhackerz.pdfsigncheck_app",
    favicon: "favicons/pdf_validator_app.png",
  },
  {
    title: "NotifyVault",
    short: "Encrypted history of your Android notifications.",
    link: "https://play.google.com/store/apps/details?id=com.notifyvault.app",
    favicon: "favicons/notifyvault_app.png",
  },
]

const socials = [
  { href: "mailto:menajulhoque99@gmail.com", label: "Email", icon: <Mail className="w-4 h-4" /> },
  { href: "https://github.com/MinHackerz", label: "GitHub", icon: <Github className="w-4 h-4" /> },
  { href: "https://www.linkedin.com/in/menajul-hoque/", label: "LinkedIn", icon: <Linkedin className="w-4 h-4" /> },
  {
    href: "https://x.com/MenajulM",
    label: "X (Twitter)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    href: "https://peerlist.io/menajul",
    label: "Peerlist",
    icon: (
      <svg viewBox="-0.5 -0.5 16 16" fill="none" className="w-4 h-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" aria-hidden="true">
        <path d="M5.234 0.98375h4.532c2.2135625 0 4.073125 1.6644375 4.3175625 3.8644374999999997l0.15256250000000002 1.3725c0.0945 0.8502500000000001 0.0945 1.708375 0 2.558625l-0.15256250000000002 1.3725c-0.2444375 2.2000625 -2.104 3.8644374999999997 -4.3175625 3.8644374999999997H5.234c-2.213625 0 -4.0731875 -1.664375 -4.317625 -3.8644374999999997l-0.1525 -1.3725c-0.09443750000000001 -0.8502500000000001 -0.09443750000000001 -1.708375 0 -2.558625l0.1525 -1.3725c0.2444375 -2.2 2.104 -3.8644374999999997 4.317625 -3.8644374999999997Z" />
        <path d="M5.327937499999999 11.120125000000002v-2.896125m0 0V3.8798749999999997h2.8960625c1.199625 0 2.172125 0.9724375000000001 2.172125 2.1720625h0c0 1.199625 -0.9724375000000001 2.1720625 -2.172125 2.1720625H5.327937499999999Z" />
      </svg>
    ),
  },
]

const ProjectCard: FC<{ project: Project }> = ({ project }) => {
  const body = (
    <>
      <div className="w-10 h-10 shrink-0 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center overflow-hidden p-1.5">
        <img
          src={`${import.meta.env.BASE_URL}${project.favicon}`}
          alt=""
          width={28}
          height={28}
          loading="lazy"
          className="w-full h-full object-contain rounded-md"
        />
      </div>
      <div className="min-w-0">
        <h3 className="font-sans text-[15px] font-medium tracking-tight text-zinc-900 dark:text-zinc-100 leading-snug">
          {project.title}
        </h3>
        <p className="mt-0.5 text-[13px] leading-snug text-zinc-500 dark:text-zinc-400">
          {project.short}
        </p>
      </div>
    </>
  )

  const cardClass =
    "flex items-start gap-3 p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-900/30 transition-colors duration-200"

  return project.link ? (
    <a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`${cardClass} hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-white dark:hover:bg-zinc-900/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400`}
    >
      {body}
    </a>
  ) : (
    <div className={cardClass}>{body}</div>
  )
}

const Index: FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false)

  useEffect(() => {
    document.title = "Menajul Hoque — Applied AI & Data Engineer"
  }, [])

  useEffect(() => {
    document.body.style.overflow = isChatOpen ? "hidden" : ""
    if (isChatOpen) window.scrollTo(0, 0)
    return () => {
      document.body.style.overflow = ""
    }
  }, [isChatOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsChatOpen(prev => !prev)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div className="min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:dark:bg-zinc-950 focus:border focus:border-zinc-200 focus:dark:border-zinc-800 focus:rounded-lg text-xs"
      >
        Skip to main content
      </a>

      <main id="main-content" className="mx-auto w-full max-w-2xl px-6 pt-16 sm:pt-24 pb-8">
        {isChatOpen ? (
          <MinBOT isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        ) : (
          <>
            {/* Intro */}
            <header id="about" className="flex flex-col items-center text-center">
              <img
                src={`${import.meta.env.BASE_URL}profile-photo.jpg`}
                alt="Menajul Hoque"
                width={88}
                height={88}
                className="w-[88px] h-[88px] rounded-full object-cover object-[50%_30%] border border-zinc-200 dark:border-zinc-800 grayscale hover:grayscale-0 transition-[filter] duration-300"
              />
              <h1 className="mt-5 font-display text-[2.75rem] leading-none font-normal tracking-tight">Menajul Hoque</h1>
              <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
                Data Engineer &amp; Applied AI Developer, Kolkata
              </p>

              <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                Hey! I wrangle data pipelines and AI agents on SAP Datasphere and BigQuery, and I build
                web, Android and Mac apps whenever an idea won't leave me alone. Power Engineering grad
                from{" "}
                <a
                  href="https://www.jaduniv.edu.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-900 dark:text-zinc-100 underline decoration-zinc-300 dark:decoration-zinc-700 underline-offset-4 hover:decoration-zinc-900 dark:hover:decoration-zinc-100"
                >
                  Jadavpur University
                </a>
                .
              </p>

              <div className="mt-6 flex items-center gap-5">
                {socials.map(s => (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel={s.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                    title={s.label}
                    aria-label={s.label}
                    className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-200"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setIsChatOpen(true)}
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 px-4 py-2 text-[13px] text-zinc-600 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-200"
              >
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                Ask MinBOT
                <kbd className="ml-1 rounded-md border border-zinc-200 dark:border-zinc-800 px-1.5 text-[10px] text-zinc-400 font-sans">⌘K</kbd>
              </button>
            </header>

            {/* Projects */}
            <section id="projects" className="mt-20 scroll-mt-12">
              <h2 className="font-sans tracking-normal text-center text-sm font-medium text-zinc-500 dark:text-zinc-400">Projects</h2>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {projects.map(project => (
                  <ProjectCard key={project.title} project={project} />
                ))}
              </div>
            </section>

            <div className="mt-20">
              <Footer />
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default Index
