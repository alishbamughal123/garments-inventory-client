import {
  useState,
} from "react";

import toast from "react-hot-toast";

import MainLayout from "../../layouts/MainLayout";

import BarcodeScannerModal from "../../components/common/BarcodeScannerModal";

import {
  stockIn,
} from "../../services/inventory.service";

const StockInPage = () => {
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

        await stockIn({
          barcode:
            formData.barcode,
          quantity: Number(
            formData.quantity
          ),
          notes:
            formData.notes,
        });

        toast.success(
          "Stock added successfully"
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
            "Stock IN failed"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <MainLayout>

      <div className="mb-6">

        <h1 className="text-3xl font-bold text-slate-900">
          Stock IN
        </h1>

        <p className="text-slate-500 mt-1">
          Add inventory stock
        </p>

      </div>

      <div
        className="
          bg-white
          rounded-2xl
          border
          border-slate-200
          p-8
          max-w-3xl
        "
      >

        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-5"
        >

          <div>

            <div className="flex items-center justify-between mb-2">

              <label className="text-sm font-medium text-slate-700">
                Barcode
              </label>

              <button
                type="button"
                onClick={() =>
                  setShowScanner(
                    true
                  )
                }
                className="
                  bg-slate-100
                  hover:bg-slate-200
                  px-4
                  py-2
                  rounded-xl
                  text-sm
                  font-medium
                  transition
                "
              >
                📷 Scan Barcode
              </button>

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
              className="
                w-full
                border
                border-slate-300
                rounded-xl
                px-4
                py-3
                outline-none
                focus:ring-2
                focus:ring-blue-500
              "
            />

          </div>

          <div>

            <label className="block text-sm font-medium text-slate-700 mb-2">
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
              className="
                w-full
                border
                border-slate-300
                rounded-xl
                px-4
                py-3
                outline-none
                focus:ring-2
                focus:ring-blue-500
              "
            />

          </div>

          <div>

            <label className="block text-sm font-medium text-slate-700 mb-2">
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
              className="
                w-full
                border
                border-slate-300
                rounded-xl
                px-4
                py-3
                outline-none
                focus:ring-2
                focus:ring-blue-500
              "
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              bg-blue-500
              hover:bg-blue-600
              text-white
              px-6
              py-3
              rounded-xl
              font-medium
              transition
            "
          >
            {loading
              ? "Adding..."
              : "Add Stock"}
          </button>

        </form>

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

export default StockInPage;