import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScanLine } from "lucide-react";
import toast from "react-hot-toast";
import MainLayout from "../../layouts/MainLayout";
import BarcodeScannerModal from "../../components/common/BarcodeScannerModal";
import Button from "../../components/ui/Button";
import {
  formControlClass,
  formLabelClass,
} from "../../components/ui/formStyles";
import PageHeader from "../../components/ui/PageHeader";
import SurfaceCard from "../../components/ui/SurfaceCard";
import { createReturn } from "../../services/return.service";
import { appRoutes } from "../../config/routes";

const ProcessReturnPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [formData, setFormData] = useState({
    barcode: "",
    quantity: "",
    returnReason: "",
    conditionStatus: "USABLE",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleScan = (scannedBarcode) => {
    setFormData({
      ...formData,
      barcode: scannedBarcode,
    });
    setShowScanner(false);
    toast.success("Barcode scanned successfully");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.barcode || !formData.quantity) {
      return toast.error("Barcode and Quantity are required");
    }

    try {
      setLoading(true);
      await createReturn({
        barcode: formData.barcode,
        quantity: Number(formData.quantity),
        returnReason: formData.returnReason,
        conditionStatus: formData.conditionStatus,
      });

      toast.success("Return processed successfully");
      navigate(appRoutes.returns);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to process return"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-5xl space-y-6">
        <PageHeader
          title="Process Return"
          description="Handle product returns, track item condition, and update stock levels."
        />

        <SurfaceCard>
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <label className={formLabelClass}>Barcode</label>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowScanner(true)}
                  >
                    <ScanLine size={16} />
                    Scan Barcode
                  </Button>
                </div>
                <input
                  type="text"
                  name="barcode"
                  value={formData.barcode}
                  onChange={handleChange}
                  placeholder="Scan or enter barcode"
                  className={formControlClass}
                  required
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className={formLabelClass}>Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="Enter quantity"
                    className={formControlClass}
                    required
                  />
                </div>

                <div>
                  <label className={formLabelClass}>Condition Status</label>
                  <select
                    name="conditionStatus"
                    value={formData.conditionStatus}
                    onChange={handleChange}
                    className={formControlClass}
                  >
                    <option value="USABLE">Usable (Restore Stock)</option>
                    <option value="DAMAGED">Damaged (No Stock Restore)</option>
                    <option value="REFURBISHED">Refurbished</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={formLabelClass}>Return Reason</label>
                <textarea
                  rows="4"
                  name="returnReason"
                  value={formData.returnReason}
                  onChange={handleChange}
                  placeholder="Why is this being returned?"
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
                <Button type="submit" disabled={loading} size="lg">
                  {loading ? "Processing..." : "Submit Return"}
                </Button>
              </div>
            </form>
          </div>
        </SurfaceCard>
      </div>

      {showScanner && (
        <BarcodeScannerModal
          onClose={() => setShowScanner(false)}
          onScan={handleScan}
        />
      )}
    </MainLayout>
  );
};

export default ProcessReturnPage;
