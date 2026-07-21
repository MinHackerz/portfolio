import { useState, useEffect } from 'react';

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const applyTheme = (dark: boolean) => {
    setIsDark(dark);
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDark;

    // Use View Transitions API with Vibrating Particle Shower Sweep if supported
    if (
      document.startViewTransition &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      // Create a container for vibrating energy particles
      const particleContainer = document.createElement('div');
      particleContainer.className = 'fixed inset-0 z-[10000] pointer-events-none overflow-hidden';
      
      const numParticles = 36;
      const particles: HTMLDivElement[] = [];

      for (let i = 0; i < numParticles; i++) {
        const p = document.createElement('div');
        const size = Math.random() * 2.5 + 1.5; // 1.5px to 4px
        const leftPercent = Math.random() * 100;
        const glowColor = newTheme
          ? 'rgba(245, 158, 11, 0.95)'
          : 'rgba(255, 255, 255, 0.95)';
        const shadowColor = newTheme
          ? 'rgba(245, 158, 11, 0.85)'
          : 'rgba(255, 255, 255, 0.85)';

        p.style.position = 'absolute';
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        p.style.borderRadius = '50%';
        p.style.left = `${leftPercent}%`;
        p.style.top = '0%';
        p.style.backgroundColor = glowColor;
        p.style.boxShadow = `0 0 ${size * 3}px ${shadowColor}`;
        p.style.opacity = '0';

        particleContainer.appendChild(p);
        particles.push(p);
      }

      document.body.appendChild(particleContainer);

      const transition = document.startViewTransition(() => {
        applyTheme(newTheme);
      });

      transition.ready.then(() => {
        const duration = 900;
        const easing = 'cubic-bezier(0.25, 1, 0.5, 1)';

        // Animate new layer top-to-bottom reveal
        document.documentElement.animate(
          {
            clipPath: [
              'inset(0 0 100% 0)',
              'inset(0 0 0% 0)',
            ],
          },
          {
            duration,
            easing,
            pseudoElement: '::view-transition-new(root)',
          }
        );

        // Animate each particle traveling top-to-bottom with horizontal vibration jitter
        particles.forEach((p) => {
          const jitterOffset = (Math.random() - 0.5) * 28; // Vibrating jitter range (-14px to +14px)
          const delay = Math.random() * 70; // Micro staggered delay

          p.animate(
            [
              { top: '0%', opacity: 0, transform: 'translateX(0px)' },
              { top: '2%', opacity: 1, transform: `translateX(${jitterOffset}px)`, offset: 0.05 },
              { top: '33%', opacity: 1, transform: `translateX(${-jitterOffset}px)`, offset: 0.35 },
              { top: '66%', opacity: 1, transform: `translateX(${jitterOffset / 1.5}px)`, offset: 0.68 },
              { top: '96%', opacity: 1, transform: `translateX(${-jitterOffset / 2}px)`, offset: 0.95 },
              { top: '100%', opacity: 0, transform: 'translateX(0px)' },
            ],
            {
              duration: duration - delay,
              delay,
              easing,
              fill: 'forwards',
            }
          );
        });

        setTimeout(() => {
          if (particleContainer.parentNode) {
            particleContainer.parentNode.removeChild(particleContainer);
          }
        }, duration + 150);
      });
    } else {
      applyTheme(newTheme);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-200 cursor-pointer p-1 rounded flex items-center justify-center select-none"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        /* Extra Minimal Sun Icon for Dark Mode (Switch to Light) */
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          className="w-3.5 h-3.5 transition-transform duration-300 hover:rotate-45"
        >
          <circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="1" />
          <line x1="7" y1="1" x2="7" y2="2.2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          <line x1="7" y1="11.8" x2="7" y2="13" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          <line x1="1" y1="7" x2="2.2" y2="7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          <line x1="11.8" y1="7" x2="13" y2="7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        </svg>
      ) : (
        /* Extra Minimal Crescent Moon Icon for Light Mode (Switch to Dark) */
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          className="w-3.5 h-3.5 transition-transform duration-300 hover:-rotate-12"
        >
          <path
            d="M11.5 7.5A4.5 4.5 0 1 1 6.5 2.5 3.5 3.5 0 0 0 11.5 7.5Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
};