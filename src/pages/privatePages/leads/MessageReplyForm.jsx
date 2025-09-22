import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import EnhancedInput from "@components/ui/EnhancedInput";
import EnhancedTextarea from "@components/ui/EnhancedTextArea";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import DOMPurify from "dompurify";
import { DateFormatter } from "@utils/helper";
import { toast } from "react-toastify";
import { useState } from "react";
import { DetailItem } from "./component/DetailItem";

const MessageReplyForm = ({ singlemessage }) => {
  const [isloading, setIsLoading] = useState(false);
  const [reply, setReply] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reply) {
      return toast.error("Please enter your reply message");
    }

    setIsLoading(true);

    const data = {
      reply: DOMPurify.sanitize(reply.trim(), {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
        KEEP_CONTENT: true,
      }),
      email: singlemessage.senderEmail,
    };

    try {
      if (singlemessage.type == "contactForm") {
        await apiClient.post(`${endpoints.replyContactFormMessage}/${singlemessage._id}`, data);
      }

      if (singlemessage.type == "directMessage") {
        await apiClient.post(`${endpoints.replyDirectMessage}/${singlemessage._id}`, data);
      }

      setReply("");
      toast.success("Message Sent");
    } catch (error) {
      toast.error(ErrorFormatter(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 my-6">
      {/* Admin Reply Section (if exists) */}
      {singlemessage.reply && (
        <div className="p-6 border-b bg-blue-50 dark:bg-blue-900/30 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2 flex items-center">
            Your Reply
          </h3>
          <div className="bg-white dark:bg-gray-700 p-4 rounded-lg mb-4">
            <p className="text-gray-700 dark:text-gray-100 whitespace-pre-line">
              {singlemessage?.reply}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem label="Reply Date" value={DateFormatter(singlemessage?.replyDate, true)} />
          </div>
        </div>
      )}

      {/* Reply Form (if no reply exists) */}
      <div className="p-6">
        {singlemessage.type == "contactForm" && (
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
            Send Reply
          </h3>
        )}
        {singlemessage.type !== "bulkMessage" && (
          <form onSubmit={handleSubmit}>
            {singlemessage.type === "contactForm" && (
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Recipient
                  </label>
                  <EnhancedInput
                    value={`${singlemessage?.senderFirstName} ${singlemessage?.senderLastName}`}
                    disabled
                    className="w-full"
                  />
                </div>
                <div className="mb-4 md:my-4 w-full">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Recipient Email
                  </label>
                  <EnhancedInput
                    type="email"
                    value={singlemessage?.senderEmail}
                    name="email"
                    disabled
                    className="w-full"
                  />
                </div>
              </div>
            )}

            <div>
              <EnhancedTextarea
                value={reply}
                name="reply"
                onChange={(e) => setReply(e.target.value)}
                className="w-full p-3 focus:outline-none border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isloading}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                  isloading
                    ? "bg-gray-400 dark:bg-gray-500"
                    : "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
              >
                {isloading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Send Reply"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default MessageReplyForm;
