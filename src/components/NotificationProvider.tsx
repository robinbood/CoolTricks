import { useState } from "react";
import { NotificationContext } from "./NotificationContext";

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<"success" | "error" | null>(null);

  const showNotification = (newMessage: string, newType: "success" | "error") => {
    setMessage(newMessage);
    setType(newType);

    setTimeout(() => {
      setMessage(null);
      setType(null);
    }, 5000);
  };

  return (
    <NotificationContext value={{ message, type, showNotification }}>
      {children}
    </NotificationContext>
  );
};