
import { useState } from 'react';
import { FiFacebook, FiLinkedin, FiMail, FiShare2, FiTwitter } from 'react-icons/fi'

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
      gmail: `mailto:?subject=${encodeURIComponent(
        "Interesting Link"
      )}&body=${shareText}%0A${encodedUrl}`,
      // whatsapp: `https://wa.me/?text=${shareText}%20${encodedUrl}`,
    };

    const handleShare = (platform) => {
      const link = socialLinks[platform];
      if (link) window.open(link, "_blank");
    };




  return (
     <div className="">
              <button  onClick={handleShareButtons} className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors flex items-center gap-x-1 text-sm">
                <FiShare2 />Share
              </button>

              {/* Simple share options dropdown */}
              <div className={` flex  gap-6 bg-white border rounded shadow-md p-2 absolute left-[18%] -top-1 z-10  transform ${
          showShareButtons ? "translate-x-0" : "hidden"
        } transition-transform duration-300 ease-in-out `}>
                <button onClick={() => handleShare("facebook")}>
                  <FiFacebook className="text-blue-500 text-xl" />
                </button>
                <button onClick={() => handleShare("twitter")}>
                 <FiTwitter className="text-neutral-500 text-xl" />
                </button>
                <button onClick={() => handleShare("linkedin")}>
                 <FiLinkedin className="text-blue-500 text-xl" />
                </button>
                <button onClick={() => handleShare("gmail")}><FiMail className="text-neutral-500 text-xl" title='Email' /></button>
              </div>
              </div>
  )
}

export default SocialShare