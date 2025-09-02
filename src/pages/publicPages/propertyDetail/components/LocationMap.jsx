import { MdLocationOn } from "react-icons/md"
import Map from "@components/map/Map";

const LocationMap = ({property}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg  p-6 mb-8">
                <h3 className="text-lg font-semibold mb-6 dark:text-gray-200">Location</h3>
                <div className="h-80 bg-gray-200 rounded-lg overflow-hidden">
                  {/* Replace with your actual map component */}
                  <Map
                    address={property.address}
                    city={property.city}
                    state={property.state}
                  />

                  {/* <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-600">
                    <MdLocationOn className="text-4xl" />
                    <span className="ml-2">Map View of {property.address}</span>
                  </div> */}
                </div>
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-200">
                  <MdLocationOn className="inline mr-1 " />
                  {property.location}, {property.state}
                </div>
              </div>
  )
}

export default LocationMap