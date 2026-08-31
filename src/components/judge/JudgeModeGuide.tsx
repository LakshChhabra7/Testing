import React from 'react';
import { useShelter } from '../../context/ShelterContext';
import { 
  Award, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Sparkles, 
  Flame, 
  Layers, 
  CheckCircle,
  FileCode
} from 'lucide-react';

export const JudgeModeGuide: React.FC = () => {
  const { 
    isJudgeMode, 
    setIsJudgeMode, 
    judgeStep, 
    setJudgeStep, 
    setActiveTab, 
    loadPresetDemo,
    startOptimization
  } = useShelter();

  if (!isJudgeMode) return null;

  const totalSteps = 8;

  const steps = [
    {
      step: 1,
      title: 'Problem: Climatic Thermal Mismatch',
      tab: 'overview',
      content: (
        <div className="space-y-3">
          <div className="p-3 bg-sky-950/40 border border-sky-400/30 rounded-lg">
            <h4 className="font-bold text-[#38BDF8] text-xs uppercase tracking-wider mb-1">
              The Engineering Challenge
            </h4>
            <p className="text-xs text-gray-200 leading-relaxed">
              <strong>"Designing high-performance, area-specific passive shelters for extreme diurnal and seasonal climates."</strong>
            </p>
          </div>
          <p className="text-xs text-gray-300">
            Standard modular shelters ignore local microclimatic dynamics. In high-altitude cold regions like Ladakh, this causes dangerous sub-zero indoor freezing and heavy fossil fuel dependence (kerosene heaters).
          </p>
          <div className="flex items-center gap-2 p-2 bg-[#D76F30]/15 border border-[#D76F30]/30 rounded text-[11px] text-[#E99A68]">
            <span>💡 <strong>Goal:</strong> Simulate transient thermodynamics &amp; generate optimal passive bio-climatic shelter envelopes automatically.</span>
          </div>
        </div>
      )
    },
    {
      step: 2,
      title: 'Extreme Climate: Leh, Ladakh',
      tab: 'climate',
      content: (
        <div className="space-y-3">
          <p className="text-xs text-gray-300">
            We load the meteorological baseline for <strong>Leh, Ladakh (Altitude 3,500m)</strong>:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2 rounded bg-[#070B14] border border-white/10">
              <span className="text-gray-400">Ambient Temp:</span>
              <p className="text-[#E99A68] font-bold text-sm">-15.0°C to +4.2°C</p>
            </div>
            <div className="p-2 rounded bg-[#070B14] border border-white/10">
              <span className="text-gray-400">Peak Solar:</span>
              <p className="text-[#38BDF8] font-bold text-sm">960 W/m² (Intense)</p>
            </div>
          </div>
          <p className="text-[11px] text-gray-400">
            <strong>Opportunity:</strong> Intense high-altitude solar irradiance can heat the shelter 100% passively if captured and stored effectively.
          </p>
        </div>
      )
    },
    {
      step: 3,
      title: 'Baseline Failure: Conventional Uninsulated Shelter',
      tab: 'compare',
      content: (
        <div className="space-y-3">
          <p className="text-xs text-gray-300">
            Simulation of a standard 230mm brick shelter in Ladakh:
          </p>
          <div className="p-2.5 bg-red-950/30 border border-red-800/40 rounded-lg text-xs space-y-1.5 font-mono">
            <div className="flex justify-between text-red-200">
              <span>Avg Indoor Temp:</span>
              <strong>-4.2°C (Freezing)</strong>
            </div>
            <div className="flex justify-between text-red-200">
              <span>Daily Heat Loss:</span>
              <strong>142.5 kWh/day</strong>
            </div>
            <div className="flex justify-between text-red-200">
              <span>Comfort Score:</span>
              <strong>28 / 100 (Critical)</strong>
            </div>
          </div>
          <p className="text-[11px] text-gray-400">
            Standard single-layer envelopes fail because conductive losses exceed solar heat intake by 400%.
          </p>
        </div>
      )
    },
    {
      step: 4,
      title: 'Multi-Layer Composite Envelope Engineering',
      tab: 'materials',
      content: (
        <div className="space-y-3">
          <p className="text-xs text-gray-300">
            Our <strong>Materials Lab</strong> dynamically builds composite assemblies combining high thermal resistance and high thermal storage mass:
          </p>
          <div className="p-2.5 bg-sky-950/40 border border-sky-400/30 rounded-lg text-xs space-y-1">
            <div className="text-[#38BDF8] font-bold">Bio-Climatic Composite Wall:</div>
            <div className="text-gray-300 text-[11px] font-mono pl-2">
              1. Exterior Radiant Foil (Reflects cold radiation)<br />
              2. 80mm Closed-cell PUF (k = 0.024 W/mK)<br />
              3. 250mm Rammed Earth Core (Time Lag: 9.8 hours)<br />
              4. 20mm Himalayan Timber Lining
            </div>
          </div>
          <p className="text-[11px] text-[#38BDF8] font-mono">
            Envelope U-Value reduced from 3.20 W/m²K → <strong>0.24 W/m²K</strong> (92% reduction).
          </p>
        </div>
      )
    },
    {
      step: 5,
      title: 'Transient Thermal Physics Simulation',
      tab: 'simulation',
      content: (
        <div className="space-y-3">
          <p className="text-xs text-gray-300">
            Our solver executes an ODE energy balance over 24-hour meteorological cycles:
          </p>
          <div className="p-2 bg-[#070B14] border border-sky-500/20 rounded font-mono text-[10px] text-gray-300">
            C_th · (dT/dt) = Q_solar + Q_internal - Q_cond - Q_vent - Q_sky
          </div>
          <p className="text-xs text-gray-300">
            Notice how the thermal mass stores 4.31 kW of afternoon solar gain and gradually releases it during the -15°C sub-zero night, keeping indoor temperatures stable above 16°C without any external heating.
          </p>
        </div>
      )
    },
    {
      step: 6,
      title: 'Evolutionary Multi-Objective Optimization',
      tab: 'optimization',
      content: (
        <div className="space-y-3">
          <p className="text-xs text-gray-300">
            The optimization engine runs a genetic search across orientation, window ratios, insulation depth, and thermal storage mass:
          </p>
          <button
            onClick={() => {
              loadPresetDemo('ladakh');
              startOptimization('thermal_comfort', {
                maxBudgetTier: 'high',
                maxWallThicknessMm: 350,
                maxGlazingRatio: 0.5,
                requireNaturalMaterials: true
              });
            }}
            className="w-full py-2 px-3 bg-[#D76F30] hover:bg-[#c45e22] text-white font-bold text-xs rounded-lg shadow flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Trigger Genetic Optimization</span>
          </button>
          <p className="text-[11px] text-gray-400">
            Evaluates 20+ design candidates in real time and discovers the global Pareto-optimal bioclimatic configuration.
          </p>
        </div>
      )
    },
    {
      step: 7,
      title: '"Why This Design?" — Scientific Rationale',
      tab: 'studio',
      content: (
        <div className="space-y-2.5 text-xs">
          <div className="p-2 bg-slate-900 border border-sky-500/30 rounded text-gray-200">
            <strong className="text-[#38BDF8]">1. South-Facing Solar Window (48% WWR):</strong>
            <p className="text-[11px] text-gray-300 mt-0.5">Captures 4.31 kW peak solar radiation directly into the thermal mass.</p>
          </div>
          <div className="p-2 bg-slate-900 border border-sky-500/30 rounded text-gray-200">
            <strong className="text-[#38BDF8]">2. 9.8-Hour Decrement Phase Shift:</strong>
            <p className="text-[11px] text-gray-300 mt-0.5">The 250mm rammed earth core delays daytime heat peak to 02:00 AM when outdoor cold is most severe.</p>
          </div>
          <div className="p-2 bg-slate-900 border border-sky-500/30 rounded text-gray-200">
            <strong className="text-[#38BDF8]">3. Double Low-E Argon Glazing + Shutters:</strong>
            <p className="text-[11px] text-gray-300 mt-0.5">Insulated nocturnal shutters prevent nighttime radiative cooling to deep space.</p>
          </div>
        </div>
      )
    },
    {
      step: 8,
      title: 'ANSYS Export & Engineering Validation',
      tab: 'ansys',
      content: (
        <div className="space-y-3">
          <p className="text-xs text-gray-300">
            For high-fidelity multi-physics validation, ThermoShelter AI features a direct <strong>ANSYS APDL &amp; Fluent CFD Exporter</strong>:
          </p>
          <div className="p-2.5 bg-[#070B14] border border-sky-500/20 rounded font-mono text-[10px] text-[#38BDF8]">
            ✓ Export ANSYS APDL Mechanical thermal input script<br />
            ✓ Export Fluent CFD boundary conditions &amp; mesh parameters<br />
            ✓ Comprehensive PDF Engineering Report with formal math formulation
          </div>
          <div className="p-2 bg-[#D76F30]/20 border border-[#D76F30]/40 rounded text-xs text-[#E99A68] font-bold text-center">
            Zero Carbon Passive Comfort Achieved! 🏆
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps[judgeStep - 1] || steps[0];

  const handleNext = () => {
    if (judgeStep < totalSteps) {
      const nextStep = judgeStep + 1;
      setJudgeStep(nextStep);
      setActiveTab(steps[nextStep - 1].tab);
    } else {
      setIsJudgeMode(false);
    }
  };

  const handlePrev = () => {
    if (judgeStep > 1) {
      const prevStep = judgeStep - 1;
      setJudgeStep(prevStep);
      setActiveTab(steps[prevStep - 1].tab);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[420px] max-w-[calc(100vw-2rem)] bg-[#070B14]/95 backdrop-blur-xl border-2 border-sky-500 rounded-2xl shadow-2xl overflow-hidden text-white animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 border-b border-sky-500/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#D76F30] flex items-center justify-center text-white">
            <Award className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-bold text-xs tracking-tight text-white flex items-center gap-1.5">
              <span>GUIDED PRODUCT TOUR</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-sky-500/20 text-[#38BDF8] rounded">
                STEP {judgeStep}/{totalSteps}
              </span>
            </h3>
          </div>
        </div>

        <button
          onClick={() => setIsJudgeMode(false)}
          className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Line */}
      <div className="w-full bg-slate-800 h-1">
        <div 
          className="bg-gradient-to-r from-[#38BDF8] to-[#D76F30] h-full transition-all duration-300"
          style={{ width: `${(judgeStep / totalSteps) * 100}%` }}
        />
      </div>

      {/* Step Content */}
      <div className="p-4 space-y-3">
        <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-sky-500/20 text-[#38BDF8] text-[11px] font-mono font-bold flex items-center justify-center border border-sky-400/40">
            {judgeStep}
          </span>
          <span>{currentStepData.title}</span>
        </h4>

        <div className="text-xs text-gray-200">
          {currentStepData.content}
        </div>
      </div>

      {/* Footer Navigation Controls */}
      <div className="px-4 py-3 bg-slate-900/60 border-t border-white/10 flex items-center justify-between gap-2">
        <button
          onClick={handlePrev}
          disabled={judgeStep === 1}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            judgeStep === 1 
              ? 'opacity-30 cursor-not-allowed text-gray-500' 
              : 'bg-white/10 hover:bg-white/20 text-gray-200'
          }`}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <span
              key={i}
              onClick={() => {
                setJudgeStep(i + 1);
                setActiveTab(steps[i].tab);
              }}
              className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                judgeStep === i + 1 ? 'bg-sky-400 w-4' : 'bg-gray-600 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="flex items-center gap-1 px-4 py-1.5 rounded-lg text-xs font-bold bg-[#D76F30] hover:bg-[#c45e22] text-white transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <span>{judgeStep === totalSteps ? 'Finish Tour' : 'Next Step'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
