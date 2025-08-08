import { formatTitleCase, MessageEncoder } from "@utils/helper";
import { FaWhatsapp } from "react-icons/fa";
import { FiMail, FiPhone } from "react-icons/fi";
import { Link } from "react-router-dom";
import Avater from "@assets/img/avater.png";
import { paths } from "@routes/paths";

const OwnerContact = ({ property }) => {
  return (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
  <div className="flex items-center mb-4">
    <img
      src={property?.owner?.profilePic || Avater}
      alt={property.owner.name}
      className="w-12 h-12 rounded-full object-cover mr-3"
    />
    <div>
      <h4 className="font-medium text-gray-800 dark:text-gray-100">
        {property?.owner?.lastName} {property?.owner?.firstName}
      </h4>
      <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
        {formatTitleCase(property?.owner?.profession)}
      </p>
      <Link
        to={`${paths.protected}/profile/${property?.owner?.slug}`}
        className="text-[12px] text-blue-500 dark:text-blue-400 capitalize italic"
      >
        {property?.owner?.companyDetails?.companyName}
      </Link>
    </div>
  </div>

  <div className="flex items-center flex-wrap gap-2">
    <a
      href={`tel:${property.owner.phone}`}
      className="flex items-center justify-center p-2 bg-indigo-50 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-100 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-700 transition-colors text-sm"
    >
      <FiPhone className="mr-2" />
      Call
    </a>

    <a
      href={`mailto:${
        property.owner?.email || import.meta.env.VITE_OFFICIAL_EMAIL
      }?subject=Regarding ${
        property.title
      }&body=Hello, I'm interested in...`}
      className="flex items-center justify-center p-2 bg-yellow-50 dark:bg-yellow-800 text-orange dark:text-yellow-200 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-700 transition-colors text-sm"
    >
      <FiMail className="mr-2" />
      Email
    </a>

    <a
      target="_blank"
      rel="noopener noreferrer"
      href={`https://wa.me/${property.owner.whatsapp}${MessageEncoder(
        ` Hi ${property.owner.firstName}, I am interested in  ${property.title}`
      )}`}
      className="flex items-center justify-center p-2 bg-green-50 dark:bg-green-800 text-green-600 dark:text-green-100 rounded-lg hover:bg-green-100 dark:hover:bg-green-700 transition-colors text-sm"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp className="mr-2" />
      WhatsApp
    </a>
  </div>
</div>

  );
};

export default OwnerContact;
