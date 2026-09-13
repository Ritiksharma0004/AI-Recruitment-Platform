import React, { useState, useEffect, useMemo } from 'react';
import { Bot, LogOut, Briefcase, Users, PlusCircle, Calendar, Sparkles, Loader, CheckSquare, Menu, X, ArrowUpRight, Search, Activity, ChevronRight, Download, FileText, Mail, Phone, Clock, MapPin, Building2, Award, CheckCircle, Eye, IndianRupee, Trash2, Video, Code, Send, Check, AlertCircle, ExternalLink, Plus, Star, Gift, ThumbsUp, ThumbsDown, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { ConfirmModal, ToastNotification } from '../../components/ConfirmModal';

const formatName = (rawName, fallback, email = '') => {
  if (!rawName || typeof rawName !== 'string') return fallback || 'Candidate';
  let s = rawName.replace(/\s+/g, ' ').trim();

  if (email && email.includes('@')) {
    const prefix = email.split('@')[0].toLowerCase();
    const parts = prefix.split(/[^a-zA-Z]/).filter(p => p.length >= 3 && !['gmail', 'mail', 'sde', 'dev', 'test', 'admin', 'user', 'recruiter'].includes(p));
    const collapsed = s.replace(/[^a-zA-Z]/g, '').toLowerCase();
    const matched = parts.filter(p => collapsed.includes(p));
    if (matched.length >= 2) {
      return matched.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }
  }

  s = s.replace(/\bR\s+Itik\b/gi, 'Ritik');
  s = s.replace(/s\s+Harma\b/gi, ' Sharma');
  s = s.replace(/\b([A-Za-z]+)s\s+Harma\b/gi, '$1 Sharma');
  s = s.replace(/\b([A-Za-z])\s+([A-Za-z]{2,})\b/g, '$1$2');
  s = s.replace(/\b([A-Za-z]{2,})s\s+([A-Za-z]{3,})\b/g, '$1 s$2');
  if (/\b[A-Za-z]\s+[A-Za-z]\s+[A-Za-z]\b/.test(s)) {
    s = s.replace(/\b([A-Za-z])\s+(?=[A-Za-z]\b)/g, '$1');
  }

  return s
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
};

const RecruiterDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('post-job');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const rawUsername = user?.username || user?.user?.username || 'Recruiter';
  const username = rawUsername.charAt(0).toUpperCase() + rawUsername.slice(1);

  return (
    <div className="min-h-screen bg-[#07080d] text-slate-200 flex font-sans selection:bg-purple-500/30 selection:text-purple-200 relative overflow-hidden bg-ai-grid">
      
      {/* Ambient Lighting */}
      <div className="fixed top-0 right-1/4 w-[600px] h-[300px] bg-purple-600/5 blur-[140px] rounded-full pointer-events-none -z-10" />

      {/* Mobile Drawer Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-40 md:hidden backdrop-blur-sm" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}

      {/* Collapsible Sidebar */}
      <aside 
        className={`fixed md:static inset-y-0 left-0 bg-[#090b14]/90 backdrop-blur-xl border-r border-white/[0.07] flex flex-col z-50 transition-all duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}
      >
        <div className={`p-5 border-b border-white/[0.06] flex items-center justify-between ${isSidebarCollapsed ? 'justify-center' : ''}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center p-0.5 shadow-md shadow-purple-500/20 shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            {!isSidebarCollapsed && (
              <span className="text-base font-medium tracking-tight text-white flex items-center gap-1">
                HireNova <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 border border-purple-500/20 px-1.5 py-0.2 rounded">RECRUITER</span>
              </span>
            )}
          </div>

          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto overflow-x-hidden">
          <SidebarItem 
            icon={PlusCircle} 
            label="Post Job Listing" 
            active={activeTab === 'post-job'} 
            onClick={() => { setActiveTab('post-job'); setIsSidebarOpen(false); }} 
            collapsed={isSidebarCollapsed} 
          />
          <SidebarItem 
            icon={Briefcase} 
            label="Manage Jobs" 
            active={activeTab === 'manage-jobs'} 
            onClick={() => { setActiveTab('manage-jobs'); setIsSidebarOpen(false); }} 
            collapsed={isSidebarCollapsed} 
          />
          <SidebarItem 
            icon={Users} 
            label="Applicant Pool" 
            active={activeTab === 'candidates'} 
            onClick={() => { setActiveTab('candidates'); setIsSidebarOpen(false); }} 
            collapsed={isSidebarCollapsed} 
          />
          <SidebarItem 
            icon={Calendar} 
            label="Scheduled Interviews" 
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
          >
            <LogOut className="w-4 h-4 shrink-0" /> 
            {!isSidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden h-screen">
        
        {/* Top Header */}
        <header className="h-16 bg-[#090c14]/80 backdrop-blur-md border-b border-white/[0.06] flex items-center justify-between px-4 sm:px-8 shrink-0 relative z-30">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setIsSidebarOpen(!isSidebarOpen);
                setIsSidebarCollapsed(!isSidebarCollapsed);
              }}
              className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/[0.05] transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:block ml-2">
              <h2 className="text-sm font-normal text-white leading-tight">
                {activeTab === 'post-job' && 'Deploy New Job Listing'}
                {activeTab === 'manage-jobs' && 'Active Postings Inventory'}
                {activeTab === 'candidates' && 'Recruitment Pipeline & Applicant Pool'}
                {activeTab === 'interviews' && 'Scheduled Interviews & Telemetry'}
              </h2>
              <p className="text-[10px] text-purple-400 font-mono mt-0.5">
                {activeTab === 'post-job' && 'Configure role specifications, Indian salary ranges & key competencies'}
                {activeTab === 'manage-jobs' && 'Review live vacancies, inspect details or retire positions'}
                {activeTab === 'candidates' && 'Rank applicants by ATS match score, schedule interviews & assign assessments'}
                {activeTab === 'interviews' && 'Confirmed candidate rounds, meeting links & structured agendas'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl hover:bg-white/[0.04] transition-all border border-white/[0.06]">
              <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-300 flex items-center justify-center font-normal text-xs border border-purple-500/30">
                {username.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-normal text-white leading-tight">{username}</p>
                <p className="text-[10px] font-mono text-purple-400">Recruiter Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Body */}
        <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto w-full scroll-smooth">
          {activeTab === 'manage-jobs' && <ManageJobsTab setActiveTab={setActiveTab} />}
          {activeTab === 'post-job' && <PostJobTab setActiveTab={setActiveTab} />}
          {activeTab === 'candidates' && <CandidatesTab />}
          {activeTab === 'interviews' && <InterviewsTab />}
        </div>
      </main>
    </div>
  );
};



const PostJobTab = ({ setActiveTab }) => {
  const loggedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const [formData, setFormData] = useState({
    title: '',
    companyName: '',
    recruiterEmail: loggedUser.email || '',
    location: '',
    jobType: 'Full Time, Permanent',
    department: 'Engineering - Software & QA',
    education: 'UG: B.Tech / B.E. in Any Specialization',
    experienceRequired: '',
    salaryMin: '',
    salaryMax: '',
    requiredSkills: '',
    highlights: '',
    whatWeOffer: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const fullDescription = `${formData.description}\n\nJob Highlights:\n${formData.highlights || 'Standard Technical Scope'}\n\nWhat We Offer:\n${formData.whatWeOffer || 'Fast-paced growth, cutting-edge AI architecture'}\n\nDepartment: ${formData.department}\nEducation: ${formData.education}`;

      const payload = {
        title: formData.title,
        companyName: formData.companyName,
        recruiterEmail: formData.recruiterEmail || loggedUser.email || 'recruiter@hirenova.ai',
        location: formData.location,
        jobType: formData.jobType,
        experienceRequired: parseInt(formData.experienceRequired) || 0,
        salaryMin: parseFloat(formData.salaryMin) || 0,
        salaryMax: parseFloat(formData.salaryMax) || 0,
        requiredSkills: formData.requiredSkills,
        description: fullDescription
      };

      await jobService.createJob(payload);
      setStatus({ type: 'success', text: 'Job successfully deployed into Indian recruitment cluster.' });
      setTimeout(() => setActiveTab('manage-jobs'), 1400);
    } catch (err) {
      setStatus({ type: 'error', text: 'Deployment failed. Check microservices connection.' });
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto ai-card rounded-3xl p-6 sm:p-10 border border-white/[0.08] shadow-2xl relative overflow-hidden pb-16">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/[0.06]">
        <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-light text-white tracking-tight">Deploy New Position</h3>
          <p className="text-xs text-slate-400 font-light mt-0.5">Post an active job listing into the vector recruitment database.</p>
        </div>
      </div>

      {status && (
        <div className={`p-3 mb-5 rounded-xl border text-xs font-mono flex items-center gap-2 ${
          status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
        }`}>
          {status.type === 'success' && <CheckSquare className="w-4 h-4"/>} {status.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1: Title & Company Name */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">Job Title *</label>
            <input 
              required 
              type="text" 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              className="w-full px-3.5 py-2.5 bg-[#090b14] border border-white/[0.07] rounded-xl text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 font-light" 
              placeholder="e.g. Senior Backend Engineer" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">Company / Organization *</label>
            <input 
              required 
              type="text" 
              value={formData.companyName} 
              onChange={e => setFormData({...formData, companyName: e.target.value})} 
              className="w-full px-3.5 py-2.5 bg-[#090b14] border border-white/[0.07] rounded-xl text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 font-light" 
              placeholder="e.g. Thyrocare / CloudScale Tech" 
            />
          </div>

          <div>
            <label className="text-xs font-light text-slate-400 block mb-1.5">Official Recruiter Email *</label>
            <input 
              required 
              type="email" 
              value={formData.recruiterEmail} 
              onChange={e => setFormData({...formData, recruiterEmail: e.target.value})} 
              className="w-full px-3.5 py-2.5 bg-[#090b14] border border-white/[0.07] rounded-xl text-xs text-slate-200 font-mono placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 font-light" 
              placeholder="recruiter@company.com" 
            />
          </div>
        </div>

        {/* Row 2: Location, Job Type, Department */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">Location *</label>
            <input 
              required
              type="text" 
              value={formData.location} 
              onChange={e => setFormData({...formData, location: e.target.value})} 
              className="w-full px-3.5 py-2.5 bg-[#090b14] border border-white/[0.07] rounded-xl text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 font-light" 
              placeholder="e.g. Bengaluru / Remote" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">Employment Type</label>
            <select 
              value={formData.jobType} 
              onChange={e => setFormData({...formData, jobType: e.target.value})}
              className="w-full px-3.5 py-2.5 bg-[#090b14] border border-white/[0.07] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-purple-500/50 font-light"
            >
              <option value="Full Time, Permanent">Full Time, Permanent</option>
              <option value="Full Time, Remote">Full Time, Remote</option>
              <option value="Contract / Freelance">Contract / Freelance</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">Department / Role Category</label>
            <input 
              type="text" 
              value={formData.department} 
              onChange={e => setFormData({...formData, department: e.target.value})} 
              className="w-full px-3.5 py-2.5 bg-[#090b14] border border-white/[0.07] rounded-xl text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 font-light" 
              placeholder="Engineering - Software & QA" 
            />
          </div>
        </div>

        {/* Row 3: Experience & Indian Rupee (₹ LPA) Salary */}
        <div className="grid grid-cols-3 gap-3.5">
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">Experience (Yrs) *</label>
            <input 
              type="number" 
              required 
              value={formData.experienceRequired} 
              onChange={e => setFormData({...formData, experienceRequired: e.target.value})} 
              className="w-full px-3.5 py-2.5 bg-[#090b14] border border-white/[0.07] rounded-xl text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 font-mono" 
              placeholder="1 - 3" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">Min Salary (₹ LPA)</label>
            <input 
              type="number" 
              value={formData.salaryMin} 
              onChange={e => setFormData({...formData, salaryMin: e.target.value})} 
              className="w-full px-3.5 py-2.5 bg-[#090b14] border border-white/[0.07] rounded-xl text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 font-mono" 
              placeholder="e.g. 10 (10 Lakhs)" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">Max Salary (₹ LPA)</label>
            <input 
              type="number" 
              value={formData.salaryMax} 
              onChange={e => setFormData({...formData, salaryMax: e.target.value})} 
              className="w-full px-3.5 py-2.5 bg-[#090b14] border border-white/[0.07] rounded-xl text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 font-mono" 
              placeholder="e.g. 18 (18 Lakhs)" 
            />
          </div>
        </div>

        {/* Row 4: Required Skills */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">Required Skills (Comma separated) *</label>
          <input 
            required 
            type="text" 
            value={formData.requiredSkills} 
            onChange={e => setFormData({...formData, requiredSkills: e.target.value})} 
            className="w-full px-3.5 py-2.5 bg-[#090b14] border border-white/[0.07] rounded-xl text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 font-mono" 
            placeholder="Java, Spring Boot, React, MySQL, Data Structures, OOP, MVC" 
          />
        </div>

        {/* Row 5: Job Highlights */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">Job Highlights (Key bullets for card)</label>
          <textarea 
            rows={2} 
            value={formData.highlights} 
            onChange={e => setFormData({...formData, highlights: e.target.value})} 
            className="w-full px-3.5 py-2 bg-[#090b14] border border-white/[0.07] rounded-xl text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 resize-none font-light leading-relaxed" 
            placeholder="• Strong skills in Java, OOP, and distributed microservices architecture&#10;• Design scalable systems handling millions of daily API transactions"
          />
        </div>

        {/* Row 6: What We Offer */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">What We Offer / Perks</label>
          <textarea 
            rows={2} 
            value={formData.whatWeOffer} 
            onChange={e => setFormData({...formData, whatWeOffer: e.target.value})} 
            className="w-full px-3.5 py-2 bg-[#090b14] border border-white/[0.07] rounded-xl text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 resize-none font-light leading-relaxed" 
            placeholder="• Fast growth culture, ownership from design to production&#10;• Flexi-timing, casual environment, top-tier compensation"
          />
        </div>

        {/* Row 7: Detailed Description */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">Comprehensive Job Description *</label>
          <textarea 
            required 
            rows={4} 
            value={formData.description} 
            onChange={e => setFormData({...formData, description: e.target.value})} 
            className="w-full px-3.5 py-2.5 bg-[#090b14] border border-white/[0.07] rounded-xl text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 resize-none font-light leading-relaxed" 
            placeholder="Outline end-to-end responsibilities, team architecture, deliverables, and technical expectations..."
          />
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-normal transition-all shadow-[0_0_20px_rgba(168,85,247,0.25)] flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader className="w-4 h-4 animate-spin"/> : <Sparkles className="w-4 h-4" />}
          {loading ? 'Publishing to Indian Job Database...' : 'Publish to Recruitment Engine'}
        </button>
      </form>
    </div>
  );
};

const ManageJobsTab = ({ setActiveTab }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobForModal, setSelectedJobForModal] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchJobs = () => {
    setLoading(true);
    jobService.getAllJobs()
      .then(res => setJobs(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const confirmDeleteJob = async () => {
    if (!jobToDelete) return;
    setDeletingId(jobToDelete.id);
    try {
      await jobService.deleteJob(jobToDelete.id);
      setJobs(prev => prev.filter(j => j.id !== jobToDelete.id));
      if (selectedJobForModal?.id === jobToDelete.id) {
        setSelectedJobForModal(null);
      }
      setToast({ type: 'success', text: `Job position "${jobToDelete.title}" was permanently deleted.` });
      setJobToDelete(null);
    } catch (err) {
      setToast({ type: 'error', text: 'Failed to delete job: ' + (err.response?.data?.message || err.message) });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-light text-white tracking-tight">Active Postings Inventory</h3>
          <p className="text-xs text-slate-400 font-light mt-0.5">Manage existing roles open for candidate applications or retire obsolete postings.</p>
        </div>
        <button 
          onClick={() => setActiveTab('post-job')} 
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-2 rounded-xl text-xs font-normal transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)] w-fit"
        >
          <PlusCircle className="w-3.5 h-3.5" /> Deploy New Role
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-16"><Loader className="w-6 h-6 animate-spin text-purple-500" /></div>
      ) : jobs.length === 0 ? (
        <div className="ai-card rounded-2xl p-16 text-center text-slate-500 border border-white/[0.06]">
          <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-30 text-purple-400" />
          <p className="text-sm font-light mb-4">No active job listings deployed yet.</p>
          <button 
            onClick={() => setActiveTab('post-job')}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-normal transition-colors"
          >
            Create Your First Job
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {jobs.map(job => (
            <div 
              key={job.id} 
              className="ai-card p-6 rounded-2xl border border-white/[0.07] hover:border-purple-500/30 transition-all flex flex-col justify-between group relative"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-base font-normal text-white group-hover:text-purple-200 transition-colors">
                      {job.title}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
                      <span className="text-purple-300 font-medium">{job.companyName || 'HireNova Organization'}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-600" />
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">Verified</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded">
                      Active
                    </span>
                    <button
                      onClick={(e) => {
                        if (e) e.stopPropagation();
                        setJobToDelete({ id: job.id, title: job.title });
                      }}
                      disabled={deletingId === job.id}
                      title="Delete Posting"
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    >
                      {deletingId === job.id ? <Loader className="w-3.5 h-3.5 animate-spin text-rose-400" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Triple-Icon Metadata Row: Experience, Salary (₹ LPA), Location */}
                <div className="grid grid-cols-3 gap-2 py-3 my-3 border-y border-white/[0.05] text-xs font-light text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{job.experienceRequired ? `${job.experienceRequired} Yrs` : '0-1 Yr'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-purple-400 font-normal">₹</span>
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
                <span className="text-[11px] font-mono text-slate-500">Early Ingest Active</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedJobForModal(job)}
                    className="px-3 py-1.5 bg-[#121524] hover:bg-[#1a1f33] text-slate-300 hover:text-white rounded-xl text-xs font-normal transition-colors border border-white/[0.06]"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => setActiveTab('candidates')}
                    className="px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 rounded-xl text-xs font-normal transition-colors border border-purple-500/30 flex items-center gap-1"
                  >
                    Applicants <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Job View Modal */}
      {selectedJobForModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md" onClick={() => setSelectedJobForModal(null)}>
          <div className="ai-card-glow rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-white/[0.1] shadow-2xl relative max-h-[88vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between pb-4 mb-4 border-b border-white/[0.07]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400">Position Profile</span>
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
                <span className="text-purple-300 font-mono">
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
                    <span key={s} className="px-2.5 py-1 rounded bg-purple-500/10 text-purple-300 font-mono border border-purple-500/20">
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

              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <button 
                  onClick={() => setJobToDelete({ id: selectedJobForModal.id, title: selectedJobForModal.title })}
                  className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-normal transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Position
                </button>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedJobForModal(null)}
                    className="px-4 py-2 bg-[#121524] text-slate-300 rounded-xl text-xs transition-colors"
                  >
                    Close
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedJobForModal(null);
                      setActiveTab('candidates');
                    }}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-normal transition-colors flex items-center gap-1.5"
                  >
                    Inspect Applicants <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Job Confirmation Popup Modal */}
      <ConfirmModal
        isOpen={Boolean(jobToDelete)}
        onClose={() => !deletingId && setJobToDelete(null)}
        onConfirm={confirmDeleteJob}
        title="Delete Job Position"
        message={`Are you sure you want to permanently delete "${jobToDelete?.title}"? This will also remove all associated applicant pipeline data.`}
        confirmText="Delete Position"
        confirmStyle="danger"
        loading={Boolean(deletingId)}
      />

      <ToastNotification toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};

const CandidatesTab = () => {
  const [jobs, setJobs] = useState([]);
  const [toast, setToast] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [candidateProfiles, setCandidateProfiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [viewingResumeModal, setViewingResumeModal] = useState(null);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  const [interviewModalApp, setInterviewModalApp] = useState(null);
  const [interviewForm, setInterviewForm] = useState({
    interviewDate: '',
    roundName: 'Technical Round 1',
    interviewerName: 'Lead Architect',
    meetingLink: 'https://meet.google.com/hirenova-room',
    interviewPlan: '1. Candidate Intro & Project Highlights (10m)\n2. System Architecture & Spring Boot Patterns (25m)\n3. Live Coding & Algorithmic Problem (20m)\n4. Candidate Q&A & Culture Fit (10m)',
    notes: 'Please review system design fundamentals and microservices architecture.'
  });

  const [assessmentModalApp, setAssessmentModalApp] = useState(null);

  const [feedbackModalApp, setFeedbackModalApp] = useState(null);
  const [feedbackForm, setFeedbackForm] = useState({
    technicalScore: 4,
    communicationScore: 4,
    problemSolvingScore: 4,
    culturalFitScore: 5,
    recommendation: 'HIRE',
    strengths: '',
    areasForImprovement: '',
    interviewerFeedback: '',
    decision: 'OFFER',
    offeredDesignation: '',
    offeredCtc: 18.0,
    joiningDate: '',
    offerLetterNotes: 'We were highly impressed by your technical interview and problem-solving agility. We are thrilled to invite you to join our engineering team.'
  });

  const [gapModalApp, setGapModalApp] = useState(null);
  const [gapData, setGapData] = useState(null);
  const [gapLoading, setGapLoading] = useState(false);
  const [assessmentForm, setAssessmentForm] = useState({
    assessmentTitle: 'Full-Stack Spring Boot & React Technical Challenge',
    assessmentLink: 'https://codesignal.com/assessment/hirenova-challenge',
    assessmentDeadline: '48 Hours from receipt',
    notes: 'Solve the backend API challenge and frontend state synchronization.'
  });

  const loadJobs = () => {
    jobService.getAllJobs().then(async (allJobs) => {
      const enrichedJobs = await Promise.all(
        allJobs.map(async (j) => {
          try {
            const apps = await jobService.getJobApplications(j.id);
            return { ...j, applicantCount: apps.length };
          } catch {
            return { ...j, applicantCount: 0 };
          }
        })
      );
      setJobs(enrichedJobs);
    }).catch(console.error);
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const loadApplications = async (job) => {
    setSelectedJob(job);
    setLoading(true);
    try {
      const apps = await jobService.getJobApplications(job.id);
      const sorted = [...apps].sort((a, b) => (b.atsScore || 0) - (a.atsScore || 0));
      setApplications(sorted);

      sorted.forEach(async (app) => {
        if (!candidateProfiles[app.userId]) {
          try {
            const res = await jobService.getCandidateResume(app.userId);
            let parsed = null;
            if (res && res.aiSummary) {
              try { parsed = JSON.parse(res.aiSummary); } catch {}
            }
            setCandidateProfiles(prev => ({
              ...prev,
              [app.userId]: { ...res, parsed }
            }));
          } catch (e) {
            setCandidateProfiles(prev => ({
              ...prev,
              [app.userId]: { fileName: 'resume.pdf', parsed: null }
            }));
          }
        }
      });
    } catch (e) {
      console.error(e);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    setUpdatingStatusId(appId);
    try {
      const currentRecruiterEmail = (JSON.parse(localStorage.getItem('user') || '{}')).email || 'recruiter@hirenova.ai';
      await jobService.updateApplicationWithDetails(appId, {
        status: newStatus,
        recruiterEmail: currentRecruiterEmail
      });
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
    } catch (e) {
      setToast({ type: 'error', text: "Failed to update candidate status." });
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleScheduleInterviewSubmit = async (e) => {
    e.preventDefault();
    if (!interviewModalApp) return;
    setUpdatingStatusId(interviewModalApp.id);
    try {
      const currentRecruiterEmail = (JSON.parse(localStorage.getItem('user') || '{}')).email || 'recruiter@hirenova.ai';
      await jobService.updateApplicationWithDetails(interviewModalApp.id, {
        status: 'INTERVIEW_SCHEDULED',
        recruiterEmail: currentRecruiterEmail,
        interviewDate: interviewForm.interviewDate || new Date(Date.now() + 86400000).toISOString().slice(0, 16),
        roundName: interviewForm.roundName,
        interviewerName: interviewForm.interviewerName,
        meetingLink: interviewForm.meetingLink,
        interviewPlan: interviewForm.interviewPlan,
        notes: interviewForm.notes
      });

      setApplications(prev => prev.map(a => a.id === interviewModalApp.id ? {
        ...a,
        status: 'INTERVIEW_SCHEDULED',
        interviewDate: interviewForm.interviewDate,
        roundName: interviewForm.roundName,
        interviewerName: interviewForm.interviewerName,
        meetingLink: interviewForm.meetingLink,
        interviewPlan: interviewForm.interviewPlan,
        notes: interviewForm.notes
      } : a));

      setInterviewModalApp(null);
      setToast({ type: 'success', text: 'Interview scheduled and calendar invitation sent.' });
    } catch (err) {
      setToast({ type: 'error', text: 'Failed to schedule interview: ' + (err.response?.data?.message || err.message) });
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleAssignAssessmentSubmit = async (e) => {
    e.preventDefault();
    if (!assessmentModalApp) return;
    setUpdatingStatusId(assessmentModalApp.id);
    try {
      const currentRecruiterEmail = (JSON.parse(localStorage.getItem('user') || '{}')).email || 'recruiter@hirenova.ai';
      await jobService.updateApplicationWithDetails(assessmentModalApp.id, {
        status: 'ASSESSMENT_SENT',
        recruiterEmail: currentRecruiterEmail,
        assessmentTitle: assessmentForm.assessmentTitle,
        assessmentLink: assessmentForm.assessmentLink,
        assessmentDeadline: assessmentForm.assessmentDeadline,
        notes: assessmentForm.notes
      });

      setApplications(prev => prev.map(a => a.id === assessmentModalApp.id ? {
        ...a,
        status: 'ASSESSMENT_SENT',
        assessmentTitle: assessmentForm.assessmentTitle,
        assessmentLink: assessmentForm.assessmentLink,
        assessmentDeadline: assessmentForm.assessmentDeadline,
        notes: assessmentForm.notes
      } : a));

      setAssessmentModalApp(null);
      setToast({ type: 'success', text: 'Technical assessment sent to candidate.' });
    } catch (err) {
      setToast({ type: 'error', text: 'Failed to assign assessment: ' + (err.response?.data?.message || err.message) });
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackModalApp) return;
    setUpdatingStatusId(feedbackModalApp.id);
    try {
      const currentRecruiterEmail = (JSON.parse(localStorage.getItem('user') || '{}')).email || 'recruiter@hirenova.ai';
      let statusToSet = feedbackModalApp.status;
      if (feedbackForm.decision === 'OFFER') statusToSet = 'HIRED';
      else if (feedbackForm.decision === 'REJECT') statusToSet = 'REJECTED';

      const payload = {
        decision: feedbackForm.decision === 'OFFER' ? 'HIRE' : feedbackForm.decision,
        status: statusToSet,
        recruiterEmail: currentRecruiterEmail,
        technicalScore: feedbackForm.technicalScore,
        communicationScore: feedbackForm.communicationScore,
        problemSolvingScore: feedbackForm.problemSolvingScore,
        culturalFitScore: feedbackForm.culturalFitScore,
        recommendation: feedbackForm.recommendation,
        strengths: feedbackForm.strengths,
        areasForImprovement: feedbackForm.areasForImprovement,
        interviewerFeedback: feedbackForm.interviewerFeedback,
        offeredDesignation: feedbackForm.offeredDesignation || selectedJob?.title || 'Software Engineer',
        offeredCtc: feedbackForm.offeredCtc,
        joiningDate: feedbackForm.joiningDate || new Date(Date.now() + 30*86400000).toISOString().slice(0, 10),
        offerLetterNotes: feedbackForm.offerLetterNotes
      };

      await jobService.submitHiringDecision(feedbackModalApp.id, payload);

      setApplications(prev => prev.map(a => a.id === feedbackModalApp.id ? {
        ...a,
        ...payload,
        status: statusToSet
      } : a));

      setFeedbackModalApp(null);
      setToast({ type: 'success', text: 'Scorecard evaluation & offer decision recorded.' });
    } catch (err) {
      setToast({ type: 'error', text: "Failed to record scorecard / decision: " + (err.response?.data?.message || err.message) });
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleRunGapAnalysis = async (app) => {
    setGapModalApp(app);
    setGapLoading(true);
    setGapData(null);
    try {
      const candidateProfile = candidateProfiles[app.userId];
      const resumeText = candidateProfile?.extractedText || candidateProfile?.aiSummary || (candidateProfile?.parsed ? JSON.stringify(candidateProfile.parsed) : 'Candidate resume with technical software engineering background.');
      const res = await jobService.optimizeResumeText(selectedJob?.description || selectedJob?.title, resumeText);
      setGapData(res);
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', text: "AI Gap Analysis failed. Ensure ai-service is running on port 8000." });
    } finally {
      setGapLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      <div>
        <h3 className="text-xl font-light text-white tracking-tight">Recruitment Pipeline & Candidate Pool</h3>
        <p className="text-xs text-slate-400 font-light mt-0.5">Shortlist, dispatch assessments, schedule live interviews, and make hiring decisions.</p>
      </div>

      {/* Role Selection Grid */}
      <div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block mb-3">
          1. Select Open Role ({jobs.length} Active Positions)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {jobs.map(job => (
            <button
              key={job.id}
              onClick={() => loadApplications(job)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                selectedJob?.id === job.id
                  ? 'bg-purple-600/10 border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.15)]'
                  : 'bg-[#090b14] border-white/[0.06] hover:border-white/[0.12]'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-normal text-white line-clamp-1">{job.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{job.companyName || 'HireNova Verified'}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                  job.applicantCount > 0 
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                    : 'bg-white/[0.04] text-slate-500'
                }`}>
                  {job.applicantCount || 0} Applied
                </span>
              </div>
              <div className="mt-3 pt-2.5 border-t border-white/[0.04] flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>{job.location || 'Bengaluru'}</span>
                <span>₹ {job.salaryMin || 10}-{job.salaryMax || 18} LPA</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Ranked Candidate Pool for Selected Job */}
      {selectedJob && (
        <div className="pt-4 border-t border-white/[0.06] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400">
                2. Applicant Pool for: {selectedJob.title}
              </span>
              <h4 className="text-sm font-light text-slate-300 mt-0.5">
                Sorted by AI ATS Compatibility & Vector Match
              </h4>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {applications.length} Candidate{applications.length === 1 ? '' : 's'} Evaluated
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center p-12"><Loader className="w-6 h-6 animate-spin text-purple-500" /></div>
          ) : applications.length === 0 ? (
            <div className="ai-card rounded-2xl p-12 text-center text-slate-500 border border-white/[0.06]">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-30 text-purple-400" />
              <p className="text-xs font-light">No candidates have applied to this role yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((app, index) => {
                const profile = candidateProfiles[app.userId];
                const parsed = profile?.parsed;
                const candidateName = formatName(parsed?.name, `Candidate #${app.userId}`, parsed?.email);

                return (
                  <div 
                    key={app.id} 
                    className="ai-card p-5 rounded-2xl border border-white/[0.07] hover:border-purple-500/30 transition-all space-y-4"
                  >
                    {/* Top Row: Candidate Details (Left) + Status & Dossier (Right) */}
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      {/* Candidate Avatar & Info */}
                      <div className="flex items-start gap-3.5 min-w-0 flex-1">
                        {/* ATS Match Gauge */}
                        <div className="flex flex-col items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20 shrink-0">
                          <span className="text-base font-light text-purple-300 leading-none">
                            {app.atsScore ? Math.round(app.atsScore) : 85}
                          </span>
                          <span className="text-[8px] font-mono text-slate-500 mt-0.5">ATS</span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h5 className="text-sm font-normal text-white truncate">{candidateName}</h5>
                            {index === 0 && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                                ★ Top Match
                              </span>
                            )}
                            {app.status === 'HIRED' && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shrink-0">
                                Offer Extended
                              </span>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-400 font-light">
                            {parsed?.email && (
                              <span className="flex items-center gap-1 truncate max-w-[200px]">
                                <Mail className="w-3 h-3 text-slate-500 shrink-0" /> {parsed.email}
                              </span>
                            )}
                            {parsed?.phone && (
                              <span className="flex items-center gap-1 shrink-0">
                                <Phone className="w-3 h-3 text-slate-500 shrink-0" /> {parsed.phone}
                              </span>
                            )}
                            {parsed?.total_experience_years !== undefined && (
                              <span className="flex items-center gap-1 shrink-0">
                                <Clock className="w-3 h-3 text-slate-500 shrink-0" /> {parsed.total_experience_years} Yrs Exp
                              </span>
                            )}
                          </div>

                          {/* Top Skills Tags */}
                          {parsed?.skills?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {parsed.skills.slice(0, 5).map(skill => (
                                <span key={skill} className="px-2 py-0.5 bg-[#090b14] border border-white/[0.05] rounded text-[10px] font-mono text-slate-300">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Extra scheduled details if present */}
                          {app.status === 'INTERVIEW_SCHEDULED' && app.interviewDate && (
                            <div className="mt-2 inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-[11px] text-purple-300 font-mono">
                              <Video className="w-3 h-3 text-purple-400" />
                              <span>{app.roundName || 'Interview'}: {new Date(app.interviewDate).toLocaleString()}</span>
                            </div>
                          )}

                          {app.status === 'ASSESSMENT_SENT' && app.assessmentTitle && (
                            <div className="mt-2 inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-[11px] text-cyan-300 font-mono">
                              <Code className="w-3 h-3 text-cyan-400" />
                              <span>{app.assessmentTitle} (Deadline: {app.assessmentDeadline || '48h'})</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Top Right: Status Selector + Dossier Button */}
                      <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
                        <select
                          value={app.status || 'PENDING'}
                          disabled={updatingStatusId === app.id}
                          onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-mono border focus:outline-none transition-colors ${
                            app.status === 'HIRED'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : app.status === 'SHORTLISTED'
                              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                              : app.status === 'INTERVIEW_SCHEDULED'
                              ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                              : app.status === 'ASSESSMENT_SENT'
                              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                              : app.status === 'REJECTED'
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                              : 'bg-[#121524] text-amber-300 border-amber-500/20'
                          }`}
                        >
                          <option value="PENDING" className="bg-[#090b14] text-amber-300">Under Review</option>
                          <option value="SHORTLISTED" className="bg-[#090b14] text-emerald-300">Shortlisted</option>
                          <option value="ASSESSMENT_SENT" className="bg-[#090b14] text-cyan-300">Assessment Sent</option>
                          <option value="INTERVIEW_SCHEDULED" className="bg-[#090b14] text-purple-300">Interview Scheduled</option>
                          <option value="HIRED" className="bg-[#090b14] text-emerald-400">Offer / Hired</option>
                          <option value="REJECTED" className="bg-[#090b14] text-rose-400">Rejected</option>
                        </select>

                        <button
                          onClick={() => setViewingResumeModal({ app, profile })}
                          className="px-3 py-1.5 bg-[#121524] hover:bg-[#1a1f33] text-slate-200 border border-white/[0.06] rounded-xl text-xs font-normal transition-colors flex items-center gap-1.5 shrink-0"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-400" /> Dossier
                        </button>
                      </div>
                    </div>

                    {/* Bottom Action Bar: Responsive Toolbar with No Overflow */}
                    <div className="pt-3 border-t border-white/[0.05] flex flex-wrap items-center justify-between gap-2.5">
                      {/* Evaluation status telemetry */}
                      <div className="flex items-center gap-2">
                        {app.technicalScore && (
                          <span className="text-[11px] font-mono text-amber-300/90 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20 flex items-center gap-1">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400/30" />
                            Scorecard: {app.technicalScore}/5
                          </span>
                        )}
                        {app.offeredCtc && (
                          <span className="text-[11px] font-mono text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                            CTC: ₹ {app.offeredCtc} LPA
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2">
                        {/* AI Fit & Gap Analysis */}
                        <button
                          onClick={() => handleRunGapAnalysis(app)}
                          title="AI Candidate Fit & ATS Skill Gap Analysis"
                          className="px-2.5 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 rounded-xl text-xs font-light transition-colors flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                          <span>AI Gap</span>
                        </button>

                        {/* Assign Assessment */}
                        <button
                          onClick={() => {
                            setAssessmentModalApp(app);
                            setAssessmentForm({
                              assessmentTitle: 'Full-Stack Technical Challenge',
                              assessmentLink: 'https://codesignal.com/assessment/hirenova-challenge',
                              assessmentDeadline: '48 Hours from receipt',
                              notes: 'Please submit your solution repository and test outputs.'
                            });
                          }}
                          title="Assign Technical Assessment"
                          className="px-2.5 py-1.5 bg-[#121524] hover:bg-cyan-600/20 text-cyan-300 border border-white/[0.06] hover:border-cyan-500/30 rounded-xl text-xs font-light transition-colors flex items-center gap-1.5"
                        >
                          <Code className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Assessment</span>
                        </button>

                        {/* Schedule Interview */}
                        <button
                          onClick={() => {
                            setInterviewModalApp(app);
                            setInterviewForm({
                              interviewDate: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
                              roundName: 'Technical Round 1',
                              interviewerName: 'Lead Architect',
                              meetingLink: 'https://meet.google.com/hirenova-room',
                              interviewPlan: '1. Candidate Intro & Architecture (15m)\n2. Problem Solving & Live Code (30m)\n3. Culture & Q&A (15m)',
                              notes: 'System architecture review and algorithms discussion.'
                            });
                          }}
                          title="Schedule Live Interview"
                          className="px-2.5 py-1.5 bg-[#121524] hover:bg-purple-600/20 text-purple-300 border border-white/[0.06] hover:border-purple-500/30 rounded-xl text-xs font-light transition-colors flex items-center gap-1.5"
                        >
                          <Video className="w-3.5 h-3.5 text-purple-400" />
                          <span>Schedule</span>
                        </button>

                        {/* Scorecard & Offer */}
                        <button
                          onClick={() => {
                            setFeedbackModalApp(app);
                            setFeedbackForm({
                              technicalScore: app.technicalScore || 4,
                              communicationScore: app.communicationScore || 4,
                              problemSolvingScore: app.problemSolvingScore || 4,
                              culturalFitScore: app.culturalFitScore || 5,
                              recommendation: app.recommendation || 'HIRE',
                              strengths: app.strengths || '',
                              areasForImprovement: app.areasForImprovement || '',
                              interviewerFeedback: app.interviewerFeedback || '',
                              decision: app.status === 'HIRED' ? 'OFFER' : 'OFFER',
                              offeredDesignation: app.offeredDesignation || selectedJob?.title || 'Software Engineer',
                              offeredCtc: app.offeredCtc || selectedJob?.salaryMax || 18.0,
                              joiningDate: app.joiningDate || new Date(Date.now() + 30*86400000).toISOString().slice(0, 10),
                              offerLetterNotes: app.offerLetterNotes || 'We were thoroughly impressed with your technical acumen and problem solving. We are pleased to extend this official offer.'
                            });
                          }}
                          title="Scorecard & Employment Offer"
                          className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-medium transition-all shadow-[0_0_12px_rgba(16,185,129,0.15)] flex items-center gap-1.5"
                        >
                          <Award className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Scorecard & Offer</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SCHEDULE INTERVIEW MODAL */}
      {interviewModalApp && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md" onClick={() => setInterviewModalApp(null)}>
          <div className="ai-card-glow rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-white/[0.1] shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between pb-4 mb-4 border-b border-white/[0.07]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400">Real Hiring Flow</span>
                <h3 className="text-xl font-normal text-white mt-1">Schedule Candidate Interview</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Target Candidate #{interviewModalApp.userId} • {selectedJob?.title}
                </p>
              </div>
              <button onClick={() => setInterviewModalApp(null)} className="text-slate-500 hover:text-white p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleInterviewSubmit} className="space-y-4 text-xs font-light">
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Interview Round Title</label>
                <input 
                  type="text"
                  required
                  value={interviewForm.roundName}
                  onChange={e => setInterviewForm({ ...interviewForm, roundName: e.target.value })}
                  placeholder="e.g. Technical Round 1, System Design, HR Discussion"
                  className="w-full px-3.5 py-2.5 bg-[#090b14] border border-white/[0.08] rounded-xl text-slate-200 focus:outline-none focus:border-purple-500/40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Date & Time</label>
                  <input 
                    type="datetime-local"
                    required
                    value={interviewForm.interviewDate}
                    onChange={e => setInterviewForm({ ...interviewForm, interviewDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#090b14] border border-white/[0.08] rounded-xl text-slate-200 focus:outline-none focus:border-purple-500/40"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Interviewer Name</label>
                  <input 
                    type="text"
                    required
                    value={interviewForm.interviewerName}
                    onChange={e => setInterviewForm({ ...interviewForm, interviewerName: e.target.value })}
                    placeholder="e.g. Senior Tech Lead"
                    className="w-full px-3.5 py-2.5 bg-[#090b14] border border-white/[0.08] rounded-xl text-slate-200 focus:outline-none focus:border-purple-500/40"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Video Meeting URL (Google Meet / Zoom)</label>
                <input 
                  type="url"
                  required
                  value={interviewForm.meetingLink}
                  onChange={e => setInterviewForm({ ...interviewForm, meetingLink: e.target.value })}
                  placeholder="https://meet.google.com/abc-def-ghi"
                  className="w-full px-3.5 py-2.5 bg-[#090b14] border border-white/[0.08] rounded-xl text-slate-200 focus:outline-none focus:border-purple-500/40 font-mono"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-mono text-slate-400">Structured Interview Plan & Agenda</label>
                  <span className="text-[10px] text-purple-400 font-mono">Real-time Candidate Telemetry</span>
                </div>
                <textarea 
                  rows="3"
                  value={interviewForm.interviewPlan}
                  onChange={e => setInterviewForm({ ...interviewForm, interviewPlan: e.target.value })}
                  placeholder="Phase-by-phase breakdown of interview topics and duration..."
                  className="w-full px-3.5 py-2.5 bg-[#090b14] border border-white/[0.08] rounded-xl text-slate-200 focus:outline-none focus:border-purple-500/40 font-mono text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Notes / Candidate Agenda</label>
                <textarea 
                  rows="2"
                  value={interviewForm.notes}
                  onChange={e => setInterviewForm({ ...interviewForm, notes: e.target.value })}
                  placeholder="Topics to prepare, portfolio links, etc."
                  className="w-full px-3.5 py-2.5 bg-[#090b14] border border-white/[0.08] rounded-xl text-slate-200 focus:outline-none focus:border-purple-500/40"
                />
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex justify-end gap-2.5">
                <button 
                  type="button"
                  onClick={() => setInterviewModalApp(null)}
                  className="px-4 py-2 bg-[#121524] text-slate-300 rounded-xl text-xs transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={updatingStatusId === interviewModalApp.id}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-normal transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] flex items-center gap-1.5"
                >
                  {updatingStatusId === interviewModalApp.id ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Video className="w-3.5 h-3.5" />}
                  Confirm & Transmit Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Candidate Fit & Gap Analysis Modal (Feature 5) */}
      {gapModalApp && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md" onClick={() => setGapModalApp(null)}>
          <div className="ai-card-glow rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-white/[0.1] shadow-2xl relative max-h-[88vh] overflow-y-auto space-y-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between pb-3 border-b border-white/[0.07]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400">AI ATS Skill Gap Analysis</span>
                <h3 className="text-lg font-medium text-white mt-1">
                  Candidate Fit Assessment: {formatName(candidateProfiles[gapModalApp.userId]?.parsed?.name, `Candidate #${gapModalApp.userId}`)}
                </h3>
                <p className="text-xs text-slate-400 font-light">
                  Target Role: {selectedJob?.title}
                </p>
              </div>
              <button onClick={() => setGapModalApp(null)} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/[0.05]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {gapLoading ? (
              <div className="py-12 text-center space-y-3">
                <Loader className="w-7 h-7 mx-auto animate-spin text-purple-400" />
                <p className="text-xs text-slate-300 font-light">Analyzing resume against job requirements with Groq AI...</p>
              </div>
            ) : gapData ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#090b14] border border-white/[0.06] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Match Score</span>
                    <h4 className="text-xl font-bold font-mono text-emerald-400">{gapData.match_score || 80}%</h4>
                    <span className="text-xs text-slate-300">{gapData.match_level || 'High Match'}</span>
                  </div>
                  <div className="max-w-xs text-right">
                    <span className="text-[10px] font-mono text-purple-400 uppercase">Recommendation</span>
                    <p className="text-xs text-slate-300 font-light mt-0.5">{gapData.executive_summary}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-rose-500/[0.04] border border-rose-500/20 space-y-2">
                  <h5 className="text-xs font-medium text-rose-300 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" /> Missing Skills / Qualifications
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {gapData.missing_critical_skills && gapData.missing_critical_skills.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[11px] font-mono">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-500/[0.04] border border-emerald-500/20 space-y-2">
                  <h5 className="text-xs font-medium text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" /> Aligned Candidate Competencies
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {gapData.matching_skills && gapData.matching_skills.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-mono">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            <div className="pt-3 border-t border-white/[0.07] flex justify-end">
              <button onClick={() => setGapModalApp(null)} className="px-4 py-2 bg-[#121524] text-slate-200 rounded-xl text-xs">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post-Interview Feedback & Hiring Decision Modal (Feature 1) */}
      {feedbackModalApp && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md" onClick={() => setFeedbackModalApp(null)}>
          <div className="ai-card-glow rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-white/[0.1] shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between pb-3 border-b border-white/[0.07]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">Recruiter Evaluation & Final Decision</span>
                <h3 className="text-lg font-medium text-white mt-1">
                  Scorecard: {formatName(candidateProfiles[feedbackModalApp.userId]?.parsed?.name, `Candidate #${feedbackModalApp.userId}`)}
                </h3>
                <p className="text-xs text-slate-400 font-light">
                  Target Role: {selectedJob?.title}
                </p>
              </div>
              <button onClick={() => setFeedbackModalApp(null)} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/[0.05]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              
              {/* Ratings Matrix (1 to 5) */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-[#090b14] border border-white/[0.05]">
                <div>
                  <label className="text-xs text-slate-300 font-light flex items-center justify-between mb-1">
                    <span>Technical Acumen</span>
                    <span className="font-mono text-amber-300 font-medium">{feedbackForm.technicalScore}/5</span>
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(score => (
                      <button
                        key={score}
                        type="button"
                        onClick={() => setFeedbackForm({ ...feedbackForm, technicalScore: score })}
                        className={`flex-1 py-1 rounded-lg text-xs font-mono border transition-colors ${feedbackForm.technicalScore >= score ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-white/[0.02] border-white/[0.06] text-slate-500'}`}
                      >
                        {score}★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-light flex items-center justify-between mb-1">
                    <span>Communication</span>
                    <span className="font-mono text-purple-300 font-medium">{feedbackForm.communicationScore}/5</span>
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(score => (
                      <button
                        key={score}
                        type="button"
                        onClick={() => setFeedbackForm({ ...feedbackForm, communicationScore: score })}
                        className={`flex-1 py-1 rounded-lg text-xs font-mono border transition-colors ${feedbackForm.communicationScore >= score ? 'bg-purple-500/20 border-purple-500/40 text-purple-300' : 'bg-white/[0.02] border-white/[0.06] text-slate-500'}`}
                      >
                        {score}★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-light flex items-center justify-between mb-1">
                    <span>Problem Solving</span>
                    <span className="font-mono text-cyan-300 font-medium">{feedbackForm.problemSolvingScore}/5</span>
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(score => (
                      <button
                        key={score}
                        type="button"
                        onClick={() => setFeedbackForm({ ...feedbackForm, problemSolvingScore: score })}
                        className={`flex-1 py-1 rounded-lg text-xs font-mono border transition-colors ${feedbackForm.problemSolvingScore >= score ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300' : 'bg-white/[0.02] border-white/[0.06] text-slate-500'}`}
                      >
                        {score}★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-light flex items-center justify-between mb-1">
                    <span>Cultural Fit</span>
                    <span className="font-mono text-emerald-300 font-medium">{feedbackForm.culturalFitScore}/5</span>
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(score => (
                      <button
                        key={score}
                        type="button"
                        onClick={() => setFeedbackForm({ ...feedbackForm, culturalFitScore: score })}
                        className={`flex-1 py-1 rounded-lg text-xs font-mono border transition-colors ${feedbackForm.culturalFitScore >= score ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-white/[0.02] border-white/[0.06] text-slate-500'}`}
                      >
                        {score}★
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommendation & Strengths */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-light block mb-1">Overall Recommendation</label>
                  <select
                    value={feedbackForm.recommendation}
                    onChange={e => setFeedbackForm({ ...feedbackForm, recommendation: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090b14] border border-white/[0.08] rounded-xl text-xs text-white"
                  >
                    <option value="STRONG_HIRE">Strong Hire</option>
                    <option value="HIRE">Hire</option>
                    <option value="NEUTRAL">Neutral / Hold</option>
                    <option value="NO_HIRE">Do Not Hire</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-light block mb-1">Decision Pathway</label>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setFeedbackForm({ ...feedbackForm, decision: 'OFFER' })}
                      className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-colors ${feedbackForm.decision === 'OFFER' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-[#090b14] text-slate-400 border-white/[0.06]'}`}
                    >
                      Make Offer
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeedbackForm({ ...feedbackForm, decision: 'REJECT' })}
                      className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-colors ${feedbackForm.decision === 'REJECT' ? 'bg-rose-600 text-white border-rose-500' : 'bg-[#090b14] text-slate-400 border-white/[0.06]'}`}
                    >
                      Decline
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeedbackForm({ ...feedbackForm, decision: 'FEEDBACK_ONLY' })}
                      className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-colors ${feedbackForm.decision === 'FEEDBACK_ONLY' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-[#090b14] text-slate-400 border-white/[0.06]'}`}
                    >
                      Log Only
                    </button>
                  </div>
                </div>
              </div>

              {/* Strengths & Improvement */}
              <div className="space-y-2 text-xs">
                <div>
                  <label className="text-slate-300 font-light block mb-1">Demonstrated Strengths</label>
                  <input
                    type="text"
                    value={feedbackForm.strengths}
                    onChange={e => setFeedbackForm({ ...feedbackForm, strengths: e.target.value })}
                    placeholder="e.g. Exceptional knowledge of concurrent Java threads, clean coding style"
                    className="w-full px-3 py-2 bg-[#090b14] border border-white/[0.08] rounded-xl text-slate-200"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-light block mb-1">Panel Evaluation & Feedback Notes</label>
                  <textarea
                    rows={2}
                    value={feedbackForm.interviewerFeedback}
                    onChange={e => setFeedbackForm({ ...feedbackForm, interviewerFeedback: e.target.value })}
                    placeholder="General comments and technical impressions..."
                    className="w-full px-3 py-2 bg-[#090b14] border border-white/[0.08] rounded-xl text-slate-200"
                  />
                </div>
              </div>

              {/* Offer Letter Specific Inputs if Decision === 'OFFER' */}
              {feedbackForm.decision === 'OFFER' && (
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
                  <h4 className="text-xs font-medium text-emerald-300 flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5" /> Official Employment Offer Details
                  </h4>
                  <div className="grid sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-300 block mb-1">Designation</label>
                      <input
                        type="text"
                        value={feedbackForm.offeredDesignation}
                        onChange={e => setFeedbackForm({ ...feedbackForm, offeredDesignation: e.target.value })}
                        placeholder="e.g. Senior Backend Engineer"
                        className="w-full px-2.5 py-1.5 bg-[#090b14] border border-white/[0.08] rounded-xl text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-300 block mb-1">Offered CTC (₹ LPA)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={feedbackForm.offeredCtc}
                        onChange={e => setFeedbackForm({ ...feedbackForm, offeredCtc: e.target.value })}
                        placeholder="18.0"
                        className="w-full px-2.5 py-1.5 bg-[#090b14] border border-white/[0.08] rounded-xl text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-300 block mb-1">Target Joining Date</label>
                      <input
                        type="date"
                        value={feedbackForm.joiningDate}
                        onChange={e => setFeedbackForm({ ...feedbackForm, joiningDate: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-[#090b14] border border-white/[0.08] rounded-xl text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-300 block mb-1">Offer Letter Terms / Welcome Message</label>
                    <textarea
                      rows={2}
                      value={feedbackForm.offerLetterNotes}
                      onChange={e => setFeedbackForm({ ...feedbackForm, offerLetterNotes: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-[#090b14] border border-white/[0.08] rounded-xl text-xs text-slate-200"
                    />
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-white/[0.07] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setFeedbackModalApp(null)}
                  className="px-4 py-2 bg-[#121524] text-slate-300 rounded-xl text-xs hover:bg-[#1a1f33]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingStatusId === feedbackModalApp.id}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-medium transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-1.5"
                >
                  {updatingStatusId === feedbackModalApp.id ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>{feedbackForm.decision === 'OFFER' ? 'Release Offer' : feedbackForm.decision === 'REJECT' ? 'Confirm Decline' : 'Save Scorecard'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ASSIGN ASSESSMENT MODAL */}
      {assessmentModalApp && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md" onClick={() => setAssessmentModalApp(null)}>
          <div className="ai-card-glow rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-white/[0.1] shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between pb-4 mb-4 border-b border-white/[0.07]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">Technical Evaluation</span>
                <h3 className="text-xl font-normal text-white mt-1">Assign Technical Assessment</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Candidate #{assessmentModalApp.userId} • {selectedJob?.title}
                </p>
              </div>
              <button onClick={() => setAssessmentModalApp(null)} className="text-slate-500 hover:text-white p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignAssessmentSubmit} className="space-y-4 text-xs font-light">
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Assessment Challenge Name</label>
                <input 
                  type="text"
                  required
                  value={assessmentForm.assessmentTitle}
                  onChange={e => setAssessmentForm({ ...assessmentForm, assessmentTitle: e.target.value })}
                  placeholder="e.g. Java Microservices & React Coding Challenge"
                  className="w-full px-3.5 py-2.5 bg-[#090b14] border border-white/[0.08] rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500/40"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Challenge Platform Link (HackerRank / CodeSignal / GitHub)</label>
                <input 
                  type="url"
                  required
                  value={assessmentForm.assessmentLink}
                  onChange={e => setAssessmentForm({ ...assessmentForm, assessmentLink: e.target.value })}
                  placeholder="https://codesignal.com/assessment/..."
                  className="w-full px-3.5 py-2.5 bg-[#090b14] border border-white/[0.08] rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500/40 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Submission Deadline / Window</label>
                <input 
                  type="text"
                  required
                  value={assessmentForm.assessmentDeadline}
                  onChange={e => setAssessmentForm({ ...assessmentForm, assessmentDeadline: e.target.value })}
                  placeholder="e.g. 48 Hours or Before Sunday Midnight"
                  className="w-full px-3.5 py-2.5 bg-[#090b14] border border-white/[0.08] rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500/40"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Instructions for Candidate</label>
                <textarea 
                  rows="2"
                  value={assessmentForm.notes}
                  onChange={e => setAssessmentForm({ ...assessmentForm, notes: e.target.value })}
                  placeholder="Provide test repo requirements, time estimates, or tech stack constraints."
                  className="w-full px-3.5 py-2.5 bg-[#090b14] border border-white/[0.08] rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500/40"
                />
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex justify-end gap-2.5">
                <button 
                  type="button"
                  onClick={() => setAssessmentModalApp(null)}
                  className="px-4 py-2 bg-[#121524] text-slate-300 rounded-xl text-xs transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={updatingStatusId === assessmentModalApp.id}
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-normal transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center gap-1.5"
                >
                  {updatingStatusId === assessmentModalApp.id ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  Dispatch Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INSPECT RESUME DOSSIER MODAL */}
      {viewingResumeModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md" onClick={() => setViewingResumeModal(null)}>
          <div className="ai-card-glow rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-white/[0.1] shadow-2xl relative max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between pb-4 mb-4 border-b border-white/[0.07]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400">Verified Dossier</span>
                <h3 className="text-xl font-normal text-white mt-1">
                  {formatName(viewingResumeModal.profile?.parsed?.name, `Candidate #${viewingResumeModal.app.userId}`, viewingResumeModal.profile?.parsed?.email)}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Applied for {selectedJob?.title} • ATS Match: {Math.round(viewingResumeModal.app.atsScore || 85)}%
                </p>
              </div>
              <button onClick={() => setViewingResumeModal(null)} className="text-slate-500 hover:text-white p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {viewingResumeModal.profile?.parsed ? (
              <div className="space-y-6 text-xs font-light">
                {/* Contact info row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#090b14] border border-white/[0.05]">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 block mb-1">Email</span>
                    <span className="text-slate-200 truncate block">{viewingResumeModal.profile.parsed.email || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 block mb-1">Phone</span>
                    <span className="text-slate-200">{viewingResumeModal.profile.parsed.phone || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 block mb-1">Experience</span>
                    <span className="text-purple-300 font-mono">{viewingResumeModal.profile.parsed.total_experience_years || 1.1} Years</span>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-2">Technical Competencies</span>
                  <div className="flex flex-wrap gap-1.5">
                    {viewingResumeModal.profile.parsed.skills?.map(s => (
                      <span key={s} className="px-2.5 py-1 rounded bg-purple-500/10 text-purple-300 font-mono border border-purple-500/20">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Experience History */}
                {viewingResumeModal.profile.parsed.experiences?.length > 0 && (
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-2">Work History</span>
                    <div className="space-y-3">
                      {viewingResumeModal.profile.parsed.experiences.map((exp, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-[#090b14] border border-white/[0.05]">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-normal text-white">{exp.role}</span>
                            <span className="text-[10px] font-mono text-purple-400">{exp.duration}</span>
                          </div>
                          <span className="text-xs text-purple-300 block mb-2">{exp.company}</span>
                          <p className="text-slate-400 leading-relaxed">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500">
                <p>Detailed AI summary is currently synchronizing.</p>
              </div>
            )}

            <div className="pt-6 mt-6 border-t border-white/[0.06] flex items-center justify-between">
              <button
                onClick={() => jobService.downloadCandidateResume(viewingResumeModal.app.userId, `${candidateName}_Resume.pdf`)}
                className="px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-normal transition-all flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download Original PDF
              </button>

              <button 
                onClick={() => setViewingResumeModal(null)}
                className="px-4 py-2 bg-[#121524] text-slate-300 rounded-xl text-xs transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastNotification toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};

const InterviewsTab = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [interviewToCancel, setInterviewToCancel] = useState(null);
  const [toast, setToast] = useState(null);

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    applicationId: '',
    candidateId: '',
    roundName: 'Technical Round 1',
    interviewDate: '',
    interviewerName: 'Tech Lead / Architect',
    meetingLink: 'https://meet.google.com/hirenova-room',
    interviewPlan: '1. Technical Fundamentals & Frameworks (20m)\n2. Problem Solving & Live Code (30m)\n3. Culture & Q&A (10m)',
    notes: 'Please review candidate project portfolio.'
  });
  const [submittingSchedule, setSubmittingSchedule] = useState(false);

  const fetchInterviews = () => {
    setLoading(true);
    jobService.getScheduledInterviews()
      .then(res => setInterviews(res || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInterviews();
    jobService.getAllJobs().then(res => setJobs(res || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedJobId) {
      setCandidates([]);
      return;
    }
    setLoadingCandidates(true);
    jobService.getJobApplications(selectedJobId)
      .then(res => setCandidates(res || []))
      .catch(() => setCandidates([]))
      .finally(() => setLoadingCandidates(false));
  }, [selectedJobId]);

  const confirmCancelInterview = async () => {
    if (!interviewToCancel) return;
    setCancellingId(interviewToCancel.id);
    try {
      await jobService.cancelInterview(interviewToCancel.id);
      setInterviews(prev => prev.filter(i => i.id !== interviewToCancel.id));
      setToast({ type: 'success', text: 'Interview round cancelled. Candidate was reverted to Shortlisted.' });
      setInterviewToCancel(null);
    } catch (err) {
      setToast({ type: 'error', text: 'Failed to cancel interview: ' + (err.response?.data?.message || err.message) });
    } finally {
      setCancellingId(null);
    }
  };

  const handleQuickScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!scheduleForm.applicationId) {
      setToast({ type: 'error', text: 'Please select a candidate to schedule.' });
      return;
    }
    setSubmittingSchedule(true);
    try {
      const currentRecruiterEmail = (JSON.parse(localStorage.getItem('user') || '{}')).email || 'recruiter@hirenova.ai';
      await jobService.updateApplicationWithDetails(scheduleForm.applicationId, {
        status: 'INTERVIEW_SCHEDULED',
        recruiterEmail: currentRecruiterEmail,
        interviewDate: scheduleForm.interviewDate || new Date(Date.now() + 86400000).toISOString().slice(0, 16),
        roundName: scheduleForm.roundName,
        interviewerName: scheduleForm.interviewerName,
        meetingLink: scheduleForm.meetingLink,
        interviewPlan: scheduleForm.interviewPlan,
        notes: scheduleForm.notes
      });
      setShowScheduleModal(false);
      fetchInterviews();
      setToast({ type: 'success', text: 'Interview scheduled successfully!' });
    } catch (err) {
      setToast({ type: 'error', text: 'Failed to schedule interview: ' + (err.response?.data?.message || err.message) });
    } finally {
      setSubmittingSchedule(false);
    }
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-light text-white tracking-tight">Scheduled Interviews</h3>
          <p className="text-xs text-slate-400 font-light mt-0.5">Manage confirmed candidate panels, join video calls, or plan new rounds.</p>
        </div>
        <button 
          onClick={() => setShowScheduleModal(true)}
          className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-light transition-all shadow-[0_0_12px_rgba(168,85,247,0.3)] flex items-center gap-1.5 w-fit"
        >
          <Plus className="w-3.5 h-3.5" /> Schedule Interview
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-16"><Loader className="w-6 h-6 animate-spin text-purple-500" /></div>
      ) : interviews.length === 0 ? (
        <div className="ai-card rounded-2xl p-12 text-center border border-white/[0.06] max-w-2xl mx-auto">
          <Calendar className="w-10 h-10 mx-auto mb-2 opacity-30 text-purple-400" />
          <h3 className="text-sm font-normal text-white mb-1">No Active Interviews Scheduled</h3>
          <p className="text-xs text-slate-400 font-light mb-3 max-w-md mx-auto">
            Plan and schedule candidate video technical rounds directly from here or the Applicant Pool.
          </p>
          <button 
            onClick={() => setShowScheduleModal(true)}
            className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-light transition-all"
          >
            + Schedule First Interview
          </button>
        </div>
      ) : (
        <div className="grid gap-3">
          {interviews.map(inv => (
            <div key={inv.id} className="ai-card p-4 rounded-xl border border-white/[0.06] hover:border-purple-500/30 transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-normal text-white">{inv.roundName || 'Technical Interview'}</h4>
                  <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    Confirmed
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Candidate #{inv.userId} • <span className="text-purple-300 font-normal">{inv.jobTitle}</span> ({inv.companyName || 'HireNova'})
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[11px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1 text-slate-300">
                    <Clock className="w-3 h-3 text-purple-400" />
                    {inv.interviewDate ? new Date(inv.interviewDate).toLocaleString() : 'Date pending'}
                  </span>
                  {inv.interviewerName && (
                    <span>Lead: {inv.interviewerName}</span>
                  )}
                </div>
                {inv.interviewPlan && (
                  <div className="mt-2 p-2 bg-[#090b14] border border-white/[0.04] rounded-lg text-[11px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-w-xl">
                    {inv.interviewPlan}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {inv.meetingLink && (
                  <a 
                    href={inv.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-light transition-all shadow-[0_0_12px_rgba(168,85,247,0.3)] flex items-center gap-1.5"
                  >
                    <Video className="w-3.5 h-3.5" /> Join Room <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                <button
                  onClick={(e) => {
                    if (e) e.stopPropagation();
                    setInterviewToCancel(inv);
                  }}
                  disabled={cancellingId === inv.id}
                  className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-light transition-colors flex items-center gap-1"
                  title="Cancel Interview"
                >
                  {cancellingId === inv.id ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QUICK SCHEDULE MODAL */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md" onClick={() => setShowScheduleModal(false)}>
          <div className="ai-card-glow rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-white/[0.1] shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between pb-3 mb-4 border-b border-white/[0.07]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400">Interview Operations</span>
                <h3 className="text-base font-normal text-white mt-0.5">Schedule Candidate Interview</h3>
              </div>
              <button onClick={() => setShowScheduleModal(false)} className="text-slate-500 hover:text-white p-1 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleQuickScheduleSubmit} className="space-y-3.5 text-xs font-light">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Select Job Position</label>
                  <select
                    required
                    value={selectedJobId}
                    onChange={e => setSelectedJobId(e.target.value)}
                    className="w-full px-3 py-2 bg-[#090b14] border border-white/[0.08] rounded-xl text-slate-200 focus:outline-none focus:border-purple-500/40"
                  >
                    <option value="">-- Choose Position --</option>
                    {jobs.map(j => (
                      <option key={j.id} value={j.id}>{j.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Select Candidate</label>
                  <select
                    required
                    disabled={!selectedJobId || loadingCandidates}
                    value={scheduleForm.applicationId}
                    onChange={e => {
                      const appId = e.target.value;
                      const c = candidates.find(item => item.id.toString() === appId);
                      setScheduleForm({
                        ...scheduleForm,
                        applicationId: appId,
                        candidateId: c ? c.userId : ''
                      });
                    }}
                    className="w-full px-3 py-2 bg-[#090b14] border border-white/[0.08] rounded-xl text-slate-200 focus:outline-none focus:border-purple-500/40 disabled:opacity-50"
                  >
                    <option value="">{loadingCandidates ? 'Loading...' : '-- Choose Candidate --'}</option>
                    {candidates.map(c => (
                      <option key={c.id} value={c.id}>Candidate #{c.userId} ({c.status})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Interview Round Title</label>
                <input 
                  type="text"
                  required
                  value={scheduleForm.roundName}
                  onChange={e => setScheduleForm({ ...scheduleForm, roundName: e.target.value })}
                  placeholder="e.g. Technical Round 1, System Design"
                  className="w-full px-3 py-2 bg-[#090b14] border border-white/[0.08] rounded-xl text-slate-200 focus:outline-none focus:border-purple-500/40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Date & Time</label>
                  <input 
                    type="datetime-local"
                    required
                    value={scheduleForm.interviewDate}
                    onChange={e => setScheduleForm({ ...scheduleForm, interviewDate: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090b14] border border-white/[0.08] rounded-xl text-slate-200 focus:outline-none focus:border-purple-500/40"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Interviewer Name</label>
                  <input 
                    type="text"
                    required
                    value={scheduleForm.interviewerName}
                    onChange={e => setScheduleForm({ ...scheduleForm, interviewerName: e.target.value })}
                    placeholder="e.g. Senior Tech Lead"
                    className="w-full px-3 py-2 bg-[#090b14] border border-white/[0.08] rounded-xl text-slate-200 focus:outline-none focus:border-purple-500/40"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Meeting Link (Google Meet / Zoom)</label>
                <input 
                  type="url"
                  required
                  value={scheduleForm.meetingLink}
                  onChange={e => setScheduleForm({ ...scheduleForm, meetingLink: e.target.value })}
                  placeholder="https://meet.google.com/abc-def"
                  className="w-full px-3 py-2 bg-[#090b14] border border-white/[0.08] rounded-xl text-slate-200 focus:outline-none focus:border-purple-500/40 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Structured Interview Agenda</label>
                <textarea 
                  rows="2"
                  value={scheduleForm.interviewPlan}
                  onChange={e => setScheduleForm({ ...scheduleForm, interviewPlan: e.target.value })}
                  className="w-full px-3 py-2 bg-[#090b14] border border-white/[0.08] rounded-xl text-slate-200 focus:outline-none focus:border-purple-500/40 font-mono text-[11px]"
                />
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex justify-end gap-2">
                <button 
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-3.5 py-1.5 bg-[#121524] text-slate-300 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={submittingSchedule}
                  className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-light transition-all shadow-[0_0_12px_rgba(168,85,247,0.3)] flex items-center gap-1.5"
                >
                  {submittingSchedule ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Video className="w-3.5 h-3.5" />}
                  Schedule Interview
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Interview Confirmation Modal Popup */}
      <ConfirmModal
        isOpen={Boolean(interviewToCancel)}
        onClose={() => !cancellingId && setInterviewToCancel(null)}
        onConfirm={confirmCancelInterview}
        title="Cancel Scheduled Interview"
        message={`Are you sure you want to cancel the interview round (${interviewToCancel?.roundName || 'Technical Round'}) for ${interviewToCancel?.candidateName || 'this candidate'}? Their status will be reverted to Shortlisted.`}
        confirmText="Cancel Interview"
        confirmStyle="amber"
        loading={Boolean(cancellingId)}
      />

      <ToastNotification toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};

const SidebarItem = ({ icon: Icon, label, active, onClick, collapsed }) => (
  <button 
    onClick={onClick} 
    title={collapsed ? label : ""}
    className={`w-full flex items-center p-2.5 rounded-xl transition-all text-xs font-normal ${
      active 
        ? 'bg-purple-600/20 border border-purple-500/30 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.15)]' 
        : 'text-slate-400 hover:bg-white/[0.03] hover:text-slate-200'
    } ${collapsed ? 'justify-center' : 'gap-3 px-3.5'}`}
  >
    <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-purple-300' : 'text-slate-500'}`} /> 
    {!collapsed && <span>{label}</span>}
  </button>
);

export default RecruiterDashboard;
