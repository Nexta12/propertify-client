export const endpoints = {
  //  Auth
  register: "api/secure/register",
  login: "api/secure/login",
  logout: "api/secure/logout",
  ForgetPassword: "/api/secure/forgot-password",
  ResetPassword: "/api/secure/reset-password",
  verifyOtp: "/api/secure/verify-otp",
  validateAuth: "/api/secure/validate",

  // Users
  getAllUsers: "/api/user/getAll",
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


  // Message Property Seller
  messageSellerContactForm: "/api/contact-form/send-message",
  sendDirectMessage: "/api/message/send-message",
  sendBulkMessage: "/api/message/send-bulk-message",
  fetchUserMessages: "/api/message/user-message",
  getSentMessages: "/api/message/sent-messages",
  getSingleMessage: "/api/message/read-message",
  replyMessage: "/api/message/reply-message",
  deleteMessage: "/api/message/delete-message",

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
