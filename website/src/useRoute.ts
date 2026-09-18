import { useEffect, useState } from "react";
import { routes } from "./routes.ts";

export function useRoute() {
  const [hash, setHash] = useState(() => location.hash.slice(1));
  useEffect(() => {
    const sync = () => setHash(location.hash.slice(1));
    addEventListener("hashchange", sync);
    return () => removeEventListener("hashchange", sync);
  }, []);
  const id = hash.replace(/^\//, "");
  return routes.find((page) => page.id === id) ?? routes[0];
}