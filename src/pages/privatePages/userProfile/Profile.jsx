import React, { useEffect, useState } from "react";
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
import { truncate } from "lodash";
import Avater from "@assets/img/avater.png"

const Profile = () => {
  const { slug } = useParams();
  const [userDetails, setUserDetails] = useState(null)
  const [userProperties, setUserProperties] = useState([])
  const { user } = useAuthStore()


const fetchUserData = async () => {
    try {
      const [userRes, propertiesRes] = await Promise.all([
        apiClient.get(`${endpoints.getUserDetails}/${slug}`),
        apiClient.get(`${endpoints.fetchUserProperties}/${slug}`)
      ]);

      setUserDetails(userRes.data.data);
      setUserProperties(propertiesRes.data.data);
    } catch (error) {
      toast.error(ErrorFormatter(error));
    }
  };

   useEffect(() => {
    if (slug) {
      fetchUserData();
    }
  }, [slug]);


  return (
    <>
      <HandleGoBackBtn/>
    <div className="bg-white rounded-xl overflow-hidden shadow-md">
      
      {/* Cover Image */}
      <div className="relative h-48 bg-gray-200">
       
        <img
            src={userDetails?.coverPic || Avater}
            alt="Cover"
            className="w-full h-full object-cover"
          />

        {/* Profile Picture */}
        <div className="absolute -bottom-12 left-5">
          <img
            src={userDetails?.profilePic || Avater}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-md"
          />
        </div>
       
       {user.slug !== slug && (
        <div className="flex items-center justify-between w-full pr-4">
            <span></span>
          <div className="flex items-center gap-4">
          <Link to={`${paths.protected}/messages/dm/${slug}`}>
            <FiMail className="text-primary-text text-2xl"/>
          </Link>
         <button className="mt-4 px-4 py-2 bg-main-green text-white text-sm rounded-lg shadow ">
          Add to Contacts
        </button>
        </div>
        </div>
        )}
      </div>

      {/* User Info */}
      <div className="mt-16 px-5 pb-5">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">{userDetails?.title} {userDetails?.firstName} {userDetails?.lastName}</h2>
          {userDetails?.isVerifiedUser && (
            <RiVerifiedBadgeFill className="text-blue-500 text-xl" />
          )}
        </div>
        <p className="text-gray-600 text-sm mt-1 capitalize">{userDetails?.companyDetails?.companyName} 
            <Link to={userDetails?.companyDetails?.companyWebsite} target="_blank" ><span className="text-[14px] mx-4 text-blue-500 lowercase">{userDetails?.companyDetails?.companyWebsite}</span></Link>
            
         </p>

        <p className="mt-3 text-gray-700 text-sm whitespace-pre-line ">{userDetails?.description || "No bio available."}</p>

        <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
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
        <div className="flex flex-col md:flex-row md:items-center gap-4 mt-3 text-sm text-gray-600">
          {userDetails?.city && (
            <div className="flex items-center gap-1">
              <FaLocationPin /> <span>{userDetails?.city} {userDetails?.state}</span>
            </div>
          )}
          {userDetails?.profession && (
            <div className="flex items-center gap-1">
              <FaBriefcase /> <span>{formatTitleCase(userDetails?.profession)}</span>
            </div>
          )}
          {userDetails?.lastLogin && (
            <div className="flex items-center gap-1 capitalize">
              <FaBusinessTime />Last Login: <span>{formatDistanceToNow(userDetails?.lastLogin)}</span>
            </div>
          )}
        </div>

       
      </div>

      {/* Properties Grid */}
      <div className="px-5 pb-5">
        <h3 className="text-lg font-semibold mb-3">Posts & Properties</h3>
        {userProperties?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {userProperties.map((property) => (
              <Link
                to={`${paths.properties}/${property.slug}`}
                key={property._id}
                className="border rounded-lg overflow-hidden hover:shadow transition"
              >
                {property.media[0]?.type === "image" ? (
              <img
                src={property.media[0]?.url}
                alt="Property"
                className="w-full h-64 object-cover"
              />
            ) : (
              <video controls className="w-full h-64 object-cover">
                <source src={property.media[0]?.url} type="video/mp4" />
              </video>
            )}
              {property.isProperty && (
                <div className="p-3">
                  <h4 className="font-semibold text-sm">{property.title}</h4>
                  <p className="text-xs text-gray-500 capitalize">
                    {property.city}, {property.state}
                  </p>
                  <p className="text-sm font-bold text-primary">
                    {property.currency || "₦"} {property.price}
                  </p>
                </div>
                 )}

                  <div className="p-3">
    
                  <p className="text-xs text-gray-500 capitalize">
                    { truncate(property.description, {length: 50})}
                  </p>
                
                </div>
              </Link>

              

            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No properties listed.</p>
        )}
      </div>
    </div>
    </>
  );
};

export default Profile;
