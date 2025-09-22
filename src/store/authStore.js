import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import { httpError } from "@pages/errorPages/ErrorCodes";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import { paths } from "@routes/paths";
import { getLoggedInUserPath } from "@utils/helper";

import {
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
} from "@utils/localStorage";
import { toast } from "react-toastify";
import { create } from "zustand";
import useCompanyStore from "./userCompaniesStore";

const localStorageUser = getLocalStorageItem("user");

const handleLogin = async (loginDetails, navigate, set) => {
  try {
    set({ isLoading: true });
    const { data: response } = await apiClient.post(endpoints.login, loginDetails);

    const user = response.data;
    const accessToken = response.accessToken;

    const userDetail = {
      _id: user._id,
      slug: user.slug,
      likedProperties: user.likedProperties,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      title: user.title,
      userStatus: user.userStatus,
    };
    setLocalStorageItem("accessToken", accessToken);
    setLocalStorageItem("user", userDetail);

    //  Update User
    set({ user: user, isAuthenticated: true, isLoading: false, error: null });

    // Redirect to the right Dashboard
    navigate(getLoggedInUserPath(user));
  } catch (error) {
    set({
      user: null,
      error: toast.error(ErrorFormatter(error) || "Internal Server error"),
      isAuthenticated: false,
      isLoading: false,
    });
    if (ErrorFormatter(error) === httpError.UnverifiedAccount) {
      setTimeout(() => {
        navigate(paths.resendOTP);
      }, 2000);
    }
  }
};

const handleLogout = async (navigate, set) => {
  set({ isLoading: true, error: null });

  try {
    // Send logout request if backend requires it
    await apiClient.post(endpoints.logout);
    // Remove token and user from localStorage
    removeLocalStorageItem("accessToken");
    removeLocalStorageItem("user");

    // Reset user state
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    navigate(paths.index);
  } catch (error) {
    set({
      isLoading: false,
      error: toast.error(error?.response?.data?.message || "Logout failed"),
    });
  }
};

const useAuthStore = create((set, get) => ({
  isAuthenticated: false,
  user: localStorageUser || null,
  error: null,
  setError: (error) => set({ error }),
  isLoading: false,
  login: async (loginDetails, navigateFn) => handleLogin(loginDetails, navigateFn, set),

  logout: async (navigate) => handleLogout(navigate, set),

  updateUser: (data) => {
    const { user } = get();
    const updatedUser = { ...user, ...data };
    setLocalStorageItem("user", updatedUser);
    set({ user: updatedUser || null });
  },

  validateAuth: async () => {
    const token = getLocalStorageItem("accessToken");
    const { setUserCompanies } = useCompanyStore.getState();

    if (!token) {
      await apiClient.post(endpoints.logout);
      set({ isAuthenticated: false });
      return;
    }
    try {
      const response = await apiClient.get(endpoints.validateAuth);
      const user = response.data.data;

      set({ isAuthenticated: true, user });

      if (user?.id) {
        const companiesRes = await apiClient.get(`${endpoints.fetchUserCompanies}/${user.id}`);
        setUserCompanies(companiesRes.data.data);
      }
    } catch {
      set({ isAuthenticated: false });
      removeLocalStorageItem("accessToken");
      removeLocalStorageItem("user");
    }
  },
}));

export default useAuthStore;
