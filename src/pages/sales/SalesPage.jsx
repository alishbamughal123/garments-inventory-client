import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  FiEye,
  FiPlus,
  FiTrash2,
  FiEdit,
  FiDownload,
  FiFileText,
  FiX,
} from "react-icons/fi";

import toast from "react-hot-toast";
import MainLayout from "../../layouts/MainLayout";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import SurfaceCard from "../../components/ui/SurfaceCard";
import DeleteModal from "../../components/common/DeleteModal";
import Loader from "../../components/ui/Loader";
import { formControlClass } from "../../components/ui/formStyles";
import Pagination from "../../components/common/Pagination";
import {
  getSales,
  deleteSale,
} from "../../services/sales.service";
import { getCustomers } from "../../services/customer.service";
import { exportSalesToExcel, exportSalesToPDF } from "../../utils/salesExport";
import { useLanguage } from "../../context/LanguageContext";

const SalesPage = () => {
  const navigate =
    useNavigate();
  const { isNo } = useLanguage();

  const [sales, setSales] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [paginationMeta, setPaginationMeta] = useState({ total: 0, totalPages: 1 });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

  // Report filters
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [summary, setSummary] = useState(null);
  const [exporting, setExporting] = useState("");

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await getCustomers({ limit: 500 });
        const list = Array.isArray(res.data)
          ? res.data
          : res.data?.customers || res.customers || [];
        if (isMounted) setCustomers(list);
      } catch {
        /* the customer filter simply stays empty */
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const reportFilters = () => ({
    search: search.trim(),
    customerId: customerId || undefined,
    from: fromDate || undefined,
    to: toDate || undefined,
  });

  const selectedCustomerLabel = () => {
    if (!customerId) return isNo ? "Alle kunder" : "All customers";
    if (customerId === "WALKIN") return isNo ? "Gjestekunde" : "Walk-in Customer";
    const c = customers.find((x) => x.id === customerId);
    return c?.companyName || c?.fullName || customerId;
  };

  const handleExport = async (kind) => {
    try {
      setExporting(kind);
      const response = await getSales({ ...reportFilters(), all: "true" });
      const all = Array.isArray(response.data) ? response.data : response.data?.sales || [];
      if (all.length === 0) {
        toast.error(isNo ? "Ingen salg å eksportere" : "No sales to export");
        return;
      }
      const options = { sales: all, customerLabel: selectedCustomerLabel(), from: fromDate, to: toDate };
      if (kind === "excel") await exportSalesToExcel(options);
      else await exportSalesToPDF(options);
      toast.success(isNo ? `Rapport lastet ned (${all.length} salg)` : `Report downloaded (${all.length} sales)`);
    } catch (error) {
      console.error(error);
      toast.error(isNo ? "Kunne ikke lage rapporten" : "Failed to generate the report");
    } finally {
      setExporting("");
    }
  };

  const fetchSales = async (pageToFetch = page, pageSizeToFetch = pageSize, searchQuery = search, isStale = () => false) => {
    try {
      setLoading(true);
      const response = await getSales({
        page: pageToFetch,
        limit: pageSizeToFetch,
        ...reportFilters(),
        search: searchQuery.trim(),
      });
      if (isStale()) return;
      setSummary(response.pagination?.summary || null);

      const items = Array.isArray(response.data) ? response.data : response.data?.sales || [];
      setSales(items);

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
      if (isStale()) return;
      toast.error("Failed to fetch sales");
    } finally {
      if (!isStale()) setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const timeout = setTimeout(() => {
      fetchSales(page, pageSize, search, () => cancelled);
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [page, pageSize, search, customerId, fromDate, toDate]);

  const openDeleteModal = (sale) => {
    setSelectedSale(sale);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedSale) return;
    try {
      await deleteSale(selectedSale.id);
      toast.success("Sale deleted successfully");
      fetchSales(page, pageSize, search);
      setDeleteModalOpen(false);
      setSelectedSale(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete sale");
    }
  };

  const filteredSales = sales;

  if (loading && sales.length === 0) {
    return (
      <MainLayout>
        <Loader message="Syncing invoice sales records..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>

      <div className="space-y-6">

        <PageHeader
          title="Sales"
          action={
            <Button
              onClick={() =>
                navigate(
                  "/sales/create"
                )
              }
              size="lg"
              className="w-full sm:w-auto"
            >
              <FiPlus />
              Create Sale
            </Button>
          }
        />

        <SurfaceCard className="p-5 space-y-4">

          <input
            type="text"
            placeholder="Search invoice, customer, product, payment, total, date..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className={formControlClass}
          />

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-slate-500">Customer</label>
              <select
                value={customerId}
                onChange={(e) => {
                  setCustomerId(e.target.value);
                  setPage(1);
                }}
                className={formControlClass}
              >
                <option value="">All customers</option>
                <option value="WALKIN">Walk-in Customer</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.companyName ? `${c.companyName} (${c.fullName})` : c.fullName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">From date</label>
              <input
                type="date"
                value={fromDate}
                max={toDate || undefined}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setPage(1);
                }}
                className={formControlClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">To date</label>
              <input
                type="date"
                value={toDate}
                min={fromDate || undefined}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setPage(1);
                }}
                className={formControlClass}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
              <span className="text-slate-500">
                <strong className="text-slate-900">{summary ? summary.count : paginationMeta.total}</strong>{" "}
                sales
              </span>
              <span className="text-slate-500">
                Total:{" "}
                <strong className="text-slate-900">
                  NOK {Number(summary?.grandTotal || 0).toLocaleString(isNo ? "nb-NO" : "en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </strong>
              </span>
              {(customerId || fromDate || toDate) && (
                <button
                  type="button"
                  onClick={() => {
                    setCustomerId("");
                    setFromDate("");
                    setToDate("");
                    setPage(1);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  <FiX size={14} />
                  Clear filters
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleExport("excel")}
                disabled={!!exporting}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60 sm:text-sm"
              >
                <FiDownload className="text-brand-600" />
                {exporting === "excel" ? "Exporting..." : "Export to Excel (.xlsx)"}
              </button>
              <button
                type="button"
                onClick={() => handleExport("pdf")}
                disabled={!!exporting}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60 sm:text-sm"
              >
                <FiFileText className="text-red-600" />
                {exporting === "pdf" ? "Exporting..." : "Download PDF (.pdf)"}
              </button>
            </div>
          </div>
        </SurfaceCard>

        <div className="grid gap-4 lg:hidden">
          {filteredSales.map((sale) => (
            <article
              key={sale.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="truncate text-base font-semibold text-slate-900">
                    {sale.invoiceNumber}
                  </h3>
                  <p className="mt-1 truncate text-sm text-slate-500">
                    {sale.customer
                      ?.fullName ||
                      "Walk-in Customer"}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      navigate(
                        `/sales/${sale.id}`
                      )
                    }
                    className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100"
                  >
                    <FiEye size={18} />
                  </button>
                  <button
                    onClick={() =>
                      navigate(
                        `/sales/edit/${sale.id}`
                      )
                    }
                    className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100"
                  >
                    <FiEdit size={18} />
                  </button>
                  <button
                    onClick={() => openDeleteModal(sale)}
                    className="rounded-full border border-red-100 p-2 text-red-600 transition hover:bg-red-50"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Mobile Products List */}
              {sale.saleItems && sale.saleItems.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Products ({sale.saleItems.reduce((acc, it) => acc + (it.quantity || 0), 0)} items)
                  </span>
                  <div className="space-y-1">
                    {sale.saleItems.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-xs text-slate-700">
                        <span className="font-medium text-slate-900 truncate mr-2">
                          {item.product?.productName || "Product"}
                        </span>
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700 flex-shrink-0">
                          ×{item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-slate-400">
                    Total
                  </dt>
                  <dd className="mt-1 font-medium text-slate-700">
                    NOK {sale.grandTotal}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400">
                    Payment
                  </dt>
                  <dd className="mt-1 font-medium text-slate-700">
                    {
                      sale.paymentMethod
                    }
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-slate-400">
                    Date
                  </dt>
                  <dd className="mt-1 font-medium text-slate-700">
                    {new Date(
                      sale.createdAt
                    ).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </article>
          ))}

          {filteredSales.length ===
            0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
              No sales found.
            </div>
          )}
        </div>

        <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="p-5 text-left">
                    Invoice
                  </th>
                  <th className="p-5 text-left">
                    Customer
                  </th>
                  <th className="p-5 text-left">
                    Products
                  </th>
                  <th className="p-5 text-left">
                    Total
                  </th>
                  <th className="p-5 text-left">
                    Payment
                  </th>
                  <th className="p-5 text-left">
                    Date
                  </th>
                  <th className="p-5 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredSales.map(
                  (sale) => (
                    <tr
                      key={sale.id}
                      className="border-t border-slate-100 transition hover:bg-slate-50"
                    >
                      <td className="p-5 font-medium text-slate-900">
                        {
                          sale.invoiceNumber
                        }
                      </td>
                      <td className="p-5 text-slate-600">
                        {sale.customer ? (
                          <div>
                            <span className="font-bold text-slate-900 block text-xs">
                              {sale.customer.companyName || sale.customer.fullName}
                            </span>
                            {sale.customer.companyName && (
                              <span className="text-[11px] text-slate-500 block">
                                {sale.customer.fullName}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-500 font-medium text-xs">Walk-in Customer</span>
                        )}
                      </td>
                      <td className="p-5 text-slate-700">
                        {sale.saleItems && sale.saleItems.length > 0 ? (
                          <div className="space-y-1 max-w-xs">
                            {sale.saleItems.slice(0, 3).map((item, i) => (
                              <div key={i} className="flex items-center gap-1.5 text-xs">
                                <span className="font-medium text-slate-900 truncate" title={item.product?.productName}>
                                  {item.product?.productName || "Product"}
                                </span>
                                <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-100 text-slate-700 flex-shrink-0">
                                  ×{item.quantity}
                                </span>
                                {(item.product?.color || item.product?.size) && (
                                  <span className="text-[10px] text-slate-400 truncate">
                                    ({[item.product?.color, item.product?.size].filter(Boolean).join("/")})
                                  </span>
                                )}
                              </div>
                            ))}
                            {sale.saleItems.length > 3 && (
                              <span className="inline-block text-[11px] font-semibold text-brand-600">
                                +{sale.saleItems.length - 3} more
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs italic">—</span>
                        )}
                      </td>
                      <td className="p-5 font-bold text-slate-900">
                        NOK{" "}
                        {
                          sale.grandTotal
                        }
                      </td>
                      <td className="p-5 text-slate-600">
                        {
                          sale.paymentMethod
                        }
                      </td>
                      <td className="p-5 text-slate-500">
                        {new Date(
                          sale.createdAt
                        ).toLocaleDateString()}
                      </td>
                      <td className="p-5">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() =>
                              navigate(
                                `/sales/${sale.id}`
                              )
                            }
                            className="text-slate-400 transition hover:text-slate-900"
                            title="View Invoice"
                          >
                            <FiEye size={20} />
                          </button>
                          <button
                            onClick={() =>
                              navigate(
                                `/sales/edit/${sale.id}`
                              )
                            }
                            className="text-slate-400 transition hover:text-slate-900"
                            title="Edit Sale"
                          >
                            <FiEdit size={20} />
                          </button>
                          <button
                            onClick={() => openDeleteModal(sale)}
                            className="text-slate-400 transition hover:text-red-600"
                            title="Delete Sale"
                          >
                            <FiTrash2 size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}

                {filteredSales.length ===
                  0 && (
                  <tr>
                    <td
                      colSpan="7"
                      className="p-10 text-center text-sm text-slate-500"
                    >
                      No sales found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 sm:p-5 pt-0">
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
              itemLabel="invoices"
              itemLabelNo="fakturaer"
            />
          </div>
        </div>

      </div>

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedSale(null);
        }}
        onConfirm={handleDelete}
        title="Delete Sale Transaction"
        message={`Are you sure you want to delete invoice ${selectedSale?.invoiceNumber}? This will automatically restore stock levels for all items in this sale.`}
      />

    </MainLayout>
  );
};

export default SalesPage;
