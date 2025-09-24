import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import EnhancedInput from "@components/ui/EnhancedInput";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import useAuthStore from "@store/authStore";
import { useState } from "react";
import { toast } from "react-toastify";

const UpdatePasswordTab = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  // Fetch The current User Details

  // Password Data
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!passwordData.currentPassword) {
      setLoading(false);
      return toast.error("Provide your Current Password !");
    }
    if (!passwordData.password) {
      setLoading(false);
      return toast.error("Provide your Password !");
    }

    // Validate passwords
    if (passwordData.password !== passwordData.confirmPassword) {
      setLoading(false);
      return toast.error("Passwords don't match !");
    }

    try {
      const sanitizedFormData = {
        currentPassword: passwordData.currentPassword,
        password: passwordData.password,
      };

      const response = await apiClient.put(
        `${endpoints.UpdateUser}/${user?.slug}`,
        sanitizedFormData
      );

      if (response.status === 200) {
        toast.success("Password Changed successfully!");
      }
    } catch (error) {
      toast.error(ErrorFormatter(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <form onSubmit={handleSubmit}>
        <div className="space-y-6 max-w-lg mx-auto shadow-lg p-6 bg-bg-green dark:bg-gray-700 rounded-md">
          <div>
            <EnhancedInput
              type="password"
              name="currentPassword"
              label="Current Password"
              value={passwordData.currentPassword}
              onChange={handleChange}
              placeholder="Enter current password"
              required
            />
          </div>
          <div>
            <EnhancedInput
              type="password"
              name="password"
              label="New Password"
              value={passwordData.password}
              onChange={handleChange}
              placeholder="Enter new Password"
              required
            />
          </div>
          <div>
            <EnhancedInput
              type="password"
              name="confirmPassword"
              label="Confirm Password"
              value={passwordData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
            />
          </div>

          <div className="pt-4">
            <button
              className={`bg-[#28B16D] hover:bg-[#09C269] text-white font-medium py-3 px-8 rounded-xl shadow-sm transition ${
                loading ? "disabled" : ""
              }`}
            >
              {loading ? "Please Wait.." : "Update Password"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default UpdatePasswordTab;
