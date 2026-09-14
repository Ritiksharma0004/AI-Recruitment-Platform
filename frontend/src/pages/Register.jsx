import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bot, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Loader, 
  CheckCircle, 
  XCircle, 
  ArrowLeft, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  KeyRound, 
  Send 
} from 'lucide-react';
import { authService } from '../services/authService';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [popup, setPopup] = useState({ show: false, type: '', message: '' });
  
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (otpCountdown > 0) {
      timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpCountdown]);

  const extractErrorMessage = (err) => {
    if (err.response?.data) {
      const data = err.response.data;
      if (typeof data === 'string') return data;
      if (data.message) return data.message;
      if (data.error) return data.error;
    }
    return err.message || 'An unexpected error occurred. Please try again.';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // If user changes email, reset OTP verification status
    if (name === 'email' && otpSent) {
      setOtpSent(false);
      setOtp('');
      setOtpCountdown(0);
    }
  };

  const handleSendOtp = async () => {
    if (!formData.email || !formData.email.trim() || !formData.email.includes('@')) {
      setPopup({ 
        show: true, 
        type: 'error', 
        message: 'Please enter a valid candidate email address first.' 
      });
      return;
    }

    setIsSendingOtp(true);
    setPopup({ show: false, type: '', message: '' });

    try {
      const res = await authService.sendRegistrationOtp(formData.email.trim());
      setOtpSent(true);
      setOtpCountdown(60);

      setPopup({
        show: true,
        type: 'success',
        message: res?.message || `A 6-digit verification code has been dispatched to ${formData.email.trim()}. Please check your inbox and spam folder.`
      });
    } catch (err) {
      const errMsg = extractErrorMessage(err);
      setPopup({
        show: true,
        type: 'error',
        message: errMsg
      });
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setPopup({ show: false, type: '', message: '' });

    if (formData.password !== formData.confirmPassword) {
      setPopup({ show: true, type: 'error', message: 'The provided passwords do not match.' });
      setIsLoading(false);
      return;
    }

    if (!otpSent || !otp || otp.trim().length !== 6) {
      setPopup({ 
        show: true, 
        type: 'error', 
        message: 'Please request and enter your 6-digit email verification code (OTP) before completing registration.' 
      });
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        otp: otp.trim()
      };

      await authService.register(payload);
      
      setPopup({ 
        show: true, 
        type: 'success', 
        message: 'Candidate Profile verified & successfully registered! Redirecting to sign in...' 
      });
      
      setTimeout(() => {
        navigate('/login');
      }, 1600);

    } catch (err) {
      const errMsg = extractErrorMessage(err);
      setPopup({ 
        show: true, 
        type: 'error', 
        message: errMsg 
      });
      setIsLoading(false);
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
        <div className="w-full max-w-lg bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-[0_10px_35px_-5px_rgba(15,23,42,0.08)] relative">
          
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-3.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> CANDIDATE IDENTITY VERIFICATION
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Candidate Profile Creation</h1>
            <p className="text-sm text-slate-600 font-normal mt-1.5">Setup your verified credentials to access autonomous AI resume scoring.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* First & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 block">First Name</label>
                <input 
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 font-medium focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                  placeholder="Ritik"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 block">Last Name</label>
                <input 
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 font-medium focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                  placeholder="Sharma"
                />
              </div>
            </div>

            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 block">Account Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input 
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/60 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 font-medium focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                  placeholder="ritik_sde"
                />
              </div>
            </div>

            {/* Candidate Email */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 block">Candidate Email Address</label>
                <span className="text-xs text-emerald-700 font-semibold">Requires OTP verification</span>
              </div>
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
                  placeholder="ritik.sharma@example.com"
                />
              </div>
            </div>

            {/* Send OTP & Verification UI Card */}
            {!otpSent ? (
              <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-300/60 flex items-center justify-center shrink-0">
                    <KeyRound className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Email Verification Required</p>
                    <p className="text-xs text-slate-600 font-normal">Dispatches a 6-digit code to verify your candidate inbox</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isSendingOtp || !formData.email}
                  className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-all shadow-sm hover:shadow disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  {isSendingOtp ? (
                    <>
                      <Loader className="w-3.5 h-3.5 animate-spin" /> Dispatching...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" /> Send Verification Code
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-300 space-y-3 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-slate-900">6-Digit Code Dispatched</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isSendingOtp || otpCountdown > 0}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors disabled:text-slate-400 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    {isSendingOtp ? (
                      <>
                        <Loader className="w-3.5 h-3.5 animate-spin" /> Sending...
                      </>
                    ) : otpCountdown > 0 ? (
                      `Resend in ${otpCountdown}s`
                    ) : (
                      'Resend Code'
                    )}
                  </button>
                </div>

                <div className="space-y-1">
                  <input 
                    type="text"
                    maxLength={6}
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-3 bg-white border-2 border-emerald-400 rounded-xl text-xl text-slate-900 font-mono tracking-[0.45em] text-center placeholder:text-slate-400 placeholder:tracking-normal placeholder:font-sans placeholder:text-xs focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-xs"
                    placeholder="Enter 6-digit OTP"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 font-medium pt-1">
                  <span>Sent to <strong className="text-slate-900">{formData.email}</strong> (valid 10m)</span>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp('');
                    }}
                    className="text-slate-500 hover:text-slate-800 text-xs underline font-medium"
                  >
                    Change Email
                  </button>
                </div>
              </div>
            )}

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 block">Password</label>
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
                    className="w-full pl-10 pr-9 py-2.5 bg-slate-50/60 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 font-medium focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 block">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/60 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 font-medium focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <Loader className="w-4 h-4 animate-spin text-white" />
              ) : (
                <>
                  Verify & Register Candidate Profile
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform text-emerald-400" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600 font-medium">
              Already registered in the network?{' '}
              <Link to="/login" className="text-emerald-700 hover:text-emerald-800 font-semibold transition-colors">
                Sign in to workspace
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Popup Modal */}
      {popup.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl flex flex-col items-center text-center animate-in zoom-in duration-200">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${popup.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'}`}>
              {popup.type === 'success' ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1.5">
              {popup.type === 'success' ? 'Notification' : 'Registration Alert'}
            </h3>
            <p className="text-xs text-slate-600 font-medium mb-6 leading-relaxed">{popup.message}</p>
            
            {popup.message?.toLowerCase().includes('already exists') ? (
              <div className="flex flex-col gap-2 w-full">
                <button 
                  type="button"
                  onClick={() => navigate('/login')}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all shadow-sm"
                >
                  Go to Sign In
                </button>
                <button 
                  type="button"
                  onClick={() => setPopup({ show: false, type: '', message: '' })}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-colors border border-slate-200"
                >
                  Use a Different Email
                </button>
              </div>
            ) : (
              <button 
                type="button"
                onClick={() => setPopup({ show: false, type: '', message: '' })}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
              >
                {popup.type === 'success' ? 'Continue' : 'Dismiss & Review'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
