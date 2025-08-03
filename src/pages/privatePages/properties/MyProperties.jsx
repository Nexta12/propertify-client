
import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import DeleteModal from "@components/deleteModal/DeleteModal";
import DataTable from "@components/ui/DataTable";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import { paths } from "@routes/paths";
import useAuthStore from "@store/authStore";
import { formatLargeNumber } from "@utils/helper";
import { truncate } from "lodash";
import { useEffect, useState } from "react";
import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { PuffLoader } from "react-spinners";
import { toast } from "react-toastify";
import PropertyPlaceholder from "@assets/img/p1.jpg";

const MyProperties = () => {
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

  const fetchProperties = async ({ page, limit, sortField, sortOrder, search }) => {
    if (!user?.slug) return { data: [], pagination: { total: 0 } };
    
    try {
      const res = await apiClient.get(`${endpoints.fetchUserProperties}/${user.slug}`, {
        params: {
          page,
          limit,
          sortField,
          sortOrder,
          search
        }
      });
      return {
        data: res.data.data.data.filter(item => item.isProperty),
        pagination: res.data.data.pagination
      };
    } catch (error) {
      toast.error(ErrorFormatter(error));
      return {
        data: [],
        pagination: { total: 0 }
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
          area-label="puff-loading"
        />
      </div>
    );
  }

  const columns = [
    {
      accessorKey: "title",
      header: "PROPERTY",
      cell: ({ row }) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <Link to={`${paths.protected}/properties/${row.original.slug}`}>
              <img
                className="h-10 w-10 rounded"
                src={row.original.media[0]?.url || PropertyPlaceholder}
                alt={row.original.title}
              />
            </Link>
          </div>
          <div className="ml-4">
            <Link to={`${paths.protected}/properties/${row.original.slug}`}>
              <div className="text-sm font-medium text-gray-900">
                {truncate(row.original.title, { length: 40 })}
              </div>
            </Link>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "STATUS",
      cell: (info) => {
        const status = info.getValue();
        return (
          <span
            className={`
              px-2 py-1 rounded-sm text-xs font-semibold 
              ${
                status === "published"
                  ? "bg-green-100 text-green-800"
                  : status === "draft"
                  ? "bg-yellow-100 text-yellow-800"
                  : status === "archived"
                  ? "bg-gray-100 text-gray-800"
                  : "bg-blue-100 text-blue-800"
              }
            `}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      },
    },
    {
      accessorKey: "price",
      header: "PRICE",
      cell: (info) => {
        const { price, currency, frequency } = info.row.original;
        return (
          <div className="capitalize">
            {currency} {formatLargeNumber(price)} {frequency}
          </div>
        );
      },
    },
    {
      accessorKey: "location",
      header: "LOCATION",
      cell: (info) => info.getValue(),
    },
    {
      id: "actions",
      header: "ACTIONS",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleBoost(row.original)}
            className="px-2 py-1 text-xs text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Promote
          </button>
          <button
            onClick={() => handleView(row.original)}
            className="px-2 py-1 text-xs text-main-green rounded hover:bg-green-600 hover:text-white"
          >
            <FiEye />
          </button>
          <button
            onClick={() => handleEdit(row.original)}
            className="px-2 py-1 text-xs text-blue-500 rounded hover:bg-blue-600 hover:text-white"
          >
            <FiEdit />
          </button>
          <button
            onClick={() => handleDelete(row.original)}
            className="px-2 py-1 text-xs text-red-500 rounded hover:bg-red-600 hover:text-white"
          >
            <FiTrash2 />
          </button>
        </div>
      ),
    },
  ];

  const handleView = (data) => {
    navigate(`${paths.properties}/${data.slug}`);
  };

  const handleEdit = (data) => {
    navigate(`${paths.protected}/${data.isProperty ? "properties" : "posts"}/edit/${data.slug}`);
  };

  const handleBoost = (data) => {
    alert(`Joy is coming to ${data.city} shortly`);
  };

  const handleDelete = (data) => {
    setOpenModal(true);
    setItemToDelete(data._id);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        await apiClient.delete(`${endpoints.deleteListing}/${itemToDelete}`);
        toast.success("Listing Deleted");
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
        message="Are you sure you want to delete this item?"
      />

      <DataTable
        columns={columns}
        fetchData={fetchProperties}
        enableSorting={true}
        tableTitle="My Properties"
        addNewLink={paths.newProperty}
      />
    </section>
  );
};

export default MyProperties;
