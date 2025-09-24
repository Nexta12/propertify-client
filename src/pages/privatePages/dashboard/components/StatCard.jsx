import useAuthStore from "@store/authStore";

const StatCard = ({ title, value, icon, description, roles = [] }) => {
  const { user } = useAuthStore();

  if (!user || !roles.includes(user.role)) return null;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between">
        <div>
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</h3>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold mt-1 sm:mt-2 text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
        <div className="bg-[#E8F5E9] dark:bg-green-900 p-2 sm:p-3 rounded-lg">{icon}</div>
      </div>
      <p className="text-green-500 text-xs sm:text-sm mt-2">{description}</p>
    </div>
  );
};

export default StatCard;
