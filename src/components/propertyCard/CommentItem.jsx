import Avater from "@assets/img/avater.png";
import { FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";
import { endpoints } from "@api/endpoints";
import { apiClient } from "@api/apiClient";
import { toast } from "react-toastify";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import DeleteModal from "@components/deleteModal/DeleteModal";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { timeAgoShort } from "@utils/helper";
import ReplyForm from "./ReplyForm";

const CommentItem = ({ comment, setAllComments, user }) => {
  const isOwner = user?.id === comment.userId?._id;
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [likes, setLikes] = useState(comment.likes || []);
  const [openReplyForm, setOpenReplyForm] = useState(false);
  const [replies, setReplies] = useState([]);

  // ===== Edit handler =====
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiClient.put(`${endpoints.updateComment}/${comment._id}`, {
        content: editText,
      });

      // Update in state
      setAllComments((prev) =>
        prev.map((c) => (c._id === comment._id ? { ...c, content: res.data.data.content } : c))
      );

      setIsEditing(false);
      toast.success("Comment updated");
    } catch (error) {
      toast.error(ErrorFormatter(error));
    }
  };

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const res = await apiClient.get(`${endpoints.getCommentReplies}/${comment._id}`);
        setReplies(res.data.data || []);
      } catch (error) {
        console.error("Error fetching replies:", error);
      }
    };

    fetchReplies();
  }, [comment._id]);

  const handleDeleteComment = async () => {
    if (!commentToDelete) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`${endpoints.deleteComment}/${commentToDelete}`);
      setAllComments((prev) => prev.filter((c) => c._id !== commentToDelete));
      setOpenModal(false);
      toast.success("Comment deleted");
    } catch (error) {
      toast.error(ErrorFormatter(error));
    } finally {
      setIsDeleting(false);
      setCommentToDelete(null);
    }
  };

  const renderMedia = () => {
    if (!comment.attachment || comment.attachment.length === 0) return null;

    return (
      <div className=" mt-2 rounded-xl overflow-hidden">
        {comment?.attachment[0].type === "image" ? (
          <img
            src={comment?.attachment[0]?.url}
            alt="img"
            className="w-full h-full max-h-[470px] object-contain"
          />
        ) : (
          <video controls className="w-full h-full max-h-[570px] object-contain">
            <source src={comment?.attachment[0]?.url} type="video/mp4" />
          </video>
        )}
      </div>
    );
  };

  const handleLike = async (commentId) => {
    try {
      await apiClient.post(`${endpoints.reactToComment}/${commentId}`);

      if (likes.includes(user.id)) {
        setLikes((prev) => prev.filter((id) => id !== user.id));
      } else {
        setLikes((prev) => [...prev, user.id]);
      }
    } catch (error) {
      toast.error(ErrorFormatter(error));
    }
  };

  return (
    <>
      <DeleteModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={handleDeleteComment}
        message="Are you sure you want to delete this comment?"
        isDeleting={isDeleting}
      />

      <div className="flex space-x-3 mb-2 group">
        {/* Avatar */}
        <img
          src={comment?.userId?.profilePic || Avater}
          alt="avatar"
          className="w-8 h-8 rounded-full"
        />

        <div className="flex-1">
          {/* Comment bubble */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-2 text-sm relative">
            <span className="font-semibold text-gray-800 dark:text-gray-100 flex items-center">
              {comment?.userId?.firstName} {comment?.userId?.lastName}
              {comment?.userId?.isVerifiedUser && (
                <RiVerifiedBadgeFill className="ml-1 text-blue-500" title="Duly Verified user" />
              )}
            </span>

            {/* Edit mode OR text */}
            {isEditing ? (
              <form onSubmit={handleEditSubmit} className="mt-2 flex items-center gap-2">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="flex-1 p-2 text-sm rounded border dark:bg-gray-700 dark:text-white"
                  rows={2}
                />
                <button type="submit" className="bg-main-green text-white px-3 py-1 rounded">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-gray-500 px-2"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <p className="mt-1 text-gray-700 dark:text-gray-200">
                {comment.content}

                {/* Media (only when not editing) */}
                {!isEditing && renderMedia()}
              </p>
            )}

            {/* Edit + Delete actions (hover) */}
            {isOwner && !isEditing && (
              <div className="absolute top-1 right-1 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-gray-400 hover:text-blue-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setOpenModal(true);
                    setCommentToDelete(comment?._id);
                  }}
                  className="text-gray-400 hover:text-red-500"
                >
                  <FaTrash />
                </button>
              </div>
            )}
          </div>

          {/* Bottom actions */}
          <div className="text-xs text-gray-500 mt-1 flex items-center gap-x-4">
            {timeAgoShort(comment?.createdAt)}

            <button
              onClick={() => handleLike(comment?._id)}
              className={`cursor-pointer ${
                likes.includes(user?.id) ? "text-blue-500 font-semibold" : ""
              }`}
            >
              Like <span className="text-[10px] font-semibold">({likes.length})</span>
            </button>

            {user && <span>|</span>}

            {user && <button onClick={() => setOpenReplyForm(true)}>Reply</button>}
          </div>

          {/* Replies */}
          <div className="ml-4 mt-2 space-y-2">
            {replies.map((reply) => (
              <CommentItem
                key={reply._id}
                comment={reply}
                setAllComments={setReplies}
                user={user}
              />
            ))}
          </div>

          {/* Reply form */}
          {openReplyForm && <ReplyForm parentCommentId={comment?._id} />}
        </div>
      </div>
    </>
  );
};

export default CommentItem;
