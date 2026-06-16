import {
  FiChevronLeft,
  FiChevronDown,
  FiMenu,
  FiX,
} from "react-icons/fi";
import {
  NavLink,
  useLocation,
} from "react-router-dom";
import {
  useEffect,
  useState,
} from "react";
import logo from "../../assets/logo.png";
import { sidebarNavigation } from "../../config/navigation";
import { cn } from "../../utils/cn";

const isPathActive = (
  pathname,
  path
) =>
  pathname === path ||
  pathname.startsWith(`${path}/`);

const Sidebar = () => {
  const [open, setOpen] =
    useState(false);
  const location =
    useLocation();
  const [expandedMenus, setExpandedMenus] =
    useState({});

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow =
      open ? "hidden" : "";

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() =>
          setOpen(!open)
        }
        className="fixed left-4 top-[14px] z-[60] rounded-lg border border-slate-100 bg-white p-2 text-slate-500 shadow-md transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-95 lg:hidden"
        aria-label={
          open
            ? "Close sidebar"
            : "Open sidebar"
        }
      >
        {open ? (
          <FiX size={18} />
        ) : (
          <FiMenu size={18} />
        )}
      </button>

      {open && (
        <div
          onClick={() =>
            setOpen(false)
          }
          className="fixed inset-0 z-40 bg-slate-900/35 backdrop-blur-[1px] lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-64 max-w-[85vw] flex-col overflow-hidden bg-white transition-transform duration-500 lg:max-w-none lg:translate-x-0 shadow-[10px_0_40px_-15px_rgba(0,0,0,0.1)]",
          open
            ? "translate-x-0"
            : "-translate-x-full"
        )}
      >
        <div className="flex h-16 flex-shrink-0 items-center justify-center overflow-visible px-0 bg-white/80 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all duration-300">
          <img
            src={logo}
            alt="Nordic Prowear"
            className="w-[30%] max-w-none h-auto object-contain transition-transform duration-500 hover:scale-[1.05] drop-shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
          />
        </div>

        <nav className="sidebar-scroll flex-1 overflow-y-auto px-6 py-4">
          <ul className="space-y-2">
            {sidebarNavigation.map(
              (menu) => {
                const Icon =
                  menu.icon;
                const hasChildren =
                  menu.children
                    ?.length > 0;
                const childActive =
                  hasChildren &&
                  menu.children.some(
                    (item) =>
                      isPathActive(
                        location.pathname,
                        item.path
                      )
                  );
                const isExpanded =
                  expandedMenus[
                    menu.path
                  ] ?? childActive;

                return (
                  <li key={menu.path}>
                    {hasChildren ? (
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedMenus(
                            (prev) => ({
                              ...prev,
                              [menu.path]:
                                !(
                                  prev[
                                    menu.path
                                  ] ??
                                  childActive
                                ),
                            })
                          )
                        }
                        className={cn(
                          "group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium transition-all duration-200",
                          childActive ||
                            isExpanded
                            ? "bg-[var(--color-primary-soft)] text-[var(--color-primary-ink)]"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        )}
                      >
                        <Icon size={18} />
                        <span>{menu.name}</span>
                        {isExpanded ? (
                          <FiChevronDown
                            className="ml-auto opacity-60"
                            size={15}
                          />
                        ) : (
                          <FiChevronLeft
                            className="ml-auto rotate-[-90deg] opacity-50"
                            size={15}
                          />
                        )}
                      </button>
                    ) : (
                      <NavLink
                        to={menu.path}
                        onClick={() =>
                          setOpen(false)
                        }
                        className={({
                          isActive,
                        }) =>
                          cn(
                            "group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-200",
                            isActive
                              ? "bg-[var(--color-primary-soft)] text-[var(--color-primary-ink)]"
                              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                          )
                        }
                      >
                        <Icon size={18} />
                        <span>{menu.name}</span>
                      </NavLink>
                    )}

                    {hasChildren &&
                      isExpanded && (
                      <ul className="mt-1 space-y-1 pl-4">
                        {menu.children.map(
                          (item) => (
                            <li
                              key={item.path}
                            >
                              <NavLink
                                to={
                                  item.path
                                }
                                onClick={() =>
                                  setOpen(
                                    false
                                  )
                                }
                                className={({
                                  isActive,
                                }) =>
                                  cn(
                                    "flex items-center rounded-xl px-3 py-2.5 text-sm transition-colors",
                                    isActive
                                      ? "bg-[var(--color-primary)] text-white"
                                      : "text-slate-500 hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary-ink)]"
                                  )
                                }
                              >
                                {item.name}
                              </NavLink>
                            </li>
                          )
                        )}
                      </ul>
                    )}
                  </li>
                );
              }
            )}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
