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
 * 1b. Style #10099 Specific Care Symbols (Nordic Mopp 60 - 85°C Industrivask)
 */
export const STYLE_10099_SYMBOLS = [
  {
    id: "wash85",
    titleNo: "Vask 85°C (Industri)",
    titleEn: "Wash 85°C (Industrial)",
    descNo: "Tåler kraftig industrivask opptil 85 °C.",
    descEn: "Withstands heavy industrial wash up to 85 °C.",
    status: "allowed",
    iconType: "wash85",
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
    id: "noIron",
    titleNo: "Må ikke strykes",
    titleEn: "Do Not Iron",
    descNo: "Skal ikke strykes eller presses.",
    descEn: "Do not iron or steam press.",
    status: "prohibited",
    iconType: "noIron",
  },
  {
    id: "noDryClean",
    titleNo: "Tåler ikke rens",
    titleEn: "Do Not Dry Clean",
    descNo: "Kjemisk rens er ikke tillatt.",
    descEn: "Chemical dry cleaning not allowed.",
    status: "prohibited",
    iconType: "noDryClean",
  },
];

/**
 * 1c. Style #10121 Specific Care Symbols (Drammen Sweatshirt)
 */
export const STYLE_10121_SYMBOLS = [
  {
    id: "wash40",
    titleNo: "Vask 40°C",
    titleEn: "Wash 40°C",
    descNo: "Normal maskinvask på 40 °C.",
    descEn: "Standard machine wash at 40 °C.",
    status: "allowed",
    iconType: "wash40",
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
 * 1d. Style #10109 Specific Care Symbols (Ålesund Coat / Arbeidsfrakk)
 */
export const STYLE_10109_SYMBOLS = [
  {
    id: "wash75",
    titleNo: "Vask 75°C",
    titleEn: "Wash 75°C",
    descNo: "Normal maskinvask på 75 °C (industrivask).",
    descEn: "Standard machine wash at 75 °C (industrial wash).",
    status: "allowed",
    iconType: "wash75",
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
 * 1d2. Style #10114 Specific Care Symbols (Århus Chef Hat)
 */
export const STYLE_10114_SYMBOLS = [
  {
    id: "wash60",
    titleNo: "Vask 60°C",
    titleEn: "Wash 60°C",
    descNo: "Normal maskinvask på 60 °C.",
    descEn: "Standard machine wash at 60 °C.",
    status: "allowed",
    iconType: "wash60",
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
 * 1e. Style #10122 Specific Care Symbols (Kalmar Fleecejakke)
 */
export const STYLE_10122_SYMBOLS = [
  {
    id: "wash40",
    titleNo: "Vask 40°C",
    titleEn: "Wash 40°C",
    descNo: "Normal maskinvask på 40 °C.",
    descEn: "Standard machine wash at 40 °C.",
    status: "allowed",
    iconType: "wash40",
  },
  {
    id: "noTumble",
    titleNo: "Må ikke tørketromles",
    titleEn: "Do Not Tumble Dry",
    descNo: "Skal ikke tørkes i tørketrommel.",
    descEn: "Do not dry in tumble dryer.",
    status: "prohibited",
    iconType: "noTumble",
  },
  {
    id: "noBleach",
    titleNo: "Tåler ikke bleking",
    titleEn: "Do Not Bleach",
    descNo: "Bruk ikke klorblekemiddel.",
    descEn: "Do not use chlorine bleach.",
    status: "prohibited",
    iconType: "noBleach",
  },
  {
    id: "ironLow",
    titleNo: "Strykes ved lav varme",
    titleEn: "Iron Low Heat",
    descNo: "Strykes på lav temperatur (maks 110 °C).",
    descEn: "Iron at low heat (max 110 °C).",
    status: "allowed",
    iconType: "ironLow",
  },
  {
    id: "noDryClean",
    titleNo: "Tåler ikke rens",
    titleEn: "Do Not Dry Clean",
    descNo: "Kjemisk rens er ikke tillatt.",
    descEn: "Chemical dry cleaning not allowed.",
    status: "prohibited",
    iconType: "noDryClean",
  },
];

/**
 * 2. Style #10123 Specific Care Symbols (Bodø Softshell Jakke)
 */
export const STYLE_10123_SYMBOLS = [
  {
    id: "wash40",
    titleNo: "Vask 40°C",
    titleEn: "Wash 40°C",
    descNo: "Normal maskinvask på 40 °C.",
    descEn: "Standard machine wash at 40 °C.",
    status: "allowed",
    iconType: "wash40",
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
    id: "noTumble",
    titleNo: "Må ikke tørketromles",
    titleEn: "Do Not Tumble Dry",
    descNo: "Skal ikke tørkes i tørketrommel.",
    descEn: "Do not dry in tumble dryer.",
    status: "prohibited",
    iconType: "noTumble",
  },
  {
    id: "ironLow",
    titleNo: "Strykes på lav varme",
    titleEn: "Iron Low Heat",
    descNo: "Strykes på lav temperatur (maks 110 °C).",
    descEn: "Iron at low heat (max 110 °C).",
    status: "allowed",
    iconType: "ironLow",
  },
  {
    id: "noDryClean",
    titleNo: "Tåler ikke rens",
    titleEn: "Do Not Dry Clean",
    descNo: "Kjemisk rens er ikke tillatt.",
    descEn: "Chemical dry cleaning not allowed.",
    status: "prohibited",
    iconType: "noDryClean",
  },
];

/**
 * 2b. Style #200123 Specific Care Symbols (Åre Service Trousers for Ladies)
 */
export const STYLE_200123_SYMBOLS = [
  {
    id: "wash75",
    titleNo: "Vask 75°C",
    titleEn: "Wash 75°C",
    descNo: "Normal maskinvask på 75 °C (industrivask).",
    descEn: "Standard machine wash at 75 °C (industrial wash).",
    status: "allowed",
    iconType: "wash75",
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
 * 3. Style #200124 Specific Care Symbols (Hospitality / Piteå Pepita Chef Wear)
 */
export const STYLE_200124_SYMBOLS = [
  {
    id: "wash75",
    titleNo: "Vask 75°C",
    titleEn: "Wash 75°C",
    descNo: "Normal maskinvask på 75 °C (industrivask).",
    descEn: "Machine wash at 75 °C (industrial wash).",
    status: "allowed",
    iconType: "wash75",
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
 * 1b2. Style #10103 Specific Care Symbols (Molde Pen Skjorte)
 */
export const STYLE_10103_SYMBOLS = [
  {
    id: "wash40",
    titleNo: "Vask 40°C",
    titleEn: "Wash 40°C",
    descNo: "Normal maskinvask på 40 °C.",
    descEn: "Standard machine wash at 40 °C.",
    status: "allowed",
    iconType: "wash40",
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
    id: "noTumble",
    titleNo: "Må ikke tørketromles",
    titleEn: "Do Not Tumble Dry",
    descNo: "Skal ikke tørkes i tørketrommel.",
    descEn: "Do not dry in tumble dryer.",
    status: "prohibited",
    iconType: "noTumble",
  },
  {
    id: "ironLow",
    titleNo: "Strykes på lav varme",
    titleEn: "Iron Low Heat",
    descNo: "Strykes på lav temperatur (maks 110 °C).",
    descEn: "Iron at low heat (max 110 °C).",
    status: "allowed",
    iconType: "ironLow",
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
 * 1b1. Style #10102 Specific Care Symbols (Tønsberg Polo Shirt)
 */
export const STYLE_10102_SYMBOLS = [
  {
    id: "wash40",
    titleNo: "Vask 40°C",
    titleEn: "Wash 40°C",
    descNo: "Normal maskinvask på 40 °C.",
    descEn: "Standard machine wash at 40 °C.",
    status: "allowed",
    iconType: "wash40",
  },
  {
    id: "washSep",
    titleNo: "Vaskes separat",
    titleEn: "Wash Separately",
    descNo: "Vask plagget separat eller med like farger.",
    descEn: "Wash separately or with similar colors.",
    status: "allowed",
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

export const STYLE_200126_SYMBOLS = STYLE_200123_SYMBOLS;
export const STYLE_20111_SYMBOLS = STYLE_200123_SYMBOLS;
export const STYLE_200127_SYMBOLS = STYLE_200123_SYMBOLS;
export const STYLE_200128_SYMBOLS = STYLE_200123_SYMBOLS;
export const STYLE_200122_SYMBOLS = STYLE_200123_SYMBOLS;
export const STYLE_200125_SYMBOLS = STYLE_200123_SYMBOLS;
export const STYLE_200121_SYMBOLS = STYLE_200123_SYMBOLS;
export const STYLE_20110_SYMBOLS = STYLE_200123_SYMBOLS;
export const STYLE_10115_SYMBOLS = STYLE_200123_SYMBOLS;
export const STYLE_10107_SYMBOLS = STYLE_200123_SYMBOLS;
export const STYLE_10105_SYMBOLS = STYLE_200123_SYMBOLS;
export const STYLE_10106_SYMBOLS = STYLE_200123_SYMBOLS;
export const STYLE_10108_SYMBOLS = STYLE_200123_SYMBOLS;

/**
 * 3. Standard Workwear / ISO 3758 Symbols (Style 10124 & General)
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
    titleNo: "Strykes lav temp",
    titleEn: "Iron Low Heat",
    descNo: "Strykes på lav temperatur (maks 110–150 °C).",
    descEn: "Iron at low temperature (max 110–150 °C).",
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
    case "wash85":
      return (
        <svg viewBox="0 0 48 48" className="w-8 h-8 stroke-slate-800 fill-none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 16 L10 38 Q10 42 14 42 L34 42 Q38 42 38 38 L42 16" />
          <path d="M6 19 Q12 15 18 19 T30 19 T42 19" strokeWidth="2" />
          <text x="24" y="33" textAnchor="middle" fill="currentColor" stroke="none" className="text-[11px] font-extrabold font-mono" style={{ fill: "#1e293b" }}>85</text>
        </svg>
      );
    case "wash75":
      return (
        <svg viewBox="0 0 48 48" className="w-8 h-8 stroke-slate-800 fill-none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 16 L10 38 Q10 42 14 42 L34 42 Q38 42 38 38 L42 16" />
          <path d="M6 19 Q12 15 18 19 T30 19 T42 19" strokeWidth="2" />
          <text x="24" y="33" textAnchor="middle" fill="currentColor" stroke="none" className="text-[11px] font-extrabold font-mono" style={{ fill: "#1e293b" }}>75</text>
        </svg>
      );
    case "wash60":
      return (
        <svg viewBox="0 0 48 48" className="w-8 h-8 stroke-slate-800 fill-none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 16 L10 38 Q10 42 14 42 L34 42 Q38 42 38 38 L42 16" />
          <path d="M6 19 Q12 15 18 19 T30 19 T42 19" strokeWidth="2" />
          <text x="24" y="33" textAnchor="middle" fill="currentColor" stroke="none" className="text-[11px] font-extrabold font-mono" style={{ fill: "#1e293b" }}>60</text>
        </svg>
      );
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
    case "noTumble":
      return (
        <svg viewBox="0 0 48 48" className="w-8 h-8 stroke-rose-600 fill-none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="8" y="8" width="32" height="32" rx="4" />
          <circle cx="24" cy="24" r="12" />
          <line x1="12" y1="12" x2="36" y2="36" className="stroke-rose-600" strokeWidth="2.5" />
          <line x1="36" y1="12" x2="12" y2="36" className="stroke-rose-600" strokeWidth="2.5" />
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
    case "noIron":
      return (
        <svg viewBox="0 0 48 48" className="w-8 h-8 stroke-rose-600 fill-none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 36 L40 36 C42 36 43 34 41 30 C37 22 28 20 22 20 L10 20 C8 20 8 26 8 36 Z" />
          <path d="M12 20 L12 14 C12 12 14 10 16 10 L34 10" />
          <line x1="14" y1="14" x2="34" y2="34" className="stroke-rose-600" strokeWidth="2.5" />
          <line x1="34" y1="14" x2="14" y2="34" className="stroke-rose-600" strokeWidth="2.5" />
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

  const isStyle10099 =
    String(styleNumber).startsWith("10099") ||
    (customInstructions && (customInstructions.includes("85°C") || customInstructions.includes("85")));

  const isStyle10102 =
    !isStyle10099 &&
    String(styleNumber).startsWith("10102");

  const isStyle10103 =
    !isStyle10099 &&
    !isStyle10102 &&
    String(styleNumber).startsWith("10103");

  const isStyle10105 =
    !isStyle10099 &&
    !isStyle10102 &&
    !isStyle10103 &&
    String(styleNumber).startsWith("10105");

  const isStyle10106 =
    !isStyle10099 &&
    !isStyle10102 &&
    !isStyle10103 &&
    !isStyle10105 &&
    String(styleNumber).startsWith("10106");

  const isStyle10107 =
    !isStyle10099 &&
    !isStyle10102 &&
    !isStyle10103 &&
    !isStyle10105 &&
    !isStyle10106 &&
    String(styleNumber).startsWith("10107");

  const isStyle10108 =
    !isStyle10099 &&
    !isStyle10102 &&
    !isStyle10103 &&
    !isStyle10105 &&
    !isStyle10106 &&
    !isStyle10107 &&
    String(styleNumber).startsWith("10108");

  const isStyle10109 =
    !isStyle10099 &&
    !isStyle10102 &&
    !isStyle10103 &&
    !isStyle10105 &&
    !isStyle10106 &&
    !isStyle10107 &&
    !isStyle10108 &&
    (String(styleNumber).startsWith("10109") ||
      (fabric && fabric.includes("210") && String(styleNumber).includes("10109")));

  const isStyle10114 =
    !isStyle10099 &&
    !isStyle10102 &&
    !isStyle10103 &&
    !isStyle10105 &&
    !isStyle10106 &&
    !isStyle10107 &&
    !isStyle10108 &&
    !isStyle10109 &&
    String(styleNumber).startsWith("10114");

  const isStyle10115 =
    !isStyle10099 &&
    !isStyle10102 &&
    !isStyle10103 &&
    !isStyle10105 &&
    !isStyle10106 &&
    !isStyle10107 &&
    !isStyle10108 &&
    !isStyle10109 &&
    !isStyle10114 &&
    String(styleNumber).startsWith("10115");

  const isStyle10121 =
    !isStyle10099 &&
    !isStyle10102 &&
    !isStyle10103 &&
    !isStyle10105 &&
    !isStyle10106 &&
    !isStyle10107 &&
    !isStyle10108 &&
    !isStyle10109 &&
    !isStyle10114 &&
    !isStyle10115 &&
    (String(styleNumber).startsWith("10121") ||
      (fabric && fabric.includes("320")));

  const isStyle10122 =
    !isStyle10099 &&
    !isStyle10102 &&
    !isStyle10103 &&
    !isStyle10105 &&
    !isStyle10106 &&
    !isStyle10107 &&
    !isStyle10108 &&
    !isStyle10109 &&
    !isStyle10114 &&
    !isStyle10115 &&
    !isStyle10121 &&
    (String(styleNumber).startsWith("10122") ||
      (fabric && fabric.includes("Anti Pilling")));

  const isStyle10123 =
    !isStyle10099 &&
    !isStyle10102 &&
    !isStyle10103 &&
    !isStyle10105 &&
    !isStyle10106 &&
    !isStyle10107 &&
    !isStyle10108 &&
    !isStyle10109 &&
    !isStyle10114 &&
    !isStyle10115 &&
    !isStyle10121 &&
    !isStyle10122 &&
    (String(styleNumber).startsWith("10123") ||
      (customInstructions && (customInstructions.includes("tørketromles") || customInstructions.includes("Tåler ikke rens"))));

  const isStyle20110 =
    !isStyle10099 &&
    !isStyle10102 &&
    !isStyle10103 &&
    !isStyle10105 &&
    !isStyle10106 &&
    !isStyle10107 &&
    !isStyle10108 &&
    !isStyle10109 &&
    !isStyle10114 &&
    !isStyle10115 &&
    !isStyle10121 &&
    !isStyle10122 &&
    !isStyle10123 &&
    String(styleNumber).startsWith("20110");

  const isStyle20111 =
    !isStyle10099 &&
    !isStyle10102 &&
    !isStyle10103 &&
    !isStyle10105 &&
    !isStyle10106 &&
    !isStyle10107 &&
    !isStyle10108 &&
    !isStyle10109 &&
    !isStyle10114 &&
    !isStyle10115 &&
    !isStyle10121 &&
    !isStyle10122 &&
    !isStyle10123 &&
    !isStyle20110 &&
    String(styleNumber).startsWith("20111");

  const isStyle200121 =
    !isStyle10099 &&
    !isStyle10102 &&
    !isStyle10103 &&
    !isStyle10105 &&
    !isStyle10106 &&
    !isStyle10107 &&
    !isStyle10108 &&
    !isStyle10109 &&
    !isStyle10114 &&
    !isStyle10115 &&
    !isStyle10121 &&
    !isStyle10122 &&
    !isStyle10123 &&
    !isStyle20110 &&
    !isStyle20111 &&
    String(styleNumber).startsWith("200121");

  const isStyle200122 =
    !isStyle10099 &&
    !isStyle10102 &&
    !isStyle10103 &&
    !isStyle10105 &&
    !isStyle10106 &&
    !isStyle10107 &&
    !isStyle10108 &&
    !isStyle10109 &&
    !isStyle10114 &&
    !isStyle10115 &&
    !isStyle10121 &&
    !isStyle10122 &&
    !isStyle10123 &&
    !isStyle20110 &&
    !isStyle20111 &&
    !isStyle200121 &&
    String(styleNumber).startsWith("200122");

  const isStyle200123 =
    !isStyle10099 &&
    !isStyle10102 &&
    !isStyle10103 &&
    !isStyle10105 &&
    !isStyle10106 &&
    !isStyle10107 &&
    !isStyle10108 &&
    !isStyle10109 &&
    !isStyle10114 &&
    !isStyle10115 &&
    !isStyle10121 &&
    !isStyle10122 &&
    !isStyle10123 &&
    !isStyle20110 &&
    !isStyle20111 &&
    !isStyle200121 &&
    !isStyle200122 &&
    String(styleNumber).startsWith("200123");

  const isStyle200124 =
    !isStyle10099 &&
    !isStyle10102 &&
    !isStyle10103 &&
    !isStyle10105 &&
    !isStyle10106 &&
    !isStyle10107 &&
    !isStyle10108 &&
    !isStyle10109 &&
    !isStyle10114 &&
    !isStyle10115 &&
    !isStyle10121 &&
    !isStyle10122 &&
    !isStyle10123 &&
    !isStyle20110 &&
    !isStyle20111 &&
    !isStyle200121 &&
    !isStyle200122 &&
    !isStyle200123 &&
    (String(styleNumber).startsWith("200124") ||
      (customInstructions && (customInstructions.includes("75°C") || customInstructions.includes("75"))));

  const isStyle200125 =
    !isStyle10099 &&
    !isStyle10102 &&
    !isStyle10103 &&
    !isStyle10105 &&
    !isStyle10106 &&
    !isStyle10107 &&
    !isStyle10108 &&
    !isStyle10109 &&
    !isStyle10114 &&
    !isStyle10115 &&
    !isStyle10121 &&
    !isStyle10122 &&
    !isStyle10123 &&
    !isStyle20110 &&
    !isStyle20111 &&
    !isStyle200121 &&
    !isStyle200122 &&
    !isStyle200123 &&
    !isStyle200124 &&
    String(styleNumber).startsWith("200125");

  const isStyle200126 =
    !isStyle10099 &&
    !isStyle10102 &&
    !isStyle10103 &&
    !isStyle10105 &&
    !isStyle10106 &&
    !isStyle10107 &&
    !isStyle10108 &&
    !isStyle10109 &&
    !isStyle10114 &&
    !isStyle10115 &&
    !isStyle10121 &&
    !isStyle10122 &&
    !isStyle10123 &&
    !isStyle20110 &&
    !isStyle20111 &&
    !isStyle200121 &&
    !isStyle200122 &&
    !isStyle200123 &&
    !isStyle200124 &&
    !isStyle200125 &&
    String(styleNumber).startsWith("200126");

  const isStyle200127 =
    !isStyle10099 &&
    !isStyle10102 &&
    !isStyle10103 &&
    !isStyle10105 &&
    !isStyle10106 &&
    !isStyle10107 &&
    !isStyle10108 &&
    !isStyle10109 &&
    !isStyle10114 &&
    !isStyle10115 &&
    !isStyle10121 &&
    !isStyle10122 &&
    !isStyle10123 &&
    !isStyle20110 &&
    !isStyle20111 &&
    !isStyle200121 &&
    !isStyle200122 &&
    !isStyle200123 &&
    !isStyle200124 &&
    !isStyle200125 &&
    !isStyle200126 &&
    String(styleNumber).startsWith("200127");

  const isStyle200128 =
    !isStyle10099 &&
    !isStyle10102 &&
    !isStyle10103 &&
    !isStyle10105 &&
    !isStyle10106 &&
    !isStyle10107 &&
    !isStyle10108 &&
    !isStyle10109 &&
    !isStyle10114 &&
    !isStyle10115 &&
    !isStyle10121 &&
    !isStyle10122 &&
    !isStyle10123 &&
    !isStyle20110 &&
    !isStyle20111 &&
    !isStyle200121 &&
    !isStyle200122 &&
    !isStyle200123 &&
    !isStyle200124 &&
    !isStyle200125 &&
    !isStyle200126 &&
    !isStyle200127 &&
    String(styleNumber).startsWith("200128");

  const isStyle10101 =
    !isStyle10099 &&
    !isStyle10102 &&
    !isStyle10103 &&
    !isStyle10105 &&
    !isStyle10106 &&
    !isStyle10107 &&
    !isStyle10108 &&
    !isStyle10109 &&
    !isStyle10114 &&
    !isStyle10115 &&
    !isStyle10121 &&
    !isStyle10122 &&
    !isStyle10123 &&
    !isStyle20110 &&
    !isStyle20111 &&
    !isStyle200121 &&
    !isStyle200122 &&
    !isStyle200123 &&
    !isStyle200124 &&
    !isStyle200125 &&
    !isStyle200126 &&
    !isStyle200127 &&
    !isStyle200128 &&
    (String(styleNumber).startsWith("10101") ||
      (customInstructions && customInstructions.includes("separat")));

  const symbolsList = isStyle10099
    ? STYLE_10099_SYMBOLS
    : isStyle10102
    ? STYLE_10102_SYMBOLS
    : isStyle10103
    ? STYLE_10103_SYMBOLS
    : isStyle10105
    ? STYLE_10105_SYMBOLS
    : isStyle10106
    ? STYLE_10106_SYMBOLS
    : isStyle10107
    ? STYLE_10107_SYMBOLS
    : isStyle10108
    ? STYLE_10108_SYMBOLS
    : isStyle10109
    ? STYLE_10109_SYMBOLS
    : isStyle10114
    ? STYLE_10114_SYMBOLS
    : isStyle10115
    ? STYLE_10115_SYMBOLS
    : isStyle10121
    ? STYLE_10121_SYMBOLS
    : isStyle10122
    ? STYLE_10122_SYMBOLS
    : isStyle10123
    ? STYLE_10123_SYMBOLS
    : isStyle20110
    ? STYLE_20110_SYMBOLS
    : isStyle20111
    ? STYLE_20111_SYMBOLS
    : isStyle200121
    ? STYLE_200121_SYMBOLS
    : isStyle200122
    ? STYLE_200122_SYMBOLS
    : isStyle200123
    ? STYLE_200123_SYMBOLS
    : isStyle200124
    ? STYLE_200124_SYMBOLS
    : isStyle200125
    ? STYLE_200125_SYMBOLS
    : isStyle200126
    ? STYLE_200126_SYMBOLS
    : isStyle200127
    ? STYLE_200127_SYMBOLS
    : isStyle200128
    ? STYLE_200128_SYMBOLS
    : isStyle10101
    ? STYLE_10101_SYMBOLS
    : DEFAULT_WORKWEAR_SYMBOLS;

  const fullText10099No =
    "Vask 85°C (Industrivask) • Må ikke blekes • Tørketrommel tillatt • Må ikke strykes • Tåler ikke rens";
  const fullText10099En =
    "Wash 85°C (Industrial Wash) • Do Not Bleach • Tumble Dry Allowed • Do Not Iron • Do Not Dry Clean";

  const fullText10102No =
    "Vask 40°C • Vaskes separat • Må ikke blekes • Strykes på middels varme • Profesjonell rens tillatt";
  const fullText10102En =
    "Wash 40°C • Wash Separately • Do Not Bleach • Iron Medium Heat • Professional Dry Clean (P) Allowed";

  const fullText10103No =
    "Vask 40°C • Må ikke blekes • Må ikke tørketromles • Strykes på lav varme • Profesjonell rens tillatt";
  const fullText10103En =
    "Wash 40°C • Do Not Bleach • Do Not Tumble Dry • Iron Low Heat • Professional Dry Clean (P) Allowed";

  const fullText10105No =
    "Vask 75°C • Vaskes separat • Må ikke blekes • Tørketrommel tillatt • Strykes på middels varme • Profesjonell rens tillatt (Egnet for industriell vask)";
  const fullText10105En =
    "Wash 75°C • Wash Separately • Do Not Bleach • Tumble Dry Allowed • Iron Medium Heat • Professional Dry Clean (P) Allowed (Industrial Wash Suitable)";

  const fullText10106No =
    "Vask 75°C • Vaskes separat • Må ikke blekes • Tørketrommel tillatt • Strykes på middels varme • Profesjonell rens tillatt (Egnet for industriell vask)";
  const fullText10106En =
    "Wash 75°C • Wash Separately • Do Not Bleach • Tumble Dry Allowed • Iron Medium Heat • Professional Dry Clean (P) Allowed (Industrial Wash Suitable)";

  const fullText10107No =
    "Vask 75°C • Vaskes separat • Må ikke blekes • Tørketrommel tillatt • Strykes på middels varme • Profesjonell rens tillatt (Egnet for industriell vask)";
  const fullText10107En =
    "Wash 75°C • Wash Separately • Do Not Bleach • Tumble Dry Allowed • Iron Medium Heat • Professional Dry Clean (P) Allowed (Industrial Wash Suitable)";

  const fullText10108No =
    "Vask 75°C • Vaskes separat • Må ikke blekes • Tørketrommel tillatt • Strykes på middels varme • Profesjonell rens tillatt (Egnet for industriell vask)";
  const fullText10108En =
    "Wash 75°C • Wash Separately • Do Not Bleach • Tumble Dry Allowed • Iron Medium Heat • Professional Dry Clean (P) Allowed (Industrial Wash Suitable)";

  const fullText10109No =
    "Vask 75°C • Må ikke blekes • Tørketrommel tillatt • Strykes på middels varme • Profesjonell rens tillatt (Egnet for industriell vask)";
  const fullText10109En =
    "Wash 75°C • Do Not Bleach • Tumble Dry Allowed • Iron Medium Heat • Professional Dry Clean (P) Allowed (Industrial Wash Suitable)";

  const fullText10114No =
    "Vask 60°C • Må ikke blekes • Tørketrommel tillatt • Strykes på middels varme • Profesjonell rens tillatt";
  const fullText10114En =
    "Wash 60°C • Do Not Bleach • Tumble Dry Allowed • Iron Medium Heat • Professional Dry Clean (P) Allowed";

  const fullText10115No =
    "Vask 75°C • Vaskes separat • Må ikke blekes • Tørketrommel tillatt • Strykes på middels varme • Profesjonell rens tillatt (Egnet for industriell vask)";
  const fullText10115En =
    "Wash 75°C • Wash Separately • Do Not Bleach • Tumble Dry Allowed • Iron Medium Heat • Professional Dry Clean (P) Allowed (Industrial Wash Suitable)";

  const fullText10121No =
    "Vask 40°C • Må ikke blekes • Tørketrommel tillatt • Strykes på middels varme • Profesjonell rens tillatt";
  const fullText10121En =
    "Wash 40°C • Do Not Bleach • Tumble Dry Allowed • Iron Medium Heat • Professional Dry Clean (P) Allowed";

  const fullText10122No =
    "Vask 40°C • Må ikke tørketromles • Tåler ikke bleking • Strykes ved lav varme • Tåler ikke rens";
  const fullText10122En =
    "Wash 40°C • Do Not Tumble Dry • Do Not Bleach • Iron Low Heat • Do Not Dry Clean";

  const fullText10123No =
    "Vask 40°C • Må ikke blekes • Må ikke tørketromles • Strykes på lav varme • Tåler ikke rens";
  const fullText10123En =
    "Wash 40°C • Do Not Bleach • Do Not Tumble Dry • Iron Low Heat • Do Not Dry Clean";

  const fullText20110No =
    "Vask 75°C • Vaskes separat • Må ikke blekes • Tørketrommel tillatt • Strykes på middels varme • Profesjonell rens tillatt (Egnet for industriell vask)";
  const fullText20110En =
    "Wash 75°C • Wash Separately • Do Not Bleach • Tumble Dry Allowed • Iron Medium Heat • Professional Dry Clean (P) Allowed (Industrial Wash Suitable)";

  const fullText20111No =
    "Vask 75°C • Vaskes separat • Må ikke blekes • Tørketrommel tillatt • Strykes på middels varme • Profesjonell rens tillatt (Egnet for industriell vask)";
  const fullText20111En =
    "Wash 75°C • Wash Separately • Do Not Bleach • Tumble Dry Allowed • Iron Medium Heat • Professional Dry Clean (P) Allowed (Industrial Wash Suitable)";

  const fullText200121No =
    "Vask 75°C • Vaskes separat • Må ikke blekes • Tørketrommel tillatt • Strykes på middels varme • Profesjonell rens tillatt (Egnet for industriell vask)";
  const fullText200121En =
    "Wash 75°C • Wash Separately • Do Not Bleach • Tumble Dry Allowed • Iron Medium Heat • Professional Dry Clean (P) Allowed (Industrial Wash Suitable)";

  const fullText200122No =
    "Vask 75°C • Vaskes separat • Må ikke blekes • Tørketrommel tillatt • Strykes på middels varme • Profesjonell rens tillatt (Egnet for industriell vask)";
  const fullText200122En =
    "Wash 75°C • Wash Separately • Do Not Bleach • Tumble Dry Allowed • Iron Medium Heat • Professional Dry Clean (P) Allowed (Industrial Wash Suitable)";

  const fullText200123No =
    "Vask 75°C • Vaskes separat • Må ikke blekes • Tørketrommel tillatt • Strykes på middels varme • Profesjonell rens tillatt (Egnet for industriell vask)";
  const fullText200123En =
    "Wash 75°C • Wash Separately • Do Not Bleach • Tumble Dry Allowed • Iron Medium Heat • Professional Dry Clean (P) Allowed (Industrial Wash Suitable)";

  const fullText200124No =
    "Vask 75°C • Vaskes separat • Må ikke blekes • Tørketrommel tillatt • Strykes på middels varme • Profesjonell rens tillatt";
  const fullText200124En =
    "Wash 75°C • Wash Separately • Do Not Bleach • Tumble Dry Allowed • Iron Medium Heat • Professional Dry Clean (P) Allowed";

  const fullText200125No =
    "Vask 75°C • Vaskes separat • Må ikke blekes • Tørketrommel tillatt • Strykes på middels varme • Profesjonell rens tillatt (Egnet for industriell vask)";
  const fullText200125En =
    "Wash 75°C • Wash Separately • Do Not Bleach • Tumble Dry Allowed • Iron Medium Heat • Professional Dry Clean (P) Allowed (Industrial Wash Suitable)";

  const fullText200126No =
    "Vask 75°C • Vaskes separat • Må ikke blekes • Tørketrommel tillatt • Strykes på middels varme • Profesjonell rens tillatt (Egnet for industriell vask)";
  const fullText200126En =
    "Wash 75°C • Wash Separately • Do Not Bleach • Tumble Dry Allowed • Iron Medium Heat • Professional Dry Clean (P) Allowed (Industrial Wash Suitable)";

  const fullText200127No =
    "Vask 75°C • Vaskes separat • Må ikke blekes • Tørketrommel tillatt • Strykes på middels varme • Profesjonell rens tillatt (Egnet for industriell vask)";
  const fullText200127En =
    "Wash 75°C • Wash Separately • Do Not Bleach • Tumble Dry Allowed • Iron Medium Heat • Professional Dry Clean (P) Allowed (Industrial Wash Suitable)";

  const fullText200128No =
    "Vask 75°C • Vaskes separat • Må ikke blekes • Tørketrommel tillatt • Strykes på middels varme • Profesjonell rens tillatt (Egnet for industriell vask)";
  const fullText200128En =
    "Wash 75°C • Wash Separately • Do Not Bleach • Tumble Dry Allowed • Iron Medium Heat • Professional Dry Clean (P) Allowed (Industrial Wash Suitable)";

  const fullText10101No =
    "Vask 40°C • Vaskes separat • Må ikke blekes • Tørketrommel tillatt • Strykes på middels varme • Profesjonell rens tillatt";
  const fullText10101En =
    "Wash 40°C • Wash Separately • Do Not Bleach • Tumble Dry Allowed • Iron Medium Heat • Professional Dry Clean (P) Allowed";

  const fullText10124No =
    "Vaskes på 40 °C • Ikke bruk klorblekemiddel • Tørketrommel på lav varme eller lufttørkes • Strykes på lav temperatur (maks 110–150 °C) • Ikke renses (med mindre etiketten tillater det)";
  const fullText10124En =
    "Machine Wash at 40 °C • Do Not Use Chlorine Bleach • Tumble Dry Low Heat or Air Dry • Iron at Low Temperature (Max 110–150 °C) • Do Not Dry Clean";

  const defaultFullText = isStyle10099
    ? isNo
      ? fullText10099No
      : fullText10099En
    : isStyle10102
    ? isNo
      ? fullText10102No
      : fullText10102En
    : isStyle10103
    ? isNo
      ? fullText10103No
      : fullText10103En
    : isStyle10105
    ? isNo
      ? fullText10105No
      : fullText10105En
    : isStyle10106
    ? isNo
      ? fullText10106No
      : fullText10106En
    : isStyle10107
    ? isNo
      ? fullText10107No
      : fullText10107En
    : isStyle10108
    ? isNo
      ? fullText10108No
      : fullText10108En
    : isStyle10109
    ? isNo
      ? fullText10109No
      : fullText10109En
    : isStyle10114
    ? isNo
      ? fullText10114No
      : fullText10114En
    : isStyle10115
    ? isNo
      ? fullText10115No
      : fullText10115En
    : isStyle10121
    ? isNo
      ? fullText10121No
      : fullText10121En
    : isStyle10122
    ? isNo
      ? fullText10122No
      : fullText10122En
    : isStyle10123
    ? isNo
      ? fullText10123No
      : fullText10123En
    : isStyle20110
    ? isNo
      ? fullText20110No
      : fullText20110En
    : isStyle20111
    ? isNo
      ? fullText20111No
      : fullText20111En
    : isStyle200121
    ? isNo
      ? fullText200121No
      : fullText200121En
    : isStyle200122
    ? isNo
      ? fullText200122No
      : fullText200122En
    : isStyle200123
    ? isNo
      ? fullText200123No
      : fullText200123En
    : isStyle200124
    ? isNo
      ? fullText200124No
      : fullText200124En
    : isStyle200125
    ? isNo
      ? fullText200125No
      : fullText200125En
    : isStyle200126
    ? isNo
      ? fullText200126No
      : fullText200126En
    : isStyle200127
    ? isNo
      ? fullText200127No
      : fullText200127En
    : isStyle200128
    ? isNo
      ? fullText200128No
      : fullText200128En
    : isStyle10101
    ? isNo
      ? fullText10101No
      : fullText10101En
    : isNo
    ? fullText10124No
    : fullText10124En;

  const styleBadgeText = isStyle10099
    ? "Style #10099"
    : isStyle10102
    ? "Style #10102"
    : isStyle10103
    ? "Style #10103"
    : isStyle10105
    ? "Style #10105"
    : isStyle10106
    ? "Style #10106"
    : isStyle10107
    ? "Style #10107"
    : isStyle10108
    ? "Style #10108"
    : isStyle10109
    ? "Style #10109"
    : isStyle10114
    ? "Style #10114"
    : isStyle10115
    ? "Style #10115"
    : isStyle10121
    ? "Style #10121"
    : isStyle10122
    ? "Style #10122"
    : isStyle10123
    ? "Style #10123"
    : isStyle20110
    ? "Style #20110"
    : isStyle20111
    ? "Style #20111"
    : isStyle200121
    ? "Style #200121"
    : isStyle200122
    ? "Style #200122"
    : isStyle200123
    ? "Style #200123"
    : isStyle200124
    ? "Style #200124"
    : isStyle200125
    ? "Style #200125"
    : isStyle200126
    ? "Style #200126"
    : isStyle200127
    ? "Style #200127"
    : isStyle200128
    ? "Style #200128"
    : isStyle10101
    ? "Style #10101"
    : "ISO 3758";

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
                {styleBadgeText}
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
