import { FiPhone, FiMail } from "react-icons/fi";
import { BsWhatsapp } from "react-icons/bs";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import b2 from "@assets/img/b2.jpg";
import { formatTitleCase } from "@utils/helper";
import truncateHtml from "html-truncate";

const ProfessionalCard = ({ user }) => {
  return (
    <div className="bg-white dark:bg-gray-900 dark:border dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden w-full">
      {/* Top Section: Image + Info */}
      <div className="flex flex-col md:flex-row">
        {/* Profile Image */}
        <div className="md:w-1/3 w-full h-60 md:h-auto">
          <img
            src={user?.profilePic || b2}
            alt={`${user.firstName} ${user.lastName}`}
            className="object-cover w-full h-full"
          />
        </div>

        {/* User Info */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          {/* Header */}
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              {user?.title} {user?.firstName} {user?.lastName}
              {user.isVerifiedUser && <RiVerifiedBadgeFill className="text-blue-500 text-lg" />}
            </h2>

            <p className="text-sm text-secondary mt-1 dark:text-gray-400">
              {formatTitleCase(user.profession)} • {user.city}, {user.state}
            </p>
            <p className="text-xs text-tertiary mt-1 dark:text-gray-500">
              Joined {new Date(user.createdAt).toLocaleDateString()}
            </p>

            {user?.companyDetails?.companyName && (
              <p className="mt-2 text-sm font-medium capitalize dark:text-white">
                {user.companyDetails.companyName}
              </p>
            )}
          </div>

          <div
            className="prose prose-lg text-[15px] mt-2 dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{
              __html: truncateHtml(user?.description, 100),
            }}
          />

          {/* Contact Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
            {user?.whatsapp && (
              <a
                href={`https://wa.me/${user.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className=" flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-full text-sm text-white bg-main-green hover:bg-green-hover transition"
              >
                <BsWhatsapp /> WhatsApp
              </a>
            )}

            {user?.phone && (
              <a
                href={`tel:${user.phone}`}
                className=" flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-full text-sm text-white bg-tertiary hover:bg-primary transition"
              >
                <FiPhone /> Call
              </a>
            )}

            {user?.email && (
              <a
                href={`mailto:${user.email}`}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-full text-sm text-white bg-orange hover:opacity-90 transition"
              >
                <FiMail /> Email
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section: Description + Footer */}
    </div>
  );
};

export default ProfessionalCard;
