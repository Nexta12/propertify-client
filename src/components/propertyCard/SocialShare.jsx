import { useState } from "react";
import { FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";
import {
  FiShare2,
} from "react-icons/fi";

const SocialShare = () => {
  // Social Share handler

  const [showShareButtons, setShowShareButtons] = useState(false);
  const handleShareButtons = () => setShowShareButtons(!showShareButtons);

  const currentUrl = window.location.href;
  const shareText = encodeURIComponent("Check this out!");
  const encodedUrl = encodeURIComponent(currentUrl);

  const socialLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${shareText}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };

  const handleShare = (platform) => {
    const link = socialLinks[platform];
    if (link) window.open(link, "_blank");
  };

  return (
    <div className="">
      <button
        onClick={handleShareButtons}
        className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors flex items-center gap-x-1 text-sm"
      >
        <FiShare2 />
        Share
      </button>

      {/* Simple share options dropdown */}
      <div
        className={` flex gap-6 bg-white border r p-2 absolute right-0 bottom-full mb-2 w-48  rounded-md shadow-lg py-2  transform ${
          showShareButtons ? "translate-x-0" : "hidden"
        } transition-transform duration-300 ease-in-out `}
      >
       
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleShare("facebook")}
            className="p-2 text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
          >
            <FaFacebook />
          </button>
          <button
            onClick={() => handleShare("twitter")}
            className="p-2 text-blue-400 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
          >
            <FaTwitter />
          </button>
          <button
            onClick={() => handleShare("linkedin")}
            className="p-2 text-blue-700 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
          >
            <FaLinkedin />
          </button>
         
        </div>
      </div>
    </div>
  );
};

export default SocialShare;
