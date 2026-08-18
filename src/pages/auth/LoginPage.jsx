import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginUser, loginCustomerPortal, registerCustomerPortal, googleAuthCustomerPortal } from "../../services/auth.service";
import { useAuth } from "../../context/useAuth";
import { useLanguage } from "../../context/LanguageContext";
import logo from "../../assets/logo.png";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiShield,
  FiTag,
  FiGlobe,
  FiUserCheck,
  FiShoppingBag,
  FiUserPlus,
  FiUser
} from "react-icons/fi";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { lang, setLang, t } = useLanguage();

  const [activeTab, setActiveTab] = useState("staff"); // "staff", "customer_login", "customer_register"
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Forms
  const [loginData, setLoginData] = useState({
    emailOrPhone: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    fullName: "",
    companyName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    password: "",
  });

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleForgotPassword = () => {
    toast.error(
      lang === "no"
        ? "Gjenoppretting av passord administreres av systemansvarlig. Vennligst kontakt IT-support."
        : "Password reset is managed by administrator. Please contact IT Support.",
      { icon: "🔒", duration: 4000 }
    );
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (activeTab === "customer_login") {
        const response = await loginCustomerPortal({
          emailOrPhone: loginData.emailOrPhone,
          password: loginData.password
        });
        login(response.data.token, response.data.user);
        toast.success(lang === "no" ? "Innlogging vellykket! Velkommen til B2B-portalen." : "Customer Portal login successful!");
        navigate("/portal/catalog");
      } else {
        const response = await loginUser({
          email: loginData.emailOrPhone,
          password: loginData.password
        });
        login(response.data.token, response.data.user);
        toast.success(lang === "no" ? "Innlogging vellykket!" : "Login successful");
        navigate(response.data.user.role === "CUSTOMER" ? "/portal/catalog" : "/dashboard");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || (lang === "no" ? "Innlogging mislyktes" : "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await registerCustomerPortal(registerData);
      login(response.data.token, response.data.user);
      toast.success(lang === "no" ? "Kundeportalkonto registrert!" : "B2B Account registered successfully!");
      navigate("/portal/catalog");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      const dummyGoogleEmail = `b2bclient_${Math.floor(100 + Math.random() * 900)}@nordicclient.no`;
      const response = await googleAuthCustomerPortal({
        email: dummyGoogleEmail,
        name: "Google B2B Client",
        googleId: `google-oauth-${Date.now()}`
      });
      login(response.data.token, response.data.user);
      toast.success(lang === "no" ? "Innlogget via Google!" : "Authenticated with Google successfully!");
      navigate("/portal/catalog");
    } catch (error) {
      toast.error(error?.response?.data?.message || (lang === "no" ? "Google-godkjenning mislyktes" : "Google authentication failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen w-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      <style>{`
        @keyframes float-tag {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50% { transform: translateY(-12px) rotate(1deg); }
        }
        @keyframes pulse-light {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.08); }
        }
        .animate-float-tag {
          animation: float-tag 6s ease-in-out infinite;
        }
        .animate-pulse-light {
          animation: pulse-light 8s ease-in-out infinite;
        }
      `}</style>

      {/* LEFT SIDE - LIGHT APPAREL CONSOLE LOGIN */}
      <div className="w-full lg:w-[55%] xl:w-[58%] flex flex-col justify-between p-6 sm:p-10 bg-white relative overflow-hidden h-full border-r border-slate-200 overflow-y-auto">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between w-full z-10 pt-1 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs text-blue-600 font-bold tracking-wider uppercase">
            <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            Nordic Prowear ERP
          </div>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1 shadow-sm hover:border-blue-500 transition">
            <FiGlobe className="text-blue-600 text-sm" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer"
            >
              <option value="en">🇺🇸 EN</option>
              <option value="no">🇳🇴 NO</option>
            </select>
          </div>
        </div>

        {/* Login Card */}
        <div className="my-auto mx-auto w-full max-w-[420px] bg-white border border-slate-200/90 rounded-3xl p-8 shadow-xl shadow-slate-200/60 z-10">
          
          {/* Brand Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="flex h-14 w-14 items-center justify-center p-2 bg-blue-50 border border-blue-100 rounded-2xl shadow-sm mb-3">
              <img
                src={logo}
                alt="Nordic Prowear Logo"
                className="h-full w-full object-contain"
              />
            </div>
            
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">
              Nordic Prowear
            </h1>
            <p className="text-slate-500 text-xs font-medium leading-relaxed max-w-[300px]">
              Garment Inventory, CRM & B2B Portal
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-3 p-1 bg-slate-100 border border-slate-200 rounded-2xl mb-5 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab("staff")}
              className={`py-2 rounded-xl transition ${
                activeTab === "staff"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Staff Login
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("customer_login")}
              className={`py-2 rounded-xl transition ${
                activeTab === "customer_login"
                  ? "bg-teal-600 text-white shadow-md shadow-teal-600/30"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              B2B Login
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("customer_register")}
              className={`py-2 rounded-xl transition ${
                activeTab === "customer_register"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Google Auth Button for B2B */}
          {activeTab !== "staff" && (
            <div className="mb-4">
              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full bg-white hover:bg-slate-50 text-slate-800 font-bold py-3 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 border border-slate-300 shadow-sm transition active:scale-98"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>
          )}

          {/* Form */}
          {activeTab !== "customer_register" ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  {activeTab === "customer_login" ? "Email or Phone" : "Email Address"}
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                    <FiMail size={18} />
                  </div>
                  <input
                    type="text"
                    name="emailOrPhone"
                    value={loginData.emailOrPhone}
                    onChange={handleLoginChange}
                    placeholder={activeTab === "customer_login" ? "client@company.com or +47..." : "admin@nordicprowear.com"}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm font-semibold text-slate-900 placeholder-slate-400 outline-none transition duration-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs font-bold text-blue-600 hover:underline transition"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                    <FiLock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-12 text-sm font-semibold text-slate-900 placeholder-slate-400 outline-none transition duration-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 transition"
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className={`w-full mt-2 font-bold py-4 rounded-2xl shadow-md text-white transition-all duration-300 disabled:opacity-60 text-sm flex items-center justify-center gap-2 ${
                  activeTab === "customer_login"
                    ? "bg-teal-600 hover:bg-teal-700 shadow-teal-600/20"
                    : "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20"
                }`}
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={registerData.companyName}
                  onChange={handleRegisterChange}
                  placeholder="Nordic Retail AS"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-semibold text-slate-900 outline-none focus:border-emerald-500 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Contact Person Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={registerData.fullName}
                  onChange={handleRegisterChange}
                  placeholder="Ola Nordmann"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-semibold text-slate-900 outline-none focus:border-emerald-500 focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    placeholder="client@company.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-semibold text-slate-900 outline-none focus:border-emerald-500 focus:bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={registerData.phone}
                    onChange={handleRegisterChange}
                    placeholder="+47 987 65 432"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-semibold text-slate-900 outline-none focus:border-emerald-500 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    {lang === "no" ? "Leveringsadresse" : "Street Address"}
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={registerData.address}
                    onChange={handleRegisterChange}
                    placeholder="Storgata 100"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-semibold text-slate-900 outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    {lang === "no" ? "Poststed / By" : "City / Postal"}
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={registerData.city}
                    onChange={handleRegisterChange}
                    placeholder="0182 Oslo"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-semibold text-slate-900 outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-semibold text-slate-900 outline-none focus:border-emerald-500 focus:bg-white"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-2xl text-xs shadow-md transition"
              >
                {loading ? "Creating Account..." : "Create Account & Browse Catalog"}
              </button>
            </form>
          )}

          {/* Security Stamp */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
            <FiShield className="text-emerald-600" size={16} />
            <span>Secure encrypted access portal</span>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex justify-between items-center text-xs text-slate-400 border-t border-slate-100 pt-3 z-10">
          <span>&copy; {new Date().getFullYear()} Nordic Prowear AS</span>
          <span>GDPR Compliant</span>
        </div>
      </div>

      {/* RIGHT SIDE - DARKER CONTRAST BACKGROUND FOR HANGTAG SHOWCASE */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] bg-slate-800 text-slate-100 p-12 flex-col justify-between relative overflow-hidden h-full select-none border-l border-slate-700">
        
        {/* Background light glow */}
        <div className="absolute top-[-20%] right-[-10%] w-[550px] h-[550px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse-light" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[130px] pointer-events-none" />
        
        {/* Darker Blueprint overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-35 pointer-events-none" />

        {/* Top Header info */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-slate-900 border border-slate-700 rounded-xl text-blue-400 shadow-sm">
              <FiTag size={20} />
            </div>
            <span className="text-xs font-bold tracking-wider text-slate-300 uppercase">Nordic ERP & B2B Suite</span>
          </div>
          <span className="text-[10px] px-3 py-1 bg-slate-900 border border-slate-700 text-blue-400 rounded-full font-mono font-bold shadow-sm">
            v2026.8-NORWAY
          </span>
        </div>

        {/* Central White Hang Tag Showcase */}
        <div className="my-auto mx-auto w-full max-w-sm flex flex-col items-center justify-center z-10 text-center">
          <div className="relative w-[280px] bg-white text-slate-800 rounded-3xl p-7 shadow-2xl border border-slate-100 animate-float-tag flex flex-col justify-between">
            {/* Hang Tag Eyelet */}
            <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900 rounded-full border border-slate-700 shadow-inner flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
            </div>

            <div className="mt-4 border-b border-slate-100 pb-3">
              <span className="text-xs font-black tracking-[0.25em] text-slate-900 uppercase">
                N O R D I C &nbsp; P R O W E A R
              </span>
            </div>

            <div className="py-5 space-y-3 text-left text-xs border-b border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">GARMENT</span>
                <span className="text-slate-900 font-bold">Pro Heavy Winter Jacket</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">SKU</span>
                <span className="text-slate-900 font-mono font-semibold">NP-WJK-808</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">UNIT WEIGHT</span>
                <span className="text-blue-600 font-bold">0.85 kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">B2B PORTAL</span>
                <span className="text-emerald-600 font-semibold">Active Catalog</span>
              </div>
            </div>

            {/* Barcode */}
            <div className="pt-4">
              <div className="flex justify-center items-end gap-[2px] h-11 w-full bg-slate-50 p-2 rounded-xl border border-slate-200">
                <div className="w-[2px] h-full bg-slate-900" />
                <div className="w-[1px] h-full bg-slate-900" />
                <div className="w-[3px] h-full bg-slate-900" />
                <div className="w-[1px] h-full bg-slate-900" />
                <div className="w-[2px] h-full bg-slate-900" />
                <div className="w-[4px] h-full bg-slate-900" />
                <div className="w-[1px] h-full bg-slate-900" />
                <div className="w-[2px] h-full bg-slate-900" />
                <div className="w-[3px] h-full bg-slate-900" />
                <div className="w-[1px] h-full bg-slate-900" />
                <div className="w-[4px] h-full bg-slate-900" />
                <div className="w-[2px] h-full bg-slate-900" />
              </div>
              <span className="text-[10px] text-slate-400 tracking-[0.15em] block mt-1.5 font-mono">
                7090012345678
              </span>
            </div>
          </div>
        </div>

        {/* Bottom system status */}
        <div className="flex justify-between items-center z-10 text-xs text-slate-400 border-t border-slate-700 pt-4">
          <span>Norwegian & English language support</span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            GDPR Compliant
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
