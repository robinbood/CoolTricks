import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

/**
 * Reusable loading spinner component
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  size = 'medium',
  className = ''
}) => {
  const sizeMap = {
    small: { width: '20px', height: '20px' },
    medium: { width: '40px', height: '40px' },
    large: { width: '60px', height: '60px' }
  };

  return (
    <div className={`loading-container ${className}`} style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column'
    }}>
      <div 
        className="loading-spinner" 
        style={{
          width: sizeMap[size].width,
          height: sizeMap[size].height,
          border: '4px solid rgba(0, 0, 0, 0.1)',
          borderRadius: '50%',
          borderTopColor: '#3498db',
          animation: 'spin 1s ease-in-out infinite'
        }}
      />
      {message && (
        <p style={{ marginTop: '16px', color: '#666' }}>{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;