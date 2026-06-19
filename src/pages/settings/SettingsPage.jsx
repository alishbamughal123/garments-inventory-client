import { useState } from "react";
import toast from "react-hot-toast";
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
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
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
      toast.success("Profile updated successfully");
      setFormData(prev => ({
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

  return (
    <MainLayout>
      <PageHeader title="Settings" />

      <div className="max-w-2xl mt-6">
        <SurfaceCard title="Profile Information" subtitle="Update your personal details and email address.">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className={labelStyles}>Full Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  className={inputStyles}
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-1">
                <label className={labelStyles}>Email Address</label>
                <input
                  name="email"
                  type="email"
                  required
                  className={inputStyles}
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <hr className="border-slate-100" />

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-900">Change Password</h4>
              <p className="text-xs text-slate-500">Leave these fields blank if you don't want to change your password.</p>
              
              <div className="space-y-1">
                <label className={labelStyles}>Current Password</label>
                <input
                  name="currentPassword"
                  type="password"
                  className={inputStyles}
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className={labelStyles}>New Password</label>
                  <input
                    name="newPassword"
                    type="password"
                    className={inputStyles}
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-1">
                  <label className={labelStyles}>Confirm New Password</label>
                  <input
                    name="confirmPassword"
                    type="password"
                    className={inputStyles}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" isLoading={loading}>
                Save Changes
              </Button>
            </div>
          </form>
        </SurfaceCard>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
