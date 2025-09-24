import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import DeleteModal from "@components/deleteModal/DeleteModal";
import DataTable from "@components/ui/DataTable";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import { paths } from "@routes/paths";
import useAuthStore from "@store/authStore";
import { truncate } from "lodash";
import { useEffect, useState } from "react";
import { FiEdit, FiEye, FiTrash2 } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { PuffLoader } from "react-spinners";
import { toast } from "react-toastify";
import LogoPlaceHolder from "@assets/img/your-logo.webp";
import { formatTitleCase } from "@utils/helper";

const AllCompanies = () => {
  const { user, validateAuth } = useAuthStore();
  const [authLoading, setAuthLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      setAuthLoading(true);
      try {
        await validateAuth();
      } finally {
        setAuthLoading(false);
      }
    };
    verifyAuth();
  }, [validateAuth]);

  const fetchCompanies = async ({ page, limit, sortField, sortOrder, search }) => {
    try {
      const res = await apiClient.get(endpoints.getAllCompanies, {
        params: { page, limit, sortField, sortOrder, search },
      });

      return {
        data: res.data.data.data, // controller returns { data, pagination }
        pagination: res.data.data.pagination,
      };
    } catch (error) {
      toast.error(ErrorFormatter(error));
      return { data: [], pagination: { total: 0 } };
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex flex-col md:flex-row h-[calc(100vh-1px)] bg-gray-100 dark:bg-gray-800 font-sans items-center justify-center">
        <PuffLoader height="80" width="80" radius={1} color="#4866ff" aria-label="puff-loading" />
      </div>
    );
  }

  const columns = [
    {
      accessorKey: "companyName",
      header: "COMPANY",
      cell: ({ row }) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <Link to={`${paths.companies}/${row.original.slug}`}>
              <img
                className="h-10 w-10 rounded-full border"
                src={row.original.companyLogo || LogoPlaceHolder}
                alt={row.original.companyName}
              />
            </Link>
          </div>
          <div className="ml-3">
            <Link to={`${paths.companies}/${row.original.slug}`}>
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
                {truncate(row.original.companyName, { length: 40 })}
              </div>
            </Link>
            <div className="text-xs text-gray-500">{row.original.email}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "CATEGORY",
      cell: (info) => (
        <span className="text-gray-700 dark:text-gray-300 capitalize">
          {formatTitleCase(info.getValue()) || "—"}
        </span>
      ),
    },
    {
      accessorKey: "location",
      header: "LOCATION",
      cell: ({ row }) => (
        <span className="text-gray-700 dark:text-gray-300">
          {row.original.city ? `${row.original.city}, ` : ""}
          {row.original.state}
        </span>
      ),
    },
    {
      accessorKey: "isVerified",
      header: "VERIFIED",
      cell: (info) =>
        info.getValue() ? (
          <span className="px-2 py-1 rounded-sm text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
            Yes
          </span>
        ) : (
          <span className="px-2 py-1 rounded-sm text-xs font-semibold bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100">
            No
          </span>
        ),
    },
    {
      accessorKey: "createdBy",
      header: "CREATED BY",
      cell: ({ row }) => {
        const createdBy = row.original.createdBy;
        return (
          <span className="text-gray-700 dark:text-gray-300 text-sm">
            {createdBy?.firstName} {createdBy?.lastName}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "ACTIONS",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleView(row.original)}
            className="p-1 text-main-green rounded hover:bg-green-600 hover:text-white dark:text-white"
          >
            <FiEye />
          </button>
          <button
            onClick={() => handleEdit(row.original)}
            className="p-1 text-blue-500 rounded hover:bg-blue-600 hover:text-white dark:text-blue-300"
          >
            <FiEdit />
          </button>
          <button
            onClick={() => handleDelete(row.original)}
            className="p-1 text-red-500 rounded hover:bg-red-600 hover:text-white dark:text-red-400"
          >
            <FiTrash2 />
          </button>
        </div>
      ),
    },
  ];

  const handleView = (company) => {
    navigate(`${paths.companies}/${company?.slug}`);
  };

  const handleEdit = (company) => {
    navigate(`${paths.protected}/companies/update/${company?.slug}`);
  };

  const handleDelete = (company) => {
    setOpenModal(true);
    setItemToDelete(company?.slug);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        await apiClient.delete(`${endpoints.deleteCompanyPage}/${itemToDelete}`);
        toast.success("Company Deleted");
      } catch (error) {
        toast.error(ErrorFormatter(error));
      } finally {
        setOpenModal(false);
        setItemToDelete(null);
      }
    }
  };

  return (
    <section>
      <DeleteModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this company?"
      />

      <DataTable
        columns={columns}
        fetchData={fetchCompanies}
        enableSorting={true}
        tableTitle="All Companies"
      />
    </section>
  );
};

export default AllCompanies;
