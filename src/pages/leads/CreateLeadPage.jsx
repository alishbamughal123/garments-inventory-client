import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import { appRoutes } from "../../config/routes";
import { createLead } from "../../services/lead.service";
import { useLanguage } from "../../context/LanguageContext";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white";

const CreateLeadPage = () => {
  const navigate = useNavigate();
  const { t, isNo } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    designation: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    source: "WEBSITE",
    expectedDealValue: 0,
    notes: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await createLead(formData);
      toast.success(isNo ? "Lead opprettet i CRM!" : "Lead created successfully in CRM!");
      navigate(appRoutes.crmLeads);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || (isNo ? "Kunne ikke opprette lead" : "Failed to create lead")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <PageHeader
        title={isNo ? "Opprett nytt lead" : "Create Lead"}
        description={
          isNo
            ? "Registrer en ny salgsmulighet med kontaktinfo, kilde og forventet avtaleverdi."
            : "Capture a new opportunity with contact, source, and expected deal value."
        }
      />

      <form onSubmit={submit} className="space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">
              {isNo ? "Lead-informasjon & Kontakt" : "Lead Information"}
            </h3>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                {isNo ? "Fullt navn *" : "Full Name *"}
              </label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={inputClass}
                placeholder={isNo ? "f.eks. Ola Nordmann" : "e.g. John Doe"}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                {isNo ? "Bedriftsnavn" : "Company Name"}
              </label>
              <input
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className={inputClass}
                placeholder={isNo ? "f.eks. Nordic Retail AS" : "e.g. Acme Corp"}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                {isNo ? "Stilling / Rolle" : "Designation / Title"}
              </label>
              <input
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className={inputClass}
                placeholder={isNo ? "f.eks. Innkjøpssjef" : "e.g. Purchasing Manager"}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                {isNo ? "E-postadresse" : "Email Address"}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={inputClass}
                placeholder="post@bedrift.no"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                {isNo ? "Telefon *" : "Phone Number *"}
              </label>
              <input
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={inputClass}
                placeholder="+47 400 00 000"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                {isNo ? "Poststed / By" : "City"}
              </label>
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={inputClass}
                placeholder={isNo ? "Oslo" : "Oslo"}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                {isNo ? "Kilde" : "Lead Source"}
              </label>
              <select
                name="source"
                value={formData.source}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="WEBSITE">{isNo ? "Nettside" : "Website"}</option>
                <option value="FACEBOOK">Facebook</option>
                <option value="INSTAGRAM">Instagram</option>
                <option value="REFERRAL">{isNo ? "Anbefaling" : "Referral"}</option>
                <option value="COLD_OUTREACH">{isNo ? "Egenkontakt" : "Cold Outreach"}</option>
                <option value="TRADE_SHOW">{isNo ? "Messe / Utstilling" : "Trade Show"}</option>
                <option value="OTHER">{isNo ? "Annet" : "Other"}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                {isNo ? "Forventet avtaleverdi (NOK)" : "Estimated Deal Value (NOK)"}
              </label>
              <input
                type="number"
                name="expectedDealValue"
                value={formData.expectedDealValue}
                onChange={handleChange}
                className={inputClass}
                placeholder="50000"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                {isNo ? "Gateadresse" : "Address"}
              </label>
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={inputClass}
                placeholder={isNo ? "Storgata 12" : "123 Main St"}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              {isNo ? "Notater & Oppfølging" : "Notes & Follow-up Details"}
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className={inputClass}
              placeholder={isNo ? "Skriv inn detaljer om kunden eller forespørselen..." : "Write lead notes or requirements..."}
            />
          </div>
        </section>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(appRoutes.crmLeads)}
          >
            {isNo ? "Avbryt" : "Cancel"}
          </Button>

          <Button type="submit" disabled={loading}>
            {loading
              ? (isNo ? "Lagrer..." : "Saving...")
              : (isNo ? "Lagre lead" : "Save Lead")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateLeadPage;
