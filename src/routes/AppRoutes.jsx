import { Route, Routes } from "react-router-dom";
import { paths } from "./paths";
import PublicLayout from "@pages/publicPages/PublicLayout";
import Homepage from "@pages/publicPages/home/Homepage";
import NotFound from "@pages/notFound/NotFound";
import Properties from "@pages/publicPages/properties/Properties";
import PropertyDetails from "@pages/publicPages/propertyDetail/PropertyDetails";
import Register from "@pages/authpages/Register";
import VerifyOTP from "@pages/authpages/VerifyOTP";
import Login from "@pages/authpages/Login";
import ForgotPassword from "@pages/authpages/ForgotPassword";
import MyProperties from "@pages/privatePages/properties/MyProperties";
import NewProperty from "@pages/privatePages/properties/NewProperty";
import PrivatePagesLayout from "@pages/privatePages/PrivatePagesLayout";
import Dashboard from "@pages/privatePages/dashboard/Dashboard";
import Messages from "@pages/privatePages/leads/Messages";
import ViewMessage from "@pages/privatePages/leads/ViewMessage";
import EditProperty from "@pages/privatePages/properties/EditProperty";
import Settings from "@pages/privatePages/settings/Settings";
import Contacts from "@pages/privatePages/contactList/Contacts";
import NewContact from "@pages/privatePages/contactList/NewContact";
import ViewContact from "@pages/privatePages/contactList/ViewContact";
import BulkMessage from "@pages/privatePages/contactList/SendBulkMessage";
import Feed from "@pages/privatePages/feed/Feed";
import Profile from "@pages/privatePages/userProfile/Profile";
import DirectMessage from "@pages/privatePages/leads/DirectMessage";
import NewPost from "@pages/posts/NewPost";
import EditPost from "@pages/posts/EditPost";
import Users from "@pages/privatePages/users/Users";
import AddUsers from "@pages/privatePages/users/AddUsers";
import NewTicket from "@pages/privatePages/tickets/NewTicket";
import Tickets from "@pages/privatePages/tickets/Tickets";
import SingleTicket from "@pages/privatePages/tickets/SingleTicket";
import Professionals from "@pages/publicPages/professionals/Professionals";
import AuthLayout from "@pages/authpages/authLayout";
import ResendOTP from "@pages/authpages/ResendOTP";
import ResetPassword from "@pages/authpages/ResetPassword";
import AdsDashboard from "@pages/privatePages/adsManager/AdsDashboard";
import AllAds from "@pages/privatePages/adsManager/AllAds";
import AdsTips from "@pages/privatePages/adsManager/AdsTips";
import NewAds from "@pages/privatePages/adsManager/NewAds";
import PaymentSuccess from "@pages/privatePages/adsManager/PaymentSuccess";
import ChatDashBoard from "@pages/privatePages/chatDashboard/ChatDashBoard";
import GetVerifiedPage from "@pages/privatePages/adsManager/GetVerifiedPage";
import Badges from "@pages/privatePages/adsManager/Badges";
import Verifications from "@pages/privatePages/adsManager/Verifications";
import Companies from "@pages/publicPages/company/Companies";
import SingleCompany from "@pages/publicPages/company/SingleCompany";
import CreateCompany from "@pages/privatePages/companyPageSettings/CreateCompany";
import MyCompanies from "@pages/privatePages/companyPageSettings/MyCompanies";
import UpdateCompany from "@pages/privatePages/companyPageSettings/UpdateCompany";




const AppRoutes = () => (
  <Routes>

        {/* Auth Pages */}
     <Route path={paths.auth} element={<AuthLayout />}>
      <Route path={paths.register} element={<Register />} />
      <Route path={paths.login} element={<Login />} />
      <Route path={paths.verifyOTP} element={<VerifyOTP />} />
      <Route path={paths.resendOTP} element={<ResendOTP />} />
      <Route path={paths.forgotPassword} element={<ForgotPassword />} />
      <Route path={paths.SetNewPassword} element={<ResetPassword />} />
      <Route path={paths.paymentSuccess} element={<PaymentSuccess />} />
     </Route>

    {/* Public Routes */}
    <Route path={paths.index} element={<PublicLayout />}>
      <Route path={paths.index} element={<Homepage />} />
      <Route path={paths.properties} element={<Properties />} />
      <Route path={paths.professionals} element={<Professionals />} />
      <Route path={`${paths.properties}/:slug`} element={<PropertyDetails />} />
      <Route path={paths.companies} element={<Companies />} />
      <Route path={`${paths.companies}/:slug`} element={<SingleCompany />} />
     
    </Route>
    
    {/* Protected Pages */}

      <Route path={paths.protected} element={<PrivatePagesLayout />}>
       
       <Route path={`${paths.protected}/feed`} element={<Feed />} />
       <Route path={`${paths.protected}/dashboard`} element={<Dashboard />} />
       <Route path={`${paths.protected}/live-chat`} element={<ChatDashBoard />} />

        {/* Properties */}
       <Route path={`${paths.protected}/properties/all`} element={<MyProperties />} />
       <Route path={`${paths.protected}/properties/add`} element={<NewProperty/>} />
       <Route path={`${paths.protected}/properties/edit/:slug`} element={<EditProperty/>} />

       {/* Posts */}
      <Route path={`${paths.protected}/posts`} element={<NewPost />} />
      <Route path={`${paths.protected}/posts/edit/:slug`} element={<EditPost />} />

       {/* Users */}
       <Route path={`${paths.protected}/users`} element={<Users />} />
       <Route path={`${paths.protected}/users/add`} element={<AddUsers />} />
      
        {/* Lead, Inquiries and Messages */}
       <Route path={`${paths.protected}/messages`} element={<Messages />} />
       <Route path={`${paths.protected}/messages/:id`} element={<ViewMessage />} />
       <Route path={`${paths.protected}/messages/dm/:slug`} element={<DirectMessage />} />

       {/* Analytics */}
     
         <Route path={`${paths.protected}/profile/:slug`} element={<Profile />} />

         <Route path={`${paths.protected}/settings`} element={<Settings />} />
         <Route path={`${paths.protected}/contacts`} element={<Contacts />} />
         <Route path={`${paths.protected}/contacts/new`} element={<NewContact />} />
         <Route path={`${paths.protected}/contacts/:id`} element={<ViewContact />} />
         <Route path={`${paths.protected}/send-message`} element={<BulkMessage />} />

         {/* Tickets */}
          <Route path={`${paths.protected}/tickets/create`} element={<NewTicket />} />
          <Route path={`${paths.protected}/tickets`} element={<Tickets />} />
          <Route path={`${paths.protected}/tickets/:id`} element={<SingleTicket />} />

        {/* Ads Zone */}
         <Route path={`${paths.protected}/ads-manager`} element={<AdsDashboard />} />
         <Route path={`${paths.protected}/ads/all`} element={<AllAds />} />
         <Route path={`${paths.protected}/ads-tips`} element={<AdsTips />} />
         <Route path={`${paths.protected}/new-ads`} element={<NewAds />} />
         <Route path={`${paths.protected}/verification`} element={<GetVerifiedPage />} />
         <Route path={`${paths.protected}/badges`} element={<Badges />} />
         <Route path={`${paths.protected}/verified-list`} element={<Verifications />} />
       
        {/* Company Settings */}
         <Route path={`${paths.protected}/create-company`} element={<CreateCompany />} />
         <Route path={`${paths.protected}/company-pages`} element={<MyCompanies />} />
         <Route path={`${paths.protected}/companies/:slug`} element={<SingleCompany />} />
         <Route path={`${paths.protected}/companies/update/:slug`} element={<UpdateCompany />} />
      </Route>

   
    {/* NOT FOUND ROUTE */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
