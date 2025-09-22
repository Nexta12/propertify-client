import { BsSend, BsImage } from "react-icons/bs";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

import FileUpload from "@components/ui/FileUpload";
import { useCallback, useEffect, useRef, useState } from "react";
import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import { toast } from "react-toastify";
import DOMPurify from "dompurify";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";

const CommentForm = ({ post, setAllComments }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [attachment, setAttachment] = useState(null);

  const textareaRef = useRef();
  const fileUploadRef = useRef();

  const handleEmojiSelect = (emoji) => {
    setCommentText((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  const handleAttachmentClick = () => fileUploadRef.current?.open();

  const handleFileChange = useCallback((_, file) => {
    setAttachment(file); // store file directly
  }, []);

  const getImageSrc = (file) => {
    if (!file) return null;
    if (typeof file === "string") return file;
    if (file instanceof File) return URL.createObjectURL(file);
    return null;
  };

  // ===== Auto-resize textarea =====
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.padding = "5px";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }, [commentText]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
 if (!commentText && !attachment) {
  return toast.error("Cannot post empty comment");
}


    const dataToSend = {
      propertyId: post._id,
      content: DOMPurify.sanitize(commentText.trim(), {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
        KEEP_CONTENT: true,
      }),
      attachment: attachment,
    };

    try {
      const res = await apiClient.post(endpoints.postComment, dataToSend);
      setAllComments((prev) => [res.data.data, ...prev]);
      setCommentText("");
      setAttachment(null);
      toast.success("Comment posted!");
    } catch (error) {
      toast.error(ErrorFormatter(error));
    }
  };



  return (
    <div className="px-2 pt-2 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <form
        onSubmit={handleCommentSubmit}
        className="flex  items-center space-x-2 relative"
      >
        <textarea
          ref={textareaRef}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 !p-3 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm resize-none focus:outline-none focus:border-main-green overflow-hidden"
          rows={1}
        />

        <button
          type="button"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          className="text-gray-500 hover:text-gray-700 text-lg"
        >
          😊
        </button>

        {showEmojiPicker && (
          <div className="absolute bottom-12 right-4 z-50">
            <Picker
              data={data}
              onEmojiSelect={handleEmojiSelect}
              theme="light"
            />
          </div>
        )}

        <button
          type="button"
          onClick={handleAttachmentClick}
          className="text-gray-500 hover:text-gray-700 text-lg"
        >
          <BsImage />
        </button>

        <FileUpload
          ref={fileUploadRef}
          value={attachment}
          onChange={(file) => handleFileChange("attachment", file)}
          multiple={false}
          maxFiles={1}
          accept="image/*,video/*"
          className="hidden"
        />

        <button
          type="submit"
          className="bg-main-green text-white p-2 rounded-full hover:brightness-110 transition"
        >
          <BsSend className="rotate-45 text-lg" />
        </button>
      </form>

      {/* Attachment Preview */}
      {attachment && (
        <div className="mt-2 rounded-lg overflow-hidden max-h-48 w-full">
          <img
            src={getImageSrc(attachment.url)}
            alt="attachment"
            className="w-[122px] h-full object-cover"
          />
        </div>
      )}
    </div>
  );
};

export default CommentForm;
