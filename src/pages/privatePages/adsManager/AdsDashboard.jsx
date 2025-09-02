import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import useAuthStore from "@store/authStore";
import { formatLargeNumber, formatTitleCase } from "@utils/helper";
import { truncate } from "lodash";
import { useEffect, useState } from "react";
import {
  FiDollarSign,
  FiTrendingUp,
  FiBarChart2,
  FiHome,
  FiUsers,
  FiStar,
  FiPieChart,
} from "react-icons/fi";
import { toast } from "react-toastify";

const AdsDashboard = () => {
  const { user } = useAuthStore();
  const [metricsData, setMetricsData] = useState(null);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const [resPosts, resAdsStats, resRevenue] = await Promise.all([
          apiClient.get(endpoints.getAdminPostsStats),
          apiClient.get(endpoints.getAdsStats),
          apiClient.get(endpoints.getAllRevenueStat),
        ]);

        setMetricsData({
          revenue: resRevenue.data.data,
          properties: resPosts.data.data,
          adsStatus: resAdsStats.data.data,
        });
      } catch (error) {
        toast.error(ErrorFormatter(error));
      }
    };

    if (user) fetchAdminStats();
  }, [user]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-white dark:bg-gray-900">
      {/* Total Active Ads */}
      <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
        <div className="flex items-center mb-4">
          <FiBarChart2 className="text-blue-500 dark:text-blue-400 text-xl mr-2" />
          <h3 className="font-semibold text-gray-700 dark:text-gray-200">
            All-Time Ads
          </h3>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              {metricsData?.adsStatus?.allTimeTotalAds?.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {metricsData?.adsStatus?.thisWeekAds?.toLocaleString()} new this
              week
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {metricsData?.adsStatus?.adsByStatus &&
              Object.entries(metricsData?.adsStatus?.adsByStatus).map(
                ([status, count]) => (
                  <p
                    key={status}
                    className="font-medium text-gray-600 dark:text-gray-300"
                  >
                    {formatTitleCase(
                      status.charAt(0).toUpperCase() + status.slice(1)
                    )}
                    :{" "}
                    <span className="text-gray-500 dark:text-gray-400">
                      {count}
                    </span>
                  </p>
                )
              )}
          </div>
        </div>
      </div>

      {/* Ad Revenue */}
      <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
        <div className="flex items-center mb-4">
          <p className="text-green-500 dark:text-green-400 text-xl mr-2">₦</p>
          <h3 className="font-semibold text-gray-700 dark:text-gray-200">
            Ad Revenue
          </h3>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              ₦{formatLargeNumber(metricsData?.revenue?.allTimeRevenue)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              All-time revenue
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="font-medium text-gray-600 dark:text-gray-300">
                Last Month:{" "}
                <span className="text-gray-500 dark:text-gray-400">
                  ₦{formatLargeNumber(metricsData?.revenue?.lastMonthRevenue)}
                </span>
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-600 dark:text-gray-300">
                This Month:{" "}
                <span className="text-gray-500 dark:text-gray-400">
                  ₦
                  {formatLargeNumber(metricsData?.revenue?.currentMonthRevenue)}
                </span>
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-600 dark:text-gray-300">
                Monthly Avg:{" "}
                <span className="text-gray-500 dark:text-gray-400">
                  ₦{" "}
                  {formatLargeNumber(
                    metricsData?.revenue?.monthlyAverageRevenue
                  )}
                </span>
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-600 dark:text-gray-300">
                This Week:{" "}
                <span className="text-gray-500 dark:text-gray-400">
                  ₦{formatLargeNumber(metricsData?.revenue?.thisWeekRevenue)}
                </span>
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-600 dark:text-gray-300">
                Today:{" "}
                <span className="text-gray-500 dark:text-gray-400">
                  ₦ {formatLargeNumber(metricsData?.revenue?.todaysRevenue)}
                </span>
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-600 dark:text-gray-300">
                Daily Av:{" "}
                <span className="text-gray-500 dark:text-gray-400">
                  ₦{" "}
                  {formatLargeNumber(metricsData?.revenue?.averageDailyRevenue)}
                </span>
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
            {metricsData?.revenue?.percentChange !== undefined && (
              <p
                className={`text-sm font-medium flex items-center ${
                  metricsData.revenue.percentChange >= 0
                    ? "text-green-500 dark:text-green-400"
                    : "text-red-500 dark:text-red-400"
                }`}
              >
                <FiTrendingUp
                  className={`inline mr-1 ${
                    metricsData.revenue.percentChange >= 0
                      ? "rotate-0"
                      : "rotate-180"
                  }`}
                />
                {Math.abs(metricsData.revenue.percentChange).toFixed(2)}% from
                last month
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
        <div className="flex items-center mb-4">
          <FiPieChart className="text-purple-500 dark:text-purple-400 text-xl mr-2" />
          <h3 className="font-semibold text-gray-700 dark:text-gray-200">
            Performance
          </h3>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {formatLargeNumber(metricsData?.properties?.totalImpressions)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Impressions
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {formatLargeNumber(metricsData?.properties?.totalClicks)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Clicks</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {metricsData?.properties?.conversions.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Conversions
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {metricsData?.properties?.ctr}%
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">CTR</p>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-medium">Conversion Rate:</span>{" "}
              {metricsData?.properties?.conversionRate}%
            </p>
          </div>
        </div>
      </div>

      {/* Top Performing Properties */}
      <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
        <div className="flex items-center mb-4">
          <FiHome className="text-amber-500 dark:text-amber-400 text-xl mr-2" />
          <h3 className="font-semibold text-gray-700 dark:text-gray-200">
            Top Properties
          </h3>
        </div>
        <div className="space-y-3">
          {metricsData?.properties?.topProperties
            .slice(0, 4)
            .map((property) => (
              <div
                key={property.id}
                className="flex justify-between items-center"
              >
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 truncate">
                  {truncate(property.title, { length: 20 })}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {property.clicks} clicks
                </p>
              </div>
            ))}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
            <button className="text-sm text-blue-500 dark:text-blue-400 hover:underline">
              View all top properties →
            </button>
          </div>
        </div>
      </div>

      {/* Top Advertisers */}
      <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
        <div className="flex items-center mb-4">
          <FiUsers className="text-indigo-500 dark:text-indigo-400 text-xl mr-2" />
          <h3 className="font-semibold text-gray-700 dark:text-gray-200">
            Top Advertisers
          </h3>
        </div>
        <div className="space-y-3">
          {metricsData?.revenue?.topAdvertisers
            .slice(0, 6)
            .map((advertiser, i) => (
              <div key={i} className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 truncate">
                  {advertiser?.user?.title} {advertiser?.user?.firstName}{" "}
                  {advertiser?.user?.lastName}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ₦{advertiser.totalSpent.toLocaleString()}
                </p>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Ads: {advertiser?.adsCount?.toLocaleString()}
                </p>
              </div>
            ))}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
            <button className="text-sm text-blue-500 dark:text-blue-400 hover:underline">
              View all advertisers →
            </button>
          </div>
        </div>
      </div>

      {/* Ads by Property Type */}
      <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
        <div className="flex items-center mb-4">
          <FiStar className="text-red-500 dark:text-red-400 text-xl mr-2" />
          <h3 className="font-semibold text-gray-700 dark:text-gray-200">
            By Property Type
          </h3>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(metricsData?.properties.categoryStats || {})
              .filter(([key]) =>
                ["commercial", "residential", "rental", "others"].includes(key)
              )
              .map(([type, percentage]) => (
                <div key={type} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-600 dark:text-gray-300">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-medium capitalize">Most Popular:</span> {metricsData?.properties?.mostPopularCategory?.name} (
              {metricsData?.properties?.mostPopularCategory?.percentage}%)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdsDashboard;
