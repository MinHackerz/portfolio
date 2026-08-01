import { type FC } from "react"
import {
  QrCode,
  Search,
  Database,
  BookOpen,
  ShieldCheck,
  BarChart2,
  Video,
  Smartphone,
  Lock,
  Play,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  AlertTriangle
} from "lucide-react"

interface ProjectThumbnailProps {
  title: string;
}

export const ProjectThumbnail: FC<ProjectThumbnailProps> = ({ title }) => {
  return (
    <div className="w-full h-32 sm:h-36 relative rounded-xl overflow-hidden bg-transparent p-3 sm:p-3.5 flex flex-col justify-between transition-all duration-300">
      
      {/* Subtle Grid Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
          backgroundSize: '12px 12px'
        }}
      />

      {/* 1. Rasid */}
      {title === "Rasid" && (
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-800 dark:text-zinc-200 shadow-xs">
                <QrCode className="w-3 h-3" />
              </div>
              <span className="text-[11px] font-mono font-semibold text-zinc-800 dark:text-zinc-200">rasid.in</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-[9px] font-mono font-semibold">
              <CheckCircle2 className="w-2.5 h-2.5" />
              VERIFIED SEAL
            </div>
          </div>

          <div className="flex items-center justify-between my-auto py-1">
            <div className="space-y-0.5">
              <div className="text-[9px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Invoice Total</div>
              <div className="text-base sm:text-lg font-bold font-mono text-zinc-900 dark:text-zinc-100">$1,450.00</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shadow-xs">
              <QrCode className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>

          <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400 dark:text-zinc-500 border-t border-zinc-200/60 dark:border-zinc-800/60 pt-1.5">
            <span>Zero-Knowledge QR</span>
            <span>WhatsApp / Email</span>
          </div>
        </div>
      )}

      {/* 2. SEOptimised */}
      {title === "SEOptimised" && (
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-800 dark:text-zinc-200 shadow-xs">
                <Search className="w-3 h-3" />
              </div>
              <span className="text-[11px] font-mono font-semibold text-zinc-800 dark:text-zinc-200">seoptimised.vercel.app</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/10 dark:bg-cyan-500/20 border border-cyan-500/30 text-cyan-700 dark:text-cyan-400 text-[9px] font-mono font-semibold">
              <TrendingUp className="w-2.5 h-2.5" />
              +14.8% RANK
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1.5 my-auto py-1">
            <div className="bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 rounded-md p-1 text-center">
              <div className="text-sm font-bold font-mono text-cyan-600 dark:text-cyan-400">98</div>
              <div className="text-[8.5px] font-mono text-zinc-500 dark:text-zinc-400">Tech</div>
            </div>
            <div className="bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 rounded-md p-1 text-center">
              <div className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">95</div>
              <div className="text-[8.5px] font-mono text-zinc-500 dark:text-zinc-400">SEO</div>
            </div>
            <div className="bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 rounded-md p-1 text-center">
              <div className="text-sm font-bold font-mono text-blue-600 dark:text-blue-400">92</div>
              <div className="text-[8.5px] font-mono text-zinc-500 dark:text-zinc-400">Speed</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400 dark:text-zinc-500 border-t border-zinc-200/60 dark:border-zinc-800/60 pt-1.5">
            <span>15 Audit Modules</span>
            <span>Real-time Scraping</span>
          </div>
        </div>
      )}

      {/* 3. Govt Procurement Intelligence */}
      {title === "Govt Procurement Intelligence" && (
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-800 dark:text-zinc-200 shadow-xs">
                <Database className="w-3 h-3" />
              </div>
              <span className="text-[11px] font-mono font-semibold text-zinc-800 dark:text-zinc-200">Procurement</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/10 dark:bg-rose-500/20 border border-rose-500/30 text-rose-700 dark:text-rose-400 text-[9px] font-mono font-semibold">
              <AlertTriangle className="w-2.5 h-2.5" />
              SINGLE-BID: 94%
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1.5 my-auto py-1">
            <div className="bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 rounded-md p-1 text-center">
              <div className="text-xs font-bold font-mono text-zinc-900 dark:text-zinc-100">8.8M</div>
              <div className="text-[8.5px] font-mono text-zinc-500 dark:text-zinc-400">Records</div>
            </div>
            <div className="bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 rounded-md p-1 text-center">
              <div className="text-xs font-bold font-mono text-rose-600 dark:text-rose-400">14.2%</div>
              <div className="text-[8.5px] font-mono text-zinc-500 dark:text-zinc-400">Single-Bid</div>
            </div>
            <div className="bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 rounded-md p-1 text-center">
              <div className="text-xs font-bold font-mono text-sky-600 dark:text-sky-400">495</div>
              <div className="text-[8.5px] font-mono text-zinc-500 dark:text-zinc-400">Flagged</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400 dark:text-zinc-500 border-t border-zinc-200/60 dark:border-zinc-800/60 pt-1.5">
            <span>India CPP Portal</span>
            <span>Datasette + SQLite</span>
          </div>
        </div>
      )}

      {/* 4. Tadabbur */}
      {title === "Tadabbur" && (
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-800 dark:text-zinc-200 shadow-xs">
                <BookOpen className="w-3 h-3" />
              </div>
              <span className="text-[11px] font-mono font-semibold text-zinc-800 dark:text-zinc-200">tadabbur-iota.vercel.app</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-[9px] font-mono font-semibold">
              <Sparkles className="w-2.5 h-2.5" />
              QURAN SDK
            </div>
          </div>

          <div className="flex items-center justify-between my-auto py-1">
            <div className="space-y-0.5">
              <div className="text-xl font-serif text-amber-700 dark:text-amber-400">تدبر</div>
              <div className="text-[8.5px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Quranic Companion</div>
            </div>
            <div className="flex items-center gap-1.5 bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 rounded-full px-2.5 py-1 shadow-xs">
              <div className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center">
                <Play className="w-2 h-2 fill-current translate-x-0.5" />
              </div>
              <span className="text-[9.5px] font-mono text-zinc-700 dark:text-zinc-300">Al-Fatihah</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400 dark:text-zinc-500 border-t border-zinc-200/60 dark:border-zinc-800/60 pt-1.5">
            <span>QuranReflect Feed</span>
            <span>Multi-Reciter Audio</span>
          </div>
        </div>
      )}

      {/* 5. PDF SignCheck */}
      {title === "PDF SignCheck" && (
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-xs">
                <ShieldCheck className="w-3 h-3" />
              </div>
              <span className="text-[11px] font-mono font-semibold text-zinc-800 dark:text-zinc-200">pdfsigncheck.com</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-[9px] font-mono font-semibold">
              <CheckCircle2 className="w-2.5 h-2.5" />
              PKCS#7 VALID
            </div>
          </div>

          <div className="flex items-center justify-between my-auto py-1">
            <div className="space-y-0.5">
              <div className="text-sm font-bold font-sans text-zinc-900 dark:text-zinc-100">Signature Valid ✓</div>
              <div className="text-[9px] font-mono text-zinc-500 dark:text-zinc-400">80+ Mozilla Root CAs</div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400 dark:text-zinc-500 border-t border-zinc-200/60 dark:border-zinc-800/60 pt-1.5">
            <span>100% Client-Side Web Crypto</span>
            <span>Zero Server Uploads</span>
          </div>
        </div>
      )}

      {/* 6. VidStats */}
      {title === "VidStats" && (
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-xs">
                <BarChart2 className="w-3 h-3" />
              </div>
              <span className="text-[11px] font-mono font-semibold text-zinc-800 dark:text-zinc-200">vidstats.pro</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/10 dark:bg-purple-500/20 border border-purple-500/30 text-purple-700 dark:text-purple-400 text-[9px] font-mono font-semibold">
              <Sparkles className="w-2.5 h-2.5" />
              800+ CREATORS
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1.5 my-auto py-1">
            <div className="bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 rounded-md p-1 text-center">
              <div className="text-xs font-bold font-mono text-purple-600 dark:text-purple-400">+45.6K</div>
              <div className="text-[8.5px] font-mono text-zinc-500 dark:text-zinc-400">Subs</div>
            </div>
            <div className="bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 rounded-md p-1 text-center">
              <div className="text-xs font-bold font-mono text-zinc-900 dark:text-zinc-100">3.1M</div>
              <div className="text-[8.5px] font-mono text-zinc-500 dark:text-zinc-400">Views</div>
            </div>
            <div className="bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 rounded-md p-1 text-center">
              <div className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400">GPT-4</div>
              <div className="text-[8.5px] font-mono text-zinc-500 dark:text-zinc-400">AI Copilot</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400 dark:text-zinc-500 border-t border-zinc-200/60 dark:border-zinc-800/60 pt-1.5">
            <span>Comment Sentiment</span>
            <span>Post Scheduler</span>
          </div>
        </div>
      )}

      {/* 7. Youtube Transcript */}
      {title === "Youtube Transcript" && (
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-xs">
                <Video className="w-3 h-3" />
              </div>
              <span className="text-[11px] font-mono font-semibold text-zinc-800 dark:text-zinc-200">yt-transcript-indol.vercel.app</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/30 text-blue-700 dark:text-blue-400 text-[9px] font-mono font-semibold">
              <Sparkles className="w-2.5 h-2.5" />
              GEMINI 1.5
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5 my-auto py-1">
            <div className="bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 rounded-md p-1.5 space-y-0.5">
              <div className="text-[9.5px] font-mono font-semibold text-zinc-700 dark:text-zinc-300">Fast Transcript</div>
              <div className="text-[8.5px] font-mono text-zinc-400">00:15 Automated text</div>
            </div>
            <div className="bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/60 rounded-md p-1.5 space-y-0.5">
              <div className="text-[9.5px] font-mono font-semibold text-blue-700 dark:text-blue-300">125+ Languages</div>
              <div className="text-[8.5px] font-mono text-blue-600/80 dark:text-blue-400/80">AI Summarizer</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400 dark:text-zinc-500 border-t border-zinc-200/60 dark:border-zinc-800/60 pt-1.5">
            <span>Timestamped Layouts</span>
            <span>Vite + React</span>
          </div>
        </div>
      )}

      {/* 8. PDF Signature Validator (Android) */}
      {title === "PDF Signature Validator" && (
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-xs">
                <Smartphone className="w-3 h-3" />
              </div>
              <span className="text-[11px] font-mono font-semibold text-zinc-800 dark:text-zinc-200">Android App</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-[9px] font-mono font-semibold">
              <CheckCircle2 className="w-2.5 h-2.5" />
              PLAY STORE
            </div>
          </div>

          <div className="flex items-center justify-between my-auto py-1">
            <div className="space-y-0.5">
              <div className="text-sm font-bold font-sans text-zinc-900 dark:text-zinc-100">On-Device Validation</div>
              <div className="text-[9px] font-mono text-zinc-500 dark:text-zinc-400">Offline X.509 JCA Engine</div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-xs">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400 dark:text-zinc-500 border-t border-zinc-200/60 dark:border-zinc-800/60 pt-1.5">
            <span>Kotlin Jetpack</span>
            <span>PKI Hash Integrity</span>
          </div>
        </div>
      )}

      {/* 9. NotifyVault (Android) */}
      {title === "NotifyVault" && (
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-xs">
                <Lock className="w-3 h-3" />
              </div>
              <span className="text-[11px] font-mono font-semibold text-zinc-800 dark:text-zinc-200">Android App</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-[9px] font-mono font-semibold">
              <CheckCircle2 className="w-2.5 h-2.5" />
              PLAY STORE
            </div>
          </div>

          <div className="flex items-center justify-between my-auto py-1">
            <div className="space-y-0.5">
              <div className="text-sm font-bold font-sans text-zinc-900 dark:text-zinc-100">AES-256 Encrypted Vault</div>
              <div className="text-[9px] font-mono text-zinc-500 dark:text-zinc-400">Local Room SQLite Database</div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Lock className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400 dark:text-zinc-500 border-t border-zinc-200/60 dark:border-zinc-800/60 pt-1.5">
            <span>Material 3</span>
            <span>100% On-Device Privacy</span>
          </div>
        </div>
      )}

    </div>
  );
};
