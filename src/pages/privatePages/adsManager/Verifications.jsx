import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import DeleteModal from "@components/deleteModal/DeleteModal";
import DataTable from "@components/ui/DataTable";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import { paths } from "@routes/paths";
import useAuthStore from "@store/authStore";
import { useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { PuffLoader } from "react-spinners";
import { toast } from "react-toastify";

const Verifications = () => {
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

  // ✅ Fetch verifications with pagination
  const fetchVerifications = async ({ page, limit, sortField, sortOrder, search }) => {
    try {
      const res = await apiClient.get(endpoints.getAllVerificationRequests, {
        params: { page, limit, sortField, sortOrder, search },
      });

      return {
        data: res.data.data.data,
        pagination: res.data.data.pagination || {
          total: res.data.data?.length || 0,
          page,
          limit,
        },
      };
    } catch (error) {
      toast.error(ErrorFormatter(error));
      return { data: [], pagination: { total: 0 } };
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex flex-col md:flex-row h-[calc(100vh-1px)] bg-bg-green font-sans items-center justify-center">
        <PuffLoader color="#4866ff" />
      </div>
    );
  }

  // ✅ Correct columns for Verification Requests
  const columns = [
    {
      accessorKey: "fullName",
      header: "Name",
      cell: ({ row }) => (
        <span className="whitespace-nowrap capitalize">{row.original.fullName || "N/A"}</span>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => row.original.email || row.original.userId?.email || "N/A",
    },
    {
      accessorKey: "state",
      header: "State",
      cell: ({ row }) => row.original.state || "N/A",
    },
    {
      accessorKey: "city",
      header: "City",
      cell: ({ row }) => row.original.city || "N/A",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status?.toLowerCase() || "pending";
        const colors = {
          approved: "bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-100",
          pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-100",
          rejected: "bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-100",
        };
        const colorClass =
          colors[status] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-100";

        return (
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium capitalize whitespace-nowrap ${colorClass}`}
          >
            {status}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleView(row.original)}
            className="px-2 py-1 text-xs text-main-green bg-green-100 dark:bg-green-900 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-800"
          >
            View
          </button>
          {user.role === "admin" && (
            <button
              onClick={() => handleDelete(row.original)}
              className="px-2 py-1 text-xs text-red-500 dark:text-red-300 rounded hover:bg-red-100 dark:hover:bg-red-800"
            >
              <FiTrash2 />
            </button>
          )}
        </div>
      ),
    },
  ];

  const handleView = (data) => {
    navigate(`${paths.protected}/verification-details/${data._id}`);
  };

  const handleDelete = (data) => {
    setOpenModal(true);
    setItemToDelete(data._id);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      await apiClient.delete(`${endpoints.deleteVerificationStatus}/${itemToDelete}`);
      toast.success("Verification deleted successfully");
    } catch (error) {
      toast.error(ErrorFormatter(error));
    } finally {
      setOpenModal(false);
      setItemToDelete(null);
    }
  };

  return (
    <section>
      <DeleteModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this verification request?"
      />

      <DataTable
        columns={columns}
        fetchData={fetchVerifications}
        enableSorting={true}
        enableSearch={true}
        tableTitle="Verifications"
      />
    </section>
  );
};

export default Verifications;
