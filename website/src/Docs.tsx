import { useEffect, useState } from "react";
import { Crumbs } from "./components/Crumbs.tsx";
import { TopBar } from "./components/TopBar.tsx";
import { routes } from "./routes.ts";
import { useRoute } from "./useRoute.ts";
import { useTheme } from "./useTheme.ts";

export function Docs() {
  const page = useRoute();
  const { theme, toggle } = useTheme();
  const groups = [...new Set(routes.map((item) => item.group))];
  const [openGroups, setOpenGroups] = useState(() => new Set([page.group]));

  useEffect(() => {
    setOpenGroups((current) => (current.has(page.group) ? current : new Set(current).add(page.group)));
  }, [page.id, page.group]);

  return (
    <>
      <TopBar theme={theme} onToggle={toggle} />
      <div className="layout">
        <aside className="sidebar" aria-label="文档导航">
          {groups.map((group) => (
            <details
              key={group}
              className="sidebar-group"
              open={openGroups.has(group)}
              onToggle={(event) => {
                const open = event.currentTarget.open;
                setOpenGroups((current) => {
                  if (current.has(group) === open) return current;
                  const next = new Set(current);
                  if (open) next.add(group);
                  else next.delete(group);
                  return next;
                });
              }}
            >
              <summary className={group === page.group ? "active" : ""}>{group}</summary>
              <div className="sidebar-links">
                {routes
                  .filter((item) => item.group === group)
                  .map((item) => (
                    <a key={item.id} href={`#/${item.id}`} className={item.id === page.id ? "active" : ""}>
                      {item.label}
                    </a>
                  ))}
              </div>
            </details>
          ))}
        </aside>
        <main className="content" key={page.id}>
          <Crumbs group={page.group} label={page.label} />
          <page.render />
        </main>
      </div>
    </>
  );
}
