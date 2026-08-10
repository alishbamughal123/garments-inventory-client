import { useState, useEffect } from "react";
import { ScanLine, Printer, User, AlertTriangle, Weight } from "lucide-react";
import toast from "react-hot-toast";
import MainLayout from "../../layouts/MainLayout";
import BarcodeScannerModal from "../../components/common/BarcodeScannerModal";
import Button from "../../components/ui/Button";
import { formControlClass, formLabelClass } from "../../components/ui/formStyles";
import PageHeader from "../../components/ui/PageHeader";
import SurfaceCard from "../../components/ui/SurfaceCard";
import { getCustomers } from "../../services/customer.service";
import { stockOut, getTransactions } from "../../services/inventory.service";
import { useLanguage } from "../../context/LanguageContext";
import logo from "../../assets/logo.png";

const StockOutPage = () => {
  const { t, lang } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // Form State
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [barcode, setBarcode] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [packagingWeightKg, setPackagingWeightKg] = useState("0.2");
  const [notes, setNotes] = useState("");

  // Delivery Note Modal State
  const [activeDeliveryNote, setActiveDeliveryNote] = useState(null);

  const loadInitialData = async () => {
    try {
      const [custRes, txRes] = await Promise.all([
        getCustomers(),
        getTransactions("STOCK_OUT")
      ]);
      setCustomers(custRes.data || []);
      setTransactions(txRes.data || []);
    } catch (err) {
      console.error("Data load error:", err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleScan = (scannedBarcode) => {
    setBarcode(scannedBarcode);
    setShowScanner(false);
    toast.success(lang === "no" ? "Strekkode skannet!" : "Barcode scanned successfully");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCustomerId) {
      return toast.error(lang === "no" ? "MANDATORISK: Velg en kunde!" : "MANDATORY: Customer selection required!");
    }

    if (!barcode || !quantity) {
      return toast.error(lang === "no" ? "Fyll ut strekkode og antall!" : "Barcode and quantity are required!");
    }

    try {
      setLoading(true);

      const payload = {
        customerId: selectedCustomerId,
        packagingWeightKg: Number(packagingWeightKg || 0.2),
        notes,
        items: [
          {
            barcode: barcode.trim(),
            quantity: Number(quantity)
          }
        ]
      };

      const res = await stockOut(payload);
      toast.success(lang === "no" ? "Vareutgang registrert og følgeseddel opprettet!" : "Stock Out processed & Delivery Note created!");

      const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

      // Open Delivery Note Printable Modal
      if (res.data?.deliveryNote || res.data) {
        const dnData = {
          deliveryNoteNumber: res.data?.deliveryNote?.deliveryNoteNumber || `DN-${new Date().getFullYear()}-0001`,
          date: new Date().toLocaleDateString(),
          customer: selectedCustomer || { fullName: "Client", companyName: "" },
          items: res.data?.items || [
            {
              product: { productName: barcode, sku: barcode, color: "-", size: "-" },
              quantity: Number(quantity)
            }
          ],
          totalWeightKg: res.data?.totalWeightKg || 0,
          packagingWeightKg: Number(packagingWeightKg),
          notes
        };
        setActiveDeliveryNote(dnData);
      }

      // Reset form
      setBarcode("");
      setQuantity("1");
      setNotes("");
      loadInitialData();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Stock Out failed");
    } finally {
      setLoading(false);
    }
  };

  const handleReprint = (tx) => {
    const dnData = {
      deliveryNoteNumber: tx.deliveryNote?.deliveryNoteNumber || `DN-${tx.id.slice(0, 8)}`,
      date: new Date(tx.createdAt).toLocaleDateString(),
      customer: tx.customer || { fullName: "Walk-in Client", companyName: "N/A" },
      items: [
        {
          product: tx.product,
          quantity: tx.quantity
        }
      ],
      totalWeightKg: tx.totalWeightKg || 0,
      packagingWeightKg: tx.packagingWeightKg || 0.2,
      notes: tx.notes || ""
    };
    setActiveDeliveryNote(dnData);
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-5xl space-y-6">
        <PageHeader
          title={t("stockOut")}
          description={lang === "no" ? "Registrer utgang til kunde med strekkodeskanning og følgeseddel PDF." : "Record outgoing inventory with mandatory customer selection, barcode scan, and Delivery Note PDF."}
        />

        <SurfaceCard>
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Mandatory Customer Select */}
              <div>
                <label className={formLabelClass}>
                  {t("mandatoryCustomerSelect")} *
                </label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  required
                  className={`${formControlClass} border-blue-200 bg-blue-50/30 font-semibold`}
                >
                  <option value="">{t("selectCustomerPlaceholder")}</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.customerCode ? `[${c.customerCode}] ` : ""}{c.companyName ? `${c.companyName} (${c.fullName})` : c.fullName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Barcode & Scan */}
              <div>
                <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <label className={formLabelClass}>Barcode / SKU *</label>
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
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  placeholder="Scan barcode or enter SKU value"
                  required
                  className={formControlClass}
                />
              </div>

              {/* Quantity, Packaging Weight, Notes */}
              <div className="grid gap-5 md:grid-cols-3">
                <div>
                  <label className={formLabelClass}>{t("quantity")} *</label>
                  <input
                    type="number"
                    min="1"
                    name="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                    className={formControlClass}
                  />
                </div>

                <div>
                  <label className={formLabelClass}>{t("packagingWeightKg")}</label>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    name="packagingWeightKg"
                    value={packagingWeightKg}
                    onChange={(e) => setPackagingWeightKg(e.target.value)}
                    className={formControlClass}
                  />
                </div>

                <div>
                  <label className={formLabelClass}>{t("notes")}</label>
                  <input
                    type="text"
                    name="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Optional notes / PO reference"
                    className={formControlClass}
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading} size="lg">
                {loading ? t("loading") : t("performStockOut")}
              </Button>
            </form>
          </div>
        </SurfaceCard>

        {/* History Table */}
        <SurfaceCard>
          <div className="p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">{t("deliveryNoteHistory")}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-100 text-slate-600 font-bold uppercase border-b border-slate-200">
                  <tr>
                    <th className="p-3 text-left">{t("date")}</th>
                    <th className="p-3 text-left">{t("deliveryNoteNumber")}</th>
                    <th className="p-3 text-left">{t("customers")}</th>
                    <th className="p-3 text-left">{t("product")}</th>
                    <th className="p-3 text-center">{t("quantity")}</th>
                    <th className="p-3 text-right">Parcel Wt</th>
                    <th className="p-3 text-center">Reprint</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50 transition">
                      <td className="p-3 text-slate-500">{new Date(tx.createdAt).toLocaleDateString()}</td>
                      <td className="p-3 font-mono font-bold text-blue-600">
                        {tx.deliveryNote?.deliveryNoteNumber || `DN-${tx.id.slice(0, 8)}`}
                      </td>
                      <td className="p-3 font-semibold text-slate-800">
                        {tx.customer?.fullName || tx.customer?.companyName || "Client"}
                      </td>
                      <td className="p-3 text-slate-700">{tx.product?.productName} ({tx.product?.sku})</td>
                      <td className="p-3 text-center font-bold">{tx.quantity}</td>
                      <td className="p-3 text-right font-bold text-slate-800">{tx.totalWeightKg ? `${tx.totalWeightKg.toFixed(2)} kg` : "N/A"}</td>
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleReprint(tx)}
                          className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition"
                        >
                          <Printer size={14} />
                          <span>PDF</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan="7" className="p-6 text-center text-slate-400">No stock out history found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </SurfaceCard>
      </div>

      {/* Barcode Scanner Modal */}
      {showScanner && (
        <BarcodeScannerModal
          onClose={() => setShowScanner(false)}
          onScan={handleScan}
        />
      )}

      {/* Delivery Note PDF Modal */}
      {activeDeliveryNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto text-slate-900 font-sans">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Delivery Note Printable PDF</span>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition"
                >
                  <Printer size={15} />
                  <span>Print PDF</span>
                </button>
                <button
                  onClick={() => setActiveDeliveryNote(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="p-6 border border-slate-200 rounded-xl space-y-6 bg-white print:p-0 print:border-none">
              <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <img src={logo} alt="Logo" className="h-8 w-8 object-contain" />
                    <span className="text-lg font-black tracking-tight uppercase text-slate-900">Nordic Prowear AS</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Storgata 100, Oslo, Norway • Org nr: NO 987 654 321 MVA</p>
                </div>
                <div className="text-right">
                  <h2 className="text-xl font-extrabold text-blue-600 uppercase tracking-tight">{t("deliveryNote")}</h2>
                  <p className="text-xs font-mono font-bold text-slate-800">{activeDeliveryNote.deliveryNoteNumber}</p>
                  <p className="text-[11px] text-slate-500">Date: {activeDeliveryNote.date}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">RECIPIENT CUSTOMER:</span>
                <p className="font-bold text-sm text-slate-900">{activeDeliveryNote.customer?.companyName || activeDeliveryNote.customer?.fullName}</p>
                <p className="text-slate-600">{activeDeliveryNote.customer?.fullName} • Phone: {activeDeliveryNote.customer?.phoneNumber}</p>
              </div>

              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-2 text-left">SKU / Article</th>
                    <th className="p-2 text-center">Qty</th>
                    <th className="p-2 text-right">Total Parcel Weight</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeDeliveryNote.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="p-2 font-semibold text-slate-900">{it.product?.productName || "Product"} ({it.product?.sku})</td>
                      <td className="p-2 text-center font-bold">{it.quantity}</td>
                      <td className="p-2 text-right font-bold">{activeDeliveryNote.totalWeightKg ? `${activeDeliveryNote.totalWeightKg.toFixed(2)} kg` : "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-[11px] text-slate-500">
                <div className="border-t border-dashed border-slate-300 pt-2">
                  <p>Dispatched By (Nordic Prowear Warehouse):</p>
                </div>
                <div className="border-t border-dashed border-slate-300 pt-2">
                  <p>Received & Signed By Customer:</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default StockOutPage;
