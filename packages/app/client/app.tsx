import manifest from "virtual:campfire/project";
import { slides } from "virtual:campfire/slides";
import { useEffect } from "react";
import { Overview } from "./overview.js";
import { Present } from "./present.js";
import { Print } from "./print.js";
import { navigate, type Route, useRoute } from "./route.js";

function routeForKey(
  key: string,
  route: Route,
  lastIndex: number
): Route | undefined {
  if (route.mode === "print") {
    return;
  }
  const next = { ...route, index: Math.min(route.index + 1, lastIndex) };
  const previous = { ...route, index: Math.max(route.index - 1, 0) };
  const inOverview = route.mode === "overview";
  switch (key) {
    case "ArrowRight":
    case " ":
      return next;
    case "ArrowLeft":
      return previous;
    case "ArrowDown":
      return inOverview ? next : undefined;
    case "ArrowUp":
      return inOverview ? previous : undefined;
    case "f":
    case "F":
    case "Enter":
      return inOverview ? { mode: "present", index: route.index } : undefined;
    case "Escape":
      return inOverview ? undefined : { mode: "overview", index: route.index };
    default:
      return;
  }
}

export function App() {
  const route = useRoute(slides.length);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }
      const target = routeForKey(event.key, route, slides.length - 1);
      if (target) {
        navigate(target);
        event.preventDefault();
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

  switch (route.mode) {
    case "print":
      return <Print />;
    case "present":
      return <Present index={route.index} />;
    default:
      return (
        <Overview diagnostics={manifest.diagnostics} index={route.index} />
      );
  }
}
