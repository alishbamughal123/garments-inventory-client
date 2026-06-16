import { NavLink } from "react-router-dom";
import { appRoutes } from "../../config/routes";
import { cn } from "../../utils/cn";

const tabs = [
  {
    label: "Overview",
    to: appRoutes.crmReports,
  },
  {
    label: "Lead Analytics",
    to: appRoutes.crmReportsLeads,
  },
  {
    label: "Customer Analytics",
    to: appRoutes.crmReportsCustomers,
  },
  {
    label: "Revenue Analytics",
    to: appRoutes.crmReportsRevenue,
  },
];

const ReportTabs = () => (
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

export default ReportTabs;
