import { useCallback, useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";
import { toast } from "react-toastify";
import { FiBriefcase, FiEdit2 } from "react-icons/fi";

import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";

import EnhancedInput from "@components/ui/EnhancedInput";
import EnhancedTextarea from "@components/ui/EnhancedTextArea";
import EnhancedSelect from "@components/ui/EnhancedSelect";

import FileUpload from "@components/ui/FileUpload";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import DeleteModal from "@components/deleteModal/DeleteModal";
import { companyCategory, NigerianStates } from "@utils/data";
import { useParams } from "react-router-dom";
import Placeholder from "@assets/img/placeholder.webp";
import LogoPlaceholder from "@assets/img/your-logo.webp";

const UpdateCompany = () => {
  const { slug } = useParams();
  const logoRef = useRef();
  const coverRef = useRef();
  const certificateRefs = useRef([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  // Company Data State
  const [companyData, setCompanyData] = useState({
    companyName: "",
    email: "",
    companyLogo: null,
    coverPic: null,
    state: "",
    city: "",
    address: "",
    description: "",
    phones: [""],
    socialLinks: { facebook: "", instagram: "", twitter: "", linkedin: "" },
    category: "",
    companyWebsite: "",
    certificates: [{ url: null, title: "" }],
  });

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const res = await apiClient.get(
          `${endpoints.fetchCompanyDetails}/${slug}`
        );

        const normalized = {
          ...res.data.data,
          socialLinks: res.data.data.socialLinks || {
            facebook: "",
            instagram: "",
            twitter: "",
            linkedin: "",
          },
          certificates: res.data.data.certificates?.map((c) => ({
            title: c.title || "",
            url: c.url || null,
          })) || [{ url: null, title: "" }],
        };
        setCompanyData(normalized);
      } catch (error) {
        toast.error(ErrorFormatter(error));
      }
    };

    if (slug) {
      fetchCompanyDetails();
    }
  }, [slug]);

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

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setCompanyData((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [name]: value },
    }));
  };

  const handleFileUpload = useCallback((name, file) => {
    setCompanyData((prev) => ({
      ...prev,
      [name]: file,
    }));
  }, []);

  const handleCoverPicClick = () => {
    if (companyData.coverPic) {
      setOpenModal(true);
      setItemToDelete({ coverPic: companyData.coverPic });
    } else {
      coverRef.current?.open();
    }
  };

  const handleLogoPicClick = () => {
    if (companyData.companyLogo) {
      setOpenModal(true);
      setItemToDelete({ companyLogo: companyData.companyLogo });
    } else {
      logoRef.current?.open();
    }
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

  const getImageSrc = (image) => {
    if (!image) return null;
    if (typeof image === "string") return image;
    if (image instanceof File) return URL.createObjectURL(image);
    return null;
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      if (itemToDelete) {
        if (itemToDelete.type === "certificate") {
          const deleteDetails = {
            itemToDelete: itemToDelete,
          };
          await apiClient.put(`${endpoints.updateCompany}/${slug}`, {
            deleteImage: deleteDetails,
          });

          // Remove from state
          setCompanyData((prev) => {
            const certificates = [...prev.certificates];
            certificates.splice(itemToDelete.index, 1);
            return { ...prev, certificates };
          });

          certificateRefs.current.splice(itemToDelete.index, 1);
        } else {
          // Handle logo / coverPic delete

          const deleteDetails = { itemToDelete };
          await apiClient.put(`${endpoints.updateCompany}/${slug}`, {
            deleteImage: deleteDetails,
          });

          const key = Object.keys(itemToDelete)[0];
          if (key === "coverPic") {
            coverRef.current?.open();
          } else if (key === "companyLogo") {
            logoRef.current?.open();
          }
        }
      }
      toast.success("Deleted successfully!");
    } catch (error) {
      toast.error(ErrorFormatter(error));
    } finally {
      setOpenModal(false);
      setItemToDelete(null);
      setIsDeleting(false);
    }
  };

  const handleCertificateChange = (index, field, value) => {
    const certificates = [...companyData.certificates];
    certificates[index][field] = value;
    setCompanyData((prev) => ({ ...prev, certificates }));
  };

  const addCertificateField = () => {
    setCompanyData((prev) => ({
      ...prev,
      certificates: [...prev.certificates, { file: null, title: "" }],
    }));
  };

  const removeCertificateField = (index) => {
     const choice = companyData.certificates[index]
     if(choice.url || choice.file){
       setOpenModal(true);
         setItemToDelete({
      type: "certificate",
      index,
      certificate: companyData.certificates[index],
    });
     }else{
        // empty cert → remove directly
    setCompanyData((prev) => {
      const certificates = [...prev.certificates];
      certificates.splice(index, 1);
      return { ...prev, certificates };
    });

    certificateRefs.current.splice(index, 1);

     }
    
  
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const sanitizedData = {
        companyName: companyData.companyName,
        email: companyData.email,
        companyLogo:
          typeof companyData.companyLogo === "string"
            ? companyData.companyLogo
            : companyData.companyLogo?.url,
        coverPic:
          typeof companyData.coverPic === "string"
            ? companyData.coverPic
            : companyData.coverPic?.url,

        state: companyData.state,
        city: companyData.city,
        address: companyData.address,
        description: DOMPurify.sanitize(companyData.description, {
          ALLOWED_TAGS: [],
          ALLOWED_ATTR: [],
          KEEP_CONTENT: true,
        }),
        phones: companyData.phones.filter((p) => p),
        socialLinks: companyData.socialLinks,
        category: companyData.category,
        companyWebsite: companyData.companyWebsite,
        isVerified: companyData.isVerified,
      

        certificates: companyData.certificates.map((c) => ({
          title: c.title,
          url: typeof c.file === "string" ? c.file : c.file?.url || c.url, // keep existing or new
        })),
      };

      const response = await apiClient.put(
        `${endpoints.updateCompany}/${slug}`,
        sanitizedData
      );
      if (response.status === 200) {
        toast.success("Company updated successfully!");
      }
    } catch (error) {
      toast.error(ErrorFormatter(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-container mx-auto bg-white dark:bg-gray-800 p-6 rounded-2xl">
      <DeleteModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={confirmDelete}
        message="This image will be deleted if replaced !"
        isDeleting={isDeleting}
        confirmText="Replace"
        confirmTextClass="!bg-blue-500"
      />
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Logo & Cover */}
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Logo */}
          <div className="relative mx-auto">
            <div className="w-24 h-24 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden border border-gray-300 dark:border-gray-600 ">
              {companyData.companyLogo ? (
                <img
                  src={getImageSrc(
                    companyData.companyLogo?.url ||
                      companyData.companyLogo ||
                      LogoPlaceholder
                  )}
                  alt="Company Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FiBriefcase className="text-3xl text-gray-400" />
              )}
            </div>
            <button
              type="button"
              onClick={handleLogoPicClick}
              className="absolute top-0 right-0 bg-white dark:bg-gray-600 p-2 rounded-full shadow-md border border-gray-200 hover:bg-gray-50"
            >
              <FiEdit2 className="w-4 h-4 text-gray-600 dark:text-gray-100" />
            </button>
            <FileUpload
              ref={logoRef}
              value={companyData.companyLogo}
              onChange={(file) => handleFileUpload("companyLogo", file)}
              multiple={false}
              accept="image/*"
              maxFiles={1}
              className="hidden"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
              Logo (PNG/JPG)
            </p>
          </div>

          {/* Cover Pic */}
          <div className="flex-1 relative w-full rounded-lg ">
            <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden object-cover">
              {companyData.coverPic && (
                <img
                  src={getImageSrc(
                    companyData.coverPic.url ||
                      companyData.coverPic ||
                      Placeholder
                  )}
                  alt="Cover Pic"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <button
              type="button"
              onClick={handleCoverPicClick}
              className="absolute top-0 right-0 bg-white/90 hover:bg-white text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 shadow-sm"
            >
              <FiEdit2 size={14} />
              Change Cover
            </button>

            <FileUpload
              ref={coverRef}
              value={companyData.coverPic?.url || companyData.coverPic}
              onChange={(file) => handleFileUpload("coverPic", file)}
              multiple={false}
              maxFiles={1}
              accept="image/*"
              className="hidden"
              key="cover-upload"
            />
          </div>
        </div>

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

        {/* Social Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["facebook", "instagram", "twitter", "linkedin"].map((social) => (
            <EnhancedInput
              key={social}
              name={social}
              label={social.charAt(0).toUpperCase() + social?.slice(1)}
              value={companyData?.socialLinks[social]}
              onChange={handleSocialChange}
            />
          ))}
        </div>

        {/* Description */}
        <EnhancedTextarea
          name="description"
          label="About the Company"
          value={companyData.description}
          onChange={handleChange}
          rows={6}
          withToolbar
        />

        <div className="space-y-2">
          <p className="font-medium dark:text-gray-200">Certificates</p>
          {companyData.certificates.map((cert, idx) => (
            <div
              key={idx}
              className="flex flex-col md:flex-row items-start md:items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              {/* File Upload */}
            
              {cert.url ? (
                <div className="">
                  <img
                    className="w-14 h-14"
                    src={cert.url}
                    alt={cert.title || "certificate"}
                  />
                </div>
              ) : (
                
                <FileUpload
                  ref={(el) => (certificateRefs.current[idx] = el)}
                  value={cert.file}
                  onChange={(file) =>
                    handleCertificateChange(idx, "file", file)
                  }
                  accept="image/*"
                  multiple={false}
                  className="w-full md:w-1/3"
                  innerClass="h-10 w-10 overflow-hidden"
                />
              )}

              {/* Title Input */}
              <EnhancedInput
                name={`certificate-title-${idx}`}
                value={cert.title}
                onChange={(e) =>
                  handleCertificateChange(idx, "title", e.target.value)
                }
                placeholder="Certificate name"
                className="flex-1"
              />

              {/* Remove Btn */}
              {companyData.certificates.length > 1 && (
                <button
                  type="button"
                  className="text-red-500 font-bold"
                  onClick={() => removeCertificateField(idx)}
                >
                  X
                </button>
              )}
            </div>
          ))}

          {/* Add More */}
          <button
            type="button"
            onClick={addCertificateField}
            className="text-sm text-green-600 hover:underline mt-2"
          >
            + Add another certificate
          </button>
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#28B16D] hover:bg-[#09C269] text-white font-medium py-3 px-8 rounded shadow-sm transition"
          >
            {loading ? "Please Wait..." : "Update Company Info"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default UpdateCompany;
