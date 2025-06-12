import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import DOMPurify from "dompurify";
import EnhancedInput from "@components/ui/EnhancedInput";
import EnhancedTextarea from "@components/ui/EnhancedTextArea";
import FileUpload from "@components/ui/FileUpload";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import useAuthStore from "@store/authStore";
import { useEffect, useRef, useState } from "react";
import { FiBriefcase, FiEdit2 } from "react-icons/fi";
import { toast } from "react-toastify";

const CompanyTab = () => {
  const { user } = useAuthStore();
  const logoRef = useRef();
  const [loading, setLoading] = useState(false);
  // Company Data
  const [companyData, setCompanyData] = useState({
    companyName: "",
    companyEmail: "",
    companyLogo: null,
    companyAddress: "",
    companyWebsite: "",
    companyDescription: "",
  });

  // Get The Current User Details

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await apiClient.get(
          `${endpoints.getUserDetails}/${user.slug}`
        );

        const { data } = response.data;

        // Only take the fields we want to manage
        setCompanyData({
          companyName: data.companyDetails?.companyName || "",
          companyEmail: data.companyDetails?.companyEmail || "",
          companyLogo: data.companyDetails?.companyLogo || null,
          companyAddress: data.companyDetails?.companyAddress || "",
          companyWebsite: data.companyDetails?.companyWebsite || "",
          companyDescription: data.companyDetails?.companyDescription || "",
        });
      } catch (error) {
        console.log(error);
        toast.error(ErrorFormatter(error));
      }
    };

    if (user.slug) fetchCurrentUser();
  }, [user.slug]);

  const handleFileUpload = (name, file) => {
    setCompanyData((prev) => ({
      ...prev,
      [name]: file,
    }));
  };

  const handleLogoClick = () => {
    logoRef.current?.open();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const sanitizedFormData = {
        companyName: companyData.companyName || "",
        companyEmail: companyData.companyEmail || "",
        companyAddress: companyData.companyAddress || "",
        companyWebsite: companyData.companyWebsite || "",
        companyDescription: DOMPurify.sanitize(
          companyData.companyDescription.trim(),
          {
            ALLOWED_TAGS: [],
            ALLOWED_ATTR: [],
            KEEP_CONTENT: true,
          }
        ),
        // Only include profilePic/coverPic if they're strings (URLs)
        ...(typeof companyData.companyLogo === "string" && {
          companyLogo: companyData.companyLogo,
        }),
      };
      const response = await apiClient.put(
        `${endpoints.UpdateUser}/${user?.slug}`,
        sanitizedFormData
      );

      if (response.status === 200) {
        toast.success("Company Info Saved successfully!");
      }
    } catch (error) {
      toast.error(ErrorFormatter(error));
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get image source
  const getImageSrc = (image) => {
    if (!image) return null;
    if (typeof image === "string") return image;
    if (image instanceof File) return URL.createObjectURL(image);
    return null;
  };

  return (
    <section>
      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden border border-gray-200">
                {companyData.companyLogo ? (
                  <img
                    src={getImageSrc(companyData.companyLogo)}
                    alt="Company Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiBriefcase className="text-3xl text-gray-400" />
                )}
              </div>
              <button
                type="button"
                onClick={handleLogoClick}
                className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-md border border-gray-200 hover:bg-gray-50"
              >
                <FiEdit2 className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div>
              <button
                type="button"
                onClick={handleLogoClick}
                className="text-sm font-medium text-[#28B16D] hover:text-[#09C269]"
              >
                Upload company logo
              </button>
              <p className="text-xs text-gray-500 mt-1">PNG or JPG. Max 2MB</p>
            </div>
            <FileUpload
              ref={logoRef}
              value={companyData.companyLogo}
              onChange={(file) => handleFileUpload("companyLogo", file)}
              multiple={false}
              maxFiles={1}
              accept="image/*"
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-green-500 transition-colors hidden"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EnhancedInput
              name="companyName"
              label="Company Name"
              value={companyData.companyName}
              onChange={handleChange}
              placeholder="Company Name"
            />
            <EnhancedInput
            type="email"
              name="companyEmail"
              label="Company Email"
              value={companyData.companyEmail}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EnhancedInput
              name="companyAddress"
              label="Company Addresss"
              value={companyData.companyAddress}
              onChange={handleChange}
            />
            <EnhancedInput
              type="url"
              name="companyWebsite"
              label="Company Website"
              value={companyData.companyWebsite}
              onChange={handleChange}
              placeholder="https://"
            />
          </div>

          <div>
            <EnhancedTextarea
              name="companyDescription"
              label="Tell us about your Company"
              value={companyData.companyDescription}
              onChange={handleChange}
              rows={6}
            />
          </div>

          <div className="pt-2">
            <button
              className={`bg-[#28B16D] hover:bg-[#09C269] text-white font-medium py-3 px-8 rounded shadow-sm transition ${
                loading ? "disabled" : ""
              }`}
            >
              {loading ? "Please Wait..." : "Save Company Info"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default CompanyTab;
