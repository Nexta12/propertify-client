import { Link } from "react-router-dom";
import CompanyCard from "./CompanyCard";
import useCompanyStore from "@store/userCompaniesStore";
import { paths } from "@routes/paths";

const MyCompanies = () => {
  const { userCompanies } = useCompanyStore();

  const hasCompanies = userCompanies && userCompanies.length > 0;

  return (
    <div>
      {hasCompanies && (
        <h2 className="text-xl font-semibold mb-4 dark:text-gray-200">My Companies</h2>
      )}
      {hasCompanies ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CompanyCard companies={userCompanies} />
        </div>
      ) : (
        <div className="text-center bg-white/60 dark:bg-gray-800 rounded-sm p-8">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
            You haven’t created any company page yet.
          </h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Create your first company page to start showcasing your properties using your company
            profile.
          </p>
          <Link
            to={`${paths.protected}/create-company`}
            className="inline-block mt-4 px-4 py-2 text-white bg-main-green rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            Create Company Page
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyCompanies;
