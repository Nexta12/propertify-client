import useAuthStore from "@store/authStore";
import { useState } from "react";
import DOMPurify from "dompurify";
import { BsSend } from "react-icons/bs";
import EnhancedTextArea from "@components/ui/EnhancedTextArea";
import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import { toast } from "react-toastify";
import Avater from "@assets/img/avater.png";
import DeleteModal from "@components/deleteModal/DeleteModal";
import { formatDistanceToNow } from "date-fns";
import { FaTrash } from "react-icons/fa";

const Comments = ({ post, allComments, setAllComments }) => {
  const [comment, setComment] = useState("");
  const { user } = useAuthStore();
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!commentToDelete) return;

    setIsDeleting(true);
    try {
      if (commentToDelete) {
        // Delete comment
        await apiClient.delete(`${endpoints.deleteComment}/${commentToDelete}`);
        toast.success("Comment Deleted");

        // Remove comment locally from UI
        setAllComments((prevComments) =>
          prevComments.filter((c) => c._id !== commentToDelete)
        );
      }

      setOpenModal(false);
    } catch (error) {
      toast.error(ErrorFormatter(error));
    } finally {
      setIsDeleting(false);
      setCommentToDelete(null);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!comment) {
      return toast.error("Empty comment not allowed");
    }

    const commentData = {
      propertyId: post._id,
      comment: DOMPurify.sanitize(comment.trim(), {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
        KEEP_CONTENT: true,
      }),
    };

    try {
      const response = await apiClient.post(endpoints.postComment, commentData);
     
      // Append the new comment to the existing comments
      setAllComments((prevComments) => [response.data.data, ...prevComments]);
      toast.success("Comment added");
      setComment("");
    } catch (error) {
      toast.error(ErrorFormatter(error));
    }
  };

  const deleteComment = async (commentId) => {
    setOpenModal(true);
    setCommentToDelete(commentId);
  };

  return (
    <>
      <DeleteModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={confirmDelete}
        message={`Are you sure you want to delete this comment?`}
        isDeleting={isDeleting}
      />

<div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 relative flex flex-col max-h-[500px]">
  {/* Scrollable comments */}
  <div className="flex-1 overflow-y-auto pr-1">
    {allComments?.length > 0 ? (
      allComments.map((comment, index) => (
        <div key={index} className="mb-3">
          <div className="flex items-start space-x-2">
            <img
              src={comment?.userId?.profilePic || user.profilePic || Avater}
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
            <div>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2">
                <span className="font-semibold text-sm dark:text-gray-100">
                  {comment?.userId?.firstName || user.firstName }  {comment?.userId?.lastName || user.lastName }
                </span>
                <p className="text-sm dark:text-gray-200">{comment?.comment}</p>
              </div>
              <div className="flex items-center gap-4 mt-1">
                {comment?.createdAt && (
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 capitalize">
                    {formatDistanceToNow(new Date(comment?.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                )}
                {user && comment?.userId?._id === user.id && (
                  <button
                    onClick={() => deleteComment(comment?._id)}
                    role="button"
                    title="delete"
                  >
                    <FaTrash className="text-red-400 text-[10px]" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))
    ) : (
      <p className="text-center text-gray-500 dark:text-gray-400 text-sm py-2">
        No comments yet
      </p>
    )}
  </div>

  {/* Comment form fixed at footer */}
  {user?.firstName && user?.lastName ? (
    <form
      className="flex items-center gap-1 border-t border-gray-200 dark:border-gray-700 px-2 pt-2 bg-white dark:bg-gray-900"
      onSubmit={handleCommentSubmit}
    >
      <div className="flex-grow">
        <EnhancedTextArea
          name="comment"
          label="Drop a comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-1 !rounded-2xl overflow-hidden focus:border-main-green focus:ring-0 outline-none resize-none transition dark:bg-gray-800 dark:text-gray-100"
        />
      </div>
      <button
        type="submit"
        title="Send"
        className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition p-2"
      >
        <BsSend className="text-2xl text-main-green" />
      </button>
    </form>
  ) : (
    <>
      {user && (
        <div className="text-center text-[12px] italic text-red-500 mt-2 px-4">
          Please complete your profile in settings to be able to comment.
        </div>
      )}
    </>
  )}
</div>


    </>
  );
};

export default Comments;
