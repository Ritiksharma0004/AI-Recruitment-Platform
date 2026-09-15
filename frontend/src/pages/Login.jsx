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
  EyeOff
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
  const [forgotStep, setForgotStep] = useState(1); // 1 = enter email, 2 = enter code & new pass
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
      
      // FIX: Store the token and user data so Dashboard page can extract it.
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      localStorage.setItem('user', JSON.stringify(data));
      
      setPopup({ 
        show: true, 
        type: 'success', 
        message: 'Authentication successful. Redirecting to your workspace...' 
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
      setResetCode(''); // Strictly blank out code for security
      setForgotMsg({
        type: 'success',
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
        text: err.response?.data?.message || err.message || 'Password update failed. Check key & try again.'
      });
    } finally {
      setIsForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080d] text-slate-200 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-x-hidden bg-ai-grid">
      
      {/* Ambient glow */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="fixed bottom-10 right-10 w-[350px] h-[300px] bg-purple-600/5 blur-[150px] rounded-full pointer-events-none" />

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
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md ai-card rounded-3xl p-8 sm:p-10 border border-white/[0.09] shadow-[0_15px_50px_rgba(0,0,0,0.6)] relative overflow-hidden">
          
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-slate-400 text-[11px] font-mono mb-3">
              <Sparkles className="w-3 h-3 text-indigo-400" /> SECURE AI AUTHENTICATION
            </div>
            <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">Access Workspace</h1>
            <p className="text-xs text-slate-400 font-light mt-1.5">Enter your credentials to enter your dedicated recruitment portal.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">Work / User Email</label>
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
                  placeholder="name@company.com"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">Password</label>
                <button
                  type="button"
                  onClick={handleOpenForgotModal}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Forgot password?
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
              className="w-full mt-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-normal flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] disabled:opacity-50 group"
            >
              {isLoading ? (
                <Loader className="w-4 h-4 animate-spin text-white/70" />
              ) : (
                <>
                  Authenticate Identity
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/[0.06] text-center">
            <p className="text-xs text-slate-400 font-light">
              Not registered in the network?{' '}
              <Link to="/register" className="text-indigo-400 hover:text-indigo-300 transition-colors font-normal">
                Apply as Candidate
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all">
          <div className="bg-[#0b0f19] rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-white/[0.08] shadow-[0_0_40px_rgba(0,0,0,0.8)] relative">
            <button 
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
            >
              <XCircle className="w-5 h-5" />
            </button>

            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-5">
              <KeyRound className="w-5 h-5 text-indigo-400" />
            </div>

            <h3 className="text-lg font-normal text-white mb-1">
              {forgotStep === 1 ? "Initialize Password Reset" : "Deploy New Credentials"}
            </h3>
            <p className="text-xs text-slate-400 font-light mb-6 leading-relaxed">
              {forgotStep === 1 
                ? "Enter your linked email address to receive a secure recovery key." 
                : "Submit your 6-digit key along with a secure new password."}
            </p>

            {forgotMsg && (
              <div className={`p-3 rounded-xl border text-[11px] flex gap-2.5 items-start mb-5 ${
                forgotMsg.type === 'error' 
                  ? 'bg-rose-500/10 border-rose-500/20 text-rose-300' 
                  : forgotMsg.type === 'info'
                  ? 'bg-blue-500/10 border-blue-500/20 text-blue-300'
                  : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
              }`}>
                {forgotMsg.type === 'error' ? <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> : <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />}
                <span className="leading-relaxed">{forgotMsg.text}</span>
              </div>
            )}

            {forgotStep === 1 ? (
              <form onSubmit={handleRequestResetCode} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">Email Address</label>
                  <input 
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#090c14] border border-white/[0.07] rounded-xl text-sm text-slate-200 placeholder:text-slate-600 font-light focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                    placeholder="name@company.com"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isForgotLoading || !forgotEmail}
                  className="w-full py-2.5 bg-white/[0.03] hover:bg-white/[0.08] text-white border border-white/[0.08] rounded-xl text-xs font-normal flex items-center justify-center transition-all shadow-lg disabled:opacity-50"
                >
                  {isForgotLoading ? <Loader className="w-3.5 h-3.5 animate-spin" /> : 'Request Recovery Key'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleConfirmPasswordReset} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">6-Digit Security Key</label>
                  <input 
                    type="text"
                    required
                    maxLength={6}
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value.replace(/\D/g, ''))} // only numbers
                    className="w-full px-3.5 py-2.5 bg-[#090c14] border border-indigo-500/30 rounded-xl text-sm text-indigo-300 placeholder:text-indigo-900/40 font-mono text-center tracking-[0.5em] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                    placeholder="000000"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">New Password</label>
                  <input 
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#090c14] border border-white/[0.07] rounded-xl text-sm text-slate-200 placeholder:text-slate-600 font-light focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                    placeholder="••••••••••••"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">Confirm New Password</label>
                  <input 
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#090c14] border border-white/[0.07] rounded-xl text-sm text-slate-200 placeholder:text-slate-600 font-light focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                    placeholder="••••••••••••"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isForgotLoading || !resetCode || !newPassword || !confirmPassword}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-normal flex items-center justify-center transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] disabled:opacity-50 mt-2"
                >
                  {isForgotLoading ? <Loader className="w-3.5 h-3.5 animate-spin" /> : 'Confirm & Reset Access'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Main Login Result Popup */}
      {popup.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all">
          <div className="bg-[#0b0f19] rounded-3xl p-6 sm:p-7 max-w-sm w-full border border-white/[0.08] shadow-[0_0_40px_rgba(0,0,0,0.8)] relative flex flex-col items-center text-center">
            
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border ${popup.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
              {popup.type === 'success' ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
            </div>
            
            <h3 className="text-lg font-normal text-white mb-1">
              {popup.type === 'success' ? 'Access Granted' : 'Authentication Failed'}
            </h3>
            
            <p className="text-xs text-slate-400 font-light mb-6 leading-relaxed">
              {popup.message}
            </p>
            
            <button 
              onClick={() => setPopup({ show: false, type: '', message: '' })}
              className="w-full py-2.5 bg-white/[0.03] hover:bg-white/[0.08] text-white border border-white/[0.08] rounded-xl text-xs font-normal transition-all shadow-lg"
            >
              {popup.type === 'success' ? 'Initializing...' : 'Acknowledge'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
