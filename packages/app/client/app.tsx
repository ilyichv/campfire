import { useEffect } from "react";
import manifest from "virtual:campfire/project";
import { slides } from "virtual:campfire/slides";
import { navigate, useRoute } from "./route.js";
import { Overview } from "./overview.js";
import { Present } from "./present.js";

export function App() {
  const route = useRoute(slides.length);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }
      const last = slides.length - 1;
      const next = Math.min(route.index + 1, last);
      const previous = Math.max(route.index - 1, 0);
      switch (event.key) {
        case "ArrowRight":
        case " ":
          navigate({ ...route, index: next });
          event.preventDefault();
          break;
        case "ArrowLeft":
          navigate({ ...route, index: previous });
          event.preventDefault();
          break;
        case "ArrowDown":
          if (route.mode === "overview") {
            navigate({ ...route, index: next });
            event.preventDefault();
          }
          break;
        case "ArrowUp":
          if (route.mode === "overview") {
            navigate({ ...route, index: previous });
            event.preventDefault();
          }
          break;
        case "f":
        case "F":
        case "Enter":
          if (route.mode === "overview") {
            navigate({ mode: "present", index: route.index });
            event.preventDefault();
          }
          break;
        case "Escape":
          if (route.mode === "present") {
            navigate({ mode: "overview", index: route.index });
            event.preventDefault();
          }
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [route]);

  if (slides.length === 0) {
    return (
      <div className="cf-empty">
        <h1>No slides yet</h1>
        <p>
          Create <code>slides/01-title.mdx</code> to get this campfire going.
        </p>
      </div>
    );
  }

  return route.mode === "present" ? (
    <Present index={route.index} />
  ) : (
    <Overview index={route.index} diagnostics={manifest.diagnostics} />
  );
}
