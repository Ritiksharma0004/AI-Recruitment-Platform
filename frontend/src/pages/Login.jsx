import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bot, Mail, Lock, ArrowRight, Loader, CheckCircle, XCircle, Eye, EyeOff, Sparkles, ArrowLeft, Key, ShieldCheck, AlertCircle, X } from 'lucide-react';
import { authService } from '../services/authService';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [popup, setPopup] = useState({ show: false, type: '', message: '' });

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
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
      const response = await authService.login(formData);
      
      if (response && response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response));
      } else {
        localStorage.setItem('token', response.token || '');
      }

      setPopup({ show: true, type: 'success', message: 'Identity verified. Access granted.' });
      
      setTimeout(() => {
        navigate('/dashboard'); 
      }, 1200);

    } catch (err) {
      setPopup({ 
        show: true, 
        type: 'error', 
        message: err.response?.data?.message || err.message || 'Invalid credentials or connection timeout.' 
      });
      setIsLoading(false);
    }
  };

  const handleOpenForgotModal = (e) => {
    e.preventDefault();
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
      await authService.forgotPassword(forgotEmail);
      setResetCode('');
      setForgotMsg({
        type: 'info',
        text: 'A 6-digit security key has been dispatched to ' + forgotEmail + '. Please check your inbox and enter it below.'
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

      setFormData(prev => ({
        email: forgotEmail,
        password: newPassword
      }));

      setTimeout(() => {
        setShowForgotModal(false);
      }, 1500);

    } catch (err) {
      setForgotMsg({
        type: 'error',
        text: err.response?.data?.message || err.message || 'Reset failed. Check verification code.'
      });
    } finally {
      setIsForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080d] text-slate-200 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-hidden bg-ai-grid">
      
      {/* Ambient background glow */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-10 w-[400px] h-[300px] bg-purple-600/5 blur-[160px] rounded-full pointer-events-none" />

      {/* Top Header */}
      <header className="p-6 md:p-8 flex items-center justify-between max-w-6xl mx-auto w-full relative z-20">
        <Link to="/" className="inline-flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-0.5 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="text-base font-medium tracking-tight text-white flex items-center gap-1.5">
            HireNova <span className="text-[10px] font-mono font-normal uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded">AI</span>
          </span>
        </Link>

        <Link 
          to="/" 
          className="inline-flex items-center gap-1.5 text-xs font-normal text-slate-400 hover:text-white transition-colors bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] px-3 py-1.5 rounded-lg"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10 pb-16">
        <div className="w-full max-w-md ai-card rounded-3xl p-8 sm:p-10 border border-white/[0.09] shadow-[0_15px_50px_rgba(0,0,0,0.6)] relative overflow-hidden">
          
          {/* Subtle top card highlight */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
          
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-slate-400 text-[11px] font-mono mb-3">
              <Sparkles className="w-3 h-3 text-indigo-400" /> SECURE AI PORTAL
            </div>
            <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">Authentication</h1>
            <p className="text-xs text-slate-400 font-light mt-1.5">Enter your credentials to access your recruitment workspace.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                Work or Candidate Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input 
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#090c14] border border-white/[0.07] rounded-xl text-sm text-slate-200 placeholder:text-slate-600 font-light focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                  placeholder="name@domain.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleOpenForgotModal}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors font-mono focus:outline-none underline decoration-indigo-500/30 underline-offset-2"
                >
                  Forgot key?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2.5 bg-[#090c14] border border-white/[0.07] rounded-xl text-sm text-slate-200 placeholder:text-slate-600 font-light focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-normal flex items-center justify-center gap-2 transition-all shadow-[0_0_25px_rgba(99,102,241,0.25)] hover:shadow-[0_0_35px_rgba(99,102,241,0.4)] disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <Loader className="w-4 h-4 animate-spin text-white" />
              ) : (
                <>
                  Authenticate Identity
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/[0.06] text-center">
            <p className="text-xs text-slate-400 font-light">
              Don't have an active account?{' '}
              <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-normal transition-colors">
                Create candidate profile
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Forgot Password / Key Recovery Modal Popup */}
      {showForgotModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all animate-fadeIn"
          onClick={() => !isForgotLoading && setShowForgotModal(false)}
        >
          <div 
            className="ai-card-glow rounded-3xl p-6 sm:p-8 max-w-md w-full border border-white/[0.1] shadow-2xl relative bg-[#0c0f1d]/95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close Button */}
            <button
              type="button"
              disabled={isForgotLoading}
              onClick={() => setShowForgotModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-normal text-white">Reset Security Key</h3>
                <p className="text-xs text-slate-400 font-light">
                  {forgotStep === 1 ? 'Verify your identity to reset password.' : 'Enter your 6-digit key and set a new password.'}
                </p>
              </div>
            </div>

            {/* Status / Alert Banner */}
            {forgotMsg && (
              <div className={`p-3 rounded-xl border text-xs font-light mb-4 flex items-start gap-2.5 ${
                forgotMsg.type === 'error'
                  ? 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                  : forgotMsg.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                  : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300'
              }`}>
                {forgotMsg.type === 'error' ? (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                ) : forgotMsg.type === 'success' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                )}
                <span className="flex-1 leading-relaxed">{forgotMsg.text}</span>
              </div>
            )}

            {/* STEP 1: Request Key Form */}
            {forgotStep === 1 && (
              <form onSubmit={handleRequestResetCode} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#080a14] border border-white/[0.08] rounded-xl text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2 bg-[#121524] hover:bg-[#1a1f33] text-slate-400 text-xs rounded-xl transition-colors border border-white/[0.06]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isForgotLoading}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-normal rounded-xl transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] flex items-center gap-2 disabled:opacity-50"
                  >
                    {isForgotLoading ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Key className="w-3.5 h-3.5" />}
                    Request Reset Key
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: Verify Key and Reset Password Form */}
            {forgotStep === 2 && (
              <form onSubmit={handleConfirmPasswordReset} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                    6-Digit Verification Key
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value)}
                      placeholder="e.g. 584920"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#080a14] border border-white/[0.08] rounded-xl text-xs text-slate-200 font-mono tracking-widest placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                      New Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="text-[10px] text-slate-500 hover:text-slate-300 font-mono"
                    >
                      {showNewPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#080a14] border border-white/[0.08] rounded-xl text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#080a14] border border-white/[0.08] rounded-xl text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setForgotStep(1);
                      setForgotMsg(null);
                    }}
                    className="text-xs text-slate-500 hover:text-slate-300 font-mono transition-colors"
                  >
                    ← Back to Email
                  </button>
                  <button
                    type="submit"
                    disabled={isForgotLoading}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-normal rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-2 disabled:opacity-50"
                  >
                    {isForgotLoading ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                    Update Security Key
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Popup Modal for Login Alerts */}
      {popup.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-all">
          <div className="ai-card-glow rounded-2xl p-6 max-w-sm w-full border border-white/[0.1] shadow-2xl flex flex-col items-center text-center animate-in zoom-in duration-200">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${popup.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>\
              {popup.type === 'success' ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
            </div>
            <h3 className="text-lg font-normal text-white mb-1.5">
              {popup.type === 'success' ? 'Access Granted' : 'Authentication Failed'}
            </h3>
            <p className="text-xs text-slate-400 font-light mb-6 leading-relaxed">{popup.message}</p>
            
            {popup.type === 'error' && (
              <button 
                onClick={() => setPopup({ show: false, type: '', message: '' })}
                className="w-full py-2 bg-[#121524] hover:bg-[#1a1f33] text-slate-300 hover:text-white rounded-xl text-xs font-normal transition-colors border border-white/[0.08]"
              >
                Retry
              </button>
            )}
            {popup.type === 'success' && (
              <Loader className="w-5 h-5 animate-spin text-indigo-400 mb-1" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
