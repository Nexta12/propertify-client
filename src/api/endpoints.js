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
  fetchAllProperties: "/api/property/getAll",
  deleteListing: "/api/property/deleteProperty",
  updateCloudinary: '/api/property/deleteFromCloud'
 
};
