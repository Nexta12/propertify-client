import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import useAuthStore from "@store/authStore";
import { useState } from "react";
import { FiHeart } from "react-icons/fi";
import { toast } from "react-toastify";

const FavouriteProperty = ({ property, className }) => {
  const { user } = useAuthStore();
  // Initialize isFavorite based on whether the property is in user's favorites
  const [isFavorite, setIsFavorite] = useState(
    user?.likedProperties?.includes(property._id) || false
  );

  const updateFavoriteStatus = async (propertyId) => {
    try {
      await apiClient.post(`${endpoints.favouriteProperty}/${propertyId}`);
      // Toggle the local state optimistically
      setIsFavorite((prev) => !prev);
      // Show appropriate toast message
      toast.success(
        isFavorite ? "Removed from favorites" : "Marked as Favourite"
      );
    } catch (error) {
      // Revert the state if the API call fails
      setIsFavorite((prev) => !prev);
      toast.error(ErrorFormatter(error));
    }
  };

  return (
    <button
      onClick={() => updateFavoriteStatus(property._id)}
      className={` rounded-full shadow-md transition-colors ${
        user && isFavorite ? "bg-red-500 text-white" : "bg-white text-gray-700"
      }  ${className} `}
    >
      <FiHeart className={isFavorite ? "fill-current" : ""} />
    </button>
  );
};

export default FavouriteProperty;
