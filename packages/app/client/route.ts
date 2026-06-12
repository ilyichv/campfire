import { useEffect, useState } from "react";

export type Route =
  | { mode: "overview"; index: number }
  | { mode: "present"; index: number }
  | { mode: "print"; index: number };

const PRESENT_HASH_PATTERN = /^#\/present(?:\/(\d+))?$/;
const OVERVIEW_HASH_PATTERN = /^#\/(\d+)$/;

export function parseRoute(hash: string, slideCount: number): Route {
  const present = PRESENT_HASH_PATTERN.exec(hash);
  const clamp = (value: number) =>
    Math.min(Math.max(value, 0), Math.max(slideCount - 1, 0));
  if (hash === "#/print") {
    return { mode: "print", index: 0 };
  }
  if (present) {
    return {
      mode: "present",
      index: clamp(present[1] ? Number.parseInt(present[1], 10) - 1 : 0),
    };
  }
  const overview = OVERVIEW_HASH_PATTERN.exec(hash);
  return {
    mode: "overview",
    index: clamp(overview?.[1] ? Number.parseInt(overview[1], 10) - 1 : 0),
  };
}

export function routeHash(route: Route): string {
  switch (route.mode) {
    case "print":
      return "#/print";
    case "present":
      return `#/present/${route.index + 1}`;
    default:
      return `#/${route.index + 1}`;
  }
}

export function navigate(route: Route): void {
  window.location.hash = routeHash(route);
}

export function useRoute(slideCount: number): Route {
  const [route, setRoute] = useState<Route>(() =>
    parseRoute(window.location.hash, slideCount)
  );
  useEffect(() => {
    const onHashChange = () =>
      setRoute(parseRoute(window.location.hash, slideCount));
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [slideCount]);
  return route;
}
