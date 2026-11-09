import { useEffect, useRef } from "react";

type Handler = (event: CustomEvent<Record<string, unknown>>) => void;

/**
 * 给宿主元素挂 mt-* 事件监听。
 * React 19 不会自动把自定义事件映射成 onXxx，所以用 ref + addEventListener。
 */
export function useMaoEvents<E extends HTMLElement = HTMLElement>(handlers: Record<string, Handler>) {
  const ref = useRef<E>(null);
  const latest = useRef(handlers);
  latest.current = handlers;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const bound = Object.entries(latest.current).map(([type, handler]) => {
      const listener = (event: Event) => handler(event as CustomEvent<Record<string, unknown>>);
      node.addEventListener(type, listener);
      return [type, listener] as const;
    });
    return () => {
      for (const [type, listener] of bound) node.removeEventListener(type, listener);
    };
  }, []);

  return ref;
}
