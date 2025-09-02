import { motion as Motion } from "framer-motion";

const PropertiesTab = ({ activeTab, company}) => {
  return (
    <>
       {activeTab === "properties" && (
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-3 gap-6">
                {company?.properties?.data?.map((property) => (
                  <div
                    key={property?._id}
                    className="bg-white dark:bg-gray-700 rounded-xl shadow hover:shadow-md transition overflow-hidden"
                  >
                    <img
                      src={property?.image}
                      alt={property?.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">
                        {property?.title}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {property?.location}
                      </p>
                      <p className="text-blue-600 font-bold mt-2">
                        ₦{property?.price?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center space-x-2">
                {Array.from(
                  { length: company?.properties?.pagination?.totalPages || 1 },
                  (_, i) => (
                    <button
                      key={i}
                      className={`px-3 py-1 rounded-md border ${
                        company?.properties?.pagination?.page === i + 1
                          ? "bg-blue-600 text-white"
                          : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      {i + 1}
                    </button>
                  )
                )}
              </div>
            </Motion.div>
          )}
    </>
  )
}

export default PropertiesTab