import { useState, useEffect } from "react";
import {
  X,
  Plus,
  Trash2,
  Save,
  Ruler,
  AlertCircle,
  Sparkles,
  Layers,
  Check
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { useLanguage } from "../../context/LanguageContext";

const PRESET_COLOR_BADGES = [
  { name: "yellow", colorHex: "#eab308", textHex: "#854d0e", bgLight: "#fef9c3", border: "#fde047" },
  { name: "green", colorHex: "#22c55e", textHex: "#14532d", bgLight: "#dcfce7", border: "#86efac" },
  { name: "medium blue", colorHex: "#3b82f6", textHex: "#1e3a8a", bgLight: "#dbeafe", border: "#93c5fd" },
  { name: "red", colorHex: "#ef4444", textHex: "#7f1d1d", bgLight: "#fee2e2", border: "#fca5a5" },
  { name: "black", colorHex: "#1e293b", textHex: "#ffffff", bgLight: "#f1f5f9", border: "#cbd5e1" },
  { name: "violet", colorHex: "#8b5cf6", textHex: "#ffffff", bgLight: "#ede9fe", border: "#c4b5fd" },
  { name: "orange", colorHex: "#f97316", textHex: "#7c2d12", bgLight: "#ffedd5", border: "#fdba74" },
  { name: "grey", colorHex: "#64748b", textHex: "#ffffff", bgLight: "#f1f5f9", border: "#cbd5e1" },
];

const DEFAULT_SIZES = [
  { key: "XS", label: "X-SMALL", colorBadge: "yellow", colorHex: "#eab308", textHex: "#854d0e", bgLight: "#fef9c3", border: "#fde047" },
  { key: "S", label: "SMALL", colorBadge: "green", colorHex: "#22c55e", textHex: "#14532d", bgLight: "#dcfce7", border: "#86efac" },
  { key: "M", label: "MEDIUM", colorBadge: "medium blue", colorHex: "#3b82f6", textHex: "#1e3a8a", bgLight: "#dbeafe", border: "#93c5fd" },
  { key: "L", label: "LARGE", colorBadge: "red", colorHex: "#ef4444", textHex: "#7f1d1d", bgLight: "#fee2e2", border: "#fca5a5" },
  { key: "XL", label: "X-LARGE", colorBadge: "black", colorHex: "#1e293b", textHex: "#ffffff", bgLight: "#f1f5f9", border: "#cbd5e1" },
  { key: "2XL", label: "2X-LARGE", colorBadge: "violet", colorHex: "#8b5cf6", textHex: "#ffffff", bgLight: "#ede9fe", border: "#c4b5fd" },
];

const DEFAULT_MEASUREMENTS = [
  { code: "A", name: "Chest Width", norwegianName: "Brystvidde", tolerance: "± 1", values: { XS: "", S: "", M: "", L: "", XL: "", "2XL": "" } },
  { code: "B", name: "Width down", norwegianName: "Bunnvidde", tolerance: "± 1", values: { XS: "", S: "", M: "", L: "", XL: "", "2XL": "" } },
  { code: "C", name: "Height neck opening at the back", norwegianName: "Halsåpning høyde bak", tolerance: "± 0.5", values: { XS: "", S: "", M: "", L: "", XL: "", "2XL": "" } },
  { code: "D", name: "Height v-neck-opening at the front", norwegianName: "V-hals åpning foran", tolerance: "± 0.75", values: { XS: "", S: "", M: "", L: "", XL: "", "2XL": "" } },
  { code: "E", name: "Back length from neck opening", norwegianName: "Rygglengde fra hals", tolerance: "± 1", values: { XS: "", S: "", M: "", L: "", XL: "", "2XL": "" } },
  { code: "F", name: "Sleeve length from neck opening", norwegianName: "Ermelengde fra hals", tolerance: "± 1", values: { XS: "", S: "", M: "", L: "", XL: "", "2XL": "" } },
  { code: "G", name: "Width neckopening", norwegianName: "Halsvidde", tolerance: "± 0.75", values: { XS: "", S: "", M: "", L: "", XL: "", "2XL": "" } },
  { code: "H", name: "Sleeve Width", norwegianName: "Ermevidde", tolerance: "± 0.5", values: { XS: "", S: "", M: "", L: "", XL: "", "2XL": "" } },
  { code: "I", name: "Distance chest pocket from side seam", norwegianName: "Avstand brystlomme fra sidesøm", tolerance: "—", values: { XS: "", S: "", M: "", L: "", XL: "", "2XL": "" } },
];

const SizeChartModal = ({
  isOpen,
  onClose,
  onSaved,
  initialData = null,
  existingStyles = []
}) => {
  const { isNo } = useLanguage();
  const [styleNumber, setStyleNumber] = useState("");
  const [styleName, setStyleName] = useState("");
  const [unit, setUnit] = useState("cm");
  const [sizes, setSizes] = useState(DEFAULT_SIZES);
  const [measurements, setMeasurements] = useState(DEFAULT_MEASUREMENTS);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setStyleNumber(initialData.styleNumber || "");
      setStyleName(initialData.styleName || initialData.title || "");
      setUnit(initialData.unit || "cm");
      if (initialData.sizes && initialData.sizes.length > 0) {
        setSizes(initialData.sizes);
      }
      if (initialData.measurements && initialData.measurements.length > 0) {
        setMeasurements(initialData.measurements);
      }
      setNotes(initialData.notes || "");
    } else {
      setStyleNumber("");
      setStyleName("");
      setUnit("cm");
      setSizes(DEFAULT_SIZES);
      setMeasurements(DEFAULT_MEASUREMENTS);
      setNotes("");
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleMeasurementChange = (rowIndex, sizeKey, val) => {
    setMeasurements((prev) => {
      const copy = [...prev];
      copy[rowIndex] = {
        ...copy[rowIndex],
        values: {
          ...copy[rowIndex].values,
          [sizeKey]: val,
        },
      };
      return copy;
    });
  };

  const handleRowFieldChange = (rowIndex, field, val) => {
    setMeasurements((prev) => {
      const copy = [...prev];
      copy[rowIndex] = {
        ...copy[rowIndex],
        [field]: val,
      };
      return copy;
    });
  };

  const handleAddRow = () => {
    const nextCode = String.fromCharCode(65 + measurements.length);
    const newRow = {
      code: nextCode,
      name: `Measurement ${nextCode}`,
      norwegianName: "",
      tolerance: "± 1",
      values: {},
    };
    sizes.forEach((s) => {
      newRow.values[s.key] = "";
    });
    setMeasurements([...measurements, newRow]);
  };

  const handleRemoveRow = (rowIndex) => {
    if (measurements.length <= 1) {
      toast.error("At least one measurement row is required");
      return;
    }
    setMeasurements(measurements.filter((_, idx) => idx !== rowIndex));
  };

  const handleSizeBadgeChange = (sizeIndex, badgeName) => {
    const badgeObj = PRESET_COLOR_BADGES.find((b) => b.name === badgeName);
    if (!badgeObj) return;

    setSizes((prev) => {
      const copy = [...prev];
      copy[sizeIndex] = {
        ...copy[sizeIndex],
        colorBadge: badgeObj.name,
        colorHex: badgeObj.colorHex,
        textHex: badgeObj.textHex,
        bgLight: badgeObj.bgLight,
        border: badgeObj.border,
      };
      return copy;
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!styleNumber.trim()) {
      toast.error(isNo ? "Vennligst oppgi stilnummer" : "Please enter a style number");
      return;
    }

    const payload = {
      styleNumber: styleNumber.trim(),
      title: styleName.trim()
        ? `Size chart for Style #${styleNumber.trim()} (${styleName.trim()})`
        : `Size chart for Style #${styleNumber.trim()}`,
      applicableStyles: [styleNumber.trim()],
      sizes,
      measurements,
      unit,
      notes,
    };

    setSaving(true);
    try {
      await api.post("/size-charts", payload);
      toast.success(
        isNo
          ? `Måleskjema for Style #${styleNumber} lagret i databasen!`
          : `Size chart for Style #${styleNumber} saved to database!`
      );
      if (onSaved) onSaved(payload);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to save size chart");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-5xl max-h-[92vh] bg-white rounded-3xl p-6 sm:p-8 overflow-y-auto relative shadow-2xl border border-slate-200 flex flex-col space-y-6">
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
              <Ruler className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                {initialData ? (isNo ? "Rediger Måleskjema" : "Edit Size Chart") : (isNo ? "Legg til nytt Måleskjema" : "+ Add Article Size Chart")}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {isNo ? "Konfigurer spesifikke mål (A-Z) og fargekodede størrelser for en stil." : "Configure exact measurement specs (A-Z) and color-coded sizes for an article style."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSave} className="space-y-6 flex-1">
          {/* TOP FIELDS: STYLE NO, STYLE NAME, UNIT */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isNo ? "Stilnummer *" : "Style Number *"}{" "}
                <span className="text-slate-400 font-normal">(f.eks. 10105, 10106)</span>
              </label>
              <input
                type="text"
                value={styleNumber}
                onChange={(e) => setStyleNumber(e.target.value)}
                placeholder="10105"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold font-mono text-slate-900 focus:bg-white focus:border-blue-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isNo ? "Stil- / Artikkelnavn" : "Style / Article Name"}{" "}
                <span className="text-slate-400 font-normal">(f.eks. Lillehammer)</span>
              </label>
              <input
                type="text"
                value={styleName}
                onChange={(e) => setStyleName(e.target.value)}
                placeholder={isNo ? "Lillehammer - Scrubs" : "Lillehammer - Scrubs"}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:border-blue-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isNo ? "Måleenhet" : "Measurement Unit"}
              </label>
              <div className="flex items-center gap-2 pt-0.5">
                {["cm", "inch"].map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUnit(u)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition capitalize ${
                      unit === u
                        ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {u === "cm" ? (isNo ? "Centimeter (cm)" : "Centimeters (cm)") : (isNo ? "Tommer (in)" : "Inches (in)")}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SIZES & COLOR BADGE PICKER ROW */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                {isNo ? "Aktive Størrelser & Fargebrikker" : "Active Sizes & Color Badges"}
              </span>
              <span className="text-[11px] text-slate-400">
                {isNo ? "Velg fargemerker som matcher fysiske klesetiketter" : "Choose badge colors to match physical garment tags"}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
              {sizes.map((sz, idx) => (
                <div key={sz.key} className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-slate-800">{sz.label}</span>
                    <span
                      className="w-3 h-3 rounded-full border border-black/20"
                      style={{ backgroundColor: sz.colorHex }}
                    />
                  </div>

                  <select
                    value={sz.colorBadge}
                    onChange={(e) => handleSizeBadgeChange(idx, e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1 px-1.5 text-[11px] font-semibold text-slate-700 outline-none capitalize"
                  >
                    {PRESET_COLOR_BADGES.map((b) => (
                      <option key={b.name} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* MEASUREMENT MATRIX TABLE INPUT */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  {isNo ? "Målespesifikasjoner (Rader A - Z)" : "Measurement Specs (Rows A - Z)"}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {isNo ? "Fyll inn nøyaktige mål for hver størrelseskolonne." : "Enter exact measurements for each size column."}
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddRow}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isNo ? "+ Legg til rad" : "+ Add Row"}</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs max-h-[360px]">
              <table className="w-full text-xs text-left border-collapse min-w-[750px]">
                <thead className="bg-slate-800 text-white font-bold sticky top-0 z-20">
                  <tr>
                    <th className="py-3 px-3 w-16 text-center">{isNo ? "Kode" : "Code"}</th>
                    <th className="py-3 px-3 min-w-[180px]">{isNo ? "Målepunkt / Navn" : "Measurement Name"}</th>
                    {sizes.map((s) => (
                      <th key={s.key} className="py-3 px-2 text-center min-w-[70px]">
                        <span className="font-mono">{s.key}</span>
                      </th>
                    ))}
                    <th className="py-3 px-2 w-24 text-center">Tol.</th>
                    <th className="py-3 px-2 w-12 text-center">Del</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {measurements.map((m, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70">
                      {/* Code */}
                      <td className="py-2.5 px-2 text-center">
                        <input
                          type="text"
                          value={m.code}
                          onChange={(e) => handleRowFieldChange(idx, "code", e.target.value)}
                          className="min-w-[36px] max-w-[60px] px-1 text-center bg-blue-50 border border-blue-200 rounded-md py-1 font-bold font-mono text-blue-800 text-xs outline-none focus:border-blue-500"
                        />
                      </td>

                      {/* Name */}
                      <td className="py-2.5 px-2">
                        <input
                          type="text"
                          value={m.name}
                          onChange={(e) => handleRowFieldChange(idx, "name", e.target.value)}
                          placeholder="e.g. Chest Width"
                          className="w-full bg-white border border-slate-200 rounded-md py-1 px-2 font-semibold text-slate-800 text-xs"
                        />
                      </td>

                      {/* Size Values */}
                      {sizes.map((s) => (
                        <td key={s.key} className="py-2.5 px-1 text-center">
                          <input
                            type="text"
                            value={m.values?.[s.key] || ""}
                            onChange={(e) => handleMeasurementChange(idx, s.key, e.target.value)}
                            placeholder="—"
                            className="w-14 text-center bg-slate-50 border border-slate-200 rounded-md py-1 px-1 font-mono font-bold text-slate-900 text-xs focus:bg-white focus:border-blue-500 outline-none"
                          />
                        </td>
                      ))}

                      {/* Tolerance */}
                      <td className="py-2.5 px-1 text-center">
                        <input
                          type="text"
                          value={m.tolerance || ""}
                          onChange={(e) => handleRowFieldChange(idx, "tolerance", e.target.value)}
                          placeholder="± 1"
                          className="w-16 text-center bg-slate-100 border border-slate-200 rounded-md py-1 font-mono text-[11px] text-slate-600"
                        />
                      </td>

                      {/* Delete Row */}
                      <td className="py-2.5 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(idx)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                          title="Remove row"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition"
            >
              {isNo ? "Avbryt" : "Cancel"}
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? (isNo ? "Lagrer..." : "Saving...") : (isNo ? "Lagre Måleskjema" : "Save Size Chart")}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SizeChartModal;
