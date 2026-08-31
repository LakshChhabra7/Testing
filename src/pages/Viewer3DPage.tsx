import React, { useState } from 'react';
import { useShelter } from '../context/ShelterContext';
import { Shelter3DCanvas } from '../components/viewer3d/Shelter3DCanvas';
import { ViewerMode } from '../types';
import { 
  Cpu, 
  Sun, 
  Flame, 
  Wind, 
  Layers, 
  Eye, 
  Sliders, 
  Compass, 
  Maximize2, 
  RotateCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const Viewer3DPage: React.FC = () => {
  const { 
    shelterConfig, 
    activeClimate, 
    simulationResult, 
    currentHour, 
    setCurrentHour,
    setActiveTab 
  } = useShelter();

  const [viewerMode, setViewerMode] = useState<ViewerMode>('thermal');

  return (
    <div className="w-full min-h-[calc(100vh-110px)] bg-[#070B14] text-[#F8FAFC] p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
      {/* Top Controls Bar */}
      <div className="max-w-7xl mx-auto w-full mb-4 flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-sky-500/20 font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-slate-900 text-[#38BDF8] border border-sky-400/40">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              <span>3D DIGITAL SHELTER TWIN</span>
              <span className="px-2 py-0.5 rounded bg-sky-500/20 text-[#38BDF8] text-[10px]">
                WEBGL 60FPS
              </span>
            </h1>
            <p className="text-[11px] text-gray-400">
              Interactive 3D geometry with dynamic solar incidence rays and infrared thermal heatmap.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-sky-500/30">
            <span className="text-gray-400">ORIENTATION:</span>
            <strong className="text-[#D76F30]">{shelterConfig.orientationDeg}° (S-Bias)</strong>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-sky-500/30">
            <span className="text-gray-400">T_INDOOR:</span>
            <strong className="text-[#38BDF8]">{simulationResult.avgIndoorTemp.toFixed(1)}°C</strong>
          </div>
        </div>
      </div>

      {/* Main 3D Canvas Viewport */}
      <div className="max-w-7xl mx-auto w-full h-[620px] rounded-3xl overflow-hidden shadow-2xl border border-sky-400/30 relative bg-cover bg-center" style={{ backgroundImage: "url('/BG.jpg')" }}>
        <Shelter3DCanvas
          config={shelterConfig}
          currentHour={currentHour}
          latitude={activeClimate.latitude}
          indoorTemp={simulationResult.avgIndoorTemp}
          ambientTemp={activeClimate.hourlyAmbientTemp[currentHour]}
          mode={viewerMode}
          onModeChange={setViewerMode}
        />
      </div>

      {/* Bottom Timeline Controls */}
      <div className="max-w-7xl mx-auto w-full mt-4 p-4 rounded-2xl bg-slate-900/80 border border-sky-500/20 backdrop-blur-md flex flex-wrap items-center justify-between gap-6 font-mono text-xs">
        <div className="flex-1 min-w-[280px] space-y-1.5">
          <div className="flex justify-between text-gray-300">
            <span className="flex items-center gap-2 text-[#E99A68] font-bold">
              <Sun className="w-4 h-4" />
              <span>CELESTIAL SOLAR HOUR</span>
            </span>
            <strong className="text-white bg-black/60 px-2 py-0.5 rounded border border-white/20">
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
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('studio')}
            className="px-4 py-2 bg-[#D76F30] hover:bg-[#c45e22] text-white font-bold rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Open Design Studio Sliders</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
