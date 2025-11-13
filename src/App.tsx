import "./index.css";
import { AppRoutes } from "./routes";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./components/NotificationProvider";
import { Notification } from "./components/Notification";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";

export function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NotificationProvider>
          <Notification />
          <div className="app">
            <AppRoutes />
          </div>
        </NotificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
