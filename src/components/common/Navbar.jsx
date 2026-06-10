import {
  LogOut,
  UserRound,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
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
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/75 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 shadow-sm sm:h-[4.5rem] sm:px-6 lg:px-8">
        <div className="min-w-0 pl-14 lg:pl-0">
          <h1 className="truncate text-base font-semibold text-slate-900 sm:text-xl">
            <span className="sm:hidden">
              Inventory
            </span>

            <span className="hidden sm:inline">
              Nordic Prowear
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
              {initials}
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-medium text-slate-800">
                {userName}
              </p>

              <p className="text-xs text-slate-500">
                Signed in
              </p>
            </div>

            <div className="text-slate-500 sm:hidden">
              <UserRound size={16} />
            </div>
          </div>

          <Button
            onClick={() => {
              logout();
              window.location.href =
                "/login";
            }}
            className="px-3 py-2"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">
              Logout
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
