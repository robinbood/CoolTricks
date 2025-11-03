
# React Context API Explained

The React Context API provides a way to pass data through the component tree without having to pass props down manually at every level. This makes it a great solution for managing global state in your application, such as user authentication, theme, or in our case, a notification system.

## Core Concepts

The Context API consists of three main parts:

1.  **`createContext`**: This function creates a context object. When React renders a component that subscribes to this context object, it will read the current context value from the closest matching `Provider` in the tree.

    ```javascript
    import { createContext } from "react";

    export const MyContext = createContext(defaultValue);
    ```

   

2.  **`Context`**: This component allows consuming components to subscribe to context changes. It accepts a `value` prop to be passed to consuming components that are descendants of this `Provider`.

    ```javascript
    import { MyContext } from "./MyContext";

    const App = () => {
      const value = { /* some value */ };

      return (
        <MyContext value={value}>
          <MyComponent />
        </MyContext>
      );
    };
    ```

3.  **`useContext`**: This hook accepts a context object (the value returned from `createContext`) and returns the current context value for that context. The current context value is determined by the `value` prop of the nearest `<MyContext.Provider>` above the calling component in the tree.

    ```javascript
    import { useContext } from "react";
    import { MyContext } from "./MyContext";

    const MyComponent = () => {
      const value = useContext(MyContext);

      return <div>{value}</div>;
    };
    ```

## Our Notification System Example

Let's break down how we used the Context API to create our notification system.

### 1. `NotificationContext.tsx`

We start by creating a context for our notification system.

```javascript
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
```

Here, we define the shape of our context data using a TypeScript type `NotificationContextType`. We also provide a default value to `createContext`. This default value is used when a component tries to consume the context without a `Provider` in its ancestry.

### 2. `NotificationProvider.tsx`

Next, we create a `NotificationProvider` component. This component will be responsible for managing the state of our notification system and providing it to its children.

```javascript
import { useState } from "react";
import { NotificationContext } from "./NotificationContext";

export const NotificationProvider = ({ children }) => {
  const [message, setMessage] = useState(null);
  const [type, setType] = useState(null);

  const showNotification = (newMessage, newType) => {
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
```

In this component, we use the `useState` hook to manage the `message` and `type` of the notification. We also define a `showNotification` function that updates the state and clears it after 5 seconds.

Finally, we wrap the `children` with the `NotificationContext.Provider` and pass the `message`, `type`, and `showNotification` function as the `value`.

### 3. `frontend.tsx`

To make the notification context available to our entire application, we wrap the `App` component with the `NotificationProvider` in our `frontend.tsx` file.

```javascript
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { NotificationProvider } from "./components/NotificationProvider";
import { Notification } from "./components/Notification";

const elem = document.getElementById("root");
const app = (
  <Router>
    <NotificationProvider>
      <Notification />
      <App />
    </NotificationProvider>
  </Router>
);

// ...
```

Now, any component within the `App` component can access the notification context.

### 4. `Notification.tsx`

This component is responsible for displaying the notification. It consumes the notification context using the `useContext` hook.

```javascript
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
```

When the `message` in the context is not `null`, the component renders a `div` with the appropriate class and message.

### 5. `Signup.tsx`

Finally, we need a way to trigger the notification. In our `Signup.tsx` component, we consume the notification context and call the `showNotification` function when the user successfully signs up.

```javascript
import { useContext } from "react";
import { NotificationContext } from "../components/NotificationContext";

const SignUp = () => {
  const { showNotification } = useContext(NotificationContext);

  const WhenSubmit = (data) => {
    handleFormSubmit(data);
    showNotification("Signup successful!", "success");
  };

  // ...
};
```

## Conclusion

The Context API is a powerful tool for managing global state in a React application. It allows you to share data between components without having to pass props down through the component tree. This can make your code cleaner, more organized, and easier to maintain.
