import { FC } from "react";

const BackgroundElements: FC = () => {
  return (
    <div 
      className="fixed inset-0 -z-10 overflow-hidden transition-colors duration-500"
      aria-hidden="true"
    >
      {/* Clean solid background — milky white (light) / warm dark (dark) */}
      <div className="absolute inset-0 bg-[#FAFAF9] dark:bg-[#161210]" />

      {/* Subtle warm noise texture overlay for depth */}
      <div 
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />
    </div>
  );
};

export default BackgroundElements;