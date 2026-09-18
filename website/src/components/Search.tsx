import { useEffect, useMemo, useRef, useState } from "react";
import { MaoIcon } from "../../../src/index.tsx";
import { routes } from "../routes.ts";

const HINT = /mac/i.test(navigator.userAgent) ? "⌘K" : "Ctrl K";

export function Search() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const field = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return [];
    return routes.filter((page) =>
      `${page.group} ${page.label} ${page.id}`.toLowerCase().includes(needle),
    );
  }, [query]);

  useEffect(() => {
    const jump = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      } else if (event.key === "Escape") {
        setOpen(false);
      }
    };
    addEventListener("keydown", jump);
    return () => removeEventListener("keydown", jump);
  }, []);

  useEffect(() => {
    if (!open) return;
    setActive(0);
    const node = field.current;
    node?.focus();
    node?.setSelectionRange(node.value.length, node.value.length);
  }, [open]);

  const pick = (id: string) => {
    location.hash = `#/${id}`;
    setQuery("");
    setOpen(false);
  };

  const keys = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((now) => Math.min(now + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((now) => Math.max(now - 1, 0));
    } else if (event.key === "Enter" && results[active]) {
      pick(results[active]!.id);
    }
  };

  return (
    <>
      <label className="topbar-search">
        <MaoIcon name="search" size={15} />
        <input
          type="search"
          value={query}
          placeholder="搜索组件、页面…"
          aria-label="搜索"
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
        />
        <kbd className="topbar-hint">{HINT}</kbd>
      </label>
      {open ? (
        <div className="search-overlay" onPointerDown={() => setOpen(false)}>
          <div className="search-panel" onPointerDown={(event) => event.stopPropagation()}>
            <div className="search-head">
              <MaoIcon name="search" size={18} />
              <input
                ref={field}
                className="search-field"
                value={query}
                placeholder="搜索组件、页面…"
                aria-label="搜索组件与页面"
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={keys}
              />
              <button className="search-close" type="button" aria-label="关闭搜索" onClick={() => setOpen(false)}>
                <MaoIcon name="close" size={16} />
              </button>
            </div>
            <div className="search-list">
              {results.length ? (
                results.map((page, index) => (
                  <button
                    key={page.id}
                    type="button"
                    className={`search-item${index === active ? " is-active" : ""}`}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => pick(page.id)}
                  >
                    <span>{page.label}</span>
                    <span className="search-where">{page.group}</span>
                  </button>
                ))
              ) : (
                <p className="search-empty">输入关键字搜索组件与页面</p>
              )}
            </div>
            <div className="search-foot">
              <span>
                <kbd>↑↓</kbd> 选择
              </span>
              <span>
                <kbd>↵</kbd> 打开
              </span>
              <span>
                <kbd>esc</kbd> 关闭
              </span>
              <span className="search-count">{results.length} 条结果</span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
