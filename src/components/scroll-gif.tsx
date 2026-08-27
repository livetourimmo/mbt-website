"use client";

import { useEffect, useRef, useState } from "react";

export default function ScrollGif({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`h-full w-full bg-neutral-tint ${className}`}>
      {visible && (
        // eslint-disable-next-line @next/next/no-img-element -- GIFs must not go through next/image's static optimization, or the animation breaks.
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      )}
    </div>
  );
}
