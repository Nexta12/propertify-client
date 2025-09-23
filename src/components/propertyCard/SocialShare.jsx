import { useState } from "react";
import { FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";

const SocialShare = ({ content }) => {
  // Proper URL for the property
  const contentUrl = `${import.meta.env.VITE_COMPANY_WEBSITE}/properties/${content.slug}`;

  const [showShareButtons, setShowShareButtons] = useState(false);
  const handleShareButtons = () => setShowShareButtons(!showShareButtons);

  const shareText = encodeURIComponent("Check this out!");
  const encodedUrl = encodeURIComponent(contentUrl);

  const socialLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${shareText}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };

  const handleShare = (platform) => {
    const link = socialLinks[platform];
    if (link) window.open(link, "_blank", "noopener,noreferrer,width=600,height=400");
  };

  return (
    <div className="relative">
      <button
        onClick={handleShareButtons}
        className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 rounded-full hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-x-1 text-sm"
      >
        <FiShare2 />
        Share
      </button>

      {showShareButtons && (
        <div className="flex gap-6 bg-white dark:bg-gray-800 dark:border-gray-600 border p-2 absolute right-0 bottom-full mb-2 w-48 rounded-md shadow-lg py-2">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleShare("facebook")}
              className="p-2 text-blue-600 bg-blue-50 dark:bg-blue-900 dark:text-blue-300 rounded-full hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
            >
              <FaFacebook />
            </button>
            <button
              onClick={() => handleShare("twitter")}
              className="p-2 text-blue-400 bg-blue-50 dark:bg-blue-900 dark:text-blue-300 rounded-full hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
            >
              <FaTwitter />
            </button>
            <button
              onClick={() => handleShare("linkedin")}
              className="p-2 text-blue-700 bg-blue-50 dark:bg-blue-900 dark:text-blue-300 rounded-full hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
            >
              <FaLinkedin />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialShare;
