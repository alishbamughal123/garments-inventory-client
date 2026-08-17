import React from "react";
import { ShieldCheck, Check, X, AlertCircle } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

/**
 * 1. Style #10101 Specific Care Symbols (Exactly matching wahing-instructions 10101.png)
 */
export const STYLE_10101_SYMBOLS = [
  {
    id: "wash40",
    titleNo: "Vask 40°C",
    titleEn: "Wash 40°C",
    descNo: "Normal maskinvask på 40 °C.",
    descEn: "Machine wash at 40 °C.",
    status: "allowed",
    iconType: "wash40",
  },
  {
    id: "washSeparate",
    titleNo: "Vaskes separat",
    titleEn: "Wash Separately",
    descNo: "Vaskes separat for å bevare fargen.",
    descEn: "Wash separately to protect color.",
    status: "warning",
    iconType: "washTub",
  },
  {
    id: "noBleach",
    titleNo: "Må ikke blekes",
    titleEn: "Do Not Bleach",
    descNo: "Bruk ikke klorblekemiddel.",
    descEn: "Do not use chlorine bleach.",
    status: "prohibited",
    iconType: "noBleach",
  },
  {
    id: "tumbleAllowed",
    titleNo: "Tørketrommel tillatt",
    titleEn: "Tumble Dry Allowed",
    descNo: "Trommeltørking er tillatt.",
    descEn: "Tumble dry setting is allowed.",
    status: "allowed",
    iconType: "tumbleDot",
  },
  {
    id: "ironMedium",
    titleNo: "Strykes på middels varme",
    titleEn: "Iron Medium Heat",
    descNo: "Strykes på middels temp (maks 150 °C).",
    descEn: "Iron at medium temperature (max 150 °C).",
    status: "allowed",
    iconType: "ironMedium",
  },
  {
    id: "dryCleanP",
    titleNo: "Profesjonell rens tillatt",
    titleEn: "Prof. Dry Clean (P)",
    descNo: "Kjemisk rens i perkloretylen tillatt.",
    descEn: "Professional dry cleaning allowed (P).",
    status: "allowed",
    iconType: "dryCleanP",
  },
];

/**
 * 2. Standard Workwear / ISO 3758 Symbols (Style 10124 & General)
 */
export const DEFAULT_WORKWEAR_SYMBOLS = [
  {
    id: "wash40",
    titleNo: "Vaskes på 40 °C",
    titleEn: "Machine Wash 40°C",
    descNo: "Normal maskinvask på maks 40 °C.",
    descEn: "Standard machine wash at max 40°C.",
    status: "allowed",
    iconType: "wash40",
  },
  {
    id: "noBleach",
    titleNo: "Ikke bruk klorblek",
    titleEn: "Do Not Bleach",
    descNo: "Ikke bruk klorblekemiddel.",
    descEn: "Do not use chlorine bleach.",
    status: "prohibited",
    iconType: "noBleach",
  },
  {
    id: "tumbleLow",
    titleNo: "Lav tørketrommel",
    titleEn: "Tumble Dry Low",
    descNo: "Tørketrommel på lav varme.",
    descEn: "Tumble dry at low heat.",
    status: "warning",
    iconType: "tumbleDot",
  },
  {
    id: "ironLow",
    titleNo: "Lav stryking",
    titleEn: "Iron Low (Max 110°C)",
    descNo: "Strykes på lav temp (maks 110–150 °C).",
    descEn: "Iron at low temperature setting.",
    status: "allowed",
    iconType: "ironLow",
  },
  {
    id: "noDryClean",
    titleNo: "Ikke renses",
    titleEn: "Do Not Dry Clean",
    descNo: "Tåler ikke kjemisk rens.",
    descEn: "Do not chemically dry clean.",
    status: "prohibited",
    iconType: "noDryClean",
  },
];

/**
 * Crisp SVG Textile Care Icons (ISO 3758 & Norwegian Standard)
 */
export const CareIcon = ({ type }) => {
  switch (type) {
    case "wash40":
      return (
        <svg viewBox="0 0 48 48" className="w-8 h-8 stroke-slate-800 fill-none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 16 L10 38 Q10 42 14 42 L34 42 Q38 42 38 38 L42 16" />
          <path d="M6 19 Q12 15 18 19 T30 19 T42 19" strokeWidth="2" />
          <text x="24" y="33" textAnchor="middle" fill="currentColor" stroke="none" className="text-[11px] font-extrabold font-mono" style={{ fill: "#1e293b" }}>40</text>
        </svg>
      );
    case "washTub":
      return (
        <svg viewBox="0 0 48 48" className="w-8 h-8 stroke-slate-800 fill-none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 16 L10 38 Q10 42 14 42 L34 42 Q38 42 38 38 L42 16" />
          <path d="M6 21 Q12 17 18 21 T30 21 T42 21" strokeWidth="2.2" />
        </svg>
      );
    case "noBleach":
      return (
        <svg viewBox="0 0 48 48" className="w-8 h-8 stroke-rose-600 fill-none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="24,8 6,40 42,40" />
          <line x1="12" y1="18" x2="36" y2="38" className="stroke-rose-600" strokeWidth="2.5" />
          <line x1="36" y1="18" x2="12" y2="38" className="stroke-rose-600" strokeWidth="2.5" />
        </svg>
      );
    case "tumbleDot":
      return (
        <svg viewBox="0 0 48 48" className="w-8 h-8 stroke-slate-800 fill-none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="8" y="8" width="32" height="32" rx="4" />
          <circle cx="24" cy="24" r="12" />
          <circle cx="24" cy="24" r="2.5" className="fill-slate-800 stroke-none" />
        </svg>
      );
    case "ironLow":
      return (
        <svg viewBox="0 0 48 48" className="w-8 h-8 stroke-slate-800 fill-none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 36 L40 36 C42 36 43 34 41 30 C37 22 28 20 22 20 L10 20 C8 20 8 26 8 36 Z" />
          <path d="M12 20 L12 14 C12 12 14 10 16 10 L34 10" />
          <circle cx="24" cy="28" r="2" className="fill-slate-800 stroke-none" />
        </svg>
      );
    case "ironMedium":
      return (
        <svg viewBox="0 0 48 48" className="w-8 h-8 stroke-slate-800 fill-none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 36 L40 36 C42 36 43 34 41 30 C37 22 28 20 22 20 L10 20 C8 20 8 26 8 36 Z" />
          <path d="M12 20 L12 14 C12 12 14 10 16 10 L34 10" />
          {/* Two dots for medium heat */}
          <circle cx="20" cy="28" r="2" className="fill-slate-800 stroke-none" />
          <circle cx="28" cy="28" r="2" className="fill-slate-800 stroke-none" />
        </svg>
      );
    case "dryCleanP":
      return (
        <svg viewBox="0 0 48 48" className="w-8 h-8 stroke-slate-800 fill-none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="24" cy="24" r="16" />
          <text x="24" y="31" textAnchor="middle" fill="currentColor" stroke="none" className="text-[16px] font-bold font-sans" style={{ fill: "#1e293b" }}>P</text>
        </svg>
      );
    case "noDryClean":
      return (
        <svg viewBox="0 0 48 48" className="w-8 h-8 stroke-rose-600 fill-none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="24" cy="24" r="16" />
          <line x1="12" y1="12" x2="36" y2="36" className="stroke-rose-600" strokeWidth="2.5" />
          <line x1="36" y1="12" x2="12" y2="36" className="stroke-rose-600" strokeWidth="2.5" />
        </svg>
      );
    default:
      return <ShieldCheck className="w-8 h-8 text-blue-600" />;
  }
};

const WashingCareCard = ({
  styleNumber = "",
  fabric = "",
  customInstructions = "",
  brand = "Nordic Prowear",
}) => {
  const { lang, setLang } = useLanguage();
  const isNo = lang === "no";

  const isStyle10101 =
    String(styleNumber).startsWith("10101") ||
    (customInstructions && customInstructions.includes("separat"));

  const symbolsList = isStyle10101 ? STYLE_10101_SYMBOLS : DEFAULT_WORKWEAR_SYMBOLS;

  const fullText10101No =
    "Vask 40°C • Vaskes separat • Må ikke blekes • Tørketrommel tillatt • Strykes på middels varme • Profesjonell rens tillatt";
  const fullText10101En =
    "Wash 40°C • Wash Separately • Do Not Bleach • Tumble Dry Allowed • Iron Medium Heat • Professional Dry Clean (P) Allowed";

  const fullText10124No =
    "Vaskes på 40 °C • Ikke bruk klorblekemiddel • Tørketrommel på lav varme eller lufttørkes • Strykes på lav temperatur (maks 110–150 °C) • Ikke renses (med mindre etiketten tillater det)";
  const fullText10124En =
    "Machine Wash at 40 °C • Do Not Use Chlorine Bleach • Tumble Dry Low Heat or Air Dry • Iron at Low Temperature (Max 110–150 °C) • Do Not Dry Clean";

  const defaultFullText = isStyle10101
    ? isNo
      ? fullText10101No
      : fullText10101En
    : isNo
    ? fullText10124No
    : fullText10124En;

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
                {isStyle10101 ? "Style #10101" : "ISO 3758"}
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

      {/* DYNAMIC VECTOR CARE TILES GRID */}
      <div
        className={`grid gap-2.5 ${
          symbolsList.length === 6
            ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-6"
            : "grid-cols-2 sm:grid-cols-3 md:grid-cols-5"
        }`}
      >
        {symbolsList.map((s) => {
          const isProhibited = s.status === "prohibited";
          const isWarning = s.status === "warning";

          return (
            <div
              key={s.id}
              className={`p-3 rounded-xl border transition-all flex flex-col items-center text-center justify-between gap-2 relative group ${
                isProhibited
                  ? "bg-rose-50/40 border-rose-100 hover:border-rose-200"
                  : isWarning
                  ? "bg-amber-50/40 border-amber-100 hover:border-amber-200"
                  : "bg-white border-slate-200/80 hover:border-blue-200 shadow-xs"
              }`}
            >
              {/* Status Badge */}
              <span
                className={`absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] ${
                  isProhibited
                    ? "bg-rose-600 text-white"
                    : isWarning
                    ? "bg-amber-500 text-white"
                    : "bg-emerald-600 text-white"
                }`}
                title={
                  isProhibited
                    ? isNo ? "Må ikke" : "Prohibited"
                    : isWarning
                    ? isNo ? "Forsiktig" : "Caution"
                    : isNo ? "Tillatt" : "Allowed"
                }
              >
                {isProhibited ? <X size={8} strokeWidth={3} /> : <Check size={8} strokeWidth={3} />}
              </span>

              {/* Vector Care Icon */}
              <div className="p-1.5 rounded-xl bg-white border border-slate-100 shadow-2xs flex items-center justify-center">
                <CareIcon type={s.iconType} />
              </div>

              {/* Title & Description */}
              <div className="space-y-0.5 w-full">
                <p className="text-[11px] font-bold text-slate-800 leading-tight">
                  {isNo ? s.titleNo : s.titleEn}
                </p>
                <p className="text-[9px] text-slate-500 leading-tight line-clamp-2">
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
          <span className="text-slate-600 leading-relaxed">
            {customInstructions || defaultFullText}
          </span>
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
