import { useEffect, useState } from "react";
import {
  FiMapPin,
  FiMail,
  FiPhone,
  FiMessageSquare,
  FiGlobe,
  FiUser,
} from "react-icons/fi";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import { toast } from "react-toastify";
import { DateFormatter, formatTitleCase } from "@utils/helper";
import { formatDistanceToNow } from "date-fns";
import Avater from "@assets/img/avater.png";
import Default from "@assets/img/p1.jpg";

const UserProfileCard = ({ currentUser }) => {
  const [propertyData, setPropertyData] = useState([]);

  useEffect(() => {
    const fetchUProperties = async () => {
      try {
        const res = await apiClient.get(
          `${endpoints.fetchUserProperties}/${currentUser.slug}`
        );
        setPropertyData(res.data.data);
      } catch (error) {
        toast.error(ErrorFormatter(error));
      }
    };
    fetchUProperties();
  }, [currentUser?.slug]);

  return (
    <div className=" mx-auto bg-white dark:bg-gray-800 dark:shadow-gray-700 max-h-[30rem] overflow-y-auto">
      <div className="p-6 flex flex-col md:flex-row items-center justify-center md:justify-start md:items-start space-x-4">
        <img
          className="h-24 w-24 rounded-full border-4 border-white dark:border-gray-800 shadow-md"
          src={currentUser?.profilePic || Avater}
          alt={currentUser.firstName}
        />
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg md:text-xl font-bold text-primary-text dark:text-white">
              {currentUser.title} {currentUser.firstName} {currentUser.lastName}{" "}
            </h2>
            <span className="">
              {currentUser.isVerifiedUser && (
                <RiVerifiedBadgeFill className="text-blue-500 dark:text-blue-400" />
              )}
            </span>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                currentUser.accountStatus === "active"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : currentUser.userStatus === "suspended"
                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  : currentUser.userStatus === "inactive"
                  ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  : ""
              }`}
            >
              {currentUser.accountStatus}
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            {formatTitleCase(currentUser.profession)}
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center mt-1">
            <FiMapPin className="h-4 w-4 mr-1" />
            {currentUser.city}, {currentUser.state}
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center mt-1">
            <FiUser className="h-4 w-4 mr-1" />
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                currentUser.userStatus === "New"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
              }`}
            >
              {currentUser.userStatus} user
            </span>
          </p>
        </div>
      </div>
      <div className="px-6 pb-4">
        <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-sm whitespace-pre-line">
          {currentUser.description}
        </p>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Contact Information
        </h3>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <FiMail className="h-5 w-5 mr-2 text-gray-400 dark:text-gray-500" />
            {currentUser.email}
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <FiPhone className="h-5 w-5 mr-2 text-gray-400 dark:text-gray-500" />
            {currentUser?.phone}
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <FiMessageSquare className="h-5 w-5 mr-2 text-green-500 dark:text-green-400" />
            {currentUser?.whatsapp} (WhatsApp)
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-700">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Company Information
        </h3>
        <div className="flex items-start space-x-3">
          <img
            className="h-12 w-12 rounded-md object-cover border border-gray-200 dark:border-gray-600"
            src={currentUser?.companyDetails?.companyLogo || Default}
            alt={currentUser?.companyDetails?.companyName || "Company logo"}
          />
          <div>
            <h4 className="font-medium text-gray-800 dark:text-white capitalize">
              {currentUser?.companyDetails?.companyName}
            </h4>
            <a
              href={currentUser?.companyDetails?.companyWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 text-sm hover:underline lowercase flex items-center"
            >
              <FiGlobe className="h-4 w-4 mr-1" />
              {currentUser?.companyDetails?.companyWebsite}{" "}
            </a>
            <div className="mt-1 space-y-1 text-sm text-gray-600 dark:text-gray-300">
              <p className="flex items-center capitalize">
                <FiMapPin className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" />
                {currentUser?.companyDetails?.companyAddress}
              </p>
              <p className="flex items-center">
                <FiMail className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" />
                {currentUser?.companyDetails?.companyEmail}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="grid grid-cols-3 divide-x divide-gray-200 dark:divide-gray-700 text-center w-full overflow-x-auto">
          <div className="px-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Posts
            </p>
            <p className="font-semibold text-gray-800 dark:text-white">
              {propertyData.length || 0}
            </p>
          </div>
          <div className="px-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last Login
            </p>
            <p className="font-semibold text-gray-800 dark:text-white capitalize text-[12px] ">
               {currentUser.lastLogin ? formatDistanceToNow(new Date(currentUser.lastLogin), { addSuffix: true }) : "NA"}
            </p>
          </div>
          <div className="px-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">Joined</p>
            <p className="font-semibold text-gray-800 dark:text-white text-[12px]">
              {DateFormatter(currentUser.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
