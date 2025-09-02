import React, { useEffect, useState } from "react";
import AdminChatHeader from "./AdminChatHeader";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import { toast } from "react-toastify";
import AllChatList from "./AllChatList";
import ChatInput from "@components/chatBox/chatInput";
import ChatMsgsContainer from "./ChatMsgsContainer";
import useSocket from "@context/useSocket";
import useAuthStore from "@store/authStore";


const ChatDashBoard = () => {
  // Auto-scroll
  const [selectedChat, setSelectedChat] = useState(null);
  const [allChats, setAllChats] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const socket = useSocket();
  const { user } = useAuthStore();
  const [typingUser, setTypingUser] = useState(null);

  useEffect(() => {
    if (!socket) return;
    socket.on("typing", ({ user }) => {
      setTypingUser(user.firstName || "Someone");
    });

    socket.on("stopTyping", () => {
      setTypingUser(null);
    });

    const handleNewMessage = (msg) => {
      setChatMessages((prev) => {
        if (prev.find((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("typing");
      socket.off("stopTyping");
      socket.off("newMessage");
    
    };
  }, [socket]);

  //  Fetch All Chats



  useEffect(() => {

      const fetchAllChats = async () => {
      try {
        const res = await apiClient.post(endpoints.fetchAllChats);

        setAllChats(res.data.data);
      } catch (error) {
        toast.error(ErrorFormatter(error));
      }
    };

    fetchAllChats();

  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      setAllChats((prev) => {
        if (prev.find((msg) => msg._id === newMessage._id)) {
          return prev; // skip duplicate
        }
        return [newMessage, ...prev];
      });
    };

    socket.on("fetchNewChat", handleNewMessage);

    // Cleanup to avoid duplicate bindings
    return () => {
      socket.off("fetchNewChat", handleNewMessage);
    };
  }, [socket]);

  const handleSend = async (e) => {
    e.preventDefault();

    const data = {
      message: newMessage,
      senderType: "admin",
      chatId: selectedChat._id,
      sender: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };

    try {
      const res = await apiClient.post(
        `${endpoints.sendChatConversation}/${selectedChat._id}`,
        data
      );
      setNewMessage("");
      const savedMessage = res.data.data;
      setChatMessages((prev) => [...prev, savedMessage]);
      socket.emit("adminReply", savedMessage);
    } catch (error) {
      toast.error(ErrorFormatter(error));
    }
  };

  // Fetch all Related conversations to the selected chat
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await apiClient.get(
          `${endpoints.fetchConversations}/${selectedChat._id}`
        );
        const data = res.data.data;
        setChatMessages([selectedChat, ...data]);
      } catch (error) {
        toast.error(ErrorFormatter(error));
      }
    };

    if (selectedChat?._id) {
      fetchConversations();
    }
  }, [selectedChat, selectedChat?._id]);

  // Step 1. Set a room with the chat Id for the client and Admin to chat within admin will join this room by selecting the chat history (chatId)

  useEffect(() => {
    if (socket && selectedChat?._id) {
      socket.emit("joinChat", selectedChat._id);
    }
  }, [socket, selectedChat]);

  // 2. Notify The Visitor that you have joined the room by selecting his chatId
  useEffect(() => {
    if (selectedChat != null) {
      socket.emit("AdminJoinedChat", { user, selectedChat });
    }
    return () => {
      socket?.off("AdminJoinedChat");
    };
  }, [socket, selectedChat, user]);

  return (
    <div className=" flex items-start   bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar (User List) */}
      <div
        className={`${
          selectedChat ? "hidden md:flex" : "flex"
        } w-full md:w-1/3 flex-col border-r border-l border-gray-300 dark:border-gray-700 bg-white h-screen overflow-y-auto dark:bg-gray-950 `}
      >
        <h2 className="p-4 font-semibold text-lg border-b dark:border-gray-700">
          Conversations
        </h2>

        {/* User List */}
        <AllChatList
          allChats={allChats}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
        />
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col h-[550px] overflow-y-auto ">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <AdminChatHeader
              selectedChat={selectedChat}
              setSelectedChat={setSelectedChat}
            />

            {/* Messages Body */}
            <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
              <ChatMsgsContainer
                chatMessages={chatMessages}
                typing={typingUser}
              />
            </div>

            {/* Input */}
            <div className="relative bg-white dark:bg-gray-800  ">
              <ChatInput
                handleSend={handleSend}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                socket={socket}
                chatId={selectedChat?._id}
                user={user}
              />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-500 dark:text-gray-400">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatDashBoard;
