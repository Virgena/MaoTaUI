export interface MaoEventMap {
  "mt-change": { value: string; checked?: boolean };
  "mt-toggle": { active: boolean; value?: string };
  "mt-input": { value: string; name?: string };
  "mt-copy": { text: string };
  "mt-open": Record<string, never>;
  "mt-close": Record<string, never>;
}

export type MaoEventType = keyof MaoEventMap;

/**
 * 派发类型化自定义事件。
 * @param el 事件源元素
 * @param type 事件名
 * @param detail 事件负载
 */
export function emit<K extends MaoEventType>(el: Element, type: K, detail: MaoEventMap[K]): void {
  el.dispatchEvent(new CustomEvent<MaoEventMap[K]>(type, { detail, bubbles: true, composed: true }));
}

/**
 * 监听类型化自定义事件，返回解绑函数。
 */
export function on<K extends MaoEventType>(
  target: EventTarget,
  type: K,
  handler: (event: CustomEvent<MaoEventMap[K]>) => void,
): () => void {
  const listener = (event: Event) => handler(event as CustomEvent<MaoEventMap[K]>);
  target.addEventListener(type, listener);
  return () => target.removeEventListener(type, listener);
}
