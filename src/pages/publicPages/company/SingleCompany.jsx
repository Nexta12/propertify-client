import { useEffect, useState } from "react";
import HandleGoBackBtn from "@components/goBackBtn/HandleGoBackBtn";
import { useNavigate, useParams } from "react-router-dom";
import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import { toast } from "react-toastify";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import { paths } from "@routes/paths";
import CoverBanner from "./CoverBanner";
import Certificates from "./Certificates";
import PropertiesTab from "./PropertiesTab";
import AboutUsTab from "./AboutUsTab";
import ContactUsTab from "./ContactUsTab";
import useAuthStore from "@store/authStore";

const SingleCompany = () => {
  const { slug } = useParams();
  const [company, setCompany] = useState(null);
  const [activeTab, setActiveTab] = useState("about");
 const { user } = useAuthStore();

  const navigate = useNavigate()

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const res = await apiClient.get(
          `${endpoints.fetchCompanyDetails}/${slug}`
        );

        setCompany(res.data.data);
      } catch (error) {
        toast.error(ErrorFormatter(error));
      }
    };

    if (slug) {
      fetchCompanyDetails();
    }
  }, [slug]);

  const tabs = [
    { key: "about", label: "About Us" },
    { key: "certifications", label: "Certifications" },
    { key: "properties", label: "Properties" },
    { key: "contact", label: "Contact Us" },
  ];

  const handleNaviagete = () => navigate(`${paths.protected}/companies/update/${slug}`)

  return (
    <>
     { user && <HandleGoBackBtn /> }

     
      
      <div className={` ${!user? "section-container overflow-x-hidden" : "" } min-h-screen bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-100`}>
        {/* Cover Banner */}
       
         <CoverBanner company={company} handleNaviagete={handleNaviagete} />

        {/* Company Info */}
        <div className="section-container bg-white dark:bg-gray-800  mt-16 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold">
            {company?.companyName}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {company?.city}, {company?.state}
          </p>
        </div>

        {/* Tabs */}
        <div className=" border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 section-container">
          <div className="flex space-x-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-3 text-sm md:text-base font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.key
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="section-container bg-white dark:bg-gray-800  ">
          {/* About Us */}
         
          <AboutUsTab activeTab={activeTab} company={company} />

          {/* Certifications */}

           <Certificates activeTab={activeTab} company={company}/>

          {/* Properties */}
          <PropertiesTab activeTab={activeTab} company={company} />

          {/* Contact Us */}
          <ContactUsTab activeTab={activeTab} company={company}/>
        </div>
      </div>
    </>
  );
};

export default SingleCompany;
