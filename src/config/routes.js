export const appRoutes = {
  home: "/",
  login: "/login",
  dashboard: "/dashboard",
  products: "/products",
  productsAdd: "/products/add",
  categories: "/categories",
  categoriesAdd: "/categories/add",
  categoriesEdit: (id = ":id") =>
    `/categories/edit/${id}`,
  productDetails: (id = ":id") =>
    `/products/${id}`,
  productEdit: (id = ":id") =>
    `/products/edit/${id}`,
  productBarcode: (id = ":id") =>
    `/products/barcode/${id}`,
  stockIn: "/stock-in",
  stockOut: "/stock-out",
  returns: "/returns",
  returnsProcess: "/returns/process",
  returnDetails: (id = ":id") => `/returns/${id}`,
  lowStock: "/low-stock",
  transactions: "/transactions",
  sales: "/sales",
  salesCreate: "/sales/create",
  saleDetails: (id = ":id") =>
    `/sales/${id}`,
  crm: "/crm",
  crmCustomers: "/crm/customers",
  crmCustomersCreate:
    "/crm/customers/create",
  crmCustomerDetails: (id = ":id") =>
    `/crm/customers/${id}`,
  crmCustomerEdit: (id = ":id") =>
    `/crm/customers/edit/${id}`,
  crmLeads: "/crm/leads",
  crmLeadsCreate: "/crm/leads/create",
  crmLeadDetails: (id = ":id") =>
    `/crm/leads/${id}`,
  crmLeadEdit: (id = ":id") =>
    `/crm/leads/edit/${id}`,
  crmLeadPipeline:
    "/crm/leads/pipeline",
  crmTasks: "/crm/tasks",
  crmTasksCreate:
    "/crm/tasks/create",
  crmTaskDetails: (id = ":id") =>
    `/crm/tasks/${id}`,
  crmTaskEdit: (id = ":id") =>
    `/crm/tasks/edit/${id}`,
  crmTaskCalendar:
    "/crm/tasks/calendar",
  crmLegacyPipeline: "/crm/pipeline",
  crmReports: "/crm/reports",
  crmReportsLeads:
    "/crm/reports/leads",
  crmReportsCustomers:
    "/crm/reports/customers",
  crmReportsRevenue:
    "/crm/reports/revenue",
};
