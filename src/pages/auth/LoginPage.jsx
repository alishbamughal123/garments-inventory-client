import { useState } from "react";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import { loginUser } from "../../services/auth.service";

import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";
import {
  formControlClass,
} from "../../components/ui/formStyles";

const LoginPage = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };


const handleSubmit =
  async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const response =
        await loginUser(formData);
      login(
        response.data.token,
        response.data.user
      );

      toast.success(
        "Login successful"
      );

      navigate("/dashboard");

    } catch (error) {

      toast.error(
        error?.response?.data
          ?.message ||
          "Login failed"
      );

    } finally {

      setLoading(false);
    }
  };


  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_28%),linear-gradient(180deg,_#eff6ff_0%,_#f8fafc_70%)] px-4">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-3xl border border-[var(--color-primary-border)] bg-white p-8 shadow-lg"
      >
        <h1 className="mb-2 text-center text-3xl font-bold">
          Nordic Prowear
        </h1>
        <p className="mb-6 text-center text-sm text-slate-500">
          Sign in to access articles, sales, CRM, and inventory workflows.
        </p>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={
            handleChange
          }
          className={`${formControlClass} mb-4`}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={
            handleChange
          }
          className={`${formControlClass} mb-4`}
        />

        <Button
          type="submit"
          className="w-full"
          size="lg"
        >
          {loading
            ? "Loading..."
            : "Login"}
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
