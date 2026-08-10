import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import { appRoutes } from "../../config/routes";
import { createCustomer } from "../../services/customer.service";
import { useLanguage } from "../../context/LanguageContext";
import { Plus, Trash2, Shield, UserCheck } from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white";

const CreateCustomerPage = () => {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();

  const [formData, setFormData] = useState({
    customerCode: "",
    fullName: "",
    companyName: "",
    vatNumber: "",
    designation: "",
    phoneNumber: "",
    alternatePhone: "",
    email: "",
    password: "",
    website: "",
    source: "",
    address: "",
    city: "",
    notes: "",
    customerType: "WHOLESALE",
    status: "ACTIVE",
  });

  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({
    name: "",
    title: "",
    email: "",
    phone: "",
    isPrimary: false
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddContact = () => {
    if (!newContact.name) {
      toast.error(lang === "no" ? "Navn på kontakt er obligatorisk" : "Contact name is required");
      return;
    }
    setContacts([...contacts, newContact]);
    setNewContact({ name: "", title: "", email: "", phone: "", isPrimary: false });
  };

  const handleRemoveContact = (index) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCustomer({
        ...formData,
        contacts
      });

      toast.success(lang === "no" ? "Kunde opprettet i CRM!" : "Customer created successfully in CRM!");
      navigate(appRoutes.crmCustomers);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || (lang === "no" ? "Kunne ikke opprette kunde" : "Failed to create customer")
      );
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <PageHeader
        title={t("addNewCustomer")}
        description={lang === "no" ? "Opprett ny CRM-kunde med bedriftsinfo, kontakter og portal-tilgang." : "Register a central customer profile for Stock Out, B2B Portal, and CRM history."}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Company & Core Information */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <span>🏢</span> {t("companyName")} & Profile
          </h3>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">{t("customerCode")}</label>
              <input
                name="customerCode"
                placeholder="Auto-generated if empty (e.g. CUST-2026-0001)"
                value={formData.customerCode}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">{t("companyName")}</label>
              <input
                name="companyName"
                placeholder="Nordic Retail AS"
                value={formData.companyName}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">{t("vatNumber")}</label>
              <input
                name="vatNumber"
                placeholder="NO 987 654 321 MVA"
                value={formData.vatNumber}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">{t("fullName")} *</label>
              <input
                name="fullName"
                placeholder="Ola Nordmann"
                value={formData.fullName}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Designation / Role</label>
              <input
                name="designation"
                placeholder="Purchasing Director"
                value={formData.designation}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">{t("phone")} *</label>
              <input
                name="phoneNumber"
                placeholder="+47 400 00 000"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">{t("email")}</label>
              <input
                name="email"
                type="email"
                placeholder="post@nordicretail.no"
                value={formData.email}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">{t("customerType")}</label>
              <select
                name="customerType"
                value={formData.customerType}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="REGULAR">{t("regular")}</option>
                <option value="WHOLESALE">{t("wholesale")}</option>
                <option value="VIP">{t("vip")}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">{t("status")}</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="ACTIVE">{t("active")}</option>
                <option value="INACTIVE">{t("inactive")}</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">{t("address")}</label>
              <textarea
                name="address"
                placeholder="Storgata 12, 0182 Oslo"
                value={formData.address}
                onChange={handleChange}
                rows={2}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Notes</label>
              <textarea
                name="notes"
                placeholder="Special delivery notes or terms..."
                value={formData.notes}
                onChange={handleChange}
                rows={2}
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* Task 1 Requirement: Support Multiple Contacts per Customer */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <span>👥</span> {t("contacts")} ({lang === "no" ? "Flere kontakter per kunde" : "Multiple Contacts per Customer"})
          </h3>

          {/* Added contacts list */}
          {contacts.length > 0 && (
            <div className="space-y-2">
              {contacts.map((contact, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{contact.name}</span>
                    {contact.title && <span className="text-slate-500"> ({contact.title})</span>}
                    {contact.email && <span className="text-slate-600 block">{contact.email} • {contact.phone}</span>}
                  </div>
                  <div className="flex items-center gap-3">
                    {contact.isPrimary && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 font-semibold rounded-full text-[10px]">{t("primaryContact")}</span>}
                    <button type="button" onClick={() => handleRemoveContact(i)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add contact input box */}
          <div className="grid gap-3 sm:grid-cols-5 p-4 bg-slate-50/70 border border-slate-200/60 rounded-xl items-center">
            <input
              placeholder="Contact Name *"
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-blue-500"
            />
            <input
              placeholder="Title / Role"
              value={newContact.title}
              onChange={(e) => setNewContact({ ...newContact, title: e.target.value })}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-blue-500"
            />
            <input
              placeholder="Email"
              value={newContact.email}
              onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-blue-500"
            />
            <input
              placeholder="Phone"
              value={newContact.phone}
              onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={handleAddContact}
              className="flex items-center justify-center gap-1 bg-slate-800 hover:bg-slate-900 text-white rounded-lg py-2 text-xs font-semibold transition"
            >
              <Plus size={14} />
              <span>{t("addContact")}</span>
            </button>
          </div>
        </section>

        {/* Task 3 Requirement: B2B Customer Portal Login Setup */}
        <section className="rounded-2xl border border-teal-200/80 bg-teal-50/30 p-5 shadow-sm sm:p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-teal-100 pb-3">
            <Shield className="text-teal-600" size={18} />
            <span>{t("portalAccess")}</span>
          </h3>

          <p className="text-xs text-slate-600">
            {lang === "no" 
              ? "Angi et passord for at denne kunden skal kunne logge seg inn på B2B Kundeportalen og plassere ordrer direkte på sin konto." 
              : "Assign a password to enable B2B Customer Portal login for this client so they can order online."}
          </p>

          <div className="max-w-md">
            <label className="block text-xs font-semibold text-slate-500 mb-1">{t("password")}</label>
            <input
              name="password"
              type="password"
              placeholder="Set customer portal password"
              value={formData.password}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </section>

        {/* Form Action */}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="submit">
            {t("saveCustomer")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateCustomerPage;
