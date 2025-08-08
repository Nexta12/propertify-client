import { FiPhone, FiMail } from "react-icons/fi";
import { BsWhatsapp } from "react-icons/bs";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import b2 from "@assets/img/b2.jpg";
import { formatTitleCase } from "@utils/helper";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";

const ProfessionalCard = ({ user }) => {
  const [userPosts, setUserPosts] = useState(0);

  const Website = import.meta.env.VITE_COMPANY_WEBSITE;

  useEffect(() => {
    const fetchUserTotalPosts = async () => {
      try {
        const response = await apiClient.get(
          `${endpoints.fetchUserProperties}/${user?.slug}?count=true`
        );

        setUserPosts(response.data.data);
      } catch (error) {
        toast.error(ErrorFormatter(error));
      }
    };

    if (user?.slug) fetchUserTotalPosts();
  }, [user.slug]);

  return (
   <div className="bg-white dark:border dark:border-gray-700 dark:bg-gray-900 mb-6 rounded-2xl overflow-hidden shadow-sm w-full">
  <div className="flex flex-col lg:flex-row">
    {/* Left: Profile Image */}
    <div className="lg:w-1/2 w-full h-auto relative">
      <img
        src={user?.profilePic || b2}
        alt={`${user.firstName} ${user.lastName}`}
        className="object-cover w-full h-full"
      />
    </div>

    {/* Right: Text Content */}
    <div className="lg:w-1/2 w-full p-6 flex flex-col justify-between gap-4 text-primary-text dark:text-gray-100">
      {/* Header Info */}
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          {user?.title} {user?.firstName} {user?.lastName}
          {user.isVerifiedUser && (
            <RiVerifiedBadgeFill className="text-blue-500 text-xl" />
          )}
        </h2>

        <p className="text-secondary text-sm mt-1 dark:text-gray-400">
          {formatTitleCase(user.profession)} • {user.city}, {user.state}
        </p>

        <p className="text-sm text-tertiary mt-1 dark:text-gray-400">
          Joined {new Date(user.createdAt).toLocaleDateString()}
        </p>

        {user?.companyDetails?.companyName && (
          <p className="mt-2 text-sm text-primary font-medium capitalize dark:text-white">
            {user.companyDetails.companyName}
          </p>
        )}
      </div>

      {/* Contact Buttons */}
      <div className="flex flex-wrap items-center gap-3 mt-4">
        <a
          href={`https://wa.me/${user?.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-white bg-main-green hover:bg-green-hover px-3 py-2 rounded-full text-[12px]"
        >
          <BsWhatsapp /> WhatsApp
        </a>
        <a
          href={`tel:${user.phone}`}
          className="flex items-center gap-1 text-white bg-tertiary hover:bg-primary px-3 py-2 rounded-full text-[12px]"
        >
          <FiPhone /> Call
        </a>
        <a
          href={`mailto:${user.email}`}
          className="flex items-center gap-1 text-white bg-orange hover:opacity-90 px-4 py-2 rounded-full text-[12px]"
        >
          <FiMail /> Email
        </a>
      </div>
    </div>
  </div>

  {/* Bottom Description and Footer */}
  <div className="p-6 border-t mt-2 border-gray-200 dark:border-gray-700">
    <p className="text-sm text-secondary dark:text-gray-300 whitespace-pre-line">
      {user?.description}
    </p>

    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-secondary dark:text-gray-400 mt-6 gap-2">
      <span>
        Website:{" "}
        <a
          href={user.companyDetails?.companyWebsite || Website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-main-green hover:underline break-all"
        >
          {user.companyDetails?.companyWebsite || Website}
        </a>
      </span>

      <span className="text-primary-text dark:text-white font-semibold">
        Posts: {userPosts}
      </span>
    </div>
  </div>
</div>

  );
};

export default ProfessionalCard;
