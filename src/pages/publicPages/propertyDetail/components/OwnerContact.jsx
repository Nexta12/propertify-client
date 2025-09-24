import { Link } from "react-router-dom";
import { FiPhone, FiMail } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import Avater from "@assets/img/avater.png";
import { paths } from "@routes/paths";
import { formatTitleCase, MessageEncoder } from "@utils/helper";
import LogoPlaceHolder from "@assets/img/your-logo.webp";
import { RiVerifiedBadgeFill } from "react-icons/ri";

const OwnerContact = ({ property }) => {
  const isCompany = !!property?.postAs; // check if postAs is set

  const profileImage = isCompany
    ? property.postAs.companyLogo || LogoPlaceHolder
    : property?.owner?.profilePic || Avater;

  const displayName = isCompany
    ? property.postAs.companyName
    : ` ${property?.owner?.firstName || ""} ${property?.owner?.lastName || ""} `;

  const isVerified = isCompany ? property?.postAs?.isVerified : property?.owner?.isVerifiedUser;

  const displaySubText = isCompany
    ? formatTitleCase(property?.postAs?.category)
    : formatTitleCase(property?.owner?.profession);

  const profileLink = isCompany
    ? `${paths.companies}/${property.postAs.slug}`
    : `${paths.protected}/profile/${property?.owner?.slug}`;

  const phone = isCompany ? property?.postAs?.phones[0] : property.owner.phone;
  const email = isCompany ? property.postAs.email : property.owner?.email;
  const whatsapp = isCompany ? property.postAs.whatsapp : property.owner.whatsapp;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      {/* Header with avatar + name */}
      <div className="flex items-center mb-4">
        <img
          src={profileImage}
          alt={displayName}
          className="w-12 h-12 rounded-full object-cover mr-3"
        />

        <div>
          <h4 className="font-medium text-gray-800 dark:text-gray-100 flex items-center">
            {displayName}
            {isVerified && (
              <RiVerifiedBadgeFill className="ml-1 text-blue-500" title="Duly Verified user" />
            )}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{displaySubText}</p>
          <Link
            to={profileLink}
            className="text-[12px] text-blue-500 dark:text-blue-400 capitalize italic"
          >
            View Profile
          </Link>
        </div>
      </div>

      {/* Contact buttons */}
      <div className="flex items-center justify-between flex-wrap gap-2 ">
        {phone && (
          <a
            href={`tel:${phone}`}
            className=" flex-1 flex items-center justify-center gap-1 px-3 py-2  rounded-full text-sm text-white bg-tertiary hover:bg-primary transition"
          >
            <FiPhone className="mr-2" />
            Call
          </a>
        )}

        <a
          href={`mailto:${email || import.meta.env.VITE_OFFICIAL_EMAIL}?subject=Regarding ${
            property.title
          }&body=Hello, I'm interested in...`}
          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-full text-sm text-white bg-orange hover:opacity-90 transition"
        >
          <FiMail className="mr-2" />
          Email
        </a>

        {whatsapp && (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://wa.me/${whatsapp}${MessageEncoder(
              ` Hi ${displayName}, I am interested in ${property.title}`
            )}`}
            className=" flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-full text-sm text-white bg-main-green hover:bg-green-hover transition"
            aria-label="Chat on WhatsApp"
          >
            <FaWhatsapp className="mr-2" />
            WhatsApp
          </a>
        )}
      </div>
    </div>
  );
};

export default OwnerContact;
