import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import DOMPurify from "dompurify";
import EnhancedTextarea from "@components/ui/EnhancedTextarea";
import FileUpload from "@components/ui/FileUpload";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { handleGoBack, useTenMinuteTimeout } from "@utils/helper";
import useAuthStore from "@store/authStore";
import DeleteModal from "@components/deleteModal/DeleteModal";
import HandleGoBackBtn from "@components/goBackBtn/HandleGoBackBtn";
import CompleteProfileCall from "@components/profileComplete/CompleteProfileCall";

const NewPost = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isTrashing, setIsTrashing] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [hasUploadedImages, setHasUploadedImages] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    description: "",
    media: [],
  });

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

  const resetForm = () => {
    setFormData({
      content: "",
      media: [],
    });
    setHasUploadedImages(false);
  };

  const cleanupAbandonedImages = async () => {
    if (!hasUploadedImages || !formData.media.length) return;
    try {
      await Promise.all(
        formData.media.map((imageUrl) =>
          apiClient.post(endpoints.updateCloudinary, {
            Model: "PostModel",
            url: imageUrl,
            fieldPath: "media",
          })
        )
      );
    } catch (error) {
      toast.error(ErrorFormatter(error));
    }
  };

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

      const res = await apiClient.post(endpoints.createProperty, {
        ...sanitizedFormData,
        postType: "post",
      });

      if (res.status === 201) {
        toast.success("Post created successfully!");
        resetForm();
        setTimeout(() => window.location.reload(), 3000);
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
      resetForm();
      handleGoBack(navigate, user);
    }
  };

  const confirmDelete = async () => {
    setIsTrashing(true);
    await cleanupAbandonedImages();
    resetForm();
    handleGoBack(navigate, user);
  };

  useTenMinuteTimeout(() => {
    if (hasUploadedImages && formData.media.length > 0) {
      cleanupAbandonedImages();
      handleGoBack(navigate, user);
    }
  });

  return (
    <section className=" mx-auto px-4 mb-8 dark:bg-gray-800 dark:text-gray-100">
      {/* Check If profile is complete */}
      <CompleteProfileCall />

      <DeleteModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={confirmDelete}
        confirmText="Discard Post"
        message="You have unsaved uploads. Do you really want to cancel?"
        isDeleting={isTrashing}
      />

      <HandleGoBackBtn />

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-primary-text mb-2 dark:text-gray-100">
          Create New Post
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-100 ">
          Start sharing your ideas, thoughts, or updates.
        </p>
      </div>

      <form className="space-y-8 " onSubmit={handleSubmit}  >
        {/* Content Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-400 shadow-sm p-6 space-y-4">
          <EnhancedTextarea
            name="description"
            label="Post Content"
            placeholder="Write your post, idea, or announcement here..."
            value={formData.description}
            onChange={handleChange}
            rows={6}
          />
          {user?.firstName && user?.lastName && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Upload Media (Images or Videos)
              </label>
              <FileUpload
                value={formData.media}
                onChange={(files) => handleFileUpload("media", files)}
                multiple
                maxFiles={4}
                accept="image/*,video/*"
                className="border-2 border-dashed border-gray-300 dark:border-gray-500 rounded-lg p-6 hover:border-green-500 transition"
              />
            </div>
          )}
        </div>

        {/* Form Actions */}
        {(user?.firstName && user?.lastName) && (
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="w-full sm:w-auto px-6 py-3 border border-gray-300 dark:text-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 dark:hover:text-gray-600 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-md text-sm font-medium text-white bg-main-green hover:bg-green-hover transition disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Please wait..." : "Publish"}
            </button>
          </div>
        )}
      </form>
    </section>
  );
};

export default NewPost;
