import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, KeyRound, BookOpen, Loader2 } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await axios.post(`${API_URL}/auth/reset-password`, { email, otp, newPassword });
      setMessage(res.data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass animate-fade-in">
        <div className="auth-header">
          <div className="logo-icon glass">
            <BookOpen size={32} className="text-primary" />
          </div>
          <h1>Reset Password</h1>
          <p>{step === 1 ? 'Enter your email to receive an OTP' : 'Enter the OTP and your new password'}</p>
        </div>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="auth-form">
            <div className="input-group">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="auth-form">
            <div className="input-group">
              <KeyRound size={18} className="input-icon" />
              <input
                type="text"
                placeholder="6-Digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
              />
            </div>
            
            <div className="input-group">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : 'Reset Password'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary w-full mt-2" 
              onClick={() => { setStep(1); setError(''); setMessage(''); }}
              disabled={loading}
              style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-main)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: '500' }}
            >
              Back
            </button>
          </form>
        )}

        <div className="auth-footer">
          <p>Remember your password? <Link to="/login">Sign In</Link></p>
        </div>
      </div>

      <style>{`
        .auth-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 1rem;
          background: linear-gradient(135deg, var(--bg-main) 0%, #e0e7ff 100%);
        }
        [data-theme='dark'] .auth-container {
          background: linear-gradient(135deg, var(--bg-main) 0%, #1e1b4b 100%);
        }
        .auth-card {
          width: 100%;
          max-width: 400px;
          padding: 2.5rem;
          border-radius: var(--radius-lg);
          text-align: center;
        }
        .auth-header h1 {
          margin-top: 1rem;
          font-size: 1.875rem;
          color: var(--text-main);
        }
        .auth-header p {
          color: var(--text-muted);
          margin-bottom: 2rem;
        }
        .logo-icon {
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          border-radius: var(--radius);
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .input-group {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-icon {
          position: absolute;
          left: 1rem;
          color: var(--text-muted);
        }
        input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.75rem;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          background: var(--bg-card);
          color: var(--text-main);
          outline: none;
          transition: border-color 0.2s;
        }
        input:focus {
          border-color: var(--primary);
        }
        .success-message {
          color: #10b981;
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }
        .error-message {
          color: #ef4444;
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }
        .w-full { width: 100%; }
        .mt-2 { margin-top: 0.5rem; }
        .btn-secondary:hover { background: var(--bg-hover) !important; }
        .auth-footer {
          margin-top: 1.5rem;
          font-size: 0.875rem;
          color: var(--text-muted);
        }
        .auth-footer a {
          color: var(--primary);
          text-decoration: none;
          font-weight: 500;
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;
