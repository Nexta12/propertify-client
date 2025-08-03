import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import Map from "@components/map/Map";
import DOMPurify from "dompurify";
import EnhancedCheckbox from "@components/ui/EnhancedCheckBox";
import EnhancedInput from "@components/ui/EnhancedInput";
import EnhancedSelect from "@components/ui/EnhancedSelect";
import EnhancedTextarea from "@components/ui/EnhancedTextarea";
import FileUpload from "@components/ui/FileUpload";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import CollapsableBox from "@pages/privatePages/dashboard/components/CollapsableBox";
import {
  Amenities,
  conditionOptions,
  currencyOptions,
  frequencyOptions,
  NigerianStates,
  propertyDocumentTypes,
  propertySizeOptions,
  PropertyTypes,
  purposeOptions,
} from "@utils/data";
import {  useMemo, useState } from "react";
import { MdLocationOn } from "react-icons/md";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { handleGoBack, useTenMinuteTimeout } from "@utils/helper";
import useAuthStore from "@store/authStore";
import DeleteModal from "@components/deleteModal/DeleteModal";
import HandleGoBackBtn from "@components/goBackBtn/HandleGoBackBtn";
import CompleteProfileCall from "@components/profileComplete/CompleteProfileCall";

const NewProperty = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isTrashing, setIsTrashing] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [draftId, setDraftId] = useState("");
  const [hasUploadedImages, setHasUploadedImages] = useState(false);
  const [cityOptions, setCityOptions] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    title: "",
    documentType: "",
    price: "",
    currency: "",
    frequency: "",
    condition: "",
    state: "",
    city: "",
    location: "",
    description: "",
    amenities: [],
    propertyType: "",
    beds: "",
    baths: "",
    purpose: "",
    propertySize: "",
    propertySizeUnit: "",
    media: [{}],
  });





  // Options data
  const stateOptions = NigerianStates.map((state) => ({
    label: state.state,
    value: state.state,
  }));

  const bedsOptions = Array.from({ length: 7 }, (_, i) => ({
    value: `${i + 1}`,
    label: `${i + 1}`,
  }));

  // Handlers
  const handleStateChange = (e) => {
    const selectedState = e.target.value;

    setFormData((prev) => ({
      ...prev,
      state: selectedState,
      city: "",
    }));

    const selectedStateData = NigerianStates.find(
      (s) => s.state === selectedState
    );
    const newCityOptions =
      selectedStateData?.lgas.map((lga) => ({
        label: lga,
        value: lga,
      })) || [];

    setCityOptions(newCityOptions);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = (name, files) => {
    setFormData((prev) => ({
      ...prev,
      [name]: files,
    }));
    if (files.length > 0) setHasUploadedImages(true);
  };

  const isResidential = useMemo(() => {
    if (!formData.propertyType) return false;
    const selectedProperty = PropertyTypes.find(
      (prop) => prop.value === formData.propertyType
    );
    return selectedProperty?.category === "residential";
  }, [formData.propertyType]);

  const isCommercial = useMemo(() => {
    if (!formData.propertyType) return false;

    const selectedProperty = PropertyTypes.find(
      (prop) => prop.value === formData.propertyType
    );
    return selectedProperty?.category === "commercial";
  }, [formData.propertyType]);

  // Reset Form Handler
  const resetForm = () => {
    setFormData({
      title: "",
      documentType: "",
      price: "",
      currency: "",
      frequency: "",
      condition: "",
      state: "",
      city: "",
      location: "",
      description: "",
      amenities: [],
      propertyType: "",
      beds: "",
      baths: "",
      purpose: "",
      propertySize: "",
      propertySizeUnit: "",
      media: [],
    
    });
    setCityOptions([]);
    setHasUploadedImages(false);
  };

  // Cleanup abandoned Images
  const cleanupAbandonedImages = async () => {
    if (!hasUploadedImages || !formData.media.length) return;
    try {
      await Promise.all(
        formData.media.map((imageUrl) =>
          apiClient.post(endpoints.updateCloudinary, {
            Model: "PropertyModel",
            url: imageUrl,
            fieldPath: "media",
          })
        )
      );
    } catch (error) {
      toast.error("Error Cleaning Images", error);
    }
  };

  // Handle Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const sanitizedFormData = {
        ...formData,
        description: DOMPurify.sanitize(formData.description.trim(), {
          ALLOWED_TAGS: [],
          ALLOWED_ATTR: [],
          KEEP_CONTENT: true,
        }),
      };

      const res = await apiClient.post(
        endpoints.createProperty,
        sanitizedFormData
      );

      if (res.status == 201) {
        toast.success("Listing Created successfully");
        resetForm();
        setTimeout(() => window.location.reload(), 3000);
      }
    } catch (error) {
      toast.error(ErrorFormatter(error));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Save as Draft.

  // Manual Save Draft handler
  const handleSaveDraft = async () => {
    setIsLoading(true);
    try {
      const sanitizedFormData = {
        ...formData,
        description: DOMPurify.sanitize(formData.description.trim(), {
          ALLOWED_TAGS: [],
          ALLOWED_ATTR: [],
          KEEP_CONTENT: true,
        }),
      };

      const res = draftId
        ? await apiClient.put(
            `${endpoints.updateDraft}/${draftId}`,
            sanitizedFormData
          )
        : await apiClient.post(endpoints.saveAsDraft, sanitizedFormData);

      if (res.status === 200 || res.status === 201) {
        if (res.data.data?._id) {
          setDraftId(res.data.data._id);
          setHasUploadedImages(false);
        }
        toast.success(`Draft ${draftId ? "updated" : "saved"}`);
      }

      if (openModal) {
        setOpenModal(false);
      }
    } catch (error) {
      toast.error(ErrorFormatter(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    if (hasUploadedImages && !draftId && formData.media.length > 0) {
      setOpenModal(true);
    } else {
      resetForm();
      handleGoBack(navigate, user);
    }
  };

  // Confirm Deletion
  const confirmDelete = async () => {
    setIsTrashing(true);
    await cleanupAbandonedImages();
    resetForm();
    handleGoBack(navigate, user);
  };

  // Delete Abandoned Images from cloud after 10 Minutes
  useTenMinuteTimeout(() => {
    if (hasUploadedImages && !draftId && formData.media.length > 0) {
      cleanupAbandonedImages();
      handleGoBack(navigate, user);
    }
  });

  return (
    <section className="rounded-md max-w-7xl mx-auto">
       {/* Check If profile is complete */}

       <CompleteProfileCall/>

      <DeleteModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={confirmDelete}
        confirmText="Discard Listing"
        message="You have unsaved upload, Do you really want to cancel ? "
        isDeleting={isTrashing}
        actTionText="Save As Draft"
        onAction={handleSaveDraft}
        isTakingAction={isLoading}
      />
 
        <HandleGoBackBtn/>
      <div className="bg-main-green px-6 py-5 text-center rounded-t-lg">
        <h2 className="text-2xl font-bold text-white">List a New Property</h2>
       
      </div>

      <form className="space-y-6 w-full mb-6" onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div className="bg-white space-y-6 p-6 border border-gray-200  ">
         
          <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <EnhancedInput
                name="title"
                label="Property Title*"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Beautiful 3-bedroom apartment in Lekki"
                maxLength={35}
                required
              />

              <EnhancedSelect
                name="documentType"
                label="Property Document"
                value={formData.documentType}
                onChange={handleChange}
                options={propertyDocumentTypes}
                placeholder="Select Document"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <EnhancedSelect
              name="propertyType"
              label="Property Type*"
              value={formData.propertyType}
              onChange={handleChange}
              options={PropertyTypes}
              placeholder="Select property type"
              required
              className="focus:ring-2 focus:ring-main-green"
            />

            <EnhancedSelect
              name="purpose"
              label="Purpose*"
              value={formData.purpose}
              onChange={handleChange}
              options={purposeOptions}
              placeholder="Select purpose"
              required
              className="focus:ring-2 focus:ring-main-green"
            />
            <EnhancedSelect
              name="condition"
              label="Condition"
              value={formData.condition}
              onChange={handleChange}
              options={conditionOptions}
              placeholder="Select Condition"
              className="focus:ring-2 focus:ring-main-green"
            />
          </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <EnhancedInput
                name="price"
                label="Price*"
                type="number"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price"
                required
              />

              <EnhancedSelect
                name="currency"
                label="currency"
                value={formData.currency}
                onChange={handleChange}
                options={currencyOptions}
                placeholder="Select Currency"
                required
              />
              <EnhancedSelect
                name="frequency"
                label="Frequency*"
                value={formData.frequency}
                onChange={handleChange}
                options={frequencyOptions}
                placeholder="Select frequency"
                required
              />
            </div>
          </div>
        </div>

        {/* Property Details */}
        {(isResidential || isCommercial) && (
          <div className="bg-white space-y-6 p-6 border border-gray-200  ">
            <h3 className="text-xl font-semibold text-main-green border-b pb-3">
              Property Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isResidential && (
                <>
                  <EnhancedSelect
                    name="beds"
                    label="Bedrooms*"
                    value={formData.beds}
                    onChange={handleChange}
                    options={bedsOptions}
                    placeholder="Number of bedrooms"
                    required
                  />

                  <EnhancedSelect
                    name="baths"
                    label="Bathrooms"
                    value={formData.baths}
                    onChange={handleChange}
                    options={bedsOptions}
                    placeholder="Number of bathrooms"
                  />
                </>
              )}

              {isCommercial && (
                <>
                  <EnhancedInput
                    name="propertySize"
                    type="text"
                    placeholder="e.g. 1200"
                    label="Property Size*"
                    value={formData.propertySize}
                    onChange={handleChange}
                  />
                  <EnhancedSelect
                    name="propertySizeUnit"
                    label="Units"
                    value={formData.propertySizeUnit}
                    onChange={handleChange}
                    options={propertySizeOptions}
                    placeholder="Plots/Acres/Square feet"
                  />
                </>
              )}
            </div>
          </div>
        )}

        {/* Property Location */}
        <div className="bg-white space-y-6 p-6 border border-gray-200  ">
          <h3 className="text-xl font-semibold text-main-green border-b pb-3">
            Property Location
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <EnhancedSelect
              name="state"
              label="State*"
              value={formData.state}
              options={stateOptions}
              onChange={handleStateChange}
              placeholder="Select state"
              required
            />

            <EnhancedSelect
              name="city"
              label="City*"
              value={formData.city}
              onChange={handleChange}
              options={cityOptions}
              placeholder={
                formData.state ? "Select city" : "Select state first"
              }
              disabled={!formData.state}
              required
            />

            <EnhancedInput
              name="location"
              type="text"
              placeholder="e.g. 123 Main Street"
              label="Address*"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          {formData.state && (
            <div className="mt-6">
              <div className="h-80 bg-gray-100 rounded-lg overflow-hidden">
                <Map
                  address={formData.location}
                  city={formData.city}
                  state={formData.state}
                />
              </div>
              <div className="mt-3 text-sm text-gray-600 flex items-center">
                <MdLocationOn className="inline mr-1 text-green-600" />
                {formData.location || "No address specified"} {formData.city}{" "}
                {formData.state}
              </div>
            </div>
          )}
        </div>

        {/* Property Description */}
        <div className="bg-white space-y-6 p-6 border border-gray-200  ">
          <h3 className="text-xl font-semibold text-main-green border-b pb-3">
            Detailed Description
          </h3>

          <EnhancedTextarea
            name="description"
            // placeholder="Elaborate description enhances engagement and sales"
            label="Description*"
            value={formData.description}
            onChange={handleChange}
            rows={6}
          />
        </div>

        {/* Amenities */}
        {isResidential && (
          <div className="bg-white space-y-6 border border-gray-200  ">
            <CollapsableBox title="Amenities">
              <EnhancedCheckbox
                name="amenities"
                label="Select Amenities"
                value={formData.amenities}
                onChange={handleChange}
                amenities={Amenities}
              />
            </CollapsableBox>
          </div>
        )}

        {/* Property Media */}
         {(user?.firstName && user?.lastName) && ( 
     
          <div className="bg-white space-y-6 p-6 border border-gray-200  ">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-3">
              Media
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Images (max 10)
                </label>
                <FileUpload
                  value={formData.media}
                  onChange={(files) => handleFileUpload("media", files)}
                  multiple={true}
                  maxFiles={10}
                      accept = "image/*,video/*"
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-green-500 transition-colors"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Upload additional images to showcase your property
                </p>
              </div>
            </div>
          </div>
       
         )}
         
        {/* Form Actions */}
        {(user?.firstName && user?.lastName) && ( 
        <div className="flex flex-col-reverse gap-4 md:flex-row justify-end">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-6 py-3 border border-blue-500 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save As Draft"}
          </button>

          <button
            type="submit"
            className="px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Please Wait..." : "Publish Listing"}
          </button>
        </div>
        )}
      </form>

     
      
    </section>

  );
};

export default NewProperty;
