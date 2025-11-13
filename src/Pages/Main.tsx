import { useState, useEffect, useCallback } from 'react';
import "../CSS/Main.css";
import { useNavigate } from 'react-router-dom';
import { useAuthNavigation } from '../hooks/useAuthNavigation';
import Testimonials from './Testimonials';
import Features from './Features';

const Main: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { loading, navigateIfAuthenticated } = useAuthNavigation();
  const Navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Redirect authenticated users to home page using our custom hook
  useEffect(() => {
    navigateIfAuthenticated('/home');
  }, [navigateIfAuthenticated]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="loading-container" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column'
      }}>
        <div className="loading-spinner" style={{
          width: '40px',
          height: '40px',
          border: '4px solid rgba(0, 0, 0, 0.1)',
          borderRadius: '50%',
          borderTopColor: '#3498db',
          animation: 'spin 1s ease-in-out infinite'
        }}></div>
        <p style={{ marginTop: '16px', color: '#666' }}>Checking authentication...</p>
      </div>
    );
  }

  const handleLogin = useCallback(() => {
    Navigate("/Signin");
  }, [Navigate]);

  const handleLogup = useCallback(() => {
    Navigate("/Signup");
  }, [Navigate]);



  return (
    <div className="prod-landing">
      {/* Navigation - Top Login */}
      <nav className="prod-nav-visible ">
        <div className="prod-nav-container">
          <div className="prod-logo">
            <span className="prod-logo-icon">⚡</span>
            <span className="prod-logo-text">ProductiveSpace</span>
          </div>
          <div className="prod-nav-actions">
            <button className="prod-btn-nav" onClick={handleLogin}>
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="prod-hero">
        <div className="prod-hero-bg">
          <div className="prod-hero-bg-circle prod-hero-bg-circle-1"></div>
          <div className="prod-hero-bg-circle prod-hero-bg-circle-2"></div>
          <div className="prod-hero-bg-shape prod-hero-bg-shape-1"></div>
          <div className="prod-hero-bg-shape prod-hero-bg-shape-2"></div>
        </div>

        <div className="prod-container">
          <div className="prod-hero-content">
            <div className={`prod-hero-header ${isVisible ? 'prod-hero-animate' : ''}`}>
              <div className="prod-badge">
                🚀 Build Habits That Last Life
              </div>
              <h1 className="prod-hero-title">
                Share Your
                <span className="prod-gradient-text"> Wins Daily</span>
              </h1>
              <p className="prod-hero-subtitle">
                Join a community where productivity meets celebration. Post your achievements,
                get inspired by others, and build momentum together. Every small win matters.
              </p>
            </div>

            <div className={`prod-hero-visual ${isVisible ? 'prod-hero-visual-visible' : ''}`}>
              <div className="prod-stats-preview">
                <div className="prod-stat-preview">
                  <div className="prod-stat-number">150+</div>
                  <div className="prod-stat-label">Today</div>
                </div>
                <div className="prod-stat-preview">
                  <div className="prod-stat-number">2.4K+</div>
                  <div className="prod-stat-label">This Week</div>
                </div>
                <div className="prod-stat-preview">
                  <div className="prod-stat-number">95%</div>
                  <div className="prod-stat-label">Motivated</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Testimonials />

      {/* Final Join - Bottom */}
      <section className="prod-final">
        <div className="prod-container">
          <div className="prod-final-content">
            <div className="prod-final-header">
              <h2>Ready to Start Your Win Streak?</h2>
              <p>Join 10,000+ achievers sharing their progress every day</p>
            </div>

            <div className="prod-final-actions">
              <button className="prod-btn-final" onClick={handleLogup}>
                🚀 Join & Start Sharing Today
                <span className="prod-btn-sparkle">✨</span>
              </button>

            </div>

            <div className="prod-social-post">
              <div className="prod-post-user">
                <div className="prod-avatar">
                  <span className="prod-avatar-emoji">🏃‍♀️</span>
                </div>
                <div className="prod-user-details">
                  <h4>Sarah Chen</h4>
                  <span className="prod-timestamp">4 hours ago</span>
                </div>
              </div>
              <div className="prod-post-body">
                <p className="prod-post-text">🌅 Beat my personal best! 26.3 minutes for 5k this morning. The new training plan is working magic ✨ Getting faster every week! Who's training with me tomorrow?</p>
                <div className="prod-progress-bar">
                  <div className="prod-progress-fill" style={{width: '85%'}}></div>
                  <span className="prod-progress-text">85% of weekly goal</span>
                </div>
              </div>
              <div className="prod-post-engagement">
                <div className="prod-reactions">
                  <button className="prod-reaction-btn">🏃‍♂️ 18</button>
                  <button className="prod-reaction-btn">💪 15</button>
                  <button className="prod-reaction-btn">🌟 9</button>
                </div>
                <span className="prod-comments-count">12 comments</span>
              </div>
            </div>

            <div className="prod-social-post">
              <div className="prod-post-user">
                <div className="prod-avatar">
                  <span className="prod-avatar-emoji">🎨</span>
                </div>
                <div className="prod-user-details">
                  <h4>Mike Rodriguez</h4>
                  <span className="prod-timestamp">6 hours ago</span>
                </div>
              </div>
              <div className="prod-post-body">
                <p className="prod-post-text">📈 Hit my reading goal early this month! 18 books down, 12 to go. Currently loving "Atomic Habits" by James Clear. The compound effect is real folks! 📚✨</p>
                <div className="prod-book-progress">
                  <div className="prod-books-grid">
                    {Array.from({length: 30}, (_, i) => (
                      <div key={i} className={`prod-book ${i < 18 ? 'prod-book-read' : ''}`}></div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="prod-post-engagement">
                <div className="prod-reactions">
                  <button className="prod-reaction-btn">📚 21</button>
                  <button className="prod-reaction-btn">🎯 16</button>
                  <button className="prod-reaction-btn">📖 11</button>
                </div>
                <span className="prod-comments-count">9 comments</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Features />

      {/* Gamification Section */}
      <section className="prod-gamification">
        <div className="prod-container">
          <div className="prod-game-showcase">
            <div className="prod-game-header">
              <h2>Make Productivity Addictive</h2>
              <p>Watch your daily tasks transform into epic quests</p>
            </div>

            <div className="prod-game-timeline">
              <div className="prod-timeline-item">
                <div className="prod-timeline-dot"></div>
                <div className="prod-timeline-content">
                  <h4>Morning Routine Quest Complete!</h4>
                  <p>Earned 25 XP, unlocked "Early Bird" achievement</p>
                  <div className="prod-xp-badge">+25 XP</div>
                </div>
              </div>

              <div className="prod-timeline-item prod-timeline-item-active">
                <div className="prod-timeline-dot"></div>
                <div className="prod-timeline-content">
                  <h4>Reading Marathon Active</h4>
                  <p>12 books this month, 3 more to earn "Bookworm Elite" title</p>
                  <div className="prod-progress-bar">
                    <div className="prod-progress-fill"></div>
                  </div>
                </div>
              </div>

              <div className="prod-timeline-item">
                <div className="prod-timeline-dot"></div>
                <div className="prod-timeline-content">
                  <h4>Workout Chain Building</h4>
                  <p>7-day streak! Next: 14-day challenge unlocks</p>
                  <div className="prod-streak-flame">🔥7</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="prod-stats">
        <div className="prod-container">
          <div className="prod-stats-header">
            <h2>The Numbers Don't Lie</h2>
            <p>See how we're level up productivity as a community</p>
          </div>

          <div className="prod-stats-grid">
            <div className="prod-stat-large">
              <div className="prod-stat-icon">🚀</div>
              <div className="prod-stat-content">
                <div className="prod-stat-number">2.4M+</div>
                <div className="prod-stat-label">Productivity Moments Shared</div>
                <div className="prod-stat-desc">From small wins to major milestones</div>
              </div>
            </div>

            <div className="prod-stat-large">
              <div className="prod-stat-icon">👥</div>
              <div className="prod-stat-content">
                <div className="prod-stat-number">127K+</div>
                <div className="prod-stat-label">Active Achievers</div>
                <div className="prod-stat-desc">Growing together, every day</div>
              </div>
            </div>

            <div className="prod-stat-large">
              <div className="prod-stat-icon">🏆</div>
              <div className="prod-stat-content">
                <div className="prod-stat-number">98.7%</div>
                <div className="prod-stat-label">Community Engagement</div>
                <div className="prod-stat-desc">People show up for each other</div>
              </div>
            </div>
          </div>

          <div className="prod-stats-dots">
            <div className="prod-stat-dot">
              <span>•</span> 4.2 avg hours saved daily through community tips
            </div>
            <div className="prod-stat-dot">
              <span>•</span> 85% of habits stick after 30 days
            </div>
            <div className="prod-stat-dot">
              <span>•</span> 1M+ cheers sent between community members
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="prod-final-cta">
        <div className="prod-container">
          <div className="prod-final-cta-content">
            <h2>Your Productivity Legend Starts Here</h2>
            <p>Join the movement. Share your wins. Build epic habits. Have fun while doing it.</p>

            <div className="prod-final-cta-actions">
              <button className="prod-btn-primary-large" onClick={handleLogin}>
                🚀 Start Your Productivity Journey
                <span className="prod-btn-rocket">🌟</span>
              </button>
              <button className="prod-btn-ghost" onClick={handleLogin}>
                Already a legend? Sign In
              </button>
            </div>

            <div className="prod-final-guarantee">
              <div className="prod-guarantee-item">
                <span className="prod-guarantee-icon">✨</span>
                <span>Free forever - no credit card required</span>
              </div>
              <div className="prod-guarantee-item">
                <span className="prod-guarantee-icon">🎉</span>
                <span>Join instantly - start celebrating today</span>
              </div>
              <div className="prod-guarantee-item">
                <span className="prod-guarantee-icon">🛡️</span>
                <span>Cancel anytime - no questions asked</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="prod-footer">
        <div className="prod-container">
          <div className="prod-footer-content">
            <div className="prod-footer-brand">
              <div className="prod-footer-logo">
                <span className="prod-logo-icon">⚡</span>
                <span className="prod-logo-text">ProductiveSpace</span>
              </div>
              <p>Where productivity becomes a community celebration.</p>
            </div>

            <div className="prod-footer-links">
              <div className="prod-footer-section">
                <h4>Community</h4>
                <a href="#" onClick={handleLogin}>Daily Wins</a>
                <a href="#" onClick={handleLogin}>Challenges</a>
                <a href="#" onClick={handleLogin}>Leaderboards</a>
              </div>

              <div className="prod-footer-section">
                <h4>Product</h4>
                <a href="#" onClick={handleLogin}>Habits Tracker</a>
                <a href="#" onClick={handleLogin}>Goal Setting</a>
                <a href="#" onClick={handleLogin}>Analytics</a>
              </div>

              <div className="prod-footer-section">
                <h4>Join Us</h4>
                <button className="prod-btn-small" onClick={handleLogin}>
                  Get Started
                </button>
              </div>
            </div>
          </div>

          <div className="prod-footer-bottom">
            <p>&copy; 2025 ProductiveSpace. Building better habits, together.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Main;
