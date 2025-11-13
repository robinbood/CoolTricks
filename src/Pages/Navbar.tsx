import { NavLink } from "react-router-dom";
import { useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";

interface NavbarItem {
  label: string;
  path: string;
}

const Navbar = () => {
  const { isAuthenticated, user, loading, signOut } = useAuth();

  // Define navigation items based on authentication status
  const getNavItems = (): NavbarItem[] => {
    const commonItems = [
      { label: "Home", path: "/home" },
    ];

    if (isAuthenticated) {
      return [
        ...commonItems,
        { label: "Payment", path: "/subscribe" },
        { label: "Token Lookup", path: "/token-lookup" },
      ];
    } else {
      return [
        ...commonItems,
        { label: "Sign In", path: "/Signin" },
        { label: "Sign Up", path: "/Signup" },
      ];
    }
  };

  const items: NavbarItem[] = useMemo(() => getNavItems(), [isAuthenticated]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  // Show a loading state while checking authentication
  if (loading) {
    return (
      <nav className="prod-nav">
        <div className="prod-nav-container">
          <div className="prod-logo">
            <span className="prod-logo-icon">🚀</span>
            <span className="prod-logo-text">ProductiveSpace</span>
          </div>
          <div className="prod-nav-actions">
            <div className="loading-indicator">Loading...</div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="prod-nav">
      <div className="prod-nav-container">
        <div className="prod-logo">
          <span className="prod-logo-icon">🚀</span>
          <span className="prod-logo-text">ProductiveSpace</span>
        </div>
        
        <div className="prod-nav-actions">
          {items.map((item: NavbarItem) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "prod-nav-link active" : "prod-nav-link"
              }
            >
              {item.label}
            </NavLink>
          ))}
          
          {/* Show user info and sign-out button when authenticated */}
          {isAuthenticated && (
            <>
              {user && (
                <span className="user-info">
                  {user.name || user.username || user.email}
                </span>
              )}
              <button
                onClick={handleSignOut}
                className="prod-btn-small sign-out-btn"
              >
                Sign Out
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;