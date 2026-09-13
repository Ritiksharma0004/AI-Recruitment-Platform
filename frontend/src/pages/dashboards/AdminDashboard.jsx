import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, LogOut, CheckSquare, Users, ShieldAlert, Activity, Loader, Mail, User, ArrowRight, Briefcase, Menu, X, Lock, Cpu, Database, Server, Clock, FileText, Upload, Download, ChevronDown, ChevronUp, Sparkles, Trash2, Video, ExternalLink, Layers } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../../services/authService';
import { jobService } from '../../services/jobService';
import { ConfirmModal, ToastNotification } from '../../components/ConfirmModal';
import { apiClient } from '../../services/api';

const AdminDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  const setActiveTab = (tab) => setSearchParams({ tab });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const rawUsername = user?.username || user?.user?.username || 'Admin';
  const username = rawUsername.charAt(0).toUpperCase() + rawUsername.slice(1);
  const email = user?.email || user?.user?.email || 'admin@hirenova.com';

  return (
    <div className="min-h-screen bg-[#07080d] text-slate-200 flex font-sans selection:bg-emerald-500/30 selection:text-emerald-200 relative overflow-hidden bg-ai-grid">
      
      {/* Radial ambient glow */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[300px] bg-emerald-600/5 blur-[150px] rounded-full pointer-events-none -z-10" />

      {/* Mobile Backdrop */}
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
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center p-0.5 shadow-md shadow-emerald-500/20 shrink-0">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            {!isSidebarCollapsed && (
              <span className="text-base font-medium tracking-tight text-white flex items-center gap-1">
                HireNova <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded">ADMIN</span>
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
            icon={Activity} 
            label="Overview" 
            active={activeTab === 'overview'} 
            onClick={() => { setActiveTab('overview'); setIsSidebarOpen(false); }} 
            collapsed={isSidebarCollapsed} 
          />
          <SidebarItem 
            icon={Users} 
            label="Create Recruiter" 
            active={activeTab === 'create-recruiter'} 
            onClick={() => { setActiveTab('create-recruiter'); setIsSidebarOpen(false); }} 
            collapsed={isSidebarCollapsed} 
          />
          <SidebarItem 
            icon={CheckSquare} 
            label="All Jobs" 
            active={activeTab === 'jobs'} 
            onClick={() => { setActiveTab('jobs'); setIsSidebarOpen(false); }} 
            collapsed={isSidebarCollapsed} 
          />
          <SidebarItem 
            icon={Briefcase} 
            label="All Interviews" 
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

      {/* Main Container */}
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
                {activeTab === 'overview' && 'Cluster Health & Platform Telemetry'}
                {activeTab === 'create-recruiter' && 'Recruiter Provisioning & Security'}
                {activeTab === 'jobs' && 'Global Jobs Catalog & Oversight'}
                {activeTab === 'interviews' && 'Cluster Interview Telemetry'}
                {activeTab === 'profile' && 'Super Administrator Master File'}
              </h2>
              <p className="text-[10px] text-emerald-400 font-mono mt-0.5">Super Administrator Access • All Microservices Online</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl hover:bg-white/[0.04] transition-all border border-white/[0.06] cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-300 flex items-center justify-center font-normal text-xs border border-emerald-500/30">
                  {username.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-normal text-white leading-tight">{username}</p>
                  <p className="text-[10px] font-mono text-emerald-400">Super Administrator</p>
                </div>
              </div>

              <div className="absolute right-0 top-12 mt-1 w-64 ai-card-glow rounded-2xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-white/[0.08] shadow-2xl z-50">
                <div className="mb-3 pb-3 border-b border-white/[0.06]">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1">System Account</p>
                  <p className="text-xs font-normal text-slate-200 break-all">{email}</p>
                </div>
                <button 
                  onClick={() => setActiveTab('profile')} 
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-normal transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                >
                  Admin Security & Profile
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Tab Body */}
        <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto w-full scroll-smooth">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'create-recruiter' && <CreateRecruiterTab />}
          {activeTab === 'jobs' && <GlobalJobsTab />}
          {activeTab === 'interviews' && <GlobalInterviewsTab />}
          {activeTab === 'profile' && <ProfileTab username={username} />}
        </div>
      </main>
    </div>
  );
};



const OverviewTab = () => {
  const [stats, setStats] = useState({ candidates: 0, recruiters: 0, jobs: 0, interviews: 0 });
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [authStats, allJobs, allInterviews] = await Promise.all([
          authService.getAdminStats(),
          jobService.getAllJobs().catch(() => []),
          apiClient.get('/interviews').catch(() => ({ data: [] }))
        ]);
        setStats({ 
          candidates: authStats.totalCandidates || 0, 
          recruiters: authStats.totalRecruiters || 0, 
          jobs: allJobs.length || 0, 
          interviews: allInterviews.data?.length || 0 
        });
        setRecentJobs((allJobs || []).slice(0, 3));
      } catch (err) { } finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="flex justify-center p-16"><Loader className="w-6 h-6 animate-spin text-emerald-500" /></div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div>
        <h3 className="text-xl font-light text-white tracking-tight">Platform Telemetry & Nodes</h3>
        <p className="text-xs text-slate-400 font-light mt-0.5">Real-time microservices state, candidate counts, and active vacancies.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Candidate Profiles" value={stats.candidates} trend="+ Active" />
        <StatCard title="Recruiter Seats" value={stats.recruiters} trend="Enterprise" />
        <StatCard title="Total Roles Deployed" value={stats.jobs} trend="Matching" />
        <StatCard title="Scheduled Interviews" value={stats.interviews} trend="Live" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 pt-2">
        <div className="ai-card p-6 rounded-2xl border border-white/[0.07]">
          <h4 className="text-sm font-normal text-white mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" /> Recent Roles Registered
          </h4>
          {recentJobs.length === 0 ? (
            <p className="text-xs text-slate-500 font-light">No jobs deployed across cluster.</p>
          ) : (
            <div className="space-y-3">
              {recentJobs.map(job => (
                <div key={job.id} className="flex justify-between items-center p-3.5 bg-[#090b14] rounded-xl border border-white/[0.05]">
                  <div>
                    <p className="text-xs font-normal text-slate-200">
                      {job.title} <span className="text-emerald-400 font-mono text-[11px] ml-1">({job.companyName})</span>
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">{job.location || 'Remote'}</p>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                    Active
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="ai-card p-6 rounded-2xl border border-white/[0.07]">
          <h4 className="text-sm font-normal text-white mb-4 flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-400" /> Microservices Cluster Status
          </h4>
          <div className="space-y-3">
            <HealthRow icon={Database} name="MySQL Relational Store (3306)" status="Operational" />
            <HealthRow icon={Cpu} name="FastAPI AI Engine (8000 • Groq Llama)" status="Inference Ready" />
            <HealthRow icon={Activity} name="Spring Cloud Gateway (9090)" status="Routing Active" />
          </div>
        </div>
      </div>
    </div>
  );
};

const HealthRow = ({ icon: Icon, name, status }) => (
  <div className="flex justify-between items-center p-3.5 bg-[#090b14] rounded-xl border border-white/[0.05]">
    <div className="flex items-center gap-2.5">
      <Icon className="w-4 h-4 text-slate-400" />
      <span className="text-xs font-light text-slate-200">{name}</span>
    </div>
    <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded">
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> {status}
    </span>
  </div>
);

const CreateRecruiterTab = () => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      await authService.registerRecruiter(formData);
      setStatus({ type: 'success', msg: 'Recruiter seat provisioned in database.' });
      setFormData({ firstName: '', lastName: '', username: '', email: '', password: '' });
    } catch (err) {
      setStatus({ type: 'error', msg: err.response?.data?.message || err.message || 'Provisioning failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto ai-card rounded-3xl p-6 sm:p-8 border border-white/[0.08] shadow-2xl pb-16">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/[0.06]">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-light text-white tracking-tight">Provision Recruiter Credentials</h3>
          <p className="text-xs text-slate-400 font-light mt-0.5">Grant hiring management credentials to an enterprise client.</p>
        </div>
      </div>

      {status && (
        <div className={`p-3 mb-5 rounded-xl border text-xs font-mono flex items-center gap-2 ${
          status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
        }`}>
          {status.msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">First Name</label>
            <input 
              type="text" 
              required 
              value={formData.firstName} 
              onChange={e => setFormData({...formData, firstName: e.target.value})} 
              className="w-full px-3.5 py-2.5 bg-[#090b14] border border-white/[0.07] rounded-xl text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">Last Name</label>
            <input 
              type="text" 
              required 
              value={formData.lastName} 
              onChange={e => setFormData({...formData, lastName: e.target.value})} 
              className="w-full px-3.5 py-2.5 bg-[#090b14] border border-white/[0.07] rounded-xl text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50" 
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">Username</label>
          <div className="relative">
            <User className="absolute inset-y-0 left-3.5 my-auto w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              required 
              value={formData.username} 
              onChange={e => setFormData({...formData, username: e.target.value})} 
              className="w-full pl-10 pr-4 py-2.5 bg-[#090b14] border border-white/[0.07] rounded-xl text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50" 
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">Email Address</label>
          <div className="relative">
            <Mail className="absolute inset-y-0 left-3.5 my-auto w-4 h-4 text-slate-500" />
            <input 
              type="email" 
              required 
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
              className="w-full pl-10 pr-4 py-2.5 bg-[#090b14] border border-white/[0.07] rounded-xl text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50" 
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">Initial Security Password</label>
          <div className="relative">
            <Lock className="absolute inset-y-0 left-3.5 my-auto w-4 h-4 text-slate-500" />
            <input 
              type="password" 
              required 
              value={formData.password} 
              onChange={e => setFormData({...formData, password: e.target.value})} 
              className="w-full pl-10 pr-4 py-2.5 bg-[#090b14] border border-white/[0.07] rounded-xl text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 font-mono" 
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-normal transition-all shadow-[0_0_20px_rgba(16,185,129,0.25)] flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader className="w-4 h-4 animate-spin"/> : <>Generate Recruiter Credentials <ArrowRight className="w-3.5 h-3.5" /></>}
        </button>
      </form>
    </div>
  );
};

const GlobalJobsTab = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedJobId, setExpandedJobId] = useState(null);
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
      setToast({ type: 'success', text: `Job "${jobToDelete.title}" was permanently removed.` });
      setJobToDelete(null);
    } catch (err) {
      setToast({ type: 'error', text: 'Failed to delete job: ' + (err.response?.data?.message || err.message) });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="ai-card rounded-3xl p-6 sm:p-8 max-w-5xl mx-auto border border-white/[0.08] shadow-2xl pb-16">
      <div className="mb-6 pb-4 border-b border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-light text-white tracking-tight">Global Jobs Oversight</h3>
          <p className="text-xs text-slate-400 font-light mt-0.5">Comprehensive catalog of all job entities in the platform.</p>
        </div>
        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
          {jobs.length} Active Positions
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center p-16"><Loader className="w-6 h-6 animate-spin text-emerald-500" /></div>
      ) : jobs.length === 0 ? (
        <div className="text-center p-12 text-slate-500">
          <CheckSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-xs font-light">No jobs deployed yet.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {jobs.map(job => (
            <div key={job.id} className="bg-[#090b14] border border-white/[0.05] rounded-xl overflow-hidden hover:border-emerald-500/30 transition-all">
              <div 
                className="p-4 cursor-pointer hover:bg-white/[0.02] flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-colors" 
                onClick={() => setExpandedJobId(expandedJobId === job.id ? null : job.id)}
              >
                <div>
                  <h4 className="font-normal text-sm text-white">{job.title}</h4>
                  <p className="text-xs text-slate-400 font-light mt-0.5">
                    {job.companyName || 'HireNova Verified'} • <span className="font-mono text-[11px] text-slate-500">{job.location || 'India'}</span> • <span className="text-emerald-400 font-mono text-[11px]">₹ {job.salaryMin || 10}-{job.salaryMax || 18} LPA</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono rounded uppercase">
                    Active
                  </span>
                  <button
                    onClick={(e) => {
                      if (e) e.stopPropagation();
                      setJobToDelete({ id: job.id, title: job.title });
                    }}
                    disabled={deletingId === job.id}
                    title="Delete Job"
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  >
                    {deletingId === job.id ? <Loader className="w-3.5 h-3.5 animate-spin text-rose-400" /> : <Trash2 className="w-3.5 h-3.5" />}
                  </button>
                  <div className="text-slate-500 text-xs">
                    {expandedJobId === job.id ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
                  </div>
                </div>
              </div>
              {expandedJobId === job.id && (
                <div className="px-4 pb-4 pt-2 border-t border-white/[0.04] space-y-3">
                  <p className="text-xs text-slate-400 font-light whitespace-pre-wrap leading-relaxed">{job.description}</p>
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={(e) => {
                        if (e) e.stopPropagation();
                        setJobToDelete({ id: job.id, title: job.title });
                      }}
                      className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg text-xs font-normal transition-colors flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3 h-3" /> Remove Position
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete Job Confirmation Modal Popup */}
      <ConfirmModal
        isOpen={Boolean(jobToDelete)}
        onClose={() => !deletingId && setJobToDelete(null)}
        onConfirm={confirmDeleteJob}
        title="Delete Job Position"
        message={`Are you sure you want to permanently delete "${jobToDelete?.title}"? This will also remove all associated candidate applications.`}
        confirmText="Delete Position"
        confirmStyle="danger"
        loading={Boolean(deletingId)}
      />

      <ToastNotification toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};

const GlobalInterviewsTab = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    jobService.getScheduledInterviews()
      .then(res => setInterviews(res || []))
      .catch(err => {
        console.error(err);
        return apiClient.get('/interviews').then(res => setInterviews(res.data)).catch(() => setInterviews([]));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="ai-card rounded-3xl p-6 sm:p-8 max-w-5xl mx-auto border border-white/[0.08] shadow-2xl pb-16">
      <div className="mb-6 pb-4 border-b border-white/[0.06]">
        <h3 className="text-lg font-light text-white tracking-tight">Global Interview Telemetry</h3>
        <p className="text-xs text-slate-400 font-light mt-0.5">Cluster-wide log of scheduled candidate technical panels and interviews.</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-16"><Loader className="w-6 h-6 animate-spin text-emerald-500" /></div>
      ) : interviews.length === 0 ? (
        <div className="text-center p-12 text-slate-500">
          <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-xs font-light">No interviews recorded across the network.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {interviews.map(i => (
            <div key={i.id} className="p-4 bg-[#090b14] border border-white/[0.05] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-normal text-white">{i.roundName || `Interview Session #${i.id}`}</h4>
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono rounded uppercase">
                    {i.status || 'SCHEDULED'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Candidate #{i.userId || i.candidateId} • <span className="text-slate-300 font-normal">{i.jobTitle}</span> ({i.companyName})
                </p>
                <div className="flex items-center gap-3 mt-1.5 text-[11px] font-mono text-slate-500">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    {i.interviewDate ? new Date(i.interviewDate).toLocaleString() : 'Date TBD'}
                  </span>
                  {i.interviewerName && <span>Lead: {i.interviewerName}</span>}
                </div>
              </div>

              {i.meetingLink && (
                <a
                  href={i.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-normal transition-all flex items-center gap-1.5 shrink-0"
                >
                  <Video className="w-3.5 h-3.5" /> Room Link <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ProfileTab = ({ username }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
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
      setPassStatus({ type: 'success', text: 'Admin security credentials updated.' });
      setPassForm({ oldPassword: '', newPassword: '' });
    } catch (err) {
      setPassStatus({ type: 'error', text: err.response?.data || 'Credential update failed.' });
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div>
        <h3 className="text-xl font-light text-white tracking-tight">Super Administrator Profile</h3>
        <p className="text-xs text-slate-400 font-light mt-0.5">System privilege controls and access management.</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><Loader className="w-6 h-6 animate-spin text-emerald-500" /></div>
      ) : profileData && typeof profileData === 'object' && profileData.email ? (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            <InfoCard label="First Name" value={profileData.firstName} />
            <InfoCard label="Last Name" value={profileData.lastName} />
            <InfoCard label="System Handle" value={`@${profileData.username}`} />
            <InfoCard label="Root Email" value={profileData.email} isEmail />
          </div>

          <div className="ai-card rounded-2xl p-6 border border-white/[0.08] max-w-xl">
            <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-4 pb-2 border-b border-white/[0.06]">
              Update Root Administrative Credentials
            </h4>
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
                className="w-full px-3.5 py-2 bg-[#090b14] border border-white/[0.07] rounded-xl text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/40" 
              />
              <input 
                type="password" 
                placeholder="New Root Password" 
                required 
                value={passForm.newPassword} 
                onChange={e => setPassForm({...passForm, newPassword: e.target.value})} 
                className="w-full px-3.5 py-2 bg-[#090b14] border border-white/[0.07] rounded-xl text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/40" 
              />
              <button 
                type="submit" 
                disabled={passLoading} 
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-normal transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] disabled:opacity-50"
              >
                {passLoading ? <Loader className="w-3.5 h-3.5 animate-spin"/> : 'Update Credentials'}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};

const InfoCard = ({ label, value, isEmail }) => (
  <div className="p-4 rounded-xl bg-[#090b14] border border-white/[0.06]">
    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1">{label}</span>
    <span className={`text-xs font-normal ${isEmail ? 'text-emerald-400 break-all' : 'text-slate-200'}`}>{value}</span>
  </div>
);

const StatCard = ({ title, value, trend }) => (
  <div className="ai-card p-5 rounded-2xl border border-white/[0.07]">
    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block mb-2">{title}</span>
    <div className="flex items-baseline justify-between">
      <span className="text-2xl font-light text-white font-mono">{value}</span>
      {trend && (
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
          {trend}
        </span>
      )}
    </div>
  </div>
);

const SidebarItem = ({ icon: Icon, label, active, onClick, collapsed }) => (
  <button 
    onClick={onClick} 
    title={collapsed ? label : ""}
    className={`w-full flex items-center p-2.5 rounded-xl transition-all text-xs font-normal ${
      active 
        ? 'bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
        : 'text-slate-400 hover:bg-white/[0.03] hover:text-slate-200'
    } ${collapsed ? 'justify-center' : 'gap-3 px-3.5'}`}
  >
    <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-emerald-300' : 'text-slate-500'}`} /> 
    {!collapsed && <span>{label}</span>}
  </button>
);

export default AdminDashboard;
