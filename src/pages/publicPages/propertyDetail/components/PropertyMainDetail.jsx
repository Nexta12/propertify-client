import { formatLargeNumber, formatTitleCase } from "@utils/helper"
import { FaBath, FaBed, FaRulerCombined } from "react-icons/fa"


const PropertyMainDetail = ({property}) => {
  return (
     <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg w-full">
  <div className="flex items-center justify-between gap-4 mb-4">
    <p className="text-lg sm:text-xl font-bold text-red-600 capitalize">
      {formatTitleCase(property.documentType)}
    </p>

    <p className="text-lg sm:text-xl font-bold text-red-600">
      {property.currency} {formatLargeNumber(property.price)}{" "}
      <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
        {property.frequency}
      </span>
    </p>
  </div>

  <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-300 mb-4">
    {property.beds && (
      <div className="flex items-center">
        <FaBed className="mr-1 text-indigo-500" />
        <span>{property.beds} Beds</span>
      </div>
    )}
    {property.baths && (
      <div className="flex items-center">
        <FaBath className="mr-1 text-indigo-500" />
        <span>{property.baths} Baths</span>
      </div>
    )}
    {property.propertySize && (
      <div className="flex items-center">
        <FaRulerCombined className="mr-1 text-indigo-500" />
        <span>
          {property.propertySize} {property.propertySizeUnit}
        </span>
      </div>
    )}
  </div>

  {property.isProperty && (
    <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
      Description
    </h2>
  )}

  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm sm:text-base text-justify">
    {property.description}
  </p>
</div>

  )
}

export default PropertyMainDetail