
import React from "react";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { FaBuilding, FaUsers, FaLightbulb } from "react-icons/fa";
// import b2 from "@assets/img/b2.ppg"

const TopVerifiedProfessionals = () => (
  <div className="bg-bg-green p-4 rounded-lg shadow">
    <h2 className="text-lg font-semibold mb-3 text-primary-text">Top Verified Professionals</h2>
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex items-center gap-3 mb-3">
        <img
          src={`https://randomuser.me/api/portraits/men/${i + 30}.jpg`}
          alt="Professional"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <p className="font-medium text-primary-text">Dr. John Doe</p>
          <p className="text-sm text-secondary">Medical Doctor - Lagos</p>
        </div>
        <RiVerifiedBadgeFill className="text-blue-500 text-lg ml-auto" />
      </div>
    ))}
  </div>
);

const PromotedCompanies = () => (
  <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
    <h2 className="text-lg font-semibold mb-3 text-primary-text dark:text-gray-300">Promoted Companies</h2>
    {["Zenith Consulting", "Innova Tech", "Justice & Co"].map((name) => (
      <div key={name} className="flex items-center gap-3 mb-2">
        <FaBuilding className="text-orange text-lg" />
        <p className="text-sm font-medium text-primary-text dark:text-gray-100 ">{name}</p>
      </div>
    ))}
  </div>
);

const TipOfTheDay = () => (
  <div className="bg-bg-green dark:bg-gray-900 p-4 rounded-lg shadow text-sm">
    <h3 className="font-semibold text-primary-text dark:text-gray-300 mb-2 flex items-center gap-1">
      <FaLightbulb className="text-orange" /> Tip of the Day
    </h3>
    <p className="text-secondary dark:text-gray-300 ">
      Every today well spent, makes tomorrow a vision of hope
    </p>
  </div>
);

const PlatformStats = () => (
  <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
    <h2 className="text-lg font-semibold mb-3 text-primary-text dark:text-gray-300">Platform Stats</h2>
    <ul className="text-sm text-secondary space-y-1">
      <li>
        <FaUsers className="inline mr-1 text-main-green" /> 12,400+ Professionals
      </li>
      <li>
        <FaBuilding className="inline mr-1 text-orange" /> Active in 36 States
      </li>
      <li>
        <RiVerifiedBadgeFill className="inline mr-1 text-main-green" /> 98% Verified Profiles
      </li>
    </ul>
  </div>
);

const RightSidebar = () => {
  return (
    <div className="hidden lg:block w-full sticky top-20 space-y-6">
      {/* <TopVerifiedProfessionals /> */}
      <PromotedCompanies />
      <TipOfTheDay />
      <PlatformStats />
    </div>
  );
};

export default RightSidebar;
