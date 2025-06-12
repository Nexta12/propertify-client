
import { useState } from 'react';
import { FiUser, FiLock, FiBriefcase,  } from 'react-icons/fi';
import ProfileTab from './components/ProfileTab';
import UpdatePasswordTab from './components/UpdatePasswordTab';
import CompanyTab from './components/CompanyTab';
import { ToastContainer } from 'react-toastify';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  
  return (
     <section className="bg-neutral-100  max-w-7xl mx-auto">
      <ToastContainer/>
       <div className="bg-white overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-500 mt-1">Manage your personal and company information</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 overflow-x-auto" style={{scrollbarWidth: "none"}} >
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-4 font-medium text-sm flex items-center gap-2 ${activeTab === 'profile' ? 'text-[#28B16D] border-b-2 border-[#28B16D]' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <FiUser className="text-lg" />
            Edit Profile
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`px-6 py-4 font-medium text-sm flex items-center gap-2 ${activeTab === 'password' ? 'text-[#28B16D] border-b-2 border-[#28B16D]' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <FiLock className="text-lg" />
            Update Password
          </button>
          <button
            onClick={() => setActiveTab('company')}
            className={`px-6 py-4 font-medium text-sm flex items-center gap-2 ${activeTab === 'company' ? 'text-[#28B16D] border-b-2 border-[#28B16D]' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <FiBriefcase className="text-lg" />
            My Company
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

          {/* Company Tab */}
          {activeTab === 'company' && (
           <CompanyTab/>
          )}

        </div>
      </div>
    </section>
  );
};

export default Settings;