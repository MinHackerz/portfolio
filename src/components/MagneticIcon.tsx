import { FC, ReactNode, useRef, useState, useCallback } from "react";

interface MagneticIconProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

/**
 * Wrapper that creates a subtle magnetic pull effect on hover.
 * The child element follows the cursor with a dampened offset.
 */
const MagneticIcon: FC<MagneticIconProps> = ({
  children,
  className = "",
  strength = 0.35,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;
      setTransform({ x: deltaX, y: deltaY });
    },
    [strength]
  );

  const handleMouseLeave = useCallback(() => {
    setTransform({ x: 0, y: 0 });
  }, []);

  return (
    <div
      ref={ref}
      className={`inline-flex ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px)`,
          transition: transform.x === 0 ? "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)" : "transform 0.15s ease-out",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default MagneticIcon;
