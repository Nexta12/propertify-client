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
import { useEffect, useMemo, useState } from "react";
import { MdLocationOn } from "react-icons/md";
import { toast  } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { AiOutlineDelete } from "react-icons/ai";
import DeleteModal from "@components/deleteModal/DeleteModal";
import { paths } from "@routes/paths";
import { handleGoBack } from "@utils/helper";
import useAuthStore from "@store/authStore";
import HandleGoBackBtn from "@components/goBackBtn/HandleGoBackBtn";

const EditProperty = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [cityOptions, setCityOptions] = useState([]);
  const [hasUploadedImages, setHasUploadedImages] = useState(false);

  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    _id: "",
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
    existingImages: [],
    status: "",
  });

  // Fetch The Property from API

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await apiClient.get(
          `${endpoints.fetchProperty}/${slug}`
        );
        const propertyData = response.data.data;

        // Set the form data first
        setFormData({
          ...propertyData,
          existingImages: propertyData.media || [], // Store original images
          media: propertyData.media || [], // Initialize with existing images
        });

        // Then update city options based on the property's state
        if (propertyData.state) {
          const selectedStateData = NigerianStates.find(
            (s) => s.state === propertyData.state
          );
          const newCityOptions =
            selectedStateData?.lgas.map((lga) => ({
              label: lga,
              value: lga,
            })) || [];

          setCityOptions(newCityOptions);
        }
      } catch (error) {
        toast.error(ErrorFormatter(error) || "An Error Occurred");
      }
    };

    if (slug) fetchProperty();
  }, [slug]);

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

  // Handle image removal

  const handleFileUpload = (name, files) => {
    setFormData((prev) => {
      // Extract URLs from existing images (in case they're file objects)
      const existingUrls = prev.existingImages.map((img) =>
        typeof img === "string" ? img : img.url || URL.createObjectURL(img)
      );

      // Filter new files that aren't already present
      const newFiles = files.filter((file) => {
        const fileUrl =
          typeof file === "string"
            ? file
            : file.url || URL.createObjectURL(file);
        return !existingUrls.includes(fileUrl);
      });
      if (newFiles.length > 0) setHasUploadedImages(true);
      // Combine while respecting max limit (10)
      const combined = [...prev.media, ...newFiles].slice(0, 10);

      return {
        ...prev,
        [name]: combined,
      };
    });
  };

  // Retract existing Image from Cloudinary and Database
  const handleRemoveImage = async (imageUrl) => {
    setOpenModal(true);
    setItemToDelete(imageUrl);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    if (itemToDelete) {
      try {
        const deleteDetails = {
          url: itemToDelete,
          propertyId: formData._id
        };
        // Make an API call to delete the item
        await apiClient.post(endpoints.deleteMediaFileFromCloud, deleteDetails);
        // Remove the item from the list
        setFormData((prev) => ({
          ...prev,
          media: prev.media.filter((img) => img.url !== itemToDelete),
          existingImages: prev.existingImages.filter(
            (img) => img.url !== itemToDelete
          ),
        }));

        setOpenModal(false); // Close the modal
        setItemToDelete(null); // Reset the item to delete
        toast.success("File Deleted..");
      } catch (error) {
        toast.error(ErrorFormatter(error));
        setOpenModal(false); // Close the modal
        setItemToDelete(null); // Reset the item to delete
        setIsDeleting(false);
      }
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Prepare data for API
    const submitData = {
      ...formData,
      existingImages: undefined,
    };

    try {
      const res = await apiClient.put(`${endpoints.editProperty}/${slug}`, {
        ...submitData,
        description: DOMPurify.sanitize(formData.description, {
          ALLOWED_TAGS: [],
          ALLOWED_ATTR: [], // Remove all attributes
          KEEP_CONTENT: true,
        }),
      });

      if (res.status == 201) {
        toast.success("Listing Updated successfully");
      }
      // If the title changed, navigate to new URL
      if (res.data.data.slug !== slug) {
        navigate(`${paths.protected}/properties/edit/${res.data.data.slug}`, {
          replace: true,
        });
      }
  
    } catch (error) {
      toast.error(ErrorFormatter(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    if (hasUploadedImages && formData.media.length > 0) {
      setOpenModal(true);
    } else {
      handleGoBack(navigate, user);
    }
  };

  // Handle Save as Draft.
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
      const draftId = formData._id;

      const res = await apiClient.put(
        `${endpoints.updateDraft}/${draftId}`,
        sanitizedFormData
      );

      if (res.status === 200 || res.status === 201) {
        if (res.data.data?._id) {
          setHasUploadedImages(false);
        }
        toast.success(
          `${
            formData.status === "draft" ? "Updated draft" : " Reversed To Draft"
          }`
        );
      }
    } catch (error) {
      toast.error(ErrorFormatter(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className=" rounded-md max-w-7xl mx-auto">
      <DeleteModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={confirmDelete}
        message="Are you Sure You want to this file ?"
        isDeleting={isDeleting}
      />
      <HandleGoBackBtn/>
  
      <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-5 text-center">
        <h2 className="text-2xl font-bold text-white">Edit Listing</h2>
      </div>

      <form className="space-y-6 mb-6 w-full" onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div className="bg-white space-y-6 p-6 border border-gray-200 ">
          <h3 className="text-xl font-semibold text-gray-800 border-b pb-3">
            Basic Information
          </h3>

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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <EnhancedSelect
                name="propertyType"
                label="Property Type*"
                value={formData.propertyType}
                onChange={handleChange}
                options={PropertyTypes}
                placeholder="Select property type"
                required
              />

              <EnhancedSelect
                name="purpose"
                label="Purpose*"
                value={formData.purpose}
                onChange={handleChange}
                options={purposeOptions}
                placeholder="Select purpose"
                required
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
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-3">
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
          <h3 className="text-xl font-semibold text-gray-800 border-b pb-3">
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
          <h3 className="text-xl font-semibold text-gray-800 border-b pb-3">
            Detailed Description
          </h3>

          <EnhancedTextarea
            name="description"
            placeholder="Elaborate description enhances engagement and sales"
            label="Description*"
            value={formData.description}
            onChange={handleChange}
            rows={6}
            required
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
        <div className="bg-white space-y-6 p-6 border border-gray-200 ">
          <h3 className="text-xl font-semibold text-gray-800 border-b pb-3">
            Media
          </h3>

          <div className="space-y-6">
            {/* Display existing images with remove option */}
            {formData?.existingImages?.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Existing Images
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {formData?.existingImages?.map((media, index) => {
                    const isVideo = media.url?.match(/\.(mp4|webm|ogg)$/i);

                    return (
                      <div key={`existing-${index}`} className="relative group">
                        {isVideo ? (
                          <video
                            src={media.url}
                            controls
                            className="w-full h-32 object-cover rounded-md"
                          />
                        ) : (
                          <img
                            src={media.url}
                            alt={`Property media ${index}`}
                            className="w-full h-32 object-cover rounded-md"
                          />
                        )}

                        {!isDeleting && (
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(media.url)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete"
                          >
                            <AiOutlineDelete size={16} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images (max 10)
              </label>
              <FileUpload
                value={formData.media}
                onChange={(files) => handleFileUpload("media", files)}
                multiple={true}
                maxFiles={10}
                accept="image/*,video/*"
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-green-500 transition-colors"
              />
              <p className="mt-1 text-xs text-gray-500">
                Upload additional images to showcase your property
              </p>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col-reverse gap-4 md:flex-row justify-end pt-6">
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
            {isLoading
              ? "Saving..."
              : formData.status === "draft"
              ? "Update draft"
              : " Revert To Draft"}
          </button>

          <button
            type="submit"
            className="px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            {isLoading
              ? "Please Wait..."
              : `${
                  formData.status === "draft"
                    ? "Publish draft"
                    : "Update Listing"
                }`}
          </button>
        </div>
      </form>
    </section>
  );
};

export default EditProperty;
