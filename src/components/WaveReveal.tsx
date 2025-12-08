"use client";

import { FC, ReactNode, useEffect, useState } from "react";

interface WaveRevealProps {
    children: ReactNode;
    delay?: number; // Delay in ms before this element starts animating
    className?: string;
}

export const WaveReveal: FC<WaveRevealProps> = ({
    children,
    delay = 0,
    className = ""
}) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, delay);

        return () => clearTimeout(timer);
    }, [delay]);

    return (
        <div
            className={`transition-all duration-700 ease-out ${className}`}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                filter: isVisible ? 'blur(0px)' : 'blur(8px)',
            }}
        >
            {children}
        </div>
    );
};

// Container component that handles the initial page load animation
export const WaveContainer: FC<{ children: ReactNode; className?: string }> = ({
    children,
    className = ""
}) => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Small delay to ensure smooth animation after initial render
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={className} data-loaded={isLoaded}>
            {children}
        </div>
    );
};

export default WaveReveal;
