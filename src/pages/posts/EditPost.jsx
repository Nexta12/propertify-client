
import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import DOMPurify from "dompurify";
import EnhancedTextarea from "@components/ui/EnhancedTextarea";
import FileUpload from "@components/ui/FileUpload";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { AiOutlineDelete } from "react-icons/ai";
import DeleteModal from "@components/deleteModal/DeleteModal";
import { paths } from "@routes/paths";
import { handleGoBack } from "@utils/helper";
import useAuthStore from "@store/authStore";
import HandleGoBackBtn from "@components/goBackBtn/HandleGoBackBtn";

const EditPost = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [hasUploadedImages, setHasUploadedImages] = useState(false);

  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    _id: "",
    description: "",
    media: [{}],
    existingImages: [],
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await apiClient.get(`${endpoints.fetchProperty}/${slug}`);
        const propertyData = response.data.data;
        setFormData({
          ...propertyData,
          existingImages: propertyData.media || [],
          media: propertyData.media || [],
        });
      } catch (error) {
        toast.error(ErrorFormatter(error) || "An Error Occurred");
      }
    };

    if (slug) fetchProperty();
  }, [slug]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (name, files) => {
    setFormData((prev) => {
      const existingUrls = prev.existingImages.map((img) =>
        typeof img === "string" ? img : img.url || URL.createObjectURL(img)
      );

      const newFiles = files.filter((file) => {
        const fileUrl =
          typeof file === "string" ? file : file.url || URL.createObjectURL(file);
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
        setOpenModal(false);
        setItemToDelete(null);
      } catch (error) {
        toast.error(ErrorFormatter(error));
        setOpenModal(false);
        setItemToDelete(null);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const submitData = { ...formData, existingImages: undefined };

    try {
      const res = await apiClient.put(`${endpoints.editProperty}/${slug}`, {
        ...submitData,
        postType: "post",
        description: DOMPurify.sanitize(formData.description, {
          ALLOWED_TAGS: [],
          ALLOWED_ATTR: [],
          KEEP_CONTENT: true,
        }),
      });

      toast.success("Listing Updated successfully");

      if (res.data.data.slug !== slug) {
        navigate(`${paths.protected}/properties/edit/${res.data.data.slug}`, { replace: true });
      }
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
    <section className="max-w-7xl mx-auto rounded-md mb-8">
      <DeleteModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this file?"
        isDeleting={isDeleting}
      />

      <HandleGoBackBtn />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-1">Edit Post</h1>
        <p className="text-sm text-gray-500">Update your listing with accurate details.</p>
      </div>

      <form className="space-y-8" onSubmit={handleSubmit}>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 border-b pb-3">Detailed Description</h3>
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

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 border-b pb-3">Media</h3>

          {formData?.existingImages?.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Existing Media</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {formData.existingImages.map((media, index) => {
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
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
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

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Images & Videos (max 4)</label>
            <FileUpload
              value={formData.media}
              onChange={(files) => handleFileUpload("media", files)}
              multiple
              maxFiles={4}
              accept="image/*,video/*"
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-green-500 transition"
            />
            <p className="mt-2 text-xs text-gray-500">Upload high-quality images or videos to attract attention.</p>
          </div>
        </div>

        <div className="flex flex-col-reverse md:flex-row gap-4 justify-end pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-md"
          >
            {isLoading ? "Please Wait..." : "Update Post"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default EditPost;

