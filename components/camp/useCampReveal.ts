"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

export const useCampReveal = (threshold = 0.12): {
  ref: RefObject<HTMLDivElement | null>;
  inView: boolean;
} => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
};
