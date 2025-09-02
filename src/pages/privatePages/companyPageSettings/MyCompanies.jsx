import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import useAuthStore from "@store/authStore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CompanyCard from "./CompanyCard";


const MyCompanies = () => {
  const { user } = useAuthStore();
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchUserCompanies = async () => {
      try {
        const res = await apiClient.get(
          `${endpoints.fetchUserCompanies}/${user.id}`
        );

        setCompanies(res.data.data);
      } catch (error) {
        toast.error(ErrorFormatter(error));
      }
    };

    fetchUserCompanies();
  }, [user]);

  return (
    <div className="">
      <h2 className="text-xl font-semibold mb-4 dark:text-gray-200 ">My Companies</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <CompanyCard companies={companies}/>

      </div>

    </div>
  );
};

export default MyCompanies;
