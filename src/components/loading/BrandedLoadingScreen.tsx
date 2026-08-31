import React, { useState, useEffect } from 'react';

interface BrandedLoadingScreenProps {
  onComplete: () => void;
}

export const BrandedLoadingScreen: React.FC<BrandedLoadingScreenProps> = ({ onComplete }) => {
  const [stepIndex, setStepIndex] = useState<number>(0);

  const logs = [
    { module: 'Climate module (ECBC & IMD datasets)', status: 'READY' },
    { module: 'Material database (Thermophysical properties)', status: 'READY' },
    { module: 'Geometry & 3D WebGL engine', status: 'READY' },
    { module: 'Transient thermodynamic ODE solver', status: 'READY' },
    { module: 'Evolutionary multi-objective search', status: 'READY' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex(prev => {
        if (prev < logs.length) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setTimeout(onComplete, 300);
          return prev;
        }
      });
    }, 280);

    return () => clearInterval(timer);
  }, [logs.length, onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#070B14] text-white flex flex-col items-center justify-center p-6 bg-grid-dark select-none">
      <div className="max-w-md w-full space-y-6">
        {/* Emblem & Brand */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-slate-900 to-sky-950 border-2 border-sky-400 flex items-center justify-center shadow-2xl animate-sky-pulse">
            <svg viewBox="0 0 24 24" className="w-9 h-9 stroke-[#38BDF8] fill-none" strokeWidth="2">
              <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" strokeLinejoin="round" />
              <path d="M9 21V12h6v9" stroke="#D76F30" />
              <circle cx="12" cy="7.5" r="1.5" fill="#D76F30" />
            </svg>
          </div>

          <h1 className="text-2xl font-black font-display tracking-tight text-white">
            THERMOSHELTER <span className="text-[#D76F30]">AI</span>
          </h1>
          <p className="text-xs font-mono text-[#38BDF8]">
            INITIALIZING THERMAL SIMULATION PLATFORM...
          </p>
        </div>

        {/* Boot Logs */}
        <div className="p-4 rounded-xl bg-black/60 border border-sky-500/20 font-mono text-xs space-y-2">
          {logs.map((log, idx) => (
            <div
              key={log.module}
              className={`flex items-center justify-between transition-opacity duration-200 ${
                stepIndex >= idx + 1 ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <span className="text-gray-400">{log.module}</span>
              <span className="text-[#38BDF8] font-bold">● {log.status}</span>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#38BDF8] to-[#D76F30] h-full rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, (stepIndex / logs.length) * 100)}%` }}
          />
        </div>

        <div className="text-center text-[10px] font-mono text-gray-400">
          Area-Specific Passive Shelter Thermal Design &amp; Simulation Platform
        </div>
      </div>
    </div>
  );
};
