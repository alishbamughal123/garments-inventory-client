import { useState } from "react";
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
  Sliders,
  Sparkles,
} from "lucide-react";
import MainLayout from "../../layouts/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import SurfaceCard from "../../components/ui/SurfaceCard";
import { useAuth } from "../../context/useAuth";
import { updateProfile } from "../../services/auth.service";
import { inputStyles, labelStyles } from "../../components/ui/formStyles";

const SettingsPage = () => {
  const { user, updateUser } = useAuth();
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
    storeName: "Nordic Prowear Garments",
    warehouseLocation: "Oslo Central Warehouse",
    currency: "PKR (Rs.)",
    contactEmail: user?.email || "support@nordicprowear.com",
    contactPhone: "+92 300 1234567",
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
    toast.success("Preference updated");
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      return toast.error("New passwords do not match");
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
      toast.success("Profile updated successfully!");
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStore = (e) => {
    e.preventDefault();
    toast.success("Store details saved successfully!");
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
          title="Account & System Settings"
          description="Manage your profile credentials, security preferences, store information, and system notifications."
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
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{user?.name || "System User"}</h2>
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
                  {user?.role || "ADMIN"}
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active
                </span>
              </div>
              <p className="text-sm text-slate-300 flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="w-4 h-4 text-slate-400" />
                {user?.email || "admin@example.com"}
              </p>
              <p className="text-xs text-slate-400 pt-1">
                Account ID: <code className="font-mono text-slate-300">{user?.id || "admin-root"}</code>
              </p>
            </div>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex items-center gap-2 border-b border-slate-200/80 overflow-x-auto pb-1">
          <TabButton
            id="profile"
            label="Profile & Security"
            icon={<User className="w-4 h-4" />}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <TabButton
            id="store"
            label="Store Profile"
            icon={<Building2 className="w-4 h-4" />}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <TabButton
            id="notifications"
            label="Notifications"
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
                      <User className="w-5 h-5 text-indigo-600" /> Personal Information
                    </h3>
                    <p className="text-xs text-slate-500">Update your account name and primary email address.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={labelStyles}>Full Name</label>
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
                      <label className={labelStyles}>Email Address</label>
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
                        <KeyRound className="w-5 h-5 text-indigo-600" /> Password & Security
                      </h3>
                      <p className="text-xs text-slate-500">
                        Leave password fields empty if you do not wish to change your current password.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className={labelStyles}>Current Password</label>
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
                          className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                        >
                          {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className={labelStyles}>New Password</label>
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
                            className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className={labelStyles}>Confirm New Password</label>
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
                      className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 px-6 py-2.5 rounded-2xl font-semibold text-sm"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </Button>
                  </div>
                </form>
              </SurfaceCard>
            </div>

            {/* SIDE ROLES & ACCESS SUMMARY */}
            <div className="md:col-span-4 space-y-6">
              <SurfaceCard className="p-6 space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                  <Shield className="w-5 h-5 text-indigo-600" />
                  <h4 className="font-bold text-slate-900 text-sm">Role & Permissions</h4>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-600 font-medium">Role Level</span>
                    <span className="font-bold text-indigo-600 uppercase">{user?.role || "ADMIN"}</span>
                  </div>

                  <div className="space-y-2 pt-2">
                    <PermissionItem text="Manage Products & Barcodes" />
                    <PermissionItem text="Inventory Stock In / Stock Out" />
                    <PermissionItem text="Sales & POS Billing Access" />
                    <PermissionItem text="Price Revision & Audit Logs" />
                    <PermissionItem text="CRM & Customer Management" />
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
                  <Store className="w-5 h-5 text-indigo-600" /> Store & Warehouse Configuration
                </h3>
                <p className="text-xs text-slate-500">Configure business information displayed on invoices and reports.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={labelStyles}>Store / Brand Name</label>
                  <input
                    name="storeName"
                    type="text"
                    className={inputStyles}
                    value={storeData.storeName}
                    onChange={handleStoreChange}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={labelStyles}>Warehouse Location</label>
                  <input
                    name="warehouseLocation"
                    type="text"
                    className={inputStyles}
                    value={storeData.warehouseLocation}
                    onChange={handleStoreChange}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={labelStyles}>Default Currency</label>
                  <select
                    name="currency"
                    className={inputStyles}
                    value={storeData.currency}
                    onChange={handleStoreChange}
                  >
                    <option value="PKR (Rs.)">PKR - Pakistani Rupee (Rs.)</option>
                    <option value="USD ($)">USD - US Dollar ($)</option>
                    <option value="EUR (€)">EUR - Euro (€)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className={labelStyles}>Support Phone</label>
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
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-2xl font-semibold text-sm"
                >
                  <Save className="w-4 h-4" /> Save Store Settings
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
                <Bell className="w-5 h-5 text-indigo-600" /> Notification Preferences
              </h3>
              <p className="text-xs text-slate-500">Customize email and system alerts for inventory activities.</p>
            </div>

            <div className="space-y-4">
              <NotificationToggle
                title="Low Stock Alerts"
                desc="Receive notifications when articles drop below minimum stock alert thresholds."
                checked={notifications.lowStockAlerts}
                onChange={() => toggleNotification("lowStockAlerts")}
              />

              <NotificationToggle
                title="Daily Sales Summary Report"
                desc="Receive a daily email snapshot of total sales, items sold, and revenue."
                checked={notifications.emailDailyReport}
                onChange={() => toggleNotification("emailDailyReport")}
              />

              <NotificationToggle
                title="Real-Time Sales Activity"
                desc="Get notified immediately when new invoices or orders are generated."
                checked={notifications.salesNotifications}
                onChange={() => toggleNotification("salesNotifications")}
              />

              <NotificationToggle
                title="Security & Price Audit Alerts"
                desc="Receive security alerts when prices are revised or admin settings change."
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
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold text-xs sm:text-sm transition-all duration-200 shrink-0 ${
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
      className={`w-11 h-6 rounded-full transition-colors duration-200 relative shrink-0 ${
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
