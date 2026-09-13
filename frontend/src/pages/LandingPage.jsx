import React, { useState, useEffect } from 'react';
import { Bot, Briefcase, FileText, CheckCircle, ChevronRight, Sparkles, Cpu, ShieldCheck, Zap, ArrowUpRight, Terminal, BarChart3, Search, Layers, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [activeDemoJob, setActiveDemoJob] = useState('fullstack');
  const [scanProgress, setScanProgress] = useState(94);
  const [isSimulating, setIsSimulating] = useState(false);

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
          <a href="#features" className="hover:text-white transition-colors">Neural Architecture</a>
          <a href="#ecosystem" className="hover:text-white transition-colors">Microservices</a>
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
          <span className="text-indigo-400 text-xs flex items-center gap-1">FastAPI & Groq LLMs <Sparkles className="w-3 h-3"/></span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-light tracking-tight max-w-4xl mb-6 leading-[1.15] text-white">
          Precision Hiring with <br className="hidden sm:inline" />
          <span className="font-normal bg-gradient-to-r from-indigo-300 via-purple-200 to-amber-200 bg-clip-text text-transparent">
            Neural Resume Intelligence
          </span>
        </h1>
        
        <p className="text-sm sm:text-base md:text-lg text-slate-400 font-light max-w-2xl mb-10 leading-relaxed">
          Eliminate manual screening. Our distributed microservices pipeline parses resumes, detects subtle kerning, and extracts real-time ATS match scores in milliseconds.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3.5 mb-16">
          <Link 
            to="/register" 
            className="w-full sm:w-auto px-7 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-normal text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] hover:-translate-y-0.5"
          >
            Create Candidate Account
            <ChevronRight className="w-4 h-4" />
          </Link>
          <a 
            href="#simulator" 
            className="w-full sm:w-auto px-7 py-3 bg-[#0e111b] hover:bg-[#151928] text-slate-300 hover:text-white rounded-xl font-normal text-sm flex items-center justify-center gap-2 transition-all border border-white/[0.08] hover:border-white/[0.15]"
          >
            <Play className="w-3.5 h-3.5 text-indigo-400" />
            Interactive ATS Simulator
          </a>
        </div>

        {/* Micro Metric Ticker */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl pt-8 border-t border-white/[0.06]">
          <div className="p-3 text-left">
            <p className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">Parsing Latency</p>
            <p className="text-xl font-light text-white mt-0.5">&lt; 1.2s <span className="text-xs text-emerald-400 font-mono">avg</span></p>
          </div>
          <div className="p-3 text-left">
            <p className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">Model Accuracy</p>
            <p className="text-xl font-light text-white mt-0.5">99.4% <span className="text-xs text-indigo-400 font-mono">F1 score</span></p>
          </div>
          <div className="p-3 text-left">
            <p className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">Extraction Types</p>
            <p className="text-xl font-light text-white mt-0.5">PDF • DOCX <span className="text-xs text-slate-400 font-mono">OCR</span></p>
          </div>
          <div className="p-3 text-left">
            <p className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">Microservices</p>
            <p className="text-xl font-light text-white mt-0.5">5 Autonomous <span className="text-xs text-purple-400 font-mono">Nodes</span></p>
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
              Engine Online: Groq Llama-3.3 70B
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
