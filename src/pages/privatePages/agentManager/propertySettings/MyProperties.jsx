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
import { toast, ToastContainer } from "react-toastify";
import PropertyPlaceholder from "@assets/img/p1.jpg";

const MyProperties = () => {
  const { user, validateAuth } = useAuthStore();
  const [authLoading, setAuthLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const navigate = useNavigate();

  const [propertyData, setPropertyData] = useState([]);

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

  useEffect(() => {
    if (user && !authLoading) {
      // Only fetch if user exists and auth is done
      const fetchUProperties = async () => {
        try {
          const res = await apiClient.get(
            `${endpoints.fetchUserProperties}/${user.slug}`
          );
          setPropertyData(res.data.data);
        } catch (error) {
          toast.error(ErrorFormatter(error));
        }
      };
      fetchUProperties();
    }
  }, [user?.slug]); // Only re-run if user.slug changes

  if (authLoading || !user) {
    return (
      <div className="flex flex-col md:flex-row h-[calc(100vh-1px)] bg-bg-green font-sans items-center justify-center">
        {" "}
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
            <Link to={`${paths.agent}/properties/${row.original.slug}`}>
              <img
                className="h-10 w-10 rounded"
                src={row.original.otherImages[0] || PropertyPlaceholder }
                alt={row.original.title}
              />
            </Link>
          </div>
          <div className="ml-4">
            <Link to={`${paths.agent}/properties/${row.original.slug}`}>
              <div className="text-sm font-medium text-gray-900">
                {truncate(row.original.title, { length: 20 })}
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
            : "bg-blue-100 text-blue-800" // default for unknown statuses
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
          <div className="capitalize">{currency} {formatLargeNumber(price)} {frequency} </div>
        )
      },
    },
    {
      accessorKey: "location",
      header: "LOCATION",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "views",
      header: "VIEWS",
      cell: (info) => info.getValue(),
    },
    {
      id: "actions", // No accessorKey needed for actions
      header: "ACTIONS",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleView(row.original)}
            className="text-[#28B16D] hover:text-[#09C269] mr-3"
          >
            <FiEye />
          </button>
          <button
            onClick={() => handleEdit(row.original)}
            className="text-blue-600 hover:text-blue-800 mr-3"
          >
            <FiEdit />
          </button>
          <button
            onClick={() => handleDelete(row.original)}
            className="text-red-600 hover:text-red-800"
          >
            <FiTrash2 />
          </button>
        </div>
      ),
    },
  ];

  const handleView = (data) => {
    return navigate(`${paths.agent}/properties/${data.slug}`);

    // Navigate or open modal etc
  };

  const handleEdit = (data) => {
    return navigate(`${paths.agent}/properties/edit/${data.slug}`);
  };

  const handleDelete = (data) => {
    // Open confirm dialog or directly delete
    setOpenModal(true);
    setItemToDelete(data._id);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        // Make an API call to delete the item
        await apiClient.delete(`${endpoints.deleteListing}/${itemToDelete}`);
        // Remove the item from the list
        setPropertyData((prev) =>
          prev.filter((property) => property._id !== itemToDelete)
        );

        setOpenModal(false); // Close the modal
        setItemToDelete(null); // Reset the item to delete
        toast.success("Listing Deleted..");
      } catch (error) {
        toast.error(ErrorFormatter(error));
        setOpenModal(false); // Close the modal
        setItemToDelete(null); // Reset the item to delete
      }
    }
  };

  return (
    <section>
      <DeleteModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={confirmDelete}
        message="Are you Sure You want to this item ?"
      />
      <ToastContainer />
      <DataTable
        columns={columns}
        enableSorting={false}
        data={propertyData}
        tableTitle="My Properties"
        addNewLink={paths.newProperty}
      />
    </section>
  );
};

export default MyProperties;
