import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import useAuthStore from "@store/authStore";
import { useState } from "react";
import { FiHeart } from "react-icons/fi";
import { toast } from "react-toastify";

const FavouriteProperty = ({ property, className }) => {
  const { user } = useAuthStore();
  const [likeCount, setLikeCount] = useState(property?.likes?.length || 0);

  // Initialize isFavorite based on whether the property is in user's favorites
  const [isFavorite, setIsFavorite] = useState(
    user?.likedProperties?.includes(property._id) || false
  );

  const updateFavoriteStatus = async (propertyId) => {
    try {
      await apiClient.post(`${endpoints.favouriteProperty}/${propertyId}`);
      setLikeCount(isFavorite ? likeCount - 1 : likeCount + 1);
      // Toggle the local state optimistically
      setIsFavorite((prev) => !prev);
    } catch (error) {
      toast.error(ErrorFormatter(error));
      setIsFavorite((prev) => !prev);
    }
  };

  return (
    <>
      <button
        onClick={() => updateFavoriteStatus(property._id)}
        className={`rounded-full transition-colors flex gap-1 items-center px-2 py-1
    ${
      user && isFavorite
        ? " text-red-500"
        : "bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-200"
    }
    ${className}`}
      >
        <FiHeart className={`${isFavorite ? "fill-current" : ""}`} />
        {likeCount !== 0 && <span className="text-[10px] mt-1">{likeCount}</span>}
      </button>
    </>
  );
};

export default FavouriteProperty;
