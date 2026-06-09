import manifest from "virtual:campfire/project";
import { type ReactNode, useEffect, useRef, useState } from "react";

/**
 * Slides render on a fixed logical canvas (manifest.canvas, default 1280x720)
 * that is scaled to fit its container. Layouts can rely on absolute canvas
 * coordinates and consistent type scale in every surface: thumbnails,
 * overview preview, and present mode.
 */
export function SlideCanvas({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const { width, height } = manifest.canvas;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) {
        return;
      }
      const rect = entry.contentRect;
      setScale(Math.min(rect.width / width, rect.height / height));
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [width, height]);

  return (
    <div className="cf-canvas-container" ref={containerRef}>
      <div
        className="cf-canvas"
        style={{
          width,
          height,
          transform: `translate(-50%, -50%) scale(${scale})`,
          visibility: scale > 0 ? "visible" : "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}
