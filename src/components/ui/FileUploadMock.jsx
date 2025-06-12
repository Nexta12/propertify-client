import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import DeleteModal from "@components/deleteModal/DeleteModal";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import { useEffect, useRef, useState } from "react";
import { AiOutlineCloudUpload, AiOutlineDelete } from "react-icons/ai";
import { FiImage } from "react-icons/fi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const FileUpload = ({
  value = [],
  onChange,
  multiple = false,
  maxFiles = 5,
  accept = "image/*",
  disabled = false,
  cloudName = "dnkrd75xj",
  uploadPreset = "q7qcabom",
  className = "",
  cropping = !multiple,
  croppingAspectRatio,
  croppingDefaultSelectionRatio = 1,
}) => {
  const [files, setFiles] = useState(
    // Array.isArray(value) ? value : value ? [value] : []
    () => {
      // Handle both string URLs and File objects
      if (Array.isArray(value)) {
        return value;
      } else if (value) {
        return [value];
      }
      return [];
    }
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const cloudinaryRef = useRef();
  const widgetRef = useRef();

  const [isDeleting, setIsDeleting] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    if (!window.cloudinary) return;

    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName,
        uploadPreset,
        maxFiles: multiple ? maxFiles : 1,
        sources: ["local", "url", "camera"],
        folder: "PropertifyNG",
        // Cropping configuration
        cropping: cropping,
        croppingAspectRatio: croppingAspectRatio,
        croppingDefaultSelectionRatio: croppingDefaultSelectionRatio,
        showAdvancedOptions: false,
        multiple,
        // Now properly using the accept prop to restrict file types
        clientAllowedFormats: getFormatsFromAccept(accept),
        maxImageFileSize: 15000000, // 15MB
        styles: {
          palette: {
            window: "#FFFFFF",
            windowBorder: "#90A0B3",
            tabIcon: "#0078FF",
            menuIcons: "#5A616A",
            textDark: "#000000",
            textLight: "#FFFFFF",
            link: "#0078FF",
            action: "#FF620C",
            inactiveTabIcon: "#0E2F5A",
            error: "#F44235",
            inProgress: "#0078FF",
            complete: "#20B832",
            sourceBg: "#E4EBF1",
          },
        },
      },
      (error, result) => {
        if (!error && result && result.event) {
          switch (result.event) {
            case "success":
              if (multiple) {
                setFiles((prev) => [...prev, result.info.secure_url]);
              } else {
                setFiles([result.info.secure_url]);
              }
              setUploadProgress(0);
              setIsUploading(false);
              break;
            case "progress":
              setIsUploading(true);
              setUploadProgress(
                Math.floor(
                  (result.info.bytes_uploaded / result.info.bytes_total) * 100
                )
              );
              break;
            case "close":
              setIsUploading(false);
              break;
            case "failure":
              console.error("Upload failed:", result.info);
              setIsUploading(false);
              break;
          }
        } else if (error) {
          console.error("Upload error:", error);
          setIsUploading(false);
        }
      }
    );
  }, [cloudName, uploadPreset]);


  // Helper function to convert accept prop to Cloudinary formats
  const getFormatsFromAccept = (acceptString) => {
    if (!acceptString) return ["image"]; // Default to images if not specified

    const formats = [];
    if (acceptString.includes("image/*")) {
      formats.push("image");
    } else {
      // Parse specific image types (e.g., "image/png,image/jpeg")
      acceptString.split(",").forEach((type) => {
        const format = type.split("/")[1];
        if (format && format !== "*") {
          formats.push(format);
        }
      });
    }

    return formats.length > 0 ? formats : ["image"];
  };

  useEffect(() => {
    if (onChange) {
      onChange(multiple ? files : files[0] || null);
    }
  }, [files, multiple]);

  const handleRemove = async (index) => {
    // Open confirm dialog or directly delete
    setOpenModal(true);
    setItemToDelete(files[index]); // Extract the main file clicked to the deleted
  };

  const handleOpenWidget = () => {
    if (disabled) return;

    if (!multiple && files.length > 0) {
      if (window.confirm("Replace the current image?")) {
        widgetRef.current?.open();
      }
    } else if (multiple && files.length >= maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
    } else {
      widgetRef.current?.open();
    }
  };

  const confirmDelete = async () => {
     setIsDeleting(true)
    if (itemToDelete) {
      try {
        const deleteDetails = {
          Model: "PropertyModel",
          url: itemToDelete,
        };
        // Make an API call to delete the item
        await apiClient.post(endpoints.updateCloudinary, deleteDetails);

        setOpenModal(false); // Close the modal
        setItemToDelete(null); // Reset the item to delete
        toast.success("File Deleted..");

        const indexToDelete = files.indexOf(itemToDelete);

        // Update local state
        const newFiles = files.filter((_, i) => i !== indexToDelete);
        setFiles(newFiles);
        onChange?.(multiple ? newFiles : newFiles[0] || null);

        setFiles((prev) => {
          const newFiles = prev.filter((_, i) => i !== indexToDelete);
          onChange?.(multiple ? newFiles : newFiles[0] || null); // Call onChange directly
          return newFiles;
        });
      } catch (error) {
        toast.error(ErrorFormatter(error));
        setOpenModal(false); // Close the modal
        setItemToDelete(null); // Reset the item to delete
        setIsDeleting(false)
      }
    }
  };

  return (
    <div className={`file-upload-container ${className}`}>
      <DeleteModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={confirmDelete}
        message="Are you Sure You want to this file ?"
        isDeleting={isDeleting}
      />
      {/* Upload area with proper accept attribute */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-all ${
          disabled
            ? "bg-gray-100 border-gray-300 cursor-not-allowed"
            : "bg-gray-50 border-blue-400 hover:border-blue-500 cursor-pointer"
        }`}
        onClick={handleOpenWidget}
      >
        <div className="flex flex-col items-center justify-center gap-3 text-center ">
          <AiOutlineCloudUpload
            size={32}
            className={disabled ? "text-gray-400" : "text-blue-500"}
          />
          <div>
            <p className="font-medium text-gray-700 text-[10px]">
              {multiple ? "Upload images" : "Upload an image"}
            </p>
            <p className="text-[10px] text-gray-500 mt-1">
              {getAcceptDescription(accept)} (max 5MB each)
            </p>
            {isUploading && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview area */}
      {files.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            {multiple ? `Uploaded (${files.length}/${maxFiles})` : "Uploaded"}
          </h4>
          <div
            className={`grid gap-3 ${
              multiple
                ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
            {files.map((file, index) => (
              <div
                key={index}
                className="relative group rounded-md overflow-hidden border border-gray-200 h-32"
              >
                <img
                  src={file}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {!disabled && (
                  <Link
                    to={"#"}
                    onClick={(e) => handleRemove(index, e)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <AiOutlineDelete size={16} />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {multiple && files.length === 0 && (
        <div className="mt-4 flex items-center justify-center gap-2 text-gray-400">
          <FiImage size={18} />
          <span className="text-sm">No files uploaded yet</span>
        </div>
      )}
    </div>
  );
};

// Helper function to generate user-friendly accept description
const getAcceptDescription = (accept) => {
  if (!accept || accept === "image/*") return "JPG, PNG, GIF";
  if (accept.includes("image/png")) return "PNG";
  if (accept.includes("image/jpeg")) return "JPG";
  if (accept.includes("image/gif")) return "GIF";
  return "Selected file types";
};

export default FileUpload;