import { FaWhatsapp } from "react-icons/fa";
import { FiMail, FiPhone } from "react-icons/fi";

const PropertyOwnerContact = ({ property }) => {
  const message = "Hello, I'm interested in your property at";
  const encodedMessage = message ? encodeURIComponent(message) : "";
 
  return (
    <div className={`flex items-center justify-between gap-3`}>
      <a
        href={`mailto:${
          property.owner.email
        }?subject=Regarding ${encodeURIComponent(
          property.title
        )}&body=Hello, I'm interested in your property at ${encodeURIComponent(
          property.location
        )}`}
        className="p-2 text-indigo-600 rounded-full bg-indigo-50 transition-colors flex gap-x-1"
      >
        <FiMail /> <span className="text-[12px]">Email</span>
      </a>
   
      <a
        href={`tel:${property.owner.phone}`}
        className="p-2 text-indigo-600 rounded-full bg-indigo-50 transition-colors flex gap-x-1"
      >
        <FiPhone /> <span className="text-[12px]">Call</span>
      </a>
      {property.owner.whatsapp && (
      <a
        href={`https://wa.me/${property.owner.whatsapp}?text=${encodedMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 text-green-600 rounded-full bg-green-50 transition-colors flex gap-x-1"
      >
        <FaWhatsapp /> <span className="text-[12px]">WhatsApp</span>
      </a>
       )}
    </div>
  );
};

export default PropertyOwnerContact;
