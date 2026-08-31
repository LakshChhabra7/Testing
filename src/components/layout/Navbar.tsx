import React from 'react';
import { useShelter } from '../../context/ShelterContext';
import { ClimateZoneId } from '../../types';
import { 
  Play, 
  Sparkles, 
  RotateCcw, 
  MapPin, 
  Cpu, 
  Award, 
  Layers, 
  Sliders, 
  Flame, 
  SunMedium, 
  BarChart3, 
  FileText, 
  Globe2, 
  CheckCircle2, 
  FileCode,
  Database
} from 'lucide-react';

interface NavbarProps {
  onOpenReport?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const { 
    activeTab, 
    setActiveTab, 
    activeClimateId, 
    setClimate, 
    loadPresetDemo,
    setIsJudgeMode,
    isJudgeMode,
    setJudgeStep
  } = useShelter();

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Globe2 },
    { id: 'studio', label: 'Design Studio', icon: Sliders },
    { id: 'viewer3d', label: '3D Digital Twin', icon: Cpu },
    { id: 'simulation', label: 'Simulation & Heat Flow', icon: Flame },
    { id: 'optimization', label: 'Optimization Engine', icon: Sparkles },
    { id: 'materials', label: 'Materials Lab', icon: Layers },
    { id: 'climate', label: 'Climate Hub', icon: SunMedium },
    { id: 'dataset', label: 'Dataset (228)', icon: Database },
    { id: 'compare', label: 'Benchmark', icon: BarChart3 },
    { id: 'multiclimate', label: 'Multi-Climate', icon: MapPin },
    { id: 'reports', label: 'Design Report', icon: FileText },
    { id: 'ansys', label: 'ANSYS / CFD', icon: FileCode }
  ];

  const handleLaunchGuidedTour = () => {
    setIsJudgeMode(true);
    setJudgeStep(1);
    setActiveTab('overview');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-[#0369a1]/95 via-[#0284c7]/95 to-[#075985]/95 backdrop-blur-xl border-b border-sky-200/30 text-white shadow-xl shadow-sky-900/30 overflow-hidden">
      {/* Cloud & Sky Ambient Light Glow Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent pointer-events-none" />

      {/* Top Engineering Micro-Bar */}
      <div className="relative w-full px-4 sm:px-6 py-1 bg-[#0c4a6e]/80 backdrop-blur-md border-b border-sky-300/20 flex items-center justify-between text-[11px] font-mono text-sky-100">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex items-center gap-1.5 font-bold text-white">
            <span className="w-2 h-2 rounded-full bg-sky-300 animate-pulse shadow-[0_0_8px_rgba(125,211,252,0.8)]" />
            <span>THERMOSHELTER AI</span>
          </div>
          <span className="text-sky-300/40 hidden sm:inline">|</span>
          <div className="hidden sm:flex items-center gap-2 text-sky-100">
            <span>SOLVER:</span>
            <span className="text-amber-200 font-medium">Transient Euler-RK4 ODE</span>
            <span className="text-sky-300/40">•</span>
            <span>DATASET:</span>
            <span className="text-white font-medium">Synthetic_Dataset.xlsx (228 Scenarios)</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-2 py-0.5 rounded border border-white/25 text-[10px] text-white shadow-sm">
            <CheckCircle2 className="w-3 h-3 text-sky-300" />
            <span>PROJECT: <strong className="text-white uppercase">{activeClimateId} DEMO</strong></span>
            <span className="text-sky-200/40">|</span>
            <span className="text-sky-200 font-semibold">SYNCHRONIZED</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo & Tagline */}
        <div 
          onClick={() => setActiveTab('overview')}
          className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-lg group-hover:bg-white/30 group-hover:border-white transition-all">
            <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-white fill-none" strokeWidth="2">
              <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" strokeLinejoin="round" />
              <path d="M9 21V12h6v9" stroke="#7dd3fc" />
              <circle cx="12" cy="7.5" r="1.5" fill="#7dd3fc" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight font-display text-white drop-shadow-sm">
                THERMOSHELTER <span className="text-sky-200">AI</span>
              </span>
              <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold bg-white/20 text-sky-100 border border-white/30 rounded backdrop-blur-sm">
                v2.1
              </span>
            </div>
            <p className="text-[10px] text-sky-100/90 font-sans tracking-wide">
              Passive Thermal Simulation &amp; Optimization
            </p>
          </div>
        </div>

        {/* Action Controls & Presets */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Quick Region Selector */}
          <div className="hidden lg:flex items-center gap-1 bg-white/15 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/25 shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-sky-200" />
            <select
              value={activeClimateId}
              onChange={(e) => setClimate(e.target.value as ClimateZoneId)}
              className="bg-transparent text-xs text-white font-medium focus:outline-none cursor-pointer pr-1"
            >
              <option value="ladakh" className="bg-[#0c4a6e] text-white">Leh, Ladakh (Cold-Arid)</option>
              <option value="rajasthan" className="bg-[#0c4a6e] text-white">Jaisalmer, Rajasthan (Hot-Arid)</option>
              <option value="delhi" className="bg-[#0c4a6e] text-white">New Delhi (Composite)</option>
              <option value="lucknow" className="bg-[#0c4a6e] text-white">Lucknow (Subtropical)</option>
              <option value="bengaluru" className="bg-[#0c4a6e] text-white">Bengaluru (Moderate)</option>
              <option value="chennai" className="bg-[#0c4a6e] text-white">Chennai (Warm-Humid)</option>
            </select>
          </div>

          {/* Load Demo Scenario Button */}
          <button
            onClick={() => loadPresetDemo('ladakh')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/15 hover:bg-white/25 text-white border border-white/25 transition-all shadow-sm active:scale-95 cursor-pointer backdrop-blur-md"
            title="Load realistic high-altitude winter extreme scenario"
          >
            <RotateCcw className="w-3.5 h-3.5 text-sky-200" />
            <span>Ladakh Demo</span>
          </button>

          {/* Guided Tour Trigger */}
          <button
            onClick={handleLaunchGuidedTour}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all shadow-md active:scale-95 cursor-pointer ${
              isJudgeMode
                ? 'bg-white text-sky-950 ring-2 ring-white shadow-lg'
                : 'bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-md'
            }`}
            title="Launch 2-minute interactive product walkthrough"
          >
            <Award className="w-3.5 h-3.5 text-amber-300" />
            <span>Guided Tour</span>
          </button>

          {/* Run Simulation Direct CTA */}
          <button
            onClick={() => setActiveTab('simulation')}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-sky-400 to-cyan-300 hover:from-sky-300 hover:to-cyan-200 text-sky-950 transition-all shadow-lg shadow-sky-900/40 active:scale-95 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span className="hidden md:inline">Run Simulation</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs Bar */}
      <nav className="relative w-full bg-[#0c4a6e]/60 backdrop-blur-md border-t border-sky-300/20 px-4 sm:px-6 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center gap-1 py-1.5 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-sky-950 font-bold shadow-md shadow-sky-950/20 border border-sky-100'
                    : 'text-sky-100 hover:text-white hover:bg-white/15'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-600' : 'text-sky-200/80'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
