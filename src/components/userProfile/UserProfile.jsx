import { useCallback, useEffect, useState } from "react";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { Link, useParams } from "react-router-dom";
import { paths } from "@routes/paths";
import { FaPhoneAlt, FaEnvelope, FaBriefcase, FaBusinessTime } from "react-icons/fa";
import { toast } from "react-toastify";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import { FaLocationPin } from "react-icons/fa6";
import { formatTitleCase } from "@utils/helper";
import { formatDistanceToNow } from "date-fns";
import useAuthStore from "@store/authStore";
import HandleGoBackBtn from "@components/goBackBtn/HandleGoBackBtn";
import { FiMail } from "react-icons/fi";
import Avater from "@assets/img/avater.png";
import truncateHtml from "html-truncate";

const UserProfile = () => {
  const { slug } = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const [userProperties, setUserProperties] = useState([]);
  const { user } = useAuthStore();

  const fetchUserData = useCallback(async () => {
    try {
      const [userRes, propertiesRes] = await Promise.all([
        apiClient.get(`${endpoints.getUserDetails}/${slug}`),
        apiClient.get(`${endpoints.fetchUserProperties}/${slug}`),
      ]);

      setUserDetails(userRes.data.data);
      setUserProperties(propertiesRes.data.data.data);
    } catch (error) {
      toast.error(ErrorFormatter(error));
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      fetchUserData();
    }
  }, [slug, fetchUserData]);

  return (
    <>
      {user && <HandleGoBackBtn />}

      <div className="bg-white selection-container dark:bg-gray-900 rounded-xl overflow-hidden shadow-md dark:shadow-lg">
        {/* Cover Image */}
        <div className="relative h-48 dark:bg-gray-700 bg-blue-400">
          {userDetails?.coverPic && (
            <img src={userDetails?.coverPic} alt="" className="w-full h-full object-cover" />
          )}
          {/* Profile Picture */}
          <div className="absolute -bottom-12 left-5">
            <img
              src={userDetails?.profilePic || Avater}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-900 object-cover shadow-md"
            />
          </div>

          {user?.slug !== slug && (
            <div className="flex items-center justify-between w-full pr-4">
              <span></span>
              <div className="flex items-center gap-4">
                <Link to={`${paths.protected}/messages/dm/${slug}`}>
                  <FiMail className="text-primary-text dark:text-gray-200 text-2xl" />
                </Link>
                <button className="mt-4 px-4 py-2 bg-main-green text-white text-sm rounded-lg shadow hover:bg-green-hover">
                  Add to Contacts
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="mt-16 px-5 pb-5">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {userDetails?.firstName && userDetails?.lastName
                ? `${userDetails.firstName} ${userDetails.lastName}`
                : "Welcome"}
            </h2>
            {userDetails?.isVerifiedUser && (
              <RiVerifiedBadgeFill className="text-blue-500 text-xl" />
            )}
          </div>

          <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 capitalize">
            {userDetails?.companyDetails?.companyName}
            <Link to={userDetails?.companyDetails?.companyWebsite} target="_blank">
              <span className="text-[14px] mx-4 text-blue-500 lowercase">
                {userDetails?.companyDetails?.companyWebsite}
              </span>
            </Link>
          </p>

          <div
            className="prose prose-lg text-[15px] dark:prose-invert max-w-none mt-3 text-gray-700 dark:text-gray-200 text-sm whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: userDetails?.description || "No bio available." }}
          />

          <div className="flex items-center gap-4 mt-3 text-sm text-gray-600 dark:text-gray-300">
            {userDetails?.phone && (
              <div className="flex items-center gap-1">
                <FaPhoneAlt /> <span>{userDetails?.phone}</span>
              </div>
            )}
            {userDetails?.email && (
              <div className="flex items-center gap-1">
                <FaEnvelope /> <span>{userDetails?.email}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4 mt-3 text-sm text-gray-600 dark:text-gray-300">
            {userDetails?.city && (
              <div className="flex items-center gap-1">
                <FaLocationPin />{" "}
                <span>
                  {userDetails?.city} {userDetails?.state}
                </span>
              </div>
            )}
            {userDetails?.profession && (
              <div className="flex items-center gap-1">
                <FaBriefcase /> <span>{formatTitleCase(userDetails?.profession)}</span>
              </div>
            )}
            {userDetails?.lastLogin && (
              <div className="flex items-center gap-1 capitalize">
                <FaBusinessTime /> Last Login:{" "}
                <span>{formatDistanceToNow(userDetails?.lastLogin)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Properties Grid */}
        <div className="px-5 pb-5">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
            Posts & Properties
          </h3>
          {userProperties?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {userProperties.map((property) => (
                <Link
                  to={`${paths.properties}/${property.slug}`}
                  key={property._id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow transition bg-white dark:bg-gray-800 self-start"
                >
                  {property.media &&
                    property.media.length > 0 &&
                    (property.media[0].type === "image" ? (
                      <img
                        src={property.media[0].url}
                        alt="Property"
                        className="w-full h-32 object-cover"
                      />
                    ) : (
                      <video controls className="w-full h-32 object-cover">
                        <source src={property.media[0].url} type="video/mp4" />
                      </video>
                    ))}

                  {property.isProperty && (
                    <div className="p-3">
                      <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-100 capitalize">
                        {property.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {property.city}, {property.state}
                      </p>
                      <p className="text-sm font-bold text-primary dark:text-gray-400">
                        {property.currency || "₦"} {property.price}
                      </p>
                    </div>
                  )}

                  <div className="p-3">
                    <div
                      className="prose prose-lg text-[15px] dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: truncateHtml(property.description, 50),
                      }}
                    />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No properties listed.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default UserProfile;
