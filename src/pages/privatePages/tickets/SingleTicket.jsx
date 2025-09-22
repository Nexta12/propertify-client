import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";
import HandleGoBackBtn from "@components/goBackBtn/HandleGoBackBtn";
import DOMPurify from "dompurify";


const SingleTicket = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);


  const fetchTicket = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`${endpoints.getSingleTicket}/${id}`);
      setTicket(res.data.data);
    } catch (error) {
      toast.error(ErrorFormatter(error));
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    try {
      setSubmitting(true);
      await apiClient.post(`${endpoints.replyTicket}/${id}`, {
        message: DOMPurify.sanitize(replyMessage.trim(), {
          ALLOWED_TAGS: [],
          ALLOWED_ATTR: [],
          KEEP_CONTENT: true,
        }),
      });
      setReplyMessage("");
      toast.success("Reply sent successfully");
      fetchTicket(); // refresh replies
    } catch (error) {
      toast.error(ErrorFormatter(error));
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  if (loading) return <div className="p-4">Loading ticket...</div>;
  if (!ticket) return <div className="p-4 text-red-500">Ticket not found.</div>;

  const {
    subject,
    status,
    message,
    priority,
    createdAt,
    userId,
    replies = [],
  } = ticket;

  const priorityColors = {
    low: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-orange text-white",
    urgent: "bg-red-100 text-red-700",
  };

  const handleClosed = async () => {
    const data = {
      status: "closed",
    };
    try {
       await apiClient.put(
        `${endpoints.updateTicket}/${id}`,
        data
      );
     toast.success("Ticket Closed successfully")
     window.location.reload();
    } catch (error) {
      toast.error(ErrorFormatter(error));
    }
  };

  return (
  <div className="max-w-6xl mx-auto p-4 space-y-6">
  <HandleGoBackBtn />
  <div className="bg-white dark:bg-gray-800 p-4 shadow rounded space-y-6">
    <div className="flex items-start justify-between">
      {userId && (
        <div className="font-semibold text-primary-text dark:text-gray-100 capitalize">
          {userId.firstName} {userId.lastName}{" "}
          <span className="text-[10px] dark:text-gray-400">({userId.role})</span>
        </div>
      )}

      <div className="text-[12px] text-gray-600 dark:text-gray-400 mb-1 capitalize">
        {formatDistanceToNow(new Date(createdAt))} ago
      </div>
    </div>
    <h2 className="text-sm font-bold mb-2 dark:text-white">Subject: {subject}</h2>
    <h2 className="text-sm font-bold mb-2 dark:text-gray-300">{message}</h2>

    <div className="flex flex-wrap gap-4 mt-2 text-sm items-center justify-between">
      <div className="flex flex-wrap gap-4 mt-2 text-sm">
        <div>
          <span className="font-semibold dark:text-gray-200 text-xs ">Status:</span>{" "}
          <span
            className={`inline-block px-2 py-0.5 rounded-full capitalize ${
              status === "closed"
                ? "bg-red-100 text-red-600 dark:bg-red-200 dark:text-red-800"
                : "bg-blue-100 text-blue-600 dark:bg-blue-200 dark:text-blue-800"
            }`}
          >
            {status}
          </span>
        </div>
        <div>
          <span className="font-semibold dark:text-gray-200 text-sm">Priority:</span>{" "}
          <span
            className={`inline-block px-2 py-0.5 rounded-full ${
              priorityColors[priority] || ""
            }`}
          >
            {priority}
          </span>
        </div>
      </div>
      {status !== "closed" && (
        <button
          onClick={handleClosed}
          className="inline-block px-2 py-1 rounded-full bg-red-500 text-white text-[12px] hover:bg-red-600"
        >
          Mark As Closed
        </button>
      )}
    </div>
  </div>

  {/* Replies */}
  <div className="bg-white dark:bg-gray-800 p-4 shadow rounded ">
    <h3 className="text-lg font-semibold mb-3 dark:text-white">Replies</h3>
    {replies.length === 0 ? (
      <p className="text-gray-500 dark:text-gray-400">No replies yet.</p>
    ) : (
      <ul className="space-y-4 max-h-96 overflow-y-auto ">
        {replies.map((reply, index) => {
          const sender = reply.sender || {};
          const fullName = sender.firstName
            ? `${sender.firstName} ${sender.lastName}`
            : "User";
          const isAdmin = sender.role === "admin";

          return (
            <li
              key={reply._id || index}
              className={`border-t pt-2 p-3 rounded ${
                isAdmin
                  ? "bg-orange-50 dark:bg-orange-100"
                  : "bg-gray-50 dark:bg-gray-700"
              }`}
            >
              <div className="text-sm text-gray-600 dark:text-gray-300 flex justify-between">
                <div>
                  <strong className="dark:text-white">{fullName}</strong>
                  <span className="ml-1 text-xs italic text-gray-500 dark:text-gray-400 capitalize">
                    ({isAdmin ? "Admin" : reply.sender.role})
                  </span>{" "}
                </div>
                <div className="capitalize text-[12px] dark:text-gray-400">
                  {formatDistanceToNow(new Date(reply.createdAt))} ago
                </div>
              </div>
              <div
                className="text-gray-800 dark:text-gray-100 mt-1 prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: reply.message }}
              />
            </li>
          );
        })}
      </ul>
    )}
  </div>

  {/* Reply Form */}
  {status !== "closed" && (
    <form
      onSubmit={handleReplySubmit}
      className="bg-white dark:bg-gray-800 p-4 shadow rounded space-y-4"
    >
      <h3 className="text-lg font-semibold dark:text-white">Post a Reply</h3>
      <textarea
        value={replyMessage}
        onChange={(e) => setReplyMessage(e.target.value)}
        rows="4"
        placeholder="Type your reply..."
        className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded p-2"
      />
      <button
        type="submit"
        disabled={submitting}
        className="px-4 py-2 bg-main-green text-white rounded hover:bg-green-hover disabled:opacity-70"
      >
        {submitting ? "Sending..." : "Send Reply"}
      </button>
    </form>
  )}
</div>

  );
};

export default SingleTicket;
