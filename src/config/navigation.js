import {
  FiAlertTriangle,
  FiArrowDownCircle,
  FiArrowUpCircle,
  FiBox,
  FiFileText,
  FiGrid,
  FiRepeat,
  FiShoppingCart,
  FiUsers,
} from "react-icons/fi";
import {
  LayoutGrid,
  Target,
  Users,
} from "lucide-react";
import { appRoutes } from "./routes";

export const sidebarNavigation = [
  {
    name: "Dashboard",
    path: appRoutes.dashboard,
    icon: FiGrid,
  },
  {
    name: "Articles",
    path: appRoutes.products,
    icon: FiBox,
  },
  {
    name: "Stock In",
    path: appRoutes.stockIn,
    icon: FiArrowDownCircle,
  },
  {
    name: "Stock Out",
    path: appRoutes.stockOut,
    icon: FiArrowUpCircle,
  },
  {
    name: "Transactions",
    path: appRoutes.transactions,
    icon: FiRepeat,
  },
  {
    name: "CRM",
    path: appRoutes.crmCustomers,
    icon: FiUsers,
    children: [
      {
        name: "Customers",
        path: appRoutes.crmCustomers,
      },
      {
        name: "Leads",
        path: appRoutes.crmLeads,
      },
      {
        name: "Pipeline",
        path: appRoutes.crmLeadPipeline,
      },
    ],
  },
  {
    name: "Returns",
    path: "/returns",
    icon: FiRepeat,
  },
  {
    name: "Low Stock",
    path: "/low-stock",
    icon: FiAlertTriangle,
  },
  {
    name: "Sales",
    path: appRoutes.sales,
    icon: FiShoppingCart,
  },
  {
    name: "Create Sale",
    path: appRoutes.salesCreate,
    icon: FiFileText,
  },
  {
    name: "Categories",
    path: appRoutes.categories,
    icon: FiGrid,
  },
];

export const crmPrimaryNavigation = [
  {
    name: "Customers",
    to: appRoutes.crmCustomers,
    icon: Users,
    matchPaths: [
      appRoutes.crmCustomers,
      "/crm/customers/",
    ],
  },
  {
    name: "Leads",
    to: appRoutes.crmLeads,
    icon: Target,
    matchPaths: [
      appRoutes.crmLeads,
      appRoutes.crmLeadPipeline,
      appRoutes.crmLegacyPipeline,
      "/crm/leads/",
    ],
  },
];

export const crmLeadNavigation = [
  {
    name: "All Leads",
    to: appRoutes.crmLeads,
    icon: Target,
  },
  {
    name: "Pipeline",
    to: appRoutes.crmLeadPipeline,
    icon: LayoutGrid,
  },
];
