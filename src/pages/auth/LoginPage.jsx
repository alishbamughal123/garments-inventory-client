import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginUser } from "../../services/auth.service";
import { useAuth } from "../../context/useAuth";
import logo from "../../assets/logo.png";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiShield,
  FiTag,
} from "react-icons/fi";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleForgotPassword = () => {
    toast.error("Password reset is managed by the administrator. Please contact IT Support.", {
      icon: "🔒",
      duration: 4000
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await loginUser(formData);
      login(response.data.token, response.data.user);
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen w-screen bg-slate-50 overflow-hidden font-sans">
      <style>{`
        @keyframes float-tag {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50% { transform: translateY(-12px) rotate(1deg); }
        }
        @keyframes pulse-light {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.08); }
        }
        .animate-float-tag {
          animation: float-tag 6s ease-in-out infinite;
        }
        .animate-pulse-light {
          animation: pulse-light 8s ease-in-out infinite;
        }
        
        /* Height responsive compression */
        @media (max-height: 640px) {
          .login-footer, .tag-subtext {
            display: none !important;
          }
          .login-logo-container {
            margin-bottom: 0.5rem !important;
          }
        }
      `}</style>

      {/* LEFT SIDE - APPAREL CONSOLE LOGIN (WIDER PANEL) */}
      <div className="w-full lg:w-[55%] xl:w-[60%] flex flex-col justify-between p-6 sm:p-8 bg-slate-50 relative overflow-hidden h-full border-r border-slate-100">
        {/* Soft decorative background glow (mobile only background depth) */}
        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none lg:hidden" />

        {/* Top Header */}
        <div className="flex items-center justify-center w-full z-10">
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
            Stock & CRM Engine
          </div>
        </div>

        {/* Beautiful Centered Login Card (WIDER CARD FOR LONGER INPUTS) */}
        <div className="my-auto mx-auto w-full max-w-[430px] bg-white border border-slate-200/40 rounded-3xl p-5 sm:p-7 shadow-[0_15px_40px_rgba(15,23,42,0.03)] z-10">
          {/* Brand Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="flex h-12 w-12 items-center justify-center p-1.5 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm mb-3.5 transition hover:scale-105 duration-300 login-logo-container">
              <img
                src={logo}
                alt="Nordic Prowear Logo"
                className="h-full w-full object-contain"
              />
            </div>
            
            <h1 className="text-xl font-bold text-slate-800 tracking-tight mb-1">
              Welcome back
            </h1>
            <p className="text-slate-400 text-xs leading-relaxed max-w-[320px] text-center">
              Sign in to manage clothing lines, CRM lead workflows, sales, and warehouse transactions.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <FiMail size={16} />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@nordicprowear.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition duration-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[10px] font-semibold text-blue-600 hover:text-blue-700 transition"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <FiLock size={16} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-10 text-sm text-slate-800 placeholder-slate-400 outline-none transition duration-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="remember"
                  className="h-4 w-4 rounded border-slate-200 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                />
                <span className="text-xs text-slate-500 font-medium">Keep me signed in</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2.5 rounded-xl shadow-md shadow-blue-500/10 active:scale-[0.99] hover:scale-[1.01] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-1.5">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Security stamp */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
            <FiShield className="text-emerald-500" size={12} />
            <span>Encrypted employee access portal</span>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-100 pt-4 mt-4 login-footer z-10">
          <span>&copy; {new Date().getFullYear()} Nordic Prowear.</span>
          <span className="flex gap-2.5">
            <span className="hover:text-slate-600 cursor-pointer transition">Support</span>
            <span className="hover:text-slate-600 cursor-pointer transition">Privacy</span>
          </span>
        </div>
      </div>

      {/* RIGHT SIDE - APPAREL SHOWCASE (NARROWER PANEL) */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[40%] bg-slate-900 text-white p-8 flex-col justify-between relative overflow-hidden h-full select-none">
        
        {/* Soft background light blooms */}
        <div className="absolute top-[-20%] right-[-10%] w-[550px] h-[550px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse-light" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[130px] pointer-events-none" />
        
        {/* Thin blueprint layout overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-40 pointer-events-none" />

        {/* Top central badge */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-slate-950 border border-slate-800 rounded-lg text-blue-400">
              <FiTag size={16} />
            </div>
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Stock & Barcoding Hub</span>
          </div>
          <span className="text-[10px] px-2.5 py-0.5 bg-slate-950 border border-slate-800 text-slate-500 rounded-full">
            Stockholm_Terminal_A
          </span>
        </div>

        {/* Central visual graphic - Elegant Minimalist Hang Tag Card (COMPACTED DESIGN) */}
        <div className="my-auto mx-auto w-full max-w-sm flex flex-col items-center justify-center z-10 text-center animate-float-slow">
          
          {/* Hanging String visual */}
          <div className="w-[1px] h-10 bg-slate-700 relative">
            <div className="absolute top-0 -left-1 w-2 h-2 rounded-full bg-slate-600" />
          </div>

          {/* Product Hang Tag Card (MORE COMPACT) */}
          <div className="relative w-[240px] bg-white text-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl border border-slate-100 animate-float-tag flex flex-col justify-between">
            {/* Hang Tag Eyelet */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900 rounded-full border border-slate-700 shadow-inner flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
            </div>

            {/* Tag Header Brand */}
            <div className="mt-4 border-b border-slate-100 pb-3">
              <span className="text-[10px] font-black tracking-[0.25em] text-slate-900 uppercase">
                N O R D I C &nbsp; P R O W E A R
              </span>
            </div>

            {/* Core DB Fields (Apparel inventory detail specs) */}
            <div className="py-4 space-y-2.5 text-left text-xs border-b border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">PRODUCT</span>
                <span className="text-slate-800 font-bold">Arctic Expedition Parka</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">SKU</span>
                <span className="text-slate-900 font-semibold tracking-wider">NP-PK-TH-028</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">FABRIC</span>
                <span className="text-slate-700">80% Nylon, 20% Wool</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">SIZE / COLOR</span>
                <span className="text-slate-800 font-semibold">XL / Fjord Blue</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">BATCH</span>
                <span className="text-slate-700">SE-STH-2026-A</span>
              </div>
            </div>

            {/* Barcode section (directly related to product scanner workflows) */}
            <div className="pt-3">
              {/* Realistic CSS Barcode */}
              <div className="flex justify-center items-end gap-[2px] h-10 w-full bg-slate-50 p-1.5 rounded-lg border border-slate-100 overflow-hidden">
                <div className="w-[2px] h-full bg-slate-800" />
                <div className="w-[1px] h-full bg-slate-800" />
                <div className="w-[3px] h-full bg-slate-800" />
                <div className="w-[1px] h-full bg-slate-800" />
                <div className="w-[2px] h-full bg-slate-800" />
                <div className="w-[4px] h-full bg-slate-800" />
                <div className="w-[1px] h-full bg-slate-800" />
                <div className="w-[2px] h-full bg-slate-800" />
                <div className="w-[3px] h-full bg-slate-800" />
                <div className="w-[1px] h-full bg-slate-800" />
                <div className="w-[4px] h-full bg-slate-800" />
                <div className="w-[2px] h-full bg-slate-800" />
                <div className="w-[1px] h-full bg-slate-800" />
                <div className="w-[3px] h-full bg-slate-800" />
                <div className="w-[1px] h-full bg-slate-800" />
                <div className="w-[2px] h-full bg-slate-800" />
                <div className="w-[4px] h-full bg-slate-800" />
              </div>
              <span className="text-[9px] text-slate-400 tracking-[0.15em] block mt-1 font-mono">
                NP-028-XL-FJORD
              </span>
            </div>

            {/* Verified indicator */}
            <div className="mt-3 flex items-center justify-center gap-1 text-[9px] text-emerald-600 font-bold uppercase tracking-wider bg-emerald-50 border border-emerald-100 py-1 rounded-lg">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
              Verified In Stock
            </div>
          </div>
        </div>

        {/* Bottom system status */}
        <div className="flex justify-between items-center z-10 text-[10px] text-slate-500 border-t border-slate-800 pt-4 tag-subtext">
          <span>System Central Operations Node</span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
            Active inventory synchronizer
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
