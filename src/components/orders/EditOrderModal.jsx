import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { X, Save, Search, Plus, Minus, Trash2, MapPin } from "lucide-react";
import api from "../../services/api";

/**
 * Edit a placed / confirmed B2B order (quantities, items, shipping address, notes).
 * Used from the admin B2B Orders page and the customer portal order history.
 * Eligibility is enforced by the server; `canEdit` here only controls the UI.
 */
const EditOrderModal = ({ order, isNo = false, onClose, onSaved }) => {
  const L = (en, no) => (isNo ? no : en);

  const [lines, setLines] = useState(() =>
    (order.orderItems || []).map((it) => ({
      productId: it.productId,
      name: it.product?.productName,
      sku: it.product?.sku,
      color: it.product?.color,
      size: it.product?.size,
      quantity: it.quantity,
      unitPrice: Number(it.unitPrice),
      selectedLogo: it.selectedLogo || null,
      customNote: it.customNote || null,
    }))
  );
  const [shippingAddress, setShippingAddress] = useState(order.shippingAddress || "");
  const [notes, setNotes] = useState(order.notes || "");
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  const stockAlreadyOut = !!order.deliveryNote;

  useEffect(() => {
    if (search.trim().length < 2) {
      setResults([]);
      return;
    }
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const res = await api.get("/portal/catalog", { params: { search: search.trim() } });
        if (!cancelled) setResults((res.data.data || []).slice(0, 15));
      } catch {
        if (!cancelled) setResults([]);
      }
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [search]);

  const setQty = (productId, value) => {
    const qty = Math.max(1, parseInt(value, 10) || 1);
    setLines((prev) => prev.map((l) => (l.productId === productId ? { ...l, quantity: qty } : l)));
  };

  const removeLine = (productId) => {
    setLines((prev) => prev.filter((l) => l.productId !== productId));
  };

  const addProduct = (p) => {
    if (lines.some((l) => l.productId === p.id)) {
      toast.error(L("Already in this order - change its quantity instead", "Allerede i ordren - endre antall i stedet"));
      return;
    }
    setLines((prev) => [
      ...prev,
      {
        productId: p.id,
        name: p.productName,
        sku: p.sku,
        color: p.color,
        size: p.size,
        quantity: 1,
        unitPrice: Number(p.effectivePrice ?? p.salePrice),
        selectedLogo: null,
        customNote: null,
      },
    ]);
    setSearch("");
    setResults([]);
  };

  const subtotal = useMemo(() => lines.reduce((s, l) => s + l.quantity * l.unitPrice, 0), [lines]);
  const tax = subtotal * 0.25;
  const total = subtotal + tax;

  const handleSave = async () => {
    if (lines.length === 0) {
      toast.error(L("Order must contain at least one item", "Ordren må inneholde minst én vare"));
      return;
    }
    try {
      setSaving(true);
      const res = await api.put(`/portal/orders/${order.id}`, {
        items: lines.map((l) => ({
          productId: l.productId,
          quantity: l.quantity,
          selectedLogo: l.selectedLogo,
          customNote: l.customNote,
        })),
        shippingAddress,
        notes,
      });
      toast.success(L("Order updated successfully", "Ordren er oppdatert"));
      onSaved?.(res.data.data);
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || L("Failed to update order", "Kunne ikke oppdatere ordren"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-2 backdrop-blur-md sm:p-4">
      <div className="max-h-[92vh] w-full max-w-3xl space-y-4 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-2xl sm:rounded-3xl sm:p-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-black text-slate-900 sm:text-base">
              {L("Edit Order", "Rediger ordre")} <span className="font-mono text-brand-600">{order.orderNumber}</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              {L(
                "Changes update the order total and the confirmation receipt.",
                "Endringer oppdaterer ordresummen og bekreftelsen."
              )}
            </p>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        {stockAlreadyOut && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] font-semibold text-amber-800">
            {L(
              "Stock was already deducted for this order. Quantity changes will automatically adjust inventory.",
              "Lager er allerede trukket for denne ordren. Endringer i antall justerer lageret automatisk."
            )}
          </div>
        )}

        {/* Add product */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={L("Add another article: search name, SKU, style...", "Legg til artikkel: søk navn, SKU, stil...")}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-xs font-semibold text-slate-900 outline-none transition focus:border-brand-500 focus:bg-white"
          />
          {results.length > 0 && (
            <div className="absolute z-20 mt-1 max-h-52 w-full divide-y divide-slate-100 overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-lg">
              {results.map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => addProduct(p)}
                  className="flex w-full items-center justify-between p-3 text-left text-xs hover:bg-brand-50"
                >
                  <span>
                    <span className="block font-bold text-slate-900">{p.productName}</span>
                    <span className="font-mono text-[10px] text-slate-500">
                      {p.sku} • {p.color}
                      {p.size ? ` / ${p.size}` : ""}
                    </span>
                  </span>
                  <span className="font-mono font-bold text-brand-600">
                    NOK {Number(p.effectivePrice ?? p.salePrice).toLocaleString()}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Lines */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 font-bold uppercase text-slate-500">
              <tr>
                <th className="p-3">{L("Article", "Artikkel")}</th>
                <th className="p-3 text-center">{L("Qty", "Ant.")}</th>
                <th className="p-3 text-right">{L("Total", "Totalt")}</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {lines.map((l) => (
                <tr key={l.productId}>
                  <td className="p-3 font-bold text-slate-900">
                    {l.name}
                    <span className="block font-mono text-[10px] font-medium text-slate-400">
                      {l.sku} ({l.color}
                      {l.size ? ` / ${l.size}` : ""})
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => setQty(l.productId, l.quantity - 1)}
                        className="rounded-lg p-1 text-slate-500 hover:bg-slate-200"
                      >
                        <Minus size={13} />
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={l.quantity}
                        onChange={(e) => setQty(l.productId, e.target.value)}
                        className="w-14 rounded-lg border border-slate-200 bg-slate-50 p-1 text-center font-bold outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setQty(l.productId, l.quantity + 1)}
                        className="rounded-lg p-1 text-slate-500 hover:bg-slate-200"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </td>
                  <td className="p-3 text-right font-mono font-black text-brand-600">
                    NOK {(l.quantity * l.unitPrice).toLocaleString()}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      type="button"
                      onClick={() => removeLine(l.productId)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Shipping address & notes */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 flex items-center gap-1 text-[11px] font-bold text-slate-700">
              <MapPin size={12} className="text-brand-600" />
              {L("Shipping Address", "Leveringsadresse")}
            </label>
            <textarea
              rows={3}
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-brand-500 focus:bg-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-bold text-slate-700">{L("Order Notes", "Ordrenotater")}</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-brand-500 focus:bg-white"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-slate-500">
            {L("Subtotal", "Delsum")}: <b className="font-mono text-slate-900">NOK {subtotal.toLocaleString()}</b>
            {"  •  "}MVA 25%: <b className="font-mono text-slate-900">NOK {tax.toLocaleString()}</b>
            {"  •  "}
            {L("Total", "Totalt")}: <b className="font-mono text-brand-700">NOK {total.toLocaleString()}</b>
            {Number(order.totalAmount) !== Number(total.toFixed(2)) && (
              <span className="ml-2 text-[10px] text-slate-400">
                ({L("was", "var")} NOK {Number(order.totalAmount).toLocaleString()})
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200"
            >
              {L("Cancel", "Avbryt")}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-700 disabled:opacity-60"
            >
              <Save size={14} />
              {saving ? L("Saving...", "Lagrer...") : L("Save Changes", "Lagre endringer")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditOrderModal;
