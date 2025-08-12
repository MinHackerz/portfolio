import { FC, useEffect, useState, useRef } from "react";

const BackgroundElements: FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Minimal 3D particle system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      size: number;
      color: string;
    }> = [];

    // Initialize minimal particles
    for (let i = 0; i < 15; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 1000,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        vz: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 1,
        color: `hsl(${200 + Math.random() * 40}, 60%, 70%)`
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Sort particles by depth
      particles.sort((a, b) => b.z - a.z);

      particles.forEach(particle => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.z += particle.vz;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.z < 0) particle.z = 1000;
        if (particle.z > 1000) particle.z = 0;

        // 3D projection
        const scale = 1000 / (1000 + particle.z);
        const x = particle.x * scale;
        const y = particle.y * scale;
        const size = particle.size * scale;

        // Draw particle
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        // Draw minimal connections
        particles.forEach(other => {
          const otherScale = 1000 / (1000 + other.z);
          const otherX = other.x * otherScale;
          const otherY = other.y * otherScale;
          
          const distance = Math.sqrt((x - otherX) ** 2 + (y - otherY) ** 2);
          if (distance < 150 && distance > 0) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(otherX, otherY);
            ctx.strokeStyle = `rgba(100, 150, 255, ${0.05 * (1 - distance / 150)})`;
            ctx.lineWidth = 0.3;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(render);
    };

    render();
  }, []);

  return (
    <div 
      className="fixed inset-0 -z-10 overflow-hidden transition-all duration-700"
      aria-hidden="true"
    >
      {/* Minimal 3D Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-30 dark:opacity-40"
      />

      {/* Clean gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-100/30 dark:from-black dark:via-purple-900/10 dark:to-indigo-950/20" />
      </div>

      {/* Minimal holographic grid */}
      <div className="absolute inset-0">
        <svg
          className="absolute inset-0 w-full h-full opacity-5 dark:opacity-10"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern id="minimalGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="url(#gridGradient)" strokeWidth="0.02" />
            </pattern>
            <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e40af" stopOpacity="0.3">
                <animate attributeName="stop-opacity" values="0.3;0.6;0.3" dur="6s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.2">
                <animate attributeName="stop-opacity" values="0.2;0.4;0.2" dur="6s" repeatCount="indefinite" />
              </stop>
            </linearGradient>
          </defs>
          <rect width="100" height="100" fill="url(#minimalGrid)" />
        </svg>
      </div>

      {/* Minimal neural network */}
      <div className="absolute inset-0">
        <svg
          className="absolute inset-0 w-full h-full opacity-10 dark:opacity-15"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <filter id="minimalGlow">
              <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          {[...Array(6)].map((_, i) => (
            <g key={i}>
              <circle
                cx={20 + (i * 15) % 80}
                cy={25 + (i * 12) % 75}
                r="0.3"
                fill="#3b82f6"
                filter="url(#minimalGlow)"
              >
                <animate
                  attributeName="r"
                  values="0.3;0.5;0.3"
                  dur={`${4 + i}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.4;0.8;0.4"
                  dur={`${3 + i}s`}
                  repeatCount="indefinite"
                />
              </circle>
              {i < 5 && (
                <line
                  x1={20 + (i * 15) % 80}
                  y1={25 + (i * 12) % 75}
                  x2={20 + ((i + 1) * 15) % 80}
                  y2={25 + ((i + 1) * 12) % 75}
                  stroke="#3b82f6"
                  strokeWidth="0.03"
                  opacity="0.3"
                >
                  <animate
                    attributeName="stroke-dasharray"
                    values="0,1;1,0;0,1"
                    dur={`${5 + i}s`}
                    repeatCount="indefinite"
                  />
                </line>
              )}
            </g>
          ))}
        </svg>
      </div>

      {/* Minimal geometric shapes */}
      <div className="absolute inset-0">
        <svg
          className="absolute inset-0 w-full h-full opacity-5 dark:opacity-8"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="minimalShapeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3">
                <animate attributeName="stop-color" values="#8b5cf6;#06b6d4;#8b5cf6" dur="8s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.2">
                <animate attributeName="stop-color" values="#06b6d4;#8b5cf6;#06b6d4" dur="8s" repeatCount="indefinite" />
              </stop>
            </linearGradient>
          </defs>
          <polygon
            points="25,25 35,15 45,25 35,35"
            fill="url(#minimalShapeGradient)"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 35 25;360 35 25"
              dur="25s"
              repeatCount="indefinite"
            />
          </polygon>
          <polygon
            points="55,55 65,45 75,55 65,65"
            fill="url(#minimalShapeGradient)"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="360 65 55;0 65 55"
              dur="30s"
              repeatCount="indefinite"
            />
          </polygon>
        </svg>
      </div>

      {/* Subtle parallax */}
      <div 
        className="absolute inset-0 opacity-3 dark:opacity-5"
        style={{
          transform: `translateY(${scrollY * 0.05}px)`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-100/5 to-transparent dark:from-transparent dark:via-purple-800/5 dark:to-transparent" />
      </div>
    </div>
  );
};

export default BackgroundElements; 