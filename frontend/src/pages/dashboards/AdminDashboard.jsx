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
          candidates: authStats.candidates || 0, // FIXED KEY MAPPING HERE
          recruiters: authStats.recruiters || 0, // FIXED KEY MAPPING HERE
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
          <h3 className="text-xl font-normal text-white">Create Recruiter Node</h3>
          <p className="text-xs text-slate-400 mt-0.5">Provision a new verified enterprise seat.</p>
        </div>
      </div>
      
      {status && (
        <div className={`p-3 rounded-xl border text-xs flex gap-2 items-start mb-6 ${status.type === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-300' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'}`}>
          {status.type === 'error' ? <X className="w-4 h-4 shrink-0" /> : <CheckSquare className="w-4 h-4 shrink-0" />}
          <span className="leading-relaxed">{status.msg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-slate-400 block uppercase tracking-wider">First Name</label>
            <input 
              required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})}
              className="w-full bg-[#090c14] border border-white/[0.07] rounded-xl text-sm px-3.5 py-2 text-slate-200 focus:border-emerald-500/50 outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-slate-400 block uppercase tracking-wider">Last Name</label>
            <input 
              required type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})}
              className="w-full bg-[#090c14] border border-white/[0.07] rounded-xl text-sm px-3.5 py-2 text-slate-200 focus:border-emerald-500/50 outline-none"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono text-slate-400 block uppercase tracking-wider">Username</label>
          <input 
            required type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})}
            className="w-full bg-[#090c14] border border-white/[0.07] rounded-xl text-sm px-3.5 py-2 text-slate-200 focus:border-emerald-500/50 outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono text-slate-400 block uppercase tracking-wider">Email Address</label>
          <input 
            required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
            className="w-full bg-[#090c14] border border-white/[0.07] rounded-xl text-sm px-3.5 py-2 text-slate-200 focus:border-emerald-500/50 outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono text-slate-400 block uppercase tracking-wider">Initial Password</label>
          <input 
            required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
            className="w-full bg-[#090c14] border border-white/[0.07] rounded-xl text-sm px-3.5 py-2 text-slate-200 focus:border-emerald-500/50 outline-none"
          />
        </div>
        <button 
          type="submit" disabled={loading}
          className="w-full mt-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-normal flex items-center justify-center transition-all disabled:opacity-50"
        >
          {loading ? <Loader className="w-4 h-4 animate-spin" /> : 'Provision Recruiter License'}
        </button>
      </form>
    </div>
  );
};

const GlobalJobsTab = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    jobService.getAllJobs().then(setJobs).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center p-16"><Loader className="w-6 h-6 animate-spin text-emerald-500" /></div>;

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-light text-white">Global Job Registry</h3>
          <p className="text-xs text-slate-400 mt-0.5">All active listings across the recruiter cluster.</p>
        </div>
        <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-[11px] font-mono">
          {jobs.length} Active Records
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {jobs.map(job => (
          <div key={job.id} className="ai-card p-5 rounded-2xl border border-white/[0.07] flex flex-col hover:border-emerald-500/30 transition-all">
            <div className="mb-4 flex-1">
              <h4 className="text-sm font-normal text-white">{job.title}</h4>
              <p className="text-[11px] text-slate-400 mt-1">{job.companyName} • {job.location || 'Remote'}</p>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/[0.05]">
              <div className="text-center">
                <p className="text-xs font-normal text-white">{job.vacancies || 0}</p>
                <p className="text-[10px] text-slate-500 font-mono">Openings</p>
              </div>
              <div className="text-center border-l border-white/[0.05]">
                <p className="text-xs font-normal text-slate-200">Yes</p>
                <p className="text-[10px] text-slate-500 font-mono">AI Scan</p>
              </div>
              <div className="text-center border-l border-white/[0.05]">
                <p className="text-xs font-normal text-emerald-400">Live</p>
                <p className="text-[10px] text-slate-500 font-mono">Status</p>
              </div>
            </div>
          </div>
        ))}
        {jobs.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-500 text-sm font-light">
            No global job records synchronized.
          </div>
        )}
      </div>
    </div>
  );
};

const GlobalInterviewsTab = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/interviews')
      .then(res => setInterviews(res.data || []))
      .catch(()=>{})
      .finally(()=>setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center p-16"><Loader className="w-6 h-6 animate-spin text-emerald-500" /></div>;

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-light text-white">Global Interview Telemetry</h3>
          <p className="text-xs text-slate-400 mt-0.5">Live video stream sessions across the cluster.</p>
        </div>
        <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-[11px] font-mono">
          {interviews.length} Booked
        </span>
      </div>

      <div className="bg-[#090b14] rounded-2xl border border-white/[0.07] overflow-hidden">
        {interviews.length === 0 ? (
           <div className="py-16 text-center text-slate-500 text-sm font-light">
             No active interviews logged on the main node.
           </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/[0.05]">
                  <th className="p-4 text-[11px] font-mono text-slate-400 font-semibold tracking-wider uppercase">Candidate ID</th>
                  <th className="p-4 text-[11px] font-mono text-slate-400 font-semibold tracking-wider uppercase">Job ID</th>
                  <th className="p-4 text-[11px] font-mono text-slate-400 font-semibold tracking-wider uppercase">Event Time</th>
                  <th className="p-4 text-[11px] font-mono text-slate-400 font-semibold tracking-wider uppercase">Meet Scope</th>
                  <th className="p-4 text-[11px] font-mono text-slate-400 font-semibold tracking-wider uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {interviews.map((iv) => (
                  <tr key={iv.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="p-4 text-xs text-slate-300 font-mono">#{iv.candidateId}</td>
                    <td className="p-4 text-xs text-slate-300 font-mono">#{iv.jobId}</td>
                    <td className="p-4 text-xs text-slate-300">{new Date(iv.scheduledTime).toLocaleString()}</td>
                    <td className="p-4">
                      {iv.meetingLink ? (
                        <a href={iv.meetingLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300">
                          <Video className="w-3.5 h-3.5" /> Room Link
                        </a>
                      ) : <span className="text-xs text-slate-600 font-light">TBA</span>}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                        iv.status === 'SCHEDULED' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                        iv.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        'bg-slate-500/10 text-slate-400 border-slate-500/20'
                      }`}>
                        {iv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const ProfileTab = ({ username }) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16">
      <div className="ai-card rounded-3xl border border-white/[0.08] shadow-2xl overflow-hidden relative">
        <div className="h-32 bg-gradient-to-r from-emerald-900/40 via-teal-900/40 to-slate-900/40 relative">
          <div className="absolute inset-0 bg-ai-grid opacity-30" />
        </div>
        
        <div className="px-6 sm:px-8 pb-8 relative -mt-12">
          <div className="w-24 h-24 rounded-2xl bg-[#090b14] border border-white/[0.1] shadow-2xl flex items-center justify-center p-1 mb-6 relative">
             <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-2xl" />
             <div className="w-full h-full rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-4xl text-white font-light relative z-10">
               {username.charAt(0).toUpperCase()}
             </div>
          </div>

          <div>
             <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono rounded-full mb-3">
               <ShieldCheck className="w-3 h-3" /> VERIFIED SUPER ADMIN
             </div>
             <h3 className="text-2xl font-light text-white mb-1">{username}</h3>
             <p className="text-sm text-slate-400">HireNova Platform Administrator</p>
          </div>

          <div className="mt-8 space-y-3">
             <div className="flex items-center justify-between p-4 bg-[#090b14] rounded-xl border border-white/[0.05]">
               <div className="flex items-center gap-3 text-sm text-slate-300">
                 <Lock className="w-4 h-4 text-slate-500" /> Administrative Rights
               </div>
               <span className="text-emerald-400 text-xs">Full Global Access</span>
             </div>
             <div className="flex items-center justify-between p-4 bg-[#090b14] rounded-xl border border-white/[0.05]">
               <div className="flex items-center gap-3 text-sm text-slate-300">
                 <Cpu className="w-4 h-4 text-slate-500" /> System Control Level
               </div>
               <span className="text-emerald-400 text-xs">Level 5 (Unrestricted)</span>
             </div>
             <div className="flex items-center justify-between p-4 bg-[#090b14] rounded-xl border border-white/[0.05]">
               <div className="flex items-center gap-3 text-sm text-slate-300">
                 <ShieldAlert className="w-4 h-4 text-slate-500" /> Database Deletion Rights
               </div>
               <span className="text-indigo-400 text-xs">Enabled & Active</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, trend }) => (
  <div className="ai-card p-5 rounded-2xl border border-white/[0.07] relative overflow-hidden group hover:border-emerald-500/30 transition-all">
    <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{title}</span>
    <div className="mt-4 flex items-end gap-3">
      <span className="text-3xl font-light text-white leading-none">{value}</span>
      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono tracking-wider border border-emerald-500/20 mb-1">
        {trend}
      </span>
    </div>
  </div>
);

const SidebarItem = ({ icon: Icon, label, active, onClick, collapsed }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-sm font-normal group relative ${
      active 
        ? 'bg-emerald-600/10 text-emerald-400' 
        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
    } ${collapsed ? 'justify-center' : ''}`}
  >
    {active && !collapsed && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-emerald-500 rounded-r-full" />}
    <Icon className={`w-4 h-4 shrink-0 transition-transform ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
    {!collapsed && <span className="text-left leading-tight">{label}</span>}
  </button>
);

export default AdminDashboard;