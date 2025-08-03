import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import EnhancedInput from "@components/ui/EnhancedInput";
import EnhancedTextarea from "@components/ui/EnhancedTextArea";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import useAuthStore from "@store/authStore";
import DOMPurify from "dompurify";
import { DateFormatter } from "@utils/helper";
import { useEffect, useState } from "react";
import { FaClock, FaEnvelope, FaPhone, FaReply, FaUser } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { PuffLoader } from "react-spinners";
import { toast } from "react-toastify";
import HandleGoBackBtn from "@components/goBackBtn/HandleGoBackBtn";

const ViewMessage = () => {
  const { user } = useAuthStore();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [isloading, setIsLoading] = useState(false);
  const [singlemessage, setSingleMessage] = useState({});
  const [reply, setReply] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchMessage = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(
          `${endpoints.getSingleMessage}/${id}`
        );
        setSingleMessage(response.data.data);
      } catch (error) {
        toast.error(ErrorFormatter(error));
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      await apiClient.put(
        `${endpoints.replyMessage}/${singlemessage._id}`,
        data
      );
      setReply("");
      toast.success("Message Sent");
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      toast.error(ErrorFormatter(error));
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex flex-col md:flex-row h-[calc(100vh-1px)] bg-bg-green font-sans items-center justify-center">
        {" "}
        <PuffLoader
          height="80"
          width="80"
          radius={1}
          color="#4866ff"
          area-label="puff-loading"
        />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto min-h-screen ">
      {/* Header */}
      <div className="flex items-center justify-between">
        <HandleGoBackBtn />
        <div className="w-8"></div> {/* Spacer for alignment */}
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl overflow-hidden">
        {/* Message Details */}
        <div className="p-6 border-b">
          <div className="mb-4">
          

            {singlemessage.subject && (
              <p className="text-gray-700 whitespace-pre-line text-sm italic capitalize">
                Subject: {singlemessage?.subject}
              </p>
            )}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-line text-sm italic">
                {singlemessage?.message}
              </p>

              {singlemessage?.mediaData && (
                <div className="mt-4">
                  <img
                    src={singlemessage.mediaData}
                    alt="Attached"
                    className="max-w-full h-auto rounded-md border"
                  />
                </div>
              )}
            </div>
          </div>

          {!singlemessage.senderId && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           
              <DetailItem
                icon={<FaEnvelope className="text-blue-500" />}
                label="Email"
                value={singlemessage?.senderEmail}
              />
              <DetailItem
                icon={<FaPhone className="text-blue-500" />}
                label="Phone"
                value={singlemessage?.senderPhone}
              />
              <DetailItem
                icon={<FaClock className="text-blue-500" />}
                label="Received"
                value={DateFormatter(singlemessage?.createdAt, true)}
              />
            </div>
          )}

        </div>

        {!singlemessage.senderId && (
          <div>
            {/* Admin Reply Section (if exists) */}
            {singlemessage.reply && (
              <div className="p-6 border-b bg-blue-50">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                  <FaReply className="mr-2 text-blue-500" />
                  Your Reply
                </h3>
                <div className="bg-white p-4 rounded-lg mb-4">
                  <p className="text-gray-700 whitespace-pre-line">
                    {singlemessage?.reply}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItem
                    label="Reply Date"
                    value={DateFormatter(singlemessage?.replyDate, true)}
                  />
                </div>
              </div>
            )}

            {/* Reply Form (if no reply exists) */}
            {(!singlemessage.reply || singlemessage.reply === "") && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaReply className="mr-2 text-blue-500" />
                  Send Reply
                </h3>
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className=" w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Recipient
                      </label>
                      <EnhancedInput
                        value={singlemessage?.senderName}
                        disabled
                        className="w-full"
                      />
                    </div>
                    <div className="mb-4 md:my-4  w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  <div className="mb-4">
                    <EnhancedTextarea
                      value={reply}
                      name="reply"
                      onChange={(e) => setReply(e.target.value)}
                      className="min-h-[150px] w-full p-3 focus:outline-none border-gray-300"
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isloading}
                      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                        isloading
                          ? "bg-gray-400"
                          : "bg-blue-600 hover:bg-blue-700"
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
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
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable Detail Item Component
const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start">
    {icon && <div className="flex-shrink-0 mt-1 mr-3">{icon}</div>}
    <div>
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900">{value || "N/A"}</dd>
    </div>
  </div>
);

export default ViewMessage;
