import { leads, performanceData, propertiess, stats } from "@utils/data";

import {
  FiHome,
  FiMail,
  FiUsers,
  FiEye,
  FiEdit,
  FiTrash2,
} from "react-icons/fi";

import { paths } from "@routes/paths";
import StatCard from "@pages/privatePages/components/StatCard";
import Chart from "@pages/privatePages/components/Chart";
import PieChart from "@pages/privatePages/components/PieChart";
import CollapsableBox from "@pages/privatePages/components/CollapsableBox";


const AgentDashboard = () => {
 
  return (
    <section>
      {/* Responsive Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Total Properties"
          value={stats.totalListings}
          icon={<FiHome className="text-[#28B16D] text-lg sm:text-xl" />}
          description="+2.5% from last month"
        />
        <StatCard
          title="Active Leads"
          value={stats.activeLeads}
          icon={<FiUsers className="text-blue-500 text-xl" />}
          description="3 new today"
        />

        <StatCard
          title="Total Properties"
          value={stats.totalListings}
          icon={<FiHome className="text-[#28B16D] text-lg sm:text-xl" />}
          description="+2.5% from last month"
        />
      </div>

      {/* Responsive Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <Chart
          title="Performance"
          data={performanceData}
          XdataKey="month"
          BarKey1="views"
          BarKey2="clicks"
          fill1="goldenrod"
          fill2="green/10"
        />

        <PieChart title="Lead Sources" />
      </div>

      {/* Responsive Tables */}

      <CollapsableBox title="Recent Leads">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Property
              </th>
              <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Contact
              </th>
              <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td className="px-3 py-3 sm:px-6 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                  {lead.name}
                </td>
                <td className="px-3 py-3 sm:px-6 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                  <div className="truncate max-w-[120px] sm:max-w-none">
                    {lead.email}
                  </div>
                </td>
                <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {lead.property}
                </td>
                <td className="px-3 py-3 sm:px-6 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      lead.status === "New"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {lead.status}
                  </span>
                </td>
                <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {lead.lastContact}
                </td>
                <td className="px-3 py-3 sm:px-6 whitespace-nowrap text-sm font-medium space-x-1">
                  <button className="text-[#28B16D] hover:text-[#09C269]">
                    <FiEye className="text-lg" />
                  </button>
                  <button className="text-blue-600 hover:text-blue-800">
                    <FiMail className="text-lg" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CollapsableBox>

      {/* Responsive Property Cards */}
      <CollapsableBox title="Recent Properties" link={`${paths.admin}/properties/new/property`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {propertiess.map((property) => (
            <div
              key={property.id}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <div className="relative h-40 sm:h-48 bg-gray-100">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 rounded text-xs font-medium">
                  {property.status === "active" ? (
                    <span className="text-green-600">Active</span>
                  ) : (
                    <span className="text-yellow-600">Pending</span>
                  )}
                </div>
              </div>
              <div className="p-3 sm:p-4">
                <h3 className="font-bold text-sm sm:text-base">
                  {property.title}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm">
                  {property.location}
                </p>
                <p className="text-lg sm:text-xl font-bold mt-1 sm:mt-2">
                  {property.price}
                </p>
                <div className="flex justify-between mt-2 sm:mt-3 text-xs sm:text-sm text-gray-500">
                  <span>{property.beds} beds</span>
                  <span>{property.baths} baths</span>
                  <span>{property.area}</span>
                </div>
                <div className="flex justify-between mt-2 sm:mt-3 pt-2 border-t border-gray-100 text-xs sm:text-sm">
                  <div>
                    <span className="text-gray-500">Views: </span>
                    <span className="font-medium">{property.views}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Inquiries: </span>
                    <span className="font-medium">{property.inquiries}</span>
                  </div>
                </div>
                <div className="flex justify-end mt-2 sm:mt-3 space-x-1 sm:space-x-2">
                  <button className="p-1 sm:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                    <FiEdit className="text-sm sm:text-base" />
                  </button>
                  <button className="p-1 sm:p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full">
                    <FiTrash2 className="text-sm sm:text-base" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CollapsableBox>

     
    </section>
  );
};

export default AgentDashboard;
