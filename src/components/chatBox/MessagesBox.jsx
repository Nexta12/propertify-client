import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import { getLocalStorageItem } from "@utils/localStorage";
import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import useAuthStore from "@store/authStore";
import ChatInput from "./ChatInput";
import useSocket from "@context/useSocket";

const MessagesBox = () => {
  const [newMessage, setNewMessage] = useState("");
  const { user } = useAuthStore();
  const [visitorData, setVisitorData] = useState(null);
  const effectiveUser = user || visitorData; // <--- the important fix
  const [typingUser, setTypingUser] = useState(null);
  const socket = useSocket();
  const chatEndRef = useRef(null);
  const [chatMessages, setChatMessages] = useState([]);

  const chatId = getLocalStorageItem("chatId");

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
      setChatMessages((prev) => {
        if (prev.find((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("typing", ({ user }) => setTypingUser(user));
    socket.on("stopTyping", () => setTypingUser(null));

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, [socket]);

  // Join chat
  useEffect(() => {
    if (socket && chatId) {
      socket.emit("joinChat", chatId);
    }
  }, [socket, chatId]);

  // Fetch chat and set visitor if needed
  useEffect(() => {
    const fetchCurrentChat = async () => {
      try {
        const res = await apiClient.get(`${endpoints.fetchCurrentChatById}/${chatId}`);
        const chat = res.data.data;

        // set visitor if no logged-in user
        if (!user) {
          setVisitorData({
            _id: Date.now(),
            firstName: chat?.senderFirstName,
            lastName: chat?.senderLastName,
          });
        }

        const welcomeMessage = {
          id: "welcome",
          senderType: "admin",
          message: `Hello ${chat?.senderFirstName} 👋, Welcome to Propertify Nigeria live chat. One of our experienced professionals will be with you shortly!`,
          createdAt: new Date(),
        };

        const convRes = await apiClient.get(`${endpoints.fetchConversations}/${chatId}`);
        const conversations = convRes.data.data || [];

        setChatMessages([chat, welcomeMessage, ...conversations]);
      } catch (error) {
        toast.error(ErrorFormatter(error));
      }
    };

    if (chatId) fetchCurrentChat();
  }, [chatId, user]);

  // Sender type helper
  const senderType = (u) => {
    if (!u) return "visitor";
    return u.role !== "admin" ? "registered" : "admin";
  };

  // Handle send
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const chatData = {
      message: newMessage,
      senderType: senderType(effectiveUser),
      sender: {
        id: effectiveUser?._id,
        firstName: effectiveUser?.firstName,
        lastName: effectiveUser?.lastName,
      },
    };

    try {
      const res = await apiClient.post(`${endpoints.sendChatConversation}/${chatId}`, chatData);
      const savedMessage = res.data.data;

      setNewMessage("");
      setChatMessages((prev) => [...prev, savedMessage]);
      socket.emit("visitorReply", savedMessage);
      socket.emit("stopTyping", { chatId, user: effectiveUser });
      setTypingUser(null);
    } catch (error) {
      toast.error(ErrorFormatter(error));
    }
  };

  return (
    <div className="flex flex-col h-[400px] bg-gray-50 rounded-2xl shadow-md relative">
      <div className="flex-1 p-2 overflow-y-auto space-y-3">
        {chatMessages.map((msg, i) => (
          <div
            key={msg._id || i}
            className={`flex flex-col max-w-[75%] ${
              msg?.senderType !== "admin" ? "ml-auto items-end" : "items-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-2xl text-sm ${
                msg?.senderType !== "admin"
                  ? "bg-main-green text-white rounded-br-none"
                  : "bg-white text-gray-700 border border-gray-200 rounded-bl-none"
              }`}
            >
              {msg?.message}
            </div>
            <span className="text-[10px] text-gray-400 mt-1">
              {msg?.createdAt
                ? new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </span>
          </div>
        ))}

        {typingUser && (
          <div className="flex items-center space-x-1 text-xs text-gray-400">
            <span className="animate-bounce">•</span>
            <span className="animate-bounce delay-200">•</span>
            <span className="animate-bounce delay-400">•</span>
            <span>{typingUser?.firstName} is typing...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <ChatInput
        handleSend={handleSend}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        socket={socket}
        chatId={chatId}
        user={effectiveUser} // <-- pass the merged user
      />
    </div>
  );
};

export default MessagesBox;
