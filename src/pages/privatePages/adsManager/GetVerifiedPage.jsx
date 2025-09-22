import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import { NigerianStates } from "@utils/data";

import EnhancedInput from "@components/ui/EnhancedInput";
import EnhancedSelect from "@components/ui/EnhancedSelect";
import FileUpload from "@components/ui/FileUpload";
import DeleteModal from "@components/deleteModal/DeleteModal";
import useAuthStore from "@store/authStore";
import { PuffLoader } from "react-spinners";

const GetVerifiedPage = () => {
  const { user } = useAuthStore();
  const certificateRefs = useRef([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState("pending");
  const [verifying, setVerfying] = useState(true);

  useState(() => {
    const fetchVerifyStatus = async () => {
      try {
        const res = await apiClient.get(`${endpoints.getVerificaionStatus}/${user.id}`);
        setVerificationStatus(res.data.data);
        setVerfying(false);
      } catch (error) {
        toast.error(ErrorFormatter(error));
      }
    };

    fetchVerifyStatus();
  }, [verificationStatus, user]);

  // Form State
  const [verificationData, setVerificationData] = useState({
    fullName: "",
    email: "",
    state: "",
    city: "",
    documents: [{ file: null, title: "" }],
  });

  // State Options
  const stateOptions = NigerianStates.map((state) => ({
    label: state.state,
    value: state.state,
  }));

  // Handlers
  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setVerificationData((prev) => ({
      ...prev,
      state: selectedState,
      city: "",
    }));

    const selectedStateData = NigerianStates.find((s) => s.state === selectedState);
    setCityOptions(
      selectedStateData?.lgas.map((lga) => ({
        label: lga,
        value: lga,
      })) || []
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVerificationData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDocumentsChange = (index, field, value) => {
    const documents = [...verificationData.documents];
    documents[index][field] = value;
    setVerificationData((prev) => ({ ...prev, documents }));
  };

  const addCertificateField = () => {
    setVerificationData((prev) => ({
      ...prev,
      documents: [...prev.documents, { file: null, title: "" }],
    }));
  };

  const removeCertificateField = (index) => {
    const choice = verificationData.documents[index];
    if (choice.url || choice.file) {
      setOpenModal(true);
      setItemToDelete({
        type: "documents",
        index,
        document: verificationData.documents[index],
      });
    } else {
      setVerificationData((prev) => {
        const documents = [...prev.documents];
        documents.splice(index, 1);
        return { ...prev, documents };
      });
      certificateRefs.current.splice(index, 1);
    }
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      if (itemToDelete?.type === "documents") {
        await apiClient.put(`${endpoints.updateCompany}/${user?.id}`, {
          deleteImage: itemToDelete,
        });

        setVerificationData((prev) => {
          const documents = [...prev.documents];
          documents.splice(itemToDelete.index, 1);
          return { ...prev, documents };
        });

        certificateRefs.current.splice(itemToDelete.index, 1);
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

  // ✅ Input Check before Submit
  const validateForm = () => {
    if (!verificationData.fullName.trim()) {
      toast.error("Full Name is required");
      return false;
    }
    if (!verificationData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(verificationData.email)) {
      toast.error("Invalid email format");
      return false;
    }
    if (!verificationData.state) {
      toast.error("Please select a State");
      return false;
    }
    if (!verificationData.city) {
      toast.error("Please select a City");
      return false;
    }
    if (
      verificationData.documents.length === 0 ||
      verificationData.documents.some((doc) => !doc.file && !doc.url)
    ) {
      toast.error("Please upload at least one document");
      return false;
    }
    if (verificationData.documents.some((doc) => !doc.title.trim())) {
      toast.error("Each document must have a title");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const sanitizedData = {
        fullName: verificationData.fullName,
        email: verificationData.email,
        state: verificationData.state,
        city: verificationData.city,
        documents: verificationData.documents.map((d) => ({
          title: d.title,
          url: typeof d.file === "string" ? d.file : d.file?.url || d.url,
        })),
      };

      const response = await apiClient.post(
        `${endpoints.verificationRequest}/${user?.id}`,
        sanitizedData
      );
      if (response.status === 201) {
        toast.success("Verification submitted successfully!");
        setTimeout(() => {
          setSubmitted(true);
        }, 2000);
      }
    } catch (error) {
      toast.error(ErrorFormatter(error));
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    <section className="section-container mx-auto bg-white dark:bg-gray-800 p-6 rounded-2xl">
      <PuffLoader />
    </section>;
  }
  if (!verifying) {
    return (
      <section className="section-container mx-auto bg-white/60 dark:bg-gray-800 p-6 rounded-2xl">
        {/* Delete Confirmation */}
        <DeleteModal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          onConfirm={confirmDelete}
          message="This document will be deleted. Continue?"
          isDeleting={isDeleting}
          confirmText="Delete"
          confirmTextClass="!bg-red-500"
        />
        {submitted ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-green-600 dark:text-green-400">
              🎉 Application Received!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-3 max-w-lg mx-auto">
              Your application for verification has been received and is under review. You will be
              notified once the status changes.
            </p>
          </div>
        ) : verificationStatus?.status == "pending" ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-green-600 dark:text-green-400">
              🎉 Application Under Review!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-3 max-w-lg mx-auto">
              Your application for verification is still under review. You will be notified once a
              decision has been made about your request.
            </p>
          </div>
        ) : verificationStatus?.status == "approved" ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-green-600 dark:text-green-400">
              🎉 Congratulations!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-3 max-w-lg mx-auto">
              You have been successfully verified. Please note that this verification may be revoked
              if we detect suspicious activity on your account or if multiple users consistently
              report your posts or properties as fraudulent.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mt-3 max-w-lg mx-auto">
              You can also explore and purchase badges to add extra trust to your posts and
              properties.
            </p>
          </div>
        ) : (
          <>
            {/* Page Title */}
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                Submit Your Documents for Verification
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Please provide valid information and upload clear copies of your documents. Your
                details will be reviewed for approval.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EnhancedInput
                  name="fullName"
                  label="Full Name as in Documents*"
                  value={verificationData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
                <EnhancedInput
                  type="email"
                  name="email"
                  label="Email*"
                  value={verificationData.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                />
              </div>

              {/* Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EnhancedSelect
                  name="state"
                  label="State*"
                  options={stateOptions}
                  value={verificationData.state}
                  onChange={handleStateChange}
                />
                <EnhancedSelect
                  name="city"
                  label="City*"
                  value={verificationData.city}
                  onChange={handleChange}
                  options={cityOptions}
                  placeholder={verificationData.state ? "Select city" : "Select state first"}
                  disabled={!verificationData.state}
                />
              </div>

              {/* Documents */}
              <div className="space-y-2">
                <p className="font-medium dark:text-gray-200">Identification*</p>
                {verificationData.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col md:flex-row items-start md:items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    {doc.url ? (
                      <img className="w-14 h-14" src={doc.url} alt={doc.title || "document"} />
                    ) : (
                      <FileUpload
                        ref={(el) => (certificateRefs.current[idx] = el)}
                        value={doc.file}
                        onChange={(file) => handleDocumentsChange(idx, "file", file)}
                        accept="image/*,application/pdf"
                        multiple={false}
                        className="w-full md:w-1/3"
                        innerClass="h-10 w-10 overflow-hidden"
                      />
                    )}

                    <EnhancedInput
                      name={`document-title-${idx}`}
                      value={doc.title}
                      onChange={(e) => handleDocumentsChange(idx, "title", e.target.value)}
                      placeholder="Document title (e.g., Passport, National ID)"
                      className="flex-1"
                    />

                    {verificationData.documents.length > 1 && (
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

                <button
                  type="button"
                  onClick={addCertificateField}
                  className="text-sm text-green-600 hover:underline mt-2"
                >
                  + Add another Document
                </button>
              </div>

              {/* Submit */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#28B16D] hover:bg-[#09C269] text-white font-medium py-3 px-8 rounded shadow-sm transition"
                >
                  {loading ? "Please Wait..." : "Submit Verification"}
                </button>
              </div>
            </form>
          </>
        )}
      </section>
    );
  }
};

export default GetVerifiedPage;
