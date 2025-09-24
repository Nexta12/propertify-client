import EnhancedInput from "@components/ui/EnhancedInput";
import { BsEmojiSmile } from "react-icons/bs";
import { FiSend } from "react-icons/fi";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useState } from "react";

const ChatInput = ({ handleSend, newMessage, setNewMessage, socket, chatId, user }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);

  // Handle emoji select
  const handleEmojiSelect = (emoji) => {
    setNewMessage((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (socket && chatId) {
      socket.emit("typing", { chatId, user });

      // clear previous timeout
      if (typingTimeout) clearTimeout(typingTimeout);

      // after 2s of inactivity, emit stopTyping
      setTypingTimeout(
        setTimeout(() => {
          socket.emit("stopTyping", { chatId, user });
        }, 2000)
      );
    }
  };

  return (
    <>
      {showEmojiPicker && (
        <div className="absolute bottom-16 left-3 z-50">
          <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="light" />
        </div>
      )}
      <form
        onSubmit={(e) => {
          handleSend(e);
          setShowEmojiPicker(false); // 👈 close after sending
        }}
        className="flex items-center p-3 border-t bg-white dark:bg-gray-800 rounded-b-2xl"
      >
        <button
          type="button"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          className="mr-2 text-gray-500 hover:text-yellow-500 transition"
        >
          <BsEmojiSmile size={22} />
        </button>

        <EnhancedInput
          name="newMessage"
          placeholder="Type a message..."
          value={newMessage}
          onChange={handleTyping}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              handleSend(e);
            }
          }}
          className="flex-1"
        />
        <button type="submit" className="ml-2 p-2 text-main-green hover:text-green-600 transition">
          <FiSend size={22} />
        </button>
      </form>
    </>
  );
};

export default ChatInput;
