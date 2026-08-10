import { LogOut, UserRound, Globe } from "lucide-react";
import { useAuth } from "../../context/useAuth";
import { useLanguage } from "../../context/LanguageContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { lang, setLang, t } = useLanguage();

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
        <div className="flex items-center pl-12 lg:pl-0">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest hidden sm:inline">
            Nordic Prowear ERP
          </span>
        </div>

        {/* Right Section: Language, Profile, Logout */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* LANGUAGE SELECTOR IN APP HEADER */}
          <div className="flex items-center gap-1.5 bg-slate-100/80 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:border-blue-500 transition">
            <Globe size={15} className="text-blue-600" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer"
            >
              <option value="en">🇺🇸 EN</option>
              <option value="no">🇳🇴 NO</option>
            </select>
          </div>

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
                {user?.role || "User"}
              </p>
            </div>

            <div className="text-slate-400 lg:hidden">
              <UserRound size={16} />
            </div>
          </div>

          <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden sm:block" />

          {/* Logout Button */}
          <button
            onClick={() => {
              logout();
              window.location.href = "/login";
            }}
            className="group flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition-all hover:bg-slate-50 hover:text-red-600 hover:border-red-100 active:scale-95 shadow-sm"
          >
            <LogOut size={16} className="transition-colors group-hover:text-red-600" />
            <span className="hidden md:inline">{t("logout")}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
