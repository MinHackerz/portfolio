import { FC, useEffect, useRef, useState } from "react";

const AnalogClock: FC = () => {
  const [time, setTime] = useState(new Date());
  const requestRef = useRef<number>();

  useEffect(() => {
    const tick = () => {
      setTime(new Date());
      requestRef.current = requestAnimationFrame(tick);
    };
    requestRef.current = requestAnimationFrame(tick);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const ms = time.getMilliseconds();

  // Smooth continuous degree calculation
  const secondDeg = (seconds + ms / 1000) * 6;
  const minuteDeg = (minutes + seconds / 60) * 6;
  const hourDeg = (hours + minutes / 60) * 30;

  // Larger clock size (52px diameter)
  const size = 52;
  const center = size / 2; // 26px
  const hourLen = 12;
  const minuteLen = 17;
  const secondLen = 19;

  const polarToCart = (deg: number, len: number) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return {
      x: center + len * Math.cos(rad),
      y: center + len * Math.sin(rad),
    };
  };

  const hourEnd = polarToCart(hourDeg, hourLen);
  const minuteEnd = polarToCart(minuteDeg, minuteLen);
  const secondEnd = polarToCart(secondDeg, secondLen);

  const formattedTime = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const timeStr = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div 
      className="inline-flex flex-col items-center justify-center select-none"
      title={`Local Time: ${formattedTime}`}
    >
      {/* Pure Large Analog Clock SVG */}
      <div className="flex items-center justify-center">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="flex-shrink-0 overflow-visible"
          aria-label={`Current time: ${formattedTime}`}
        >

          {/* 12 radial hour tick marks */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = i * 30;
            const isMain = i % 3 === 0;
            const outerR = center - 2;
            const innerR = isMain ? center - 7 : center - 5;
            const p1 = polarToCart(angle, innerR);
            const p2 = polarToCart(angle, outerR);
            return (
              <line
                key={i}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                className={
                  isMain
                    ? "stroke-zinc-500 dark:stroke-zinc-400"
                    : "stroke-zinc-300 dark:stroke-zinc-700"
                }
                strokeWidth={isMain ? "1.2" : "0.7"}
                strokeLinecap="round"
              />
            );
          })}

          {/* Hour Hand */}
          <line
            x1={center}
            y1={center}
            x2={hourEnd.x}
            y2={hourEnd.y}
            className="stroke-zinc-900 dark:stroke-zinc-100"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Minute Hand */}
          <line
            x1={center}
            y1={center}
            x2={minuteEnd.x}
            y2={minuteEnd.y}
            className="stroke-zinc-700 dark:stroke-zinc-300"
            strokeWidth="1.25"
            strokeLinecap="round"
          />

          {/* Second Hand */}
          <line
            x1={center}
            y1={center}
            x2={secondEnd.x}
            y2={secondEnd.y}
            className="stroke-amber-600 dark:stroke-amber-400"
            strokeWidth="0.75"
            strokeLinecap="round"
          />

          {/* Center Pivot Dot */}
          <circle
            cx={center}
            cy={center}
            r="1.8"
            className="fill-zinc-900 dark:fill-zinc-100"
          />
        </svg>
      </div>

      {/* Digital Time Readout Centered Below the Clock */}
      <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 tabular-nums tracking-wider font-medium leading-none mt-1.5">
        {timeStr}
      </span>
    </div>
  );
};

export default AnalogClock;
