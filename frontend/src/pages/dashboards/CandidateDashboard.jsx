import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Bot, LogOut, Briefcase, FileText, User as UserIcon, Calendar, Search, Loader, Upload, CheckCircle, Activity, Menu, Download, Lock, X, ChevronRight, Mail, Phone, Clock, Sparkles, Zap, ArrowUpRight, ShieldCheck, AlertCircle, RefreshCw, Layers , MapPin, Rocket, Check, Video, Code, ExternalLink, MessageSquare, Send, Star, Gift, Award, ThumbsUp, CheckCircle2, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { apiClient } from '../../services/api';
import { authService } from '../../services/authService';
import axios from 'axios';

const formatName = (rawName, fallback) => {
  if (!rawName || typeof rawName !== 'string') return fallback || 'Candidate';
  const cleaned = rawName.replace(/\s+/g, ' ').trim();
  return cleaned
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const CandidateDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('jobs');
  const [globalResume, setGlobalResume] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [unreadApplicationsCount, setUnreadApplicationsCount] = useState(0);

  const checkUnreadApplications = () => {
    jobService.getUnreadApplicationsCount()
      .then(res => setUnreadApplicationsCount(res?.unreadCount || 0))
      .catch(() => {});
  };

  useEffect(() => {
    checkUnreadApplications();
    const interval = setInterval(checkUnreadApplications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenApplications = () => {
    setActiveTab('applications');
    setIsSidebarOpen(false);
    jobService.markApplicationsViewed()
      .then(() => setUnreadApplicationsCount(0))
      .catch(() => {});
  };

  useEffect(() => {
    apiClient.get('/resume/me')
      .then(res => setGlobalResume(res.data))
      .catch(() => setGlobalResume(null));
  }, [activeTab]); 

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const email = user?.email || user?.user?.email || 'candidate@domain.com';
  const rawUsername = user?.username || user?.user?.username || 'Candidate';
  const displayUsername = formatName(rawUsername, 'Candidate', email);

  return (
    <div className="min-h-screen bg-[#07080d] text-slate-200 flex font-sans selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-hidden bg-ai-grid">
      
      {/* Subtle ambient lighting */}
      <div className="fixed top-0 left-1/3 w-[600px] h-[300px] bg-indigo-600/5 blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[300px] bg-purple-600/5 blur-[160px] rounded-full pointer-events-none -z-10" />

      {/* Mobile Drawer Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-40 md:hidden backdrop-blur-sm transition-opacity" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}
      
      {/* High-Tech Collapsible Sidebar */}
      <aside 
        className={`fixed md:static inset-y-0 left-0 bg-[#090b14]/90 backdrop-blur-xl border-r border-white/[0.07] flex flex-col z-50 transition-all duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}
      >
        <div className={`p-5 border-b border-white/[0.06] flex items-center justify-between ${isSidebarCollapsed ? 'justify-center' : ''}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-0.5 shadow-md shadow-indigo-500/20 shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            {!isSidebarCollapsed && (
              <span className="text-base font-medium tracking-tight text-white flex items-center gap-1">
                HireNova <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.2 rounded">AI</span>
              </span>
            )}
          </div>

          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.04]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto overflow-x-hidden">
          <SidebarItem 
            icon={Search} 
            label="Browse Jobs" 
            active={activeTab === 'jobs'} 
            onClick={() => { setActiveTab('jobs'); setIsSidebarOpen(false); }} 
            collapsed={isSidebarCollapsed} 
          />
          <SidebarItem 
            icon={Layers} 
            label="Application Status" 
            badgeCount={unreadApplicationsCount}
            active={activeTab === 'applications'} 
            onClick={handleOpenApplications} 
            collapsed={isSidebarCollapsed} 
          />
          <SidebarItem 
            icon={FileText} 
            label="My Resume" 
            active={activeTab === 'resume'} 
            onClick={() => { setActiveTab('resume'); setIsSidebarOpen(false); }} 
            collapsed={isSidebarCollapsed} 
          />
          <SidebarItem 
            icon={Activity} 
            label="ATS Live Scanner" 
            active={activeTab === 'ats-checker'} 
            onClick={() => { setActiveTab('ats-checker'); setIsSidebarOpen(false); }} 
            collapsed={isSidebarCollapsed} 
          />
          <SidebarItem 
            icon={Calendar} 
            label="Interviews" 
            active={activeTab === 'interviews'} 
            onClick={() => { setActiveTab('interviews'); setIsSidebarOpen(false); }} 
            collapsed={isSidebarCollapsed} 
          />
        </nav>
        
        <div className="p-3 border-t border-white/[0.06]">
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center gap-2.5 p-2.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all text-xs font-normal ${
              isSidebarCollapsed ? 'justify-center' : 'px-3.5'
            }`}
            title="Terminate Session"
          >
            <LogOut className="w-4 h-4 shrink-0" /> 
            {!isSidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Futuristic Top Header Bar */}
        <header className="h-16 bg-[#090c14]/80 backdrop-blur-md border-b border-white/[0.06] flex items-center justify-between px-4 sm:px-8 shrink-0 relative z-30">
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => { 
                setIsSidebarOpen(!isSidebarOpen); 
                setIsSidebarCollapsed(!isSidebarCollapsed); 
              }} 
              className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/[0.05] transition-colors"
              title="Toggle Sidebar Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:block ml-2">
              <h2 className="text-sm font-normal text-white leading-tight">
                {activeTab === 'jobs' && 'Explore Career Roles'}
                {activeTab === 'applications' && 'Application Status & Pipeline'}
                {activeTab === 'resume' && 'AI Resume Studio'}
                {activeTab === 'ats-checker' && 'ATS Live Radar Scanner'}
                {activeTab === 'interviews' && 'Scheduled Interview Telemetry'}
                {activeTab === 'profile' && 'Candidate Profile & Credentials'}
              </h2>
              <p className="text-[10px] text-indigo-400 font-mono mt-0.5">
                {activeTab === 'jobs' && 'Verified open opportunities matched to your profile'}
                {activeTab === 'applications' && 'Real-time hiring stages, recruiter contact & interview plans'}
                {activeTab === 'resume' && 'Verified candidate master file and AI profile'}
                {activeTab === 'ats-checker' && 'Deep semantic ATS scoring & keyword breakdown'}
                {activeTab === 'interviews' && 'Confirmed video rounds, structured agendas & live rooms'}
                {activeTab === 'profile' && 'Secure candidate authentication & account file'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            
            {/* Global ATS Index Pill */}
            {globalResume && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.07] text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider hidden sm:inline">ATS Index</span>
                <span className="font-light text-emerald-400 text-sm font-mono">
                  {globalResume.atsScore ? `${globalResume.atsScore}/100` : 'Calibrated'}
                </span>
              </div>
            )}
            
            {/* User Profile Avatar Pill */}
            <div className="relative group">
              <div className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl hover:bg-white/[0.04] transition-all cursor-pointer border border-transparent hover:border-white/[0.06]">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-300 flex items-center justify-center font-normal text-xs border border-indigo-500/30">
                  {displayUsername.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-normal text-white leading-tight">{displayUsername}</p>
                  <p className="text-[10px] font-mono text-indigo-400">Candidate Protocol</p>
                </div>
              </div>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 top-12 mt-1 w-64 ai-card-glow rounded-2xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-white/[0.08] shadow-2xl z-50">
                <div className="mb-3 pb-3 border-b border-white/[0.06]">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1">Authenticated Account</p>
                  <p className="text-xs font-normal text-slate-200 break-all">{email}</p>
                </div>
                <button 
                  onClick={() => setActiveTab('profile')} 
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-normal transition-all shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                >
                  Candidate Credentials & Master File
                </button>
              </div>
            </div>

          </div>
        </header>

        {/* Dynamic Tab Body */}
        <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto w-full scroll-smooth">
          {activeTab === 'jobs' && <JobsTab globalResume={globalResume} />}
          {activeTab === 'applications' && <ApplicationsTab onBrowseJobs={() => setActiveTab('jobs')} />}
          {activeTab === 'resume' && (
            <ResumeTab 
              globalResume={globalResume} 
              onResumeUpdated={() => apiClient.get('/resume/me').then(res => setGlobalResume(res.data))} 
              displayUsername={displayUsername} 
            />
          )}
          {activeTab === 'ats-checker' && <ATSCheckerTab globalResume={globalResume} />}
          {activeTab === 'interviews' && <InterviewsTab />}
          {activeTab === 'profile' && <ProfileTab displayUsername={displayUsername} email={email} globalResume={globalResume} />}
        </div>
      </main>
    </div>
  );
};



const ResumeTab = ({ globalResume, onResumeUpdated, displayUsername }) => {
  const fileInputRef = useRef(null);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [uploadPhase, setUploadPhase] = useState('');

  const parsedAI = useMemo(() => {
    if (globalResume && globalResume.aiSummary) {
      try {
        return JSON.parse(globalResume.aiSummary);
      } catch (e) {
        return null;
      }
    }
    return null;
  }, [globalResume]);

  const candidateName = formatName(parsedAI?.name, displayUsername, parsedAI?.email || email);

  const handleResumeUpload = async (e) => {
    if (!e.target.files[0]) return;
    setResumeUploading(true);
    setUploadPhase('Decomposing document & repairing kerning...');
    
    const formData = new FormData();
    formData.append('file', e.target.files[0]);

    try {
      setTimeout(() => setUploadPhase('Extracting competencies via Groq Llama...'), 900);
      await apiClient.post('/resume/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setUploadPhase('Finalizing neural vector embedding...');
      if (onResumeUpdated) onResumeUpdated();
    } catch (err) {
      alert('Resume processing failed. Please ensure the file is a valid PDF.');
    } finally {
      setResumeUploading(false);
      setUploadPhase('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      
      {/* Top Action Bar */}
      <div className="ai-card rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-20 shadow-xl border border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-normal text-white">Neural Resume CV</h3>
            <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded">
              LLM Parsed
            </span>
          </div>
          <p className="text-xs text-slate-400 font-light mt-0.5">
            Structured representation extracted autonomously by the AI engine.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => fileInputRef.current?.click()} 
            disabled={resumeUploading}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-normal text-xs transition-all shadow-[0_0_20px_rgba(99,102,241,0.25)] hover:shadow-[0_0_25px_rgba(99,102,241,0.4)] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {resumeUploading ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
            {resumeUploading ? (uploadPhase || 'Analyzing...') : (globalResume ? 'Replace Resume' : 'Upload Resume')}
          </button>
          <input type="file" accept=".pdf,.doc,.docx" className="hidden" ref={fileInputRef} onChange={handleResumeUpload} />
        </div>
      </div>

      {/* Laser Scanning Animation Overlay during Upload */}
      {resumeUploading && (
        <div className="ai-card rounded-2xl p-6 border border-indigo-500/30 text-center relative overflow-hidden">
          <div className="animate-laser" />
          <p className="text-xs font-mono text-indigo-300 animate-pulse">{uploadPhase}</p>
        </div>
      )}

      {!parsedAI ? (
        <div className="ai-card rounded-3xl p-16 border border-dashed border-white/[0.08] text-center mt-6">
          <Bot className="w-12 h-12 mx-auto mb-3 text-slate-600" />
          <h4 className="text-lg font-normal text-white mb-1">No AI Profile Available</h4>
          <p className="text-xs text-slate-400 font-light max-w-sm mx-auto mb-5">
            Upload your resume PDF to activate automatic ATS scoring, skill extraction, and recruiter matching.
          </p>
          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-normal transition-all"
          >
            Select PDF Document
          </button>
        </div>
      ) : (
        <div className="ai-card rounded-3xl p-8 sm:p-12 border border-white/[0.08] shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

          {/* Header Block */}
          <div className="text-center pb-8 mb-8 border-b border-white/[0.06]">
            <h1 className="text-3xl sm:text-4xl font-light text-white tracking-tight">
              {candidateName}
            </h1>
            <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 mt-3 text-xs font-light text-slate-400">
              {parsedAI.email && (
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-400"/> {parsedAI.email}
                </div>
              )}
              {parsedAI.phone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-indigo-400"/> {parsedAI.phone}
                </div>
              )}
            </div>
            {parsedAI.total_experience_years !== null && (
              <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono">
                <Clock className="w-3 h-3"/> {parsedAI.total_experience_years} Years Experience
              </div>
            )}
          </div>
          
          {/* Core Skills Section */}
          {parsedAI.skills?.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/[0.06]">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h2 className="text-xs font-mono uppercase tracking-widest text-slate-400">Core Technical Competencies</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {parsedAI.skills.map(skill => (
                  <span 
                    key={skill} 
                    className="px-3 py-1 rounded-lg bg-[#0a0c16] border border-white/[0.06] text-xs font-light text-slate-300 hover:border-indigo-500/30 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Professional Experience Section */}
          {parsedAI.experiences?.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-6 pb-2 border-b border-white/[0.06]">
                <Briefcase className="w-4 h-4 text-indigo-400" />
                <h2 className="text-xs font-mono uppercase tracking-widest text-slate-400">Professional Work History</h2>
              </div>
              <div className="space-y-6">
                {parsedAI.experiences.map((exp, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-[#090b14] border border-white/[0.05] hover:border-white/[0.1] transition-all">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                      <div>
                        <h3 className="font-normal text-base text-white">{exp.role}</h3>
                        <h4 className="text-xs text-indigo-400 font-mono mt-0.5">{exp.company}</h4>
                      </div>
                      <span className="text-xs font-mono text-slate-500 whitespace-nowrap mt-1 sm:mt-0">{exp.duration}</span>
                    </div>
                    <p className="text-xs text-slate-400 font-light leading-relaxed mt-2 text-justify">{exp.description}</p>
                    
                    {exp.skills_used?.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-white/[0.04] flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mr-1">Skills:</span>
                        {exp.skills_used.map(s => (
                          <span key={s} className="px-2 py-0.5 rounded bg-white/[0.03] text-[10px] text-slate-400 font-mono">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Notable Projects Section */}
          {parsedAI.projects?.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-6 pb-2 border-b border-white/[0.06]">
                <Layers className="w-4 h-4 text-indigo-400" />
                <h2 className="text-xs font-mono uppercase tracking-widest text-slate-400">Engineered Projects</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {parsedAI.projects.map((proj, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-[#090b14] border border-white/[0.05] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <h3 className="font-normal text-sm text-white">{proj.title}</h3>
                        {proj.type && (
                          <span className="text-[9px] font-mono uppercase tracking-widest bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-1.5 py-0.5 rounded">
                            {proj.type}
                          </span>
                        )}
                      </div>
                      
                      <div className="text-xs font-light text-slate-400 space-y-1 mt-2">
                        {proj.languages?.length > 0 && (
                          <p><span className="text-slate-500 font-mono text-[10px]">Languages:</span> {proj.languages.join(", ")}</p>
                        )}
                        {proj.technologies?.length > 0 && (
                          <p><span className="text-slate-500 font-mono text-[10px]">Stack:</span> {proj.technologies.join(", ")}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Education Section */}
          {parsedAI.education?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/[0.06]">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <h2 className="text-xs font-mono uppercase tracking-widest text-slate-400">Academic Background</h2>
              </div>
              <div className="space-y-3">
                {parsedAI.education.map((edu, i) => (
                  <div key={i} className="flex justify-between items-start p-4 rounded-xl bg-[#090b14] border border-white/[0.05]">
                    <div>
                      <h3 className="font-normal text-sm text-white">{edu.degree} in {edu.field}</h3>
                      <h4 className="text-xs text-indigo-400 font-mono mt-0.5">{edu.school}</h4>
                    </div>
                    <div className="text-right font-mono text-xs">
                      <span className="text-slate-400">{edu.graduation_year}</span>
                      {edu.CGPA && <span className="text-emerald-400 block mt-0.5">CGPA: {edu.CGPA}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

const ApplyModal = ({ job, globalResume, onClose }) => {
  const [file, setFile] = useState(null);
  const [scannedResult, setScannedResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [transmissionState, setTransmissionState] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleScanUpload = async () => {
    if (!file && !globalResume) return alert("Upload a resume first to scan against this role.");
    setIsScanning(true);
    try {
      let res;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('job_description', job.description);
        res = await axios.post((import.meta.env.VITE_AI_URL || 'http://localhost:8000') + '/ats-score-upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        res = await axios.post((import.meta.env.VITE_AI_URL || 'http://localhost:8000') + '/ats-score', {
          job_description: job.description,
          resume_text: globalResume.extractedText
        });
      }
      setScannedResult(res.data);
    } catch (err) {
      alert("ATS scanning failed. Verify AI server is online.");
    } finally {
      setIsScanning(false);
    }
  };

  const submitApp = async () => {
    setTransmissionState('rocket');
    setErrorMessage('');
    
    try {
      const [apiRes] = await Promise.all([
        jobService.applyForJob(job.id, scannedResult?.score || 88),
        new Promise(resolve => setTimeout(resolve, 1500))
      ]);
      setTransmissionState('success');
      setTimeout(() => {
        onClose();
      }, 2600);
    } catch(err) {
      setTimeout(() => {
        setTransmissionState('error');
        setErrorMessage(err.response?.data?.message || err.response?.data || 'Application already recorded for this position.');
      }, 800);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md" onClick={onClose}>
      <div className="ai-card-glow rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-white/[0.1] shadow-2xl relative overflow-hidden" onClick={e => e.stopPropagation()}>
        
        {/* LASER SCANNING EFFECT */}
        {isScanning && <div className="animate-laser" />}

        {/* --- STAGE 1: ROCKET LAUNCH ANIMATION --- */}
        {transmissionState === 'rocket' && (
          <div className="py-12 px-4 flex flex-col items-center justify-center text-center">
            <div className="relative mb-6">
              <div className="absolute -inset-4 bg-purple-600/30 blur-2xl rounded-full animate-pulse pointer-events-none" />
              
              <div className="relative flex flex-col items-center animate-rocket">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.5)] border border-purple-400/40">
                  <Rocket className="w-8 h-8 text-white -rotate-45" />
                </div>
                <div className="w-4 bg-gradient-to-b from-amber-400 via-rose-500 to-transparent rounded-b-full animate-thrust mt-1" />
              </div>
            </div>

            <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400 mb-1">Telemetry Live</span>
            <h3 className="text-lg font-normal text-white mb-2">Transmitting Application Dossier</h3>
            <p className="text-xs text-slate-400 font-light max-w-xs">
              Encrypting vector metrics and launching directly into <span className="text-purple-300 font-normal">{job.companyName}</span> hiring cluster...
            </p>
          </div>
        )}

        {/* --- STAGE 2: SUCCESS VERIFIED TICK ANIMATION --- */}
        {transmissionState === 'success' && (
          <div className="py-10 px-4 flex flex-col items-center justify-center text-center">
            <div className="relative mb-6">
              <div className="absolute -inset-4 bg-emerald-500/20 rounded-full animate-ripple pointer-events-none" />
              
              <div className="relative w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)] animate-tick">
                <Check className="w-9 h-9 text-emerald-400 stroke-[2.5]" />
              </div>
            </div>

            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 mb-1">Transmission Confirmed</span>
            <h3 className="text-xl font-normal text-white mb-2">Application Transmitted!</h3>
            <p className="text-xs text-slate-400 font-light max-w-sm mb-4">
              Your profile has been successfully delivered for <span className="text-white font-normal">{job.title}</span> at <span className="text-emerald-300 font-normal">{job.companyName}</span>.
            </p>

            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs font-mono text-emerald-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> ATS Vector Score: {scannedResult?.score || 88}/100 Recorded
            </div>

            <button 
              onClick={onClose}
              className="mt-6 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-normal transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            >
              Return to Positions
            </button>
          </div>
        )}

        {/* --- STAGE 3: ERROR NOTICE --- */}
        {transmissionState === 'error' && (
          <div className="py-8 px-4 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4 shadow-[0_0_20px_rgba(244,63,94,0.3)]">
              <AlertCircle className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-normal text-white mb-2">Application Notice</h3>
            <p className="text-xs text-slate-400 font-light max-w-sm mb-6 leading-relaxed">
              {errorMessage}
            </p>

            <button 
              onClick={onClose}
              className="px-6 py-2 bg-[#121524] hover:bg-[#1a1f33] text-slate-200 rounded-xl text-xs font-normal border border-white/[0.08]"
            >
              Close
            </button>
          </div>
        )}

        {/* --- STAGE 0: DEFAULT SCAN & TRANSMIT VIEW --- */}
        {transmissionState === 'idle' && (
          <>
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400">Autonomous Application</span>
                <h2 className="text-xl font-light text-white mt-0.5">{job.title}</h2>
                <p className="text-xs text-slate-400">{job.companyName}</p>
              </div>
              <button onClick={onClose} className="text-slate-500 hover:text-white p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 font-light mb-6">
              The AI engine will calculate your ATS compatibility index against this job description before submission.
            </p>
            
            {!scannedResult ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#090b14] border border-white/[0.06]">
                  <label className="text-[11px] font-mono text-slate-400 block mb-2">Upload Specific Target Resume (Optional)</label>
                  <input 
                    type="file" 
                    accept=".pdf" 
                    onChange={e => setFile(e.target.files[0])} 
                    className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-normal file:bg-indigo-600/20 file:text-indigo-300 hover:file:bg-indigo-600/30" 
                  />
                </div>
                {globalResume && (
                  <p className="text-[11px] font-mono text-emerald-400 text-center">
                    ✓ Master Resume automatically armed as target.
                  </p>
                )}
                <button 
                  disabled={isScanning} 
                  onClick={handleScanUpload} 
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-normal text-white transition-all shadow-[0_0_20px_rgba(99,102,241,0.25)] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isScanning ? <Loader className="w-4 h-4 animate-spin"/> : <Sparkles className="w-4 h-4"/>}
                  {isScanning ? 'Executing Neural ATS Scan...' : 'Calculate ATS Compatibility'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center">
                  <span className="block text-emerald-400/80 text-[10px] font-mono uppercase tracking-widest mb-1">ATS Compatibility Score</span>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-light text-emerald-400">{scannedResult.score}</span>
                    <span className="text-sm font-mono text-emerald-400/50">/100</span>
                  </div>
                </div>

                {scannedResult.missing_skills?.length > 0 && (
                  <div className="p-3 bg-[#0d101a] rounded-xl border border-white/[0.05]">
                    <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block mb-1.5">Missing Target Skills</span>
                    <div className="flex flex-wrap gap-1">
                      {scannedResult.missing_skills.map(s => (
                        <span key={s} className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-mono">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button 
                  onClick={submitApp} 
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl text-xs font-normal text-white transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] flex items-center justify-center gap-2"
                >
                  <Rocket className="w-4 h-4 -rotate-45" /> Launch & Transmit Application
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};


const AIOptimizerModal = ({ job, globalResume, onClose }) => {
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [copiedSkill, setCopiedSkill] = useState(null);

  const runAnalysis = async (customFile = null) => {
    setAnalyzing(true);
    setError(null);
    try {
      let data;
      const targetFile = customFile || file;
      if (targetFile) {
        data = await jobService.optimizeResumeUpload(job.description || job.title, targetFile);
      } else if (globalResume && (globalResume.extractedText || globalResume.aiSummary)) {
        const textToUse = globalResume.extractedText || globalResume.aiSummary;
        data = await jobService.optimizeResumeText(job.description || job.title, textToUse);
      } else {
        setError("Please upload a resume file or save your master resume to analyze fit.");
        setAnalyzing(false);
        return;
      }
      setAnalysis(data);
    } catch (err) {
      console.error(err);
      setError("AI Optimization service is unreachable. Ensure ai-service is running on port 8000.");
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    if (globalResume && (globalResume.extractedText || globalResume.aiSummary)) {
      runAnalysis();
    }
  }, []);

  const handleCopySkill = (skill) => {
    navigator.clipboard.writeText(skill);
    setCopiedSkill(skill);
    setTimeout(() => setCopiedSkill(null), 2000);
  };

  const getScoreColor = (score) => {
    if (score >= 75) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (score >= 50) return 'text-purple-300 border-purple-500/40 bg-purple-500/10';
    return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md" onClick={onClose}>
      <div className="ai-card-glow rounded-3xl p-6 sm:p-8 max-w-3xl w-full border border-white/[0.1] shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6" onClick={e => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/[0.07]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400">AI Resume Optimizer & Gap Analysis</span>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[10px] font-mono flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-400" /> Groq AI Powered
              </span>
            </div>
            <h3 className="text-xl font-light text-white mt-1">{job.title}</h3>
            <p className="text-xs text-slate-400 font-light mt-0.5">
              {job.companyName || 'HireNova'} • Match calibration against targeted job criteria
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/[0.05] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Toggle / File selection if user wants custom upload */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
          <div className="text-xs text-slate-300 font-light">
            Using: <span className="font-mono text-purple-300">{file ? file.name : globalResume?.fileName || 'Uploaded Master Resume'}</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="cursor-pointer px-3 py-1.5 bg-[#121524] hover:bg-[#1a1f33] text-slate-300 rounded-xl text-xs font-light transition-colors border border-white/[0.08] flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-purple-400" />
              <span>{file ? 'Change PDF' : 'Upload Different Resume'}</span>
              <input 
                type="file" 
                accept=".pdf,.docx,.txt" 
                className="hidden" 
                onChange={(e) => {
                  if (e.target.files[0]) {
                    setFile(e.target.files[0]);
                    runAnalysis(e.target.files[0]);
                  }
                }} 
              />
            </label>
            <button 
              onClick={() => runAnalysis()}
              disabled={analyzing}
              className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl text-xs font-light transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${analyzing ? 'animate-spin' : ''}`} />
              <span>{analyzing ? 'Calibrating...' : 'Re-Analyze'}</span>
            </button>
          </div>
        </div>

        {/* State: Loading */}
        {analyzing && (
          <div className="py-14 text-center space-y-3">
            <Loader className="w-8 h-8 mx-auto animate-spin text-purple-400" />
            <p className="text-sm text-slate-300 font-light">Parsing job description and running neural gap analysis...</p>
            <p className="text-xs text-slate-500 font-mono">Comparing skills, computing ATS index, extracting STAR optimizations</p>
          </div>
        )}

        {/* State: Error */}
        {error && !analyzing && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* State: Results */}
        {analysis && !analyzing && (
          <div className="space-y-6">
            
            {/* Top Score & Match Summary */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-[#090b14] border border-white/[0.06] flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center border font-mono ${getScoreColor(analysis.match_score || 75)}`}>
                  <span className="text-2xl font-bold">{analysis.match_score || 75}%</span>
                  <span className="text-[9px] uppercase tracking-wider opacity-70">Match</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Calibration</span>
                  <h4 className="text-sm font-medium text-white">{analysis.match_level || 'Moderate Match'}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">ATS Compatibility</p>
                </div>
              </div>

              <div className="sm:col-span-2 p-5 rounded-2xl bg-[#090b14] border border-white/[0.06] flex flex-col justify-center">
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Executive ATS Guidance
                </span>
                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  {analysis.executive_summary || "Tailor your project descriptions to highlight measurable outcomes and match key requirements directly."}
                </p>
              </div>
            </div>

            {/* Missing Critical Skills (The Gap) */}
            <div className="p-5 rounded-2xl bg-rose-500/[0.04] border border-rose-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-medium text-rose-300 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" /> Missing Critical Skills & Keywords
                </h4>
                <span className="text-[10px] font-mono text-rose-400">Click skill to copy</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(analysis.missing_critical_skills && analysis.missing_critical_skills.length > 0) ? (
                  analysis.missing_critical_skills.map((skill, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleCopySkill(skill)}
                      className="px-2.5 py-1 rounded-xl bg-[#0e1222] border border-rose-500/30 text-rose-200 text-xs font-mono flex items-center gap-1.5 hover:border-rose-400 transition-colors group"
                      title="Click to copy to clipboard"
                    >
                      <span>{skill}</span>
                      {copiedSkill === skill ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3 text-rose-400/60 group-hover:text-rose-300" />
                      )}
                    </button>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">No major critical skill gaps detected. Great match!</span>
                )}
              </div>
            </div>

            {/* Matching Strengths & Recommended Keywords */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#090b14] border border-white/[0.06] space-y-2">
                <h5 className="text-xs font-medium text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Aligned Core Strengths
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.matching_skills && analysis.matching_skills.map((s, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-mono">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#090b14] border border-white/[0.06] space-y-2">
                <h5 className="text-xs font-medium text-indigo-300 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-indigo-400" /> High-Impact Keywords to Embed
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.recommended_keywords && analysis.recommended_keywords.map((k, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-mono">
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bullet Point Improvement Comparison (STAR Rewrites) */}
            {analysis.bullet_point_improvements && analysis.bullet_point_improvements.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-medium text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" /> STAR Bullet Point Rewrites (ATS Boosters)
                </h4>
                <div className="space-y-3">
                  {analysis.bullet_point_improvements.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-[#090b14] border border-white/[0.06] space-y-2.5">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Current / Weak Pattern</span>
                        <p className="text-xs text-slate-400 line-through decoration-rose-500/50 italic bg-rose-500/[0.03] p-2 rounded-lg border border-rose-500/10">
                          {item.original_area}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-400" /> Recommended High-Impact Rewrite
                        </span>
                        <div className="p-2.5 rounded-lg bg-emerald-500/[0.05] border border-emerald-500/20 text-xs font-mono text-emerald-200 leading-relaxed flex items-start justify-between gap-2">
                          <span>{item.suggested_rewrite}</span>
                          <button 
                            onClick={() => handleCopySkill(item.suggested_rewrite)}
                            className="text-emerald-400/70 hover:text-emerald-300 p-1 shrink-0"
                            title="Copy rewrite"
                          >
                            {copiedSkill === item.suggested_rewrite ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {item.reason && (
                        <p className="text-[11px] text-purple-300/80 font-light italic">
                          💡 Why this matters: {item.reason}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal Footer */}
        <div className="pt-4 border-t border-white/[0.07] flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-500">
            {globalResume ? 'Targeting active master profile' : 'Upload resume to calibrate'}
          </span>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-[#121524] hover:bg-[#1a1f33] text-slate-200 rounded-xl text-xs font-light transition-colors border border-white/[0.08]"
          >
            Close Optimizer
          </button>
        </div>

      </div>
    </div>
  );
};


const JobsTab = ({ globalResume }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobForModal, setSelectedJobForModal] = useState(null);
  const [optimizingJob, setOptimizingJob] = useState(null);
  const [applyingJobId, setApplyingJobId] = useState(null);

  useEffect(() => {
    jobService.getAllJobs()
      .then(res => setJobs(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter(j => 
      j.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.requiredSkills?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [jobs, searchTerm]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      
      {/* Header & Filter Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-light text-white tracking-tight">Active Opportunities Pool</h3>
          <p className="text-xs text-slate-400 font-light mt-0.5">Explore open positions across top tech companies in India with instant AI ATS matching.</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search roles, skills, cities..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#090b14] border border-white/[0.07] rounded-xl text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/40 font-light"
          />
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-16"><Loader className="w-6 h-6 animate-spin text-indigo-500" /></div>
      ) : filteredJobs.length === 0 ? (
        <div className="ai-card rounded-2xl p-16 text-center text-slate-500 border border-white/[0.06]">
          <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-40 text-indigo-400" />
          <p className="text-sm font-light">No positions match your search filter.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {filteredJobs.map(job => (
            <div 
              key={job.id} 
              className="ai-card p-6 rounded-2xl border border-white/[0.07] hover:border-indigo-500/30 transition-all flex flex-col justify-between group relative"
            >
              <div>
                {/* Header: Title & Company with Verified badge */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-base font-normal text-white group-hover:text-indigo-200 transition-colors">
                      {job.title}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
                      <span className="text-indigo-300 font-medium">{job.companyName || 'HireNova Verified'}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-600" />
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">Verified</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded">
                    Active
                  </span>
                </div>

                {/* Triple-Icon Metadata Row: Experience, Indian Rupee Salary (₹ LPA), Location */}
                <div className="grid grid-cols-3 gap-2 py-3 my-3 border-y border-white/[0.05] text-xs font-light text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{job.experienceRequired ? `${job.experienceRequired} Yrs` : '0-1 Yr'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-indigo-400 font-normal">₹</span>
                    <span>
                      {job.salaryMin && job.salaryMax 
                        ? `${job.salaryMin}-${job.salaryMax} Lacs P.A.`
                        : job.salaryMin 
                        ? `${job.salaryMin} Lacs P.A.`
                        : '10-18 Lacs P.A.'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{job.location || 'Bengaluru'}</span>
                  </div>
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {job.requiredSkills && job.requiredSkills.split(',').slice(0, 4).map(skill => (
                    <span key={skill} className="px-2 py-0.5 bg-[#090b14] border border-white/[0.06] text-[10px] text-slate-300 rounded font-mono">
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500">Early Applicant Active</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setOptimizingJob(job)}
                    className="px-2.5 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 rounded-xl text-xs font-light transition-colors border border-purple-500/25 flex items-center gap-1"
                    title="AI Resume Optimizer & Gap Analysis"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Optimize
                  </button>
                  <button 
                    onClick={() => setSelectedJobForModal(job)}
                    className="px-3 py-1.5 bg-[#121524] hover:bg-[#1a1f33] text-slate-300 hover:text-white rounded-xl text-xs font-normal transition-colors border border-white/[0.06]"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => setApplyingJobId(job.id)}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-normal transition-all shadow-[0_0_15px_rgba(99,102,241,0.2)] flex items-center gap-1.5"
                  >
                    Scan & Apply <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Resume Optimizer Modal */}
      {optimizingJob && (
        <AIOptimizerModal 
          job={optimizingJob} 
          globalResume={globalResume} 
          onClose={() => setOptimizingJob(null)} 
        />
      )}

      {/* Detailed Job View Modal (Images 3, 4, 5) */}
      {selectedJobForModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md" onClick={() => setSelectedJobForModal(null)}>
          <div className="ai-card-glow rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-white/[0.1] shadow-2xl relative max-h-[88vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between pb-4 mb-4 border-b border-white/[0.07]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400">Opportunity Profile</span>
                <h3 className="text-xl font-normal text-white mt-1">{selectedJobForModal.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{selectedJobForModal.companyName} • {selectedJobForModal.location || 'Bengaluru'}</p>
              </div>
              <button onClick={() => setSelectedJobForModal(null)} className="text-slate-500 hover:text-white p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#090b14] border border-white/[0.06] mb-6 text-xs">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Experience</span>
                <span className="text-slate-200">{selectedJobForModal.experienceRequired || 1} Yrs</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Salary</span>
                <span className="text-indigo-300 font-mono">
                  ₹ {selectedJobForModal.salaryMin || 10} - {selectedJobForModal.salaryMax || 18} LPA
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Job Type</span>
                <span className="text-slate-200">{selectedJobForModal.jobType || 'Full Time, Permanent'}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Location</span>
                <span className="text-slate-200">{selectedJobForModal.location || 'Bengaluru'}</span>
              </div>
            </div>

            <div className="space-y-5 text-xs font-light">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-2">Key Skills</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedJobForModal.requiredSkills?.split(',').map(s => (
                    <span key={s} className="px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-300 font-mono border border-indigo-500/20">
                      {s.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-2">Full Scope & Description</span>
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap bg-[#090b14] p-4 rounded-xl border border-white/[0.05]">
                  {selectedJobForModal.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.06] flex justify-end gap-3">
                <button 
                  onClick={() => setSelectedJobForModal(null)}
                  className="px-4 py-2 bg-[#121524] text-slate-300 rounded-xl text-xs transition-colors"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    const j = selectedJobForModal;
                    setSelectedJobForModal(null);
                    setApplyingJobId(j.id);
                  }}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-normal transition-all shadow-[0_0_15px_rgba(99,102,241,0.2)] flex items-center gap-1.5"
                >
                  Proceed to Scan & Apply <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {applyingJobId && (
        <ApplyModal 
          job={jobs.find(j => j.id === applyingJobId)} 
          globalResume={globalResume} 
          onClose={() => setApplyingJobId(null)} 
        />
      )}
    </div>
  );
};

const ATSCheckerTab = ({ globalResume }) => {
  const [jobDesc, setJobDesc] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const checkATS = async () => {
    if (!jobDesc) return alert("Please input the target Job Description to compare.");
    setLoading(true);
    try {
      let res;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('job_description', jobDesc);
        res = await axios.post((import.meta.env.VITE_AI_URL || 'http://localhost:8000') + '/ats-score-upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        if (!globalResume || !globalResume.extractedText) return alert("Upload a resume or provide a document to scan.");
        res = await axios.post((import.meta.env.VITE_AI_URL || 'http://localhost:8000') + '/ats-score', {
          job_description: jobDesc,
          resume_text: globalResume.extractedText
        });
      }
      setResult(res.data);
    } catch (e) {
      alert("Analysis failed. Verify the AI service is active.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div>
        <h3 className="text-xl font-light text-white tracking-tight">Live ATS Radar Scanner</h3>
        <p className="text-xs text-slate-400 font-light mt-0.5">Test your resume against any custom job description before applying.</p>
      </div>

      <div className="ai-card rounded-3xl p-6 md:p-8 border border-white/[0.08] relative overflow-hidden">
        {loading && <div className="animate-laser" />}

        <label className="block text-[11px] font-mono uppercase tracking-widest text-slate-400 mb-2">
          Target Job Description
        </label>
        <textarea 
          rows={5} 
          value={jobDesc} 
          onChange={e => setJobDesc(e.target.value)} 
          className="w-full bg-[#090b14] border border-white/[0.07] rounded-xl p-3.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/40 font-light leading-relaxed mb-6" 
          placeholder="Paste requirements, tech stack, and responsibilities..."
        />
        
        <label className="block text-[11px] font-mono uppercase tracking-widest text-slate-400 mb-2">
          Source Document
        </label>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 p-4 rounded-xl bg-[#090b14] border border-white/[0.05]">
          <input 
            type="file" 
            accept=".pdf" 
            onChange={e => setFile(e.target.files[0])} 
            className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-normal file:bg-indigo-600/20 file:text-indigo-300 hover:file:bg-indigo-600/30" 
          />
          {globalResume && (
            <span className="text-[11px] font-mono text-slate-500">
              Defaulting to Master Resume if no file selected.
            </span>
          )}
        </div>
        
        <button 
          onClick={checkATS} 
          disabled={loading} 
          className="w-full sm:w-auto px-7 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-normal transition-all shadow-[0_0_20px_rgba(99,102,241,0.25)] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <Loader className="w-4 h-4 animate-spin"/> : <Sparkles className="w-4 h-4"/>}
          {loading ? 'Evaluating Vector Proximity...' : 'Execute ATS Compatibility Scan'}
        </button>
      </div>
      
      {result && (
        <div className="ai-card rounded-3xl p-6 md:p-8 border border-white/[0.08] shadow-2xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.06]">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Scan Results</span>
              <h4 className="text-base font-normal text-white mt-0.5">Vector Compatibility Report</h4>
            </div>
            <div className="inline-flex items-baseline gap-1 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono">
              <span className="text-3xl font-light">{result.score}</span>
              <span className="text-xs text-emerald-400/60">/100</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-[#090b14] border border-white/[0.05]">
              <h5 className="text-[11px] font-mono uppercase tracking-widest text-slate-400 mb-3 pb-2 border-b border-white/[0.05]">
                Missing Target Competencies
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {result.missing_skills?.map(skill => (
                  <span key={skill} className="px-2.5 py-1 rounded bg-rose-500/10 text-rose-400 text-xs font-mono border border-rose-500/20">
                    {skill}
                  </span>
                ))}
                {(!result.missing_skills || result.missing_skills.length === 0) && (
                  <span className="text-xs font-mono text-emerald-400">Optimal coverage. No critical omissions detected.</span>
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#090b14] border border-white/[0.05]">
              <h5 className="text-[11px] font-mono uppercase tracking-widest text-slate-400 mb-3 pb-2 border-b border-white/[0.05]">
                Structural Formatting Observations
              </h5>
              <ul className="text-xs font-light text-slate-300 space-y-2">
                {result.formatting_issues?.map((iss, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 font-mono">•</span> {iss}
                  </li>
                ))}
                {(!result.formatting_issues || result.formatting_issues.length === 0) && (
                  <li className="text-emerald-400 font-mono">Document formatting meets standard ATS criteria.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ProfileTab = ({ displayUsername, email, globalResume }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [passForm, setPassForm] = useState({ oldPassword: '', newPassword: '' });
  const [passStatus, setPassStatus] = useState(null);
  const [passLoading, setPassLoading] = useState(false);

  useEffect(() => {
    authService.getProfile().then(res => setProfileData(res)).finally(() => setLoading(false));
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPassLoading(true);
    setPassStatus(null);
    try {
      await authService.changePassword(passForm);
      setPassStatus({ type: 'success', text: 'Password credentials securely updated.' });
      setPassForm({ oldPassword: '', newPassword: '' });
    } catch (err) {
      setPassStatus({ type: 'error', text: err.response?.data || 'Credential update failed.' });
    } finally {
      setPassLoading(false);
    }
  };

  const handleResumeUpload = async (e) => {
    if (!e.target.files[0]) return;
    setResumeUploading(true);
    const formData = new FormData();
    formData.append('file', e.target.files[0]);

    try {
      await apiClient.post('/resume/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      window.location.reload(); 
    } catch (err) {
      alert('Master resume upload failed.');
    } finally {
      setResumeUploading(false);
    }
  };

  const handleDownloadResume = async () => {
    try {
      const response = await apiClient.get('/resume/download', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', globalResume ? globalResume.fileName : 'master_resume.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert('Failed to download resume.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div>
        <h3 className="text-xl font-light text-white tracking-tight">Candidate Credentials & File Storage</h3>
        <p className="text-xs text-slate-400 font-light mt-0.5">Manage identity credentials and master resume payload.</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><Loader className="w-6 h-6 animate-spin text-indigo-500" /></div>
      ) : profileData && typeof profileData === 'object' && profileData.email ? (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            <InfoCard label="First Name" value={profileData.firstName || 'Not provided'} />
            <InfoCard label="Last Name" value={profileData.lastName || 'Not provided'} />
            <InfoCard label="Handle" value={`@${profileData.username}`} />
            <InfoCard label="Email" value={profileData.email} isEmail />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Master File Card */}
            <div className="ai-card rounded-2xl p-6 border border-white/[0.08]">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/[0.06]">
                <FileText className="w-4 h-4 text-indigo-400" />
                <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400">Master Resume Payload</h4>
              </div>

              {globalResume ? (
                <div>
                  <div className="flex justify-between items-center bg-[#090b14] px-4 py-3 rounded-xl border border-white/[0.06] mb-4">
                    <span className="text-xs font-light text-slate-200 truncate max-w-[170px]">{globalResume.fileName}</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Active File</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleDownloadResume} 
                      className="flex-1 py-2 bg-[#121524] hover:bg-[#1a1f33] rounded-xl text-xs font-normal text-slate-300 hover:text-white transition-colors border border-white/[0.06] flex items-center justify-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
                    <button 
                      onClick={() => fileInputRef.current?.click()} 
                      disabled={resumeUploading}
                      className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-normal text-white transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      {resumeUploading ? <Loader className="w-3.5 h-3.5 animate-spin"/> : <Upload className="w-3.5 h-3.5" />}
                      Replace
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-xs text-slate-400 font-light mb-3">No master document currently stored.</p>
                  <button 
                    onClick={() => fileInputRef.current?.click()} 
                    disabled={resumeUploading}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-normal transition-all flex items-center justify-center gap-1.5"
                  >
                    {resumeUploading ? <Loader className="w-3.5 h-3.5 animate-spin"/> : <Upload className="w-3.5 h-3.5"/>}
                    Upload Master Document
                  </button>
                </div>
              )}
              <input type="file" accept=".pdf,.doc,.docx" className="hidden" ref={fileInputRef} onChange={handleResumeUpload} />
            </div>

            {/* Credential Reset */}
            <div className="ai-card rounded-2xl p-6 border border-white/[0.08]">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/[0.06]">
                <Lock className="w-4 h-4 text-indigo-400" />
                <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400">Security Credentials</h4>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-3">
                {passStatus && (
                  <div className={`p-2.5 text-[11px] font-mono rounded-lg ${passStatus.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {passStatus.text}
                  </div>
                )}
                <input 
                  type="password" 
                  placeholder="Current Password" 
                  required 
                  value={passForm.oldPassword} 
                  onChange={e => setPassForm({...passForm, oldPassword: e.target.value})} 
                  className="w-full px-3.5 py-2 bg-[#090c14] border border-white/[0.07] rounded-xl text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/40 font-light" 
                />
                <input 
                  type="password" 
                  placeholder="New Secure Password" 
                  required 
                  value={passForm.newPassword} 
                  onChange={e => setPassForm({...passForm, newPassword: e.target.value})} 
                  className="w-full px-3.5 py-2 bg-[#090c14] border border-white/[0.07] rounded-xl text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/40 font-light" 
                />
                <button 
                  type="submit" 
                  disabled={passLoading} 
                  className="w-full py-2 bg-[#121524] hover:bg-[#1a1f33] text-slate-200 hover:text-white rounded-xl text-xs font-normal transition-colors border border-white/[0.06] flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {passLoading ? <Loader className="w-3.5 h-3.5 animate-spin"/> : 'Update Credentials'}
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="ai-card rounded-2xl p-6 text-rose-400 text-xs font-mono">
          Unable to fetch candidate identity records.
        </div>
      )}
    </div>
  );
};

const InfoCard = ({ label, value, isEmail }) => (
  <div className="p-4 rounded-xl bg-[#090b14] border border-white/[0.06]">
    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1">{label}</span>
    <span className={`text-xs font-normal ${isEmail ? 'text-indigo-400 break-all' : 'text-slate-200'}`}>{value}</span>
  </div>
);

const ApplicationsTab = ({ onBrowseJobs }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingOfferId, setAcceptingOfferId] = useState(null);

  const handleAcceptOffer = async (appId) => {
    setAcceptingOfferId(appId);
    try {
      await jobService.acceptJobOffer(appId);
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, offerAccepted: true } : a));
    } catch (e) {
      alert("Failed to acknowledge offer acceptance. Please retry.");
    } finally {
      setAcceptingOfferId(null);
    }
  };

  const fetchApps = () => {
    setLoading(true);
    jobService.getMyApplications()
      .then(res => {
        setApplications(res || []);
        jobService.markApplicationsViewed().catch(() => {});
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const getGoogleCalendarUrl = (app) => {
    if (!app.interviewDate) return '#';
    try {
      const startDate = new Date(app.interviewDate);
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
      const formatTime = (d) => d.toISOString().replace(/-|:|\.\d+/g, '');
      const title = encodeURIComponent(`Interview: ${app.roundName || 'Technical Round'} - ${app.jobTitle}`);
      const details = encodeURIComponent(`Role: ${app.jobTitle}\nCompany: ${app.companyName || 'HireNova'}\nInterviewer: ${app.interviewerName || 'Panel'}\nMeeting: ${app.meetingLink || 'Online'}`);
      const location = encodeURIComponent(app.meetingLink || 'Online Video');
      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatTime(startDate)}/${formatTime(endDate)}&details=${details}&location=${location}`;
    } catch (e) {
      return '#';
    }
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-light text-white tracking-tight">Application Status</h3>
          <p className="text-xs text-slate-400 font-light mt-0.5">Live recruitment progression & outcomes</p>
        </div>
        <button 
          onClick={onBrowseJobs}
          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-light transition-all shadow-[0_0_12px_rgba(99,102,241,0.2)] w-fit flex items-center gap-1.5"
        >
          <Search className="w-3.5 h-3.5" /> Explore Roles
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-16"><Loader className="w-6 h-6 animate-spin text-indigo-500" /></div>
      ) : applications.length === 0 ? (
        <div className="ai-card rounded-2xl p-12 text-center text-slate-500 border border-white/[0.06]">
          <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-30 text-indigo-400" />
          <p className="text-xs font-light mb-3">No submitted applications yet.</p>
          <button 
            onClick={onBrowseJobs}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-light transition-colors"
          >
            Browse Open Positions
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map(app => {
            const isShortlisted = ['SHORTLISTED', 'ASSESSMENT_SENT', 'INTERVIEW_SCHEDULED', 'HIRED'].includes(app.status);
            const isAssessment = app.status === 'ASSESSMENT_SENT';
            const isInterview = app.status === 'INTERVIEW_SCHEDULED' && Boolean(app.interviewDate);
            const isHired = app.status === 'HIRED';
            const isRejected = app.status === 'REJECTED';

            const cleanCompanyName = (app.companyName || 'hirenova').toLowerCase().replace(/[^a-z0-9]/g, '');
            const recruiterContactEmail = app.recruiterEmail || 'Naresh@gmail.com';

            return (
              <div 
                key={app.id} 
                className="ai-card p-5 rounded-2xl border border-white/[0.07] hover:border-indigo-500/30 transition-all space-y-4"
              >
                {/* Header Information Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.05]">
                  <div>
                    <h4 className="text-sm font-normal text-white">{app.jobTitle || `Job Ref #${app.jobId}`}</h4>
                    <p className="text-xs text-slate-400 font-light mt-0.5">
                      <span className="text-slate-300">{app.companyName || 'HireNova'}</span> • {app.location || 'India'} • <span className="text-purple-300 font-mono">₹ {app.salaryMin || 10}-{app.salaryMax || 18} LPA</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {app.atsScore && (
                      <span className="px-2 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-mono flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> {Math.round(app.atsScore)}% ATS
                      </span>
                    )}

                    <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-mono border ${
                      isHired
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : isShortlisted && !isAssessment && !isInterview
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        : isInterview
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                        : isAssessment
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                        : isRejected
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                    }`}>
                      {app.status === 'PENDING' ? 'Under Review' :
                       app.status === 'SHORTLISTED' ? 'Shortlisted' :
                       app.status === 'ASSESSMENT_SENT' ? 'Assessment Assigned' :
                       app.status === 'INTERVIEW_SCHEDULED' ? 'Interview Scheduled' :
                       app.status === 'HIRED' ? 'Selected' :
                       app.status === 'REJECTED' ? 'Rejected' : app.status}
                    </span>
                  </div>
                </div>

                {/* Pipeline Stepper */}
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1.5">
                    <span className="text-indigo-300">1. Applied</span>
                    <span className={isShortlisted ? 'text-emerald-300' : 'text-slate-600'}>2. Shortlisted</span>
                    <span className={isAssessment || isInterview || isHired ? 'text-purple-300' : 'text-slate-600'}>3. Assessment / Interview</span>
                    <span className={isHired ? 'text-emerald-400' : isRejected ? 'text-rose-400' : 'text-slate-600'}>4. Decision</span>
                  </div>
                  <div className="h-1 w-full bg-[#090b14] rounded-full overflow-hidden flex">
                    <div className="h-full bg-indigo-500 w-1/4" />
                    <div className={`h-full transition-all duration-500 ${isShortlisted ? 'bg-emerald-500 w-1/4' : 'w-0'}`} />
                    <div className={`h-full transition-all duration-500 ${isAssessment || isInterview || isHired ? 'bg-purple-500 w-1/4' : 'w-0'}`} />
                    <div className={`h-full transition-all duration-500 ${isHired ? 'bg-emerald-400 w-1/4' : isRejected ? 'bg-rose-500 w-1/4' : 'w-0'}`} />
                  </div>
                </div>

                {/* Interview Action Card */}
                {isInterview && (
                  <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/25 space-y-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-purple-500/20">
                      <div className="flex items-center gap-2">
                        <Video className="w-3.5 h-3.5 text-purple-400" />
                        <h5 className="text-xs font-normal text-white">{app.roundName || 'Technical Interview'}</h5>
                      </div>
                      <span className="text-[11px] font-mono text-purple-300">
                        {app.interviewDate ? new Date(app.interviewDate).toLocaleString() : 'Date pending'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 font-light space-y-1.5">
                      {app.interviewerName && (
                        <p className="text-slate-400 text-[11px]">
                          Interviewer: <span className="text-slate-200">{app.interviewerName}</span>
                        </p>
                      )}

                      {app.interviewPlan && (
                        <div className="p-2.5 bg-[#090b14] border border-white/[0.05] rounded-lg text-[11px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                          {app.interviewPlan}
                        </div>
                      )}
                    </div>

                    <div className="pt-1 flex flex-wrap items-center gap-2">
                      {app.meetingLink && (
                        <a 
                          href={app.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-light transition-all shadow-[0_0_12px_rgba(168,85,247,0.3)] flex items-center gap-1.5"
                        >
                          <Video className="w-3.5 h-3.5" /> Join Meeting <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {app.interviewDate && (
                        <a 
                          href={getGoogleCalendarUrl(app)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-[#121524] hover:bg-[#1a1f33] text-purple-300 border border-purple-500/30 rounded-xl text-xs font-light transition-colors flex items-center gap-1.5"
                        >
                          <Calendar className="w-3 h-3 text-purple-400" /> Add to Calendar
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Assessment Action Card */}
                {isAssessment && (
                  <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/25 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1.5 border-b border-cyan-500/20">
                      <div className="flex items-center gap-2">
                        <Code className="w-3.5 h-3.5 text-cyan-400" />
                        <h5 className="text-xs font-normal text-white">{app.assessmentTitle || 'Technical Challenge'}</h5>
                      </div>
                      <span className="text-[11px] font-mono text-cyan-300">
                        Deadline: {app.assessmentDeadline || '48h'}
                      </span>
                    </div>

                    {app.notes && (
                      <p className="text-xs text-slate-300 font-light">
                        Instructions: <span className="italic text-slate-400">{app.notes}</span>
                      </p>
                    )}

                    {app.assessmentLink && (
                      <div className="pt-1">
                        <a 
                          href={app.assessmentLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-light transition-all shadow-[0_0_12px_rgba(6,182,212,0.3)] inline-flex items-center gap-1.5"
                        >
                          <Code className="w-3.5 h-3.5" /> Launch Assessment <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* Official Job Offer Banner (Feature 1 - When Hired) */}
                {isHired && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-emerald-900/20 to-teal-950/30 border border-emerald-500/40 space-y-3 shadow-[0_0_25px_rgba(16,185,129,0.15)]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-emerald-500/20">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-emerald-400" />
                        <h5 className="text-sm font-medium text-white tracking-tight">Official Employment Offer</h5>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                        🎉 Hired & Confirmed
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-1 text-xs">
                      <div className="p-2.5 rounded-xl bg-black/40 border border-emerald-500/20">
                        <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">Offered Role</span>
                        <span className="font-medium text-white">{app.offeredDesignation || app.jobTitle}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/40 border border-emerald-500/20">
                        <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">Compensation (CTC)</span>
                        <span className="font-medium text-emerald-300 font-mono">₹ {app.offeredCtc || app.salaryMax || 18} LPA</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/40 border border-emerald-500/20">
                        <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">Target Joining Date</span>
                        <span className="font-medium text-white">{app.joiningDate || 'Immediate / 30 Days'}</span>
                      </div>
                    </div>

                    {app.offerLetterNotes && (
                      <div className="p-3 bg-black/30 rounded-xl border border-white/[0.05] text-xs text-slate-300 font-light whitespace-pre-wrap leading-relaxed">
                        <span className="text-[10px] font-mono text-slate-400 block mb-1">Recruiter Welcome Message:</span>
                        {app.offerLetterNotes}
                      </div>
                    )}

                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-emerald-400/80">
                        {app.offerAccepted ? '✅ Offer Accepted & Onboarding Initiated' : 'Action Required: Formal Acceptance'}
                      </span>
                      
                      {app.offerAccepted ? (
                        <span className="px-3.5 py-1.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-light flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Offer Accepted
                        </span>
                      ) : (
                        <button
                          onClick={() => handleAcceptOffer(app.id)}
                          disabled={acceptingOfferId === app.id}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-medium transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-1.5"
                        >
                          {acceptingOfferId === app.id ? (
                            <Loader className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Check className="w-3.5 h-3.5" />
                          )}
                          <span>Accept Offer</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Interview Feedback & Scorecard Box (Feature 1) */}
                {(app.technicalScore || app.interviewerFeedback || app.strengths) && (
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.07] space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-white/[0.05]">
                      <div className="flex items-center gap-2">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                        <h5 className="text-xs font-medium text-white">Interview Evaluation Scorecard</h5>
                      </div>
                      {app.recommendation && (
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono border ${
                          app.recommendation.includes('HIRE')
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                            : 'bg-slate-500/10 text-slate-300 border-white/[0.08]'
                        }`}>
                          {app.recommendation.replace('_', ' ')}
                        </span>
                      )}
                    </div>

                    {/* Ratings Matrix */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="p-2 rounded-xl bg-[#090b14] border border-white/[0.04]">
                        <span className="text-[10px] text-slate-400 block">Technical</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="font-mono text-amber-300 font-medium">{app.technicalScore || 4}/5</span>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star key={star} className={`w-2.5 h-2.5 ${star <= (app.technicalScore || 4) ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`} />
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="p-2 rounded-xl bg-[#090b14] border border-white/[0.04]">
                        <span className="text-[10px] text-slate-400 block">Communication</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="font-mono text-purple-300 font-medium">{app.communicationScore || 4}/5</span>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star key={star} className={`w-2.5 h-2.5 ${star <= (app.communicationScore || 4) ? 'text-purple-400 fill-purple-400' : 'text-slate-700'}`} />
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="p-2 rounded-xl bg-[#090b14] border border-white/[0.04]">
                        <span className="text-[10px] text-slate-400 block">Problem Solving</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="font-mono text-cyan-300 font-medium">{app.problemSolvingScore || 4}/5</span>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star key={star} className={`w-2.5 h-2.5 ${star <= (app.problemSolvingScore || 4) ? 'text-cyan-400 fill-cyan-400' : 'text-slate-700'}`} />
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="p-2 rounded-xl bg-[#090b14] border border-white/[0.04]">
                        <span className="text-[10px] text-slate-400 block">Culture Alignment</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="font-mono text-emerald-300 font-medium">{app.culturalFitScore || 5}/5</span>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star key={star} className={`w-2.5 h-2.5 ${star <= (app.culturalFitScore || 5) ? 'text-emerald-400 fill-emerald-400' : 'text-slate-700'}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Strengths & Guidance */}
                    {app.strengths && (
                      <div className="text-xs space-y-1">
                        <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">Demonstrated Strengths</span>
                        <p className="text-slate-300 font-light bg-emerald-500/[0.03] p-2 rounded-lg border border-emerald-500/10">
                          {app.strengths}
                        </p>
                      </div>
                    )}

                    {app.interviewerFeedback && (
                      <div className="text-xs space-y-1">
                        <span className="text-[10px] font-mono text-purple-300 uppercase tracking-wider block">Panel Commentary</span>
                        <p className="text-slate-300 font-light italic bg-white/[0.02] p-2 rounded-lg border border-white/[0.04]">
                          "{app.interviewerFeedback}"
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Simple Recruiter Email Contact - Only if Shortlisted! */}
                {isShortlisted ? (
                  <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Mail className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="text-slate-400 font-light">Recruiter Email:</span>
                      <a 
                        href={`mailto:${recruiterContactEmail}?subject=Inquiry:%20${encodeURIComponent(app.jobTitle || 'Position')}%20Application`}
                        className="text-indigo-400 font-mono hover:underline text-xs"
                      >
                        {recruiterContactEmail}
                      </a>
                    </div>
                    <a 
                      href={`mailto:${recruiterContactEmail}?subject=Inquiry:%20${encodeURIComponent(app.jobTitle || 'Position')}%20Application`}
                      className="px-2.5 py-1 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 rounded-lg text-[11px] font-light border border-white/[0.07] transition-colors flex items-center gap-1"
                    >
                      <Mail className="w-3 h-3" /> Contact Recruiter
                    </a>
                  </div>
                ) : null}

                {/* Footer Metadata */}
                <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>Applied: {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'Recently'}</span>
                  <span>ID: APP-{app.id}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const InterviewsTab = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      jobService.getMyApplications(),
      apiClient.get('/interviews/me')
    ]).then(([appsRes, intRes]) => {
      const fromApps = (appsRes.status === 'fulfilled' && appsRes.value) ? 
        appsRes.value.filter(a => a.status === 'INTERVIEW_SCHEDULED' && a.interviewDate) : [];
      
      const fromInterviews = (intRes.status === 'fulfilled' && intRes.value?.data) ?
        intRes.value.data
          .filter(i => (i.status === 'INTERVIEW_SCHEDULED' || !i.status) && i.interviewDate)
          .map(i => ({
          id: 'int-' + i.id,
          roundName: 'Live Technical Panel',
          jobTitle: `Job Position #${i.jobId}`,
          companyName: 'HireNova Organization',
          interviewDate: i.interviewDate,
          interviewerName: i.interviewerName,
          meetingLink: i.meetingLink,
          status: i.status || 'SCHEDULED'
        })) : [];

      const combined = [...fromApps];
      fromInterviews.forEach(fi => {
        if (!combined.some(c => c.meetingLink && c.meetingLink === fi.meetingLink)) {
          combined.push(fi);
        }
      });
      setInterviews(combined);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-5 max-w-5xl mx-auto pb-16">
      <div>
        <h3 className="text-lg font-light text-white tracking-tight">Scheduled Interviews</h3>
        <p className="text-xs text-slate-400 font-light mt-0.5">Upcoming technical panels and video room links</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-16"><Loader className="w-6 h-6 animate-spin text-indigo-500" /></div>
      ) : interviews.length === 0 ? (
        <div className="ai-card rounded-2xl p-12 text-center text-slate-400 max-w-2xl mx-auto border border-white/[0.06]">
          <Calendar className="w-10 h-10 mx-auto mb-2 opacity-30 text-indigo-400" />
          <h4 className="text-sm font-normal text-white mb-1">No Interviews Scheduled</h4>
          <p className="text-xs text-slate-400 font-light">
            When recruiters schedule video rounds, your meeting links and interview details will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {interviews.map(inv => (
            <div 
              key={inv.id} 
              className="ai-card p-4 rounded-xl border border-white/[0.06] hover:border-purple-500/30 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-normal text-white">{inv.roundName || 'Technical Interview'}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      Confirmed
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    <span className="text-indigo-300 font-normal">{inv.jobTitle}</span> • {inv.companyName || 'HireNova'}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {inv.meetingLink ? (
                    <a 
                      href={inv.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-light transition-all shadow-[0_0_12px_rgba(168,85,247,0.3)] flex items-center gap-1.5"
                    >
                      <Video className="w-3.5 h-3.5" /> Join Call <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-xs text-slate-500 font-mono">Link pending</span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Clock className="w-3 h-3 text-indigo-400" />
                  {inv.interviewDate ? new Date(inv.interviewDate).toLocaleString() : 'Date TBD'}
                </span>
                {inv.interviewerName && (
                  <span>Interviewer: {inv.interviewerName}</span>
                )}
              </div>

              {inv.interviewPlan && (
                <div className="p-2.5 bg-[#090b14] border border-white/[0.04] rounded-lg text-[11px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {inv.interviewPlan}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SidebarItem = ({ icon: Icon, label, active, onClick, collapsed, badgeCount }) => (
  <button 
    onClick={onClick} 
    title={collapsed ? `${label} ${badgeCount ? `(${badgeCount} new)` : ''}` : ""}
    className={`w-full flex items-center p-2.5 rounded-xl transition-all text-xs font-normal ${
      active 
        ? 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.15)]' 
        : 'text-slate-400 hover:bg-white/[0.03] hover:text-slate-200'
    } ${collapsed ? 'justify-center relative' : 'justify-between px-3.5'}`}
  >
    <div className="flex items-center gap-3">
      <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-indigo-300' : 'text-slate-500'}`} /> 
      {!collapsed && <span>{label}</span>}
    </div>
    {!collapsed && badgeCount > 0 && (
      <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-mono font-bold animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.7)]">
        {badgeCount}
      </span>
    )}
    {collapsed && badgeCount > 0 && (
      <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2 animate-ping" />
    )}
  </button>
);

export default CandidateDashboard;
