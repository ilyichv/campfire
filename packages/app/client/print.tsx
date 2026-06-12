import manifest from "virtual:campfire/project";
import { slides } from "virtual:campfire/slides";
import { useEffect } from "react";
import { SlideView } from "./slide-view.js";

/**
 * Every slide at exact canvas size, one per printed page. Serves browser
 * printing (Cmd+P) and `camp export`, which waits for data-cf-ready on
 * <html> before calling page.pdf().
 */
export function Print() {
  const { width, height } = manifest.canvas;

  useEffect(() => {
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) {
        document.documentElement.dataset.cfReady = "true";
      }
    });
    return () => {
      cancelled = true;
      delete document.documentElement.dataset.cfReady;
    };
  }, []);

  return (
    <div className="cf-print">
      <style>{`@page { size: ${width}px ${height}px; margin: 0; }`}</style>
      {slides.map((slide) => (
        <div className="cf-print-page" key={slide.id} style={{ width, height }}>
          <SlideView slide={slide} />
        </div>
      ))}
    </div>
  );
}
