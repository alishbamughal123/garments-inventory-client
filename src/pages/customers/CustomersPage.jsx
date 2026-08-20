import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Pencil, Plus, Search, Trash2, FileSpreadsheet } from "lucide-react";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import StatusBadge from "../../components/ui/StatusBadge";
import SurfaceCard from "../../components/ui/SurfaceCard";
import DeleteModal from "../../components/common/DeleteModal";
import Pagination from "../../components/common/Pagination";
import { appRoutes } from "../../config/routes";
import toast from "react-hot-toast";
import Loader from "../../components/ui/Loader";
import { deleteCustomer, getCustomers } from "../../services/customer.service";
import { useLanguage } from "../../context/LanguageContext";
import * as XLSX from "xlsx";

const CustomersPage = () => {
  const { t, lang, isNo } = useLanguage();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [customerType, setCustomerType] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [paginationMeta, setPaginationMeta] = useState({ total: 0, totalPages: 1 });
  const [exporting, setExporting] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  async function fetchCustomers(pageToFetch = page, pageSizeToFetch = pageSize, currentSearch = search) {
    try {
      setLoading(true);
      const response = await getCustomers({
        page: pageToFetch,
        limit: pageSizeToFetch,
        search: currentSearch.trim(),
        customerType: customerType || undefined,
        status: status || undefined,
      });

      const items = Array.isArray(response.data) ? response.data : response.data?.customers || [];
      setCustomers(items);

      if (response.pagination) {
        setPaginationMeta(response.pagination);
      } else {
        setPaginationMeta({
          total: items.length,
          page: pageToFetch,
          limit: pageSizeToFetch,
          totalPages: Math.max(1, Math.ceil(items.length / pageSizeToFetch)),
        });
      }
    } catch {
      toast.error(lang === "no" ? "Kunne ikke laste kunder" : "Failed to load customers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchCustomers(page, pageSize, search);
    }, 350);

    return () => clearTimeout(timeout);
  }, [page, pageSize, search, customerType, status]);

  const openDeleteModal = (customer) => {
    setSelectedCustomer(customer);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedCustomer) return;
    try {
      await deleteCustomer(selectedCustomer.id);
      toast.success(lang === "no" ? "Kunde slettet" : "Customer deleted");
      fetchCustomers(page, pageSize, search);
      setDeleteModalOpen(false);
      setSelectedCustomer(null);
    } catch {
      toast.error(lang === "no" ? "Sletting mislyktes" : "Delete failed");
    }
  };

  const exportToExcel = async () => {
    if (paginationMeta.total === 0) {
      toast.error(lang === "no" ? "Ingen data å eksportere" : "No customer data to export");
      return;
    }

    try {
      setExporting(true);
      toast.loading(isNo ? "Henter full kundedatabase og eksporterer..." : "Fetching full customer database and exporting...", { id: "cust-excel" });

      const response = await getCustomers({
        all: "true",
        search: search.trim(),
        customerType: customerType || undefined,
        status: status || undefined,
      });

      const allCustomers = Array.isArray(response.data) ? response.data : response.data?.customers || customers;

      const data = allCustomers.map((c) => ({
        "Customer Code": c.customerCode || "N/A",
        "Full Name": c.fullName,
        "Company Name": c.companyName || "N/A",
        "Phone": c.phoneNumber,
        "Email": c.email || "N/A",
        "VAT Number": c.vatNumber || "N/A",
        "Type": c.customerType,
        "Status": c.status,
        "Total Orders": c.totalOrders,
        "Total Spent (NOK)": c.totalSpent,
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");
      XLSX.writeFile(workbook, `Nordic_Prowear_Customers_${new Date().toISOString().slice(0, 10)}.xlsx`);
      toast.success(lang === "no" ? `Kundedatabase eksportert til Excel (${allCustomers.length} kunder)` : `Customer directory exported to Excel (${allCustomers.length} customers)`, { id: "cust-excel" });
    } catch (err) {
      console.error(err);
      toast.error(lang === "no" ? "Eksport mislyktes" : "Export failed", { id: "cust-excel" });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("customerRegister")}
        action={
          <div className="flex items-center gap-3">
            <button
              onClick={exportToExcel}
              disabled={exporting || paginationMeta.total === 0}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 text-xs font-semibold shadow-sm transition disabled:opacity-50"
            >
              <FileSpreadsheet size={16} />
              <span>{t("exportExcel")}</span>
            </button>
            <Button
              as={Link}
              to={appRoutes.crmCustomerCreate}
              icon={<Plus size={16} />}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm text-xs font-semibold"
            >
              {t("registerCustomer")}
            </Button>
          </div>
        }
      />

      <SurfaceCard className="p-4">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="relative md:col-span-2">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={t("searchCustomersPlaceholder")}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>

          <select
            value={customerType}
            onChange={(e) => {
              setCustomerType(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3 text-xs outline-none focus:border-blue-500 focus:bg-white"
          >
            <option value="">{t("allCustomerTypes")}</option>
            <option value="INDIVIDUAL">{t("individual")}</option>
            <option value="BUSINESS">{t("business")}</option>
          </select>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3 text-xs outline-none focus:border-blue-500 focus:bg-white"
          >
            <option value="">{t("allStatus")}</option>
            <option value="ACTIVE">{t("active")}</option>
            <option value="INACTIVE">{t("inactive")}</option>
            <option value="SUSPENDED">{t("suspended")}</option>
          </select>
        </div>
      </SurfaceCard>

      {loading && customers.length === 0 ? (
        <Loader message="Loading customer directory..." />
      ) : (
        <section className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm p-4 sm:p-5 space-y-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 text-left text-xs text-slate-700">
                <thead className="bg-slate-50 font-bold uppercase text-slate-400">
                  <tr>
                    <th className="px-5 py-3.5">{t("customerCode")}</th>
                    <th className="px-5 py-3.5">{t("name")}</th>
                    <th className="px-5 py-3.5">{t("company")}</th>
                    <th className="px-5 py-3.5">{t("phone")}</th>
                    <th className="px-5 py-3.5">{t("email")}</th>
                    <th className="px-5 py-3.5">{t("type")}</th>
                    <th className="px-5 py-3.5">{t("status")}</th>
                    <th className="px-5 py-3.5">{t("totalSpent")}</th>
                    <th className="px-5 py-3.5 text-right">{t("actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-slate-50/60 transition">
                      <td className="px-5 py-4 font-mono font-bold text-blue-600">
                        {customer.customerCode || "—"}
                      </td>
                      <td className="px-5 py-4 font-bold text-slate-900">
                        {customer.fullName}
                      </td>
                      <td className="px-5 py-4 font-medium text-slate-600">
                        {customer.companyName || "—"}
                      </td>
                      <td className="px-5 py-4">{customer.phoneNumber}</td>
                      <td className="px-5 py-4 text-slate-500">{customer.email || "—"}</td>
                      <td className="px-5 py-4 font-medium">{t(customer.customerType)}</td>
                      <td className="px-5 py-4">
                        <StatusBadge status={customer.status} />
                      </td>
                      <td className="px-5 py-4 font-mono font-bold text-slate-900">
                        NOK {Number(customer.totalSpent || 0).toLocaleString()}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={appRoutes.crmCustomerDetails(customer.id)}
                            className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
                            title="View Profile & Orders"
                          >
                            <Eye size={16} />
                          </Link>
                          <Link
                            to={appRoutes.crmCustomerEdit(customer.id)}
                            className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100"
                            title="Edit Customer"
                          >
                            <Pencil size={16} />
                          </Link>
                          <button
                            onClick={() => openDeleteModal(customer)}
                            className="rounded-full border border-red-200 p-2 text-red-600 transition hover:bg-red-50 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {!loading && customers.length === 0 && (
                    <tr>
                      <td colSpan="9" className="px-5 py-10 text-center text-sm text-slate-500">
                        {lang === "no" ? "Ingen kunder funnet i databasen." : "No customers found in database."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Reusable Pagination */}
            <Pagination
              currentPage={page}
              totalPages={paginationMeta.totalPages}
              totalItems={paginationMeta.total}
              pageSize={pageSize}
              onPageChange={(newPage) => setPage(newPage)}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setPage(1);
              }}
              pageSizeOptions={[10, 25, 50, 100]}
              itemLabel="customers"
              itemLabelNo="kunder"
            />
          </div>
        </section>
      )}

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedCustomer(null);
        }}
        onConfirm={handleDelete}
        title={t("delete")}
        message={`Are you sure you want to delete ${selectedCustomer?.fullName}? This action cannot be undone.`}
      />
    </div>
  );
};

export default CustomersPage;
