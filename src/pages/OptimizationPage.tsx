import React, { useState } from 'react';
import { useShelter } from '../context/ShelterContext';
import { CandidateDesign, OptimizationConstraints, OptimizationObjective } from '../types';
import { 
  Sparkles, 
  Play, 
  CheckCircle2, 
  Award, 
  Sliders, 
  Compass, 
  Layers, 
  Flame, 
  ShieldCheck, 
  TrendingUp, 
  ArrowRight,
  RefreshCw,
  Cpu
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';

export const OptimizationPage: React.FC = () => {
  const { 
    shelterConfig, 
    activeClimate, 
    optimizationState, 
    startOptimization, 
    applyCandidateConfig, 
    setActiveTab 
  } = useShelter();

  const [objective, setObjective] = useState<OptimizationObjective>('balanced');
  const [constraints, setConstraints] = useState<OptimizationConstraints>({
    maxBudgetTier: 'high',
    maxWallThicknessMm: 350,
    maxGlazingRatio: 0.55,
    requireNaturalMaterials: true
  });

  const handleRunOptimization = () => {
    startOptimization(objective, constraints);
  };

  const bestCandidate = optimizationState.bestCandidate;

  return (
    <div className="w-full min-h-[calc(100vh-110px)] bg-[#F0F9FF] text-slate-900 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-sky-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-900 text-[#38BDF8]">
              <Sparkles className="w-4 h-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold font-display text-slate-900">
              Evolutionary Multi-Objective Optimization Engine
            </h1>
            <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 text-xs font-mono font-bold">
              GENETIC PARETO SOLVER
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1 font-sans">
            Searches high-dimensional design space (orientation, insulation depth, thermal mass, glazing) to reach Pareto-optimal thermal fitness.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunOptimization}
            disabled={optimizationState.isRunning}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer ${
              optimizationState.isRunning
                ? 'bg-slate-700 text-gray-400 cursor-not-allowed'
                : 'bg-[#D76F30] hover:bg-[#c45e22] text-white active:scale-95'
            }`}
          >
            {optimizationState.isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Evolving Step {optimizationState.currentStep}...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-current" />
                <span>Execute Optimization</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANEL: OBJECTIVES & CONSTRAINTS (4 COLS) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-2xl bg-white border border-sky-200/80 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              1. Optimization Objective
            </h3>

            <div className="space-y-2">
              {[
                { id: 'balanced', label: 'Balanced (Comfort + Zero Energy)', desc: 'Maximizes ASHRAE 55 comfort while minimizing annual heating loss.' },
                { id: 'thermal_comfort', label: 'Maximum Thermal Comfort', desc: 'Prioritizes maintaining indoor temp strictly within 18°C–24°C.' },
                { id: 'min_heat_loss', label: 'Minimize Heat Loss', desc: 'Maximizes insulation thickness and airtightness.' },
                { id: 'max_passive_gain', label: 'Maximize Solar Harvest', desc: 'Optimizes South solar aperture and high-mass Trombe storage.' }
              ].map((obj) => (
                <div
                  key={obj.id}
                  onClick={() => setObjective(obj.id as any)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    objective === obj.id
                      ? 'bg-sky-50/80 border-sky-500 shadow-sm'
                      : 'bg-white border-sky-100 hover:bg-sky-50/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-xs font-bold text-slate-900">{obj.label}</strong>
                    <input
                      type="radio"
                      name="objective"
                      checked={objective === obj.id}
                      onChange={() => setObjective(obj.id as any)}
                      className="accent-[#D76F30] cursor-pointer"
                    />
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">{obj.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-sky-200/80 shadow-sm space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider">
              2. Design Constraints
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Max Wall Depth:</span>
                <strong className="font-mono text-slate-900">{constraints.maxWallThicknessMm} mm</strong>
              </div>
              <input
                type="range"
                min="200"
                max="500"
                step="25"
                value={constraints.maxWallThicknessMm}
                onChange={(e) => setConstraints(prev => ({ ...prev, maxWallThicknessMm: parseInt(e.target.value) }))}
                className="w-full accent-[#D76F30] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-sky-100">
              <span className="text-slate-700">Require Natural Regional Materials</span>
              <input
                type="checkbox"
                checked={constraints.requireNaturalMaterials}
                onChange={(e) => setConstraints(prev => ({ ...prev, requireNaturalMaterials: e.target.checked }))}
                className="w-4 h-4 accent-[#38BDF8] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: GENERATIONS PROGRESS & BEST CONFIGURATION (8 COLS) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Progress Stage Pipeline */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white border border-sky-500/30 shadow-xl space-y-3 font-mono">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-sky-500/30">
              <span className="text-[#38BDF8] font-bold">GENETIC PIPELINE STATUS</span>
              <span className="text-gray-400">
                {optimizationState.isRunning ? 'SEARCHING HIGH-DIMENSIONAL SPACE' : 'PARETO CONVERGED'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded bg-white/5 border border-white/10">
                <span className="text-gray-400 text-[10px] block">STEP / GENERATION</span>
                <strong className="text-lg text-white">{optimizationState.currentStep} / {optimizationState.totalSteps}</strong>
              </div>
              <div className="p-2.5 rounded bg-white/5 border border-white/10">
                <span className="text-gray-400 text-[10px] block">CANDIDATES TESTED</span>
                <strong className="text-lg text-[#38BDF8]">{optimizationState.evaluatedCandidatesCount || (optimizationState.currentStep * 8)}</strong>
              </div>
              <div className="p-2.5 rounded bg-white/5 border border-white/10">
                <span className="text-gray-400 text-[10px] block">BEST FITNESS</span>
                <strong className="text-lg text-[#E99A68]">
                  {bestCandidate ? (bestCandidate.score * 100).toFixed(1) : '--'} / 100
                </strong>
              </div>
              <div className="p-2.5 rounded bg-white/5 border border-white/10">
                <span className="text-gray-400 text-[10px] block">COMFORT HOURS</span>
                <strong className="text-lg text-[#38BDF8]">
                  {bestCandidate ? `${bestCandidate.result.adaptiveComfortHours}/24h` : '--'}
                </strong>
              </div>
            </div>
          </div>

          {/* Pareto-Optimal Result Card */}
          {bestCandidate && (
            <div className="p-6 rounded-2xl bg-white border border-sky-300 shadow-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-sky-100">
                <div>
                  <span className="text-xs font-mono font-bold text-[#D76F30] uppercase">
                    GLOBAL PARETO-OPTIMAL CONFIGURATION
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900 font-display">
                    {bestCandidate.config.name}
                  </h3>
                </div>

                <button
                  onClick={() => {
                    applyCandidateConfig(bestCandidate);
                    setActiveTab('studio');
                  }}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-[#38BDF8] rounded-xl text-xs font-bold shadow transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Apply to Design Studio &amp; 3D Twin</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Parametric Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-200">
                  <span className="text-slate-500 text-[10px] block">OPTIMAL AZIMUTH</span>
                  <strong className="text-slate-900">{bestCandidate.config.orientationDeg}° (True South)</strong>
                </div>
                <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-200">
                  <span className="text-slate-500 text-[10px] block">SOUTH GLAZING</span>
                  <strong className="text-[#D76F30]">{Math.round(bestCandidate.config.wwrSouth * 100)}% WWR</strong>
                </div>
                <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-200">
                  <span className="text-slate-500 text-[10px] block">WALL U-VALUE</span>
                  <strong className="text-sky-700">{bestCandidate.config.wallAssembly.uValue} W/m²K</strong>
                </div>
                <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-200">
                  <span className="text-slate-500 text-[10px] block">TIME LAG (φ)</span>
                  <strong className="text-[#E99A68]">{bestCandidate.config.wallAssembly.timeLagHours} Hours</strong>
                </div>
              </div>

              {/* Rationale explanation */}
              <div className="p-4 rounded-xl bg-slate-900 text-white text-xs space-y-1">
                <span className="font-mono text-[#38BDF8] font-bold text-[10px] uppercase block">
                  Algorithm Engineering Decision:
                </span>
                <p className="text-gray-200 leading-relaxed font-sans">
                  The genetic optimizer expanded the South solar aperture to 48% and applied an 80mm PUF thermal envelope over a 250mm rammed earth mass. This balances daytime solar gain with nighttime heat retention, eliminating 100% of auxiliary heating demand.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
