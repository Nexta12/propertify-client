import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import { PuffLoader } from "react-spinners";
import { toast } from "react-toastify";
import { Dialog } from "@headlessui/react";

const VerificationDetails = () => {
  const { id } = useParams();
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchVerification = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get(`${endpoints.getVerificationById}/${id}`);
        setVerification(res.data.data);
      } catch (error) {
        toast.error(ErrorFormatter(error));
      } finally {
        setLoading(false);
      }
    };
    fetchVerification();
  }, [id]);

  const handleAction = async (status) => {
    setActionLoading(true);
    try {
      await apiClient.put(`${endpoints.verifyUser}/${id}`, { status });

      setVerification((prev) => ({ ...prev, status }));
      toast.success(
        status === "approved"
          ? "Verification approved successfully"
          : "Verification declined successfully"
      );
    } catch (error) {
      toast.error(ErrorFormatter(error));
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center">
        <PuffLoader color="#4866ff" />
      </div>
    );
  }

  if (!verification) {
    return <div className="p-6 text-center text-red-500">Verification not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Verification Details
      </h1>

      {/* User Info */}
      <div className="space-y-3 mb-8">
        <p className="text-gray-700 dark:text-gray-300">
          <span className="font-semibold">Full Name:</span> {verification.fullName}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <span className="font-semibold">Email:</span>{" "}
          {verification.email || verification.userId?.email}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <span className="font-semibold">State:</span> {verification.state}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <span className="font-semibold">City:</span> {verification.city}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <span className="font-semibold">Status:</span>{" "}
          <span
            className={`px-2 py-1 rounded text-sm font-medium capitalize ${
              verification.status === "approved"
                ? "bg-green-100 text-green-700"
                : verification.status === "declined"
                  ? "bg-red-100 text-red-600"
                  : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {verification.status}
          </span>
        </p>
      </div>

      {/* Action Buttons */}
      {verification.status === "pending" && (
        <div className="flex gap-4 mb-8">
          <button
            disabled={actionLoading}
            onClick={() => handleAction("approved")}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {actionLoading ? "Processing..." : "Approve"}
          </button>
          <button
            disabled={actionLoading}
            onClick={() => handleAction("declined")}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {actionLoading ? "Processing..." : "Decline"}
          </button>
        </div>
      )}

      {/* Documents */}
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Uploaded Documents
      </h2>
      {verification.documents?.length ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {verification.documents.map((doc, idx) => (
            <div key={idx} className="cursor-pointer" onClick={() => setSelectedImage(doc)}>
              <img
                src={doc?.url}
                alt={`document-${idx}`}
                className="w-full h-40 object-cover rounded-lg border hover:scale-105 transition"
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No documents uploaded.</p>
      )}

      {/* Image Preview Modal */}
      <Dialog
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-3xl w-full p-4">
            <img src={selectedImage?.url} alt="preview" className="w-full h-auto rounded-lg" />
            <button
              onClick={() => setSelectedImage(null)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Close
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default VerificationDetails;
