import React, { useEffect, useRef, useState } from "react";
import { FaBed, FaBath, FaRulerCombined } from "react-icons/fa";
import { FiMoreVertical, FiMessageSquare } from "react-icons/fi";
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
import SocialShare from "./SocialShare";
import Comments from "./Comments";
import PropertyPlaceholder from "@assets/img/placeholder.webp";

const PostCard = ({ post, isProperty, onDeleteSuccess }) => {
  const [showComments, setShowComments] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const { user } = useAuthStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [allComments, setAllComments] = useState([]);
  const optionsRef = useRef(null);

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

  const renderMedia = () => {
    if (!post.media || post.media.length === 0) return null;

    if (post.media.length === 1) {
      return (
        <Link to={`${paths.properties}/${post.slug}`}>
          <div className="mt-3 rounded-xl overflow-hidden">
            {post.media[0]?.type === "image" ? (
              <img
                src={post.media[0]?.url || PropertyPlaceholder}
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
                    src={item.url || PropertyPlaceholder}
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
                  src={item.url || PropertyPlaceholder}
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
      <div className="mt-3 space-y-2 text-gray-900 dark:text-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold capitalize">
            {post.currency || "₦"} {formatLargeNumber(post.price)} /{" "}
            {post.frequency}
          </span>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs rounded-full">
            {post.purpose}
          </span>
        </div>

        <Link to={`${paths.properties}/${post.slug}`}>
          <h3 className="text-lg font-semibold">{post.title}</h3>
        </Link>

        <div className="flex items-center text-gray-500 dark:text-gray-300 text-sm mt-1 capitalize">
          <span>
            {post.location} {post.city} {post.state}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {post.documentType && (
            <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs rounded-full capitalize">
              {formatTitleCase(post.documentType)}
            </span>
          )}

          {post.propertyType && (
            <span className="px-2 py-1 bg-yellow-100 text-orange dark:bg-yellow-900 dark:text-orange-300 text-xs rounded-full">
              {formatTitleCase(post.propertyType)}
            </span>
          )}

          {post.condition && (
            <span className="px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 text-xs rounded-full">
              {formatTitleCase(post.condition)}
            </span>
          )}
        </div>

        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line text-[15px] !my-6">
          {post.description}
        </p>

        <div className="flex items-center space-x-4 text-sm mt-3 text-gray-700 dark:text-gray-200">
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
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      if (itemToDelete) {
        // Delete post
        await apiClient.delete(`${endpoints.deleteListing}/${itemToDelete}`);
        toast.success("Listing Deleted");

        onDeleteSuccess?.(itemToDelete); // Notify parent to remove the post
      }

      setOpenModal(false);
    } catch (error) {
      toast.error(ErrorFormatter(error));
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
    }
  };
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
    <div className="border border-gray-200 dark:border-gray-500 rounded-xl p-4 mb-4 bg-white dark:bg-gray-800">
      <DeleteModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={confirmDelete}
        message={`Are you sure you want to delete this post`}
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
              className="w-10 h-10 rounded-full object-cover "
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
                <span className="font-semibold dark:text-gray-100">
                  {post?.owner?.title} {post?.owner?.firstName}{" "}
                  {post?.owner?.lastName}{" "}
                </span>
              </Link>
              {post.owner.isVerifiedUser && (
                <RiVerifiedBadgeFill className="ml-1 text-blue-500" />
              )}
            </div>
            <span className="text-xs text-gray-500 capitalize dark:text-gray-100 ">
              {post?.owner?.companyDetails?.companyName}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500 capitalize dark:text-gray-200">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </span>
          {user?.id === post.owner._id && (
            <div className="relative">
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="p-1 rounded-full hover:bg-gray-100 dark:text-gray-100"
              >
                <FiMoreVertical />
              </button>

              {showOptions && (
                <div
                  ref={optionsRef}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 dark:text-gray-100 rounded-md shadow-lg py-1 z-10"
                >
                  <Link
                    to={`${paths.protected}/${
                      post.isProperty ? "properties" : "posts"
                    }/edit/${post.slug}`}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left transition-colors"
                  >
                    Edit Post
                  </Link>

                  <button
                    onClick={() => handleDelete(post)}
                    className="block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left transition-colors"
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
        <div className="mt-3 dark:text-gray-100">
          <p>{post.description}</p>
        </div>
      )}

      {renderMedia()}
      {renderPropertyDetails()}

      {/* Footer */}
      <div className="flex justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-500">
        <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-300 ">
          <span className="text-xs">{post?.views} views</span>
        </div>

        <div className="flex items-center space-x-4">
          <FavouriteProperty property={post} className="p-2" />

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-1 text-gray-500 dark:text-gray-300"
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
        <Comments
          post={post}
          allComments={allComments}
          setAllComments={setAllComments}
        />
      )}
    </div>
  );
};

export default PostCard;
