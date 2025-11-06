import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/Main.css";

const Completion = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    
    // Parse URL parameters to get payment status
    const urlParams = new URLSearchParams(window.location.search);
    const paymentIntent = urlParams.get('payment_intent');
    const paymentStatus = urlParams.get('redirect_status');
    
    // If payment was not successful, redirect to payment page
    if (paymentStatus !== 'succeeded') {
      setTimeout(() => {
        navigate("/subscribe");
      }, 3000);
    }
  }, [navigate]);

  const handleContinue = () => {
    navigate("/home");
  };

  const handleViewReceipt = () => {
    // In a real app, this would open a receipt or transaction details
    window.open("https://dashboard.stripe.com/test/payments", "_blank");
  };

  return (
    <div className="prod-landing">
      {/* Navigation */}
      <nav className="prod-nav-visible">
        <div className="prod-nav-container">
          <div className="prod-logo">
            <span className="prod-logo-icon">⚡</span>
            <span className="prod-logo-text">ProductiveSpace</span>
          </div>
        </div>
      </nav>

      {/* Completion Section */}
      <section className="prod-hero">
        <div className="prod-hero-bg">
          <div className="prod-hero-bg-circle prod-hero-bg-circle-1"></div>
          <div className="prod-hero-bg-circle prod-hero-bg-circle-2"></div>
          <div className="prod-hero-bg-shape prod-hero-bg-shape-1"></div>
          <div className="prod-hero-bg-shape prod-hero-bg-shape-2"></div>
        </div>

        <div className="prod-container">
          <div className={`prod-hero-content ${isVisible ? 'prod-hero-animate' : ''}`}>
            <div className="prod-completion-card">
              <div className="prod-completion-icon">🎉</div>
              <h1 className="prod-completion-title">Payment Successful!</h1>
              <p className="prod-completion-subtitle">
                Thank you for upgrading to ProductiveSpace Premium. You now have access to all premium features.
              </p>
              
              <div className="prod-completion-features">
                <div className="prod-feature-item">
                  <span className="prod-feature-check">✓</span>
                  <span>Unlimited habit tracking</span>
                </div>
                <div className="prod-feature-item">
                  <span className="prod-feature-check">✓</span>
                  <span>Advanced analytics dashboard</span>
                </div>
                <div className="prod-feature-item">
                  <span className="prod-feature-check">✓</span>
                  <span>Priority customer support</span>
                </div>
                <div className="prod-feature-item">
                  <span className="prod-feature-check">✓</span>
                  <span>Exclusive community challenges</span>
                </div>
              </div>

              <div className="prod-completion-actions">
                <button className="prod-btn-primary" onClick={handleContinue}>
                  Continue to Dashboard
                  <span className="prod-btn-sparkle">✨</span>
                </button>
                <button className="prod-btn-secondary" onClick={handleViewReceipt}>
                  View Receipt
                </button>
              </div>

              <div className="prod-completion-info">
                <p>A confirmation email has been sent to your registered email address.</p>
                <p>Need help? Contact our support team at support@productivespace.com</p>
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
          </div>
          <div className="prod-footer-bottom">
            <p>&copy; 2025 ProductiveSpace. Building better habits, together.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Completion;