import { FC, useState, useEffect } from "react";

// Pixel/dot matrix letter definitions (5x5 grid)
const pixelLetters: Record<string, number[][]> = {
  M: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  E: [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  N: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 0, 0, 1],
  ],
  A: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  J: [
    [0, 0, 0, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  U: [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  L: [
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  H: [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  O: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  Q: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 1, 0],
    [0, 1, 1, 0, 1],
  ],
  ' ': [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],
};

const countTotalBlocks = (name: string): number => {
  let total = 0;
  for (const letter of name) {
    const grid = pixelLetters[letter];
    if (grid) {
      for (const row of grid) {
        for (const cell of row) {
          if (cell === 1) total++;
        }
      }
    }
  }
  return total;
};

const getBlockGlobalIndex = (name: string, letterIndex: number, rowIndex: number, colIndex: number): number => {
  let index = 0;
  for (let l = 0; l < letterIndex; l++) {
    const grid = pixelLetters[name[l]];
    if (grid) {
      for (const row of grid) {
        for (const cell of row) {
          if (cell === 1) index++;
        }
      }
    }
  }
  const currentGrid = pixelLetters[name[letterIndex]];
  if (currentGrid) {
    for (let r = 0; r <= rowIndex; r++) {
      const endCol = r === rowIndex ? colIndex : currentGrid[r].length;
      for (let c = 0; c < endCol; c++) {
        if (currentGrid[r][c] === 1) index++;
      }
    }
  }
  return index;
};

interface PixelLetterProps {
  letter: string;
  letterIndex: number;
  scrollProgress: number;
  totalBlocks: number;
  name: string;
}

const PixelLetter: FC<PixelLetterProps> = ({ letter, letterIndex, scrollProgress, totalBlocks, name }) => {
  const grid = pixelLetters[letter] || [];

  const isBlockVisible = (rowIndex: number, colIndex: number): boolean => {
    if (scrollProgress === 0) return false;
    const blockIndex = getBlockGlobalIndex(name, letterIndex, rowIndex, colIndex);
    const threshold = (blockIndex + 1) / totalBlocks;
    return scrollProgress >= threshold;
  };

  return (
    <div className="flex flex-col gap-[1px] sm:gap-[2px]">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-[1px] sm:gap-[2px]">
          {row.map((cell, colIndex) => {
            const visible = cell === 1 && isBlockVisible(rowIndex, colIndex);

            return (
              <div
                key={colIndex}
                className={`aspect-square rounded-[0.5px] sm:rounded-[1px] flex-1 transition-all duration-300 ease-out ${
                  visible 
                    ? `scale-100 opacity-100 pixel-row-${rowIndex}` 
                    : "scale-0 opacity-0 bg-transparent"
                }`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

const Footer: FC = () => {
  const name = "MENAJUL";
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const totalBlocks = countTotalBlocks(name);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (scrollHeight > 0) {
        const progress = Math.min(scrollTop / scrollHeight, 1);
        setScrollProgress(progress);
      } else {
        setScrollProgress(1);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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

  return (
    <footer className="w-full px-6 md:px-12 lg:px-16 pt-16 pb-8 flex flex-col items-center gap-8 border-t border-zinc-100 dark:border-zinc-900 mt-20 select-none">
      {/* Full-width Name Grid */}
      <div className="w-full flex justify-between gap-1 sm:gap-2 md:gap-3 max-w-full">
        {name.split('').map((letter, index) => (
          <div key={index} className="flex-1">
            <PixelLetter
              letter={letter}
              letterIndex={index}
              scrollProgress={scrollProgress}
              totalBlocks={totalBlocks}
              name={name}
            />
          </div>
        ))}
      </div>
      
      {/* Copyright & Freshness Info */}
      <div className="flex flex-col items-center gap-1.5 text-center">
        <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-550 uppercase tracking-widest">
          Menajul Hoque &copy; {new Date().getFullYear()}
        </span>
        <span className="text-[8px] font-mono text-zinc-400/60 dark:text-zinc-600 uppercase tracking-widest">
          Published: Jan 2025 &middot; Last Updated: July 14, 2026
        </span>
        
        {/* Privacy Policy Trigger Button */}
        <button 
          onClick={() => setIsPrivacyOpen(true)}
          className="text-[9px] font-mono text-zinc-450 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 uppercase tracking-widest mt-2 hover:underline transition-colors duration-200 cursor-pointer"
        >
          Privacy Policy
        </button>
      </div>

      {/* Accessible Privacy Policy Modal */}
      {isPrivacyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div 
            className="w-full max-w-lg p-6 md:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-left shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
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
            
            <h3 id="privacy-title" className="text-xl font-normal font-serif italic tracking-tight text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-900 pb-3 mb-4">
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