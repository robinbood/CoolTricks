import { createContext } from "react";

type NotificationContextType = {
  message: string | null;
  type: "success" | "error" | null;
  showNotification: (message: string, type: "success" | "error") => void;
};

export const NotificationContext = createContext<NotificationContextType>({
  message: null,
  type: null,
  showNotification: () => {},
});