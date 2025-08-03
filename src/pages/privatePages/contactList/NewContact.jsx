import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import CompleteProfileCall from "@components/profileComplete/CompleteProfileCall";
import EnhancedInput from "@components/ui/EnhancedInput";
import EnhancedSelect from "@components/ui/EnhancedSelect";
import EnhancedTextarea from "@components/ui/EnhancedTextArea";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import DOMPurify from "dompurify";
import useAuthStore from "@store/authStore";
import { preferedContactOptions, professions, TitleOptions } from "@utils/data";
import { handleGoBack } from "@utils/helper";
import { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FiLoader, FiUpload } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const NewContact = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [contactData, setContactData] = useState({
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    profession: "",
    phone: "",
    preferredContactMethod: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = {
      title: contactData.title,
      firstName: contactData.firstName,
      lastName: contactData.lastName,
      profession: contactData.profession,
      email: contactData.email,
      phone: contactData.phone,
      preferredContactMethod: contactData.preferredContactMethod,
       notes: DOMPurify.sanitize(contactData.notes.trim(), {
                ALLOWED_TAGS: [],
                ALLOWED_ATTR: [],
                KEEP_CONTENT: true,
              }),
    };

    try {
      const response = await apiClient.post(endpoints.createContact, formData);

      if (response.status === 201) {
        toast.success(`${formData.firstName} ${formData.lastName} is added to contacts list`);
      }

      setContactData({
        title: "",
        firstName: "",
        lastName: "",
        email: "",

        profession: "",
        phone: "",
        preferredContactMethod: "",

        notes: "",
      });
    } catch (error) {
      toast.error(ErrorFormatter(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Check If profile is complete */}
      <CompleteProfileCall />

      <div className="py-8 lg:px-8 flex-grow">
        <div className="w-full mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => handleGoBack(navigate, user)}
              className="flex items-center text-neutral-600 transition-colors text-xs md:text-sm "
            >
              <FaArrowLeftLong className="mr-2" />
              Back
            </button>
            <h1 className=" text-md md:text-2xl font-bold text-gray-800">
              Add New Contact
            </h1>
            <div className="w-8"></div> {/* Spacer for alignment */}
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-xl shadow-md relative min-h-[calc(100vh-200px)] p-4 py-8 lg:px-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Title + First Name (in 1 column on md+) */}
                <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-5 gap-4 w-full">
                  {/* Title */}
                  <div className="col-span-2">
                    <EnhancedSelect
                      name="title"
                      label="Title"
                      value={contactData.title}
                      onChange={handleChange}
                      options={TitleOptions}
                      placeholder="Select Title"
                    />
                  </div>
                  {/* First Name */}
                  <div className="col-span-3">
                    <EnhancedInput
                      name="firstName"
                      label="First Name"
                      value={contactData.firstName}
                      onChange={handleChange}
                      className="focus:ring-2 focus:ring-main-green"
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div className="col-span-1">
                  <EnhancedInput
                    name="lastName"
                    label="Last Name"
                    value={contactData.lastName}
                    onChange={handleChange}
                    className="focus:ring-2 focus:ring-main-green"
                  />
                </div>

                {/* Profession */}
                <div className="col-span-1">
                  <EnhancedSelect
                    name="profession"
                    label="Profession"
                    value={contactData.profession}
                    onChange={handleChange}
                    options={professions}
                    placeholder="Select Profession"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <EnhancedInput
                  name="email"
                  type="email"
                  label="Email"
                  value={contactData.email}
                  onChange={handleChange}
                  className="focus:ring-2 focus:ring-main-green"
                />

                <EnhancedInput
                  name="phone"
                  type="text"
                  label="Phone"
                  value={contactData.phone}
                  onChange={handleChange}
                  className="focus:ring-2 focus:ring-main-green"
                />
                <EnhancedSelect
                  name="preferredContactMethod"
                  label="Prefered Contact Method"
                  value={contactData.preferredContactMethod}
                  onChange={handleChange}
                  options={preferedContactOptions}
                  placeholder="Select One"
                />
              </div>

              <EnhancedTextarea
                name="notes"
                label="Notes"
                value={contactData.notes}
                onChange={handleChange}
                rows={6}
                className="focus:ring-2 focus:ring-main-green w-full p-5 focus:border-none focus:outline-none"
              />
              {user?.firstName && user?.lastName && (
                <div className="flex flex-col-reverse gap-4 md:flex-row justify-end">
                  <button
                    type="button"
                    onClick={() => handleGoBack(navigate, user)}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 flex items-center justify-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <FiLoader className="animate-spin mr-2" />
                    ) : (
                      <FiUpload className="mr-2" />
                    )}
                    {isLoading ? "Please Wait..." : "Save Contact"}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewContact;
