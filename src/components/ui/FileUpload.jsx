import { forwardRef, useImperativeHandle, useEffect, useRef, useState } from "react";
import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import DeleteModal from "@components/deleteModal/DeleteModal";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import { AiOutlineCloudUpload, AiOutlineDelete } from "react-icons/ai";
import { FiVideo } from "react-icons/fi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const FileUpload = forwardRef(
  (
    {
      value = null,
      onChange,
      multiple = false,
      maxFiles = 5,
      accept = "image/*,video/*",
      disabled = false,
      cloudName = import.meta.env.VITE_CLOUDINARY_CLOUDNAME,
      uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOADPRESET,
      className,
      innerClass,
      cropping = !multiple,
      croppingAspectRatio,
      croppingDefaultSelectionRatio = 1,
    },
    ref
  ) => {
    const getTypeFromUrl = (url) => {
      if (!url) return "image";
      const videoExtensions = [".mp4", ".webm", ".mov", ".avi"];
      const ext = url.substring(url.lastIndexOf(".")).toLowerCase();
      return videoExtensions.includes(ext) ? "video" : "image";
    };

    const isValidMediaItem = (item) => {
      if (!item) return false;
      if (typeof item === "string") return item.trim().length > 0;
      return item.url && item.url.trim().length > 0;
    };

    const [files, setFiles] = useState(() => {
      if (!value) return [];

      const items = Array.isArray(value) ? value : [value];
      return items
        .filter(isValidMediaItem)
        .map((item) =>
          typeof item === "string" ? { url: item, type: getTypeFromUrl(item) } : item
        );
    });

    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const cloudinaryRef = useRef();
    const widgetRef = useRef();
    const [isDeleting, setIsDeleting] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    useImperativeHandle(ref, () => ({
      open: () => {
        if (disabled) return;

        if (!multiple && files.length > 0) {
          if (window.confirm("Replace the current file?")) {
            widgetRef.current?.open();
          }
        } else if (multiple && files.length >= maxFiles) {
          alert(`Maximum ${maxFiles} files allowed`);
        } else {
          widgetRef.current?.open();
        }
      },
    }));

    const getFormatsFromAccept = (acceptString) => {
      if (!acceptString) return ["image"];
      const formats = [];

      if (acceptString.includes("image/*")) formats.push("jpg", "png", "gif", "webp");
      if (acceptString.includes("video/*")) formats.push("mp4", "webm", "mov", "avi");

      acceptString.split(",").forEach((type) => {
        const [category, format] = type.trim().split("/");
        if (category === "image" && format !== "*") {
          formats.push(format);
        } else if (category === "video" && format !== "*") {
          formats.push(format);
        }
      });

      return formats.length > 0 ? formats : ["jpg", "png"];
    };

    useEffect(() => {
      if (!window.cloudinary) return;

      cloudinaryRef.current = window.cloudinary;
      widgetRef.current = cloudinaryRef.current.createUploadWidget(
        {
          cloudName,
          uploadPreset,
          maxFiles: multiple ? maxFiles : 1,
          sources: ["local"],
          // sources: ["local", "url", "camera"],
          folder: "PropertifyNG",
          cropping: cropping,
          croppingAspectRatio: croppingAspectRatio,
          croppingDefaultSelectionRatio: croppingDefaultSelectionRatio,
          showAdvancedOptions: false,
          multiple,
          clientAllowedFormats: getFormatsFromAccept(accept),
          resourceType: "auto",
          maxImageFileSize: 15000000,
          maxVideoFileSize: 50000000,
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
              case "success": {
                const mediaItem = {
                  url: result.info.secure_url,
                  type: result.info.resource_type,
                  publicId: result.info.public_id,
                };

                setFiles((prev) => (multiple ? [...prev, mediaItem] : [mediaItem]));
                setUploadProgress(0);
                setIsUploading(false);
                break;
              }
              case "progress": {
                setIsUploading(true);
                setUploadProgress(
                  Math.floor((result.info.bytes_uploaded / result.info.bytes_total) * 100)
                );
                break;
              }
              case "close": {
                setIsUploading(false);
                break;
              }
              case "failure": {
                console.error("Upload failed:", result.info);
                setIsUploading(false);
                break;
              }
            }
          } else if (error) {
            console.error("Upload error:", error);
            setIsUploading(false);
          }
        }
      );
    }, [
      cloudName,
      uploadPreset,
      multiple,
      maxFiles,
      accept,
      cropping,
      croppingAspectRatio,
      croppingDefaultSelectionRatio,
    ]);

    useEffect(() => {
      if (onChange) {
        onChange(multiple ? files : files[0] || null);
      }
    }, [files, multiple, onChange]);

    const handleRemove = async (index) => {
      setOpenModal(true);
      setItemToDelete(files[index]);
    };

    const handleOpenWidget = () => {
      if (disabled) return;

      if (!multiple && files.length > 0) {
        if (window.confirm("Replace the current file?")) {
          widgetRef.current?.open();
        }
      } else if (multiple && files.length >= maxFiles) {
        alert(`Maximum ${maxFiles} files allowed`);
      } else {
        widgetRef.current?.open();
      }
    };

    // Confirm Deletion of Uploaded Media file

    const confirmDelete = async () => {
      setIsDeleting(true);
      try {
        if (itemToDelete) {
          const deleteDetails = {
            Model: "PropertyModel",
            url: itemToDelete.url || itemToDelete,
          };

          const res = await apiClient.post(endpoints.deleteMediaFileFromCloud, deleteDetails);

          if (res.data.statusCode === 200) {
            setFiles((prev) =>
              prev.filter((file) => file.url !== (itemToDelete.url || itemToDelete))
            );

            toast.success(res.data.message);
          }
        }
      } catch (error) {
        toast.error(ErrorFormatter(error));
      } finally {
        setOpenModal(false);
        setItemToDelete(null);
        setIsDeleting(false);
      }
    };

    const getAcceptDescription = (accept) => {
      if (!accept) return "JPG, PNG";
      if (accept.includes("video/*") && accept.includes("image/*")) return "Images & Videos";
      if (accept.includes("video/*")) return "Videos";
      return "Images";
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
          className={`relative border-2 border-dashed rounded-lg p-6 transition-all ${innerClass} ${
            disabled
              ? "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 cursor-not-allowed"
              : "bg-gray-50 dark:bg-gray-900 border-blue-400 hover:border-blue-500 dark:hover:border-blue-300 cursor-pointer"
          }`}
          onClick={handleOpenWidget}
          title="Upload Media"
        >
          <div className="flex flex-col items-center justify-center gap-3 text-center  ">
            <AiOutlineCloudUpload
              size={32}
              className={disabled ? "text-gray-400" : "text-blue-500 dark:text-blue-400"}
            />
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-200 text-[10px]">
                {multiple ? "Upload files" : "Upload a file"}
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                {getAcceptDescription(accept)} (max {accept.includes("video/*") ? "50MB" : "15MB"}{" "}
                each)
              </p>
              {isUploading && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {files.length > 0 ? (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              {multiple ? `Uploaded (${files.length}/${maxFiles})` : "Uploaded"}
            </h4>
            <div
              className={`grid gap-3 ${
                multiple ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4" : "grid-cols-1"
              }`}
            >
              {files.map((file, index) => (
                <div
                  key={index}
                  className="relative group rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 h-32"
                >
                  {file.type === "video" ? (
                    <div className="relative w-full h-full">
                      <video className="w-full h-full object-cover" muted playsInline>
                        <source src={file.url} type={`video/${file.url.split(".").pop()}`} />
                      </video>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FiVideo className="text-white text-2xl" />
                      </div>
                    </div>
                  ) : (
                    <img
                      src={file.url}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {!disabled && (
                    <Link
                      to={"#"}
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemove(index);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <AiOutlineDelete size={16} />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    );
  }
);

FileUpload.displayName = "FileUpload";

export default FileUpload;
