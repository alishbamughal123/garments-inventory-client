import {
  LogOut,
  UserRound,
  Bell,
} from "lucide-react";
import { useAuth } from "../../context/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();
  const userName = user?.name || "User";
  const initials =
    userName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U";

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-8">
        {/* Left Section: Spacer for mobile toggle */}
        <div className="flex items-center pl-12 lg:pl-0">
          <div className="hidden lg:block">
            {/* Optional: Breadcrumbs or Page Title could go here */}
          </div>
        </div>

        {/* Right Section: Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notifications - Hidden for now or just visual */}
          <button className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors">
            <Bell size={18} />
          </button>

          {/* Profile Card */}
          <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-1.5 pr-3 transition-all hover:bg-slate-100/80">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-[13px] font-bold text-white shadow-sm">
              {initials}
            </div>

            <div className="hidden lg:block">
              <p className="text-xs font-bold text-slate-900 leading-tight">
                {userName}
              </p>
              <p className="text-[10px] font-medium text-slate-500 leading-tight">
                {user?.role || "Administrator"}
              </p>
            </div>

            <div className="text-slate-400 lg:hidden">
              <UserRound size={16} />
            </div>
          </div>

          <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden sm:block"></div>

          {/* Logout Button */}
          <button
            onClick={() => {
              logout();
              window.location.href = "/login";
            }}
            className="group flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition-all hover:bg-slate-50 hover:text-red-600 hover:border-red-100 active:scale-95 shadow-sm"
          >
            <LogOut size={16} className="transition-colors group-hover:text-red-600" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
