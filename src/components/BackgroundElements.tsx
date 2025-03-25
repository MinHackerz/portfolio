import { FC, useEffect, useRef } from "react";

const BackgroundElements: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simple static background elements for stability
    const container = containerRef.current;
    if (!container) return;

    // Clear any existing elements first
    container.innerHTML = '';

    // Create particles with simple styling
    for (let i = 1; i <= 6; i++) {
      const particle = document.createElement("div");
      particle.className = `particle particle-${i}`;
      particle.style.position = "absolute";
      particle.style.borderRadius = "50%"; 
      particle.style.opacity = "0.8";
      
      // Randomize positions
      particle.style.left = `${Math.random() * 90}%`;
      particle.style.top = `${Math.random() * 80}%`;
      
      container.appendChild(particle);
    }

    // Create shapes
    for (let i = 1; i <= 3; i++) {
      const shape = document.createElement("div");
      shape.className = `shape shape-${i}`;
      shape.style.position = "absolute";
      shape.style.opacity = "0.8";
      
      // Randomize positions
      shape.style.left = `${Math.random() * 90}%`;
      shape.style.top = `${Math.random() * 80}%`;
      
      container.appendChild(shape);
    }

    return () => {
      // Basic cleanup
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="background-elements"
      aria-hidden="true"
    />
  );
};

export default BackgroundElements; 