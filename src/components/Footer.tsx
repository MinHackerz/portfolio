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
  const totalRows = grid.length;

  const isBlockVisible = (rowIndex: number, colIndex: number): boolean => {
    if (scrollProgress === 0) return false;
    const blockIndex = getBlockGlobalIndex(name, letterIndex, rowIndex, colIndex);
    const threshold = (blockIndex + 1) / totalBlocks;
    return scrollProgress >= threshold;
  };

  return (
    <div className="flex flex-col gap-[1px] sm:gap-[2px]">
      {grid.map((row, rowIndex) => {
        const baseOpacity = 0.2 + (rowIndex / (totalRows - 1)) * 0.5;

        return (
          <div key={rowIndex} className="flex gap-[1px] sm:gap-[2px]">
            {row.map((cell, colIndex) => {
              const visible = cell === 1 && isBlockVisible(rowIndex, colIndex);

              return (
                <div
                  key={colIndex}
                  className="aspect-square rounded-[0.5px] sm:rounded-[1px] flex-1 transition-all duration-300 ease-out"
                  style={{
                    backgroundColor: visible
                      ? `rgba(161, 161, 170, ${baseOpacity})`
                      : 'transparent',
                    transform: visible ? 'scale(1)' : 'scale(0)',
                    opacity: visible ? 1 : 0,
                  }}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

const Footer: FC = () => {
  const name = "MENAJUL";
  const [scrollProgress, setScrollProgress] = useState(0);
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
      </div>
    </footer>
  );
};

export default Footer;