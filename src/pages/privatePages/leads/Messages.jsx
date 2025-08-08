
import { useEffect, useState } from "react";
import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import { paths } from "@routes/paths";
import useAuthStore from "@store/authStore";
import { PuffLoader } from "react-spinners";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { truncate } from "lodash";
import { FiEye, FiMoreVertical, FiTrash2 } from "react-icons/fi";
import DeleteModal from "@components/deleteModal/DeleteModal";


const Messages = () => {
  const { user, validateAuth } = useAuthStore();
  const [authLoading, setAuthLoading] = useState(false);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false)

  const [sentMessages, setSentMessages] = useState([]);

  const [activeTab, setActiveTab] = useState("received");

  useEffect(() => {
    const verifyAuth = async () => {
      setAuthLoading(true);
      try {
        await validateAuth();
      } finally {
        setAuthLoading(false);
      }
    };
    verifyAuth();
  }, [validateAuth]);

  // Fetch Inbox and Sent Messages
useEffect(() => {
  if (user && !authLoading) {
    const fetchMessages = async () => {
      try {
        const [receivedRes, sentRes] = await Promise.all([
          apiClient.get(`${endpoints.fetchUserMessages}/${user.slug}`),
          apiClient.get(`${endpoints.getSentMessages}/${user.id}`),
        ]);

        setReceivedMessages(receivedRes.data.data);
        setSentMessages(sentRes.data.data);
      } catch (error) {
        toast.error(ErrorFormatter(error));
      }
    };

    fetchMessages();
  }
}, [user, authLoading]);

    const handleDelete = (msg) => {
    setOpenModal(true);
    setItemToDelete(msg);
  };

  const confirmDelete = async () => {
    setIsDeleting(true)
    if (itemToDelete) {
      try {

        if(itemToDelete.type == "contactForm"){
           await apiClient.delete(`${endpoints.deleteContactFormMessage}/${itemToDelete._id}`);
        }

        if(itemToDelete.type == "directMessage"){
            await apiClient.delete(`${endpoints.deleteDirectMessage}/${itemToDelete._id}`);
        }

        if(itemToDelete.type == "bulkMessage"){
            await apiClient.delete(`${endpoints.deleteBulkMessage}/${itemToDelete._id}`);
        }

        // await apiClient.delete(`${endpoints.deleteMessage}/${itemToDelete}`);
        setReceivedMessages((prev) =>
          prev.filter((msg) => msg._id !== itemToDelete._id)
        );

        setSentMessages((prev) =>
          prev.filter((msg) => msg._id !== itemToDelete._id)
        );
        setOpenModal(false);
        setItemToDelete(null);
        toast.success("Message deleted.");

      } catch (error) {
        toast.error(ErrorFormatter(error));
        setOpenModal(false);
        setItemToDelete(null);
  
      }finally{
        setIsDeleting(false)
      }
    }
  };

  const MessageCard = ({ message, isSent = false, onDelete }) => {
    const [showMenu, setShowMenu] = useState(false);
    
    const { receiverId, sender } = message;

     const senderName = `${sender?.firstName} ${sender?.lastName} `

   let recipientsName;

    if(isSent && message.messageType == 'direct' ){
      recipientsName = `${ receiverId?.title} ${ receiverId.firstName} ${ receiverId.lastName} `
    }else if(isSent && message.messageType == 'bulk') {
      recipientsName = message.contacts?.map((item) => `${item.firstName} ${item.lastName}`).join(", ") || "";
  
    }

    return (
      <div className="relative p-4 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-2xl mb-4 hover:shadow-md transition-all">
  <div className="flex justify-between items-start">
    <div>
      <p className="text-primary-text dark:text-gray-200 font-semibold capitalize">
        {isSent ? "To:" : "From:"}{" "}
        {isSent ? truncate(recipientsName, { length: 30 }) : senderName}
      </p>
      <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
        {truncate(message.message, { length: `${!isSent ? 100 : 1000}` })}
      </p>

      <Link
        to={`${paths.protected}/messages/${message._id}`}
        className="inline-block mt-3 text-main-green text-sm font-medium hover:underline"
      >
        Read More →
      </Link>
    </div>

    <div className="relative">
      <button
        onClick={() => setShowMenu((prev) => !prev)}
        className="text-gray-500 dark:text-gray-300 hover:text-main-green"
      >
        <FiMoreVertical />
      </button>

      {showMenu && (
        <div className="absolute right-0 top-6 w-32 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-md z-10">
          <Link
            to={`${paths.protected}/messages/${message._id}`}
            className="flex items-center px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-100"
          >
            <FiEye className="mr-2" />
            View
          </Link>
          <button
            onClick={() => {
              setShowMenu(false);
              onDelete(message);
            }}
            className="w-full flex items-center px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900 dark:text-red-400"
          >
            <FiTrash2 className="mr-2" />
            Delete
          </button>
        </div>
      )}
    </div>
  </div>

  <span className="block mt-3 text-xs text-secondary dark:text-gray-400 capitalize">
    {formatDistanceToNow(message.createdAt, { addSuffix: true })}
  </span>
</div>

    );
  };

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <PuffLoader color="#28B16D" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 font-sans text-primary-text dark:text-gray-300">
      <DeleteModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this message?"
      />

      <h1 className="text-xl md:text-2xl font-bold mb-6">Inbox</h1>

      {/* Tabs */}
      <div className="flex space-x-4 border-b mb-6">
        <button
          onClick={() => setActiveTab("received")}
          className={`pb-2 px-4 text-sm font-medium ${
            activeTab === "received"
              ? "border-b-2 border-main-green text-main-green"
              : "text-secondary dark:text-gray-300"
          }`}
        >
          Received
        </button>
        <button
          onClick={() => setActiveTab("sent")}
          className={`pb-2 px-4 text-sm font-medium ${
            activeTab === "sent"
              ? "border-b-2 border-main-green text-main-green"
              : "text-secondary dark:text-gray-300"
          }`}
        >
          Sent
        </button>
      </div>

      {/* Message Lists */}
      {activeTab === "received" &&
        (receivedMessages.length > 0 ? (
          receivedMessages.map((msg, i) => (
            <MessageCard
              key={i}
              message={msg}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-300">No received messages yet.</p>
        ))}

      {activeTab === "sent" &&
        (sentMessages.length > 0 ? (
          sentMessages.map((msg) => (
            <MessageCard key={msg._id} message={msg} isSent  onDelete={handleDelete} />
          ))
        ) : (
          <p className="text-sm text-gray-500">No sent messages yet.</p>
        ))}
    </div>
  );
};

export default Messages;


