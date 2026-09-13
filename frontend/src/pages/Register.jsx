import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bot, Mail, Lock, User, ArrowRight, Loader, CheckCircle, XCircle, Sparkles, ArrowLeft, ShieldCheck, Eye, EyeOff, KeyRound } from 'lucide-react';
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSendOtp = async () => {
    if (!formData.email || !formData.email.includes('@')) {
      setPopup({ show: true, type: 'error', message: 'Please enter a valid email address first.' });
      return;
    }

    setIsSendingOtp(true);
    setPopup({ show: false, type: '', message: '' });

    try {
      await authService.sendRegistrationOtp(formData.email);
      setOtpSent(true);
      setOtpCountdown(60);
      setPopup({
        show: true,
        type: 'success',
        message: `A 6-digit verification code has been sent to ${formData.email}. Please check your inbox (and spam folder).`
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data || err.message || 'Failed to dispatch verification code. Please try again.';
      setPopup({
        show: true,
        type: 'error',
        message: typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage)
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
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        otp: otp.trim()
      };

      await authService.register(payload);
      
      setPopup({ 
        show: true, 
        type: 'success', 
        message: 'Candidate Profile verified & generated in database. Redirecting to sign in...' 
      });
      
      setTimeout(() => {
        navigate('/login');
      }, 1600);

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data || err.message || 'Registration failed. Check your data.';
      setPopup({ show: true, type: 'error', message: typeof errorMessage === "string" ? errorMessage : JSON.stringify(errorMessage) });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080d] text-slate-200 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-x-hidden bg-ai-grid">
      
      {/* Ambient glow */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="fixed bottom-10 left-10 w-[400px] h-[300px] bg-purple-600/5 blur-[160px] rounded-full pointer-events-none" />

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
        <div className="w-full max-w-lg ai-card rounded-3xl p-8 sm:p-10 border border-white/[0.09] shadow-[0_15px_50px_rgba(0,0,0,0.6)] relative overflow-hidden">
          
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-slate-400 text-[11px] font-mono mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> RECRUITMENT NETWORK ENROLLMENT
            </div>
            <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">Candidate Profile Creation</h1>
            <p className="text-xs text-slate-400 font-light mt-1.5">Setup your verified credentials to access autonomous AI resume scoring.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* First & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">First Name</label>
                <input 
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#090c14] border border-white/[0.07] rounded-xl text-sm text-slate-200 placeholder:text-slate-600 font-light focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                  placeholder="Ritik"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">Last Name</label>
                <input 
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#090c14] border border-white/[0.07] rounded-xl text-sm text-slate-200 placeholder:text-slate-600 font-light focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                  placeholder="Sharma"
                />
              </div>
            </div>

            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">Account Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input 
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#090c14] border border-white/[0.07] rounded-xl text-sm text-slate-200 placeholder:text-slate-600 font-light focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                  placeholder="ritik_sde"
                />
              </div>
            </div>

            {/* Email Address with OTP Trigger */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">Candidate Email Address</label>
                <span className="text-[10px] text-indigo-400 font-mono">Requires OTP verification</span>
              </div>
              <div className="relative flex items-center">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input 
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-28 py-2.5 bg-[#090c14] border border-white/[0.07] rounded-xl text-sm text-slate-200 placeholder:text-slate-600 font-light focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                  placeholder="ritik.sharma@example.com"
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isSendingOtp || otpCountdown > 0 || !formData.email}
                  className="absolute right-1.5 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-normal transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 whitespace-nowrap"
                >
                  {isSendingOtp ? (
                    <>
                      <Loader className="w-3 h-3 animate-spin" /> Sending...
                    </>
                  ) : otpCountdown > 0 ? (
                    `Resend (${otpCountdown}s)`
                  ) : otpSent ? (
                    'Resend Code'
                  ) : (
                    'Send OTP'
                  )}
                </button>
              </div>
            </div>

            {/* OTP Verification Code Input (Displayed if OTP was sent or user is verifying) */}
            {otpSent && (
              <div className="space-y-1.5 p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-indigo-400" /> 6-Digit Email Verification Code
                  </label>
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Code Sent
                  </span>
                </div>
                <div className="relative">
                  <input 
                    type="text"
                    maxLength={6}
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-2.5 bg-[#090c14] border border-indigo-500/40 rounded-xl text-lg text-white font-mono tracking-[0.35em] text-center placeholder:text-slate-600 placeholder:tracking-normal placeholder:font-sans placeholder:text-xs focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/40 transition-all"
                    placeholder="Enter 6-digit OTP"
                  />
                </div>
                <p className="text-[11px] text-slate-400 font-light mt-1 leading-relaxed">
                  We sent a 6-digit one-time password to <span className="text-indigo-300 font-medium">{formData.email}</span>. Valid for 10 minutes.
                </p>
              </div>
            )}

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">Password</label>
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
                    className="w-full pl-10 pr-9 py-2.5 bg-[#090c14] border border-white/[0.07] rounded-xl text-sm text-slate-200 placeholder:text-slate-600 font-light focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#090c14] border border-white/[0.07] rounded-xl text-sm text-slate-200 placeholder:text-slate-600 font-light focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-normal flex items-center justify-center gap-2 transition-all shadow-[0_0_25px_rgba(99,102,241,0.25)] hover:shadow-[0_0_35px_rgba(99,102,241,0.4)] disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <Loader className="w-4 h-4 animate-spin text-white" />
              ) : (
                <>
                  Verify & Register Candidate Profile
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/[0.06] text-center">
            <p className="text-xs text-slate-400 font-light">
              Already registered in the network?{' '}
              <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-normal transition-colors">
                Sign in to workspace
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Popup Modal */}
      {popup.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-all">
          <div className="ai-card-glow rounded-2xl p-6 max-w-sm w-full border border-white/[0.1] shadow-2xl flex flex-col items-center text-center animate-in zoom-in duration-200">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${popup.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
              {popup.type === 'success' ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
            </div>
            <h3 className="text-lg font-normal text-white mb-1.5">
              {popup.type === 'success' ? 'Profile Verification' : 'Registration Alert'}
            </h3>
            <p className="text-xs text-slate-400 font-light mb-6 leading-relaxed">{popup.message}</p>
            
            <button 
              onClick={() => setPopup({ show: false, type: '', message: '' })}
              className="w-full py-2 bg-[#121524] hover:bg-[#1a1f33] text-slate-300 hover:text-white rounded-xl text-xs font-normal transition-colors border border-white/[0.08]"
            >
              {popup.type === 'success' ? 'Continue' : 'Dismiss & Review'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
