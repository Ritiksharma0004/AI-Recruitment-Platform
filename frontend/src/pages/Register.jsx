import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { 
  Bot, 
  Mail, 
  Lock,
  User,
  ArrowRight, 
  Loader, 
  CheckCircle, 
  XCircle, 
  Sparkles,
  ArrowLeft,
  Eye,
  EyeOff,
  ShieldCheck,
  Send,
  Timer
} from 'lucide-react';

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
        message: 'Registration successful! Your candidate profile has been deployed.' 
      });

      setTimeout(() => {
        navigate('/login');
      }, 2000);

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
    <div className="min-h-screen bg-[#07080d] text-slate-200 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-x-hidden bg-ai-grid">
      
      {/* Ambient glow */}
      <div className="fixed top-1/4 right-1/4 w-[600px] h-[400px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="fixed bottom-10 left-10 w-[400px] h-[300px] bg-emerald-600/5 blur-[160px] rounded-full pointer-events-none" />

      {/* Top Header */}
      <header className="p-6 md:p-8 flex items-center justify-between max-w-7xl mx-auto w-full relative z-20">
        <Link to="/" className="inline-flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-0.5 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="text-base font-medium tracking-tight text-white flex items-center gap-1.5">
            HireNova <span className="text-[10px] font-mono font-normal uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">CANDIDATE</span>
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
        <div className="w-full max-w-xl ai-card rounded-3xl p-8 sm:p-10 border border-white/[0.09] shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-slate-400 text-[11px] font-mono mb-3">
              <Sparkles className="w-3 h-3 text-emerald-400" /> JOIN TALENT NETWORK
            </div>
            <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">Create Profile</h1>
            <p className="text-xs text-slate-400 font-light mt-1.5">Register as a candidate to build your AI-optimized portfolio.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">First Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input 
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#090c14] border border-white/[0.07] rounded-xl text-sm text-slate-200 placeholder:text-slate-600 font-light focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                    placeholder="Alan"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">Last Name</label>
                <input 
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#090c14] border border-white/[0.07] rounded-xl text-sm text-slate-200 placeholder:text-slate-600 font-light focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                  placeholder="Turing"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">Account Handle</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-slate-500 font-mono text-sm pointer-events-none">@</span>
                <input 
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-9 pr-4 py-2.5 bg-[#090c14] border border-white/[0.07] rounded-xl text-sm text-slate-200 placeholder:text-slate-600 font-light focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                  placeholder="alanturing99"
                />
              </div>
            </div>

            {/* Candidate Email with OTP Integration */}
            <div className="space-y-1.5 pt-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">Primary Email Address</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input 
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#090c14] border border-white/[0.07] rounded-xl text-sm text-slate-200 placeholder:text-slate-600 font-light focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                    placeholder="alan@domain.com"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isSendingOtp || otpCountdown > 0 || !formData.email}
                  className={`px-4 py-2.5 rounded-xl text-xs font-normal transition-all flex items-center gap-2 border ${
                    otpSent 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                      : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/[0.08] text-slate-300 shadow-lg'
                  }`}
                >
                  {isSendingOtp ? (
                    <Loader className="w-3.5 h-3.5 animate-spin" />
                  ) : otpCountdown > 0 ? (
                    <><Timer className="w-3.5 h-3.5" /> {otpCountdown}s</>
                  ) : otpSent ? (
                    <><ShieldCheck className="w-3.5 h-3.5" /> Resend Code</>
                  ) : (
                    <><Send className="w-3.5 h-3.5" /> Send Code</>
                  )}
                </button>
              </div>
            </div>

            {/* OTP Verification Input Segment */}
            {otpSent && (
              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2 animate-fadeIn mt-2">
                <label className="text-[11px] font-mono text-emerald-400 block flex items-center gap-1.5 uppercase tracking-wider">
                  <ShieldCheck className="w-3 h-3" /> Security Verification Code
                </label>
                <input 
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // only numeric
                  className="w-full px-4 py-2.5 bg-[#090c14] border border-emerald-500/30 rounded-xl text-sm text-emerald-300 placeholder:text-emerald-900/40 font-mono text-center tracking-[0.5em] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                  placeholder="000000"
                />
                <p className="text-[10px] text-emerald-500/70 text-center font-light mt-1">Please enter the 6-digit code sent to your email.</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
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
                    className="w-full pl-10 pr-10 py-2.5 bg-[#090c14] border border-white/[0.07] rounded-xl text-sm text-slate-200 placeholder:text-slate-600 font-light focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all"
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
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">Confirm Password</label>
                <input 
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#090c14] border border-white/[0.07] rounded-xl text-sm text-slate-200 placeholder:text-slate-600 font-light focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading || !otpSent || otp.length !== 6}
              className="w-full mt-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-normal flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] disabled:opacity-50 disabled:bg-white/[0.03] disabled:text-slate-500 disabled:shadow-none group"
            >
              {isLoading ? (
                <Loader className="w-4 h-4 animate-spin text-white/70" />
              ) : (
                <>
                  Deploy Candidate Profile
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/[0.06] text-center">
            <p className="text-xs text-slate-400 font-light">
              Already secured a profile?{' '}
              <Link to="/login" className="text-emerald-400 hover:text-emerald-300 transition-colors font-normal">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Main Result Popup (Registration Status) */}
      {popup.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all">
          <div className="bg-[#0b0f19] rounded-3xl p-6 sm:p-7 max-w-sm w-full border border-white/[0.08] shadow-[0_0_40px_rgba(0,0,0,0.8)] relative flex flex-col items-center text-center">
            
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border ${
              popup.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
            }`}>
              {popup.type === 'success' ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
            </div>
            
            <h3 className="text-lg font-normal text-white mb-1">
              {popup.type === 'success' ? 'Verification Sent' : 'Deployment Failed'}
            </h3>
            
            <p className="text-xs text-slate-400 font-light mb-6 leading-relaxed">
              {popup.message}
            </p>
            
            <button 
              onClick={() => {
                setPopup({ show: false, type: '', message: '' });
                if (popup.type === 'success' && popup.message.includes('successful')) {
                  navigate('/login');
                }
              }}
              className="w-full py-2.5 bg-white/[0.03] hover:bg-white/[0.08] text-white border border-white/[0.08] rounded-xl text-xs font-normal transition-all shadow-lg"
            >
              {popup.type === 'success' && !popup.message.includes('code') ? 'Proceed to Login' : 'Acknowledge'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
