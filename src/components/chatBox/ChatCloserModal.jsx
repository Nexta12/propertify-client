import Button from "@components/ui/Button";
import HeaderTitle from "@components/ui/HeaderTitle";

const ChatCloserModal = ({ handleEndChat, setHandleCloseChatToggle }) => {
  return (
    <div className="h-[350px] flex items-center justify-center bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-6 flex-col space-y-4 border border-gray-200 text-center dark:text-gray-200 ">
      <HeaderTitle titleText="Really Want to Close the Chat ?" />
      <span className="text-sm text-wrap dark:text-gray-200 ">
        The current session may be cleared and you may have to login afresh ?{" "}
      </span>
      <div className="flex space-x-2">
        <Button onClick={() => handleEndChat()} type="button" variant="orange">
          End Chat
        </Button>
        <Button onClick={() => setHandleCloseChatToggle(false)} type="button" variant="success">
          Back
        </Button>
      </div>
    </div>
  );
};

export default ChatCloserModal;
