import { useContext } from "react";
import { NotificationContext } from "./NotificationContext";
import "../CSS/Notification.css";

export const Notification = () => {
  const { message, type } = useContext(NotificationContext);

  if (!message) {
    return null;
  }

  return (
    <div className={`notification ${type}`}>
      <p className="notification-message">{message}</p>
    </div>
  );
};