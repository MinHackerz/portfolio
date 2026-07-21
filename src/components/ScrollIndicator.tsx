import { FC, useEffect, useState } from "react";

/**
 * Precision Gauge Dial Scroll Indicator
 * A semi-circle whose flat edge (connecting top and bottom corners) is attached
 * FLUSH against the vertical divider line. The center of the diameter lies on the line,
 * and the curved arc with fine tick marks opens towards the right content sections.
 */
const ScrollIndicator: FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let activeChatEl: HTMLElement | null = null;

    const updateProgress = () => {
      const chatEl = document.querySelector<HTMLElement>("[data-chat-scroll]");
      // If MinBOT chat scroll container is active and rendered
      if (chatEl && chatEl.offsetParent !== null) {
        const scrollTop = chatEl.scrollTop;
        const scrollHeight = chatEl.scrollHeight - chatEl.clientHeight;
        if (scrollHeight > 0) {
          setScrollProgress(Math.min(Math.max(scrollTop / scrollHeight, 0), 1));
        } else {
          setScrollProgress(0);
        }
      } else {
        // Regular page scroll
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        if (scrollHeight > 0) {
          setScrollProgress(Math.min(Math.max(scrollTop / scrollHeight, 0), 1));
        } else {
          setScrollProgress(0);
        }
      }
    };

    const attachChatListener = () => {
      const chatEl = document.querySelector<HTMLElement>("[data-chat-scroll]");
      if (chatEl && chatEl !== activeChatEl) {
        if (activeChatEl) {
          activeChatEl.removeEventListener("scroll", updateProgress);
        }
        chatEl.addEventListener("scroll", updateProgress, { passive: true });
        activeChatEl = chatEl;
      }
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    attachChatListener();

    // Check periodically for chat open state & dynamic AI message growth
    const pollInterval = setInterval(() => {
      attachChatListener();
      updateProgress();
    }, 150);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      if (activeChatEl) {
        activeChatEl.removeEventListener("scroll", updateProgress);
      }
      clearInterval(pollInterval);
    };
  }, []);

  // Needle angle from -90° (top corner) to +90° (bottom corner)
  const needleAngle = -90 + scrollProgress * 180;

  // Geometry: Radius = 34px
  const radius = 34;
  const strokeWidth = 1.5;
  const padding = 2; // Tight padding so corners touch the line cleanly
  const width = radius + padding + strokeWidth; // ~37.5px
  const height = radius * 2 + padding * 2 + strokeWidth * 2; // ~71px

  // Center pivot coordinates: cx = 0 is on the left flat edge (the vertical divider line)
  const cx = strokeWidth / 2;
  const cy = height / 2;

  // Convert polar coordinates (-90° to +90°) to SVG Cartesian
  const polarToCartesian = (angleDeg: number, r: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  };

  // Generate 60 precision tick marks (inspired by reference calibration dial)
  const ticks = [];
  const totalTicks = 60;
  for (let i = 0; i <= totalTicks; i++) {
    const angle = -90 + (i / totalTicks) * 180;
    const isMajor = i % 10 === 0; // Every 30 deg
    const isMedium = i % 5 === 0 && !isMajor; // Every 15 deg

    const tickLength = isMajor ? 7 : isMedium ? 4.5 : 2.5;
    const outerR = radius;
    const innerR = radius - tickLength;

    const p1 = polarToCartesian(angle, innerR);
    const p2 = polarToCartesian(angle, outerR);
    const isPassed = angle <= needleAngle;

    ticks.push({
      id: i,
      angle,
      isMajor,
      isMedium,
      p1,
      p2,
      isPassed,
    });
  }

  // Needle tip coordinate
  const needleTipR = radius - 3;
  const needleTip = polarToCartesian(needleAngle, needleTipR);

  // Top corner, bottom corner, and outer semi-circle arc paths
  const topPoint = polarToCartesian(-90, radius);
  const bottomPoint = polarToCartesian(90, radius);
  
  // Semicircle arc connecting top corner to bottom corner
  const outerArcD = `M ${topPoint.x},${topPoint.y} A ${radius},${radius} 0 0,1 ${bottomPoint.x},${bottomPoint.y}`;
  const arcLength = Math.PI * radius;
  const strokeDashoffset = arcLength * (1 - Math.min(1, Math.max(0, scrollProgress)));

  // Flat back line connecting top corner directly to bottom corner along the vertical line
  const flatBackLineD = `M ${topPoint.x},${topPoint.y} L ${bottomPoint.x},${bottomPoint.y}`;

  return (
    <div
      className="hidden lg:flex absolute top-1/2 right-0 translate-x-full -translate-y-1/2 z-40 items-center justify-start pointer-events-auto group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={`Scroll progress: ${Math.round(scrollProgress * 100)}%`}
      aria-hidden="true"
    >
      {/* Semi-Circular Container flush attached to the vertical line */}
      <div className="relative flex items-center justify-start rounded-r-full bg-[#FAFAF9]/95 dark:bg-[#161210]/95 backdrop-blur-sm border border-l-0 border-zinc-200/90 dark:border-zinc-800/90 shadow-sm hover:shadow-md transition-all duration-300 p-1 pl-0">
        
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="overflow-visible select-none"
        >
          {/* Vertical Flat Edge (Top corner to Bottom corner along vertical line) */}
          <path
            d={flatBackLineD}
            className="stroke-zinc-300 dark:stroke-zinc-800"
            strokeWidth="1"
          />

          {/* Base outer semi-circle track arc */}
          <path
            d={outerArcD}
            fill="none"
            className="stroke-zinc-300 dark:stroke-zinc-800"
            strokeWidth="1"
          />

          {/* Active scroll progress arc stroke using immutable path + strokeDashoffset */}
          <path
            d={outerArcD}
            fill="none"
            className="stroke-zinc-900 dark:stroke-zinc-100"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeDasharray={arcLength}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: "stroke-dashoffset 0.1s ease-out" }}
          />

          {/* Radial Tick Marks (60 fine ticks matching dial image) */}
          {ticks.map((t) => (
            <line
              key={t.id}
              x1={t.p1.x}
              y1={t.p1.y}
              x2={t.p2.x}
              y2={t.p2.y}
              className={`transition-colors duration-150 ${
                t.isPassed
                  ? t.isMajor
                    ? "stroke-zinc-900 dark:stroke-zinc-100"
                    : "stroke-zinc-700 dark:stroke-zinc-300"
                  : t.isMajor
                  ? "stroke-zinc-400 dark:stroke-zinc-600"
                  : "stroke-zinc-300 dark:stroke-zinc-750 opacity-60"
              }`}
              strokeWidth={
                t.isMajor ? "1.25" : t.isMedium ? "0.85" : "0.5"
              }
              strokeLinecap="round"
            />
          ))}

          {/* Precision Indicator Needle */}
          <line
            x1={cx}
            y1={cy}
            x2={needleTip.x}
            y2={needleTip.y}
            className="stroke-amber-600 dark:stroke-amber-400"
            strokeWidth="1.5"
            strokeLinecap="round"
            style={{ transition: "x2 0.1s ease-out, y2 0.1s ease-out" }}
          />

          {/* Center Pivot Pin on the vertical line (midpoint between top and bottom corners) */}
          <circle
            cx={cx}
            cy={cy}
            r="2.5"
            className="fill-zinc-900 dark:fill-zinc-100 stroke-[#FAFAF9] dark:stroke-[#161210]"
            strokeWidth="0.75"
          />
        </svg>

        {/* Hover Tooltip displaying Scroll % */}
        <div
          className={`absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-800 bg-[#FAFAF9] dark:bg-[#161210] shadow-xl text-center pointer-events-none transition-all duration-200 z-50 whitespace-nowrap ${
            isHovered
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-1"
          }`}
        >
          <div className="text-[9.5px] font-mono text-zinc-800 dark:text-zinc-200 font-medium tracking-wider uppercase">
            {Math.round(scrollProgress * 100)}%
          </div>
        </div>

      </div>
    </div>
  );
};

export default ScrollIndicator;
