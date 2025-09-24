import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import DeleteModal from "@components/deleteModal/DeleteModal";
import DataTable from "@components/ui/DataTable";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import { paths } from "@routes/paths";
import useAuthStore from "@store/authStore";
import { UserRole } from "@utils/constant";
import { formatTitleCase } from "@utils/helper";
import { useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { PuffLoader } from "react-spinners";
import { toast } from "react-toastify";

const Contacts = () => {
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

  const fetchContacts = async ({ page, limit, sortField, sortOrder, search }) => {
    if (!user?.id) return { data: [], pagination: { total: 0 } };

    try {
      const res = await apiClient.get(
        user.role !== UserRole.ADMIN
          ? `${endpoints.fetchUserContactsList}/${user.id}`
          : endpoints.getAllUsers,
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
      <div className="flex flex-col md:flex-row h-[calc(100vh-1px)] bg-bg-green dark:bg-gray-800 font-sans items-center justify-center">
        <PuffLoader height="80" width="80" radius={1} color="#4866ff" area-label="puff-loading" />
      </div>
    );
  }

  const isAdmin = user.role === UserRole.ADMIN;

  const columns = [
    {
      accessorKey: "serialNo",
      header: "S/No",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "fullName",
      header: "Name",
      cell: ({ row }) => (
        <span className="whitespace-nowrap capitalize">
          {row.original.title} {row.original.firstName || "NA"} {row.original.lastName}
        </span>
      ),
    },
    {
      accessorKey: "profession",
      header: "Profession",
      cell: ({ row }) => (
        <span className="whitespace-normal capitalize">
          {formatTitleCase(row.original.profession)}
        </span>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: (info) => info.getValue(),
    },
    // Only include the actions column if user is NOT an admin
    ...(!isAdmin
      ? [
          {
            id: "actions",
            header: "ACTIONS",
            cell: ({ row }) => (
              <div className="flex gap-2">
                <button
                  onClick={() => handleView(row.original)}
                  className="px-2 py-1 text-xs text-main-green bg-green-100 rounded hover:bg-green-200"
                >
                  View
                </button>

                <button
                  onClick={() => handleDelete(row.original)}
                  className="px-2 py-1 text-xs text-red-500 rounded hover:bg-red-100"
                >
                  <FiTrash2 />
                </button>
              </div>
            ),
          },
        ]
      : []),
  ];

  const handleView = (data) => {
    navigate(`${paths.protected}/contacts/${data._id}`);
  };

  const handleDelete = (data) => {
    setOpenModal(true);
    setItemToDelete(data._id);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      await apiClient.delete(`${endpoints.deleteContact}/${itemToDelete}`);
      toast.success("Contact deleted successfully");
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
        message="Are you sure you want to delete this contact?"
      />

      <DataTable
        columns={columns}
        fetchData={fetchContacts}
        enableSorting={true}
        enableSearch={true}
        tableTitle="My Contacts"
        addNewLink={`${paths.protected}/contacts/new`}
      />
    </section>
  );
};

export default Contacts;
