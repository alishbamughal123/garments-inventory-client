import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Pencil, Plus, Search, Trash2, FileSpreadsheet } from "lucide-react";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import StatusBadge from "../../components/ui/StatusBadge";
import SurfaceCard from "../../components/ui/SurfaceCard";
import DeleteModal from "../../components/common/DeleteModal";
import { appRoutes } from "../../config/routes";
import toast from "react-hot-toast";
import Loader from "../../components/ui/Loader";
import { deleteCustomer, getCustomers } from "../../services/customer.service";
import { useLanguage } from "../../context/LanguageContext";
import * as XLSX from "xlsx";

const CustomersPage = () => {
  const { t, lang } = useLanguage();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [customerType, setCustomerType] = useState("");
  const [status, setStatus] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  async function fetchCustomers(currentSearch = search) {
    try {
      setLoading(true);
      const response = await getCustomers(currentSearch, customerType, status);
      setCustomers(response.data || []);
    } catch {
      toast.error(lang === "no" ? "Kunne ikke laste kunder" : "Failed to load customers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchCustomers();
    }, 400);

    return () => clearTimeout(timeout);
  }, [search, customerType, status]);

  const openDeleteModal = (customer) => {
    setSelectedCustomer(customer);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedCustomer) return;
    try {
      await deleteCustomer(selectedCustomer.id);
      toast.success(lang === "no" ? "Kunde slettet" : "Customer deleted");
      fetchCustomers();
      setDeleteModalOpen(false);
      setSelectedCustomer(null);
    } catch {
      toast.error(lang === "no" ? "Sletting mislyktes" : "Delete failed");
    }
  };

  const exportToExcel = () => {
    if (customers.length === 0) {
      toast.error(lang === "no" ? "Ingen data å eksportere" : "No customer data to export");
      return;
    }

    const data = customers.map(c => ({
      "Customer Code": c.customerCode || "N/A",
      "Full Name": c.fullName,
      "Company Name": c.companyName || "N/A",
      "Phone": c.phoneNumber,
      "Email": c.email || "N/A",
      "VAT Number": c.vatNumber || "N/A",
      "Type": c.customerType,
      "Status": c.status,
      "Total Orders": c.totalOrders,
      "Total Spent (NOK)": c.totalSpent
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");
    XLSX.writeFile(workbook, `Nordic_Prowear_Customers_${new Date().toISOString().slice(0, 10)}.xlsx`);
    toast.success(lang === "no" ? "Kundedatabase eksportert til Excel" : "Customer directory exported to Excel");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("customerRegister")}
        action={
          <div className="flex items-center gap-3">
            <button
              onClick={exportToExcel}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 text-xs font-semibold shadow-sm transition"
            >
              <FileSpreadsheet size={16} />
              <span>{t("exportExcel")}</span>
            </button>

            <Button as={Link} to={appRoutes.crmCustomersCreate}>
              <Plus size={16} />
              {t("addNewCustomer")}
            </Button>
          </div>
        }
      />

      <SurfaceCard className="p-4 sm:p-6">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <label className="relative block">
            <Search
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder={lang === "no" ? "Søk etter kundenummer, navn, telefon eller bedrift..." : "Search customer code, name, phone, or company..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:bg-white"
            />
          </label>

          <select
            value={customerType}
            onChange={(e) => setCustomerType(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:bg-white"
          >
            <option value="">{lang === "no" ? "Alle typer" : "All Customer Types"}</option>
            <option value="REGULAR">{t("regular")}</option>
            <option value="WHOLESALE">{t("wholesale")}</option>
            <option value="VIP">{t("vip")}</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:bg-white"
          >
            <option value="">{lang === "no" ? "Alle statuser" : "All Statuses"}</option>
            <option value="ACTIVE">{t("active")}</option>
            <option value="INACTIVE">{t("inactive")}</option>
          </select>
        </div>
      </SurfaceCard>

      {loading ? (
        <Loader message={lang === "no" ? "Henter kundedatabase..." : "Loading customer directory..."} />
      ) : (
        <section className="space-y-4">
          <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-5 py-4 text-left">{t("customerCode")}</th>
                    <th className="px-5 py-4 text-left">{t("fullName")}</th>
                    <th className="px-5 py-4 text-left">{t("companyName")}</th>
                    <th className="px-5 py-4 text-left">{t("phone")}</th>
                    <th className="px-5 py-4 text-left">{t("customerType")}</th>
                    <th className="px-5 py-4 text-left">{t("status")}</th>
                    <th className="px-5 py-4 text-left">{t("totalOrders")}</th>
                    <th className="px-5 py-4 text-left">{t("totalSpent")}</th>
                    <th className="px-5 py-4 text-left">{t("actions")}</th>
                  </tr>
                </thead>

                <tbody>
                  {customers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="border-t border-slate-100 text-sm text-slate-700 transition hover:bg-slate-50/80"
                    >
                      <td className="px-5 py-4 font-mono font-bold text-blue-600">
                        {customer.customerCode || "N/A"}
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-900">
                        {customer.fullName}
                      </td>
                      <td className="px-5 py-4">
                        {customer.companyName || "-"}
                      </td>
                      <td className="px-5 py-4">
                        {customer.phoneNumber}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge value={customer.customerType} className="px-2.5" />
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge value={customer.status} className="px-2.5" />
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-800">
                        {customer.totalOrders}
                      </td>
                      <td className="px-5 py-4 font-bold text-slate-900">
                        NOK {Number(customer.totalSpent || 0).toLocaleString()}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
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
                            className="rounded-full border border-red-200 p-2 text-red-600 transition hover:bg-red-50"
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
