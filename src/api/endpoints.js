export const endpoints = {
  //  Auth
  register: "api/secure/register",
  login: "api/secure/login",
  logout: "api/secure/logout",
  ForgetPassword: "/api/secure/forgot-password",
  ResetPassword: "/api/secure/reset-password",
  verifyOtp: "/api/secure/verify-otp",
  resendOTP: "/api/secure/resend-otp",
  validateAuth: "/api/secure/validate",

  // Users
  getAllUsers: "/api/user/getAll",
  getUserId: "/api/user/getUserId",
  fetchAllProfessionals: "/api/user/professionals",
  getUserDetails: "/api/user/getUser",
  UpdateUser: "/api/user/update",
  CreateUser: "/api/user/create",
  UpdateUserPassword: "/api/user/update-password",
  deleteUser: "/api/user/delete",
  favouriteProperty: "/api/user/likedProperties",

  // Property
  createProperty: "/api/property/create",
  saveAsDraft: "/api/property/savedraft",
  updateDraft: "/api/property/updatedraft",
  editProperty: "/api/property/editProperty",
  fetchUserProperties: "/api/property/userProperties",
  fetchProperty: "/api/property/getOne",
  recentlyViewdProperties: "/api/property/recentlyViewed",
  fetchAllProperties: "/api/property/getAll",
  deleteListing: "/api/property/deleteProperty",
  deleteMediaFileFromCloud: '/api/property/deleteFromCloud',
  trackViewNoClicks: "/api/property/trackViewNoClicks",


  // Messaging
  //  contact from
  messageSellerContactForm: "/api/contact-form/send-message",
  replyContactFormMessage: "/api/contact-form/reply-message",
  deleteContactFormMessage: "/api/contact-form/delete-message",

   //  Direct Message (DM)
  sendDirectMessage: "/api/direct-message/send-message",
  deleteDirectMessage: "/api/direct-message/delete-message",
  replyDirectMessage: "/api/direct-message/reply-message",
  
  // Bulk Message
  sendBulkMessage: "/api/bulk-message/send-bulk-message",
  deleteBulkMessage: "/api/bulk-message/delete",


  fetchUserMessages: "/api/direct-message/user-message",
  getSentMessages: "/api/direct-message/sent-messages",
  getSingleMessage: "/api/direct-message/read-message",

  deleteMessage: "/api/direct-message/delete-message",

  // Contact Lists
  fetchUserContactsList: "/api/contact/getAll",
  createContact: "/api/contact/create",
  getContactDetails: "/api/contact/getOne",
  deleteContact: "/api/contact/delete",

  // Comment.
  postComment: "/api/comment/create",
  fetchPostComment: "/api/comment/all",
  deleteComment: "/api/comment/delete",

  // Stats
  fetchUserStats: "/api/stats/user-stats",
  fetchClickViewStats: "/api/stats/view-click",
  getAdminUserStats: "/api/stats/admin-user-stats",
  getAdminPostsStats: "/api/stats/admin-post-stats",
  getInquiryStats: "/api/stats/contacts-form",
  getUsersAllContacts: "/api/stats/all-contacts-list",
  getAllTicketsStats: "/api/stats/ticket",


  // Notifications
  getUserNotifications: "/api/notification",
  markNotificationAsSeen: "/api/notification/read",
  deleteNotification: "/api/notification/delete",

  // Tickets
  createTicket: "/api/ticket/create",
  replyTicket: "/api/ticket/reply",
  updateTicket: "/api/ticket/update",
  fetchAllTickets: "/api/ticket/all",
  getSingleTicket: "/api/ticket/getOne",
  deleteTicket: "/api/ticket/delete"
 
};
