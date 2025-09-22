import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import useAuthStore from "@store/authStore";
import { DateFormatter } from "@utils/helper";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PuffLoader } from "react-spinners";
import { toast } from "react-toastify";
import HandleGoBackBtn from "@components/goBackBtn/HandleGoBackBtn";
import MessageReplyForm from "./MessageReplyForm";
import MessageReplies from "./MessageReplies";
import { DetailItem } from "./component/DetailItem";

const ViewMessage = () => {
  const { user } = useAuthStore();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [singlemessage, setSingleMessage] = useState({});

  useEffect(() => {
    if (!id) return;

    const fetchMessage = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`${endpoints.getSingleMessage}/${id}`);
        setSingleMessage(response.data.data);
      } catch (error) {
        toast.error(ErrorFormatter(error));
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
  }, [id]);

  if (loading || !user) {
    return (
      <div className="flex flex-col md:flex-row h-[calc(100vh-1px)] bg-bg-green font-sans items-center justify-center">
        {" "}
        <PuffLoader height="80" width="80" radius={1} color="#4866ff" area-label="puff-loading" />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto min-h-screen mb-10 ">
      {/* Header */}
      <div className="flex items-center justify-between">
        <HandleGoBackBtn />
        <div className="w-8"></div> {/* Spacer for alignment */}
      </div>

      {/* Main Card */}
      <div className=" rounded-xl overflow-hidden">
        {/* Message Details */}
        <div className=" bg-white dark:bg-gray-800 p-6 border-b">
          <div className="mb-4">
            {singlemessage.subject && (
              <p className="text-gray-700 whitespace-pre-line text-sm italic capitalize mb-4">
                Subject: {singlemessage?.subject}
              </p>
            )}
            <div className="bg-gray-50 dark:bg-gray-700  p-4 rounded-lg">
              <p className="text-gray-700 dark:text-gray-200 whitespace-pre-line text-sm italic">
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

          {singlemessage.type == "directMessage" && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <DetailItem
                // icon={<FaEnvelope className="text-blue-500" />}
                label="Sender:"
                value={`${singlemessage?.senderId?.title} ${singlemessage?.senderId?.firstName} ${singlemessage?.senderId?.lastName}`}
              />

              <DetailItem
                // icon={<FaClock className="text-blue-500" />}
                label="Received Date"
                value={DateFormatter(singlemessage?.createdAt, true)}
              />
            </div>
          )}

          {!singlemessage.senderId && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <DetailItem
                // icon={<FaEnvelope className="text-blue-500" />}
                label="Sender:"
                value={`${singlemessage?.senderFirstName} ${singlemessage?.senderLastName}`}
              />
              <DetailItem
                // icon={<FaEnvelope className="text-blue-500" />}
                label="Sender Email:"
                value={singlemessage?.senderEmail}
              />
              <DetailItem
                // icon={<FaPhone className="text-blue-500" />}
                label="Sender Phone"
                value={singlemessage?.senderPhone}
              />
              <DetailItem
                // icon={<FaClock className="text-blue-500" />}
                label="Received Date"
                value={DateFormatter(singlemessage?.createdAt, true)}
              />
            </div>
          )}
        </div>

        {/* Replies */}
        <MessageReplies singlemessage={singlemessage} />
        <MessageReplyForm singlemessage={singlemessage} />
      </div>
    </div>
  );
};

// Reusable Detail Item Component

export default ViewMessage;
