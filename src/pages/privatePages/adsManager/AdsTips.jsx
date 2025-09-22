import { adTypes } from "@utils/data";

const AdsTips = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12 px-6">
      {/* Page Header */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          Advertising Options
        </h1>
      </div>

      {/* Ad Types Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {adTypes.map((ad, index) => (
          <div
            key={index}
            className="group border border-gray-200 dark:border-gray-800 rounded-xl p-6 bg-gray-50 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-750 transition-colors shadow-sm hover:shadow-lg"
          >
            <div className={`mb-4 ${ad.className} `}>
              <ad.icon />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{ad.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {ad.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdsTips;
