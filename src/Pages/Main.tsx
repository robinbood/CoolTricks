import "../CSS/Main.css";
interface LandingPageProps {
  appName?: string; // Customizable, defaults to 'Your App'
  onLoginClick?: () => void; // Callback for login (e.g., Router navigate)
}

const Main: React.FC<LandingPageProps> = ({ 
  appName = 'Your App', 
  onLoginClick 
}) => {
  // Handler: TS-typed, memoized if needed (useCallback for perf)
  const handleLogin = () => {
    if (onLoginClick) {
      onLoginClick(); // e.g., history.push('/login')
    } else {
      window.location.href = '/Signin'; // Fallback
    }
  };

  const handleGetStarted = () => {
    handleLogin(); // Reuse for CTA
  };

  return (
    <>
      

      
       
          <h1 className="heroHeading">
            Welcome to <span>{appName}</span>
          </h1>
          <p className="heroDesc">
            Streamline your workflows with elegant, secure tools. Get started in seconds.
          </p>
          <button
            className="ctaBtn"
            onClick={handleGetStarted}
            aria-label="Get Started"
          >
            Get Started
          </button>
        
    
    </>
  );
};
export default Main;
