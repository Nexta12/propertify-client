import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import Button from "@components/ui/Button";
import EnhancedInput from "@components/ui/EnhancedInput";
import EnhancedEditor from "@components/ui/EnhancedTextArea";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import useAuthStore from "@store/authStore";
import { getLocalStorageItem, setLocalStorageItem } from "@utils/localStorage";
import React, { useEffect, useState } from "react";
import { IoChatbubblesOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import DOMPurify from "dompurify";

const WelcomeBox = ({ onStarted }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const { user } = useAuthStore();

  const senderType = (user) => {
    if (!user) return "visitor";
    return user.role !== "admin" ? "registered" : "admin";
  };

  // 🔹 Single chat initiation function (used by both cases)
  const initiateChat = async (data, autoStart = false) => {
     autoStart ? setInitializing(true) : setLoading(true);

    try {
      const response = await apiClient.post(
        endpoints.InitiateChatWithAdmin,
        data
      );
      if (response.status === 201) {
        setLocalStorageItem("chatId", response.data.data._id);
        onStarted();
      }
    } catch (error) {
      toast.error(ErrorFormatter(error));
    } finally {
      autoStart ? setInitializing(false) : setLoading(false);
    }
  };

  // 🔹 If user is logged in, auto-start chat
  useEffect(() => {
    const chatId = getLocalStorageItem("chatId");
    if (chatId) return onStarted();

    if (user) {
      initiateChat({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        senderType: senderType(user),
        message: "knock! knock!! knock!!!",
      },  true );

    }
  }, [user, onStarted]);

  // 🔹 Form submit for visitors
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !message || !email) {
      toast.error("Complete the form");
      return;
    }

    await initiateChat({
      firstName,
      lastName,
      email,
      senderType: senderType(user),
      message: DOMPurify.sanitize(message.trim(), {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
        KEEP_CONTENT: true,
      }),
    });
  };

    if (initializing) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <p className="mt-4 text-gray-600 text-sm">
          Preparing your chat...
        </p>
      </div>
    );
  }


  return (
   <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 text-center">
    👋 Welcome to Propertify Chat
  </h2>
  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
    Fill in your details to start chatting with us
  </p>

  {/* Only render form if user not logged in */}
  {!user && (
    <form onSubmit={handleSubmit} className="space-y-4">
      <EnhancedInput
        name="firstName"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
      />
      <EnhancedInput
        name="lastName"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
      />
      <EnhancedInput
        name="email"
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <EnhancedEditor
        name="message"
        placeholder="Type your message..."
        rows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      />

      <Button
        type="submit"
        variant="success"
        className="w-full pb-2 flex items-center justify-center gap-2 rounded-lg font-medium transition hover:scale-105"
      >
        <IoChatbubblesOutline size={18} />
        {loading ? "Loading Chat..." : "Start Chat"}
      </Button>
    </form>
  )}
</div>

  );
};

export default WelcomeBox;
