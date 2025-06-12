import { Route, Routes } from "react-router-dom";
import { paths } from "./paths";
import PublicLayout from "@pages/publicPages/PublicLayout";
import Homepage from "@pages/publicPages/home/Homepage";
import NotFound from "@pages/notFound/NotFound";
import Properties from "@pages/publicPages/properties/Properties";
import PropertyDetails from "@pages/publicPages/propertyDetail/PropertyDetails";
import Register from "@pages/authpages/Register";
import Login from "@pages/authpages/Login";
import ForgotPassword from "@pages/authpages/ForgotPassword";

import Settings from "@pages/privatePages/agentManager/settings/Settings";

import AdminDashboard from "@pages/privatePages/adminManager/dashboard/AdminDashboard";
import OtherUsersDashboard from "@pages/privatePages/otherRolesManager/dashboard/OtherUsersDashboard";

import AgentDashboard from "@pages/privatePages/agentManager/dashboard/AgentDashboard";
import MyProperties from "@pages/privatePages/agentManager/propertySettings/MyProperties";
import Schedule from "@pages/privatePages/agentManager/schedule/Schedule";
import Analytics from "@pages/privatePages/agentManager/analytics/Analytics";
import Leads from "@pages/privatePages/agentManager/leads/Leads";
import NewProperty from "@pages/privatePages/agentManager/propertySettings/NewProperty";
import EditProperty from "@pages/privatePages/agentManager/propertySettings/EditProperty";
import ViewProperty from "@pages/privatePages/agentManager/propertySettings/ViewProperty";
import AdminLayout from "@pages/privatePages/adminManager/dashboard/AdminLayout";
import AgentLayout from "@pages/privatePages/agentManager/AgentLayout";
import OthersLayout from "@pages/privatePages/otherRolesManager/OthersLayout";
import GeneralPrivateLayout from "@pages/privatePages/PrivateLayout";
import VerifyOTP from "@pages/authpages/VerifyOTP";



const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path={paths.index} element={<PublicLayout />}>
      <Route path={paths.index} element={<Homepage />} />
      <Route path={paths.properties} element={<Properties />} />
      <Route path={`${paths.properties}/:slug`} element={<PropertyDetails />} />
    </Route>


    {/* Admin Private Routes */}
    <Route path={paths.admin} element={<AdminLayout />}>
      <Route path={`${paths.admin}/dashboard`} element={<AdminDashboard />} />

    </Route>

     {/* Agents Private Routes */}
    <Route path={paths.agent} element={<AgentLayout />}>
      
      <Route path={`${paths.agent}/dashboard`} element={<AgentDashboard />} />
      <Route path={`${paths.agent}/properties/all`} element={<MyProperties />} />
      <Route path={`${paths.agent}/properties/add`} element={<NewProperty/>} />
      <Route path={`${paths.agent}/properties/edit/:slug`} element={<EditProperty/>} />
      <Route path={`${paths.agent}/properties/:slug`} element={<ViewProperty/>} />
     
      <Route path={`${paths.agent}/analytics`} element={<Analytics />} />

      <Route path={`${paths.agent}/settings`} element={<Settings />} />
     
    </Route>

     {/* General Private Routes */}
    <Route path={paths.generalRoute} element={<GeneralPrivateLayout />}>
      
      <Route path={`${paths.generalRoute}/settings`} element={<Settings />} />
       <Route path={`${paths.generalRoute}/lead&inquiries`} element={<Leads />} />
        <Route path={`${paths.generalRoute}/schedule`} element={<Schedule />} />
     
    </Route>


     {/* Other Users Private Routes */}
    <Route path={paths.otherUsers} element={<OthersLayout />}>
      
      <Route path={`${paths.otherUsers}/dashboard`} element={<OtherUsersDashboard />} />

    </Route>



      {/* Auth Pages */}
      <Route path={paths.register} element={<Register />} />
      <Route path={paths.login} element={<Login />} />
      <Route path={paths.verifyOTP} element={<VerifyOTP />} />
      <Route path={paths.forgotPassword} element={<ForgotPassword />} />
      


    {/* NOT FOUND ROUTE */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
