import { useState } from "react";
import { ScanLine } from "lucide-react";
import toast from "react-hot-toast";
import MainLayout from "../../layouts/MainLayout";
import BarcodeScannerModal from "../common/BarcodeScannerModal";
import Button from "../ui/Button";
import {
  formControlClass,
  formLabelClass,
} from "../ui/formStyles";
import PageHeader from "../ui/PageHeader";
import SurfaceCard from "../ui/SurfaceCard";

const InventoryMovementPage = ({
  title,
  description,
  submitLabel,
  loadingLabel,
  successMessage,
  action,
}) => {
  const [loading, setLoading] =
    useState(false);
  const [showScanner, setShowScanner] =
    useState(false);
  const [formData, setFormData] =
    useState({
      barcode: "",
      quantity: "",
      notes: "",
    });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleScan = (
    scannedBarcode
  ) => {
    setFormData({
      ...formData,
      barcode:
        scannedBarcode,
    });

    setShowScanner(false);
    toast.success(
      "Barcode scanned successfully"
    );
  };

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      if (
        !formData.barcode ||
        !formData.quantity
      ) {
        return toast.error(
          "All fields are required"
        );
      }

      try {
        setLoading(true);

        await action({
          barcode:
            formData.barcode,
          quantity: Number(
            formData.quantity
          ),
          notes:
            formData.notes,
        });

        toast.success(
          successMessage
        );

        setFormData({
          barcode: "",
          quantity: "",
          notes: "",
        });
      } catch (error) {
        toast.error(
          error?.response?.data
            ?.message ||
            "Inventory update failed"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <MainLayout>
      <div className="mx-auto max-w-5xl space-y-6">
        <PageHeader
          title={title}
          description={description}
        />

        <SurfaceCard>
          <div className="p-6 sm:p-8">
            <form
              onSubmit={
                handleSubmit
              }
              className="space-y-5"
            >
              <div>
                <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <label
                    className={
                      formLabelClass
                    }
                  >
                    Barcode
                  </label>

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() =>
                      setShowScanner(
                        true
                      )
                    }
                  >
                    <ScanLine
                      size={16}
                    />
                    Scan Barcode
                  </Button>
                </div>

                <input
                  type="text"
                  name="barcode"
                  value={
                    formData.barcode
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Scan or enter barcode"
                  className={
                    formControlClass
                  }
                />
              </div>

              <div className="grid gap-5 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
                <div>
                  <label
                    className={
                      formLabelClass
                    }
                  >
                    Quantity
                  </label>

                  <input
                    type="number"
                    name="quantity"
                    value={
                      formData.quantity
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter quantity"
                    className={
                      formControlClass
                    }
                  />
                </div>

                <div>
                  <label
                    className={
                      formLabelClass
                    }
                  >
                    Notes
                  </label>

                  <textarea
                    rows="4"
                    name="notes"
                    value={
                      formData.notes
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Optional notes"
                    className={
                      formControlClass
                    }
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                size="lg"
              >
                {loading
                  ? loadingLabel
                  : submitLabel}
              </Button>
            </form>
          </div>
        </SurfaceCard>
      </div>

      {showScanner && (
        <BarcodeScannerModal
          onClose={() =>
            setShowScanner(
              false
            )
          }
          onScan={handleScan}
        />
      )}
    </MainLayout>
  );
};

export default InventoryMovementPage;
