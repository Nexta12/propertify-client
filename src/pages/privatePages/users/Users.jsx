
import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import DeleteModal from "@components/deleteModal/DeleteModal";
import Modal from "@components/modal/Modal";
import DataTable from "@components/ui/DataTable";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { FiEye, FiTrash2, FiSlash } from "react-icons/fi";
import { toast } from "react-toastify";
import UserProfileCard from "./UserProfileCard";
import Avater from "@assets/img/avater.png";
import { paths } from "@routes/paths";

const Users = () => {
  const [openModal, setOpenModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [clickedUser, setClickedUser] = useState(null);

  const fetchUsers = async ({ page, limit, sortField, sortOrder, search }) => {
    try {
      const res = await apiClient.get(endpoints.getAllUsers, {
        params: {
          page,
          limit,
          sortField,
          sortOrder,
          search
        }
      });
      return {
        data: res.data.data.data,
        pagination: res.data.data.pagination 
      };
    } catch (error) {
      toast.error(ErrorFormatter(error));
      return {
        data: [],
        pagination: {
          total: 0
        }
      };
    }
  };


  const columns = [
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 h-10 w-10">
          <img
            onClick={() => handleView(row.original)}
            className="h-10 w-10 rounded-full object-cover cursor-pointer"
            src={row.original?.profilePic || Avater}
            alt="user"
            onError={(e) => {
              e.target.src = Avater;
            }}
          />
        </div>
        <div>
          <div className="text-sm font-medium text-gray-900 whitespace-nowrap">
           {row.original.title} {row.original.firstName || 'NA'} {row.original.lastName}
          </div>
          <div className="text-xs text-gray-500">
            {row.original.role && (
              <span className="capitalize">{row.original.role}</span>
            )}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: (info) => <span>{info.getValue()}</span>,
  },
{
  accessorKey: "location",
  header: "Location",
  cell: ({ row }) => (
    <span>
      {row.original.city && `${row.original.city}, `}
      {row.original.state} state
    </span>
  ),
},
  {
    accessorKey: "isVerifiedUser",
    header: "Verified",
    cell: ({ row }) => (
      <div className="flex items-center">
        {row.original.isVerifiedUser ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Verified
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            No
          </span>
        )}
      </div>
    ),
  },
{
  accessorKey: "lastLogin",
  header: "Last Login",
  cell: (info) => {
    const lastLogin = info.getValue();
    return (
      <span className="whitespace-nowrap text-[12px] capitalize">
        {lastLogin ? formatDistanceToNow(new Date(lastLogin), { addSuffix: true }) : "NA"}
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
          className="p-2 text-gray-500 rounded hover:bg-gray-100 hover:text-gray-700"
          title="View"
        >
          <FiEye className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleSuspension(row.original)}
          className="p-2 text-yellow-500 rounded hover:bg-yellow-100 hover:text-yellow-700"
          title="Suspend"
        >
          <FiSlash className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleDelete(row.original)}
          className="p-2 text-red-500 rounded hover:bg-red-100 hover:text-red-700"
          title="Delete"
        >
          <FiTrash2 className="w-4 h-4" />
        </button>
      </div>
    ),
  },
];
  const handleView = (data) => {
    setModalOpen(true);
    setClickedUser(data);
  };

  const handleSuspension = (data) => {
    toast.success(`${data.firstName} has been suspended`);
  };

  const handleDelete = (data) => {
    setOpenModal(true);
    setItemToDelete(data._id);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      await apiClient.delete(`${endpoints.deleteUser}/${itemToDelete}`);
      toast.success("User deleted successfully");
      setOpenModal(false);
      setItemToDelete(null);
    } catch (error) {
      toast.error(ErrorFormatter(error));
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
        message="Are you sure you want to delete this user?"
      />

      <DataTable
        columns={columns}
        fetchData={fetchUsers}
        enableSorting={true}
        tableTitle="Users Table"
        addNewLink={`${paths.protected}/users/add`}
        
      />
     
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <UserProfileCard currentUser={clickedUser} />
      </Modal>
    </section>
  );
};

export default Users;
