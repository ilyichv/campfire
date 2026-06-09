import type { Diagnostic } from "@campfire/core";
import manifest from "virtual:campfire/project";
import { slides } from "virtual:campfire/slides";
import { navigate } from "./route.js";
import { SlideCanvas } from "./slide-canvas.js";
import { SlideView } from "./slide-view.js";

function DiagnosticsPanel({ diagnostics }: { diagnostics: Diagnostic[] }) {
  if (diagnostics.length === 0) {
    return null;
  }
  return (
    <section className="cf-diagnostics">
      {diagnostics.map((diagnostic, index) => (
        <div
          className={`cf-diagnostic cf-diagnostic-${diagnostic.level}`}
          key={`${diagnostic.code}-${index}`}
        >
          <span className="cf-diagnostic-level">{diagnostic.level}</span>
          <span className="cf-diagnostic-code">{diagnostic.code}</span>
          <span>
            {diagnostic.message}
            {diagnostic.file ? ` (${diagnostic.file})` : ""}
            {diagnostic.suggestion ? ` — ${diagnostic.suggestion}` : ""}
          </span>
        </div>
      ))}
    </section>
  );
}

export function Overview({
  index,
  diagnostics,
}: {
  index: number;
  diagnostics: Diagnostic[];
}) {
  const active = slides[index];

  return (
    <div className="cf-overview">
      <aside className="cf-sidebar">
        <header className="cf-sidebar-header">
          <span className="cf-mark">🔥</span>
          <span className="cf-title">{manifest.title ?? "Campfire"}</span>
        </header>
        <nav className="cf-slide-list">
          {slides.map((slide, slideIndex) => (
            <button
              className={`cf-slide-item${slideIndex === index ? " cf-active" : ""}`}
              key={slide.id}
              onClick={() => navigate({ mode: "overview", index: slideIndex })}
              type="button"
            >
              <span className="cf-slide-number">
                {String(slide.number).padStart(2, "0")}
              </span>
              <span className="cf-slide-title">{slide.title ?? slide.slug}</span>
            </button>
          ))}
        </nav>
        <footer className="cf-sidebar-footer">
          <kbd>↑↓</kbd> navigate · <kbd>F</kbd> present
        </footer>
      </aside>
      <main className="cf-preview">
        <div className="cf-preview-stage">
          {active ? <SlideCanvas><SlideView slide={active} /></SlideCanvas> : null}
        </div>
        {active?.notes ? (
          <section className="cf-notes">
            <h3>Speaker notes</h3>
            <p>{active.notes}</p>
          </section>
        ) : null}
        <DiagnosticsPanel diagnostics={diagnostics} />
      </main>
    </div>
  );
}
