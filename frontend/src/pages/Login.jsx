import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bot, Mail, Lock, LogIn, ArrowRight, Loader, CheckCircle, XCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { authService } from '../services/authService';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [popup, setPopup] = useState({ show: false, type: '', message: '' });
  
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
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
      
      // Add missing token saving logic here
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      localStorage.setItem('user', JSON.stringify(data));
      
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
    if (!forgotEmail) return;
    setForgotLoading(true);
    setForgotMsg(null);
    try {
      await authService.forgotPassword(forgotEmail);
      setForgotMsg({ type: 'success', text: 'Reset code sent! Check your email inbox & spam folder.' });
      setForgotStep(2);
    } catch (err) {
      setForgotMsg({ type: 'error', text: err.response?.data?.message || err.response?.data || 'Failed to send reset code.' });
    } finally {
      setForgotLoading(false);
    }
  };

  const handleVerifyAndReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setForgotMsg({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    if (!resetCode || !newPassword) return;
    
    setForgotLoading(true);
    setForgotMsg(null);
    try {
      await authService.resetPassword({ email: forgotEmail, resetCode, newPassword });
      setForgotMsg({ type: 'success', text: 'Password successfully reset! You can now log in.' });
      setTimeout(() => {
        setShowForgotModal(false);
      }, 2500);
    } catch (err) {
      setForgotMsg({ type: 'error', text: err.response?.data?.message || err.response?.data || 'Invalid or expired code. Please try again.' });
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8fa] text-slate-900 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900 relative overflow-hidden bg-ai-grid">
      
      {/* Subtle ambient lighting */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-indigo-100/40 via-sky-50/20 to-transparent blur-[100px] rounded-full pointer-events-none -z-10" />

      {/* Top Header */}
      <header className="p-6 md:p-8 flex items-center justify-between max-w-6xl mx-auto w-full relative z-20">
        <Link to="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center p-0.5 shadow-sm group-hover:scale-105 transition-transform">
            <Bot className="w-5 h-5 text-indigo-400" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2">
            HireNova <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-800 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">AI Studio</span>
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
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-[400px] bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-[0_10px_35px_-5px_rgba(15,23,42,0.08)] relative">
          
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 mb-4 shadow-inner">
              <LogIn className="w-5 h-5 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Studio Sign In</h1>
            <p className="text-sm text-slate-600 font-normal mt-1.5">Access your workspace using registered credentials.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 block">Identified Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input 
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50/60 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 font-medium focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 block">Credential Password</label>
                <button 
                  type="button"
                  onClick={handleOpenForgotModal}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input 
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50/60 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 font-medium focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <Loader className="w-4 h-4 animate-spin text-white" />
              ) : (
                <>
                  Authenticate Identity
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform text-indigo-400" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600 font-medium">
              Not registered in the network?{' '}
              <Link to="/register" className="text-indigo-700 hover:text-indigo-800 font-semibold transition-colors">
                Apply as Candidate
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-slate-200 shadow-2xl relative">
            <button 
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <XCircle className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">Account Recovery</h3>
            <p className="text-xs text-slate-600 font-medium mb-6">
              {forgotStep === 1 
                ? "Enter your email to receive a recovery code." 
                : "Enter the code sent to your email and your new password."}
            </p>

            {forgotMsg && (
              <div className={`p-3 rounded-xl text-xs flex items-start gap-2 mb-4 ${
                forgotMsg.type === 'error' 
                  ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}>
                {forgotMsg.type === 'error' ? (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                )}
                <span className="font-medium leading-relaxed">{forgotMsg.text}</span>
              </div>
            )}

            {forgotStep === 1 ? (
              <form onSubmit={handleRequestResetCode} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 block">Email Address</label>
                  <input 
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 font-medium focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    placeholder="name@example.com"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={forgotLoading || !forgotEmail}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50"
                >
                  {forgotLoading ? <Loader className="w-4 h-4 animate-spin" /> : 'Send Recovery Code'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyAndReset} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 block">6-Digit Code</label>
                  <input 
                    type="text"
                    required
                    maxLength={6}
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono tracking-widest text-center text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    placeholder="000000"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 block">New Password</label>
                  <input 
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 font-medium focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    placeholder="••••••••••••"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 block">Confirm Password</label>
                  <input 
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 font-medium focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    placeholder="••••••••••••"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={forgotLoading || !resetCode || !newPassword || !confirmPassword}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50 mt-2"
                >
                  {forgotLoading ? <Loader className="w-4 h-4 animate-spin" /> : 'Confirm & Reset Password'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Main Login Result Popup */}
      {popup.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl flex flex-col items-center text-center animate-in zoom-in duration-200">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${popup.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'}`}>
              {popup.type === 'success' ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1.5">
              {popup.type === 'success' ? 'Access Granted' : 'Authentication Failed'}
            </h3>
            <p className="text-xs text-slate-600 font-medium mb-6 leading-relaxed">{popup.message}</p>
            
            <button 
              onClick={() => setPopup({ show: false, type: '', message: '' })}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
            >
              {popup.type === 'success' ? 'Proceeding...' : 'Dismiss & Try Again'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
