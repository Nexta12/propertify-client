// import { useEffect } from "react";
// import { useNotificationStore } from "@store/notificationStore";
// import { user } from "@utils/user";
// import { useAuth } from "./useAuth"; // Assuming you have an auth hook

export const useNotifications = () => {
  // const { user } = useAuth(); // Get current user
  // const { notifications, isLoading, error, fetchNotifications } =
  //   useNotificationStore();

  // useEffect(() => {
  //   if (user?.id) {
  //     fetchNotifications(user.id);

  //     const socket = new WebSocket(
  //       `wss://your-api.com/notifications?userId=${user.id}`
  //     );
  //     socket.onmessage = (event) => {
  //       const data = JSON.parse(event.data);
  //       useNotificationStore.setState({ notifications: data.count });
  //     };

  //     return () => socket.close();
  //   }
  // }, [ fetchNotifications]);

  // return { notifications, isLoading, error };
};
