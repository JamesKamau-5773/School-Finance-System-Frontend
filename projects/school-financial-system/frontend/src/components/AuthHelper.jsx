/**
 * AuthHelper Component - Development utility for injecting JWT tokens
 * 
 * Shows token info and allows setting new tokens during development.
 * Only visible when VITE_DEV_MODE=true (set in .env.development)
 */

import React, { useState } from 'react';
import { getToken, setToken, clearToken, getTokenInfo } from '../utils/tokenHelper';
import './AuthHelper.css';

const AuthHelper = () => {
  const [tokenInput, setTokenInput] = useState('');
  const [showHelper, setShowHelper] = useState(false);
  const token = getToken();
  const isExpired = token ? isTokenExpired(token) : false;

  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() > payload.exp * 1000;
    } catch {
      return false;
    }
  };

  const handleSetToken = (e) => {
    e.preventDefault();
    if (tokenInput.trim()) {
      setToken(tokenInput);
      setTokenInput('');
      setTimeout(() => window.location.reload(), 500);
    }
  };

  const handleClearToken = () => {
    clearToken();
    window.location.reload();
  };

  const handleGetTokenInfo = () => {
    getTokenInfo();
  };

  // Only show in development (check if VITE_DEV_MODE is set)
  const isDev = import.meta.env.DEV;

  if (!isDev) return null;

  return (
    <>
      {/* Floating button to toggle helper */}
      <button 
        className="auth-helper-toggle"
        onClick={() => setShowHelper(!showHelper)}
        title="Development: JWT Token Helper"
      >
        [TOKEN]
      </button>

      {/* Token helper panel */}
      {showHelper && (
        <div className="auth-helper-panel">
          <div className="auth-helper-header">
            <h3>[TOKEN] JWT Token Helper (Dev Only)</h3>
            <button 
              className="close-btn"
              onClick={() => setShowHelper(false)}
            >[X]</button>
          </div>

          {/* Current token status */}
          <div className="token-status">
            {token ? (
              <>
                <div className={`status-badge ${isExpired ? 'expired' : 'valid'}`}>
                  {isExpired ? '[EXPIRED] Token Expired' : '[OK] Token Valid'}
                </div>
                <details>
                  <summary>[INFO] Token Details</summary>
                  <button 
                    className="btn-secondary"
                    onClick={handleGetTokenInfo}
                  >
                    Show Token Info
                  </button>
                </details>
                <button 
                  className="btn-danger"
                  onClick={handleClearToken}
                  style={{ marginTop: '10px', width: '100%' }}
                >
                  [DELETE] Clear Token
                </button>
              </>
            ) : (
              <div className="status-badge missing">
                [WARNING] No Token in localStorage
              </div>
            )}
          </div>

          {/* Token input form */}
          <form onSubmit={handleSetToken} className="token-form">
            <label>Paste JWT Token:</label>
            <textarea
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="Paste full JWT token here (eyJh...)"
              rows="4"
              style={{ width: '100%', fontFamily: 'monospace', fontSize: '11px' }}
            />
            <button 
              type="submit"
              className="btn-primary"
              style={{ marginTop: '8px', width: '100%' }}
            >
              [SAVE] Set Token & Reload
            </button>
          </form>

          {/* Quick copy instructions */}
          <details className="instructions">
            <summary>[INFO] How to get a token</summary>
            <ol>
              <li>Open terminal in <code>backend/</code></li>
              <li>Run: <code>python generate_test_token.py storekeeper storekeeper123</code></li>
              <li>Copy the JWT TOKEN from output</li>
              <li>Paste it in the textarea above</li>
              <li>Click "Set Token & Reload"</li>
            </ol>
          </details>
        </div>
      )}
    </>
  );
};

export default AuthHelper;
