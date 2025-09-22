import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { toast } from "react-toastify";

import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";

import EnhancedInput from "@components/ui/EnhancedInput";
import EnhancedTextarea from "@components/ui/EnhancedTextArea";
import EnhancedSelect from "@components/ui/EnhancedSelect";

import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";

import { companyCategory, NigerianStates } from "@utils/data";
import HandleGoBackBtn from "@components/goBackBtn/HandleGoBackBtn";
import CompleteProfileCall from "@components/profileComplete/CompleteProfileCall";

const CreateCompany = () => {
  const [cityOptions, setCityOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Company Data State
  const [companyData, setCompanyData] = useState({
    companyName: "",
    email: "",
    state: "",
    city: "",
    address: "",
    description: "",
    phones: [""],
    category: "",
    companyWebsite: "",
    whatsapp: ""
  });

  // Static options

  // Options data
  const stateOptions = NigerianStates.map((state) => ({
    label: state.state,
    value: state.state,
  }));

  // Handlers
  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setCompanyData((prev) => ({
      ...prev,
      state: selectedState,
      city: "",
    }));

    const selectedStateData = NigerianStates.find(
      (s) => s.state === selectedState
    );
    setCityOptions(
      selectedStateData?.lgas.map((lga) => ({
        label: lga,
        value: lga,
      })) || []
    );
  };

  // Initialize city options when component mounts or state changes
  useEffect(() => {
    if (companyData.state) {
      const selectedStateData = NigerianStates.find(
        (s) => s.state === companyData.state
      );
      setCityOptions(
        selectedStateData?.lgas.map((lga) => ({
          label: lga,
          value: lga,
        })) || []
      );
    }
  }, [companyData.state]);

  // Helpers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (index, value) => {
    const phones = [...companyData.phones];
    phones[index] = value;
    setCompanyData((prev) => ({ ...prev, phones }));
  };

  const addPhoneField = () => {
    setCompanyData((prev) => ({ ...prev, phones: [...prev.phones, ""] }));
  };

  const removePhoneField = (index) => {
    const phones = [...companyData.phones];
    phones.splice(index, 1);
    setCompanyData((prev) => ({ ...prev, phones }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const sanitizedData = {
        companyName: companyData.companyName,
        email: companyData.email,
        state: companyData.state,
        city: companyData.city,
        address: companyData.address,
        description: DOMPurify.sanitize(companyData.description, {
          ALLOWED_TAGS: [],
          ALLOWED_ATTR: [],
          KEEP_CONTENT: true,
        }),
        phones: companyData.phones.filter((p) => p),
        category: companyData.category,
        companyWebsite: companyData.companyWebsite,
        whatsapp: companyData.whatsapp,
      };

      const response = await apiClient.post(
        endpoints.createCompany,
        sanitizedData
      );
      if (response.status === 201) {
        toast.success("Company created successfully!");
      }

      setCompanyData({
        companyName: "",
        email: "",
        state: "",
        city: "",
        address: "",
        description: "",
        phones: [""],
        category: "",
        companyWebsite: "",
        whatsapp: ""
      });
    } catch (error) {
      toast.error(ErrorFormatter(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-container mx-auto bg-white dark:bg-gray-800 p-6 rounded-sm">
      <HandleGoBackBtn/>
        <CompleteProfileCall />
      <form onSubmit={handleSubmit} className="space-y-6 mt-2">
        {/* Logo & Cover */}

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EnhancedInput
            name="companyName"
            label="Company Name"
            value={companyData.companyName}
            onChange={handleChange}
            placeholder="Enter company name"
          />
          <EnhancedInput
            type="email"
            name="email"
            label="Company Email"
            value={companyData.email}
            onChange={handleChange}
            placeholder="email@example.com"
          />
          <EnhancedInput
            name="companyWebsite"
            type="url"
            label="Website"
            value={companyData.companyWebsite}
            onChange={handleChange}
            placeholder="https://"
          />
          <EnhancedSelect
            name="category"
            label="Category"
            options={companyCategory}
            value={companyData.category}
            onChange={handleChange}
          />
        </div>

        {/* Address */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <EnhancedSelect
            name="state"
            label="State"
            options={stateOptions}
            value={companyData.state}
            onChange={handleStateChange}
          />
          <EnhancedSelect
            name="city"
            label="City"
            value={companyData.city}
            onChange={handleChange}
            options={cityOptions}
            placeholder={
              companyData.state ? "Select city" : "Select state first"
            }
            disabled={!companyData.state}
          />
          <EnhancedInput
            name="address"
            label="Full Address"
            value={companyData.address}
            onChange={handleChange}
          />
        </div>

        {/* Phones */}
        <div className="space-y-2">
          <p className="font-medium dark:text-gray-200 ">Phones</p>
          {companyData.phones.map((phone, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <EnhancedInput
                name={`phone-${idx}`}
                value={phone}
                onChange={(e) => handlePhoneChange(idx, e.target.value)}
                placeholder="Phone number"
              />
              {companyData.phones.length > 1 && (
                <button
                  type="button"
                  className="text-red-500 font-bold"
                  onClick={() => removePhoneField(idx)}
                >
                  X
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addPhoneField}
            className="text-sm text-green-600 hover:underline mt-1"
          >
            + Add another phone
          </button>
        </div>

           <EnhancedInput
            name="whatsapp"
            type="text"
            label="WhatsApp"
            value={companyData.whatsapp}
            onChange={handleChange}
           
          />

        {/* Description */}
        <EnhancedTextarea
          name="description"
          label="About the Company"
          value={companyData.description}
          onChange={handleChange}
          rows={6}
          withToolbar
        />

        {/* Submit */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#28B16D] hover:bg-[#09C269] text-white font-medium py-3 px-8 rounded shadow-sm transition"
          >
            {loading ? "Please Wait..." : "Save Company Info"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreateCompany;
