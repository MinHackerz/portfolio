import { useEffect, useRef, useState } from "react";

/**
 * Hook that uses IntersectionObserver to detect when an element
 * enters the viewport, triggering a one-time reveal animation.
 * Returns a ref to attach to the element and a boolean for visibility.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options?: IntersectionObserverInit
): { ref: React.RefObject<T>; isVisible: boolean } {
  const ref = useRef<T>(null!);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Respect reduced motion preference — reveal immediately
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }

    // If element is already in viewport on mount, reveal with a slight delay for animation
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight - 20 && rect.bottom > 0) {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    }

    // Otherwise, observe for scroll-into-view
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -20px 0px",
        ...options,
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

/**
 * Hook to track which section ID is currently in the viewport.
 * Used for active nav indicator.
 */
export function useActiveSection(sectionIds: string[]): string {
  const [activeId, setActiveId] = useState(sectionIds[0] || "");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const visibleSections = new Map<string, number>();

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            visibleSections.set(id, entry.intersectionRatio);
          } else {
            visibleSections.delete(id);
          }

          // Pick the section with highest visibility
          let maxRatio = 0;
          let maxId = sectionIds[0];
          visibleSections.forEach((ratio, sectionId) => {
            if (ratio > maxRatio) {
              maxRatio = ratio;
              maxId = sectionId;
            }
          });
          setActiveId(maxId);
        },
        {
          threshold: [0, 0.25, 0.5, 0.75, 1],
          rootMargin: "-10% 0px -40% 0px",
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [sectionIds]);

  return activeId;
}
