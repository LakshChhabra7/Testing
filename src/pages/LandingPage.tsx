import React, { useState, useEffect } from 'react';
import { useShelter } from '../context/ShelterContext';
import { CLIMATE_PROFILES } from '../data/climates';
import { ClimateZoneId, ViewerMode } from '../types';
import { 
  ArrowRight, 
  Sun, 
  Flame, 
  Layers, 
  ChevronDown, 
  Sparkles, 
  Compass, 
  Play, 
  Wind, 
  Award,
  Thermometer,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  BarChart3,
  Sliders
} from 'lucide-react';
import { Shelter3DCanvas } from '../components/viewer3d/Shelter3DCanvas';

export const LandingPage: React.FC = () => {
  const { 
    setActiveTab, 
    activeClimateId, 
    setClimate, 
    activeClimate, 
    shelterConfig, 
    simulationResult,
    setIsJudgeMode,
    setJudgeStep,
    loadPresetDemo,
    currentHour,
    setCurrentHour
  } = useShelter();

  const [activeShowcaseMode, setActiveShowcaseMode] = useState<ViewerMode>('thermal');
  const [scrollY, setScrollY] = useState<number>(0);

  // Track scroll position for dynamic background video blur & darkening
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Compute blur amount (0px at top up to 24px as user scrolls down)
  const videoBlur = Math.min(24, scrollY * 0.035);
  // Compute darkening overlay opacity (0.45 at top up to 0.95 at bottom)
  const videoOverlayOpacity = Math.min(0.95, 0.45 + scrollY * 0.0008);

  const handleStartTour = () => {
    loadPresetDemo('ladakh');
    setIsJudgeMode(true);
    setJudgeStep(1);
  };

  return (
    <div className="w-full bg-[#0B0F17] text-[#F8FAFC] overflow-hidden selection:bg-[#D76F30]/30 selection:text-white">
      {/* 1. CINEMATIC HERO SECTION WITH BACKGROUND VIDEO BACK.mp4 */}
      <section className="relative min-h-[96vh] flex flex-col items-center justify-between px-4 sm:px-6 lg:px-12 pt-20 pb-10 overflow-hidden">
        {/* Background Video with Dynamic Blur & Dark Vignette */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-105 transition-all duration-300"
            style={{
              filter: `blur(${videoBlur}px) brightness(${Math.max(0.3, 1 - scrollY * 0.0009)})`,
              transform: `scale(${1 + scrollY * 0.0002})`
            }}
          >
            <source src="/BACK.mp4" type="video/mp4" />
          </video>
          {/* Dark Gradient Overlay for perfect high-contrast white text readability */}
          <div 
            className="absolute inset-0 bg-gradient-to-b from-[#0B0F17]/60 via-[#0B0F17]/75 to-[#0B0F17] transition-opacity duration-300"
            style={{ opacity: videoOverlayOpacity }}
          />
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 bg-grid-dark opacity-30" />
        </div>

        {/* Top Floating Pill Badge */}
        <div className="relative z-10 animate-reveal-up">
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-black/50 border border-white/20 text-xs font-mono text-white shadow-2xl backdrop-blur-xl">
            <span className="w-2 h-2 rounded-full bg-[#D76F30] animate-ping" />
            <span className="text-white font-bold tracking-wide">CLIMATE ADAPTIVE ARCHITECTURE</span>
            <span className="text-white/40">•</span>
            <span className="text-[#38BDF8] font-semibold">BIOCLIMATIC SIMULATION</span>
          </div>
        </div>

        {/* Center Hero Content (Ferrari Minimalist Bold Aesthetic) */}
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-7 my-auto px-4">
          {/* Hero Typography */}
          <div className="space-y-2">
            <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black font-display tracking-tight text-white uppercase leading-none drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
              THERMOSHELTER
            </h1>
            <p className="text-sm sm:text-lg lg:text-2xl font-mono font-bold tracking-[0.3em] text-[#D76F30] uppercase drop-shadow-md">
              PASSIVE THERMAL PLATFORM
            </p>
          </div>

          {/* Short, Impactful White Description */}
          <p className="text-base sm:text-lg lg:text-xl text-gray-100 max-w-2xl mx-auto font-sans leading-relaxed font-normal drop-shadow-md">
            Where climate intelligence meets passive engineering. Simulate thermodynamic energy balance, harvest natural solar radiation, and build zero-carbon shelters for extreme environments.
          </p>

          {/* High-Impact Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
            <button
              onClick={() => setActiveTab('studio')}
              className="flex items-center gap-2.5 px-9 py-4 bg-[#D76F30] hover:bg-[#c45e22] text-white font-extrabold text-sm tracking-wide rounded-xl shadow-[0_10px_30px_rgba(215,111,48,0.4)] hover:shadow-[0_15px_35px_rgba(215,111,48,0.6)] transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
            >
              <span>EXPLORE STUDIO</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('viewer3d')}
              className="flex items-center gap-2.5 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-sm tracking-wide rounded-xl border border-white/30 hover:border-white/60 transition-all backdrop-blur-xl shadow-xl active:scale-95 cursor-pointer"
            >
              <Flame className="w-4 h-4 text-[#D76F30]" />
              <span>VIEW 3D MODEL</span>
            </button>

            <button
              onClick={handleStartTour}
              className="flex items-center gap-2 px-7 py-4 bg-white/5 hover:bg-white/15 text-gray-200 hover:text-white font-semibold text-sm rounded-xl border border-white/15 transition-all backdrop-blur-md active:scale-95 cursor-pointer"
            >
              <Award className="w-4 h-4 text-[#E99A68]" />
              <span>GUIDED TOUR</span>
            </button>
          </div>
        </div>

        {/* Bottom Scroll Cue */}
        <div 
          className="relative z-10 flex flex-col items-center gap-1.5 text-gray-300 hover:text-white transition-colors cursor-pointer pt-6 select-none"
          onClick={() => {
            const el = document.getElementById('digital-twin-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <span className="text-[11px] font-mono tracking-widest uppercase">Explore Simulation</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-white" />
        </div>
      </section>

      {/* 2. INTERACTIVE 3D DIGITAL TWIN SHOWCASE (Crisp White + Dark Modern Canvas) */}
      <section id="digital-twin-section" className="py-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4 pb-4 border-b border-white/10">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-[#D76F30] uppercase tracking-wider">
              REAL-TIME SIMULATION ENGINE
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-white">
              Observe Heat, Sun &amp; Airflow in 3D
            </h2>
          </div>

          {/* Quick Climate Selector */}
          <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded-xl border border-white/15 text-xs font-mono backdrop-blur-md">
            <span className="text-gray-300 pl-2">CLIMATE:</span>
            {(['ladakh', 'rajasthan', 'chennai'] as ClimateZoneId[]).map((zone) => (
              <button
                key={zone}
                onClick={() => setClimate(zone)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeClimateId === zone
                    ? 'bg-[#D76F30] text-white shadow-md'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {zone === 'ladakh' ? 'Leh, Ladakh (-15°C)' : zone === 'rajasthan' ? 'Jaisalmer (+44°C)' : 'Chennai (Warm-Humid)'}
              </button>
            ))}
          </div>
        </div>

        {/* 3D WebGL Canvas Viewport */}
        <div className="relative w-full h-[560px] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/20 bg-[#0B0F17]">
          <Shelter3DCanvas
            config={shelterConfig}
            currentHour={currentHour}
            latitude={activeClimate.latitude}
            indoorTemp={simulationResult.avgIndoorTemp}
            ambientTemp={activeClimate.hourlyAmbientTemp[currentHour]}
            mode={activeShowcaseMode}
            onModeChange={setActiveShowcaseMode}
          />
        </div>

        {/* Time of Day Scrubber & Telemetry Card */}
        <div className="p-6 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xl flex flex-wrap items-center justify-between gap-6 font-mono text-xs shadow-xl">
          <div className="flex-1 min-w-[280px] space-y-2">
            <div className="flex justify-between text-gray-200 text-xs">
              <span className="flex items-center gap-2 text-[#E99A68] font-bold">
                <Sun className="w-4 h-4 text-[#D76F30]" />
                <span>SOLAR DIURNAL TIMELINE</span>
              </span>
              <strong className="text-white bg-black/60 px-3 py-1 rounded-lg border border-white/20 text-sm">
                {String(currentHour).padStart(2, '0')}:00 HRS
              </strong>
            </div>
            <input
              type="range"
              min="0"
              max="23"
              step="1"
              value={currentHour}
              onChange={(e) => setCurrentHour(parseInt(e.target.value))}
              className="w-full accent-[#D76F30] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-mono">
              <span>00:00 (Night)</span>
              <span>06:00 (Sunrise)</span>
              <span>12:00 (Solar Noon)</span>
              <span>18:00 (Sunset)</span>
              <span>23:00 (Night)</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs pl-0 sm:pl-4 border-l border-white/10">
            <div className="text-right">
              <span className="text-gray-400 text-[10px] uppercase block">Predicted Indoor</span>
              <strong className="text-2xl font-black text-[#38BDF8]">{simulationResult.avgIndoorTemp.toFixed(1)}°C</strong>
            </div>
            <div className="text-right">
              <span className="text-gray-400 text-[10px] uppercase block">Outdoor Ambient</span>
              <strong className="text-2xl font-black text-[#E99A68]">{activeClimate.hourlyAmbientTemp[currentHour]}°C</strong>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SIMPLIFIED 3-STEP PROCESS (Crisp Modern White Cards) */}
      <section className="py-24 bg-[#F8FAFC] text-[#0F172A] px-4 sm:px-6 lg:px-12 border-y border-gray-200">
        <div className="max-w-7xl mx-auto space-y-14">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold text-[#D76F30] uppercase tracking-wider">
              HOW IT WORKS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 tracking-tight">
              Three Simple Steps to Zero-Energy Comfort
            </h2>
            <p className="text-sm text-slate-600 font-sans">
              From raw climate coordinates to an optimized, construction-ready passive thermal envelope.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_15px_35px_rgb(0,0,0,0.12)] transition-all space-y-5 group">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black font-mono text-xl group-hover:scale-105 transition-transform shadow-md">
                01
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 font-display">
                Sense Microclimate
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-sans">
                Select your geographic region or input custom coordinates. ThermoShelter calculates celestial solar trajectories, incident direct/diffuse radiation, and diurnal temperature swings.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_15px_35px_rgb(0,0,0,0.12)] transition-all space-y-5 group">
              <div className="w-14 h-14 rounded-2xl bg-[#D76F30] text-white flex items-center justify-center font-black font-mono text-xl group-hover:scale-105 transition-transform shadow-md">
                02
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 font-display">
                Simulate Physics
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-sans">
                Our dynamic ODE solver computes transient multi-layer conduction, internal thermal mass storage lag (8–12 hours), and natural ventilation heat exchanges in sub-second time.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_15px_35px_rgb(0,0,0,0.12)] transition-all space-y-5 group">
              <div className="w-14 h-14 rounded-2xl bg-[#0284C7] text-white flex items-center justify-center font-black font-mono text-xl group-hover:scale-105 transition-transform shadow-md">
                03
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 font-display">
                Optimize Passively
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-sans">
                The evolutionary search engine discovers the optimal orientation, wall insulation depth, and window-to-wall ratios for 100% passive thermal comfort.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PERFORMANCE HIGHLIGHT METRICS (Crisp Minimalist Grid) */}
      <section className="py-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center font-mono">
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-2 shadow-lg">
            <span className="text-4xl sm:text-5xl font-black text-[#38BDF8] block">-68%</span>
            <span className="text-xs text-gray-300 uppercase tracking-wider font-semibold">Envelope Heat Loss</span>
          </div>

          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-2 shadow-lg">
            <span className="text-4xl sm:text-5xl font-black text-[#D76F30] block">+3.3x</span>
            <span className="text-xs text-gray-300 uppercase tracking-wider font-semibold">Passive Solar Harvest</span>
          </div>

          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-2 shadow-lg">
            <span className="text-4xl sm:text-5xl font-black text-white block">100%</span>
            <span className="text-xs text-gray-300 uppercase tracking-wider font-semibold">Passive Comfort</span>
          </div>

          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-2 shadow-lg">
            <span className="text-4xl sm:text-5xl font-black text-[#F97316] block">0 kg</span>
            <span className="text-xs text-gray-300 uppercase tracking-wider font-semibold">Auxiliary Fuel Burned</span>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION FOOTER */}
      <section className="py-20 bg-gradient-to-t from-black via-[#0B0F17] to-[#0B0F17] border-t border-white/10 px-4 sm:px-6 lg:px-12">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight">
            Ready to design your climate-adaptive shelter?
          </h2>
          <p className="text-base text-gray-300 max-w-xl mx-auto font-sans leading-relaxed">
            Launch the interactive design studio, customize composite wall layers, and run real-time transient simulations.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setActiveTab('studio')}
              className="px-9 py-4 bg-[#D76F30] hover:bg-[#c45e22] text-white font-extrabold text-sm rounded-xl shadow-2xl transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
            >
              LAUNCH DESIGN STUDIO
            </button>

            <button
              onClick={() => setActiveTab('dataset')}
              className="px-7 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl border border-white/20 transition-all backdrop-blur-md active:scale-95 cursor-pointer"
            >
              BROWSE 228 SCENARIOS
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
