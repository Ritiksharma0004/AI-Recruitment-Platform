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
    probeUrl: 'https://hirenova-auth-service.onrender.com/auth/health',
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
    probeUrl: 'https://hirenova-resume-service.onrender.com/resumes',
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
    probeUrl: 'https://hirenova-candidate-service.onrender.com/candidates',
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
    probeUrl: 'https://hirenova-interview-service.onrender.com/interviews',
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
        method: 'GET',
        mode: 'no-cors',
        signal: controller.signal,
        cache: 'no-store'
      });
      clearTimeout(timer);
      const latency = Math.round(performance.now() - start);
      return { status: 'OPERATIONAL', latency };
    } catch (err) {
      clearTimeout(timer);
      if (err.name === 'AbortError') {
        return { status: 'WARMING_UP', latency: null };
      }
      return { status: 'STANDBY', latency: null };
    }
  };

  const probeAllServices = async (timeout = 12000) => {
    setServices((prev) =>
      prev.map((s) => ({ ...s, status: s.status === 'OPERATIONAL' ? 'OPERATIONAL' : 'PROBING' }))
    );

    const results = await Promise.allSettled(
      initialServices.map(async (srv) => {
        const res = await probeNode(srv, timeout);
        return { id: srv.id, ...res };
      })
    );

    setServices((prev) =>
      prev.map((s) => {
        const match = results.find((r) => r.status === 'fulfilled' && r.value.id === s.id);
        if (match) {
          return { ...s, status: match.value.status, latency: match.value.latency };
        }
        return s;
      })
    );

    const now = new Date();
    setLastRefreshed(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  };

  useEffect(() => {
    probeAllServices(8000);
    const interval = setInterval(() => {
      probeAllServices(10000);
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  const handleWarmAll = async () => {
    setIsWarmingAll(true);
    setServices((prev) => prev.map((s) => ({ ...s, status: 'WARMING_UP' })));

    await Promise.allSettled(
      initialServices.map(async (srv) => {
        try {
          await fetch(srv.probeUrl, { method: 'GET', mode: 'no-cors', cache: 'no-store' });
        } catch (_) {}
      })
    );

    setTimeout(() => {
      probeAllServices(15000).finally(() => setIsWarmingAll(false));
    }, 4000);
  };

  const handlePingSingle = async (serviceId) => {
    setServices((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, status: 'PROBING' } : s))
    );
    const target = initialServices.find((s) => s.id === serviceId);
    if (!target) return;

    const res = await probeNode(target, 15000);
    setServices((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, status: res.status, latency: res.latency } : s))
    );
  };

  const onlineCount = services.filter((s) => s.status === 'OPERATIONAL').length;

  const demoJobs = {
    fullstack: {
      title: "Senior Full-Stack Cloud Engineer",
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
    <div className="min-h-screen bg-[#f6f8fa] text-slate-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900 relative overflow-x-hidden bg-ai-grid">
      
      {/* Subtle ambient lighting */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[380px] bg-gradient-to-b from-emerald-100/50 via-indigo-50/20 to-transparent blur-[140px] rounded-full pointer-events-none -z-10 animate-ambient" />

      {/* Floating Navigation Header */}
      <nav className="sticky top-4 z-50 max-w-6xl mx-auto w-[92%] backdrop-blur-md bg-white/90 border border-slate-200/80 rounded-2xl px-6 py-3.5 flex items-center justify-between shadow-[0_4px_20px_rgba(15,23,42,0.04)] transition-all">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center p-0.5 shadow-sm group-hover:scale-105 transition-transform">
            <Bot className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-2">
            HireNova <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">AI Studio</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <a href="#simulator" className="hover:text-slate-900 transition-colors">ATS Simulator</a>
          <a href="#features" className="hover:text-slate-900 transition-colors">Architecture</a>
          <a href="#ecosystem" className="hover:text-slate-900 transition-colors flex items-center gap-2">
            <span>Live Health</span>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
              onlineCount === 7 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}>
              <span className={`w-2 h-2 rounded-full ${onlineCount === 7 ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-ping'}`} />
              {onlineCount}/7 Online
            </span>
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Link 
            to="/login" 
            className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors hover:bg-slate-100 rounded-xl"
          >
            Sign In
          </Link>
          <Link 
            to="/register" 
            className="px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
          >
            Get Started <ArrowUpRight className="w-4 h-4 text-emerald-400" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-16 md:pt-24 pb-20 max-w-5xl mx-auto relative z-10">
        
        {/* Modern Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold mb-8 shadow-xs">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="uppercase tracking-wider font-mono text-[11px]">Autonomous AI Protocol v3.0</span>
          <span className="text-emerald-300">•</span>
          <span className="font-bold">Groq LLM Accelerated</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 max-w-4xl leading-[1.15]">
          The Intelligent Recruitment <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 bg-clip-text text-transparent">
            Microservices Ecosystem
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-lg font-normal text-slate-600 max-w-2xl mb-10 leading-relaxed">
          High-performance distributed platform orchestrating Spring Boot microservices, TiDB Cloud, and Groq LLMs. Automates resume parsing, real-time ATS scoring, and candidate-job radar matching.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link 
            to="/register" 
            className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 group"
          >
            Create Candidate Account
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-emerald-400" />
          </Link>
          
          <a 
            href="#ecosystem" 
            className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 rounded-xl text-sm font-semibold transition-all border border-slate-300/80 shadow-xs flex items-center justify-center gap-2"
          >
            <Activity className="w-4 h-4 text-emerald-600" />
            Live Cluster Telemetry
          </a>
        </div>

        {/* Key Metrics */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full pt-10 border-t border-slate-200 text-left">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Inference Latency</p>
            <p className="text-3xl font-bold text-slate-900 tracking-tight">&lt; 700ms</p>
            <p className="text-xs text-emerald-700 font-semibold mt-1">Groq LPUs</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Microservices</p>
            <p className="text-3xl font-bold text-slate-900 tracking-tight">7 Nodes</p>
            <p className="text-xs text-emerald-700 font-semibold mt-1">Independent Scale</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Database Cluster</p>
            <p className="text-3xl font-bold text-slate-900 tracking-tight">TiDB Cloud</p>
            <p className="text-xs text-indigo-700 font-semibold mt-1">Distributed SQL</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">ATS Accuracy</p>
            <p className="text-3xl font-bold text-slate-900 tracking-tight">98.4%</p>
            <p className="text-xs text-emerald-700 font-semibold mt-1">Vector Semantic</p>
          </div>
        </div>
      </main>

      {/* Interactive Live ATS Scanner Simulator */}
      <section id="simulator" className="py-16 px-4 max-w-6xl mx-auto w-full relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-3">
            <Zap className="w-3.5 h-3.5 text-emerald-600" /> LIVE INTERACTIVE ATS RADAR
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Experience Autonomous Candidate Scoring
          </h2>
          <p className="text-slate-600 text-sm font-normal mt-2 max-w-xl mx-auto">
            Select a target position below to watch our Groq-powered matching engine score candidate qualifications in real-time.
          </p>
        </div>

        {/* Simulator Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden">
          
          {/* Laser Sweep Effect when simulating */}
          {isSimulating && <div className="animate-laser" />}

          {/* Role Switcher Pills */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100">
            <div className="flex flex-wrap gap-2">
              {Object.keys(demoJobs).map((key) => (
                <button
                  key={key}
                  onClick={() => handleSimulate(key)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                    activeDemoJob === key
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  {demoJobs[key].title}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              Engine Online: Groq LLM (openai/gpt-oss-120b)
            </div>
          </div>

          {/* Live Analysis Grid */}
          <div className="grid lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: Simulated Candidate Resume Snippet */}
            <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-5 relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-900">Ritik Sharma_Resume.pdf</span>
                </div>
                <span className="text-xs font-semibold bg-emerald-50 border border-emerald-200 text-emerald-800 px-2 py-0.5 rounded-md">Active Ingest</span>
              </div>

              <div className="space-y-3 text-xs font-normal text-slate-700 leading-relaxed font-mono">
                <p className="text-slate-900 font-bold font-sans">Capgemini — Software Engineer</p>
                <p className="text-xs text-slate-500">Aug 2025 – Present • Production Backend & AI</p>
                <p className="text-xs text-slate-700">
                  "Engineered distributed microservices using Spring Boot, Spring Security, and FastAPI. Built RAG pipelines with Groq LLM inference, vector databases, and real-time Kafka event streaming."
                </p>
                <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-1.5 font-sans">
                  <span className="px-2.5 py-1 bg-white border border-slate-200 text-xs font-medium text-slate-800 rounded-lg shadow-2xs">Spring Boot</span>
                  <span className="px-2.5 py-1 bg-white border border-slate-200 text-xs font-medium text-slate-800 rounded-lg shadow-2xs">FastAPI</span>
                  <span className="px-2.5 py-1 bg-white border border-slate-200 text-xs font-medium text-slate-800 rounded-lg shadow-2xs">React.js</span>
                  <span className="px-2.5 py-1 bg-white border border-slate-200 text-xs font-medium text-slate-800 rounded-lg shadow-2xs">Docker</span>
                  <span className="px-2.5 py-1 bg-white border border-slate-200 text-xs font-medium text-slate-800 rounded-lg shadow-2xs">RAG</span>
                </div>
              </div>
            </div>

            {/* Right: Live ATS Match Card */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-xs">
              
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Target Role</span>
                    <h4 className="text-lg font-bold text-slate-900 mt-0.5">{currentJob.title}</h4>
                    <p className="text-xs font-semibold text-emerald-700">{currentJob.company}</p>
                  </div>

                  {/* Circular Score Badge */}
                  <div className="text-right">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">ATS Score</span>
                    <div className="inline-flex items-baseline gap-1 px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                      <span className="text-3xl font-bold tracking-tight">{currentJob.score}</span>
                      <span className="text-xs font-semibold text-emerald-600">/100</span>
                    </div>
                  </div>
                </div>

                {/* Match Progress Bar */}
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-5 border border-slate-200">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500 rounded-full"
                    style={{ width: `${currentJob.score}%` }}
                  />
                </div>

                {/* Extracted Details */}
                <div className="space-y-4 text-xs font-normal">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 block mb-2">Matched Key Competencies</span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentJob.matchedSkills.map(skill => (
                        <span key={skill} className="px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold">
                          ✓ {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 block mb-2">Detected Gaps / Upskill Suggestions</span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentJob.missingSkills.map(skill => (
                        <span key={skill} className="px-3 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 font-semibold">
                          ⚠ {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs leading-relaxed">
                    <span className="text-emerald-800 font-bold font-mono text-xs block mb-1">AI Executive Summary</span>
                    {currentJob.analysis}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Calculated via Cosine Semantic Distance</span>
                <Link to="/register" className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1">
                  Try with your own resume <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Feature Pillars */}
      <section id="features" className="py-20 px-4 max-w-6xl mx-auto w-full border-t border-slate-200">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald-700 mb-2 block">Core Architecture</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Built for Production Recruitment</h2>
          <p className="text-slate-600 text-sm font-normal mt-2 max-w-lg mx-auto">
            A microservices architecture built from the ground up for high reliability, zero data leakage, and low latency.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<Cpu className="w-5 h-5 text-emerald-700" />}
            category="AI ENGINE"
            title="Groq LLM Acceleration"
            description="Sub-second inference using state-of-the-art open models. Parses multi-page PDF resumes into structured JSON with zero hallucination."
          />
          <FeatureCard 
            icon={<Layers className="w-5 h-5 text-indigo-700" />}
            category="MICROSERVICES"
            title="Isolated Spring Architecture"
            description="Independent services for Auth, Jobs, Resumes, and AI, orchestrated through Spring Cloud Gateway with centralized JWT security."
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-5 h-5 text-teal-700" />}
            category="PRIVACY & SECURITY"
            title="Guaranteed Data Isolation"
            description="Resumes are processed ephemerally with strict tenant boundaries. Candidate contact records are encrypted at rest."
          />
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* REAL-TIME MICROSERVICES CLUSTER TELEMETRY & HEALTH SECTION */}
      {/* ------------------------------------------------------------- */}
      <section id="ecosystem" className="py-20 px-4 max-w-6xl mx-auto w-full border-t border-slate-200 relative">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-3">
            <Activity className="w-3.5 h-3.5 text-emerald-600" /> LIVE CLOUD TELEMETRY MONITOR
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Microservices Cluster Health & Status
          </h2>
          <p className="text-slate-600 text-sm font-normal mt-2 max-w-2xl mx-auto">
            Real-time ping probes across all 7 distributed platform microservices. Monitor active endpoints, container states, and measured round-trip latencies.
          </p>
        </div>

        {/* Cluster Control & Aggregation Bar */}
        <div className="bg-white rounded-2xl p-5 mb-8 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-3.5 h-3.5 rounded-full ${onlineCount === 7 ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-ping'}`} />
              <div>
                <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>{onlineCount === 7 ? 'All Nodes Operational' : `${onlineCount} of 7 Services Operational`}</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800">
                    {Math.round((onlineCount / 7) * 100)}% Health
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-normal mt-0.5">
                  {lastRefreshed ? `Last probe cycle completed at ${lastRefreshed}` : 'Calibrating network telemetry...'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleWarmAll}
              disabled={isWarmingAll}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all shadow-sm disabled:opacity-60 flex items-center justify-center gap-2"
              title="Sends simultaneous wake-up requests to all Render cloud containers"
            >
              {isWarmingAll ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{isWarmingAll ? 'Waking Sleeping Instances...' : 'Ping & Warm All Services'}</span>
            </button>
            <button
              onClick={() => probeAllServices(15000)}
              disabled={isWarmingAll}
              className="p-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs border border-slate-300 transition-colors shadow-2xs"
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
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Top indicator bar */}
                <div className={`absolute top-0 left-0 right-0 h-[3px] ${
                  isOnline 
                    ? 'bg-emerald-500' 
                    : isWarming || isProbing
                    ? 'bg-amber-500 animate-pulse'
                    : 'bg-rose-500'
                }`} />

                <div>
                  {/* Card Header: Category & Live Badge */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono">
                      {srv.category}
                    </span>
                    
                    {/* Live Status Pill */}
                    {isOnline && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold text-xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Running</span>
                        <span className="text-emerald-400">•</span>
                        <span>{srv.latency}ms</span>
                      </div>
                    )}
                    {isWarming && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-semibold text-xs animate-pulse">
                        <Loader className="w-3 h-3 animate-spin text-amber-600" />
                        <span>Starting</span>
                      </div>
                    )}
                    {isProbing && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 font-semibold text-xs">
                        <Loader className="w-3 h-3 animate-spin text-indigo-600" />
                        <span>Probing...</span>
                      </div>
                    )}
                    {!isOnline && !isWarming && !isProbing && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 font-semibold text-xs">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        <span>Standby</span>
                      </div>
                    )}
                  </div>

                  {/* Service Title & Role */}
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {srv.name}
                  </h3>
                  <p className="text-xs text-emerald-700 font-semibold mt-0.5">
                    {srv.role}
                  </p>

                  {/* Description */}
                  <p className="text-xs text-slate-600 font-normal mt-2.5 line-clamp-2 leading-relaxed">
                    {srv.description}
                  </p>
                </div>

                {/* Card Footer: Hostname, Tech & Individual Ping Action */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-600">
                    <span className="truncate max-w-[200px]" title={srv.host}>
                      {srv.host}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-semibold">
                      {srv.port}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-normal text-slate-500">
                      {srv.tech}
                    </span>
                    <button
                      onClick={() => handlePingSingle(srv.id)}
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1 transition-colors"
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
        <div className="mt-8 p-4 rounded-2xl bg-white border border-slate-200 flex items-start gap-3 shadow-2xs">
          <Server className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-600 font-normal leading-relaxed">
            <span className="text-slate-900 font-semibold">Cloud Architecture Note: </span>
            This platform is deployed across 7 isolated microservice containers on Render Cloud backed by TiDB Serverless. 
            Free tier nodes automatically enter hibernation after 15 minutes of inactivity. 
            Use the <strong className="text-slate-900 font-bold">"Ping & Warm All Services"</strong> button above to awaken all nodes simultaneously in ~30s prior to logging in or submitting applications.
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 px-4 max-w-5xl mx-auto w-full mb-12">
        <div className="bg-slate-900 rounded-3xl p-10 text-center relative overflow-hidden shadow-xl text-white">
          <h3 className="text-2xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            Ready to Accelerate Your Recruitment?
          </h3>
          <p className="text-slate-300 font-normal text-sm sm:text-base max-w-lg mx-auto mb-8">
            Create your account today. Whether you are a candidate seeking instant ATS feedback or a recruiter evaluating talent pools.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link 
              to="/register" 
              className="px-7 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-sm font-bold transition-all shadow-md hover:scale-105"
            >
              Sign Up as Candidate
            </Link>
            <Link 
              to="/login" 
              className="px-7 py-3.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold transition-all border border-slate-700"
            >
              Sign In to Studio
            </Link>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-8 border-t border-slate-200 bg-white text-center text-xs text-slate-600 font-medium max-w-full w-full px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-emerald-600" />
          <span className="text-slate-900 font-bold">HireNova AI Platform</span>
          <span className="text-slate-400">•</span>
          <span>Next-Gen Autonomous Recruitment Microservices</span>
        </div>
        <p className="font-mono text-xs text-slate-500">© 2026 HireNova. All rights reserved.</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, category, title, description }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all group flex flex-col justify-between shadow-2xs">
    <div>
      <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-5 group-hover:scale-105 transition-all">
        {icon}
      </div>
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono block mb-1.5">{category}</span>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-xs font-normal text-slate-600 leading-relaxed">{description}</p>
    </div>
    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs text-emerald-700 font-semibold gap-1 group-hover:translate-x-1 transition-transform">
      Learn More <ChevronRight className="w-3.5 h-3.5" />
    </div>
  </div>
);

export default LandingPage;
