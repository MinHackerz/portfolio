"use client";

import { FC, useState, useEffect } from "react";

// Pixel/dot matrix letter definitions (5x5 grid for shorter height)
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
};

// Count total active blocks across all letters
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

// Get the global index of a block within all letters
const getBlockGlobalIndex = (name: string, letterIndex: number, rowIndex: number, colIndex: number): number => {
  let index = 0;

  // Count blocks in previous letters
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

  // Count blocks in current letter up to current position
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

  // Check if a specific block should be visible based on scroll progress
  const isBlockVisible = (rowIndex: number, colIndex: number): boolean => {
    // At 0 scroll, no blocks should be visible
    if (scrollProgress === 0) return false;

    const blockIndex = getBlockGlobalIndex(name, letterIndex, rowIndex, colIndex);
    // Use (blockIndex + 1) so first block needs some scroll to appear
    const threshold = (blockIndex + 1) / totalBlocks;
    return scrollProgress >= threshold;
  };

  return (
    <div className="flex flex-col gap-[1px] sm:gap-[2px]">
      {grid.map((row, rowIndex) => {
        // Calculate opacity: faded at top (8% opacity), deeper at bottom (35% opacity)
        const baseOpacity = 0.06 + (rowIndex / (totalRows - 1)) * 0.28;

        return (
          <div
            key={rowIndex}
            className="flex gap-[1px] sm:gap-[2px]"
          >
            {row.map((cell, colIndex) => {
              const visible = cell === 1 && isBlockVisible(rowIndex, colIndex);

              return (
                <div
                  key={colIndex}
                  className="aspect-square rounded-[1px] flex-1 transition-all duration-300 ease-out"
                  style={{
                    backgroundColor: visible
                      ? `rgba(120, 120, 120, ${baseOpacity})`
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
      // Calculate scroll progress (0 to 1)
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (scrollHeight > 0) {
        const progress = Math.min(scrollTop / scrollHeight, 1);
        setScrollProgress(progress);
      }
    };

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <footer className="fixed bottom-0 left-0 right-0 pointer-events-none overflow-hidden z-10 px-2 sm:px-4 md:px-8 pb-1 sm:pb-2">
      <div className="w-full flex justify-between gap-1 sm:gap-2 md:gap-3">
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
    </footer>
  );
};

export default Footer;