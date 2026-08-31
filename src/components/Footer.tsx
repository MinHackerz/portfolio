import { FC, useState, useEffect } from "react";
import AnalogClock from "./AnalogClock";
import { ThemeToggle } from "./ThemeToggle";

const Footer: FC = () => {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  // Handle ESC key to close privacy policy modal
  useEffect(() => {
    if (!isPrivacyOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsPrivacyOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPrivacyOpen]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full px-6 md:px-12 lg:px-16 xl:px-20 pt-4 pb-6 border-t border-zinc-200/60 dark:border-zinc-800/80 mt-6 select-none">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        {/* Left: Copyright & Freshness info */}
        <div className="space-y-1">
          <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-widest font-medium">
            Menajul Hoque &copy; {new Date().getFullYear()}
          </div>
          <div className="text-[9px] font-mono text-zinc-400/70 dark:text-zinc-600 uppercase tracking-widest">
            Published Jan 2025 &middot; Updated August 2026
          </div>
        </div>

        {/* Center: Analog Clock */}
        <div className="flex items-center justify-center">
          <AnalogClock />
        </div>

        {/* Right: Actions (Privacy Policy + Theme Toggle + Top Scroll) */}
        <div className="flex items-center gap-5">
          <button
            onClick={() => setIsPrivacyOpen(true)}
            className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 uppercase tracking-widest hover:underline transition-colors duration-200 cursor-pointer"
          >
            Privacy Policy
          </button>

          <ThemeToggle />
          
          <button
            onClick={scrollToTop}
            className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 uppercase tracking-widest transition-colors duration-200 cursor-pointer flex items-center gap-1 group"
          >
            <span>/ top</span>
            <span className="group-hover:-translate-y-0.5 transition-transform duration-200">&uarr;</span>
          </button>
        </div>
      </div>

      {/* Accessible Privacy Policy Modal */}
      {isPrivacyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div 
            className="w-full max-w-lg p-6 md:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-[#FAFAF9] dark:bg-[#161210] text-left shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
            aria-labelledby="privacy-title"
          >
            <button
              onClick={() => setIsPrivacyOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 font-mono text-xs cursor-pointer"
              aria-label="Close modal"
            >
              [ESC] CLOSE
            </button>
            
            <h3 id="privacy-title" className="text-xl font-normal font-dot tracking-wide text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-900 pb-3 mb-4">
              Privacy Policy
            </h3>
            
            <div className="space-y-4 text-xs md:text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 font-sans tracking-tight max-h-[60vh] overflow-y-auto pr-2 scrollbar-minimal">
              <p><strong>Effective Date:</strong> July 14, 2026</p>
              <p>
                Your privacy is highly valued. This portfolio website (menajul.com) is designed as a static showcase of Menajul Hoque's credentials, engineering experience, and personal projects.
              </p>
              
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">1. Data Collection & Analytics</h4>
              <p>
                This website does not collect, harvest, or process any personal identification data. There are no cookies, contact forms, or tracking databases integrated directly on the site.
              </p>
              <p>
                If third-party service analytics (like Microsoft Clarity or Google Analytics) are ever used, they are configured strictly to respect standard browser 'Do Not Track' headers, collecting anonymized diagnostics only.
              </p>
              
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">2. External Links & Integrations</h4>
              <p>
                The portfolio contains outbound links to external social platforms (GitHub, LinkedIn, Twitter, Peerlist) and project domains. Once you leave this domain, please consult the privacy guidelines of the respective target websites.
              </p>
              
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">3. Contact Details</h4>
              <p>
                If you have any questions, you can contact me directly via email at <a href="mailto:menajulhoque99@gmail.com" className="underline font-mono hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">menajulhoque99@gmail.com</a>.
              </p>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;