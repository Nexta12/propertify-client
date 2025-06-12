
import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import DeleteModal from "@components/deleteModal/DeleteModal";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { AiOutlineCloudUpload, AiOutlineDelete } from "react-icons/ai";
import { FiImage } from "react-icons/fi";
import { toast } from "react-toastify";

const FileUpload = forwardRef(({
  value = [],
  onChange,
  multiple = false,
  maxFiles = 5,
  accept = "image/*",
  disabled = false,
  cloudName = import.meta.VITE_CLOUDINARY_CLOUDNAME,
  uploadPreset = import.meta.VITE_CLOUDINARY_UPLOADPRESET,
  className = "",
  cropping = !multiple,
  croppingAspectRatio,
  croppingDefaultSelectionRatio = 1,
}, ref) => {
  const [files, setFiles] = useState(() => {
    if (Array.isArray(value)) return value;
    else if (value) return [value];
    return [];
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const cloudinaryRef = useRef();
  const widgetRef = useRef();

  // 👇 Expose `handleOpenWidget` to parent via ref
  useImperativeHandle(ref, () => ({
    open: handleOpenWidget,
  }));

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
        cropping,
        croppingAspectRatio,
        croppingDefaultSelectionRatio,
        showAdvancedOptions: false,
        multiple,
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
  const getFormatsFromAccept = (acceptString) => {
    if (!acceptString) return ["image"];
    const formats = [];
    if (acceptString.includes("image/*")) formats.push("image");
    else {
      acceptString.split(",").forEach((type) => {
        const format = type.split("/")[1];
        if (format && format !== "*") formats.push(format);
      });
    }
    return formats.length > 0 ? formats : ["image"];
  };

  useEffect(() => {
    if (onChange) onChange(multiple ? files : files[0] || null);
  }, [files]);

  const handleRemove = (index) => {
    setOpenModal(true);
    setItemToDelete(files[index]);
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
    setIsDeleting(true);
    if (itemToDelete) {
      try {
        await apiClient.post(endpoints.updateCloudinary, {
          Model: "PropertyModel",
          url: itemToDelete,
        });

        toast.success("File deleted");
        const indexToDelete = files.indexOf(itemToDelete);
        const newFiles = files.filter((_, i) => i !== indexToDelete);
        setFiles(newFiles);
        onChange?.(multiple ? newFiles : newFiles[0] || null);

        setOpenModal(false);
        setItemToDelete(null);
      } catch (error) {
        toast.error(ErrorFormatter(error));
        setOpenModal(false);
        setItemToDelete(null);
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className={`file-upload-container ${className}`}>
      <DeleteModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this file?"
        isDeleting={isDeleting}
      />
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-all ${
          disabled
            ? "bg-gray-100 border-gray-300 cursor-not-allowed"
            : "bg-gray-50 border-blue-400 hover:border-blue-500 cursor-pointer"
        }`}
        onClick={handleOpenWidget}
      >
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <AiOutlineCloudUpload size={32} className={disabled ? "text-gray-400" : "text-blue-500"} />
          <p className="font-medium text-gray-700 text-[10px]">
            {multiple ? "Upload images" : "Upload an image"}
          </p>
          <p className="text-[10px] text-gray-500 mt-1">
            {getAcceptDescription(accept)} (max 5MB each)
          </p>
          {isUploading && (
            <div className="mt-2 w-full">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Uploading... {uploadProgress}%</p>
            </div>
          )}
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            {multiple ? `Uploaded (${files.length}/${maxFiles})` : "Uploaded"}
          </h4>
          <div className={`grid gap-3 ${multiple ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4" : "grid-cols-1"}`}>
            {files.map((file, index) => (
              <div key={index} className="relative group rounded-md overflow-hidden border border-gray-200 h-32">
                <img src={file} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                {!disabled && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemove(index);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <AiOutlineDelete size={16} />
                  </button>
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
});

// Accept description generator
const getAcceptDescription = (accept) => {
  if (!accept || accept === "image/*") return "JPG, PNG, GIF";
  if (accept.includes("image/png")) return "PNG";
  if (accept.includes("image/jpeg")) return "JPG";
  if (accept.includes("image/gif")) return "GIF";
  return "Selected file types";
};

export default FileUpload;

