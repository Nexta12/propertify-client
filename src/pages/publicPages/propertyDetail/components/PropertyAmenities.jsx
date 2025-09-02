import { CiAlignCenterV } from "react-icons/ci"
import { FaDog, FaParking, FaSwimmingPool, FaWifi } from "react-icons/fa"
import { MdAir, MdSecurity } from "react-icons/md"


const PropertyAmenities = ({property}) => {
  return (
   <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8">
  <h3 className="text-lg font-semibold mb-6 text-primary-text dark:text-white">
    Amenities
  </h3>
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {property.amenities.map((amenity, index) => (
      <div key={index} className="flex items-center text-sm">
        {amenity === "Swimming Pool" && (
          <FaSwimmingPool className="text-indigo-500 mr-2" />
        )}
        {amenity === "Parking" && (
          <FaParking className="text-indigo-500 mr-2" />
        )}
        {amenity === "Gym" && (
          <FaWifi className="text-indigo-500 mr-2" />
        )}
        {amenity === "Balcony" && (
          <FaDog className="text-indigo-500 mr-2" />
        )}
        {amenity === "High-Speed Internet" && (
          <MdAir className="text-indigo-500 mr-2" />
        )}
        {amenity === "24/7 Security" && (
          <MdSecurity className="text-indigo-500 mr-2" />
        )}
        {amenity === "Terrace" && (
          <CiAlignCenterV className="text-indigo-500 mr-2" />
        )}
        <span className="text-gray-600 dark:text-gray-300">{amenity}</span>
      </div>
    ))}
  </div>
</div>

  )
}

export default PropertyAmenities