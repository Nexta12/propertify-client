import useAuthStore from "@store/authStore";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

const Comments = ({ post, allComments, setAllComments }) => {
  // ===== Handlers =====
  const { user } = useAuthStore();
  return (
    <>
      <div className="flex flex-col border-t border-gray-200 dark:border-gray-700 pt-2">
        {/* Comments list */}
        <div className="flex-1 overflow-y-auto pr-1">
          {allComments?.length > 0 ? (
            allComments.map((c) => (
              <CommentItem key={c._id} comment={c} setAllComments={setAllComments} user={user} />
            ))
          ) : (
            <p className="text-center text-gray-400 py-2">No comments yet</p>
          )}
        </div>

        {/* Comment input */}

        {user?.firstName && user?.lastName ? (
          <CommentForm post={post} setAllComments={setAllComments} />
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
