import { useMemo, useState } from "react";
import { FiSearch, FiTrash2 } from "react-icons/fi";
import Avater from "@assets/img/avater.png";
import { toast } from "react-toastify";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import DeleteModal from "@components/deleteModal/DeleteModal";

const AllChatList = ({ allChats, selectedChat, setSelectedChat }) => {
  // Filtered users list
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return allChats;

    return allChats.filter(
      (u) =>
        u.senderFirstName.toLowerCase().includes(search.toLowerCase()) ||
        u.senderLastName.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [allChats, search]);

  const onDelete = (data) => {
    setOpenModal(true);
    setItemToDelete(data);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      const res = await apiClient.delete(`${endpoints.deleteChatHistory}/${itemToDelete}`);

      if (res.status == 200) {
        toast.success("Chat History Deleted");
      }
      window.location.reload();
    } catch (error) {
      toast.error(ErrorFormatter(error));
    } finally {
      setOpenModal(false);
      setItemToDelete(null);
    }
  };

  return (
    <>
      <DeleteModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this ticket?"
      />
      {/* Search Bar */}
      <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center gap-2 px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
          <FiSearch className="text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users or email"
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>
      </div>

      {/* Users List */}
      <ul className="overflow-y-auto h-[400px]">
        {filteredUsers.map((chat) => (
          <li
            key={chat._id}
            className={`group p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${
              selectedChat?._id === chat._id ? "bg-gray-100 dark:bg-gray-800/70" : ""
            }`}
          >
            {/* Avatar */}
            <div className="relative" onClick={() => setSelectedChat(chat)}>
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-400">
                <img src={Avater} className="w-full h-full rounded-full" alt="profile" />
              </div>
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 ${
                  chat.isOnline ? "bg-green-500" : "bg-gray-400"
                }`}
              ></span>
            </div>

            {/* User Info */}
            <div className="min-w-0 flex-1" onClick={() => setSelectedChat(chat)}>
              <p className="font-medium truncate">
                {chat.senderFirstName} {chat.senderLastName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{chat.email}</p>
            </div>

            {/* Unread */}
            {chat.unread && (
              <span className="text-main-green text-xs rounded-full w-6 h-6 flex items-center justify-center p-1">
                New
              </span>
            )}

            {/* Delete Icon - only visible on hover */}
            <button
              onClick={() => onDelete?.(chat._id)}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition ml-2"
            >
              <FiTrash2 size={18} />
            </button>
          </li>
        ))}

        {filteredUsers.length === 0 && (
          <p className="p-4 text-sm text-gray-500 dark:text-gray-400">No users found</p>
        )}
      </ul>
    </>
  );
};

export default AllChatList;
