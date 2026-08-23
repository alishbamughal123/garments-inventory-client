import React, { useState, useEffect } from "react";
import { X, Calculator, DollarSign, ArrowRight, RefreshCw, CheckCircle, Percent } from "lucide-react";
import Button from "../ui/Button";
import { bulkUpdateCostPrice, getProducts } from "../../services/products.service";
import { useLanguage } from "../../context/LanguageContext";
import toast from "react-hot-toast";

const CostPriceModal = ({ isOpen, onClose, baseStyles = [], onSuccess }) => {
  const { t, isNo } = useLanguage();

  const [selectedStyle, setSelectedStyle] = useState("");
  const [availableColors, setAvailableColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState("ALL");
  
  // Calculator inputs
  const [calcMode, setCalcMode] = useState("usd"); // 'usd' or 'direct'
  const [usdPrice, setUsdPrice] = useState("");
  const [markupPercent, setMarkupPercent] = useState(20);
  const [exchangeRate, setExchangeRate] = useState(10);
  const [directNokPrice, setDirectNokPrice] = useState("");
  const [reason, setReason] = useState("Invoice Cost Update (+20%)");

  const [loadingColors, setLoadingColors] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [affectedCount, setAffectedCount] = useState(0);

  // Set default style when modal opens or baseStyles change
  useEffect(() => {
    if (isOpen && baseStyles.length > 0 && !selectedStyle) {
      const first = typeof baseStyles[0] === "string" ? baseStyles[0] : (baseStyles[0]?.baseStyleNumber || baseStyles[0]?.styleNumber || "");
      setSelectedStyle(first);
    }
  }, [isOpen, baseStyles, selectedStyle]);

  // Load colors when selectedStyle changes
  useEffect(() => {
    if (!selectedStyle) {
      setAvailableColors([]);
      setAffectedCount(0);
      return;
    }

    let isMounted = true;
    (async () => {
      try {
        setLoadingColors(true);
        const res = await getProducts({ search: selectedStyle, limit: 100 });
        const items = Array.isArray(res.data) ? res.data : (res.data?.products || []);
        
        const matched = items.filter(p => {
          const b = p.baseStyleNumber || (p.styleNumber ? p.styleNumber.split("-")[0] : p.sku.split("-")[0]);
          return b === selectedStyle;
        });

        if (isMounted) {
          const colors = [...new Set(matched.map(m => m.color).filter(Boolean))];
          setAvailableColors(colors);
          setSelectedColor("ALL");
          setAffectedCount(matched.length);
        }
      } catch (err) {
        console.error("Failed to fetch variants for style", err);
      } finally {
        if (isMounted) setLoadingColors(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [selectedStyle]);

  // Update affected count when color filter changes
  useEffect(() => {
    if (!selectedStyle) return;
    (async () => {
      try {
        const res = await getProducts({ search: selectedStyle, limit: 100 });
        const items = Array.isArray(res.data) ? res.data : (res.data?.products || []);
        const matched = items.filter(p => {
          const b = p.baseStyleNumber || (p.styleNumber ? p.styleNumber.split("-")[0] : p.sku.split("-")[0]);
          if (b !== selectedStyle) return false;
          if (selectedColor !== "ALL" && p.color !== selectedColor) return false;
          return true;
        });
        setAffectedCount(matched.length);
      } catch (e) {
        // ignore
      }
    })();
  }, [selectedStyle, selectedColor]);

  if (!isOpen) return null;

  // Calculate NOK price dynamically
  const numUsd = parseFloat(usdPrice) || 0;
  const numMarkup = parseFloat(markupPercent) || 0;
  const numRate = parseFloat(exchangeRate) || 0;

  const usdWithMarkup = numUsd * (1 + numMarkup / 100);
  const calculatedNok = Number((usdWithMarkup * numRate).toFixed(2));
  const finalPriceToApply = calcMode === "usd" ? calculatedNok : parseFloat(directNokPrice) || 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStyle) {
      toast.error(isNo ? "Vennligst velg en artikkelstil" : "Please select an article base style");
      return;
    }
    if (finalPriceToApply <= 0) {
      toast.error(isNo ? "Kostpris må være større enn 0" : "Cost price must be greater than 0");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        baseStyleNumber: selectedStyle,
        colors: selectedColor === "ALL" ? undefined : [selectedColor],
        purchasePrice: finalPriceToApply,
        reason: reason.trim() || `Invoice Cost Price Update (+${markupPercent}%)`,
      };

      const res = await bulkUpdateCostPrice(payload);
      toast.success(
        isNo
          ? `Kostpris oppdatert for ${res.data?.count || affectedCount} varianter!`
          : `Cost price updated for ${res.data?.count || affectedCount} variants!`
      );
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error("Bulk cost price update error:", err);
      toast.error(err.response?.data?.message || (isNo ? "Oppdatering mislyktes" : "Failed to update cost price"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {isNo ? "Kostprisbehandler & Valutakalkulator" : "Cost Price Manager & Calculator"}
              </h3>
              <p className="text-xs text-slate-500">
                {isNo
                  ? "Beregn kostpris (NOK) fra USD-faktura med 20 % påslag og valutakurs"
                  : "Calculate & update NOK cost price from USD invoices with markup and exchange rate"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Base Style Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {isNo ? "Artikkel / Basis Stil" : "Article / Base Style"}
              </label>
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden"
              >
                <option value="">{isNo ? "-- Velg Stil --" : "-- Select Style --"}</option>
                {baseStyles.map((st) => {
                  const styleNo = typeof st === "string" ? st : (st.baseStyleNumber || st.styleNumber);
                  const styleName = typeof st === "object" ? st.styleName : "";
                  return (
                    <option key={styleNo} value={styleNo}>
                      {styleNo} {styleName ? `(${styleName})` : ""}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Color Option */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {isNo ? "Fargevariant" : "Color Option"}
              </label>
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                disabled={loadingColors || availableColors.length === 0}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden disabled:opacity-60"
              >
                <option value="ALL">
                  {isNo ? `Alle farger (${availableColors.length})` : `All Colors (${availableColors.length})`}
                </option>
                {availableColors.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setCalcMode("usd")}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition ${
                calcMode === "usd" ? "bg-white text-blue-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              {isNo ? "USD Faktura + 20 % Påslag" : "USD Invoice + Markup"}
            </button>
            <button
              type="button"
              onClick={() => setCalcMode("direct")}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition ${
                calcMode === "direct" ? "bg-white text-blue-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              {isNo ? "Direkte NOK Kostpris" : "Direct NOK Price"}
            </button>
          </div>

          {/* Mode 1: USD Invoice Calculation */}
          {calcMode === "usd" && (
            <div className="rounded-xl bg-blue-50/60 border border-blue-100 p-4 space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-blue-900 uppercase">
                    USD Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    placeholder="3.81"
                    value={usdPrice}
                    onChange={(e) => setUsdPrice(e.target.value)}
                    required={calcMode === "usd"}
                    className="w-full mt-1 rounded-lg border border-blue-200 bg-white px-2.5 py-1.5 text-sm font-bold text-slate-900 focus:outline-hidden focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-blue-900 uppercase flex items-center gap-1">
                    <Percent className="w-3 h-3" /> Markup %
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    placeholder="20"
                    value={markupPercent}
                    onChange={(e) => setMarkupPercent(e.target.value)}
                    className="w-full mt-1 rounded-lg border border-blue-200 bg-white px-2.5 py-1.5 text-sm font-bold text-slate-900 focus:outline-hidden focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-blue-900 uppercase">
                    1 USD = NOK
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="10"
                    value={exchangeRate}
                    onChange={(e) => setExchangeRate(e.target.value)}
                    className="w-full mt-1 rounded-lg border border-blue-200 bg-white px-2.5 py-1.5 text-sm font-bold text-slate-900 focus:outline-hidden focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              {/* Dynamic Formula Result Breakdown */}
              <div className="rounded-lg bg-white p-3 border border-blue-100 text-xs text-slate-700 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400">
                    ${numUsd.toFixed(2)} + {numMarkup}% (${usdWithMarkup.toFixed(3)}) × {numRate} NOK
                  </div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5 font-mono">
                    = NOK {calculatedNok.toFixed(2)}
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
                  {isNo ? "Kostpris per stk" : "Cost per unit"}
                </span>
              </div>
            </div>
          )}

          {/* Mode 2: Direct NOK Input */}
          {calcMode === "direct" && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {isNo ? "Kostpris i NOK per enhet" : "Cost Price in NOK per unit"}
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="f.eks. 45.72"
                value={directNokPrice}
                onChange={(e) => setDirectNokPrice(e.target.value)}
                required={calcMode === "direct"}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden font-mono"
              />
            </div>
          )}

          {/* Optional reason / audit log note */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              {isNo ? "Oppdateringsnotat / Årsak (valgfritt)" : "Update Reason / Note (optional)"}
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Invoice NP10002 (+20% CFR Oslo)"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-hidden"
            />
          </div>

          {/* Summary & Impact Banner */}
          <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                {isNo ? "Påvirker" : "Will update"}{" "}
                <strong className="font-mono text-slate-900">{affectedCount}</strong>{" "}
                {isNo ? "størrelsesvarianter" : "size variants"}
              </span>
            </div>
            <span className="font-bold text-blue-700 font-mono text-sm">
              NOK {finalPriceToApply.toFixed(2)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="secondary" type="button" onClick={onClose} disabled={submitting}>
              {t("cancel")}
            </Button>
            <Button
              variant="primary"
              type="submit"
              loading={submitting}
              disabled={affectedCount === 0 || finalPriceToApply <= 0}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <RefreshCw className={`w-4 h-4 mr-1.5 ${submitting ? "animate-spin" : ""}`} />
              {isNo ? "Oppdater kostpris for alle" : "Apply Cost Price"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CostPriceModal;
