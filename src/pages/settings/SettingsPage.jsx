import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Store,
  Bell,
  CheckCircle2,
  Save,
  KeyRound,
  Building2,
  Users,
  UserPlus,
} from "lucide-react";
import MainLayout from "../../layouts/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import SurfaceCard from "../../components/ui/SurfaceCard";
import { useAuth } from "../../context/useAuth";
import { useLanguage } from "../../context/LanguageContext";
import { updateProfile } from "../../services/auth.service";
import { inputStyles, labelStyles } from "../../components/ui/formStyles";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { isNo } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile"); // 'profile' | 'store' | 'notifications'

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [storeData, setStoreData] = useState({
    storeName: "Nordic Prowear AS",
    warehouseLocation: "Oslo Sentrallager",
    currency: "NOK (kr)",
    contactEmail: user?.email || "support@nordicprowear.no",
    contactPhone: "+47 22 12 34 56",
  });

  const [notifications, setNotifications] = useState({
    lowStockAlerts: true,
    emailDailyReport: true,
    salesNotifications: true,
    securityAlerts: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStoreChange = (e) => {
    const { name, value } = e.target;
    setStoreData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    toast.success(isNo ? "Innstillinger oppdatert" : "Preference updated");
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      return toast.error(isNo ? "De nye passordene samsvarer ikke" : "New passwords do not match");
    }

    try {
      setLoading(true);
      const payload = {
        name: formData.name,
        email: formData.email,
      };

      if (formData.newPassword) {
        payload.currentPassword = formData.currentPassword;
        payload.newPassword = formData.newPassword;
      }

      const response = await updateProfile(payload);

      updateUser(response.data);
      toast.success(isNo ? "Profilen ble oppdatert!" : "Profile updated successfully!");
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      toast.error(error?.response?.data?.message || (isNo ? "Oppdatering mislyktes" : "Update failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStore = (e) => {
    e.preventDefault();
    toast.success(isNo ? "Butikkinformasjon lagret!" : "Store details saved successfully!");
  };

  const getInitials = (name) => {
    if (!name) return "NP";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <MainLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        <PageHeader
          title={isNo ? "Konto- & Systeminnstillinger" : "Account & System Settings"}
          description={
            isNo
              ? "Administrer profilpålogging, sikkerhetsvalg, butikkinformasjon og systemvarsler."
              : "Manage your profile credentials, security preferences, store information, and system notifications."
          }
        />

        {/* HERO USER PROFILE CARD */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-slate-900/10 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-indigo-600/30 border-2 border-indigo-400/40 text-white flex items-center justify-center font-extrabold text-2xl sm:text-3xl shadow-lg shadow-indigo-500/20 shrink-0">
              {getInitials(user?.name)}
            </div>

            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{user?.name || (isNo ? "Systembruker" : "System User")}</h2>
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
                  {user?.role || "ADMIN"}
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> {isNo ? "Aktiv" : "Active"}
                </span>
              </div>
              <p className="text-sm text-slate-300 flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="w-4 h-4 text-slate-400" />
                {user?.email || "admin@example.com"}
              </p>
              <p className="text-xs text-slate-400 pt-1">
                {isNo ? "Konto-ID:" : "Account ID:"} <code className="font-mono text-slate-300">{user?.id || "admin-root"}</code>
              </p>
            </div>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex items-center gap-2 border-b border-slate-200/80 overflow-x-auto pb-1">
          <TabButton
            id="profile"
            label={isNo ? "Profil & Sikkerhet" : "Profile & Security"}
            icon={<User className="w-4 h-4" />}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <TabButton
            id="store"
            label={isNo ? "Bedriftsprofil" : "Store Profile"}
            icon={<Building2 className="w-4 h-4" />}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <TabButton
            id="notifications"
            label={isNo ? "Varsler" : "Notifications"}
            icon={<Bell className="w-4 h-4" />}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        {/* TAB 1: PROFILE & SECURITY */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8">
              <SurfaceCard className="p-6 sm:p-8">
                <form onSubmit={handleSubmitProfile} className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
                      <User className="w-5 h-5 text-indigo-600" /> {isNo ? "Personlig informasjon" : "Personal Information"}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {isNo ? "Oppdater kontonavn og primær e-postadresse." : "Update your account name and primary email address."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={labelStyles}>{isNo ? "Fullt navn" : "Full Name"}</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          name="name"
                          type="text"
                          required
                          className={`${inputStyles} pl-10`}
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className={labelStyles}>{isNo ? "E-postadresse" : "Email Address"}</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          name="email"
                          type="email"
                          required
                          className={`${inputStyles} pl-10`}
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  <hr className="border-slate-100 my-6" />

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
                        <KeyRound className="w-5 h-5 text-indigo-600" /> {isNo ? "Passord & Sikkerhet" : "Password & Security"}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {isNo
                          ? "La passordfeltene stå tomme dersom du ikke ønsker å endre passordet."
                          : "Leave password fields empty if you do not wish to change your current password."}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className={labelStyles}>{isNo ? "Nåværende passord" : "Current Password"}</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          name="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          className={`${inputStyles} pl-10 pr-10`}
                          value={formData.currentPassword}
                          onChange={handleChange}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className={labelStyles}>{isNo ? "Nytt passord" : "New Password"}</label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                          <input
                            name="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            className={`${inputStyles} pl-10 pr-10`}
                            value={formData.newPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className={labelStyles}>{isNo ? "Bekreft nytt passord" : "Confirm New Password"}</label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                          <input
                            name="confirmPassword"
                            type="password"
                            className={`${inputStyles} pl-10`}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-100">
                    <Button
                      type="submit"
                      isLoading={loading}
                      className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 px-6 py-2.5 rounded-2xl font-semibold text-sm cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      {isNo ? "Lagre endringer" : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </SurfaceCard>
            </div>

            {/* SIDE ROLES & ACCESS SUMMARY */}
            <div className="md:col-span-4 space-y-6">
              {/* TEAM & USER MANAGEMENT DIRECT SHORTCUT CARD */}
              <SurfaceCard className="p-6 space-y-4 border border-blue-100 bg-gradient-to-br from-blue-50/60 to-white shadow-sm">
                <div className="flex items-center gap-3 border-b border-blue-100 pb-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm shadow-blue-200">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{isNo ? "Brukere & Tilgang" : "Add / Manage Users"}</h4>
                    <p className="text-[11px] text-slate-500">{isNo ? "Opprett e-post og passord for ansatte" : "Create staff email & passwords"}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {isNo
                    ? "For å legge til nye ansatte, ledere eller kasserere og tildele dem e-post og påloggingspassord, vennligst bruk Brukeradministrasjon-siden."
                    : "To add new staff, managers, or cashiers to the system and assign them an Email and Login Password, please use the User Management page."}
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/users")}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 shadow-sm transition cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{isNo ? "Åpne Brukeradministrasjon (+ Bruker)" : "Open User Management (+ Add User)"}</span>
                </button>
              </SurfaceCard>

              <SurfaceCard className="p-6 space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <h4 className="font-bold text-slate-900 text-sm">{isNo ? "Rolle & Rettigheter" : "Role & Permissions"}</h4>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-600 font-medium">{isNo ? "Rollenivå" : "Role Level"}</span>
                    <span className="font-bold text-blue-600 uppercase">{user?.role || "ADMIN"}</span>
                  </div>

                  <div className="space-y-2 pt-2">
                    <PermissionItem text={isNo ? "Administrere artikler & strekkoder" : "Manage Products & Barcodes"} />
                    <PermissionItem text={isNo ? "Varemottak & vareutgang (Stock In/Out)" : "Inventory Stock In / Stock Out"} />
                    <PermissionItem text={isNo ? "Salg & POS-kassetilgang" : "Sales & POS Billing Access"} />
                    <PermissionItem text={isNo ? "Prisendring & revisjonslogger" : "Price Revision & Audit Logs"} />
                    <PermissionItem text={isNo ? "CRM & Kundeadministrasjon" : "CRM & Customer Management"} />
                  </div>
                </div>
              </SurfaceCard>
            </div>
          </div>
        )}

        {/* TAB 2: STORE PROFILE */}
        {activeTab === "store" && (
          <SurfaceCard className="p-6 sm:p-8 max-w-3xl">
            <form onSubmit={handleSaveStore} className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
                  <Store className="w-5 h-5 text-indigo-600" /> {isNo ? "Butikk- & Lagerkonfigurasjon" : "Store & Warehouse Configuration"}
                </h3>
                <p className="text-xs text-slate-500">
                  {isNo
                    ? "Konfigurer forretningsinformasjon som vises på følgesedler, fakturaer og rapporter."
                    : "Configure business information displayed on invoices and reports."}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={labelStyles}>{isNo ? "Butikk- / Merkenavn" : "Store / Brand Name"}</label>
                  <input
                    name="storeName"
                    type="text"
                    className={inputStyles}
                    value={storeData.storeName}
                    onChange={handleStoreChange}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={labelStyles}>{isNo ? "Lagerlokasjon" : "Warehouse Location"}</label>
                  <input
                    name="warehouseLocation"
                    type="text"
                    className={inputStyles}
                    value={storeData.warehouseLocation}
                    onChange={handleStoreChange}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={labelStyles}>{isNo ? "Standard valuta" : "Default Currency"}</label>
                  <select
                    name="currency"
                    className={inputStyles}
                    value={storeData.currency}
                    onChange={handleStoreChange}
                  >
                    <option value="NOK (kr)">NOK - Norske Kroner (kr)</option>
                    <option value="EUR (€)">EUR - Euro (€)</option>
                    <option value="USD ($)">USD - US Dollar ($)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className={labelStyles}>{isNo ? "Kundeservice telefon" : "Support Phone"}</label>
                  <input
                    name="contactPhone"
                    type="text"
                    className={inputStyles}
                    value={storeData.contactPhone}
                    onChange={handleStoreChange}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <Button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-2xl font-semibold text-sm cursor-pointer"
                >
                  <Save className="w-4 h-4" /> {isNo ? "Lagre butikkinnstillinger" : "Save Store Settings"}
                </Button>
              </div>
            </form>
          </SurfaceCard>
        )}

        {/* TAB 3: NOTIFICATIONS */}
        {activeTab === "notifications" && (
          <SurfaceCard className="p-6 sm:p-8 max-w-3xl space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
                <Bell className="w-5 h-5 text-indigo-600" /> {isNo ? "Varslingsinnstillinger" : "Notification Preferences"}
              </h3>
              <p className="text-xs text-slate-500">
                {isNo
                  ? "Tilpass e-post- og systemvarsler for lager- og salgsaktiviteter."
                  : "Customize email and system alerts for inventory activities."}
              </p>
            </div>

            <div className="space-y-4">
              <NotificationToggle
                title={isNo ? "Varsel ved lavt lager" : "Low Stock Alerts"}
                desc={
                  isNo
                    ? "Motta varsel når artikler faller under fastsatt minimumsnivå på lager."
                    : "Receive notifications when articles drop below minimum stock alert thresholds."
                }
                checked={notifications.lowStockAlerts}
                onChange={() => toggleNotification("lowStockAlerts")}
              />

              <NotificationToggle
                title={isNo ? "Daglig salgsoppsummering" : "Daily Sales Summary Report"}
                desc={
                  isNo
                    ? "Motta en daglig e-postoppsummering av totalt salg, solgte artikler og omsetning."
                    : "Receive a daily email snapshot of total sales, items sold, and revenue."
                }
                checked={notifications.emailDailyReport}
                onChange={() => toggleNotification("emailDailyReport")}
              />

              <NotificationToggle
                title={isNo ? "Sanntids salgsaktivitet" : "Real-Time Sales Activity"}
                desc={
                  isNo
                    ? "Bli varslet umiddelbart når nye ordrer eller fakturaer opprettes i systemet."
                    : "Get notified immediately when new invoices or orders are generated."
                }
                checked={notifications.salesNotifications}
                onChange={() => toggleNotification("salesNotifications")}
              />

              <NotificationToggle
                title={isNo ? "Sikkerhets- og revisjonsvarsler" : "Security & Price Audit Alerts"}
                desc={
                  isNo
                    ? "Motta sikkerhetsvarsler ved prisendringer eller endring i administratorinnstillinger."
                    : "Receive security alerts when prices are revised or admin settings change."
                }
                checked={notifications.securityAlerts}
                onChange={() => toggleNotification("securityAlerts")}
              />
            </div>
          </SurfaceCard>
        )}
      </div>
    </MainLayout>
  );
};

const TabButton = ({ id, label, icon, activeTab, setActiveTab }) => {
  const isActive = activeTab === id;
  return (
    <button
      onClick={() => setActiveTab(id)}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold text-xs sm:text-sm transition-all duration-200 shrink-0 cursor-pointer ${
        isActive
          ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      {icon}
      {label}
    </button>
  );
};

const PermissionItem = ({ text }) => (
  <div className="flex items-center gap-2 text-slate-700">
    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
    <span>{text}</span>
  </div>
);

const NotificationToggle = ({ title, desc, checked, onChange }) => (
  <div className="flex items-start justify-between p-4 rounded-2xl bg-slate-50/60 border border-slate-100 hover:bg-slate-50 transition-all duration-200">
    <div className="space-y-0.5 pr-4">
      <p className="font-semibold text-sm text-slate-900">{title}</p>
      <p className="text-xs text-slate-500">{desc}</p>
    </div>
    <button
      type="button"
      onClick={onChange}
      className={`w-11 h-6 rounded-full transition-colors duration-200 relative shrink-0 cursor-pointer ${
        checked ? "bg-indigo-600" : "bg-slate-300"
      }`}
    >
      <span
        className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform duration-200 shadow-sm ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  </div>
);

export default SettingsPage;
