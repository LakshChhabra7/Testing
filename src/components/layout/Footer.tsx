import React from 'react';
import { ShieldCheck, Cpu, Terminal, Sparkles, BookOpen } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#070B14] border-t border-white/10 text-white py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-sky-950/60 border border-sky-400/40 flex items-center justify-center">
              <span className="text-[#38BDF8] font-bold text-xs">TS</span>
            </div>
            <span className="font-extrabold text-base tracking-tight font-display text-white">
              THERMOSHELTER <span className="text-[#D76F30]">AI</span>
            </span>
          </div>
          <p className="text-xs text-gray-400 max-w-md leading-relaxed">
            Climate-responsive design through transient thermodynamic simulation, multi-objective evolutionary optimization, and passive thermal mass engineering.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] font-mono text-gray-300">
            <span className="px-2.5 py-0.5 rounded bg-sky-950/50 border border-sky-500/30 text-[#38BDF8]">
              BIOCLIMATIC TWIN
            </span>
            <span className="px-2.5 py-0.5 rounded bg-white/5 border border-white/15 text-[#E99A68]">
              ASHRAE 55 COMFORT
            </span>
            <span className="px-2.5 py-0.5 rounded bg-white/5 border border-white/15 text-gray-300">
              ECBC / NBC STANDARDS
            </span>
          </div>
        </div>

        {/* Physics Formulation Summary */}
        <div className="space-y-2 text-xs">
          <h4 className="font-bold text-[#38BDF8] uppercase tracking-wider text-[11px] font-mono">
            Governing Physics Model
          </h4>
          <div className="p-3 rounded-lg bg-white/5 border border-white/10 font-mono text-[10px] space-y-1 text-gray-300">
            <p className="text-[#E99A68] font-bold">C_th · (dT_in/dt) =</p>
            <p className="pl-2">+ Q_solar + Q_internal</p>
            <p className="pl-2">- Q_conduction - Q_ventilation</p>
            <p className="pl-2">- Q_radiation - Q_infiltration</p>
          </div>
          <p className="text-[11px] text-gray-400">
            Transient numerical sub-stepping across 24h/72h meteorological cycles.
          </p>
        </div>

        {/* Platform Verification */}
        <div className="space-y-2 text-xs">
          <h4 className="font-bold text-[#D76F30] uppercase tracking-wider text-[11px] font-mono">
            Platform Verification
          </h4>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Engineered for high-altitude cold, hot-arid deserts, and coastal climates with zero fossil-fuel heating requirements.
          </p>
          <div className="pt-2 text-[10px] text-gray-500 font-mono">
            © 2026 THERMOSHELTER AI • Climate Simulation Platform
          </div>
        </div>
      </div>
    </footer>
  );
};
