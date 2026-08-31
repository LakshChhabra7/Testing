import React, { useState } from 'react';
import { useShelter } from '../context/ShelterContext';
import { MATERIALS_DATABASE } from '../data/materials';
import { Material, WallLayer } from '../types';
import { calculateCompositeAssembly, getMaterialById } from '../physics/compositeWall';
import { 
  Layers, 
  Plus, 
  Trash2, 
  ArrowDown, 
  ArrowUp, 
  Sparkles, 
  Sliders, 
  ShieldCheck, 
  Flame, 
  Check, 
  BarChart3,
  Clock,
  Zap
} from 'lucide-react';

export const MaterialsLabPage: React.FC = () => {
  const { shelterConfig, updateShelterConfig, setActiveTab } = useShelter();

  // Active Composite Wall Layers under editing
  const [layers, setLayers] = useState<WallLayer[]>(shelterConfig.wallAssembly.layers);
  const [selectedMaterialsForCompare, setSelectedMaterialsForCompare] = useState<string[]>([
    'mat_burnt_brick',
    'mat_rammed_earth',
    'mat_aac_block',
    'mat_puf_insulation'
  ]);

  // Recalculate assembly live
  const assembly = calculateCompositeAssembly('Custom Bioclimatic Envelope', layers);

  const handleAddLayer = (materialId: string = 'mat_puf_insulation') => {
    const mat = getMaterialById(materialId);
    const newLayer: WallLayer = {
      id: `layer_${Date.now()}`,
      materialId,
      thicknessMm: mat.defaultThicknessMm || 50
    };
    setLayers(prev => [...prev, newLayer]);
  };

  const handleRemoveLayer = (index: number) => {
    if (layers.length <= 1) return;
    setLayers(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateThickness = (index: number, thick: number) => {
    setLayers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], thicknessMm: thick };
      return updated;
    });
  };

  const handleUpdateMaterial = (index: number, matId: string) => {
    setLayers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], materialId: matId };
      return updated;
    });
  };

  const handleSaveAssemblyToShelter = () => {
    updateShelterConfig({
      wallAssembly: assembly
    });
    setActiveTab('studio');
  };

  return (
    <div className="w-full min-h-[calc(100vh-110px)] bg-[#F0F9FF] text-slate-900 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-sky-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-900 text-[#38BDF8]">
              <Layers className="w-4 h-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold font-display text-slate-900">
              Materials Laboratory &amp; Composite Envelope Builder
            </h1>
            <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 text-xs font-mono font-bold">
              20 REGIONAL MATERIALS
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1 font-sans">
            Synthesize multi-layer composite walls, calculate periodic admittance, time lag (phase shift), and U-values dynamically.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveAssemblyToShelter}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#D76F30] hover:bg-[#c45e22] text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply Wall to Digital Twin</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANEL: INTERACTIVE MULTI-LAYER STACK BUILDER (7 COLS) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl bg-white border border-sky-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-sky-100">
              <span className="text-xs font-mono font-bold text-slate-900 uppercase">
                Composite Wall Assembly ({layers.length} Layers)
              </span>
              <button
                onClick={() => handleAddLayer()}
                className="flex items-center gap-1 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Layer</span>
              </button>
            </div>

            {/* Visual Cross-Section Representation */}
            <div className="p-4 rounded-xl bg-[#070B14] border border-sky-500/30 text-white space-y-2 font-mono">
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>OUTSIDE (EXTERIOR ENVIRONMENT)</span>
                <span>INSIDE (SHELTER CORE)</span>
              </div>

              {/* Graphical Layers Bar */}
              <div className="h-12 w-full rounded-lg overflow-hidden flex border border-white/20">
                {layers.map((layer, idx) => {
                  const mat = getMaterialById(layer.materialId);
                  return (
                    <div
                      key={layer.id || idx}
                      style={{ flexGrow: layer.thicknessMm }}
                      className={`h-full flex items-center justify-center text-[10px] font-bold px-1 border-r border-black/40 overflow-hidden text-ellipsis whitespace-nowrap ${
                        idx === 0 ? 'bg-sky-800 text-white' : idx === layers.length - 1 ? 'bg-slate-700 text-white' : 'bg-sky-600 text-white'
                      }`}
                      title={`${mat.name} (${layer.thicknessMm}mm)`}
                    >
                      {mat.name.split(' ')[0]} ({layer.thicknessMm}mm)
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Layers Configuration List */}
            <div className="space-y-3 pt-2">
              {layers.map((layer, idx) => {
                const mat = getMaterialById(layer.materialId);
                const rVal = ((layer.thicknessMm / 1000) / mat.thermalConductivity).toFixed(2);

                return (
                  <div
                    key={layer.id || idx}
                    className="p-3.5 rounded-xl bg-sky-50/50 border border-sky-200 flex flex-wrap items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-[240px]">
                      <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono font-bold flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <select
                          value={layer.materialId}
                          onChange={(e) => handleUpdateMaterial(idx, e.target.value)}
                          className="w-full p-1.5 bg-white border border-sky-300 rounded-lg text-xs font-semibold focus:outline-none cursor-pointer"
                        >
                          {MATERIALS_DATABASE.map(m => (
                            <option key={m.id} value={m.id}>
                              {m.name} (k={m.thermalConductivity} W/mK)
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Thickness Slider */}
                    <div className="flex items-center gap-3 min-w-[180px]">
                      <div className="space-y-0.5 flex-1">
                        <div className="flex justify-between text-[11px] font-mono">
                          <span className="text-slate-500">Thickness:</span>
                          <strong className="text-slate-900">{layer.thicknessMm} mm</strong>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="400"
                          step="5"
                          value={layer.thicknessMm}
                          onChange={(e) => handleUpdateThickness(idx, parseInt(e.target.value))}
                          className="w-full accent-[#D76F30] cursor-pointer"
                        />
                      </div>

                      <div className="text-right font-mono min-w-[60px]">
                        <span className="text-[10px] text-slate-500 block">R-Value</span>
                        <strong className="text-sky-700 font-bold">{rVal} m²K/W</strong>
                      </div>

                      <button
                        onClick={() => handleRemoveLayer(idx)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete layer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: COMPUTED THERMOPHYSICAL PROPERTIES (5 COLS) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900 text-white border border-sky-400/30 shadow-xl space-y-5 font-mono">
            <div className="flex items-center justify-between pb-2 border-b border-sky-400/30">
              <span className="text-xs font-bold text-[#38BDF8]">
                CALCULATED ENVELOPE PERFORMANCE
              </span>
              <span className="text-[10px] text-gray-400">MACKEY-WRIGHT ADMITTANCE</span>
            </div>

            {/* Big U-Value HUD */}
            <div className="p-4 rounded-xl bg-black/40 border border-sky-500/30 text-center space-y-1">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block">
                Overall Thermal Transmittance (U-Value)
              </span>
              <div className="text-4xl font-extrabold text-[#38BDF8]">
                {assembly.uValue} <span className="text-sm font-normal text-gray-400">W/m²K</span>
              </div>
              <p className="text-[11px] text-[#E99A68]">
                Total Assembly Thermal Resistance R: {assembly.rValue.toFixed(2)} m²K/W
              </p>
            </div>

            {/* Dynamic Thermal Mass & Time Lag Cards */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-gray-400 text-[10px] block">THERMAL TIME LAG (φ)</span>
                <strong className="text-xl text-[#38BDF8] flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{assembly.timeLagHours} Hours</span>
                </strong>
                <span className="text-[10px] text-gray-400 block">Peak heat delay</span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-gray-400 text-[10px] block">DECREMENT FACTOR (f)</span>
                <strong className="text-xl text-[#E99A68] flex items-center gap-1.5">
                  <Zap className="w-4 h-4" />
                  <span>{assembly.decrementFactor}</span>
                </strong>
                <span className="text-[10px] text-gray-400 block">Wave amplitude damping</span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-gray-400 text-[10px] block">TOTAL THICKNESS</span>
                <strong className="text-xl text-white">
                  {assembly.totalThicknessMm} mm
                </strong>
                <span className="text-[10px] text-gray-400 block">Wall depth</span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-gray-400 text-[10px] block">HEAT CAPACITY (C)</span>
                <strong className="text-xl text-[#38BDF8]">
                  {assembly.totalThermalMassCapacity.toFixed(0)} <span className="text-[10px] font-normal">kJ/m²K</span>
                </strong>
                <span className="text-[10px] text-gray-400 block">Volumetric storage</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
