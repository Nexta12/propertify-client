import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import DOMPurify from "dompurify";
import FileUpload from "@components/ui/FileUpload";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { AiOutlineDelete } from "react-icons/ai";
import DeleteModal from "@components/deleteModal/DeleteModal";
import { handleGoBack } from "@utils/helper";
import useAuthStore from "@store/authStore";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import Avater from "@assets/img/avater.png";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { paths } from "@routes/paths";

const EditPost = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [hasUploadedImages, setHasUploadedImages] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    _id: "",
    description: "",
    media: [],
    existingImages: [],
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await apiClient.get(`${endpoints.fetchProperty}/${slug}`);
        const post = response.data.data;
        setFormData({
          ...post,
          existingImages: post.media || [],
          media: post.media || [],
        });
      } catch (error) {
        toast.error(ErrorFormatter(error) || "An error occurred");
      }
    };
    if (slug) fetchPost();
  }, [slug]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmojiSelect = (emoji) => {
    setFormData((prev) => ({
      ...prev,
      description: prev.description + emoji.native,
    }));
    setShowEmojiPicker(false);
  };

  const handleFileUpload = (name, files) => {
    setFormData((prev) => {
      const existingUrls = prev.existingImages.map((img) =>
        typeof img === "string" ? img : img.url
      );

      const newFiles = files.filter((file) => {
        const fileUrl = typeof file === "string" ? file : file.url;
        return !existingUrls.includes(fileUrl);
      });

      if (newFiles.length > 0) setHasUploadedImages(true);

      const combined = [...prev.media, ...newFiles].slice(0, 10);
      return { ...prev, [name]: combined };
    });
  };

  const handleRemoveImage = async (imageUrl) => {
    setOpenModal(true);
    setItemToDelete(imageUrl);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    if (itemToDelete) {
      try {
        await apiClient.post(endpoints.deleteMediaFileFromCloud, {
          url: itemToDelete,
          propertyId: formData._id,
        });

        setFormData((prev) => ({
          ...prev,
          media: prev.media.filter((img) => img.url !== itemToDelete),
          existingImages: prev.existingImages.filter((img) => img.url !== itemToDelete),
        }));

        toast.success("File Deleted.");
      } catch (error) {
        toast.error(ErrorFormatter(error));
      } finally {
        setOpenModal(false);
        setItemToDelete(null);
        setIsDeleting(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const submitData = { ...formData, existingImages: undefined };

    try {
      await apiClient.put(`${endpoints.editProperty}/${slug}`, {
        ...submitData,
        postType: "post",
        description: DOMPurify.sanitize(formData.description, {
          ALLOWED_TAGS: [],
          ALLOWED_ATTR: [],
          KEEP_CONTENT: true,
        }),
      });

      toast.success("Post updated successfully");
      setTimeout(() => {
        navigate(paths.feed);
      }, 2000);
    } catch (error) {
      toast.error(ErrorFormatter(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (hasUploadedImages && formData.media.length > 0) {
      setOpenModal(true);
    } else {
      handleGoBack(navigate, user);
    }
  };

  return (
    <section className="mx-auto mb-8">
      <DeleteModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this file?"
        isDeleting={isDeleting}
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
            <span className="text-xs text-gray-500">Editing your post</span>
          </div>
        </div>

        {/* Post Content */}
        <div>
          <textarea
            name="description"
            placeholder="Update your post..."
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

        {/* Existing Media */}
        {formData?.existingImages?.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {formData.existingImages.map((media, idx) => {
              const isVideo = media.url?.match(/\.(mp4|webm|ogg)$/i);
              return (
                <div key={`media-${idx}`} className="relative group rounded-md overflow-hidden">
                  {isVideo ? (
                    <video src={media.url} controls className="w-full h-32 object-cover" />
                  ) : (
                    <img src={media.url} alt="" className="w-full h-32 object-cover" />
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(media.url)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <AiOutlineDelete size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

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
            {isLoading ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default EditPost;
