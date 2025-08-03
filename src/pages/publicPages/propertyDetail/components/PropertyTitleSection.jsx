import FavouriteProperty from "@components/propertyCard/FavouriteProperty"
import SocialShare from "@components/propertyCard/SocialShare"
import { MdLocationOn } from "react-icons/md"


const PropertyTitleSection = ({property}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 capitalize ">
                    {property?.title}
                  </h1>
                  <div className="flex items-center text-gray-600 mt-2">
                    <MdLocationOn className="mr-1" />
                    <span className="capitalize">
                      {property?.location} {property?.city} {property?.state}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 mt-4 md:mt-0 relative">
                  {property.title !== "" && (
                    <FavouriteProperty property={property} className="p-2" />
                  )}
    
                  <div className="relative">
                    <SocialShare />
                  </div>
                </div>
              </div>
  )
}

export default PropertyTitleSection