import React, { useState, useEffect } from 'react';
import { 
  Bot, Briefcase, FileText, CheckCircle, ChevronRight, Sparkles, Cpu, 
  ShieldCheck, Zap, ArrowUpRight, Terminal, BarChart3, Search, Layers, 
  Play, Activity, RefreshCw, Server, Wifi, CheckCircle2, AlertTriangle, 
  ExternalLink, Loader, Lock, Database
} from 'lucide-react';
import { Link } from 'react-router-dom';

const initialServices = [
  {
    id: 'gateway',
    name: 'API Gateway Router',
    role: 'Central Ingress & Security Filter',
    description: 'Dynamic reactive proxy routing all external client requests with unified CORS and rate limiting.',
    host: 'hirenova-gateway.onrender.com',
    probeUrl: 'https://hirenova-gateway.onrender.com/jobs',
    tech: 'Spring Cloud Gateway • Reactive Netty',
    port: '9090 / Cloud Edge',
    category: 'ROUTING & SECURITY',
    status: 'PROBING',
    latency: null
  },
  {
    id: 'auth',
    name: 'Authentication & Identity',
    role: 'Security, Tokens & RBAC',
    description: 'Manages candidate & recruiter sign-ups, BCrypt salted password hashing, and signed JWT issuance.',
    host: 'hirenova-auth-service.onrender.com',
    probeUrl: 'https://hirenova-auth-service.onrender.com/',
    tech: 'Spring Boot 3 • Spring Security • TiDB Cloud',
    port: '8081',
    category: 'AUTHENTICATION',
    status: 'PROBING',
    latency: null
  },
  {
    id: 'job',
    name: 'Job & Applications Service',
    role: 'Openings & Match Pipeline',
    description: 'Maintains active vacancies, candidate submissions, status progression, and recruiter reviews.',
    host: 'hirenova-job-service.onrender.com',
    probeUrl: 'https://hirenova-job-service.onrender.com/jobs',
    tech: 'Spring Boot 3 • JPA Hibernate • TiDB Cloud',
    port: '8082',
    category: 'CORE PIPELINE',
    status: 'PROBING',
    latency: null
  },
  {
    id: 'resume',
    name: 'Resume & ATS Document Vault',
    role: 'Binary PDF Store & Ingest',
    description: 'Persists candidate PDF resumes via TiDB LONGBLOB storage with high-speed download streams.',
    host: 'hirenova-resume-service.onrender.com',
    probeUrl: 'https://hirenova-resume-service.onrender.com/',
    tech: 'Spring Boot 3 • TiDB LONGBLOB Storage',
    port: '8083',
    category: 'DOCUMENT VAULT',
    status: 'PROBING',
    latency: null
  },
  {
    id: 'ai',
    name: 'Groq AI Intelligence Engine',
    role: 'Neural CV Parser & ATS Radar',
    description: 'High-throughput Groq LLM inference for sub-second resume parsing, ATS scoring & semantic match.',
    host: 'hirenova-ai-service.onrender.com',
    probeUrl: 'https://hirenova-ai-service.onrender.com/',
    tech: 'FastAPI • Groq openai/gpt-oss-120b',
    port: '8000',
    category: 'NEURAL AI INFERENCE',
    status: 'PROBING',
    latency: null
  },
  {
    id: 'candidate',
    name: 'Candidate Profile Service',
    role: 'Dossiers & Credentials',
    description: 'Maintains verified candidate portfolios, work history records, and skill competency graphs.',
    host: 'hirenova-candidate-service.onrender.com',
    probeUrl: 'https://hirenova-candidate-service.onrender.com/',
    tech: 'Spring Boot 3 • RESTful Web Services',
    port: '8084',
    category: 'PROFILE TELEMETRY',
    status: 'PROBING',
    latency: null
  },
  {
    id: 'interview',
    name: 'Interview Telemetry Service',
    role: 'Video Rounds & Scheduling',
    description: 'Coordinates technical video interview rooms, live agendas, and real-time candidate telemetry.',
    host: 'hirenova-interview-service.onrender.com',
    probeUrl: 'https://hirenova-interview-service.onrender.com/',
    tech: 'Spring Boot 3 • WebRTC Telemetry',
    port: '8085',
    category: 'VIDEO TELEMETRY',
    status: 'PROBING',
    latency: null
  }
];

const LandingPage = () => {
  const [activeDemoJob, setActiveDemoJob] = useState('fullstack');
  const [scanProgress, setScanProgress] = useState(94);
  const [isSimulating, setIsSimulating] = useState(false);

  // Microservices live telemetry state
  const [services, setServices] = useState(initialServices);
  const [isWarmingAll, setIsWarmingAll] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  const probeNode = async (srv, timeout = 12000) => {
    const start = performance.now();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
      await fetch(srv.probeUrl, {
        mode: 'no-cors',
        cache: 'no-store',
        signal: controller.signal
      });
      clearTimeout(timer);
      const latency = Math.round(performance.now() - start);
      return {
        ...srv,
        status: 'OPERATIONAL',
        latency,
        lastChecked: new Date().toLocaleTimeString()
      };
    } catch (err) {
      clearTimeout(timer);
      if (err.name === 'AbortError') {
        return {
          ...srv,
          status: 'WARMING_UP',
          latency: null,
          lastChecked: new Date().toLocaleTimeString()
        };
      }
      return {
        ...srv,
        status: 'OFFLINE',
        latency: null,
        lastChecked: new Date().toLocaleTimeString()
      };
    }
  };

  const probeAllServices = async (timeout = 12000) => {
    const promises = initialServices.map(s => probeNode(s, timeout));
    const results = await Promise.all(promises);
    setServices(results);
    setLastRefreshed(new Date().toLocaleTimeString());
  };

  const handleWarmAll = async () => {
    setIsWarmingAll(true);
    setServices(prev => prev.map(s => ({ ...s, status: 'PROBING' })));
    const promises = initialServices.map(s => probeNode(s, 60000));
    const results = await Promise.all(promises);
    setServices(results);
    setIsWarmingAll(false);
    setLastRefreshed(new Date().toLocaleTimeString());
  };

  const handlePingSingle = async (serviceId) => {
    setServices(prev => prev.map(s => s.id === serviceId ? { ...s, status: 'PROBING' } : s));
    const target = initialServices.find(s => s.id === serviceId);
    const updated = await probeNode(target, 25000);
    setServices(prev => prev.map(s => s.id === serviceId ? updated : s));
  };

  useEffect(() => {
    probeAllServices();
    const interval = setInterval(() => {
      probeAllServices();
    }, 35000);
    return () => clearInterval(interval);
  }, []);

  const onlineCount = services.filter(s => s.status === 'OPERATIONAL').length;
  const warmingCount = services.filter(s => s.status === 'WARMING_UP' || s.status === 'PROBING').length;

  const demoJobs = {
    fullstack: {
      title: "Senior Full Stack Engineer",
      company: "CloudScale Inc.",
      score: 94,
      match: "Exceptional Match",
      matchedSkills: ["React 19", "Spring Boot", "FastAPI", "PostgreSQL", "Docker", "RESTful APIs"],
      missingSkills: ["Kubernetes (Basic)"],
      experienceYears: "4.5 / 4.0 Required",
      analysis: "Candidate exhibits exceptional full-stack microservices proficiency. Strong Spring Boot and React alignment."
    },
    aiml: {
      title: "AI / LLM Systems Engineer",
      company: "Synthetix AI",
      score: 89,
      match: "High Match",
      matchedSkills: ["Python", "Groq API", "RAG Pipelines", "Vector Databases", "Prompt Engineering"],
      missingSkills: ["vLLM Deployment"],
      experienceYears: "2.0 / 2.0 Required",
      analysis: "Strong familiarity with high-throughput inference, LangChain, and vector embeddings."
    },
    cloud: {
      title: "DevOps & Cloud Architect",
      company: "NextGen Core",
      score: 76,
      match: "Moderate Match",
      matchedSkills: ["Docker", "Linux", "CI/CD Pipelines", "Maven"],
      missingSkills: ["Terraform", "AWS EKS", "ArgoCD"],
      experienceYears: "1.5 / 3.0 Required",
      analysis: "Solid container fundamentals, but missing senior-level infrastructure-as-code production experience."
    }
  };

  const handleSimulate = (key) => {
    setActiveDemoJob(key);
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 600);
  };

  const currentJob = demoJobs[activeDemoJob];

  return (
    <div className="min-h-screen bg-[#07080d] text-slate-200 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-x-hidden bg-ai-grid">
      
      {/* Ambient Radial Lights */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/10 blur-[140px] rounded-full pointer-events-none -z-10 animate-ambient" />
      <div className="fixed top-1/3 right-0 w-[500px] h-[500px] bg-purple-600/5 blur-[160px] rounded-full pointer-events-none -z-10" />

      {/* Floating Navigation Header */}
      <nav className="sticky top-4 z-50 max-w-6xl mx-auto w-[92%] backdrop-blur-xl bg-[#0e111b]/70 border border-white/[0.08] rounded-2xl px-6 py-3.5 flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-0.5 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="text-base font-medium tracking-tight text-white flex items-center gap-1.5">
            HireNova <span className="text-[10px] font-mono font-normal uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded">AI</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-[13px] font-normal text-slate-400">
          <a href="#simulator" className="hover:text-white transition-colors">ATS Simulator</a>
          <a href="#features" className="hover:text-white transition-colors">Architecture</a>
          <a href="#ecosystem" className="hover:text-white transition-colors flex items-center gap-1.5">
            <span>Cluster Status</span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono border ${
              onlineCount === 7 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${onlineCount === 7 ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400 animate-ping'}`} />
              {onlineCount}/7 Online
            </span>
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Link 
            to="/login" 
            className="px-4 py-2 text-[13px] font-normal text-slate-300 hover:text-white transition-colors hover:bg-white/[0.04] rounded-lg"
          >
            Sign In
          </Link>
          <Link 
            to="/register" 
            className="px-4 py-2 text-[13px] font-normal text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-all shadow-[0_0_20px_rgba(99,102,241,0.25)] hover:shadow-[0_0_25px_rgba(99,102,241,0.4)] flex items-center gap-1.5"
          >
            Get Started <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-16 md:pt-24 pb-20 max-w-5xl mx-auto relative z-10">
        
        {/* Subtle Tag Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-slate-300 text-xs font-normal mb-8 shadow-inner">
          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] uppercase tracking-widest text-slate-400 font-mono">Autonomous AI Protocol v3.0</span>
          <span className="text-slate-600">•</span>
          <span className="text-indigo-400 font-medium">Groq LLM Powered</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-white mb-6 max-w-4xl leading-[1.1]">
          The Intelligent Recruitment <br className="hidden sm:block" />
          <span className="font-normal bg-gradient-to-r from-indigo-300 via-purple-300 to-white bg-clip-text text-transparent">
            Microservices Ecosystem
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-lg font-light text-slate-400 max-w-2xl mb-10 leading-relaxed">
          High-performance distributed platform orchestrating Spring Boot microservices, TiDB Cloud, and Groq LLMs. Automates resume parsing, real-time ATS scoring, and recruiter matching.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link 
            to="/register" 
            className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-normal transition-all shadow-[0_0_30px_rgba(99,102,241,0.35)] hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] flex items-center justify-center gap-2 group"
          >
            Deploy Candidate Profile
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
          
          <a 
            href="#ecosystem" 
            className="w-full sm:w-auto px-8 py-3.5 bg-[#0e111a] hover:bg-[#151926] text-slate-300 hover:text-white rounded-xl text-sm font-normal transition-all border border-white/[0.08] flex items-center justify-center gap-2"
          >
            <Activity className="w-4 h-4 text-emerald-400" />
            Live Cluster Telemetry
          </a>
        </div>

        {/* Floating Key Metrics */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 w-full pt-10 border-t border-white/[0.06] text-left">
          <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.04]">
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1">Inference Latency</p>
            <p className="text-2xl font-light text-white tracking-tight">&lt; 700ms</p>
            <p className="text-xs text-indigo-400/80 font-mono mt-0.5">Groq Accelerated</p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.04]">
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1">Microservices</p>
            <p className="text-2xl font-light text-white tracking-tight">7 Nodes</p>
            <p className="text-xs text-emerald-400/80 font-mono mt-0.5">Independent Scale</p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.04]">
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1">Database Cluster</p>
            <p className="text-2xl font-light text-white tracking-tight">TiDB Cloud</p>
            <p className="text-xs text-purple-400/80 font-mono mt-0.5">Distributed SQL</p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.04]">
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1">ATS Accuracy</p>
            <p className="text-2xl font-light text-white tracking-tight">98.4%</p>
            <p className="text-xs text-emerald-400/80 font-mono mt-0.5">Vector Semantic</p>
          </div>
        </div>
      </main>

      {/* Interactive Live ATS Scanner Simulator */}
      <section id="simulator" className="py-16 px-4 max-w-6xl mx-auto w-full relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono mb-3">
            <Zap className="w-3.5 h-3.5" /> LIVE INTERACTIVE ATS ENGINE
          </div>
          <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            Experience Autonomous Candidate Scoring
          </h2>
          <p className="text-slate-400 text-sm font-light mt-2 max-w-xl mx-auto">
            Select a target position below to watch our Groq-powered matching engine score candidate qualifications in real-time.
          </p>
        </div>

        {/* Simulator Container */}
        <div className="ai-card rounded-3xl p-6 sm:p-8 border border-white/[0.09] shadow-2xl relative overflow-hidden">
          
          {/* Laser Sweep Effect when simulating */}
          {isSimulating && <div className="animate-laser" />}

          {/* Role Switcher Pills */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-white/[0.06]">
            <div className="flex flex-wrap gap-2">
              {Object.keys(demoJobs).map((key) => (
                <button
                  key={key}
                  onClick={() => handleSimulate(key)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-normal transition-all flex items-center gap-2 ${
                    activeDemoJob === key
                      ? 'bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                      : 'bg-[#0a0c14] border border-white/[0.06] text-slate-400 hover:text-slate-200 hover:border-white/[0.12]'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  {demoJobs[key].title}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Engine Online: Groq LLM (openai/gpt-oss-120b)
            </div>
          </div>

          {/* Live Analysis Grid */}
          <div className="grid lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: Simulated Candidate Resume Snippet */}
            <div className="lg:col-span-5 bg-[#090b12] border border-white/[0.06] rounded-2xl p-5 relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-medium text-slate-300">Ritik Sharma_Resume.pdf</span>
                </div>
                <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded">Active Ingest</span>
              </div>

              <div className="space-y-3 text-xs font-light text-slate-400 leading-relaxed font-mono">
                <p className="text-slate-200 font-semibold font-sans">Capgemini — Software Engineer</p>
                <p className="text-[11px] text-slate-500">Aug 2025 – Present • Production Backend & AI</p>
                <p className="text-[11px] text-slate-300">
                  "Engineered distributed microservices using Spring Boot, Spring Security, and FastAPI. Built RAG pipelines with Groq LLM inference, vector databases, and real-time Kafka event streaming."
                </p>
                <div className="pt-2 border-t border-white/[0.04] flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 bg-slate-900 border border-white/[0.06] text-[10px] text-slate-300 rounded">Spring Boot</span>
                  <span className="px-2 py-0.5 bg-slate-900 border border-white/[0.06] text-[10px] text-slate-300 rounded">FastAPI</span>
                  <span className="px-2 py-0.5 bg-slate-900 border border-white/[0.06] text-[10px] text-slate-300 rounded">React.js</span>
                  <span className="px-2 py-0.5 bg-slate-900 border border-white/[0.06] text-[10px] text-slate-300 rounded">Docker</span>
                  <span className="px-2 py-0.5 bg-slate-900 border border-white/[0.06] text-[10px] text-slate-300 rounded">RAG</span>
                </div>
              </div>
            </div>

            {/* Right: Live ATS Match Card */}
            <div className="lg:col-span-7 bg-[#090b12] border border-white/[0.06] rounded-2xl p-6 flex flex-col justify-between">
              
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Target Role</span>
                    <h4 className="text-lg font-normal text-white mt-0.5">{currentJob.title}</h4>
                    <p className="text-xs text-indigo-400">{currentJob.company}</p>
                  </div>

                  {/* Circular Score Badge */}
                  <div className="text-right">
                    <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block mb-1">ATS Score</span>
                    <div className="inline-flex items-baseline gap-1 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <span className="text-3xl font-light tracking-tight">{currentJob.score}</span>
                      <span className="text-xs font-mono text-emerald-500/70">/100</span>
                    </div>
                  </div>
                </div>

                {/* Match Progress Bar */}
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-5 border border-white/[0.05]">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500 rounded-full"
                    style={{ width: `${currentJob.score}%` }}
                  />
                </div>

                {/* Extracted Details */}
                <div className="space-y-4 text-xs font-light">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 block mb-2">Matched Key Competencies</span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentJob.matchedSkills.map(skill => (
                        <span key={skill} className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-normal">
                          ✓ {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 block mb-2">Detected Gaps / Upskill Suggestions</span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentJob.missingSkills.map(skill => (
                        <span key={skill} className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 font-normal">
                          ⚠ {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-[#0d101a] border border-white/[0.05] rounded-xl text-slate-400 text-xs leading-relaxed">
                    <span className="text-indigo-400 font-medium font-mono text-[11px] block mb-1">AI Executive Summary</span>
                    {currentJob.analysis}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.05] flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>Calculated via Cosine Semantic Distance</span>
                <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-sans font-normal flex items-center gap-1">
                  Try with your own resume <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Feature Pillars */}
      <section id="features" className="py-20 px-4 max-w-6xl mx-auto w-full border-t border-white/[0.06]">
        <div className="text-center mb-14">
          <span className="text-[11px] font-mono uppercase tracking-widest text-indigo-400 mb-2 block">Core Capabilities</span>
          <h2 className="text-3xl font-light text-white tracking-tight">Built for Next-Generation Recruitment</h2>
          <p className="text-slate-400 text-sm font-light mt-2 max-w-lg mx-auto">
            A microservices architecture built from the ground up for high reliability, zero data leakage, and low latency.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<Cpu className="w-5 h-5 text-indigo-400" />}
            category="AI ENGINE"
            title="Groq LLM Acceleration"
            description="Sub-second inference using state-of-the-art open models. Parses multi-page PDF resumes into structured JSON with zero hallucination."
          />
          <FeatureCard 
            icon={<Layers className="w-5 h-5 text-purple-400" />}
            category="MICROSERVICES"
            title="Isolated Spring Architecture"
            description="Independent services for Auth, Jobs, Resumes, and AI, orchestrated through Spring Cloud Gateway with centralized JWT security."
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-5 h-5 text-emerald-400" />}
            category="PRIVACY & SECURITY"
            title="Guaranteed Data Isolation"
            description="Resumes are processed ephemerally with strict tenant boundaries. Candidate contact records are encrypted at rest."
          />
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* REAL-TIME MICROSERVICES CLUSTER TELEMETRY & HEALTH SECTION */}
      {/* ------------------------------------------------------------- */}
      <section id="ecosystem" className="py-20 px-4 max-w-6xl mx-auto w-full border-t border-white/[0.06] relative">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-36 bg-emerald-500/5 blur-[120px] pointer-events-none -z-10" />

        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-3">
            <Activity className="w-3.5 h-3.5" /> LIVE CLOUD TELEMETRY MONITOR
          </div>
          <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight">
            Microservices Cluster Health & Status
          </h2>
          <p className="text-slate-400 text-sm font-light mt-2 max-w-2xl mx-auto">
            Real-time ping probes across all 7 distributed platform microservices. Monitor active endpoints, container states, and measured round-trip latencies.
          </p>
        </div>

        {/* Cluster Control & Aggregation Bar */}
        <div className="ai-card rounded-2xl p-5 mb-8 border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className={`w-3 h-3 rounded-full ${onlineCount === 7 ? 'bg-emerald-400 animate-pulse shadow-[0_0_12px_rgba(52,211,153,0.8)]' : 'bg-amber-400 animate-ping'}`} />
              <div>
                <div className="text-sm font-medium text-white flex items-center gap-2">
                  <span>{onlineCount === 7 ? 'All Nodes Operational' : `${onlineCount} of 7 Services Operational`}</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    {Math.round((onlineCount / 7) * 100)}% Health
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-light mt-0.5">
                  {lastRefreshed ? `Last probe cycle completed at ${lastRefreshed}` : 'Calibrating network telemetry...'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleWarmAll}
              disabled={isWarmingAll}
              className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-normal transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] disabled:opacity-60 flex items-center justify-center gap-2"
              title="Sends simultaneous wake-up requests to all Render cloud containers"
            >
              {isWarmingAll ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
              <span>{isWarmingAll ? 'Waking Sleeping Instances...' : 'Ping & Warm All Services'}</span>
            </button>
            <button
              onClick={() => probeAllServices(15000)}
              disabled={isWarmingAll}
              className="p-2.5 bg-[#121524] hover:bg-[#1a1f33] text-slate-300 hover:text-white rounded-xl text-xs border border-white/[0.08] transition-colors"
              title="Refresh status now"
            >
              <RefreshCw className={`w-4 h-4 ${isWarmingAll ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* 7 Microservice Status Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((srv) => {
            const isOnline = srv.status === 'OPERATIONAL';
            const isWarming = srv.status === 'WARMING_UP';
            const isProbing = srv.status === 'PROBING';

            return (
              <div 
                key={srv.id}
                className="ai-card p-5 rounded-2xl border border-white/[0.07] hover:border-white/[0.14] transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Subtle top indicator bar */}
                <div className={`absolute top-0 left-0 right-0 h-[2px] ${
                  isOnline 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
                    : isWarming || isProbing
                    ? 'bg-gradient-to-r from-amber-500 to-indigo-500 animate-pulse'
                    : 'bg-rose-500/50'
                }`} />

                <div>
                  {/* Card Header: Category & Live Badge */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                      {srv.category}
                    </span>
                    
                    {/* Live Status Pill */}
                    {isOnline && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Running</span>
                        <span className="text-emerald-400/50 font-sans">•</span>
                        <span className="text-[10px]">{srv.latency}ms</span>
                      </div>
                    )}
                    {isWarming && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-[11px] animate-pulse">
                        <Loader className="w-3 h-3 animate-spin text-amber-400" />
                        <span>Cold Starting</span>
                      </div>
                    )}
                    {isProbing && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-mono text-[11px]">
                        <Loader className="w-3 h-3 animate-spin text-indigo-400" />
                        <span>Probing...</span>
                      </div>
                    )}
                    {!isOnline && !isWarming && !isProbing && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 font-mono text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                        <span>Standby / Asleep</span>
                      </div>
                    )}
                  </div>

                  {/* Service Title & Role */}
                  <h3 className="text-base font-normal text-white group-hover:text-indigo-300 transition-colors">
                    {srv.name}
                  </h3>
                  <p className="text-xs text-indigo-400/90 font-mono mt-0.5">
                    {srv.role}
                  </p>

                  {/* Description */}
                  <p className="text-xs text-slate-400 font-light mt-2.5 line-clamp-2 leading-relaxed">
                    {srv.description}
                  </p>
                </div>

                {/* Card Footer: Hostname, Tech & Individual Ping Action */}
                <div className="mt-5 pt-3.5 border-t border-white/[0.05] space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="truncate max-w-[200px]" title={srv.host}>
                      {srv.host}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-slate-400">
                      {srv.port}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-light text-slate-500">
                      {srv.tech}
                    </span>
                    <button
                      onClick={() => handlePingSingle(srv.id)}
                      className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1 transition-colors"
                      title="Test latency of this node"
                    >
                      <Activity className="w-3 h-3" /> Ping Node
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Informative Cold-Start Note */}
        <div className="mt-8 p-4 rounded-2xl bg-[#090b14]/80 border border-white/[0.06] flex items-start gap-3">
          <Server className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-400 font-light leading-relaxed">
            <span className="text-slate-200 font-normal">Cloud Architecture Telemetry Note: </span>
            This platform is deployed across 7 isolated microservice containers on Render Cloud backed by TiDB Serverless. 
            Free tier nodes automatically enter hibernation after 15 minutes of inactivity. 
            Use the <strong className="text-indigo-300 font-normal">"Ping & Warm All Services"</strong> button above to awaken all nodes simultaneously in ~30s prior to logging in or submitting applications.
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 px-4 max-w-5xl mx-auto w-full mb-12">
        <div className="ai-card-glow rounded-3xl p-10 text-center relative overflow-hidden border border-white/[0.1]">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-indigo-500/20 blur-[90px] pointer-events-none" />
          
          <h3 className="text-2xl sm:text-4xl font-light text-white tracking-tight mb-4">
            Ready to Accelerate Your Recruitment?
          </h3>
          <p className="text-slate-400 font-light text-sm max-w-lg mx-auto mb-8">
            Create your account today. Whether you are a candidate seeking instant ATS feedback or a recruiter evaluating talent pools.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link 
              to="/register" 
              className="px-7 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-normal transition-all shadow-[0_0_25px_rgba(99,102,241,0.3)] hover:scale-105"
            >
              Sign Up Now
            </Link>
            <Link 
              to="/login" 
              className="px-7 py-3 bg-slate-900/80 hover:bg-slate-800 text-slate-300 rounded-xl text-sm font-normal transition-all border border-white/[0.08]"
            >
              Candidate Login
            </Link>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-8 border-t border-white/[0.06] text-center text-xs text-slate-500 font-light max-w-6xl mx-auto w-full px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-indigo-400" />
          <span className="text-slate-300 font-normal">HireNova AI Platform</span>
          <span className="text-slate-600">•</span>
          <span>Next-Gen Recruitment Microservices</span>
        </div>
        <p className="font-mono text-[11px] text-slate-600">&copy; 2026 HireNova. All rights reserved.</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, category, title, description }) => (
  <div className="ai-card p-6 rounded-2xl hover:border-indigo-500/30 transition-all group flex flex-col justify-between">
    <div>
      <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.07] flex items-center justify-center mb-5 group-hover:border-indigo-500/30 group-hover:scale-105 transition-all">
        {icon}
      </div>
      <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block mb-1.5">{category}</span>
      <h3 className="text-lg font-normal text-white mb-2">{title}</h3>
      <p className="text-xs font-light text-slate-400 leading-relaxed">{description}</p>
    </div>
    <div className="mt-6 pt-4 border-t border-white/[0.04] flex items-center text-[11px] text-indigo-400 font-mono gap-1 group-hover:translate-x-1 transition-transform">
      Learn More <ChevronRight className="w-3 h-3" />
    </div>
  </div>
);

export default LandingPage;
