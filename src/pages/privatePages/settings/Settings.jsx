
import { useState } from 'react';
import { FiUser, FiLock, FiBriefcase,  } from 'react-icons/fi';
import ProfileTab from './components/ProfileTab';
import UpdatePasswordTab from './components/UpdatePasswordTab';
import HandleGoBackBtn from '@components/goBackBtn/HandleGoBackBtn';
import HeaderTitle from '@components/ui/HeaderTitle';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  
  return (
     <section className="bg-neutral-100 dark:bg-gray-800  max-w-7xl mx-auto">
       <div className="bg-white dark:bg-gray-800 overflow-hidden border border-gray-100 dark:border-gray-400">
        <div className="pt-2 pl-3">
        <HandleGoBackBtn/>
        </div>
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-400">
        
           <HeaderTitle titleText={"Account Settings"}/>
          <p className="text-gray-500 mt-1 dark:text-gray-200">Manage your personal and company information</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 overflow-x-auto" style={{scrollbarWidth: "none"}} >
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-4 font-medium text-sm flex items-center gap-2 ${activeTab === 'profile' ? 'text-[#28B16D] border-b-2 border-[#28B16D]' : 'text-gray-500 dark:text-gray-200 hover:text-gray-700'}`}
          >
            <FiUser className="text-lg" />
            Edit Profile
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`px-6 py-4 font-medium text-sm flex items-center gap-2 ${activeTab === 'password' ? 'text-[#28B16D] border-b-2 border-[#28B16D]' : 'text-gray-500 dark:text-gray-200 hover:text-gray-700'}`}
          >
            <FiLock className="text-lg" />
            Update Password
          </button>
        
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-8">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
          <ProfileTab/>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
           <UpdatePasswordTab/>
          )}

        </div>
      </div>
    </section>
  );
};

export default Settings;