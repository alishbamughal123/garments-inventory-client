import React, { createContext, useContext, useState, useEffect } from "react";

const translations = {
  en: {
    // Brand & App Header
    brandTitle: "Nordic Prowear",
    brandSubtitle: "CRM & Customer Portal",
    language: "Language",
    english: "English (US)",
    norwegian: "Norsk (NO)",

    // Navigation Sidebar
    dashboard: "Dashboard",
    articles: "Articles",
    products: "Products & Styles",
    categories: "Categories",
    inventory: "Inventory Control",
    stockIn: "Stock In",
    stockOut: "Stock Out",
    transactions: "Transactions",
    crm: "CRM",
    customers: "Customers",
    leads: "Leads",
    pipeline: "Pipeline",
    tasks: "Tasks",
    support: "Support",
    returns: "Returns",
    lowStock: "Low Stock",
    sales: "Sales & POS",
    b2bOrders: "B2B Customer Orders",
    b2bPortal: "B2B Customer Portal",
    reports: "Reports",
    reportsHub: "Comprehensive Reports & Exports",
    weightCalculator: "Parcel Weight Calculator",
    users: "User Management",
    settings: "Settings",
    logout: "Logout",

    // Page Titles & Table Headers
    inventoryMovementHistory: "Inventory movement history",
    date: "Date",
    product: "Product",
    type: "Type",
    quantity: "Quantity",
    previous: "Previous",
    new: "New",
    user: "User",
    notes: "Notes",

    // Login Page
    loginHeaderTitle: "Nordic Prowear",
    loginHeaderSubtitle: "Garment Inventory, CRM & B2B Portal",
    staffLoginTab: "Staff Login",
    customerLoginTab: "B2B Customer Login",
    emailOrPhone: "Email or Phone Number",
    password: "Password",
    loginButton: "Sign In",
    loggingIn: "Signing in...",
    customerLoginSubtext: "Access your customer-specific B2B catalog & order history.",

    // Task 1: Customer Database
    customerRegister: "Customer Database",
    addNewCustomer: "Add New Customer",
    editCustomer: "Edit Customer",
    customerCode: "Customer ID",
    fullName: "Contact Name",
    companyName: "Company Name",
    vatNumber: "VAT / Org Number",
    phone: "Phone",
    email: "Email",
    address: "Address",
    city: "City",
    customerType: "Customer Type",
    regular: "Regular",
    wholesale: "Wholesale B2B",
    vip: "VIP",
    status: "Status",
    active: "Active",
    inactive: "Inactive",
    totalOrders: "Total Orders",
    totalSpent: "Total Spent",
    actions: "Actions",
    contacts: "Contacts & People",
    customPricing: "Customer-Specific Pricing",
    catalogAccess: "Product Catalog Permissions",
    portalAccess: "B2B Portal Access & Password",
    setPortalPassword: "Set Customer Portal Password",
    gdprActions: "GDPR Compliance Data Management",
    exportGdpr: "Export Customer GDPR File",
    anonymizeGdpr: "Anonymize Customer (Right to be Forgotten)",
    saveCustomer: "Save Customer",
    addContact: "Add Contact",
    primaryContact: "Primary Contact",
    customPriceNotice: "Override default sale price for this specific customer:",
    catalogPermissionNotice: "Control which articles this customer can view & order in their portal:",

    // Task 2: Stock Out
    stockOutModule: "Stock Out & Shipment Fulfillment",
    mandatoryCustomerSelect: "Select Customer (Mandatory)",
    selectCustomerPlaceholder: "-- Choose Customer receiving stock --",
    scanOrSearchProduct: "Scan Barcode or Search SKU / Style...",
    packagingWeightKg: "Packaging Weight (kg)",
    garmentWeightKg: "Total Garment Weight (kg)",
    estimatedParcelWeight: "Estimated Parcel Weight (kg)",
    weightMissingAlert: "Warning: Some selected items do not have weight specified. Total parcel weight may be inaccurate.",
    performStockOut: "Process Stock Out & Generate Delivery Note",
    deliveryNote: "Delivery Note",
    deliveryNoteNumber: "Delivery Note #",
    deliveryNoteHistory: "Stock Out & Delivery Note History",
    reprintDeliveryNote: "Print / Reprint Delivery Note PDF",

    // Task 3: Customer Portal
    b2bCatalog: "B2B Product Catalogue",
    addToCart: "Add to Cart",
    cartSummary: "Shopping Cart Summary",
    subtotal: "Subtotal",
    taxMva: "VAT (MVA 25%)",
    totalAmount: "Grand Total",
    shippingAddress: "Shipping Address",
    orderNotes: "Order Notes / References",
    placeOrder: "Place B2B Order",
    orderConfirmation: "Order Confirmation",
    orderHistory: "Customer Order History",
    fulfillOrderBtn: "Fulfill & Process Stock Out",

    // Task 4: Reports
    reportInventory: "Inventory Report",
    reportStockIn: "Stock In Report",
    reportStockOut: "Stock Out Report",
    reportCustomerOrders: "Customer Orders Report",
    reportProductMovement: "Product Movement Report",
    reportLowStock: "Low Stock Report",
    reportCustomerPurchases: "Customer Purchase Report",
    reportOpenOrders: "Open Orders Report",
    exportExcel: "Export to Excel (.xlsx)",
    exportPdf: "Export to PDF",
    fromDate: "From Date",
    toDate: "To Date",
    filterBtn: "Apply Filters",

    // Task 5: Weight Calculator
    parcelWeightCalculator: "Shipment Weight Estimator",
    weightPerArticle: "Weight per Article (kg)",
    missingWeightBadge: "Weight Missing",

    // Common
    search: "Search...",
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    view: "View",
    details: "Details",
    loading: "Loading...",
    success: "Success",
    error: "Error"
  },
  no: {
    // Brand & App Header
    brandTitle: "Nordic Prowear",
    brandSubtitle: "CRM & Kundeportal",
    language: "Språk",
    english: "English (US)",
    norwegian: "Norsk (NO)",

    // Navigation Sidebar
    dashboard: "Oversikt",
    articles: "Artikler",
    products: "Produkter og stiler",
    categories: "Kategorier",
    inventory: "Lagerstyring",
    stockIn: "Varemottak (Stock In)",
    stockOut: "Vareutgang (Stock Out)",
    transactions: "Transaksjoner",
    crm: "CRM",
    customers: "Kunder",
    leads: "Leads",
    pipeline: "Pipeline",
    tasks: "Oppgaver",
    support: "Support",
    returns: "Returer",
    lowStock: "Lavt lager",
    sales: "Salg & POS",
    b2bOrders: "B2B Kundebestillinger",
    b2bPortal: "B2B Kundeportal",
    reports: "Rapporter",
    reportsHub: "Komplette rapporter og eksport",
    weightCalculator: "Pakkevekt-beregner",
    users: "Brukerhåndtering",
    settings: "Innstillinger",
    logout: "Logg ut",

    // Page Titles & Table Headers
    inventoryMovementHistory: "Historikk for lagerbevegelser",
    date: "Dato",
    product: "Produkt",
    type: "Type",
    quantity: "Antall",
    previous: "Forrige",
    new: "Ny",
    user: "Bruker",
    notes: "Notater",

    // Login Page
    loginHeaderTitle: "Nordic Prowear",
    loginHeaderSubtitle: "Kleslager, CRM og B2B-portal",
    staffLoginTab: "Ansatt-innlogging",
    customerLoginTab: "B2B Kundeportal-innlogging",
    emailOrPhone: "E-post eller telefonnummer",
    password: "Passord",
    loginButton: "Logg inn",
    loggingIn: "Logger inn...",
    customerLoginSubtext: "Få tilgang til din kundespesifikke B2B-katalog og ordrehistorikk.",

    // Task 1: Customer Database
    customerRegister: "Kundedatabase",
    addNewCustomer: "Legg til ny kunde",
    editCustomer: "Rediger kunde",
    customerCode: "Kundenummer",
    fullName: "Kontaktperson",
    companyName: "Bedriftsnavn",
    vatNumber: "Organisasjonsnummer (MVA)",
    phone: "Telefon",
    email: "E-post",
    address: "Adresse",
    city: "Poststed/By",
    customerType: "Kundetype",
    regular: "Ordinær",
    wholesale: "Engros B2B",
    vip: "VIP-kunde",
    status: "Status",
    active: "Aktiv",
    inactive: "Inaktiv",
    totalOrders: "Totalt antall ordrer",
    totalSpent: "Totalt handlet for",
    actions: "Handlinger",
    contacts: "Kontakter og personer",
    customPricing: "Kundespesifikke priser",
    catalogAccess: "Produktkatalog-tilganger",
    portalAccess: "B2B Portal-tilgang og passord",
    setPortalPassword: "Angi passord for kundeportal",
    gdprActions: "GDPR Personvern & Datahåndtering",
    exportGdpr: "Eksporter GDPR-datafil",
    anonymizeGdpr: "Anonymiser kunde (Rett til å bli glemt)",
    saveCustomer: "Lagre kunde",
    addContact: "Legg til kontakt",
    primaryContact: "Hovedkontakt",
    customPriceNotice: "Overstyr standard salgspris for denne spesifikke kunden:",
    catalogPermissionNotice: "Styr hvilke artikler denne kunden kan se og bestille i sin portal:",

    // Task 2: Stock Out
    stockOutModule: "Vareutgang og forsendelsesregistrering",
    mandatoryCustomerSelect: "Velg kunde (Obligatorisk)",
    selectCustomerPlaceholder: "-- Velg kunden som mottar varene --",
    scanOrSearchProduct: "Skann strekkode eller søk SKU / stil...",
    packagingWeightKg: "Emballasjevekt (kg)",
    garmentWeightKg: "Total klesvekt (kg)",
    estimatedParcelWeight: "Beregnet pakkevekt (kg)",
    weightMissingAlert: "Advarsel: Noen valgte artikler mangler vekt. Total pakkevekt kan være unøyaktig.",
    performStockOut: "Registrer vareutgang og opprett følgeseddel",
    deliveryNote: "Følgeseddel",
    deliveryNoteNumber: "Følgeseddel #",
    deliveryNoteHistory: "Historikk for vareutgang og følgesedler",
    reprintDeliveryNote: "Skriv ut / Utskrift av følgeseddel PDF",

    // Task 3: Customer Portal
    b2bCatalog: "B2B Produktkatalog",
    addToCart: "Legg i handlekurv",
    cartSummary: "Sammendrag av handlekurv",
    subtotal: "Nettobeløp",
    taxMva: "MVA (25%)",
    totalAmount: "Totalbeløp inkl. MVA",
    shippingAddress: "Leveringsadresse",
    orderNotes: "Ordrenotater / Referanse",
    placeOrder: "Send B2B-bestilling",
    orderConfirmation: "Ordrebekreftelse",
    orderHistory: "Kundeordrehistorikk",
    fulfillOrderBtn: "Fullfør ordre og trekk fra lager",

    // Task 4: Reports
    reportInventory: "Lagerrapport",
    reportStockIn: "Varemottaksrapport",
    reportStockOut: "Vareutgangsrapport",
    reportCustomerOrders: "Kundeordrerapport",
    reportProductMovement: "Produktbevegelsesrapport",
    reportLowStock: "Lavt lager-rapport",
    reportCustomerPurchases: "Kunderapport (Kjøp)",
    reportOpenOrders: "Åpne ordrer-rapport",
    exportExcel: "Eksporter til Excel (.xlsx)",
    exportPdf: "Eksporter til PDF",
    fromDate: "Fra dato",
    toDate: "Til dato",
    filterBtn: "Filtrer rapport",

    // Task 5: Weight Calculator
    parcelWeightCalculator: "Forsendelsesvekt-kalkulator",
    weightPerArticle: "Vekt per artikkel (kg)",
    missingWeightBadge: "Vekt mangler",

    // Common
    search: "Søk...",
    cancel: "Avbryt",
    save: "Lagre",
    delete: "Delete",
    view: "Vis",
    details: "Detaljer",
    loading: "Laster...",
    success: "Suksess",
    error: "Feil"
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("app_language") || "en";
  });

  const changeLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem("app_language", newLang);
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations.en?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
