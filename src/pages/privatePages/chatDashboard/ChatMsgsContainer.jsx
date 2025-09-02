import React, { useEffect, useRef } from "react";

const ChatMsgsContainer = ({ chatMessages, typing }) => {
  const chatEndRef = useRef(null);
  // Auto scroll to bottom when messages change

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [chatMessages]);

  return (
    <>
    <div className="">
      {chatMessages.map((msg, i) => (
        <div
          key={i}
          className={`flex flex-col max-w-[75%] ${
            msg?.senderType == "admin" ? "ml-auto items-end" : "items-start"
          }`}
        >
          <div
            className={`px-4 py-2 rounded-2xl text-sm ${
              msg?.senderType == "admin"
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

      {/* Typing indicator */}
      {typing && (
        <div className="flex items-center space-x-1 text-xs text-gray-400">
          <span className="animate-bounce">•</span>
          <span className="animate-bounce delay-200">•</span>
          <span className="animate-bounce delay-400">•</span>
          <span>{typing} is typing...</span>
        </div>
      )}

      
    </div>
    <div  ref={chatEndRef} />
    </>
  );
};

export default ChatMsgsContainer;
