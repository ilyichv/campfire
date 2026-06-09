import { useEffect, useState } from "react";

export type Route =
  | { mode: "overview"; index: number }
  | { mode: "present"; index: number };

export function parseRoute(hash: string, slideCount: number): Route {
  const present = /^#\/present(?:\/(\d+))?$/.exec(hash);
  const clamp = (value: number) =>
    Math.min(Math.max(value, 0), Math.max(slideCount - 1, 0));
  if (present) {
    return {
      mode: "present",
      index: clamp(present[1] ? Number.parseInt(present[1], 10) - 1 : 0),
    };
  }
  const overview = /^#\/(\d+)$/.exec(hash);
  return {
    mode: "overview",
    index: clamp(overview?.[1] ? Number.parseInt(overview[1], 10) - 1 : 0),
  };
}

export function routeHash(route: Route): string {
  return route.mode === "present"
    ? `#/present/${route.index + 1}`
    : `#/${route.index + 1}`;
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
