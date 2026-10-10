import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Search, Trash2, Plus, Minus } from "lucide-react";
import toast from "react-hot-toast";
import MainLayout from "../../layouts/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import SurfaceCard from "../../components/ui/SurfaceCard";
import { formControlClass, formLabelClass } from "../../components/ui/formStyles";
import { getSaleById, updateSale } from "../../services/sales.service";
import { getProducts } from "../../services/products.service";
import { appRoutes } from "../../config/routes";

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

  // Confirmed-sale item editing
  const [items, setItems] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [taxOverride, setTaxOverride] = useState(null);
  const [itemsDirty, setItemsDirty] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchSale = async () => {
      try {
        setLoading(true);
        const response = await getSaleById(id);
        const data = response.data;
        setSale(data);
        setFormData({
          notes: data.notes || "",
          paymentMethod: data.paymentMethod,
        });
        setDiscount(data.discount || 0);
        setItems(
          (data.saleItems || []).map((it) => ({
            productId: it.productId,
            productName: it.product?.productName,
            sku: it.product?.sku,
            color: it.product?.color,
            size: it.product?.size,
            quantity: it.quantity,
            unitPrice: Number(it.price),
            // what is physically available for this sale = shelf stock + what this sale already holds
            maxQty: (it.product?.stockQuantity || 0) + it.quantity,
          }))
        );
      } catch (error) {
        toast.error("Failed to load sale record");
        navigate(appRoutes.sales);
      } finally {
        setLoading(false);
      }
    };
    fetchSale();
  }, [id, navigate]);

  // Live product search for adding items to the sale
  useEffect(() => {
    if (productSearch.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const res = await getProducts({ search: productSearch.trim(), all: "true" });
        if (cancelled) return;
        const list = Array.isArray(res.data) ? res.data : res.data?.products || res.products || [];
        setSearchResults(list.slice(0, 20));
      } catch {
        if (!cancelled) setSearchResults([]);
      }
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [productSearch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const markDirty = () => setItemsDirty(true);

  const updateQuantity = (productId, value) => {
    const qty = Math.max(1, parseInt(value, 10) || 1);
    setItems((prev) =>
      prev.map((it) => {
        if (it.productId !== productId) return it;
        if (qty > it.maxQty) {
          toast.error(`Max available: ${it.maxQty}`);
          return it;
        }
        return { ...it, quantity: qty };
      })
    );
    markDirty();
  };

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((it) => it.productId !== productId));
    markDirty();
  };

  const addProduct = (product) => {
    if (items.some((it) => it.productId === product.id)) {
      toast.error("Already in this sale - change its quantity instead");
      return;
    }
    if (product.stockQuantity <= 0) {
      toast.error(`Out of stock: ${product.productName}`);
      return;
    }
    setItems((prev) => [
      ...prev,
      {
        productId: product.id,
        productName: product.productName,
        sku: product.sku,
        color: product.color,
        size: product.size,
        quantity: 1,
        unitPrice: Number(product.salePrice),
        maxQty: product.stockQuantity,
      },
    ]);
    setProductSearch("");
    setSearchResults([]);
    markDirty();
  };

  const subtotal = useMemo(
    () => items.reduce((acc, it) => acc + it.quantity * it.unitPrice, 0),
    [items]
  );
  const autoTax = Math.round(Math.max(0, subtotal - Number(discount || 0)) * 0.25 * 100) / 100;
  const tax = taxOverride !== null ? taxOverride : itemsDirty ? autoTax : Number(sale?.tax || 0);
  const grandTotal = Math.max(0, subtotal - Number(discount || 0) + Number(tax));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error("A sale needs at least one item. To remove the whole sale, delete it instead.");
      return;
    }

    try {
      setSaving(true);
      await updateSale(id, {
        ...formData,
        items: items.map((it) => ({
          productId: it.productId,
          quantity: it.quantity,
          unitPrice: it.unitPrice,
        })),
        discount: Number(discount || 0),
        tax: Number(tax),
      });
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
      <div className="mx-auto max-w-4xl space-y-6">
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
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Customer</p>
                <p className="text-sm font-bold text-slate-900">
                  {sale?.customer?.companyName || sale?.customer?.fullName || "Walk-in Customer"}
                </p>
              </div>
            </div>

            {/* ITEMS */}
            <div className="border-t border-slate-100 pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Items & Quantities</h3>
                <span className="text-xs font-semibold text-slate-500">{items.length} articles</span>
              </div>

              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Add another product: search name, SKU, style..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-900 outline-none focus:border-brand-500 focus:bg-white transition"
                />
                {searchResults.length > 0 && (
                  <div className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-lg divide-y divide-slate-100">
                    {searchResults.map((p) => (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() => addProduct(p)}
                        className="flex w-full items-center justify-between p-3 text-left text-xs hover:bg-brand-50"
                      >
                        <span>
                          <span className="block font-bold text-slate-900">{p.productName}</span>
                          <span className="font-mono text-[10px] text-slate-500">
                            {p.sku} • Stock: {p.stockQuantity}
                          </span>
                        </span>
                        <span className="font-mono font-bold text-brand-600">
                          NOK {Number(p.salePrice).toLocaleString()}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
                    <tr>
                      <th className="p-3">Article</th>
                      <th className="p-3 text-center">Quantity</th>
                      <th className="p-3 text-right">Unit Price</th>
                      <th className="p-3 text-right">Total</th>
                      <th className="p-3 text-center"> </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {items.map((it) => (
                      <tr key={it.productId}>
                        <td className="p-3 font-bold text-slate-900">
                          {it.productName}
                          <span className="block text-[10px] font-mono font-medium text-slate-400">
                            {it.sku} ({it.color}
                            {it.size ? ` / ${it.size}` : ""})
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => updateQuantity(it.productId, it.quantity - 1)}
                              className="rounded-lg p-1 text-slate-500 hover:bg-slate-200"
                            >
                              <Minus size={13} />
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={it.quantity}
                              onChange={(e) => updateQuantity(it.productId, e.target.value)}
                              className="w-14 rounded-lg border border-slate-200 bg-slate-50 p-1 text-center font-bold text-slate-900 outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => updateQuantity(it.productId, it.quantity + 1)}
                              className="rounded-lg p-1 text-slate-500 hover:bg-slate-200"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                        </td>
                        <td className="p-3 text-right font-mono text-slate-600">
                          NOK {it.unitPrice.toLocaleString()}
                        </td>
                        <td className="p-3 text-right font-mono font-black text-brand-600">
                          NOK {(it.quantity * it.unitPrice).toLocaleString()}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            type="button"
                            onClick={() => removeItem(it.productId)}
                            className="text-red-500 transition hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {items.length === 0 && (
                      <tr>
                        <td colSpan="5" className="p-6 text-center text-slate-400">
                          No items. Add a product above.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className={formLabelClass}>Discount (NOK)</label>
                  <input
                    type="number"
                    min="0"
                    value={discount}
                    onChange={(e) => {
                      setDiscount(e.target.value);
                      markDirty();
                    }}
                    className={formControlClass}
                  />
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <label className={formLabelClass}>VAT / MVA (NOK)</label>
                    {taxOverride !== null && (
                      <button
                        type="button"
                        onClick={() => setTaxOverride(null)}
                        className="text-[10px] font-bold text-brand-600 hover:underline"
                      >
                        Reset 25% VAT
                      </button>
                    )}
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={tax}
                    onChange={(e) => setTaxOverride(Number(e.target.value))}
                    className={formControlClass}
                  />
                </div>
                <div className="flex flex-col justify-end rounded-xl bg-slate-50 p-3 text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Grand Total</span>
                  <span className="font-mono text-lg font-black text-brand-600">
                    NOK {grandTotal.toLocaleString()}
                  </span>
                  {Number(sale?.grandTotal) !== grandTotal && (
                    <span className="text-[10px] text-slate-400">was NOK {Number(sale?.grandTotal).toLocaleString()}</span>
                  )}
                </div>
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
                <option value="CARD">Bank Card / POS Terminal</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="INVOICE">Corporate B2B Invoice</option>
                <option value="JAZZCASH">JazzCash</option>
                <option value="EASYPAISA">EasyPaisa</option>
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
                <strong>Note:</strong> Changing quantities or items automatically adjusts stock levels, customer totals
                and records every stock movement in the inventory transaction history.
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
