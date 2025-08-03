import React, { useEffect, useRef, useState } from "react";
import { FaBed, FaBath, FaRulerCombined, FaTrash } from "react-icons/fa";
import { FiMoreVertical, FiMessageSquare, FiShare2 } from "react-icons/fi";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { formatDistanceToNow } from "date-fns";
import { formatLargeNumber, formatTitleCase } from "@utils/helper";
import Avater from "@assets/img/avater.png";
import useAuthStore from "@store/authStore";
import { Link } from "react-router-dom";
import { paths } from "@routes/paths";
import DeleteModal from "@components/deleteModal/DeleteModal";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import { toast } from "react-toastify";
import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import FavouriteProperty from "./FavouriteProperty";
import { BsSend } from "react-icons/bs";
import EnhancedTextArea from "@components/ui/EnhancedTextArea";
import SocialShare from "./SocialShare";
import DOMPurify from "dompurify";

const PostCard = ({ post, isProperty, onDeleteSuccess }) => {
  const [showComments, setShowComments] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const { user } = useAuthStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState([]);
  const optionsRef = useRef(null);

  const renderMedia = () => {
    if (!post.media || post.media.length === 0) return null;

    if (post.media.length === 1) {
      return (
        <Link to={`${paths.properties}/${post.slug}`}>
          <div className="mt-3 rounded-xl overflow-hidden">
            {post.media[0]?.type === "image" ? (
              <img
                src={post.media[0]?.url}
                alt="Property"
                className="w-full h-64 object-cover"
              />
            ) : (
              <video controls className="w-full h-64 object-cover">
                <source src={post.media[0].url} type="video/mp4" />
              </video>
            )}
          </div>
        </Link>
      );
    }

    if (post.media.length === 3) {
      return (
        <Link to={`${paths.properties}/${post.slug}`}>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {post.media.map((item, index) => (
              <div
                key={index}
                className="relative rounded-lg overflow-hidden h-32"
              >
                {item.type === "image" ? (
                  <img
                    src={item.url}
                    alt={`Property ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video controls className="w-full h-full object-cover">
                    <source src={item.url} type="video/mp4" />
                  </video>
                )}
              </div>
            ))}
          </div>
        </Link>
      );
    }

    return (
      <Link to={`${paths.properties}/${post.slug}`}>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {post.media.slice(0, 4).map((item, index) => (
            <div
              key={index}
              className="relative rounded-lg overflow-hidden h-32"
            >
              {item.type === "image" ? (
                <img
                  src={item.url}
                  alt={`Property ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <video controls className="w-full h-full object-cover">
                  <source src={item.url} type="video/mp4" />
                </video>
              )}
              {index === 3 && post.media.length > 4 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-bold">
                  +{post.media.length - 4} more
                </div>
              )}
            </div>
          ))}
        </div>
      </Link>
    );
  };

  const renderPropertyDetails = () => {
    if (!isProperty) return null;

    return (
      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold capitalize">
            {" "}
            {post.currency || "₦"} {formatLargeNumber(post.price)} /{" "}
            {post.frequency}{" "}
          </span>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            {post.purpose}
          </span>
        </div>
        <Link to={`${paths.properties}/${post.slug}`}>
          <h3 className="text-lg font-semibold">{post.title}</h3>
        </Link>
        <div className="flex items-center text-gray-500 text-sm mt-1 capitalize">
          <span>
            {post.location} {post.city} {post.state}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {post.documentType && (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full capitalize">
              {formatTitleCase(post.documentType)}
            </span>
          )}
          {post.propertyType && (
            <span className="px-2 py-1 bg-yellow-100 text-orange text-xs rounded-full">
              {formatTitleCase(post.propertyType)}
            </span>
          )}

          {post.condition && (
            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
              {formatTitleCase(post.condition)}
            </span>
          )}
        </div>

        <p className="text-gray-700 whitespace-pre-line text-[15px] !my-6 ">
          {post.description}
        </p>

        <div className="flex items-center space-x-4 text-sm mt-3">
          {post.beds && (
            <span className="flex items-center">
              <FaBed className="mr-1" /> {post.beds} Beds
            </span>
          )}

          {post.baths && (
            <span className="flex items-center">
              <FaBath className="mr-1" /> {post.baths} Baths
            </span>
          )}
          {post.size && (
            <span className="flex items-center">
              <FaRulerCombined className="mr-1" /> {post.size}{" "}
              {post.propertySizeUnit}
            </span>
          )}
        </div>
      </div>
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    if (showOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showOptions]);

  const handleDelete = (post) => {
    setOpenModal(true);
    setItemToDelete(post._id);
    setShowOptions(false);
  };

  const confirmDelete = async () => {
    if (!itemToDelete && !commentToDelete) return;

    setIsDeleting(true);
    try {
      if (itemToDelete) {
        // Delete post
        await apiClient.delete(`${endpoints.deleteListing}/${itemToDelete}`);
        toast.success("Listing Deleted");

        onDeleteSuccess?.(itemToDelete); // Notify parent to remove the post
      }

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
      setItemToDelete(null);
      setCommentToDelete(null);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

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
      // toast.success("Comment added");
      setComment("");
    } catch (error) {
      toast.error(ErrorFormatter(error));
    }
  };

  const deleteComment = async (commentId) => {
    setOpenModal(true);
    setCommentToDelete(commentId);
  };

  // FetCh Post Comment.
  useEffect(() => {
    const fetchPostComments = async () => {
      try {
        const response = await apiClient.get(
          `${endpoints.fetchPostComment}/${post._id}`
        );

        setAllComments(response.data.data);
      } catch (error) {
        toast(ErrorFormatter(error));
      }
    };

    fetchPostComments();
  }, [post]);

  // Hit The Current Property in View to count it a views
  useEffect(() => {
    const trackViewNoClicks = async () => {
      try {
        await apiClient.get(`${endpoints.trackViewNoClicks}/${post._id}`);
      } catch (error) {
        toast(ErrorFormatter(error));
      }
    };

    trackViewNoClicks();
  }, [post._id]);

  return (
    <div className="border border-gray-200 rounded-xl p-4 mb-4 bg-white">
      <DeleteModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={confirmDelete}
        message={`Are you sure you want to delete this ${
          commentToDelete ? "comment" : "post"
        }?`}
        isDeleting={isDeleting}
      />

      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <Link
            to={
              user
                ? `${paths.protected}/profile/${post.owner.slug}`
                : `${paths.properties}/${post.slug}`
            }
          >
            <img
              src={post.owner.profilePic || Avater}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
          </Link>

          <div>
            <div className="flex items-center">
              <Link
                to={
                  user
                    ? `${paths.protected}/profile/${post.owner?.slug}`
                    : `${paths.properties}/${post.slug}`
                }
              >
                <span className="font-semibold">
                  {post?.owner?.title} {post?.owner?.firstName}{" "}
                  {post?.owner?.lastName}{" "}
                </span>
              </Link>
              {post.owner.isVerifiedUser && (
                <RiVerifiedBadgeFill className="ml-1 text-blue-500" />
              )}
            </div>
            <span className="text-xs text-gray-500 capitalize ">
              {post?.owner?.companyDetails?.companyName}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500 capitalize">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </span>
          {user?.id === post.owner._id && (
            <div className="relative">
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <FiMoreVertical />
              </button>

              {showOptions && (
                <div
                  ref={optionsRef}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
                >
                  <Link
                    to={`${paths.protected}/${
                      post.isProperty ? "properties" : "posts"
                    }/edit/${post.slug}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Edit Post
                  </Link>

                  <button
                    onClick={() => handleDelete(post)}
                    className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                  >
                    Delete Post
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {!isProperty && (
        <div className="mt-3">
          <p>{post.description}</p>
        </div>
      )}

      {renderMedia()}
      {renderPropertyDetails()}

      {/* Footer */}
      <div className="flex justify-between mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-1 text-gray-500">
          <span className="text-xs">{post?.views} views</span>
        </div>

        <div className="flex items-center space-x-4">
          <FavouriteProperty property={post} className="p-2" />

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-1 text-gray-500"
          >
            <FiMessageSquare />
            <span>{allComments?.length || 0}</span>
          </button>

          <div className="relative">
            <Link
              to={"#"}
              onClick={() => setShowShareOptions(!showShareOptions)}
              className="flex items-center space-x-1 text-gray-500"
            >
              <SocialShare />
            </Link>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-3 pt-3 border-t border-gray-100 max-h-64 overflow-y-auto">
          {user?.firstName && user?.lastName ? (
            <form
              className="mx-4 flex items-center gap-3"
              onSubmit={handleCommentSubmit}
            >
              <div className="flex-grow">
                <EnhancedTextArea
                  name="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleCommentSubmit(e);
                    }
                  }}
                  className="w-full p-4 rounded-md border border-gray-300 focus:border-main-green focus:ring-0 outline-none resize-none transition"
                />
              </div>
              <button
                type="submit"
                title="Send"
                className="p-2 rounded-full hover:bg-gray-100 transition"
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

          {allComments?.length > 0 ? (
            allComments.map((comment, index) => (
              <div key={index} className="mb-3">
                <div className="flex items-start space-x-2">
                  <img
                    src={comment?.userId?.profilePic || Avater}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <div className="bg-gray-100 rounded-lg p-2">
                      <span className="font-semibold text-sm">
                        {comment?.userId?.firstName}
                      </span>
                      <p className="text-sm">{comment?.comment}</p>
                    </div>
                    <div className=" flex items-center gap-4 mt-2">
                      {comment?.createdAt && (
                      <span className="text-xs text-gray-500 capitalize">
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
            <p className="text-center text-gray-500 text-sm py-2">
              No comments yet
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;
