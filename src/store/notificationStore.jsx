import { create } from "zustand";

export const useNotificationStore = create((set) => ({
  notifications: 0,
  isLoading: false,
  error: null,
  fetchNotifications: async (userId) => {
    try {
      set({ isLoading: true, error: null });
      // Replace with your actual API call
      const response = await fetch(`/api/users/${userId}/notifications`);
      const data = await response.json();
      set({ notifications: data.count, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },
  clearNotifications: () => set({ notifications: 0 }),

  markAsRead: async (notificationId) => {
    await fetch(`/api/notifications/${notificationId}`, { method: "PATCH" });
    this.fetchNotifications(); // Refresh count
  },
}));
