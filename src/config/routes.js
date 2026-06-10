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
  crmLegacyPipeline: "/crm/pipeline",
};
