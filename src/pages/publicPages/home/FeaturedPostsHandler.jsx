import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import PropertyCard from "@components/propertyCard/PropertyCard";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const FeaturedPostsHandler = () => {
  const [featuredPosts, setFeaturedPosts] = useState([]);

  const fetchFeaturedtPosts = async () => {
    try {
      const res = await apiClient.post(endpoints.fetchFeaturedPosts);
      setFeaturedPosts(res.data.data);
    } catch (err) {
      toast.error(ErrorFormatter(err));
    }
  };

  useEffect(() => {
    fetchFeaturedtPosts(); // fetch immediately on load

    const interval = setInterval(
      () => {
        fetchFeaturedtPosts(); // fetch again every 3 minutes
      },
      3 * 60 * 1000
    ); // 3 minutes in ms

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  return (
    <div className="section-container mb-10">
      <h2 className="titleText text-center dark:text-gray-300 "> Featured Listings</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
        {/* Property Card */}
        {featuredPosts.map((property, i) => {
          if (!property.isProperty) return;
          return <PropertyCard key={i} property={property} imgClass="lg:h-[200px]" />;
        })}
      </div>
    </div>
  );
};

export default FeaturedPostsHandler;
