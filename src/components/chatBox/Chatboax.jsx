import { FiMinus } from "react-icons/fi";
import { IoChatbubblesOutline, IoCloseSharp } from "react-icons/io5";
import WelcomeBox from "./WelcomeBox";
import MessagesBox from "./MessagesBox";
import { useEffect, useState } from "react";
import { getLocalStorageItem, removeLocalStorageItem } from "@utils/localStorage";
import useSocket from "@context/useSocket";
import Avater from "@assets/img/avater.png";
import ChatCloserModal from "./ChatCloserModal";

const Chatboax = ({ expanded, setExpanded }) => {
  const [chatStarted, setChartStarted] = useState(false);
  const [handleCloseChatToggle, setHandleCloseChatToggle] = useState(false);
  const [joinedUser, setJoinedUser] = useState(null);
  const socket = useSocket();
  const chatId = getLocalStorageItem("chatId");

  useEffect(() => {
    if (chatId) {
      setChartStarted(true);
    } else {
      setChartStarted(false);
    }
  }, [chatId]);

  const handleEndChat = () => {
    if (socket && chatId) {
      socket.emit("setUserOffline", chatId);
    }

    removeLocalStorageItem("chatId");
    setChartStarted(false);
    setJoinedUser(null);
    setHandleCloseChatToggle(false);
    setExpanded(false);
  };

  // Step 1. Set a room with the chat Id for the client and Admin to chat within admin will join this room by selecting the chat history (chatId)
  useEffect(() => {
    const chatId = getLocalStorageItem("chatId");
    if (socket && chatId) {
      socket.emit("joinChat", chatId);
    }
  }, [socket]);

  // 2. Recieve response from Server when Admin Joins and Chat starts
  useEffect(() => {
    if (!socket) return;
    const handleChatStarted = (payload) => {
      const { fullName, profilePic } = payload;

      const user = { fullName, profilePic };

      setJoinedUser(user);
    };

    const handleChatEnded = (payload) => {
      const { selectedChat } = payload;

      if (selectedChat?._id === chatId) {
        setJoinedUser(null); // clear admin details from state
      }
    };

    socket.on("chatStarted", handleChatStarted);
    socket.on("chatEnded", handleChatEnded);

    return () => {
      socket.off("chatStarted", handleChatStarted);
      socket.off("chatEnded", handleChatEnded);
    };
  }, [socket, chatId]);

  return (
    <div className="fixed bottom-8 md:bottom-6 right-4 sm:right-6 z-50">
      {/* Floating chat button */}
      {!expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="p-2 bg-main-green text-white rounded-full shadow-lg hover:bg-green-600 transition-all animate-bounce"
        >
          <IoChatbubblesOutline size={28} />
        </button>
      )}

      {/* Chatbox */}
      {expanded && (
        <div className="w-[90vw] md:w-96 bg-bg-green dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center bg-main-green text-white px-4 py-4">
            {joinedUser ? (
              <div className="flex items-center gap-x-2">
                <div className="relative flex">
                  <img
                    src={joinedUser?.profilePic || Avater}
                    alt="profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className=" absolute -bottom-1 right-0  w-3 h-3 rounded-full bg-green-200 shadow-lg"></span>
                </div>

                <div className="flex flex-col gap-y-0">
                  <span className="font-semibold tracking-wide">{joinedUser?.fullName}</span>
                  <span className="text-xs">Customer Assistant</span>
                </div>
              </div>
            ) : (
              <p className="font-semibold text-sm md:text-lg">Propertify Nigeria</p>
            )}

            <div className="flex space-x-2">
              <button onClick={() => setExpanded(false)} className="hover:text-gray-200 transition">
                <FiMinus size={18} title="Minimize" />
              </button>
              <button
                onClick={() => {
                  (setHandleCloseChatToggle(true), setExpanded(false));
                }}
                className="hover:text-gray-200 transition"
              >
                <IoCloseSharp size={20} title="End Chat" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 p-4 text-gray-700 overflow-y-auto">
            {/* Chat CLose Handler */}

            {chatStarted ? (
              !handleCloseChatToggle ? (
                <MessagesBox />
              ) : (
                <ChatCloserModal
                  handleEndChat={handleEndChat}
                  setHandleCloseChatToggle={setHandleCloseChatToggle}
                />
              )
            ) : (
              <WelcomeBox onStarted={() => setChartStarted(true)} />
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-2 text-xs text-gray-500 text-center">
            &copy; powered by{" "}
            <a href="/" className="text-main-green font-medium hover:underline">
              Nextapps
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatboax;
