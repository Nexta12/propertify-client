import {
  FaWhatsapp,
  FaPhone,
  FaEnvelope,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";
import { motion as Motion } from "framer-motion";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import { toast } from "react-toastify";
import { useState } from "react";
import DOMPurify from "dompurify";
import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import EnhancedInput from "@components/ui/EnhancedInput";
import EnhancedTextarea from "@components/ui/EnhancedTextArea";

const ContactUsTab = ({ activeTab, company }) => {
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({
    senderFirstName: "",
    senderLastName: "",
    senderEmail: "",
    senderPhone: "",
    message: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);

    const messageData = {
      senderFirstName: formData.senderFirstName,
      senderLastName: formData.senderLastName,
      senderEmail: formData.senderEmail,
      senderPhone: formData.senderPhone,
      message: DOMPurify.sanitize(formData.message.trim(), {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
        KEEP_CONTENT: true,
      }),
    };

    try {
      const response = await apiClient.post(
        `${endpoints.messageSellerContactForm}/${company?.createdBy}`,
        messageData
      );

      if (response.status === 201) {
        toast.success("Message Sent");
      }
      setFormData({
        senderFirstName: "",
        senderLastName: "",
        senderEmail: "",
        senderPhone: "",
        message: "",
      });
    } catch (error) {
      toast.error(ErrorFormatter(error));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {activeTab === "contact" && (
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-2xl mx-auto space-y-8"
        >
          {/* Contact Info Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b pb-2">
              Contact Information
            </h3>
            <div className="space-y-3">
              <p className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <FaPhone className="text-blue-600" /> {company?.phones?.join(", ")}
              </p>
              <p className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <FaWhatsapp className="text-green-600" /> {company?.whatsapp}
              </p>
              <p className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <FaEnvelope className="text-red-600" /> {company?.email}
              </p>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center gap-4 pt-4 border-t">
              {company?.socialLinks?.facebook && (
                <a
                  href={company?.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700"
                >
                  <FaFacebook size={20} />
                </a>
              )}
              {company?.socialLinks?.twitter && (
                <a
                  href={company?.socialLinks?.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-500 hover:text-sky-600"
                >
                  <FaTwitter size={20} />
                </a>
              )}
              {company?.socialLinks?.linkedin && (
                <a
                  href={company?.socialLinks?.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:text-blue-800"
                >
                  <FaLinkedin size={20} />
                </a>
              )}
              {company?.socialLinks?.instagram && (
                <a
                  href={company?.socialLinks?.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:text-pink-700"
                >
                  <FaInstagram size={20} />
                </a>
              )}
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b pb-2 mb-4">
              Send Us a Message
            </h3>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <EnhancedInput
                  name="senderFirstName"
                  value={formData.senderFirstName}
                  onChange={handleChange}
                  placeholder="First Name*"
                />
                <EnhancedInput
                  name="senderLastName"
                  value={formData.senderLastName}
                  onChange={handleChange}
                  placeholder="Last Name*"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <EnhancedInput
                  name="senderEmail"
                  value={formData.senderEmail}
                  onChange={handleChange}
                  type="email"
                  placeholder="Your Email*"
                />
                <EnhancedInput
                  name="senderPhone"
                  value={formData.senderPhone}
                  onChange={handleChange}
                  placeholder="Your Phone*"
                />
              </div>

              <EnhancedTextarea
                name="message"
                onChange={handleChange}
                value={formData.message}
                required
                className="w-full py-2 h-36 dark:text-gray-200"
              />

              <button
                type="submit"
                className={`w-full bg-main-green text-white py-3 px-4 rounded-lg font-medium hover:bg-green-hover transition-colors ${
                  isSending ? "disabled cursor-not-allowed opacity-70" : ""
                }`}
              >
                {isSending ? "Please wait..." : "Send Message"}
              </button>
            </form>
          </div>
        </Motion.div>
      )}
    </>
  );
};

export default ContactUsTab;
