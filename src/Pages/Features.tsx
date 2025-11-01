import React from 'react';

const Features: React.FC = () => {
  return (
    <section className="prod-features">
      <div className="prod-container">
        <div className="prod-features-header">
          <h2>More Than Just Tracking</h2>
          <p>Turn productivity into a social, rewarding experience</p>
        </div>

        <div className="prod-features-grid">
          <div className="prod-feature-card">
            <div className="prod-feature-icon">🎯</div>
            <h3 className="prod-feature-title">Smart Goal Setting</h3>
            <p className="prod-feature-desc">
              Set ambitious yet achievable goals. Our AI learns your habits and suggests personalized targets.
            </p>
          </div>

          <div className="prod-feature-card">
            <div className="prod-feature-icon">🎉</div>
            <h3 className="prod-feature-title">Community Cheers</h3>
            <p className="prod-feature-desc">
              Get instant feedback and encouragement. Watch your motivation soar from peer recognition.
            </p>
          </div>

          <div className="prod-feature-card">
            <div className="prod-feature-icon">📊</div>
            <h3 className="prod-feature-title">Visual Progress</h3>
            <p className="prod-feature-desc">
              Beautiful charts and insights that make tracking progress addictively satisfying.
            </p>
          </div>

          <div className="prod-feature-card">
            <div className="prod-feature-icon">🔥</div>
            <h3 className="prod-feature-title">Streak Systems</h3>
            <p className="prod-feature-desc">
              Build momentum with gamified streaks. Never break a positive cycle again.
            </p>
          </div>

          <div className="prod-feature-card">
            <div className="prod-feature-icon">🎮</div>
            <h3 className="prod-feature-title">Productivity Games</h3>
            <p className="prod-feature-desc">
              Turn chores into challenges. Make productivity fun with community competitions.
            </p>
          </div>

          <div className="prod-feature-card">
            <div className="prod-feature-icon">🤝</div>
            <h3 className="prod-feature-title">Accountability Partners</h3>
            <p className="prod-feature-desc">
              Find study buddies, workout partners, or business accountability mates.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;