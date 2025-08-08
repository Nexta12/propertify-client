import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import ToggleSwitch from "@components/toggleSwitch/ToggleSwitch";
import SocketContext from "@context/SocketContext";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import useAuthStore from "@store/authStore";
import { useContext, useEffect, useState } from "react";
import {
  FiUsers,
  FiHome,
  FiDollarSign,
  FiMessageSquare,
  FiHelpCircle,
  FiCheckCircle,
  FiAlertCircle,
  FiTrendingUp,
  FiWifi,
} from "react-icons/fi";
import { toast } from "react-toastify";

const AdminStats = () => {
  const { onlineInfo } = useContext(SocketContext);
  const { user } = useAuthStore();
  const [metricsData, setMetricsData] = useState(null);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const [resUsers, resPosts, resInqu, resContacts, resTickets] =
          await Promise.all([
            apiClient.get(endpoints.getAdminUserStats),
            apiClient.get(endpoints.getAdminPostsStats),
            apiClient.get(endpoints.getInquiryStats),
            apiClient.get(endpoints.getUsersAllContacts),
            apiClient.get(endpoints.getAllTicketsStats),
          ]);

        setMetricsData({
          users: resUsers.data,
          posts: resPosts.data,
          inquiries: resInqu.data,
          contacts: resContacts.data,
          tickets: resTickets.data,
        });
      } catch (error) {
        toast.error(ErrorFormatter(error));
      }
    };

    if (user) fetchAdminStats();
  }, [user]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          Platform Overview
        </h2>
         <span></span>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Users Section */}
        <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
          <div className="flex items-center mb-4">
            <FiUsers className="text-blue-500 dark:text-blue-400 text-xl mr-2" />
            <h3 className="font-semibold text-gray-700 dark:text-gray-200">
              Users
            </h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {metricsData?.users?.data?.totalUsers?.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {metricsData?.users?.data?.thisWeekUsers} new this week
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              {metricsData?.users?.data?.roleTotals &&
                Object.entries(metricsData.users.data.roleTotals).map(
                  ([role, count]) => (
                    <p
                      key={role}
                      className="font-medium text-gray-600 dark:text-gray-300"
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}:{" "}
                      <span className="text-gray-500 dark:text-gray-400">
                        {count}
                      </span>
                    </p>
                  )
                )}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">New Signups:</span>{" "}
                {metricsData?.users?.data?.newSignups}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">Verified:</span>{" "}
                {metricsData?.users?.data?.verified}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">Unverified:</span>{" "}
                {metricsData?.users?.data?.unverified}
              </p>
              <div className="flex items-center justify-between">
                <p className="text-sm text-green-500 dark:text-green-400 font-medium mt-2">
                  <FiWifi className="inline mr-1 blink" />
                  Total online: {onlineInfo?.totalOnline}
                </p>

                <p className="text-sm text-green-500 dark:text-green-400 font-medium mt-2">
                  <FiCheckCircle className="inline mr-1 blink" />
                  Logged In: {onlineInfo?.loggedInUsers?.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
          <div className="flex items-center mb-4">
            <FiHome className="text-purple-500 dark:text-purple-400 text-xl mr-2" />
            <h3 className="font-semibold text-gray-700 dark:text-gray-200">
              Posts
            </h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {metricsData?.posts?.data?.totalPosts.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {metricsData?.posts?.data?.thisWeekPosts} new this week
              </p>
            </div>

             <div className="grid grid-cols-2 gap-2 text-sm">
              {metricsData?.posts?.data?.postsByStatus &&
                Object.entries(metricsData.posts.data.postsByStatus).map(
                  ([status, count]) => (
                    <p
                      key={status}
                      className="font-medium text-gray-600 dark:text-gray-300"
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}:{" "}
                      <span className="text-gray-500 dark:text-gray-400">
                        {count}
                      </span>
                    </p>
                  )
                )}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
            
              <div className="grid grid-cols-2 gap-2 mt-1">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Properties:</span>{" "}
                 {metricsData?.posts?.data?.isPropertyStats?.true?.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Posts:</span>{" "}
                   {metricsData?.posts?.data?.isPropertyStats?.false?.toLocaleString()}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-1">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Views:</span>{" "}
                  {metricsData?.posts?.data?.totalViews?.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Clicks:</span>{" "}
                    {metricsData?.posts?.data?.totalClicks?.toLocaleString()}
                </p>
              </div>
              <p className="text-sm text-red-500 dark:text-red-400 font-medium mt-1">
                <FiAlertCircle className="inline mr-1" />
                70 flagged content
              </p>
            </div>
          </div>
        </div>

        {/* Revenue Section */}
        <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
          <div className="flex items-center mb-4">
            <FiDollarSign className="text-green-500 dark:text-green-400 text-xl mr-2" />
            <h3 className="font-semibold text-gray-700 dark:text-gray-200">
              Revenue
            </h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                $40,000,000
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                All-time revenue
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="font-medium text-gray-600 dark:text-gray-300">
                  This Month:{" "}
                  <span className="text-gray-500 dark:text-gray-400">
                    $4,000
                  </span>
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-600 dark:text-gray-300">
                  Monthly Avg:{" "}
                  <span className="text-gray-500 dark:text-gray-400">
                    $2,100
                  </span>
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
              <p className="text-sm text-green-500 dark:text-green-400 font-medium">
                <FiTrendingUp className="inline mr-1" />+
                8% from last month
              </p>
            </div>
          </div>
        </div>

        {/* Contacts Section */}
        <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
          <div className="flex items-center mb-4">
            <FiMessageSquare className="text-amber-500 dark:text-amber-400 text-xl mr-2" />
            <h3 className="font-semibold text-gray-700 dark:text-gray-200">
              Contacts
            </h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {metricsData?.contacts?.data?.totalContacts?.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {metricsData?.contacts?.data?.thisWeekContacts} new this week
              </p>
            </div>
          </div>
        </div>

        {/* Inquiries Section */}
        <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
          <div className="flex items-center mb-4">
            <FiMessageSquare className="text-indigo-500 dark:text-indigo-400 text-xl mr-2" />
            <h3 className="font-semibold text-gray-700 dark:text-gray-200">
              Inquiries
            </h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {metricsData?.inquiries?.data?.totalContactFormInquiries.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {metricsData?.inquiries?.data?.thisWeekContactFormInquiries.toLocaleString()} new this week
              </p>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
          <div className="flex items-center mb-4">
            <FiHelpCircle className="text-red-500 dark:text-red-400 text-xl mr-2" />
            <h3 className="font-semibold text-gray-700 dark:text-gray-200">
              Support
            </h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {metricsData?.tickets?.data?.totalTickets.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total tickets
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                 {metricsData?.tickets?.data?.thisWeekTickets.toLocaleString()} new this week
              </p>

            </div>

               <div className="grid grid-cols-2 gap-2 text-sm">
              {metricsData?.tickets?.data?.ticketsByStatus &&
                Object.entries(metricsData.tickets.data.ticketsByStatus).map(
                  ([status, count]) => (
                    <p
                      key={status}
                      className="font-medium text-gray-600 dark:text-gray-300"
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}:{" "}
                      <span className="text-gray-500 dark:text-gray-400">
                        {count}
                      </span>
                    </p>
                  )
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
