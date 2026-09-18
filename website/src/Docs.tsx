import { Crumbs } from "./components/Crumbs.tsx";
import { TopBar } from "./components/TopBar.tsx";
import { routes } from "./routes.ts";
import { useRoute } from "./useRoute.ts";
import { useTheme } from "./useTheme.ts";

export function Docs() {
  const page = useRoute();
  const { theme, toggle } = useTheme();
  const groups = [...new Set(routes.map((item) => item.group))];
  return (
    <>
      <TopBar theme={theme} onToggle={toggle} />
      <div className="layout">
        <aside className="sidebar">
          {groups.map((group) => (
            <nav key={group}>
              <h1>{group}</h1>
              {routes
                .filter((item) => item.group === group)
                .map((item) => (
                  <a key={item.id} href={`#/${item.id}`} className={item.id === page.id ? "active" : ""}>
                    {item.label}
                  </a>
                ))}
            </nav>
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