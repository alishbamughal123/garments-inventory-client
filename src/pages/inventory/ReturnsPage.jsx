import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search, Eye, Trash2, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import MainLayout from "../../layouts/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import SurfaceCard from "../../components/ui/SurfaceCard";
import StatusBadge from "../../components/ui/StatusBadge";
import DeleteModal from "../../components/common/DeleteModal";
import Pagination from "../../components/common/Pagination";
import { getReturns, deleteReturn } from "../../services/return.service";
import { appRoutes } from "../../config/routes";
import { formControlClass } from "../../components/ui/formStyles";

const ReturnsPage = () => {
  const navigate = useNavigate();
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [paginationMeta, setPaginationMeta] = useState({ total: 0, totalPages: 1 });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState(null);

  const fetchReturns = async (pageToFetch = page, pageSizeToFetch = pageSize, currentSearch = search) => {
    try {
      setLoading(true);
      const response = await getReturns({
        page: pageToFetch,
        limit: pageSizeToFetch,
        search: currentSearch.trim(),
      });

      const items = Array.isArray(response.data) ? response.data : response.data?.returns || [];
      setReturns(items);

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
    } catch (error) {
      toast.error("Failed to load returns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchReturns(page, pageSize, search);
    }, 350);

    return () => clearTimeout(timeout);
  }, [page, pageSize, search]);

  const openDeleteModal = (returnRecord) => {
    setSelectedReturn(returnRecord);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedReturn) return;

    try {
      await deleteReturn(selectedReturn.id);
      toast.success("Return record deleted successfully");
      fetchReturns(page, pageSize, search);
      setDeleteModalOpen(false);
      setSelectedReturn(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete return record");
    }
  };

  const filteredReturns = returns;

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title="Product Returns"
          action={
            <Button as={Link} to={appRoutes.returnsProcess}>
              <Plus size={16} />
              Process Return
            </Button>
          }
        />

        <SurfaceCard className="p-4 sm:p-5">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by product, SKU, or reason..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className={`${formControlClass} pl-11`}
            />
          </div>
        </SurfaceCard>

        <div className="grid gap-4 lg:hidden">
          {loading && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
              Loading returns...
            </div>
          )}

          {!loading && filteredReturns.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
              No return records found.
            </div>
          )}

          {filteredReturns.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-900 text-sm">
                    {item.product?.productName}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">{item.product?.sku}</p>
                </div>
                <StatusBadge value={item.conditionStatus} />
              </div>

              <dl className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <dt className="text-slate-400 font-semibold">Quantity</dt>
                  <dd className="mt-0.5 font-bold text-slate-800">{item.returnQuantity}</dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-semibold">Processed By</dt>
                  <dd className="mt-0.5 font-medium text-slate-700">{item.processedBy?.name || "-"}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-slate-400 font-semibold">Reason</dt>
                  <dd className="mt-0.5 text-slate-700">{item.returnReason || "-"}</dd>
                </div>
              </dl>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => navigate(`/returns/${item.id}`)}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                  title="View Details"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => navigate(`/returns/edit/${item.id}`)}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                  title="Edit Return"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => openDeleteModal(item)}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                  title="Delete Return"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block p-4 sm:p-5 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">Condition</th>
                  <th className="px-6 py-4">Reason</th>
                  <th className="px-6 py-4">Processed By</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading && (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-slate-500">
                      Loading returns...
                    </td>
                  </tr>
                )}

                {!loading && filteredReturns.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-slate-500">
                      No return records found.
                    </td>
                  </tr>
                )}

                {filteredReturns.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-slate-100 text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">
                        {item.product?.productName}
                      </div>
                      <div className="text-xs text-slate-500">{item.product?.sku}</div>
                    </td>
                    <td className="px-6 py-4 font-medium">{item.returnQuantity}</td>
                    <td className="px-6 py-4">
                      <StatusBadge value={item.conditionStatus} />
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate">
                      {item.returnReason || "-"}
                    </td>
                    <td className="px-6 py-4 text-slate-500">{item.processedBy?.name}</td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => navigate(`/returns/${item.id}`)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => navigate(`/returns/edit/${item.id}`)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                          title="Edit Return"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(item)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                          title="Delete Return"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
            itemLabel="returns"
            itemLabelNo="returer"
          />
        </div>
      </div>

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedReturn(null);
        }}
        onConfirm={handleDelete}
        title="Delete Return Record"
        message={`Are you sure you want to delete this return record for ${selectedReturn?.product?.productName}? This will also reverse the stock adjustment if the item was marked as Usable.`}
      />
    </MainLayout>
  );
};

export default ReturnsPage;
