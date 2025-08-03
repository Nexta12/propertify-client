import { FiHome, FiUsers } from "react-icons/fi";

import StatCard from "@pages/privatePages/dashboard/components/StatCard";
import Chart from "@pages/privatePages/dashboard/components/Chart";
import PieChart from "@pages/privatePages/dashboard/components/PieChart";
import { UserRole } from "@utils/constant";
import { useEffect, useState } from "react";
import useAuthStore from "@store/authStore";
import { toast } from "react-toastify";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import { formatPercentageChange } from "@utils/helper";
import AdminStats from "./components/AdminStats";

const Dashboard = () => {
  const { user } = useAuthStore();

  const [userStarts, setUserStats] = useState(null);
  const [performanceData, setPerformanceData] = useState(null);

  const fetchStatsData = async () => {
    try {
      const [userRes, performanceRes] = await Promise.all([
        apiClient.get(endpoints.fetchUserStats),
        apiClient.get(endpoints.fetchClickViewStats),
      ]);
      setUserStats(userRes.data.data);
      setPerformanceData(performanceRes.data.data);
    } catch (error) {
      toast.error(ErrorFormatter(error));
    }
  };

  useEffect(() => {
    fetchStatsData();
  }, [user]);

  return (
    <section>
      {/* Admin Card */}
      {user.role === UserRole.ADMIN && <AdminStats />}

      {/* Responsive Stats Cards */}
      {user.role !== UserRole.ADMIN && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <StatCard
            title="Total Listings"
            value={userStarts?.totalListings}
            icon={<FiHome className="text-[#28B16D] text-lg sm:text-xl" />}
            description={formatPercentageChange(
              userStarts?.percentListingChange
            )}
            roles={Object.values(UserRole).filter(
              (role) => role !== UserRole.ADMIN
            )}
          />
          <StatCard
            title="Total Contacts"
            value={userStarts?.totalContacts}
            icon={<FiUsers className="text-blue-500 text-xl" />}
            description={`${userStarts?.todaysContacts} new today `}
            roles={Object.values(UserRole).filter(
              (role) => role !== UserRole.ADMIN
            )}
          />

          <StatCard
            title="Total Inquiries"
            value={userStarts?.userMessages}
            icon={<FiHome className="text-[#28B16D] text-lg sm:text-xl" />}
            description={`${userStarts?.todaysMessages} new today `}
            roles={Object.values(UserRole).filter(
              (role) => role !== UserRole.ADMIN
            )}
          />
        </div>
      )}

      {/* Responsive Charts */}
      {user.role !== UserRole.ADMIN && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          <Chart
            title="Your Listings Performance"
            data={performanceData}
            XdataKey="month"
            BarKey1="views"
            BarKey2="clicks"
            fill1="gray"
            fill2="orange"
          />

          <PieChart title="Lead Sources" />
        </div>
      )}
    </section>
  );
};

export default Dashboard;
