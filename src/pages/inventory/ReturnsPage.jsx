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
import { getReturns, deleteReturn } from "../../services/return.service";
import { appRoutes } from "../../config/routes";
import { formControlClass } from "../../components/ui/formStyles";

const ReturnsPage = () => {
  const navigate = useNavigate();
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState(null);

  const fetchReturns = async () => {
    try {
      setLoading(true);
      const response = await getReturns();
      setReturns(response.data || []);
    } catch (error) {
      toast.error("Failed to load returns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  const openDeleteModal = (returnRecord) => {
    setSelectedReturn(returnRecord);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedReturn) return;

    try {
      await deleteReturn(selectedReturn.id);
      toast.success("Return record deleted successfully");
      fetchReturns();
      setDeleteModalOpen(false);
      setSelectedReturn(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete return record");
    }
  };

  const filteredReturns = returns.filter((item) =>
    item.product?.productName?.toLowerCase().includes(search.toLowerCase()) ||
    item.product?.sku?.toLowerCase().includes(search.toLowerCase()) ||
    item.returnReason?.toLowerCase().includes(search.toLowerCase())
  );

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
              onChange={(e) => setSearch(e.target.value)}
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
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
              {search ? "No matches found" : "No returns found"}
            </div>
          )}

          {filteredReturns.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-base font-semibold text-slate-900">
                    {item.product?.productName}
                  </h3>
                  <p className="mt-1 truncate text-sm text-slate-500">
                    SKU: {item.product?.sku}
                  </p>
                </div>
                <StatusBadge value={item.conditionStatus} />
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-slate-400">Quantity</dt>
                  <dd className="mt-1 font-medium text-slate-700">
                    {item.returnQuantity}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400">Date</dt>
                  <dd className="mt-1 font-medium text-slate-700">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-slate-400">Reason</dt>
                  <dd className="mt-1 text-slate-600">
                    {item.returnReason || "No reason provided"}
                  </dd>
                </div>
              </dl>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  onClick={() => navigate(`/returns/${item.id}`)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <Eye size={16} />
                  View
                </button>
                <button
                  onClick={() => navigate(`/returns/edit/${item.id}`)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <Pencil size={16} />
                  Edit
                </button>
                <button
                  onClick={() => openDeleteModal(item)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-100 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50 text-sm text-slate-500">
                <tr>
                  <th className="px-6 py-4 text-left font-medium">Product</th>
                  <th className="px-6 py-4 text-left font-medium">Qty</th>
                  <th className="px-6 py-4 text-left font-medium">Status</th>
                  <th className="px-6 py-4 text-left font-medium">Reason</th>
                  <th className="px-6 py-4 text-left font-medium">Processed By</th>
                  <th className="px-6 py-4 text-left font-medium">Date</th>
                  <th className="px-6 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan="7" className="p-10 text-center text-sm text-slate-500">
                      Loading returns...
                    </td>
                  </tr>
                )}
                {!loading && filteredReturns.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-10 text-center text-sm text-slate-500">
                      {search ? "No matches found" : "No returns found"}
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
