import { formatDistanceToNow } from "date-fns";

const MessageReplies = ({ singlemessage }) => {
  return (
    <>
      {singlemessage.type == "directMessage" && (
        <div className="bg-white dark:bg-gray-800 p-4 shadow rounded my-3">
  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
    Replies
  </h3>
  {singlemessage.replies.length === 0 ? (
    <p className="text-gray-500 dark:text-gray-400">No replies yet.</p>
  ) : (
    <ul className="space-y-4 max-h-56 overflow-y-auto">
      {[...singlemessage.replies].reverse().map((reply, index) => {
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
                ? "bg-orange-50 dark:bg-orange-900"
                : "bg-gray-50 dark:bg-gray-700"
            }`}
          >
            <div className="text-sm text-gray-600 dark:text-gray-300 flex justify-between">
              <div>
                <strong>{fullName}</strong>
                <span className="ml-1 text-xs italic text-gray-500 dark:text-gray-400 capitalize">
                  ({isAdmin ? "Admin" : reply.sender.role})
                </span>
              </div>
              <div className="capitalize text-[12px] text-gray-500 dark:text-gray-400">
                {formatDistanceToNow(new Date(reply.repliedAt))} ago
              </div>
            </div>
            <div
              className="text-gray-800 dark:text-gray-200 mt-1 prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: reply.message }}
            />
          </li>
        );
      })}
    </ul>
  )}
</div>

      )}
    </>
  );
};

export default MessageReplies;
