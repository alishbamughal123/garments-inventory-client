import React from "react";
import { ShieldCheck, Check, X } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

/**
 * Standard ISO 3758 / Nordic Textile Care Symbols & Dual-Language Descriptions
 */
const DEFAULT_SYMBOLS = [
  {
    id: "wash",
    titleNo: "Vaskes på 40 °C",
    titleEn: "Machine Wash 40°C",
    descNo: "Normal maskinvask på maks 40 °C med lignende farger.",
    descEn: "Standard machine wash at max 40°C with similar colors.",
    status: "allowed", // 'allowed' | 'warning' | 'prohibited'
    iconType: "wash40",
  },
  {
    id: "bleach",
    titleNo: "Ikke klorblek",
    titleEn: "Do Not Bleach",
    descNo: "Ikke bruk klorblekemiddel eller optiske hvitemidler.",
    descEn: "Do not use chlorine bleach or strong whitening agents.",
    status: "prohibited",
    iconType: "noBleach",
  },
  {
    id: "tumble",
    titleNo: "Lav tørketrommel",
    titleEn: "Tumble Dry Low",
    descNo: "Tørketrommel på lav varme eller lufttørkes.",
    descEn: "Tumble dry at low heat or air dry in shade.",
    status: "warning",
    iconType: "tumbleLow",
  },
  {
    id: "iron",
    titleNo: "Lav stryking",
    titleEn: "Iron Low (Max 110°C)",
    descNo: "Strykes på lav temperatur (maks 110–150 °C).",
    descEn: "Iron at low temperature setting (max 110–150 °C).",
    status: "allowed",
    iconType: "ironLow",
  },
  {
    id: "dryclean",
    titleNo: "Ikke renses",
    titleEn: "Do Not Dry Clean",
    descNo: "Ikke renses (med mindre etiketten tillater det).",
    descEn: "Do not dry clean (unless label allows it).",
    status: "prohibited",
    iconType: "noDryClean",
  },
];

/**
 * Crisp SVG Textile Care Icons (ISO 3758 Standard)
 */
const CareIcon = ({ type }) => {
  switch (type) {
    case "wash40":
      return (
        <svg
          viewBox="0 0 48 48"
          className="w-8 h-8 stroke-slate-800 fill-none"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Tub */}
          <path d="M6 16 L10 38 Q10 42 14 42 L34 42 Q38 42 38 38 L42 16" />
          {/* Water wave */}
          <path d="M6 19 Q12 15 18 19 T30 19 T42 19" strokeWidth="2" strokeDasharray="1 0" />
          {/* 40°C text */}
          <text
            x="24"
            y="33"
            textAnchor="middle"
            fill="currentColor"
            stroke="none"
            className="text-[11px] font-extrabold font-mono"
            style={{ fill: "#1e293b" }}
          >
            40°
          </text>
        </svg>
      );
    case "noBleach":
      return (
        <svg
          viewBox="0 0 48 48"
          className="w-8 h-8 stroke-rose-600 fill-none"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Triangle */}
          <polygon points="24,8 6,40 42,40" />
          {/* Prohibited X cross */}
          <line x1="12" y1="18" x2="36" y2="38" className="stroke-rose-600" strokeWidth="2.5" />
          <line x1="36" y1="18" x2="12" y2="38" className="stroke-rose-600" strokeWidth="2.5" />
        </svg>
      );
    case "tumbleLow":
      return (
        <svg
          viewBox="0 0 48 48"
          className="w-8 h-8 stroke-amber-600 fill-none"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Square */}
          <rect x="8" y="8" width="32" height="32" rx="4" />
          {/* Inner Circle */}
          <circle cx="24" cy="24" r="12" />
          {/* Single Dot for Low Heat */}
          <circle cx="24" cy="24" r="2.5" className="fill-amber-600 stroke-none" />
        </svg>
      );
    case "ironLow":
      return (
        <svg
          viewBox="0 0 48 48"
          className="w-8 h-8 stroke-slate-800 fill-none"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Iron Silhouette */}
          <path d="M8 36 L40 36 C42 36 43 34 41 30 C37 22 28 20 22 20 L10 20 C8 20 8 26 8 36 Z" />
          <path d="M12 20 L12 14 C12 12 14 10 16 10 L34 10" />
          {/* Single Dot inside iron */}
          <circle cx="24" cy="28" r="2" className="fill-slate-800 stroke-none" />
        </svg>
      );
    case "noDryClean":
      return (
        <svg
          viewBox="0 0 48 48"
          className="w-8 h-8 stroke-rose-600 fill-none"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Circle */}
          <circle cx="24" cy="24" r="16" />
          {/* Prohibited X cross */}
          <line x1="12" y1="12" x2="36" y2="36" className="stroke-rose-600" strokeWidth="2.5" />
          <line x1="36" y1="12" x2="12" y2="36" className="stroke-rose-600" strokeWidth="2.5" />
        </svg>
      );
    default:
      return <ShieldCheck className="w-8 h-8 text-blue-600" />;
  }
};

const WashingCareCard = ({
  fabric = "",
  customInstructions = "",
  brand = "Nordic Prowear",
}) => {
  const { lang, setLang, t } = useLanguage();
  const isNo = lang === "no";

  const norwegianCareFull =
    "Vaskes på 40 °C • Ikke bruk klorblekemiddel • Tørketrommel på lav varme eller lufttørkes • Strykes på lav temperatur (maks 110–150 °C) • Ikke renses (med mindre etiketten tillater det)";

  const englishCareFull =
    "Machine Wash at 40 °C • Do Not Use Chlorine Bleach • Tumble Dry Low Heat or Air Dry • Iron at Low Temperature (Max 110–150 °C) • Do Not Dry Clean (Unless Label Allows)";

  // If custom instructions exist, use appropriate translation
  const fullTextToDisplay = isNo
    ? customInstructions && customInstructions.includes("Vaskes")
      ? customInstructions
      : norwegianCareFull
    : customInstructions && !customInstructions.includes("Vaskes")
    ? customInstructions
    : englishCareFull;

  return (
    <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/60 p-5 sm:p-6 shadow-sm space-y-4">
      {/* CARD HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shadow-blue-200">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900">
                {isNo ? "Vaskeanvisning & Vedlikehold" : "Washing & Care Instructions"}
              </h4>
              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold tracking-wider uppercase font-mono">
                ISO 3758
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isNo
                ? "Offisielle nordiske vaskesymboler for arbeidstøy og tekstiler"
                : "Official Nordic textile care standards for workwear & apparel"}
            </p>
          </div>
        </div>

        {/* Quick Language Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setLang("no")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
              isNo ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>🇳🇴</span>
            <span>Norsk</span>
          </button>
          <button
            type="button"
            onClick={() => setLang("en")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
              !isNo ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>🇺🇸</span>
            <span>English</span>
          </button>
        </div>
      </div>

      {/* 5 MODERN VECTOR CARE TILES */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {DEFAULT_SYMBOLS.map((s) => {
          const isAllowed = s.status === "allowed";
          const isProhibited = s.status === "prohibited";
          const isWarning = s.status === "warning";

          return (
            <div
              key={s.id}
              className={`p-3.5 rounded-xl border transition-all flex flex-col items-center text-center justify-between gap-2.5 relative group ${
                isProhibited
                  ? "bg-rose-50/40 border-rose-100 hover:border-rose-200"
                  : isWarning
                  ? "bg-amber-50/40 border-amber-100 hover:border-amber-200"
                  : "bg-white border-slate-200/80 hover:border-blue-200 shadow-xs"
              }`}
            >
              {/* Status Badge */}
              <span
                className={`absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                  isProhibited
                    ? "bg-rose-600 text-white"
                    : isWarning
                    ? "bg-amber-500 text-white"
                    : "bg-emerald-600 text-white"
                }`}
                title={
                  isProhibited
                    ? isNo
                      ? "Forbudt"
                      : "Prohibited"
                    : isWarning
                    ? isNo
                      ? "Forsiktig"
                      : "Caution"
                    : isNo
                    ? "Tillatt"
                    : "Allowed"
                }
              >
                {isProhibited ? <X size={10} strokeWidth={3} /> : <Check size={10} strokeWidth={3} />}
              </span>

              {/* Vector Care Icon */}
              <div className="p-2 rounded-xl bg-white border border-slate-100 shadow-xs flex items-center justify-center">
                <CareIcon type={s.iconType} />
              </div>

              {/* Title & Description */}
              <div className="space-y-0.5 w-full">
                <p className="text-xs font-bold text-slate-800 leading-tight">
                  {isNo ? s.titleNo : s.titleEn}
                </p>
                <p className="text-[10px] text-slate-500 leading-tight line-clamp-2">
                  {isNo ? s.descNo : s.descEn}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER TEXT & FABRIC NOTE */}
      <div className="p-3.5 rounded-xl bg-slate-100/70 border border-slate-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-700">
        <div className="flex items-start sm:items-center gap-2">
          <span className="font-bold text-slate-900 shrink-0">
            {isNo ? "Full Vaskeanvisning:" : "Full Care Text:"}
          </span>
          <span className="text-slate-600 leading-relaxed">{fullTextToDisplay}</span>
        </div>

        {fabric && (
          <span className="shrink-0 px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-semibold text-slate-800 font-mono text-[11px] self-start sm:self-auto">
            {fabric}
          </span>
        )}
      </div>
    </div>
  );
};

export default WashingCareCard;
