import { FaImage, FaPlus, FaVideo } from "react-icons/fa";
import Avater from "@assets/img/avater.png";
import useAuthStore from "@store/authStore";
import { useNavigate } from "react-router-dom";
import { paths } from "@routes/paths";

const CreatePostToggler = ({ setopenPostCreator }) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 border border-gray-200 dark:border-gray-500 rounded-md mb-4">
      {/* Top: Profile + Input */}
      <div className="flex items-center gap-x-2 sm:gap-x-4">
        <img
          className="w-12 h-12 rounded-full object-cover"
          src={user?.profilePic || Avater}
          alt="profile"
        />

        <input
          type="text"
          className="flex-grow focus:outline-none px-4 py-3 bg-gray-100 dark:bg-transparent rounded-full placeholder:text-gray-600 dark:placeholder:text-gray-300  border border-gray-200 dark:border-gray-500 cursor-pointer"
          placeholder="Create briefs, posts etc"
          onClick={() => setopenPostCreator(true)}
        />
      </div>

      {/* Bottom: Actions */}
      <div className="flex justify-between items-center mt-4 px-2">
        <button
          type="button"
          onClick={setopenPostCreator}
          className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-lg transition"
        >
          <FaVideo className="w-5 h-5 text-blue-500" />
          <span className="text-sm font-medium dark:text-gray-200">Video</span>
        </button>

        <button
          type="button"
          onClick={setopenPostCreator}
          className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-lg transition"
        >
          <FaImage className="w-5 h-5 text-green-500" />
          <span className="text-sm font-medium dark:text-gray-200 ">Image</span>
        </button>

        <button
          type="button"
          onClick={() => navigate(`${paths.protected}/properties/add`)}
          className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-lg transition"
        >
          <FaPlus className="w-5 h-5 text-orange hidden md:block" />
          <span className="text-sm font-medium whitespace-nowrap text-orange ">List Property</span>
        </button>
      </div>
    </div>
  );
};

export default CreatePostToggler;
