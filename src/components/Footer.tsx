import { FC } from "react";

const Footer: FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 h-96 pointer-events-none overflow-hidden z-10">
      {/* Main "Menajul" text spanning full width and height */}
      <div className="absolute inset-0 flex items-end justify-center pb-4">
        <div className="relative w-full text-center">
          {/* Large faded text spanning extreme left to extreme right and bottom */}
          <div 
            className="text-6xl sm:text-7xl md:text-9xl lg:text-[10rem] xl:text-[12rem] 2xl:text-[16rem] font-bold tracking-wider text-gray-400/15 dark:text-gray-500/10"
            style={{
              fontFamily: 'Poppins, sans-serif',
              textShadow: '0 0 20px rgba(156, 163, 175, 0.08)',
              filter: 'blur(0.4px)',
              background: 'linear-gradient(to bottom, rgba(156, 163, 175, 0.2) 0%, rgba(156, 163, 175, 0.1) 40%, rgba(156, 163, 175, 0.05) 70%, rgba(156, 163, 175, 0.02) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              width: '100vw',
              marginLeft: 'calc(-50vw + 50%)',
              marginRight: 'calc(-50vw + 50%)',
              lineHeight: '0.63',
              letterSpacing: '0.35em',
              whiteSpace: 'nowrap',
              overflow: 'visible',
              transform: 'scaleY(1.1) scaleX(1.05)',
            }}
          >
            MENAJUL
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 