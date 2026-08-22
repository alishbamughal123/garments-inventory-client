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
    legalEntity: "",
    designation: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    county: "",
    rank: "",
    segment: "",
    priority: "A",
    revenueMnok: "",
    financialYear: "2025",
    revenueBasis: "",
    contactType: "",
    verificationStatus: "",
    relevantStaff: "",
    relevantTextiles: "",
    healthcareNvk: "",
    source: "TRADE_SHOW",
    status: "NEW",
    expectedDealValue: 0,
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const payload = {
        ...formData,
        rank: formData.rank ? parseInt(formData.rank, 10) : null,
        revenueMnok: formData.revenueMnok ? parseFloat(formData.revenueMnok) : null,
        expectedDealValue: formData.expectedDealValue ? parseFloat(formData.expectedDealValue) : 0,
      };

      await createLead(payload);
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
        title={isNo ? "Opprett nytt B2B Lead" : "Create New B2B Lead"}
        description={
          isNo
            ? "Registrer en ny forretningsmulighet med kontaktperson, bransje, omsetning og klesbehov."
            : "Capture a new business opportunity with contact person, segment, revenue, and garment requirements."
        }
      />

      <form onSubmit={submit} className="space-y-6">
        {/* Section 1: Company & Market Profile */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">
              {isNo ? "1. Bedriftsprofil & Bransje" : "1. Company Profile & Market Segment"}
            </h3>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                {isNo ? "Bedriftsnavn / Selskap *" : "Company Name *"}
              </label>
              <input
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className={inputClass}
                placeholder={isNo ? "f.eks. Volvat Medisinske Senter" : "e.g. Acme Health AS"}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                {isNo ? "Juridisk enhet" : "Legal Entity"}
              </label>
              <input
                name="legalEntity"
                value={formData.legalEntity}
                onChange={handleChange}
                className={inputClass}
                placeholder={isNo ? "f.eks. Volvat Medisinske Senter AS" : "e.g. Acme Health Norge AS"}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                {isNo ? "Rangering (Rank)" : "Rank"}
              </label>
              <input
                type="number"
                name="rank"
                value={formData.rank}
                onChange={handleChange}
                className={inputClass}
                placeholder="1"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                {isNo ? "Bransje / Segment" : "Segment / Industry"}
              </label>
              <input
                name="segment"
                value={formData.segment}
                onChange={handleChange}
                className={inputClass}
                placeholder={isNo ? "f.eks. Privat sykehus / Tannlege / HoReCa / Vaskeri" : "e.g. Private hospital / Dental / HoReCa / Laundry"}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                {isNo ? "Prioritet" : "Priority"}
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="A+">A+ (Høyest potensial / Highest Potential)</option>
                <option value="A">A (Høyt potensial / High Potential)</option>
                <option value="A-">A- (Middels-høyt / Medium-High)</option>
                <option value="B+">B+ (Middels potensial / Medium Potential)</option>
                <option value="B">B (Mindre / Standard)</option>
                <option value="Tender">Tender (Offentlig / Anbud)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                {isNo ? "Omsetning (MNOK)" : "Annual Turnover (MNOK)"}
              </label>
              <input
                type="number"
                step="any"
                name="revenueMnok"
                value={formData.revenueMnok}
                onChange={handleChange}
                className={inputClass}
                placeholder="1251.2"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                {isNo ? "Regnskapsår" : "Financial Year"}
              </label>
              <input
                name="financialYear"
                value={formData.financialYear}
                onChange={handleChange}
                className={inputClass}
                placeholder="2025"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                {isNo ? "Omsetningsgrunnlag" : "Revenue Basis"}
              </label>
              <input
                name="revenueBasis"
                value={formData.revenueBasis}
                onChange={handleChange}
                className={inputClass}
                placeholder={isNo ? "f.eks. Konsern / Selskap" : "e.g. Group / Company"}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                {isNo ? "Helse / NVK-status" : "Healthcare / NVK Status"}
              </label>
              <input
                name="healthcareNvk"
                value={formData.healthcareNvk}
                onChange={handleChange}
                className={inputClass}
                placeholder={isNo ? "NVK-medlem / Ja" : "NVK Member / Yes"}
              />
            </div>
          </div>
        </section>

        {/* Section 2: Contact Person & Verification */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">
              {isNo ? "2. Kontaktperson & Verifisering" : "2. Contact Person & Verification"}
            </h3>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                {isNo ? "Anbefalt kontakt / Navn *" : "Contact Person / Full Name *"}
              </label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={inputClass}
                placeholder={isNo ? "f.eks. Joachim Papp-Mikalsen" : "e.g. John Doe"}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                {isNo ? "Stilling / Rolle" : "Role / Designation"}
              </label>
              <input
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className={inputClass}
                placeholder={isNo ? "f.eks. Head of Procurement / Innkjøpssjef" : "e.g. Head of Procurement"}
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
                placeholder="+47 22 54 10 00"
                required
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
                placeholder="innkjop@bedrift.no"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                {isNo ? "Kontakttype" : "Contact Type"}
              </label>
              <input
                name="contactType"
                value={formData.contactType}
                onChange={handleChange}
                className={inputClass}
                placeholder={isNo ? "Navngitt beslutningstaker / Sentral kontakt" : "Named Decision Maker / Central"}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                {isNo ? "Verifiseringsstatus" : "Verification Status"}
              </label>
              <input
                name="verificationStatus"
                value={formData.verificationStatus}
                onChange={handleChange}
                className={inputClass}
                placeholder={isNo ? "Rolle verifisert / Direkte verifisert" : "Role Verified / Direct"}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                {isNo ? "Sted / By" : "City / Location"}
              </label>
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={inputClass}
                placeholder={isNo ? "Oslo / Ski / Bergen" : "Oslo / Ski / Bergen"}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                {isNo ? "Fylke" : "County"}
              </label>
              <input
                name="county"
                value={formData.county}
                onChange={handleChange}
                className={inputClass}
                placeholder={isNo ? "Akershus / Trøndelag / Vestland" : "Akershus / Trøndelag / Vestland"}
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
        </section>

        {/* Section 3: Garments, Textiles & Requirements */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">
              {isNo ? "3. Klesbehov & Tekstiltjenester" : "3. Garments, Uniforms & Textile Services"}
            </h3>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                {isNo ? "Målgruppe / Ansatte / Avdelinger" : "Target Staff / Departments"}
              </label>
              <input
                name="relevantStaff"
                value={formData.relevantStaff}
                onChange={handleChange}
                className={inputClass}
                placeholder={isNo ? "f.eks. Kokker, kjøkken, servitører / Renhold / Spa" : "e.g. Chefs, kitchen, service / Housekeeping / Spa"}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                {isNo ? "Relevante tekstiler & tjenester" : "Relevant Textiles & Services"}
              </label>
              <input
                name="relevantTextiles"
                value={formData.relevantTextiles}
                onChange={handleChange}
                className={inputClass}
                placeholder={isNo ? "f.eks. Tekstilutleie, vaskeri, mopper, matter" : "e.g. Textile rental, laundry, mops, mats"}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3 pt-2">
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
                <option value="TRADE_SHOW">{isNo ? "B2B Prospekt / Messe" : "B2B Prospect / Trade Show"}</option>
                <option value="WEBSITE">{isNo ? "Nettside" : "Website"}</option>
                <option value="REFERRAL">{isNo ? "Anbefaling" : "Referral"}</option>
                <option value="EXISTING_CUSTOMER">{isNo ? "Eksisterende kunde" : "Existing Customer"}</option>
                <option value="OTHER">{isNo ? "Annet" : "Other"}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                {isNo ? "Pipeline-status" : "Pipeline Status"}
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="NEW">{isNo ? "Ny henvendelse" : "New"}</option>
                <option value="CONTACTED">{isNo ? "Kontaktet" : "Contacted"}</option>
                <option value="QUALIFIED">{isNo ? "Kvalifisert" : "Qualified"}</option>
                <option value="PROPOSAL_SENT">{isNo ? "Tilbud sendt" : "Proposal Sent"}</option>
                <option value="NEGOTIATION">{isNo ? "Forhandling" : "Negotiation"}</option>
                <option value="WON">{isNo ? "Vunnet" : "Won"}</option>
                <option value="LOST">{isNo ? "Tapt" : "Lost"}</option>
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
                placeholder="250000"
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
              : (isNo ? "Lagre B2B Lead" : "Save B2B Lead")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateLeadPage;
