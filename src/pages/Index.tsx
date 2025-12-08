import { type FC, useEffect, ReactNode } from "react"
import { Mail, Github, Linkedin } from "lucide-react"
import Footer from "@/components/Footer"
import { ThemeToggle } from "@/components/ThemeToggle"
import EnhancedExperiments from "@/components/EnhancedExperiments"
import { WaveReveal } from "@/components/WaveReveal"

// Geometric box component with corner cross marks (only 2 opposite corners)
interface GeometricBoxProps {
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary'; // primary = top-left + bottom-right, secondary = top-right + bottom-left
}

const GeometricBox: FC<GeometricBoxProps> = ({ children, className = "", variant = "primary" }) => (
  <div className={`relative ${className}`}>
    {/* Main box with border */}
    <div className="border border-gray-200 dark:border-gray-800 p-6 sm:p-8 relative">
      {children}
    </div>

    {/* Corner cross marks - only 2 opposite corners */}
    {variant === 'primary' ? (
      <>
        {/* Top-left corner */}
        <div className="absolute -top-3 -left-3 w-6 h-6">
          <div className="absolute top-1/2 left-0 w-full h-px bg-gray-300 dark:bg-gray-700 -translate-y-1/2" />
          <div className="absolute left-1/2 top-0 w-px h-full bg-gray-300 dark:bg-gray-700 -translate-x-1/2" />
        </div>

        {/* Bottom-right corner */}
        <div className="absolute -bottom-3 -right-3 w-6 h-6">
          <div className="absolute top-1/2 left-0 w-full h-px bg-gray-300 dark:bg-gray-700 -translate-y-1/2" />
          <div className="absolute left-1/2 top-0 w-px h-full bg-gray-300 dark:bg-gray-700 -translate-x-1/2" />
        </div>
      </>
    ) : (
      <>
        {/* Top-right corner */}
        <div className="absolute -top-3 -right-3 w-6 h-6">
          <div className="absolute top-1/2 left-0 w-full h-px bg-gray-300 dark:bg-gray-700 -translate-y-1/2" />
          <div className="absolute left-1/2 top-0 w-px h-full bg-gray-300 dark:bg-gray-700 -translate-x-1/2" />
        </div>

        {/* Bottom-left corner */}
        <div className="absolute -bottom-3 -left-3 w-6 h-6">
          <div className="absolute top-1/2 left-0 w-full h-px bg-gray-300 dark:bg-gray-700 -translate-y-1/2" />
          <div className="absolute left-1/2 top-0 w-px h-full bg-gray-300 dark:bg-gray-700 -translate-x-1/2" />
        </div>
      </>
    )}
  </div>
);

const Index: FC = () => {
  useEffect(() => {
    document.title = "Menajul Hoque - Data Engineer & Applied AI Engineer"
  }, []);

  const projects = [
    {
      title: "QuranGPT",
      year: "2023",
      description: "AI-powered chatbot web application that answers user questions with references from the Holy Quran. Initially developed on WordPress, then evolved to Next.js for enhanced performance and user experience.",
      tech: "Next.js, WordPress, React, AI APIs",
      status: "Live",
      link: "https://quran-gpt.netlify.app/"
    },
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
      <div className="max-w-xl mx-auto px-6 pt-8 pb-12">

        {/* Header in geometric box */}
        <WaveReveal delay={0}>
          <GeometricBox className="mb-10" variant="primary">
            <div className="flex items-start justify-between mb-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
                <img
                  src="/profile-picture-png.png"
                  alt="Menajul Hoque"
                  className="w-16 h-16 rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-medium tracking-tight">Menajul Hoque</h1>
                    <ThemeToggle />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">Data Engineer & Applied AI Engineer</p>
                  <div className="flex gap-4 mt-4">
                    <a href="mailto:menajulhoque99@gmail.com" className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                      <Mail className="w-5 h-5" />
                    </a>
                    <a href="https://github.com/MinHackerz" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                      <Github className="w-5 h-5" />
                    </a>
                    <a href="https://www.linkedin.com/in/menajul-hoque/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a href="https://x.com/MenajulM" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                    <a href="https://peerlist.io/menajul" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                      <svg viewBox="-0.5 -0.5 16 16" fill="none" className="w-5 h-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1">
                        <path d="M5.234 0.98375h4.532c2.2135625 0 4.073125 1.6644375 4.3175625 3.8644374999999997l0.15256250000000002 1.3725c0.0945 0.8502500000000001 0.0945 1.708375 0 2.558625l-0.15256250000000002 1.3725c-0.2444375 2.2000625 -2.104 3.8644374999999997 -4.3175625 3.8644374999999997H5.234c-2.213625 0 -4.0731875 -1.664375 -4.317625 -3.8644374999999997l-0.1525 -1.3725c-0.09443750000000001 -0.8502500000000001 -0.09443750000000001 -1.708375 0 -2.558625l0.1525 -1.3725c0.2444375 -2.2 2.104 -3.8644374999999997 4.317625 -3.8644374999999997Z" />
                        <path d="M5.327937499999999 11.120125000000002v-2.896125m0 0V3.8798749999999997h2.8960625c1.199625 0 2.172125 0.9724375000000001 2.172125 2.1720625h0c0 1.199625 -0.9724375000000001 2.1720625 -2.172125 2.1720625H5.327937499999999Z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-lg leading-relaxed text-gray-700 dark:text-gray-300 font-serif">
              <p>
                I'm a data engineer and applied AI engineer building scalable solutions and digital experiences. Currently working at Capgemini, bridging traditional data warehousing with modern cloud architectures.
              </p>
              <p>
                Based in Kolkata, India.
              </p>
            </div>
          </GeometricBox>
        </WaveReveal>

        {/* About Me Section in geometric box */}
        <WaveReveal delay={150}>
          <GeometricBox className="mb-10" variant="secondary">
            <h2 className="mb-6 text-xl font-normal tracking-tight">about</h2>
            <div className="space-y-4 text-lg leading-relaxed text-gray-700 dark:text-gray-300 font-serif">
              <p>
                My journey began in a remote village in West Bengal. A childhood curiosity about how planes fly led me to engineering. While studying Power Engineering at Jadavpur University, I discovered SQL and found my true calling in data.
              </p>
              <p>
                For the past three years, I've been optimizing ETL systems and building data pipelines. On weekends, I transition from data engineer to product builder, creating web applications like VidStats and QuranGPT.
              </p>
            </div>
          </GeometricBox>
        </WaveReveal>

        {/* Enhanced Experiments Section in geometric box */}
        <WaveReveal delay={300}>
          <GeometricBox className="mb-10" variant="primary">
            <EnhancedExperiments projects={projects} />
          </GeometricBox>
        </WaveReveal>

        {/* Skills/Tech Stack in geometric box */}
        <WaveReveal delay={450}>
          <GeometricBox className="mb-20" variant="secondary">
            <h2 className="mb-6 text-xl font-normal tracking-tight">skills</h2>
            <div className="space-y-3 font-mono text-sm text-gray-600 dark:text-gray-400">
              <div className="grid grid-cols-[140px_1fr] gap-4">
                <span className="text-gray-400 dark:text-gray-500">AI Engineering</span>
                <span>RAG, Vector Search, LLM Fine-Tuning, OpenAI API</span>
              </div>
              <div className="grid grid-cols-[140px_1fr] gap-4">
                <span className="text-gray-400 dark:text-gray-500">Data Engineering</span>
                <span>SAP BODS, Oracle SQL, SSIS, Python</span>
              </div>
              <div className="grid grid-cols-[140px_1fr] gap-4">
                <span className="text-gray-400 dark:text-gray-500">Web Development</span>
                <span>React, TypeScript, Next.js, Tailwind CSS</span>
              </div>
              <div className="grid grid-cols-[140px_1fr] gap-4">
                <span className="text-gray-400 dark:text-gray-500">Cloud & DevOps</span>
                <span>Hana Cloud</span>
              </div>
              <div className="grid grid-cols-[140px_1fr] gap-4">
                <span className="text-gray-400 dark:text-gray-500">Stack</span>
                <span>Built with React, Tailwind, and Vercel</span>
              </div>
            </div>
          </GeometricBox>
        </WaveReveal>
      </div>

      <Footer />
    </div>
  )
}

export default Index