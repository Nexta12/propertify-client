import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import EnhancedInput from "@components/ui/EnhancedInput";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import { useState } from "react";
import { toast } from "react-toastify";
import DOMPurify from "dompurify";
import EnhancedTextarea from "@components/ui/EnhancedTextArea";

const MessageSeller = ({ receiverId, propertyId }) => {
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
      propertyId,
      message: DOMPurify.sanitize(formData.message.trim(), {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
        KEEP_CONTENT: true,
      }),
    };

    try {
      const response = await apiClient.post(
        `${endpoints.messageSellerContactForm}/${receiverId}`,
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
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <EnhancedInput
          name="senderFirstName"
          value={formData.senderFirstName}
          onChange={handleChange}
          placeholder="First Name*"
        />
      </div>
      <div>
        <EnhancedInput
          name="senderLastName"
          value={formData.senderLastName}
          onChange={handleChange}
          placeholder="Last Name*"
        />
      </div>
      <div>
        <EnhancedInput
          name="senderEmail"
          value={formData.senderEmail}
          onChange={handleChange}
          type="email"
          placeholder="Your Email*"
        />
      </div>
      <div>
        <EnhancedInput
          name="senderPhone"
          value={formData.senderPhone}
          onChange={handleChange}
          placeholder="Your Phone*"
        />
      </div>
      <div>
        <EnhancedTextarea
          name="message"
          onChange={handleChange}
          value={formData.message}
          required
          className="w-full px-3 py-2 h-36 dark:text-gray-200"
        />
      </div>

      <button
        type="submit"
        className={`w-full bg-main-green text-white py-2 px-4 rounded-md hover:bg-green-hover transition-colors ${
          isSending ? "disabled cursor-not-allowed" : ""
        } `}
      >
        {isSending ? "Please wait..." : "Send Message"}
      </button>
    </form>
  );
};

export default MessageSeller;
