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
    // i will create  a janky UI for it later someday
   <>
   </> 
  )
};
export default Main;
