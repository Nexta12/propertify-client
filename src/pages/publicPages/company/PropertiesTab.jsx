import { useState, useEffect } from "react";
import { motion as Motion } from "framer-motion";
import { toast } from "react-toastify";
import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import Placeholder from "@assets/img/placeholder.webp";
import { Link } from "react-router-dom";
import Button from "@components/ui/Button";

const PropertiesTab = ({ activeTab, company }) => {
  const [companyProducts, setCompanyProducts] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);

  const fetchCoyProducts = async (page = 1) => {
    if (!company?.slug) return;

    try {
      setLoading(true);
      const res = await apiClient.get(
        `${endpoints.getCompanyProperties}/${company.slug}?page=${page}`
      );

      setCompanyProducts(res.data.data.data); // backend -> { data, pagination }
      setPagination(res.data.data.pagination);
    } catch (error) {
      toast.error(ErrorFormatter(error));
    } finally {
      setLoading(false);
    }
  };

  // initial fetch
  useEffect(() => {
    fetchCoyProducts(1);
  }, [company?.slug]);

  return (
    <>
      {activeTab === "properties" && (
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : (
            <>
              <div className="grid md:grid-cols-3 gap-6">
                {companyProducts.length > 0 ? (
                  companyProducts.map((property) => (
                    <div
                      key={property?._id}
                      className="bg-white dark:bg-gray-700  shadow hover:shadow-md transition overflow-hidden "
                    >
                      <Link to={`/properties/${property?.slug}`}>
                        <div className="relative">
                          <img
                            src={property?.media?.[0]?.url || Placeholder}
                            alt={property?.title}
                            className="w-full h-40 object-cover"
                          />
                          <span className="bg-orange absolute top-2 right-2 text-xs px-2 py-1 rounded-md   text-white">
                            {property?.purpose}
                          </span>
                        </div>

                        <div className="p-4">
                          <h3 className="font-semibold text-lg">
                            {property?.title}
                          </h3>

                          {/* Location */}
                          <p className="text-gray-500 dark:text-gray-400 text-sm capitalize">
                            {property?.location}, {property?.city},{" "}
                            {property?.state}
                          </p>

                          {/* Price */}
                          <p className="text-blue-600 font-bold mt-2">
                            ₦{property?.price?.toLocaleString()} /{" "}
                            {property?.frequency}
                          </p>

                          {/* Extra Info Section */}
                          <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                            {(property?.beds || property?.baths) && (
                              <p>
                                <span className="font-medium">Beds:</span>{" "}
                                {property?.beds || 0},{" "}
                                <span className="font-medium">Baths:</span>{" "}
                                {property?.baths || 0}
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))
                ) : (
                  <p className="col-span-3 text-center text-gray-500">
                    No properties found
                  </p>
                )}
              </div>

              {/* Pagination */}
              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center space-x-2">
                  {Array.from({ length: pagination.totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => fetchCoyProducts(i + 1)}
                      className={`px-3 py-1 rounded-md border ${
                        pagination.page === i + 1
                          ? "bg-blue-600 text-white"
                          : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </Motion.div>
      )}
    </>
  );
};

export default PropertiesTab;
