import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "@components/modal/Modal";
import useAuthStore from "@store/authStore";
import { FiUser } from "react-icons/fi";
import { paths } from "@routes/paths";

const CompleteProfileCall = () => {
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.firstName || !user?.lastName) {
      setIsModalOpen(true);
    }
  }, [user]);

  const goToProfile = () => {
    setIsModalOpen(false);
    navigate(`${paths.protected}/settings`); // Adjust route as needed
  };

  return (
    <Modal isOpen={isModalOpen} onClose={goToProfile}>
      <div className="text-center p-6 max-w-md mx-auto">
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 text-red-600 rounded-full p-3">
            <FiUser className="text-3xl" />
          </div>
        </div>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Complete Your Profile
        </h2>
        <p className="text-gray-600 mb-4 text-sm dark:text-gray-100">
          We noticed your profile is missing some important information.
          Completing your profile helps you interact better with the platform,
          like listing properties, posts, posting comments, messages and more.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={goToProfile}
            className="bg-main-green text-white px-4 py-2 rounded-lg hover:bg-green-hover transition"
          >
            Go to Profile
          </button>
          {/* <button
            onClick={goToProfile}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Maybe Later
          </button> */}
        </div>
      </div>
    </Modal>
  );
};

export default CompleteProfileCall;
