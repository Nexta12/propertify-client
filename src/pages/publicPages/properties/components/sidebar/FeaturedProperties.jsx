import { paths } from "@routes/paths";
import { Link } from "react-router-dom";

const FeaturedProperties = ({ featuredProperties }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-2">
      <h3 className="text-lg font-semibold mb-4 border-b pb-2">
        Latest Listings
      </h3>
      <div className="space-y-4">
        {featuredProperties.slice(0, 2).map((property) => {
          if (property.isProperty) {
            return (
              <Link key={property._id} to={`${paths.properties}/${property.slug}`}>
                <div className="flex gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  {property?.media[0]?.type === "image" ? (
                    <img
                      src={property.media[0]?.url}
                      alt="Property"
                      className="w-20 h-20 object-cover rounded"
                    />
                  ) : (
                    <video controls className="w-20 h-20 object-cover rounded">
                      <source src={property?.media[0]?.url} type="video/mp4" />
                    </video>
                  )}

                  <div>
                    <h4 className="font-medium text-gray-800">{property.title}</h4>
                    <p className="text-sm text-green-600">
                      {property.currency}
                      {property.price}
                    </p>
                    <p className="text-xs text-gray-500">
                      {property.location} {property.city} {property.state}
                    </p>
                  </div>
                </div>
              </Link>
            );
          } else {
            return null; 
          }
        })}
      </div>
    </div>
  );
};

export default FeaturedProperties;
