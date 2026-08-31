import React from 'react';
import { useShelter } from '../context/ShelterContext';
import { CLIMATE_PROFILES } from '../data/climates';
import { ClimateZoneId } from '../types';
import { runTransientThermalSimulation } from '../physics/thermalSolver';
import { 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  Thermometer, 
  Sun, 
  Wind, 
  Flame, 
  ArrowRight,
  ShieldCheck,
  Award
} from 'lucide-react';

export const MultiClimatePage: React.FC = () => {
  const { shelterConfig, setClimate, setActiveTab } = useShelter();

  // Run simulation of the active shelter across all 6 climate zones
  const zoneIds: ClimateZoneId[] = ['ladakh', 'rajasthan', 'delhi', 'lucknow', 'bengaluru', 'chennai'];
  const multiZoneResults = zoneIds.map(zoneId => {
    const climate = CLIMATE_PROFILES[zoneId];
    const result = runTransientThermalSimulation(shelterConfig, climate, 24);
    return {
      zoneId,
      climate,
      result
    };
  });

  return (
    <div className="w-full min-h-[calc(100vh-110px)] bg-[#F0F9FF] text-slate-900 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-sky-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-900 text-[#38BDF8]">
              <MapPin className="w-4 h-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold font-display text-slate-900">
              Multi-Climate Performance Matrix
            </h1>
            <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 text-xs font-mono font-bold">
              ONE MODEL VS 6 CLIMATES
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1 font-sans">
            Evaluating the current shelter configuration simultaneously across 6 distinct bioclimatic zones.
          </p>
        </div>

        <div className="p-2 bg-slate-900 text-[#38BDF8] rounded-xl font-mono text-xs font-bold border border-sky-400/40">
          CORE PRINCIPLE: ONE SHELTER ≠ OPTIMAL EVERYWHERE
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Core Thesis Card */}
        <div className="p-5 rounded-2xl bg-white border border-sky-200/80 shadow-sm space-y-2">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Why Area-Specific Passive Design Matters
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed font-sans">
            Notice how the current shelter (tailored with high solar capture and heavy insulation for <strong>Ladakh</strong>) maintains <strong>18.5°C</strong> in extreme winter cold, but if deployed unaltered in <strong>Rajasthan</strong> or <strong>Chennai</strong>, it causes severe solar overheating due to excessive direct gain. This demonstrates the critical importance of area-specific passive optimization.
          </p>
        </div>

        {/* 6-Zone Comparison Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {multiZoneResults.map(({ zoneId, climate, result }) => {
            const isLadakh = zoneId === 'ladakh';
            const isOverheating = result.maxIndoorTemp > 28;
            const isOptimal = result.thermalComfortScore >= 80;

            return (
              <div
                key={zoneId}
                className={`p-6 rounded-2xl bg-white border transition-all shadow-sm space-y-4 flex flex-col justify-between ${
                  isOptimal
                    ? 'border-sky-500 ring-2 ring-sky-300'
                    : isOverheating
                    ? 'border-[#D76F30]/60'
                    : 'border-sky-200/80'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-sky-100">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-[#D76F30] uppercase">
                        {climate.altitudeM}m Altitude
                      </span>
                      <h4 className="text-lg font-extrabold text-slate-900 font-display">
                        {climate.name}
                      </h4>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      isOptimal
                        ? 'bg-sky-100 text-sky-800'
                        : isOverheating
                        ? 'bg-[#D76F30]/20 text-[#D76F30]'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {isOptimal ? 'OPTIMAL' : isOverheating ? 'OVERHEATING RISK' : 'SUB-OPTIMAL'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500">
                    {climate.classification}
                  </p>

                  {/* Simulated Metrics */}
                  <div className="space-y-2 font-mono text-xs">
                    <div className="flex justify-between p-2 rounded bg-sky-50/70">
                      <span className="text-slate-600">Indoor Temp:</span>
                      <strong className={result.avgIndoorTemp < 16 ? 'text-blue-700' : result.avgIndoorTemp > 28 ? 'text-[#D76F30]' : 'text-slate-900'}>
                        {result.avgIndoorTemp.toFixed(1)}°C (Range: {result.minIndoorTemp}°–{result.maxIndoorTemp}°)
                      </strong>
                    </div>

                    <div className="flex justify-between p-2 rounded bg-sky-50/70">
                      <span className="text-slate-600">Ambient Temp:</span>
                      <strong>{climate.designWinterTemp}°C to {climate.designSummerTemp}°C</strong>
                    </div>

                    <div className="flex justify-between p-2 rounded bg-sky-50/70">
                      <span className="text-slate-600">Daily Solar Gain:</span>
                      <strong className="text-[#38BDF8]">{result.totalSolarGainKWh.toFixed(1)} kWh</strong>
                    </div>

                    <div className="flex justify-between p-2 rounded bg-sky-50/70">
                      <span className="text-slate-600">Thermal Score:</span>
                      <strong className="text-slate-900 font-bold">{result.thermalComfortScore} / 100</strong>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setClimate(zoneId);
                    setActiveTab('studio');
                  }}
                  className="w-full mt-3 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-[#38BDF8] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Switch &amp; Optimize for {climate.name.split(',')[0]}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
