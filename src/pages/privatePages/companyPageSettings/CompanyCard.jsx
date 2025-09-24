import { paths } from "@routes/paths";
import { truncate } from "lodash";
import { useNavigate } from "react-router-dom";
import Placeholder from "@assets/img/placeholder.webp";
import LogoPlaceHolder from "@assets/img/your-logo.webp";
import useAuthStore from "@store/authStore";
import { FaEllipsisV } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import DeleteModal from "@components/deleteModal/DeleteModal";
import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import { toast } from "react-toastify";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";

const CompanyCard = ({ companies, onDelete }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Keep a local state copy

  const [openMenuId, setOpenMenuId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const menuRef = useRef(null);

  const handleNavigate = (company) => {
    const basePath = user ? `${paths.protected}/companies` : paths.companies;
    navigate(`${basePath}/${company.slug}`);
  };

  const handleToggleMenu = (companyId) => {
    setOpenMenuId(openMenuId === companyId ? null : companyId);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDeleteCompany = (company) => {
    setOpenModal(true);
    setOpenMenuId(null);
    setItemToDelete(company);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        await apiClient.delete(`${endpoints.deleteCompanyPage}/${itemToDelete.slug}`);
        toast.success("Company Page Deleted successfully");

        // 👇 Tell parent to update its state
        onDelete(itemToDelete.slug);
      } catch (error) {
        toast.error(ErrorFormatter(error));
      } finally {
        setOpenModal(false);
        setItemToDelete(null);
      }
    }
  };

  return (
    <>
      <DeleteModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={confirmDelete}
        message="This is irreversible, do you really want to proceed ?"
      />

      {companies.map((company) => (
        <div
          key={company._id}
          className="bg-white dark:bg-gray-800 border rounded-2xl dark:border-gray-500 overflow-hidden relative"
        >
          {/* Cover Image */}
          <div className="h-32 w-full relative">
            {user?.id === company?.createdBy?._id && (
              <button
                className="text-white absolute top-4 right-4"
                onClick={() => handleToggleMenu(company._id)}
              >
                <FaEllipsisV />
              </button>
            )}

            {/* Dropdown Menu */}
            {openMenuId === company._id && (
              <div
                ref={menuRef}
                className="absolute top-10 right-4 bg-white dark:bg-gray-700 shadow-md rounded-lg z-50 overflow-hidden"
              >
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => navigate(`${paths.protected}/companies/update/${company.slug}`)}
                >
                  Edit
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 text-red-500"
                  onClick={() => handleDeleteCompany(company)}
                >
                  Delete
                </button>
              </div>
            )}

            <img
              src={company?.coverPic || Placeholder}
              alt="cover"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="p-4">
            {/* Logo + Name */}
            <div className="flex items-center gap-3 mb-3">
              <img
                src={company.companyLogo || LogoPlaceHolder}
                alt="logo"
                className="w-12 h-12 rounded-full border"
              />
              <h3 className="text-lg font-semibold dark:text-gray-200">{company.companyName}</h3>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-2 dark:text-gray-200">
              {truncate(company.description, { length: 150 })}
            </p>

            {/* View More Button */}
            <button
              onClick={() => handleNavigate(company)}
              className="w-full py-2 rounded-lg border border-gray-300 dark:border-gray-500 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              View More
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export default CompanyCard;
