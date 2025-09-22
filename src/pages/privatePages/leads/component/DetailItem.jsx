export const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start">
    {icon && <div className="flex-shrink-0 mt-1 mr-3">{icon}</div>}
    <div>
      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</dt>
      <dd className="mt-1 text-[12px] font-secondary text-primary-text dark:text-gray-200">
        {value || "N/A"}
      </dd>
    </div>
  </div>
);
