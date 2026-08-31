import React, { useState } from 'react';
import { useShelter } from '../context/ShelterContext';
import { Shelter3DCanvas } from '../components/viewer3d/Shelter3DCanvas';
import { GlazingType, RoofType, ShadingType } from '../types';
import { SHELTER_DESIGNS, ShelterDesignRecord } from '../data/syntheticDataset';
import { 
  Sliders, 
  Sun, 
  Flame, 
  Layers, 
  Wind, 
  Sparkles, 
  Play, 
  RotateCcw, 
  Compass, 
  Maximize2, 
  ShieldCheck, 
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Cpu,
  BookOpen,
  Database
} from 'lucide-react';

export const DesignStudioPage: React.FC = () => {
  const { 
    shelterConfig, 
    updateShelterConfig, 
    activeClimate, 
    simulationResult, 
    currentHour,
    setCurrentHour,
    setActiveTab,
    startOptimization,
    loadPresetDemo
  } = useShelter();

  const [selectedDesignId, setSelectedDesignId] = useState<string>('D01');

  const handleSelectPreengineeredDesign = (designId: string) => {
    setSelectedDesignId(designId);
    const design = SHELTER_DESIGNS.find(d => d.Design_ID === designId);
    if (!design) return;

    // Parse orientation
    let ori = 0;
    if (design.Orientation === 'South' || design.Orientation === 'South-facing') ori = 0;
    else if (design.Orientation === 'East') ori = 90;
    else if (design.Orientation === 'West') ori = -90;
    else if (design.Orientation === 'North') ori = 180;
    else if (design.Orientation.includes('SE')) ori = -45;
    else if (design.Orientation.includes('SW')) ori = 45;

    updateShelterConfig({
      name: `${design.Design_ID} Prototype (${design.Climate_Archetype})`,
      lengthM: design.Shelter_Length_m,
      widthM: design.Shelter_Width_m,
      heightM: design.Shelter_Height_m,
      orientationDeg: ori,
      wwrSouth: Math.min(0.65, Math.max(0.05, design.Opening_to_Wall_Ratio * 2.2)),
      wwrNorth: Math.min(0.2, design.Opening_to_Wall_Ratio * 0.5),
      occupantCount: design.Number_of_Occupants || 3
    });
  };

  return (
    <div className="w-full min-h-[calc(100vh-110px)] bg-[#F0F9FF] text-slate-900 p-4 sm:p-6 lg:p-8">
      {/* Top Workspace Header Bar */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-sky-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-900 text-[#38BDF8]">
              <Sliders className="w-4 h-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold font-display text-slate-900">
              Thermal Design Studio
            </h1>
            <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 text-xs font-mono font-bold">
              LIVE DIGITAL TWIN
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1 font-sans">
            Adjust geometry, envelope layers, orientation, and fenestration to observe live thermodynamic response.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => loadPresetDemo('ladakh')}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-sky-50 text-slate-800 border border-sky-200 rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Demo</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('optimization');
              startOptimization('thermal_comfort', {
                maxBudgetTier: 'high',
                maxWallThicknessMm: 350,
                maxGlazingRatio: 0.5,
                requireNaturalMaterials: true
              });
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-[#38BDF8] border border-sky-400/40 rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E99A68]" />
            <span>Auto-Optimize Design</span>
          </button>

          <button
            onClick={() => setActiveTab('simulation')}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#D76F30] hover:bg-[#c45e22] text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Transient Solver (24h)</span>
          </button>
        </div>
      </div>

      {/* 3-PANE WORKSPACE GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANEL: CONFIGURATION PARAMETERS (4 COLS) */}
        <div className="lg:col-span-4 space-y-4 max-h-[85vh] overflow-y-auto pr-1">
          {/* 0. Pre-engineered Designs Library from Synthetic Dataset */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white border border-sky-500/30 shadow-md space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-[#38BDF8] flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-[#E99A68]" />
                <span>DATASET PRESET (D01-D40)</span>
              </span>
              <span className="text-[10px] text-gray-400">40 DESIGNS</span>
            </div>

            <select
              value={selectedDesignId}
              onChange={(e) => handleSelectPreengineeredDesign(e.target.value)}
              className="w-full p-2 bg-[#070B14] border border-sky-500/40 rounded-xl text-xs font-mono font-bold text-white focus:outline-none cursor-pointer"
            >
              {SHELTER_DESIGNS.map(d => (
                <option key={d.Design_ID} value={d.Design_ID}>
                  {d.Design_ID}: {d.Climate_Archetype} ({d.Shelter_Length_m}×{d.Shelter_Width_m}m, {d.Orientation})
                </option>
              ))}
            </select>
            <p className="text-[10px] text-gray-300 font-sans">
              Load pre-engineered configurations directly from dataset into the 3D solver.
            </p>
          </div>

          {/* 1. Geometry & Sizing */}
          <div className="p-4 rounded-2xl bg-white border border-sky-200/80 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
              <span>Shelter Geometry &amp; Sizing</span>
              <span className="font-mono text-[10px] text-sky-700">
                {(shelterConfig.lengthM * shelterConfig.widthM).toFixed(1)} m² Floor
              </span>
            </h3>

            {/* Length */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-600">Length (X - South Facade):</span>
                <span className="font-mono font-bold text-slate-900">{shelterConfig.lengthM} m</span>
              </div>
              <input
                type="range"
                min="3"
                max="12"
                step="0.5"
                value={shelterConfig.lengthM}
                onChange={(e) => updateShelterConfig({ lengthM: parseFloat(e.target.value) })}
                className="w-full accent-[#D76F30] cursor-pointer"
              />
            </div>

            {/* Width */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-600">Width (Y - Depth):</span>
                <span className="font-mono font-bold text-slate-900">{shelterConfig.widthM} m</span>
              </div>
              <input
                type="range"
                min="2.5"
                max="8"
                step="0.5"
                value={shelterConfig.widthM}
                onChange={(e) => updateShelterConfig({ widthM: parseFloat(e.target.value) })}
                className="w-full accent-[#D76F30] cursor-pointer"
              />
            </div>

            {/* Height */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-600">Ceiling Height (Z):</span>
                <span className="font-mono font-bold text-slate-900">{shelterConfig.heightM} m</span>
              </div>
              <input
                type="range"
                min="2.4"
                max="4.5"
                step="0.1"
                value={shelterConfig.heightM}
                onChange={(e) => updateShelterConfig({ heightM: parseFloat(e.target.value) })}
                className="w-full accent-[#D76F30] cursor-pointer"
              />
            </div>
          </div>

          {/* 2. Orientation & Solar Alignment */}
          <div className="p-4 rounded-2xl bg-white border border-sky-200/80 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
              <span>Solar Orientation (Azimuth)</span>
              <Compass className="w-3.5 h-3.5 text-[#D76F30]" />
            </h3>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-600">Azimuth Angle (0° = True South):</span>
                <span className="font-mono font-bold text-[#D76F30]">
                  {shelterConfig.orientationDeg > 0 ? `+${shelterConfig.orientationDeg}° (West)` : shelterConfig.orientationDeg < 0 ? `${shelterConfig.orientationDeg}° (East)` : '0° (True South)'}
                </span>
              </div>
              <input
                type="range"
                min="-45"
                max="45"
                step="5"
                value={shelterConfig.orientationDeg}
                onChange={(e) => updateShelterConfig({ orientationDeg: parseInt(e.target.value) })}
                className="w-full accent-[#D76F30] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                <span>-45° (SE)</span>
                <span>0° (South Solar Focus)</span>
                <span>+45° (SW)</span>
              </div>
            </div>
          </div>

          {/* 3. Fenestration & Glazing */}
          <div className="p-4 rounded-2xl bg-white border border-sky-200/80 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
              <span>Fenestration &amp; Glazing</span>
              <Sun className="w-3.5 h-3.5 text-[#38BDF8]" />
            </h3>

            {/* Glazing Specification */}
            <div className="space-y-1 text-xs">
              <label className="text-slate-600 block">Glazing Specification:</label>
              <select
                value={shelterConfig.glazingType}
                onChange={(e) => updateShelterConfig({ glazingType: e.target.value as GlazingType })}
                className="w-full p-2 bg-sky-50 border border-sky-200 rounded-lg text-xs font-semibold focus:outline-none cursor-pointer"
              >
                <option value="single_clear">Single Clear 6mm (U=5.7 W/m²K, SHGC=0.82)</option>
                <option value="double_clear">Double Clear 6-12-6 (U=2.8 W/m²K, SHGC=0.70)</option>
                <option value="double_low_e">Double Low-E + Argon (U=1.4 W/m²K, SHGC=0.42)</option>
                <option value="triple_argon">Triple Glazed Low-E (U=0.8 W/m²K, SHGC=0.35)</option>
              </select>
            </div>

            {/* South WWR */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-600">South Window Ratio (WWR):</span>
                <span className="font-mono font-bold text-[#D76F30]">
                  {Math.round(shelterConfig.wwrSouth * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.65"
                step="0.05"
                value={shelterConfig.wwrSouth}
                onChange={(e) => updateShelterConfig({ wwrSouth: parseFloat(e.target.value) })}
                className="w-full accent-[#D76F30] cursor-pointer"
              />
            </div>

            {/* North WWR */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-600">North Window Ratio (WWR):</span>
                <span className="font-mono font-bold text-slate-700">
                  {Math.round(shelterConfig.wwrNorth * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.0"
                max="0.30"
                step="0.02"
                value={shelterConfig.wwrNorth}
                onChange={(e) => updateShelterConfig({ wwrNorth: parseFloat(e.target.value) })}
                className="w-full accent-slate-800 cursor-pointer"
              />
            </div>

            {/* Shading Type */}
            <div className="space-y-1 text-xs">
              <label className="text-slate-600 block">Passive Shading &amp; Nocturnal Shutters:</label>
              <select
                value={shelterConfig.shadingType}
                onChange={(e) => updateShelterConfig({ shadingType: e.target.value as ShadingType })}
                className="w-full p-2 bg-sky-50 border border-sky-200 rounded-lg text-xs font-semibold focus:outline-none cursor-pointer"
              >
                <option value="none">No External Shading</option>
                <option value="overhang_30cm">30cm Fixed Solar Overhang</option>
                <option value="overhang_60cm">60cm Fixed Solar Overhang</option>
                <option value="louvers">Operable Horizontal Louvers</option>
                <option value="insulated_shutter">Insulated Nocturnal Thermal Shutters</option>
              </select>
            </div>
          </div>

          {/* 4. Envelopes & Thermal Storage Mass */}
          <div className="p-4 rounded-2xl bg-white border border-sky-200/80 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
              <span>Thermal Mass &amp; Infiltration</span>
              <Layers className="w-3.5 h-3.5 text-[#D76F30]" />
            </h3>

            {/* Infiltration ACH */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-600">Air Infiltration (ACH):</span>
                <span className="font-mono font-bold text-slate-900">{shelterConfig.infiltrationACH} ACH</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.0"
                step="0.1"
                value={shelterConfig.infiltrationACH}
                onChange={(e) => updateShelterConfig({ infiltrationACH: parseFloat(e.target.value) })}
                className="w-full accent-slate-800 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                <span>0.2 (Airtight)</span>
                <span>1.0 (Standard)</span>
                <span>2.0 (Drafty)</span>
              </div>
            </div>

            {/* Thermal Storage Wall Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-sky-100 text-xs">
              <div>
                <span className="font-bold text-slate-900 block">Interior Trombe Mass Wall</span>
                <span className="text-[10px] text-slate-500">Adds {shelterConfig.thermalStorageMassKg}kg high-capacity thermal storage</span>
              </div>
              <input
                type="checkbox"
                checked={shelterConfig.hasThermalStorageWall}
                onChange={(e) => updateShelterConfig({ hasThermalStorageWall: e.target.checked })}
                className="w-4 h-4 accent-[#38BDF8] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* CENTER PANEL: INTERACTIVE 3D DIGITAL TWIN (5 COLS) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="h-[560px] w-full rounded-3xl overflow-hidden shadow-xl border border-sky-300/40 bg-cover bg-center" style={{ backgroundImage: "url('/BG.jpg')" }}>
            <Shelter3DCanvas
              config={shelterConfig}
              currentHour={currentHour}
              latitude={activeClimate.latitude}
              indoorTemp={simulationResult.avgIndoorTemp}
              ambientTemp={activeClimate.hourlyAmbientTemp[currentHour]}
              mode="physical"
            />
          </div>

          {/* Time Scrubber */}
          <div className="p-4 rounded-2xl bg-white border border-sky-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-[#D76F30]" />
                <span>SOLAR TIME SCRUBBER</span>
              </span>
              <span className="px-2.5 py-0.5 rounded bg-slate-900 text-[#38BDF8] font-bold text-xs">
                {String(currentHour).padStart(2, '0')}:00 HRS
              </span>
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
            <div className="flex justify-between text-[10px] text-gray-500 font-mono">
              <span>00:00 (Night)</span>
              <span>06:00 (Dawn)</span>
              <span>12:00 (Noon)</span>
              <span>18:00 (Dusk)</span>
              <span>23:00 (Night)</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: LIVE THERMAL TELEMETRY & METRICS (3 COLS) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Main Status HUD */}
          <div className="p-5 rounded-2xl bg-[#0F172A] text-white border border-sky-500/30 shadow-xl space-y-4 font-mono">
            <div className="flex items-center justify-between pb-2 border-b border-sky-500/30">
              <span className="text-xs font-bold text-[#38BDF8]">PHYSICS TELEMETRY</span>
              <span className="text-[10px] text-gray-400">TRANSIENT 24H</span>
            </div>

            {/* Big Indoor Temp Gauge */}
            <div className="p-3 rounded-xl bg-slate-900 border border-sky-500/30 text-center space-y-1">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block">
                Predicted Mean Indoor Temp
              </span>
              <div className="text-3xl font-extrabold text-white">
                {simulationResult.avgIndoorTemp.toFixed(1)}°C
              </div>
              <div className="text-[11px] text-[#38BDF8]">
                Range: {simulationResult.minIndoorTemp.toFixed(1)}°C — {simulationResult.maxIndoorTemp.toFixed(1)}°C
              </div>
            </div>

            {/* Secondary KPIs */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2 rounded bg-white/5 border border-white/10">
                <span className="text-gray-400">Ambient (at {currentHour}:00):</span>
                <strong className="text-[#E99A68]">{activeClimate.hourlyAmbientTemp[currentHour]}°C</strong>
              </div>

              <div className="flex justify-between items-center p-2 rounded bg-white/5 border border-white/10">
                <span className="text-gray-400">Peak Solar Gain:</span>
                <strong className="text-[#38BDF8]">{simulationResult.peakSolarGainKW.toFixed(2)} kW</strong>
              </div>

              <div className="flex justify-between items-center p-2 rounded bg-white/5 border border-white/10">
                <span className="text-gray-400">Daily Total Heat Loss:</span>
                <strong className="text-[#D76F30]">{simulationResult.totalHeatLossKWh.toFixed(1)} kWh</strong>
              </div>

              <div className="flex justify-between items-center p-2 rounded bg-white/5 border border-white/10">
                <span className="text-gray-400">Passive Solar Fraction:</span>
                <strong className="text-[#38BDF8]">{simulationResult.passiveSolarFraction}%</strong>
              </div>

              <div className="flex justify-between items-center p-2 rounded bg-white/5 border border-white/10">
                <span className="text-gray-400">Comfort Score:</span>
                <strong className="text-white font-bold">{simulationResult.thermalComfortScore} / 100</strong>
              </div>
            </div>

            {/* Envelope U-Values Summary */}
            <div className="pt-2 border-t border-sky-500/30 space-y-1 text-[11px]">
              <span className="text-gray-400 block text-[9px] uppercase">Envelope Thermal Transmittance</span>
              <div className="flex justify-between">
                <span>Wall U-Value:</span>
                <span className="text-[#38BDF8] font-bold">{shelterConfig.wallAssembly.uValue} W/m²K</span>
              </div>
              <div className="flex justify-between">
                <span>Roof U-Value:</span>
                <span className="text-[#38BDF8] font-bold">{shelterConfig.roofAssembly.uValue} W/m²K</span>
              </div>
              <div className="flex justify-between">
                <span>Wall Time Lag:</span>
                <span className="text-[#E99A68] font-bold">{shelterConfig.wallAssembly.timeLagHours} Hours</span>
              </div>
            </div>
          </div>

          {/* Quick Action Card */}
          <div className="p-4 rounded-2xl bg-white border border-sky-200/80 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Engineering Actions
            </h4>
            <button
              onClick={() => setActiveTab('dataset')}
              className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-[#38BDF8] font-semibold text-xs rounded-lg flex items-center justify-between cursor-pointer"
            >
              <span>Explore 228 Scenarios</span>
              <Database className="w-3.5 h-3.5 text-[#E99A68]" />
            </button>
            <button
              onClick={() => setActiveTab('materials')}
              className="w-full py-2 px-3 bg-sky-50 hover:bg-sky-100 text-slate-800 font-semibold text-xs rounded-lg border border-sky-200 flex items-center justify-between cursor-pointer"
            >
              <span>Edit Wall Layers</span>
              <Layers className="w-3.5 h-3.5 text-[#D76F30]" />
            </button>
            <button
              onClick={() => setActiveTab('simulation')}
              className="w-full py-2 px-3 bg-sky-50 hover:bg-sky-100 text-slate-800 font-semibold text-xs rounded-lg border border-sky-200 flex items-center justify-between cursor-pointer"
            >
              <span>View Heat Flow &amp; Charts</span>
              <Flame className="w-3.5 h-3.5 text-[#D76F30]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
