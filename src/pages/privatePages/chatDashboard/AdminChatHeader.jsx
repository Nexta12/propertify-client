import Avater from "@assets/img/avater.png";

const AdminChatHeader = ({ selectedChat, setSelectedChat }) => {
  return (
    <div className="flex items-center gap-3 p-4 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
      {/* Back button for mobile */}
      <button
        className="md:hidden text-gray-600 dark:text-gray-300"
        onClick={() => setSelectedChat(null)}
      >
        ⬅ Back
      </button>
      <div className="w-10 h-10 rounded-full overflow-x-hidden bg-gray-400">
        <img src={Avater} className="w-full h-full rounded-full" alt="profile" />
      </div>
      <div>
        <p className="font-semibold">
          {selectedChat.senderLastName} {selectedChat.senderFirstName}{" "}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {selectedChat.isOnline ? "Online" : "Offline"}
        </p>
      </div>
    </div>
  );
};

export default AdminChatHeader;
