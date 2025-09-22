import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import DOMPurify from "dompurify";
import FileUpload from "@components/ui/FileUpload";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { handleGoBack, useTenMinuteTimeout } from "@utils/helper";
import useAuthStore from "@store/authStore";
import DeleteModal from "@components/deleteModal/DeleteModal";
import CompleteProfileCall from "@components/profileComplete/CompleteProfileCall";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import Avater from "@assets/img/avater.png";
import { RiVerifiedBadgeFill } from "react-icons/ri";

const NewPost = ({ closeModal }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isTrashing, setIsTrashing] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [hasUploadedImages, setHasUploadedImages] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

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

  const handleEmojiSelect = (emoji) => {
    setFormData((prev) => ({
      ...prev,
      description: prev.description + emoji.native,
    }));
    setShowEmojiPicker(false);
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
      description: "",
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
        setTimeout(() => window.location.reload(), 2000);
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
      closeModal();
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
    <section className="mx-auto mb-8">
      <CompleteProfileCall />

      <DeleteModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={confirmDelete}
        confirmText="Discard Post"
        message="You have unsaved uploads. Do you really want to cancel?"
        isDeleting={isTrashing}
      />

      <form
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 space-y-4"
        onSubmit={handleSubmit}
      >
        {/* Header with profile */}
        <div className="flex items-center gap-3">
          <img
            src={user?.profilePic || Avater}
            alt={user?.firstName}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-100 flex items-center">
              {user?.firstName} {user?.lastName}
              {user?.isVerifiedUser && (
                <RiVerifiedBadgeFill className="ml-1 text-blue-500" title="Duly Verified user" />
              )}
            </p>

            <span className="text-xs text-gray-500">Posting publicly</span>
          </div>
        </div>

        {/* Post Content */}
        <div>
          <textarea
            name="description"
            placeholder="What do you want to talk about?"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full border-0 focus:ring-0 text-sm resize-none dark:bg-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none "
          />
          <div className="flex justify-between items-center mt-2">
            <button
              type="button"
              onClick={() => setShowEmojiPicker((prev) => !prev)}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              😊 Emoji
            </button>
          </div>
          {showEmojiPicker && (
            <div className="mt-2">
              <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="light" />
            </div>
          )}
        </div>

        {/* File Upload */}
        <FileUpload
          value={formData.media}
          onChange={(files) => handleFileUpload("media", files)}
          multiple
          maxFiles={4}
          accept="image/*,video/*"
          innerClass="w-4 h-4 overflow-hidden"
        />

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border rounded-md text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 rounded-md text-sm font-medium text-white bg-main-green hover:bg-green-hover transition disabled:opacity-60"
          >
            {isLoading ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default NewPost;
