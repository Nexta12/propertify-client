import useAuthStore from "@store/authStore";
import { handleGoBack } from "@utils/helper";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const HandleGoBackBtn = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <button
      onClick={() => handleGoBack(navigate, user)}
      className="flex items-center text-neutral-400 hover:text-blue-800 mb-1 transition-colors text-xs md:text-sm "
    >
      <FaArrowLeftLong className="mr-2" />
      Back
    </button>
  );
};

export default HandleGoBackBtn;
