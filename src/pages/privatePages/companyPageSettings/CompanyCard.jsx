import { paths } from "@routes/paths";
import { truncate } from "lodash";
import { useNavigate } from "react-router-dom";
import Placeholder from "@assets/img/placeholder.webp";
import LogoPlaceHolder from "@assets/img/your-logo.webp";
import useAuthStore from "@store/authStore";

const CompanyCard = ({ companies }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleNavigate = (company) => {
    const basePath = user ? `${paths.protected}/companies` : paths.companies;
    navigate(`${basePath}/${company.slug}`);
  };

  return (
    <>
      {companies.map((company) => (
        <div
          key={company._id}
          className="bg-white dark:bg-gray-800 border rounded-2xl dark:border-gray-500 overflow-hidden"
        >
          {/* Cover Image */}
          <div className="h-32 w-full">
            <img
              src={company?.coverPic || Placeholder}
              alt="cover"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="p-4">
            {/* Logo + Name */}
            <div className="flex items-center gap-3 mb-3">
              <img
                src={company.companyLogo || LogoPlaceHolder}
                alt="logo"
                className="w-12 h-12 rounded-full border"
              />
              <h3 className="text-lg font-semibold dark:text-gray-200 ">{company.companyName}</h3>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-2 dark:text-gray-200 ">
              {truncate(company.description, { length: 150 })}
            </p>

            {/* View More Button */}
            <button
              onClick={() => handleNavigate(company)}
              className="w-full py-2 rounded-lg border border-gray-300 dark:border-gray-500 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              View More
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export default CompanyCard;
