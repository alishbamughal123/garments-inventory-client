import { NavLink } from "react-router-dom";
import { appRoutes } from "../../config/routes";
import { cn } from "../../utils/cn";
import { useLanguage } from "../../context/LanguageContext";

const ReportTabs = () => {
  const { t } = useLanguage();

  const tabs = [
    {
      label: t("Overview"),
      to: appRoutes.crmReports,
    },
    {
      label: t("Lead Analytics"),
      to: appRoutes.crmReportsLeads,
    },
    {
      label: t("Customer Analytics"),
      to: appRoutes.crmReportsCustomers,
    },
    {
      label: t("Revenue Analytics"),
      to: appRoutes.crmReportsRevenue,
    },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            cn(
              "rounded-full px-4 py-2 text-sm font-medium transition",
              isActive
                ? "bg-[var(--color-primary)] text-white shadow-sm"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
            )
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </div>
  );
};

export default ReportTabs;
