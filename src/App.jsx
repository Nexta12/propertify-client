import AppRoutes from "@routes/AppRoutes";
import { ThemeProvider } from "./context/ThemeContext";
import { SocketProvider } from "@context/SocketContext";
import useAuthStore from "@store/authStore";

const App = () => {
  const { user } = useAuthStore();

  return (
    <ThemeProvider>
      <SocketProvider userId={user?.id}>
        <AppRoutes />
      </SocketProvider>
    </ThemeProvider>
  );
};

export default App;
