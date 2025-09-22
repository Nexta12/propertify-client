import { useEffect, useState } from "react";
import { AiOutlineCloudUpload, AiOutlineDelete, AiOutlineYoutube } from "react-icons/ai";
import { FiVideo } from "react-icons/fi";

import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

const VideoUpload = ({ value = null, onChange, disabled = false, className = "" }) => {
  const [video, setVideo] = useState(value || null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [googleToken, setGoogleToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Login with Google OAuth (YouTube requires this)
  const login = useGoogleLogin({
    scope: "https://www.googleapis.com/auth/youtube.upload",
    onSuccess: (tokenResponse) => {
      setGoogleToken(tokenResponse);
      setIsAuthenticated(true);
      localStorage.setItem("youtube_token", JSON.stringify(tokenResponse));
    },
    onError: (error) => {
      console.error("Login Failed:", error);
      alert("YouTube authentication failed");
    },
  });

  // Check for existing token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("youtube_token");
    if (storedToken) {
      const token = JSON.parse(storedToken);
      setGoogleToken(token);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    googleLogout();
    setGoogleToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem("youtube_token");
  };

  const handleUpload = async (file) => {
    if (!file) return;
    if (!isAuthenticated) {
      alert("Please authenticate with YouTube first");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Create metadata for the video
      const metadata = {
        snippet: {
          title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
          description: "Uploaded from my application",
        },
        status: {
          privacyStatus: "unlisted", // or "public"/"private"
        },
      };

      // Create FormData for the upload
      const formData = new FormData();
      formData.append(
        "metadata",
        new Blob([JSON.stringify(metadata)], { type: "application/json" })
      );
      formData.append("file", file);

      // Upload to YouTube
      const response = await axios.post(
        "https://www.googleapis.com/upload/youtube/v3/videos?part=snippet,status",
        formData,
        {
          headers: {
            Authorization: `Bearer ${googleToken.access_token}`,
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          },
        }
      );

      const youtubeId = response.data.id;

      // Save to your database
      await axios.post("/api/videos", {
        youtubeId,
        title: metadata.snippet.title,
      });

      setVideo({
        youtubeId,
        url: `https://www.youtube.com/watch?v=${youtubeId}`,
        embedUrl: `https://www.youtube.com/embed/${youtubeId}`,
      });

      onChange?.(youtubeId);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Video upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e) => {
    if (disabled) return;

    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    const validTypes = ["video/mp4", "video/quicktime", "video/x-msvideo", "video/x-matroska"];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a valid video file (MP4, MOV, AVI, MKV)");
      return;
    }

    if (file.size > 128 * 1024 * 1024) {
      // 128MB limit
      alert("Video file too large (max 128MB)");
      return;
    }

    if (video) {
      if (window.confirm("Replace the current video?")) {
        handleUpload(file);
      }
    } else {
      handleUpload(file);
    }
  };

  const handleRemove = () => {
    setVideo(null);
    onChange?.(null);
  };

  return (
    <div className={`youtube-upload-container ${className}`}>
      {!isAuthenticated ? (
        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
          <AiOutlineYoutube size={32} className="text-red-500 mb-2" />
          <p className="text-sm text-gray-600 mb-4">
            Connect your YouTube account to upload videos
          </p>
          <button
            onClick={login}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <AiOutlineYoutube /> Connect YouTube
          </button>
        </div>
      ) : (
        <>
          {/* Upload area */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-6 transition-all ${
              disabled
                ? "bg-gray-100 border-gray-300 cursor-not-allowed"
                : "bg-gray-50 border-red-400 hover:border-red-500 cursor-pointer"
            }`}
          >
            <label className="flex flex-col items-center justify-center gap-3 text-center cursor-pointer">
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={disabled || isUploading}
              />
              <AiOutlineCloudUpload
                size={32}
                className={disabled ? "text-gray-400" : "text-red-500"}
              />
              <div>
                <p className="font-medium text-gray-700">
                  {video ? "Replace video" : "Upload a video"}
                </p>
                <p className="text-xs text-gray-500 mt-1">MP4, MOV, AVI, or MKV (max 128MB)</p>
                {isUploading && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-600 h-2 rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Uploading to YouTube... {uploadProgress}%
                    </p>
                  </div>
                )}
              </div>
            </label>
          </div>

          {/* Authentication status */}
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-green-600 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Connected to YouTube
            </span>
            <button onClick={handleLogout} className="text-red-500 hover:text-red-700 text-xs">
              Disconnect
            </button>
          </div>

          {/* Preview area */}
          {video && (
            <div className="mt-4">
              <div className="relative group rounded-md overflow-hidden border border-gray-200">
                <div className="aspect-w-16 aspect-h-9 bg-black">
                  <iframe
                    src={video.embedUrl}
                    className="w-full h-64"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                {!disabled && (
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <AiOutlineDelete size={16} />
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-700 mt-2 truncate">{video.url}</p>
            </div>
          )}

          {!video && !isUploading && (
            <div className="mt-4 flex items-center justify-center gap-2 text-gray-400">
              <FiVideo size={18} />
              <span className="text-sm">No video uploaded yet</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VideoUpload;
