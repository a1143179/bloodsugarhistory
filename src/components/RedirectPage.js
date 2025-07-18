import React, { useState, useEffect } from 'react';
import './RedirectPage.css';

const RedirectPage = () => {
  const [countdown, setCountdown] = useState(10);
  const newUrl = 'https://medicaltracker.azurewebsites.net';

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.location.href = newUrl;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Backup redirect after 10 seconds
    const backupTimer = setTimeout(() => {
      window.location.href = newUrl;
    }, 10000);

    return () => {
      clearInterval(timer);
      clearTimeout(backupTimer);
    };
  }, []);

  const redirectNow = () => {
    window.location.href = newUrl;
  };

  return (
    <div className="redirect-container">
      <div className="redirect-content">
        <h1>🚀 Website Moved</h1>
        <p>This website has been permanently moved to a new location.</p>
        
        <div className="new-url">
          <strong>New URL:</strong><br />
          <a href={newUrl} target="_blank" rel="noopener noreferrer">
            {newUrl}
          </a>
        </div>
        
        <p>You will be automatically redirected in:</p>
        <div className="countdown">{countdown}</div>
        
        <div className="spinner"></div>
        
        <button className="redirect-button" onClick={redirectNow}>
          Redirect Now
        </button>
      </div>
    </div>
  );
};

export default RedirectPage; 