import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import PropertyCard from "@components/propertyCard/PropertyCard";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import { useEffect, useState } from "react";
import { PuffLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";

const Recent = () => {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await apiClient.get(endpoints.fetchAllProperties);
    
        setProperties(response.data.data.data);
      } catch (error) {
        toast.error(ErrorFormatter(error) || "An Error ocurred");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperties();
  }, []);

  if (isLoading && !properties.length)
    return (
      <div className="section-container flex items-center justify-center ">
        <PuffLoader />
      </div>
    );

  return (
    <div className="section-container mb-10">
      <ToastContainer/>
      <h2 className="titleText text-center "> Explore Recent Listings</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
        {/* Property Card */}
        {properties.slice(0, 6).map((property, i) => (
          <PropertyCard key={i} property={property} imgClass="lg:h-[200px]" />
        ))}
      </div>
    </div>
  );
};

export default Recent;
