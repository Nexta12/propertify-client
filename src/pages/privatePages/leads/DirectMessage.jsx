import { useState } from "react";
import EnhancedTextarea from "@components/ui/EnhancedTextArea";
import HandleGoBackBtn from "@components/goBackBtn/HandleGoBackBtn";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import { endpoints } from "@api/endpoints";
import { apiClient } from "@api/apiClient";
import { toast } from "react-toastify";
import FileUpload from "@components/ui/FileUpload";
import EnhancedInput from "@components/ui/EnhancedInput";
import { useParams } from "react-router-dom";
import useAuthStore from "@store/authStore";
import { formatTitleCase } from "@utils/helper";

const DirectMessage = () => {
  const { slug } = useParams();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [mediaData, setMediaData] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    const messageData = {
      senderId: user.id,
      message,
      mediaData,
      subject
    };

    try {
      const response = await apiClient.post(
        `${endpoints.sendDirectMessage}/${slug}`,
        messageData
      );

      if (response.status === 201) {
        toast.success("Message Sent");
      }

      setMessage("")
      setSubject("")
      setMediaData("")

    
    } catch (error) {
      toast.error(ErrorFormatter(error));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-full mx-auto min-h-screen">
      <div className="mx-auto mb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <HandleGoBackBtn />
          <h1 className="text-lg font-bold text-gray-800">Send Messages</h1>
          <div className="w-8"></div> {/* Spacer for alignment */}
        </div>

        {/* Main Card */}
        <div className="bg-white shadow-md overflow-hidden p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Recipient Type Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message to: {formatTitleCase(slug)}
              </label>
            </div>

            {/* Message Input */}
            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Subject
              </label>
              <EnhancedInput
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Write your message subject here..."
                rows={6}
                className="focus:outline-none w-full p-4 "
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Your Message
              </label>
              <EnhancedTextarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message here..."
                rows={6}
                required
                className="focus:outline-none w-full p-4 "
              />
              <FileUpload
                value={mediaData}
                onChange={(file) => {
                  if (file && file.url) {
                    setMediaData(file.url);
                  } else {
                    setMediaData(null);
                  }
                }}
                multiple={false}
                maxFiles={1}
                accept="image/*"
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-green-500 transition-colors"
              />
            </div>

            {/* Send Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className={`w-full bg-main-green text-white py-2 px-4 rounded-md hover:bg-green-hover transition-colors ${
                  isSending ? "disabled cursor-not-allowed" : ""
                } `}
              >
                {isSending ? "Please wait..." : "Send Message"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DirectMessage;
