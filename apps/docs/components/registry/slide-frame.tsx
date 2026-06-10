"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 720;

/**
 * Renders registry items on the same fixed 1280x720 logical canvas the
 * campfire shell uses, scaled down to fit the docs column. Items can rely
 * on slide-scale typography (text-8xl etc.) and still preview correctly.
 */
export function SlideFrame({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) {
        return;
      }
      setScale(entry.contentRect.width / CANVAS_WIDTH);
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="cf-slide-frame not-prose relative aspect-video w-full overflow-hidden rounded-xl border bg-(--color-background) text-(--color-foreground)"
      ref={containerRef}
    >
      <div
        className="absolute top-0 left-0 origin-top-left font-sans"
        style={{
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          transform: `scale(${scale})`,
          visibility: scale > 0 ? "visible" : "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}
