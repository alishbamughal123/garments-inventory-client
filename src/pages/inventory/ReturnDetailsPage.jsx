import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Package, Calendar, FileText, AlertCircle, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import MainLayout from "../../layouts/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import SurfaceCard from "../../components/ui/SurfaceCard";
import StatusBadge from "../../components/ui/StatusBadge";
import { getReturnById } from "../../services/return.service";
import { appRoutes } from "../../config/routes";

const ReturnDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [returnRecord, setReturnRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReturnDetails = async () => {
      try {
        setLoading(true);
        const response = await getReturnById(id);
        setReturnRecord(response.data);
      } catch (error) {
        toast.error("Failed to load return details");
        navigate(appRoutes.returns);
      } finally {
        setLoading(false);
      }
    };
    fetchReturnDetails();
  }, [id, navigate]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <p className="text-slate-500 animate-pulse">Loading return details...</p>
        </div>
      </MainLayout>
    );
  }

  if (!returnRecord) return null;

  return (
    <MainLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <PageHeader
          title="Return Details"
          action={
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                onClick={() => navigate(`/returns/edit/${id}`)}
              >
                <Pencil size={16} />
                Edit Record
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate(appRoutes.returns)}
              >
                <ArrowLeft size={16} />
                Back to Returns
              </Button>
            </div>
          }
        />

        <div className="grid gap-6 md:grid-cols-3">
          {/* Summary Card */}
          <SurfaceCard className="md:col-span-2 p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Package size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {returnRecord.product?.productName}
                  </h2>
                  <p className="text-sm text-slate-500">
                    SKU: {returnRecord.product?.sku}
                  </p>
                </div>
              </div>
              <StatusBadge value={returnRecord.conditionStatus} className="text-sm px-4 py-1.5" />
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Return Quantity
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {returnRecord.returnQuantity} Units
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Process Date
                </p>
                <p className="text-lg font-semibold text-slate-700">
                  {new Date(returnRecord.createdAt).toLocaleDateString(undefined, {
                    dateStyle: 'long'
                  })}
                </p>
              </div>

              <div className="sm:col-span-2 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <FileText size={14} />
                  Return Reason
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 text-slate-700 leading-relaxed border border-slate-100">
                  {returnRecord.returnReason || "No specific reason provided for this return."}
                </div>
              </div>
            </div>
          </SurfaceCard>

          {/* Metadata Card */}
          <div className="space-y-6">
            <SurfaceCard className="p-6">
              <h3 className="mb-4 text-sm font-bold text-slate-900 border-b border-slate-50 pb-3">
                Transaction Meta
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-lg bg-slate-100 p-1.5 text-slate-500">
                    <User size={14} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase">Processed By</p>
                    <p className="text-sm font-medium text-slate-700">{returnRecord.processedBy?.name}</p>
                    <p className="text-xs text-slate-400">{returnRecord.processedBy?.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-lg bg-slate-100 p-1.5 text-slate-500">
                    <Calendar size={14} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase">Timestamp</p>
                    <p className="text-sm font-medium text-slate-700">
                      {new Date(returnRecord.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            </SurfaceCard>

            <SurfaceCard className="p-6 bg-amber-50/30 border-amber-100">
              <div className="flex items-center gap-2 mb-3 text-amber-700">
                <AlertCircle size={18} />
                <h3 className="text-sm font-bold">Inventory Note</h3>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                {returnRecord.conditionStatus === 'USABLE' 
                  ? "This item was marked as USABLE. The stock level of the product was automatically increased upon processing."
                  : "This item was marked as non-usable. No stock adjustments were made to the available inventory."
                }
              </p>
            </SurfaceCard>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ReturnDetailsPage;
