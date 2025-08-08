
import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import HandleGoBackBtn from "@components/goBackBtn/HandleGoBackBtn";
import EnhancedInput from "@components/ui/EnhancedInput";
import EnhancedSelect from "@components/ui/EnhancedSelect";
import HeaderTitle from "@components/ui/HeaderTitle";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import useAuthStore from "@store/authStore";
import { NigerianStates, professions} from "@utils/data";
import { handleGoBack } from "@utils/helper";
import { useState, useRef } from "react";
import { FiLoader, FiUpload, FiFile } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import readXlsxFile from "read-excel-file";

const AddUsers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef(null);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [contactData, setContactData] = useState({
    firstName: "",
    lastName: "",
    password: "",
    email: "",
    profession: "",
    state: ""
  });

  const locations = NigerianStates.map((state) => ({
    label: state.state,
    value: state.state,
  }));

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
      firstName: contactData.firstName,
      lastName: contactData.lastName,
      email: contactData.email,
      password: contactData.password,
      profession: contactData.profession,
      state: contactData.state
    };

    try {

     await apiClient.post(endpoints.CreateUser, formData); 

        toast.success(` User added successfully`);
        setContactData({
          firstName: "",
          lastName: "",
          password: "",
          email: "",
          profession: "",
          state: ""
        });
   
    } catch (error) {
      toast.error(ErrorFormatter(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsImporting(true);

    try {
      const rows = await readXlsxFile(file);
      const headers = rows[0];
      const data = rows.slice(1).map(row => {
        return headers.reduce((obj, header, index) => {
          obj[header] = row[index];
          return obj;
        }, {});
      });

      let successCount = 0;
      let errorCount = 0;

      for (const row of data) {
        try {
          const userData = {
            email: row.Email || row.email || "",
            password: row.Password || row.password || "defaultPassword123", 
            profession: row.Profession || row.profession || "",
            state: row.State || row.state || "",
            city: row.City || row.city || "",
            role: row.Role || row.role || "",
            userStatus: row.userStatus || row.userStatus || "",
            slug: row.Slug || row.slug || "",
          };

          await apiClient.post(endpoints.CreateUser, userData);
          successCount++;
        } catch (error) {
          console.error("Error importing user:", error);
          errorCount++;
        }
      }

      toast.success(
        `Import completed: ${successCount} users added, ${errorCount} failed`
      );
    } catch (error) {
      toast.error("Error processing Excel file: " + ErrorFormatter(error));
    } finally {
      setIsImporting(false);
      e.target.value = ""; // Reset file input
    }
  };

  return (
   <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col pb-8">
  <div className="lg:px-8 flex-grow">
    <div className="w-full mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <HandleGoBackBtn />
        <HeaderTitle titleText="Add User"/>
        <div className="w-8"></div>
      </div>

      {/* Main Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md relative p-4 py-8 lg:px-8">
        <div className="flex justify-end mb-6">
          <button
            type="button"
            onClick={handleImportClick}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 flex items-center"
            disabled={isImporting}
          >
            {isImporting ? (
              <FiLoader className="animate-spin mr-2" />
            ) : (
              <FiFile className="mr-2" />
            )}
            {isImporting ? "Importing..." : "Import from Excel"}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".xlsx, .xls, .csv"
            className="hidden"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <EnhancedInput
              name="firstName"
              type="text"
              label="First Name"
              value={contactData.firstName}
              onChange={handleChange}
              className="focus:ring-2 focus:ring-main-green"
            />
            <EnhancedInput
              name="lastName"
              type="text"
              label="Last Name"
              value={contactData.lastName}
              onChange={handleChange}
              className="focus:ring-2 focus:ring-main-green"
            />
            <EnhancedInput
              name="password"
              type="password"
              label="Password"
              value={contactData.password}
              onChange={handleChange}
              forceValidate={false}
              className="focus:ring-2 focus:ring-main-green"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <EnhancedInput
              name="email"
              type="email"
              label="Email*"
              value={contactData.email}
              onChange={handleChange}
              className="focus:ring-2 focus:ring-main-green"
            />

            <EnhancedSelect
              name="profession"
              label="Profession*"
              value={contactData.profession}
              onChange={handleChange}
              options={professions}
              placeholder="Select Profession"
            />
            <EnhancedSelect
              name="state"
              label="Location*"
              value={contactData.state}
              onChange={handleChange}
              options={locations}
              placeholder="Select Location"
            />
          </div>

          <div className="flex flex-col-reverse gap-4 md:flex-row justify-end">
            <button
              type="button"
              onClick={() => handleGoBack(navigate, user)}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
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
              {isLoading ? "Please Wait..." : "Save User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>

  );
};

export default AddUsers;
