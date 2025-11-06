import React from 'react';
import '../CSS/Home.css';

interface User {
  id: number;
  email: string;
  name: string | null;
  username: string;
}

interface UserInfoProps {
  user: User;
  isPremium: boolean;
}

const UserInfo: React.FC<UserInfoProps> = ({ user, isPremium }) => {
  return (
    <div className="user-info-section">
      <div className="user-card">
        <div className="user-avatar">
          <div className="avatar-placeholder">
            {user.name ? user.name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="user-details">
          <h2 className="user-name">
            {user.name || user.username}
            {isPremium && <span className="premium-badge">Premium</span>}
          </h2>
          <p className="user-username">@{user.username}</p>
          <p className="user-email">{user.email}</p>
          <div className="user-stats">
            <div className="stat-item">
              <span className="stat-label">Account Type</span>
              <span className="stat-value">{isPremium ? 'Premium' : 'Free'}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Member Since</span>
              <span className="stat-value">Today</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;