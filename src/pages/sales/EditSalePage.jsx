import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import toast from "react-hot-toast";
import MainLayout from "../../layouts/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import SurfaceCard from "../../components/ui/SurfaceCard";
import { formControlClass, formLabelClass } from "../../components/ui/formStyles";
import { getSaleById, updateSale } from "../../services/sales.service";
import { appRoutes } from "../../config/routes";
import api from "../../services/api";

const EditSalePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    notes: "",
    paymentMethod: "",
  });
  const [sale, setSale] = useState(null);

  useEffect(() => {
    const fetchSale = async () => {
      try {
        setLoading(true);
        const response = await getSaleById(id);
        setSale(response.data);
        setFormData({
          notes: response.data.notes || "",
          paymentMethod: response.data.paymentMethod,
        });
      } catch (error) {
        toast.error("Failed to load sale record");
        navigate(appRoutes.sales);
      } finally {
        setLoading(false);
      }
    };
    fetchSale();
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
      await updateSale(id, formData);
      toast.success("Sale updated successfully");
      navigate(appRoutes.sales);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update sale");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <p className="text-slate-500 animate-pulse">Loading sale data...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-3xl space-y-6">
        <PageHeader
          title="Edit Sale Transaction"
          action={
            <Button variant="secondary" onClick={() => navigate(appRoutes.sales)}>
              <ArrowLeft size={16} />
              Back
            </Button>
          }
        />

        <SurfaceCard className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Invoice Number</p>
                <p className="text-sm font-bold text-slate-900">{sale?.invoiceNumber}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Grand Total</p>
                <p className="text-sm font-bold text-slate-900">Rs. {sale?.grandTotal}</p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6">
              <label className={formLabelClass}>Payment Method</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className={formControlClass}
                required
              >
                <option value="CASH">Cash</option>
                <option value="CARD">Bank Card</option>
                <option value="TRANSFER">Bank Transfer</option>
                <option value="WHATSAPP_PAY">WhatsApp Pay</option>
              </select>
            </div>

            <div>
              <label className={formLabelClass}>Notes / Remarks</label>
              <textarea
                name="notes"
                rows="4"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add any internal notes or remarks about this transaction..."
                className={formControlClass}
              />
            </div>

            <div className="rounded-xl bg-blue-50/50 p-4 border border-blue-100">
              <p className="text-xs text-blue-700 leading-relaxed">
                <strong>Note:</strong> Items and quantities cannot be edited directly to preserve inventory audit trails. To change items, please delete this sale and create a new one.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(appRoutes.sales)}
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

export default EditSalePage;
