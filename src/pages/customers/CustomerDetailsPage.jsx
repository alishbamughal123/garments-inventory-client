import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Building2, Globe, Mail, MapPin, Pencil, Phone, UserRound,
  Shield, Download, UserX, FileText, Package, Truck, Printer
} from "lucide-react";
import { getCustomerById, exportGDPRData, anonymizeGDPRData } from "../../services/customer.service";
import { createActivity } from "../../services/activity.service";
import { sendEmail } from "../../services/email.service";
import StatusBadge from "../../components/ui/StatusBadge";
import ActivityComposer from "../../components/crm/ActivityComposer";
import EmailComposer from "../../components/crm/EmailComposer";
import EmailConversationList from "../../components/crm/EmailConversationList";
import { appRoutes } from "../../config/routes";
import { useLanguage } from "../../context/LanguageContext";

const CustomerDetailsPage = () => {
  const { id } = useParams();
  const { t, lang } = useLanguage();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview"); // overview, contacts, orders, stockout, gdpr
  const [activityLoading, setActivityLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  const loadCustomer = async () => {
    try {
      const response = await getCustomerById(id);
      setCustomer(response.data);
    } catch {
      toast.error(lang === "no" ? "Kunne ikke laste kunden" : "Failed to load customer");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const response = await getCustomerById(id);
        if (isMounted) setCustomer(response.data);
      } catch {
        if (isMounted) toast.error(lang === "no" ? "Kunne ikke laste kunden" : "Failed to load customer");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, [id]);

  const handleActivitySubmit = async (payload) => {
    try {
      setActivityLoading(true);
      await createActivity(payload);
      toast.success(lang === "no" ? "Aktivitet logget" : "Activity logged");
      await loadCustomer();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to log activity");
    } finally {
      setActivityLoading(false);
    }
  };

  const handleEmailSubmit = async (payload) => {
    try {
      setEmailLoading(true);
      await sendEmail(payload);
      toast.success(lang === "no" ? "E-post sendt!" : "Email sent successfully");
      await loadCustomer();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send email");
    } finally {
      setEmailLoading(false);
    }
  };

  const handleExportGDPR = async () => {
    try {
      const res = await exportGDPRData(customer.id);
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(res.data, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `GDPR_Export_${customer.customerCode || customer.fullName}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast.success(lang === "no" ? "GDPR-data eksportert" : "GDPR data exported successfully");
    } catch {
      toast.error("Failed to export GDPR data");
    }
  };

  const handleAnonymizeGDPR = async () => {
    if (!window.confirm(lang === "no" 
      ? "Er du sikker på at du vil anonymisere denne kunden i henhold til GDPR? Dette sletter personopplysninger permanent." 
      : "Are you sure you want to anonymize this customer under GDPR Right to be Forgotten? Personal data will be permanently redacted.")) {
      return;
    }
    try {
      await anonymizeGDPRData(customer.id);
      toast.success(lang === "no" ? "Kunde anonymisert for GDPR" : "Customer data anonymized per GDPR");
      await loadCustomer();
    } catch {
      toast.error("Failed to anonymize customer");
    }
  };

  if (loading) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-500">Loading profile...</div>;
  }

  if (!customer) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-500">Customer profile not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 font-bold border border-blue-100">
                <UserRound size={26} />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                  {customer.customerCode || "CUST-LEGACY"}
                </span>
                <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                  {customer.fullName}
                </h2>
                {customer.companyName && (
                  <p className="text-sm font-semibold text-slate-600 flex items-center gap-1.5 mt-0.5">
                    <Building2 size={15} /> {customer.companyName} {customer.vatNumber && `(VAT: ${customer.vatNumber})`}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleExportGDPR}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
              title="Export GDPR Data"
            >
              <Download size={15} />
              <span>{t("exportGdpr")}</span>
            </button>

            <Link
              to={appRoutes.crmCustomerEdit(customer.id)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
            >
              <Pencil size={15} />
              <span>{t("editCustomer")}</span>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
            <p className="text-xs font-medium text-slate-500">{t("totalOrders")}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{customer.totalOrders || customer.customerOrders?.length || 0}</p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
            <p className="text-xs font-medium text-slate-500">{t("totalSpent")}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              NOK {Number(customer.totalSpent || 0).toLocaleString()}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
            <p className="text-xs font-medium text-slate-500">{t("customerType")}</p>
            <div className="mt-2">
              <StatusBadge value={customer.customerType} />
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
            <p className="text-xs font-medium text-slate-500">{t("status")}</p>
            <div className="mt-2">
              <StatusBadge value={customer.status} />
            </div>
          </div>
        </div>
      </section>

      {/* TAB NAVIGATION */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-3 px-4 border-b-2 transition ${activeTab === "overview" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-900"}`}
        >
          Overview & CRM Timeline
        </button>
        <button
          onClick={() => setActiveTab("contacts")}
          className={`pb-3 px-4 border-b-2 transition ${activeTab === "contacts" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-900"}`}
        >
          {t("contacts")} ({customer.contacts?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-3 px-4 border-b-2 transition ${activeTab === "orders" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-900"}`}
        >
          B2B Orders ({customer.customerOrders?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("stockout")}
          className={`pb-3 px-4 border-b-2 transition ${activeTab === "stockout" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-900"}`}
        >
          Stock Out Receipts ({customer.stockOuts?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("gdpr")}
          className={`pb-3 px-4 border-b-2 transition ${activeTab === "gdpr" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-900"}`}
        >
          GDPR & Anonymization
        </button>
      </div>

      {/* TAB CONTENTS */}
      {activeTab === "overview" && (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h3 className="text-base font-bold text-slate-900 mb-4">Contact Profile</h3>
              <div className="grid gap-4 sm:grid-cols-2 text-xs">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <Phone size={16} className="text-slate-400" />
                  <div>
                    <span className="text-slate-400 block">Phone</span>
                    <span className="font-semibold text-slate-800">{customer.phoneNumber}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <Mail size={16} className="text-slate-400" />
                  <div>
                    <span className="text-slate-400 block">Email</span>
                    <span className="font-semibold text-slate-800">{customer.email || "-"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl sm:col-span-2">
                  <MapPin size={16} className="text-slate-400" />
                  <div>
                    <span className="text-slate-400 block">Address</span>
                    <span className="font-semibold text-slate-800">{customer.address || "-"}, {customer.city}</span>
                  </div>
                </div>
              </div>
            </section>

            <ActivityComposer
              title="Log Customer Activity"
              entityIds={{ customerId: customer.id }}
              onSubmit={handleActivitySubmit}
              loading={activityLoading}
            />

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-4">Activity Timeline</h3>
              <div className="space-y-3">
                {customer.activityTimeline?.map((item) => (
                  <div key={`${item.source}-${item.id}`} className="p-3 border border-slate-100 rounded-xl bg-slate-50/60 text-xs">
                    <div className="flex justify-between items-center">
                      <StatusBadge value={item.type} />
                      <span className="text-[10px] text-slate-400">{new Date(item.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="font-bold text-slate-900 mt-2">{item.subject}</p>
                    <p className="text-slate-600 mt-0.5">{item.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <EmailComposer
              title="Send Email to Customer"
              entityIds={{ customerId: customer.id }}
              initialToEmail={customer.email || ""}
              onSubmit={handleEmailSubmit}
              loading={emailLoading}
            />
            <EmailConversationList conversations={customer.emailConversations || []} />
          </div>
        </div>
      )}

      {/* Contacts Tab */}
      {activeTab === "contacts" && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">{t("contacts")} ({customer.contacts?.length || 0})</h3>
          {customer.contacts?.length === 0 ? (
            <p className="text-xs text-slate-500">No additional contacts registered.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {customer.contacts?.map((contact) => (
                <div key={contact.id} className="p-4 border border-slate-200 bg-slate-50/60 rounded-xl space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-slate-900">{contact.name}</span>
                    {contact.isPrimary && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 font-semibold rounded-full text-[10px]">Primary</span>}
                  </div>
                  {contact.title && <p className="text-slate-500 font-medium">{contact.title}</p>}
                  {contact.email && <p className="text-slate-700">✉️ {contact.email}</p>}
                  {contact.phone && <p className="text-slate-700">📞 {contact.phone}</p>}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">B2B Customer Orders</h3>
          {customer.customerOrders?.length === 0 ? (
            <p className="text-xs text-slate-500">No B2B orders placed yet.</p>
          ) : (
            <div className="space-y-3">
              {customer.customerOrders?.map((order) => (
                <div key={order.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center text-xs">
                  <div>
                    <span className="font-mono font-bold text-blue-600 text-sm">{order.orderNumber}</span>
                    <span className="text-slate-400 ml-2">({new Date(order.createdAt).toLocaleDateString()})</span>
                    <p className="text-slate-600 mt-1">{order.orderItems?.length || 0} items • Parcel Weight: <span className="font-semibold text-slate-900">{order.totalParcelWeight?.toFixed(2)} kg</span></p>
                  </div>

                  <div className="flex items-center gap-4">
                    <StatusBadge value={order.status} />
                    <span className="font-bold text-slate-900 text-sm">NOK {Number(order.totalAmount).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Stock Out Tab */}
      {activeTab === "stockout" && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">Stock Out & Delivery Note Receipts</h3>
          {customer.stockOuts?.length === 0 ? (
            <p className="text-xs text-slate-500">No stock out transactions recorded for this customer.</p>
          ) : (
            <div className="space-y-3">
              {customer.stockOuts?.map((tx) => (
                <div key={tx.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{tx.product?.productName}</span>
                    <span className="text-slate-500 ml-2">({tx.product?.sku})</span>
                    <p className="text-slate-600 mt-0.5">Qty: <span className="font-bold text-slate-900">{tx.quantity}</span> • Parcel Weight: <span className="font-semibold text-blue-600">{tx.totalWeightKg?.toFixed(2)} kg</span></p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{new Date(tx.createdAt).toLocaleString()} by {tx.performedBy?.name}</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-semibold text-[11px]">Stock Out Complete</span>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* GDPR Tab */}
      {activeTab === "gdpr" && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Shield className="text-emerald-600" size={18} />
              <span>{t("gdprActions")}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {lang === "no" 
                ? "Overhold GDPR-regelverk med eksport av personopplysninger og anonymisering på forespørsel." 
                : "Manage customer rights under GDPR, including data export requests and right to be forgotten."}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <h4 className="font-bold text-xs text-slate-800">{t("exportGdpr")}</h4>
              <p className="text-[11px] text-slate-500">Download full JSON data package of all records held for this customer.</p>
              <button
                onClick={handleExportGDPR}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition"
              >
                <Download size={14} />
                <span>Download Data Package</span>
              </button>
            </div>

            <div className="p-4 bg-red-50/50 border border-red-200 rounded-xl space-y-3">
              <h4 className="font-bold text-xs text-red-900">{t("anonymizeGdpr")}</h4>
              <p className="text-[11px] text-red-600">Permanently anonymize all contact details and name fields while retaining transaction figures for tax audit.</p>
              <button
                onClick={handleAnonymizeGDPR}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition"
              >
                <UserX size={14} />
                <span>Anonymize Customer</span>
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default CustomerDetailsPage;
