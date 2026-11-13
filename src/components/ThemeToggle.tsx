import { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';

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

  const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
    const newTheme = !isDark;
    const root = document.documentElement;

    if (
      !document.startViewTransition ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      applyTheme(newTheme);
      return;
    }

    // Circular reveal that grows out of the toggle button
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // Freeze CSS colour transitions so each snapshot is a clean, finished frame
    root.classList.add('theme-switching');

    const transition = document.startViewTransition(() => {
      flushSync(() => applyTheme(newTheme));
    });

    transition.ready.then(() => {
      root.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${radius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 650,
          easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });

    transition.finished.finally(() => {
      root.classList.remove('theme-switching');
    });
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