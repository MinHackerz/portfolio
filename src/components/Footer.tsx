import { FC } from "react";

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

interface PixelLetterProps {
  letter: string;
}

const PixelLetter: FC<PixelLetterProps> = ({ letter }) => {
  const grid = pixelLetters[letter] || [];
  const totalRows = grid.length;

  return (
    <div className="flex flex-col gap-[1px] sm:gap-[2px]">
      {grid.map((row, rowIndex) => {
        // Calculate opacity: faded at top (8% opacity), deeper at bottom (35% opacity)
        const opacity = 0.06 + (rowIndex / (totalRows - 1)) * 0.28;

        return (
          <div
            key={rowIndex}
            className="flex gap-[1px] sm:gap-[2px]"
          >
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className="aspect-square rounded-[1px] flex-1"
                style={{
                  backgroundColor: cell ? `rgba(120, 120, 120, ${opacity})` : 'transparent',
                }}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
};

const Footer: FC = () => {
  const name = "MENAJUL";

  return (
    <footer className="fixed bottom-0 left-0 right-0 pointer-events-none overflow-hidden z-10 px-2 sm:px-4 md:px-8 pb-1 sm:pb-2">
      <div className="w-full flex justify-between gap-1 sm:gap-2 md:gap-3">
        {name.split('').map((letter, index) => (
          <div key={index} className="flex-1">
            <PixelLetter letter={letter} />
          </div>
        ))}
      </div>
    </footer>
  );
};

export default Footer;