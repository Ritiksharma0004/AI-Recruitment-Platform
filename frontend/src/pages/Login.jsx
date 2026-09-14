import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bot, 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader, 
  CheckCircle, 
  XCircle, 
  Sparkles, 
  ArrowLeft,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck
} from 'lucide-react';
import { authService } from '../services/authService';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [popup, setPopup] = useState({ show: false, type: '', message: '' });

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotStep, setForgotStep] = useState(1);
  const [isForgotLoading, setIsForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setPopup({ show: false, type: '', message: '' });

    try {
      const data = await authService.login(formData);
      
      setPopup({ 
        show: true, 
        type: 'success', 
        message: 'Authentication successful! Redirecting to your workspace...' 
      });

      setTimeout(() => {
        const role = data.role?.toUpperCase();
        if (role === 'RECRUITER') {
          navigate('/recruiter-dashboard');
        } else if (role === 'ADMIN') {
          navigate('/admin-dashboard');
        } else {
          navigate('/dashboard');
        }
      }, 1000);

    } catch (err) {
      const errorMessage = err.response?.data?.message || (typeof err.response?.data === 'string' ? err.response.data : null) || err.message || 'Invalid email or password.';
      setPopup({ 
        show: true, 
        type: 'error', 
        message: errorMessage
      });
      setIsLoading(false);
    }
  };

  const handleOpenForgotModal = () => {
    setForgotEmail(formData.email || '');
    setResetCode('');
    setNewPassword('');
    setConfirmPassword('');
    setForgotMsg(null);
    setForgotStep(1);
    setShowForgotModal(true);
  };

  const handleRequestResetCode = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      setForgotMsg({ type: 'error', text: 'Please enter your registered email address.' });
      return;
    }
    setIsForgotLoading(true);
    setForgotMsg(null);

    try {
      const res = await authService.forgotPassword(forgotEmail);
      if (res?.devResetCode) {
        setResetCode(res.devResetCode);
      } else {
        setResetCode('');
      }
      setForgotMsg({
        type: 'info',
        text: res?.message || ('A 6-digit security key has been dispatched to ' + forgotEmail + '. Please check your inbox and enter it below.')
      });
      setForgotStep(2);
    } catch (err) {
      setForgotMsg({
        type: 'error',
        text: err.response?.data?.message || err.message || 'Failed to request reset key. Ensure the email is registered.'
      });
    } finally {
      setIsForgotLoading(false);
    }
  };

  const handleConfirmPasswordReset = async (e) => {
    e.preventDefault();
    if (!resetCode) {
      setForgotMsg({ type: 'error', text: 'Please enter the 6-digit verification key.' });
      return;
    }
    if (newPassword.length < 6) {
      setForgotMsg({ type: 'error', text: 'Password must contain at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setForgotMsg({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setIsForgotLoading(true);
    setForgotMsg(null);

    try {
      await authService.resetPassword({
        email: forgotEmail,
        resetCode,
        newPassword
      });

      setForgotMsg({
        type: 'success',
        text: 'Password updated successfully! Redirecting to login...'
      });

      setTimeout(() => {
        setShowForgotModal(false);
        setFormData({ email: forgotEmail, password: newPassword });
      }, 1500);

    } catch (err) {
      setForgotMsg({
        type: 'error',
        text: err.response?.data?.message || err.message || 'Failed to reset password. Please check your 6-digit key.'
      });
    } finally {
      setIsForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8fa] text-slate-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900 relative overflow-x-hidden bg-ai-grid">
      
      {/* Subtle ambient lighting */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-emerald-100/40 via-indigo-50/20 to-transparent blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Top Header */}
      <header className="p-6 md:p-8 flex items-center justify-between max-w-6xl mx-auto w-full relative z-20">
        <Link to="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center p-0.5 shadow-sm group-hover:scale-105 transition-transform">
            <Bot className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2">
            HireNova <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">AI Studio</span>
          </span>
        </Link>

        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors bg-white border border-slate-200 hover:border-slate-300 px-3.5 py-2 rounded-xl shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10 pb-16">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-[0_10px_35px_-5px_rgba(15,23,42,0.08)] relative">
          
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-3.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> SECURE RECRUITMENT PORTAL
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Welcome to Studio</h1>
            <p className="text-sm text-slate-600 font-normal mt-1.5">Enter your credentials to access your autonomous workspace.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 block">Work / User Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input 
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/60 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 font-medium focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 block">Password</label>
                <button
                  type="button"
                  onClick={handleOpenForgotModal}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50/60 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 font-medium focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <Loader className="w-4 h-4 animate-spin text-white" />
              ) : (
                <>
                  Sign In to Studio
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform text-emerald-400" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600 font-medium">
              Don't have an account yet?{' '}
              <Link to="/register" className="text-emerald-700 hover:text-emerald-800 font-semibold transition-colors">
                Candidate Registration
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                  <KeyRound className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Reset Account Key</h3>
                  <p className="text-xs text-slate-600 font-normal">Verify identity via one-time 6-digit key</p>
                </div>
              </div>
              <button 
                onClick={() => setShowForgotModal(false)}
                className="text-slate-500 hover:text-slate-800 text-xs px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 font-medium"
              >
                Close
              </button>
            </div>

            {forgotMsg && (
              <div className={`p-3 rounded-xl mb-4 text-xs font-medium ${forgotMsg.type === 'error' ? 'bg-rose-50 border border-rose-200 text-rose-800' : forgotMsg.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-indigo-50 border border-indigo-200 text-indigo-800'}`}>
                {forgotMsg.text}
              </div>
            )}

            {forgotStep === 1 ? (
              <form onSubmit={handleRequestResetCode} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 block">Registered Email Address</label>
                  <input 
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 font-medium focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isForgotLoading}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  {isForgotLoading ? <Loader className="w-3.5 h-3.5 animate-spin" /> : 'Send 6-Digit Reset Key'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleConfirmPasswordReset} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 block">6-Digit Security Key</label>
                  <input 
                    type="text"
                    maxLength={6}
                    required
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    placeholder="123456"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-emerald-300 rounded-xl text-base font-mono tracking-widest text-center text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 block">New Password</label>
                  <input 
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 font-medium focus:bg-white focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 block">Confirm New Password</label>
                  <input 
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 font-medium focus:bg-white focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button 
                    type="button"
                    onClick={() => setForgotStep(1)}
                    className="w-1/3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium"
                  >
                    Back
                  </button>
                  <button 
                    type="submit"
                    disabled={isForgotLoading}
                    className="w-2/3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
                  >
                    {isForgotLoading ? <Loader className="w-3.5 h-3.5 animate-spin" /> : 'Update Password'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Popup Modal */}
      {popup.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl flex flex-col items-center text-center animate-in zoom-in duration-200">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${popup.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'}`}>
              {popup.type === 'success' ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1.5">
              {popup.type === 'success' ? 'Authenticated' : 'Access Denied'}
            </h3>
            <p className="text-xs text-slate-600 font-medium mb-6 leading-relaxed">{popup.message}</p>
            
            <button 
              onClick={() => setPopup({ show: false, type: '', message: '' })}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
            >
              {popup.type === 'success' ? 'Continue' : 'Try Again'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
