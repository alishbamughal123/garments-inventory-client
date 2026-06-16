import {
  LogOut,
  UserRound,
} from "lucide-react";
import { useAuth } from "../../context/useAuth";
import Button from "../ui/Button";

const Navbar = () => {
  const { user, logout } =
    useAuth();
  const userName =
    user?.name || "User";
  const initials =
    userName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) =>
        part[0]?.toUpperCase()
      )
      .join("") || "U";

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
      <div className="flex h-16 items-center justify-between gap-4 px-6 sm:px-8">
        <div className="min-w-0 flex-1 pl-16 lg:pl-0">
          <div className="flex flex-col">
            <h1 className="truncate text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
              <span className="sm:hidden">Inventory</span>
              <span className="hidden sm:inline">Nordic Prowear</span>
            </h1>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/50 p-1.5 pr-4 transition-all hover:bg-slate-100/80">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-bold text-white shadow-md shadow-blue-100">
              {initials}
            </div>

            <div className="hidden sm:block">
              <p className="text-xs font-bold text-slate-900 leading-tight">
                {userName}
              </p>
            </div>

            <div className="text-slate-400 sm:hidden">
              <UserRound size={16} />
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              window.location.href = "/login";
            }}
            className="flex items-center gap-2 rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-white transition-all hover:bg-slate-800 hover:shadow-lg active:scale-95 shadow-md shadow-slate-200"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
