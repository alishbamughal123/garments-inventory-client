import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import toast from "react-hot-toast";
import MainLayout from "../../layouts/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import SurfaceCard from "../../components/ui/SurfaceCard";
import { formControlClass, formLabelClass } from "../../components/ui/formStyles";
import { getReturnById, updateReturn } from "../../services/return.service";
import { appRoutes } from "../../config/routes";

const EditReturnPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    returnReason: "",
    conditionStatus: "",
  });
  const [returnRecord, setReturnRecord] = useState(null);

  useEffect(() => {
    const fetchReturn = async () => {
      try {
        setLoading(true);
        const response = await getReturnById(id);
        setReturnRecord(response.data);
        setFormData({
          returnReason: response.data.returnReason || "",
          conditionStatus: response.data.conditionStatus,
        });
      } catch (error) {
        toast.error("Failed to load return record");
        navigate(appRoutes.returns);
      } finally {
        setLoading(false);
      }
    };
    fetchReturn();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateReturn(id, formData);
      toast.success("Return record updated successfully");
      navigate(appRoutes.returns);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update return");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <p className="text-slate-500 animate-pulse">Loading return data...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-3xl space-y-6">
        <PageHeader
          title="Edit Return Record"
          action={
            <Button variant="secondary" onClick={() => navigate(appRoutes.returns)}>
              <ArrowLeft size={16} />
              Back
            </Button>
          }
        />

        <SurfaceCard className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Product</p>
                <p className="text-sm font-bold text-slate-900">{returnRecord?.product?.productName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quantity</p>
                <p className="text-sm font-bold text-slate-900">{returnRecord?.returnQuantity} Units</p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6">
              <label className={formLabelClass}>Condition Status</label>
              <p className="mb-3 text-[11px] text-slate-400 italic">
                Note: Changing status to/from "Usable" will automatically adjust current stock.
              </p>
              <select
                name="conditionStatus"
                value={formData.conditionStatus}
                onChange={handleChange}
                className={formControlClass}
                required
              >
                <option value="USABLE">Usable (Stock Restored)</option>
                <option value="DAMAGED">Damaged (No Stock Restoration)</option>
                <option value="REFURBISHED">Refurbished</option>
              </select>
            </div>

            <div>
              <label className={formLabelClass}>Return Reason</label>
              <textarea
                name="returnReason"
                rows="4"
                value={formData.returnReason}
                onChange={handleChange}
                placeholder="Update the reason for this return..."
                className={formControlClass}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(appRoutes.returns)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                <Save size={16} />
                {saving ? "Saving Changes..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </SurfaceCard>
      </div>
    </MainLayout>
  );
};

export default EditReturnPage;
