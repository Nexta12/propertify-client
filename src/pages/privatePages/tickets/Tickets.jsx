

import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import DeleteModal from "@components/deleteModal/DeleteModal";
import DataTable from "@components/ui/DataTable";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import { paths } from "@routes/paths";
import useAuthStore from "@store/authStore";
import { UserRole } from "@utils/constant";
import { formatTitleCase } from "@utils/helper";
import { truncate } from "lodash";
import { useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { PuffLoader } from "react-spinners";
import { toast } from "react-toastify";

const Tickets = () => {
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


  const fetchTickets = async ({
    page,
    limit,
    sortField,
    sortOrder,
    search,
  }) => {
    if (!user?.id) return { data: [], pagination: { total: 0 } };

    try {
      const res = await apiClient.get(
        user.role !== UserRole.ADMIN
          ? `${endpoints.fetchAllTickets}/${user.id}`
          : endpoints.fetchAllTickets,
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
        <PuffLoader
          height="80"
          width="80"
          radius={1}
          color="#4866ff"
          aria-label="puff-loading"
        />
      </div>
    );
  }

  const columns = [
    {
      accessorKey: "serialNo",
      header: "S/No",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "fullName",
      header: "Name",
      cell: ({ row }) => {
        const { userId } = row.original;
        return (
          <span className="whitespace-nowrap capitalize">
            {userId?.firstName || "NA"} {userId?.lastName || ""}
          </span>
        );
      },
    },
    {
      accessorKey: "subject",
      header: "Subject",
      cell: ({ row }) => (
        <span className="whitespace-nowrap capitalize">
          { truncate(row.original.subject, {length: 15})}
        </span>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => row.original.userId?.email || "N/A",
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => formatTitleCase(row.original.category),
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => {
        const priority = row.original.priority.toLowerCase();
        const colors = {
          urgent: "bg-red-100 text-red-600",
          high: "bg-orange-100 text-orange-700",
          medium: "bg-yellow-100 text-yellow-700",
          low: "bg-green-100 text-green-600",
        };
        const colorClass = colors[priority] || "bg-gray-100 text-gray-700";
        return (
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${colorClass}`}
          >
            {priority}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status.toLowerCase();
        const colors = {
          closed: "bg-red-100 text-red-600",
          "in-progress": "bg-blue-100 text-blue-700",
          open: "bg-green-100 text-green-600",
          resolved: "bg-yellow-100 text-yellow-700",
        };
        const colorClass = colors[status] || "bg-gray-100 text-gray-700";
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
            className="px-2 py-1 text-xs text-main-green bg-green-100 rounded hover:bg-green-200"
          >
            View
          </button>
          {user.role === "admin" && (
          <button
            onClick={() => handleDelete(row.original)}
            className="px-2 py-1 text-xs text-red-500 rounded hover:bg-red-100"
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
      await apiClient.delete(`${endpoints.deleteTicket}/${itemToDelete}`);
      toast.success("Ticket deleted successfully");
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
        message="Are you sure you want to delete this ticket?"
      />

      {user.role !== 'admin' ? (

           <DataTable
        columns={columns}
        fetchData={fetchTickets}
        enableSorting={true}
        enableSearch={true}
        tableTitle="Support Tickets"
        addNewLink={`${paths.protected}/tickets/create`}
         addNewText="Create New Ticket"
      />
       ): ( <DataTable
        columns={columns}
        fetchData={fetchTickets}
        enableSorting={true}
        enableSearch={true}
        tableTitle="Support Tickets"
     
      /> )}
   
    </section>
  );
};

export default Tickets;

