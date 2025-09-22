import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import DeleteModal from "@components/deleteModal/DeleteModal";
import Modal from "@components/modal/Modal";
import DataTable from "@components/ui/DataTable";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import { paths } from "@routes/paths";
import useAuthStore from "@store/authStore";
import { UserRole } from "@utils/constant";
import { formatLargeNumber, formatTitleCase } from "@utils/helper";
import { useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { PuffLoader } from "react-spinners";
import { toast } from "react-toastify";
import UpdatePromoStatus from "./components/UpdatePromoStattus";
import { formatDistanceStrict } from "date-fns";

const AllAds = () => {
  const { user, validateAuth } = useAuthStore();
  const [authLoading, setAuthLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isGenModalOpen, setIsGenModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [adToUpdate, setAdToUpdate] = useState(null);
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

  const fetchAds = async ({ page, limit, sortField, sortOrder, search }) => {
    if (!user?.id) return { data: [], pagination: { total: 0 } };

    try {
      const res = await apiClient.get(
        user.role !== UserRole.ADMIN
          ? `${endpoints.fetchUserAllAds}/${user?.id}`
          : endpoints.fetchAllAds,
        {
          params: {
            page,
            limit,
            sortField,
            sortOrder,
            search,
          },
        }
      );

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
      return {
        data: [],
        pagination: { total: 0 },
      };
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex flex-col md:flex-row h-[calc(100vh-1px)] bg-bg-green font-sans items-center justify-center">
        <PuffLoader height="80" width="80" radius={1} color="#4866ff" aria-label="puff-loading" />
      </div>
    );
  }

  const isAdmin = user.role === UserRole.ADMIN;

  const columns = [
    // {
    //   accessorKey: "serialNo",
    //   header: "S/No",
    //   cell: ({ row }) => row.index + 1,
    // },
    {
      accessorKey: "promotionType",
      header: "Type",
      cell: ({ row }) => {
        const type = row.original.promotionType || "N/A";
        return <span className="whitespace-nowrap capitalize">{formatTitleCase(type)}</span>;
      },
    },

    // Only include the actions column if user is NOT an admin
    ...(isAdmin
      ? [
          {
            accessorKey: "userName",
            header: "Advertiser",
            cell: ({ row }) => {
              const { userId } = row.original;
              return (
                <span className="whitespace-nowrap capitalize">
                  {userId?.firstName || "N/A"} {userId?.lastName || ""}
                </span>
              );
            },
          },
        ]
      : []),

    {
      accessorKey: "duration",
      header: "Duration",
      cell: ({ row }) => <span>{row.original.duration || 0} days</span>,
    },
    {
      accessorKey: "cost",
      header: "Cost",
      cell: ({ row }) => <span>₦{formatLargeNumber(row.original.cost) || 0}</span>,
    },

    {
      accessorKey: "createdAt",
      header: "Posted",
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-[11px]">
          {formatDistanceStrict(new Date(row.original.createdAt), new Date(), { addSuffix: true })}
        </span>
      ),
    },

    {
      accessorKey: "paymentStatus",
      header: "Payment",
      cell: ({ row }) => {
        const status = row.original.paymentStatus?.toLowerCase();
        const colors = {
          pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-100",
          completed: "bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-100",
          failed: "bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-100",
          successful: "bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-100",
        };
        const colorClass =
          colors[status] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-100";
        return (
          <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${colorClass}`}>
            {formatTitleCase(status)}
          </span>
        );
      },
    },
    {
      accessorKey: "promotionStatus",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.promotionStatus?.toLowerCase();
        const colors = {
          pending_approval: "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-100",
          active: "bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-100",
          completed: "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100",
          rejected: "bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-100",
        };
        const colorClass =
          colors[status] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-100";
        return (
          <div className="flex items-center justify-between gap-2 whitespace-nowrap">
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium capitalize whitespace-nowrap ${colorClass}`}
            >
              {formatTitleCase(status)}
            </span>

            {user.role === UserRole.ADMIN && status !== "completed" && status !== "active" && (
              <button
                onClick={() => takeAction(row.original._id)}
                className="px-2 py-1 text-xs font-medium text-blue-500 bg-transparent border border-blue-500 rounded-full hover:bg-blue-500 hover:text-white dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-400 dark:hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Update
              </button>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "endDate",
      header: "End Date",
      cell: ({ row }) =>
        row.original.endDate ? new Date(row.original.endDate).toLocaleDateString() : "N/A",
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
    navigate(`${paths.protected}/tickets/${data._id}`);
  };

  const handleDelete = (data) => {
    setOpenModal(true);
    setItemToDelete(data._id);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      await apiClient.delete(`${endpoints.deleteAds}/${itemToDelete}`);
      toast.success("Ads record deleted successfully");
    } catch (error) {
      toast.error(ErrorFormatter(error));
    } finally {
      setOpenModal(false);
      setItemToDelete(null);
    }
  };

  const takeAction = (id) => {
    setAdToUpdate(id);
    setIsGenModalOpen(true);
  };

  return (
    <section>
      <DeleteModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this record ?"
      />

      {user.role !== "admin" ? (
        <DataTable
          columns={columns}
          fetchData={fetchAds}
          enableSorting={true}
          enableSearch={true}
          tableTitle="Promotion History"
          addNewLink={`${paths.protected}/new-ads`}
          addNewText="Create New Add"
        />
      ) : (
        <DataTable
          columns={columns}
          fetchData={fetchAds}
          enableSorting={true}
          enableSearch={true}
          tableTitle="Promotions"
        />
      )}

      <Modal isOpen={isGenModalOpen} onClose={() => setIsGenModalOpen(false)}>
        <UpdatePromoStatus promo={adToUpdate} onFinish={() => setIsGenModalOpen(false)} />
      </Modal>
    </section>
  );
};

export default AllAds;
