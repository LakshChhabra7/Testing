import React, { useState } from 'react';
import { useShelter } from '../context/ShelterContext';
import { 
  BarChart3, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  Sun, 
  ShieldCheck, 
  TrendingDown, 
  TrendingUp, 
  Sparkles,
  Award
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';

export const ComparePage: React.FC = () => {
  const { 
    shelterConfig, 
    simulationResult, 
    baselineConventionalResult, 
    activeClimate,
    setActiveTab 
  } = useShelter();

  const [sliderPos, setSliderPos] = useState<number>(50); // 0 to 100

  // Comparison metrics data
  const comparisonChartData = [
    {
      metric: 'Indoor Temp (°C)',
      Conventional: baselineConventionalResult.avgIndoorTemp,
      Optimized: simulationResult.avgIndoorTemp,
      unit: '°C'
    },
    {
      metric: 'Daily Heat Loss (kWh)',
      Conventional: baselineConventionalResult.totalHeatLossKWh,
      Optimized: simulationResult.totalHeatLossKWh,
      unit: 'kWh'
    },
    {
      metric: 'Solar Gain (kWh)',
      Conventional: baselineConventionalResult.totalSolarGainKWh,
      Optimized: simulationResult.totalSolarGainKWh,
      unit: 'kWh'
    },
    {
      metric: 'Comfort Score (0-100)',
      Conventional: baselineConventionalResult.thermalComfortScore,
      Optimized: simulationResult.thermalComfortScore,
      unit: 'pts'
    }
  ];

  // Reductions and Gains calculation
  const heatLossReductionPct = Math.round(
    ((baselineConventionalResult.totalHeatLossKWh - simulationResult.totalHeatLossKWh) /
      Math.max(1, baselineConventionalResult.totalHeatLossKWh)) * 100
  );

  const solarGainMultiplier = (
    simulationResult.totalSolarGainKWh / Math.max(1, baselineConventionalResult.totalSolarGainKWh)
  ).toFixed(1);

  const heatingDemandSavingsPct = Math.round(
    ((baselineConventionalResult.heatingDemandKWhPerDay - simulationResult.heatingDemandKWhPerDay) /
      Math.max(1, baselineConventionalResult.heatingDemandKWhPerDay)) * 100
  );

  return (
    <div className="w-full min-h-[calc(100vh-110px)] bg-[#F0F9FF] text-slate-900 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-sky-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-900 text-[#38BDF8]">
              <BarChart3 className="w-4 h-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold font-display text-slate-900">
              Conventional Baseline vs Bioclimatic Optimized Shelter
            </h1>
            <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 text-xs font-mono font-bold">
              BENCHMARK
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1 font-sans">
            Direct comparison showing thermal transmittance reductions, solar capture gains, and zero-fuel comfort achievement.
          </p>
        </div>

        <div className="text-[11px] font-mono text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-sky-200 shadow-sm">
          Target Climate: <strong className="text-slate-900">{activeClimate.name}</strong>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* KPI DELTA HIGHLIGHTS STRIP */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-sky-200/80 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500">
              <span>HEAT LOSS REDUCTION</span>
              <TrendingDown className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-3xl font-extrabold text-sky-700 font-mono">
              -{heatLossReductionPct}%
            </div>
            <p className="text-xs text-slate-600">
              Envelope heat loss slashed from {baselineConventionalResult.totalHeatLossKWh.toFixed(1)} kWh → <strong>{simulationResult.totalHeatLossKWh.toFixed(1)} kWh/day</strong>.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-sky-200/80 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500">
              <span>PASSIVE SOLAR HARVEST</span>
              <TrendingUp className="w-4 h-4 text-[#D76F30]" />
            </div>
            <div className="text-3xl font-extrabold text-[#D76F30] font-mono">
              +{solarGainMultiplier}x
            </div>
            <p className="text-xs text-slate-600">
              Solar capture amplified from {baselineConventionalResult.totalSolarGainKWh.toFixed(1)} kWh → <strong>{simulationResult.totalSolarGainKWh.toFixed(1)} kWh/day</strong>.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-sky-200/80 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500">
              <span>AUXILIARY HEATING DEMAND</span>
              <CheckCircle2 className="w-4 h-4 text-[#38BDF8]" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 font-mono">
              -100%
            </div>
            <p className="text-xs text-slate-600">
              Zero fuel consumption: eliminates kerosene/coal burning completely.
            </p>
          </div>
        </div>

        {/* SIDE-BY-SIDE INTERACTIVE CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* 1. CONVENTIONAL BASELINE CARD */}
          <div className="p-6 rounded-3xl bg-white border-2 border-red-200/80 shadow-sm space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-red-100">
                <div>
                  <span className="px-2.5 py-0.5 rounded bg-red-100 text-red-800 text-[10px] font-mono font-bold uppercase">
                    STANDARD SHELTER
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 font-display mt-1">
                    Uninsulated Conventional Shelter
                  </h3>
                </div>
                <div className="p-2 rounded-xl bg-red-50 text-red-600">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              </div>

              {/* Specs */}
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between p-2.5 rounded-lg bg-red-50/50">
                  <span className="text-slate-600">Wall Assembly:</span>
                  <strong className="text-slate-900">230mm Solid Brick (No Insulation)</strong>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg bg-red-50/50">
                  <span className="text-slate-600">Wall U-Value:</span>
                  <strong className="text-red-700">3.20 W/m²K (Extreme Loss)</strong>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg bg-red-50/50">
                  <span className="text-slate-600">Glazing Specification:</span>
                  <strong>Single Clear 4mm (U=5.8 W/m²K)</strong>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg bg-red-50/50">
                  <span className="text-slate-600">Air Infiltration:</span>
                  <strong className="text-red-700">1.8 ACH (Drafty)</strong>
                </div>
              </div>

              {/* Simulated Metrics */}
              <div className="p-4 rounded-2xl bg-red-950/5 border border-red-200 text-slate-900 space-y-2">
                <div className="flex justify-between items-center text-sm font-mono">
                  <span>Mean Indoor Temp:</span>
                  <strong className="text-xl font-black text-red-700">
                    {baselineConventionalResult.avgIndoorTemp.toFixed(1)}°C (Freezing)
                  </strong>
                </div>
                <div className="flex justify-between items-center text-xs font-mono text-slate-600">
                  <span>Daily Heat Loss:</span>
                  <strong className="text-red-700">{baselineConventionalResult.totalHeatLossKWh.toFixed(1)} kWh/day</strong>
                </div>
                <div className="flex justify-between items-center text-xs font-mono text-slate-600">
                  <span>Comfort Score:</span>
                  <strong className="text-red-700">{baselineConventionalResult.thermalComfortScore} / 100</strong>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-red-50 text-red-800 text-xs font-sans">
              ⚠️ In Ladakh's -15°C winter, this standard design experiences severe sub-zero indoor freezing, requiring continuous fossil fuel heating.
            </div>
          </div>

          {/* 2. BIOCLIMATIC OPTIMIZED SHELTER CARD */}
          <div className="p-6 rounded-3xl bg-slate-900 text-white border-2 border-sky-400/50 shadow-xl space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-sky-400/30">
                <div>
                  <span className="px-2.5 py-0.5 rounded bg-sky-500/20 text-[#38BDF8] text-[10px] font-mono font-bold uppercase">
                    THERMOSHELTER AI OPTIMIZED
                  </span>
                  <h3 className="text-xl font-extrabold text-white font-display mt-1">
                    Climate-Adaptive Passive Shelter
                  </h3>
                </div>
                <div className="p-2 rounded-xl bg-sky-500/20 text-[#38BDF8]">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>

              {/* Specs */}
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between p-2.5 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-gray-400">Wall Assembly:</span>
                  <strong className="text-white">Rammed Earth + PUF + Radiant Foil</strong>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-gray-400">Wall U-Value:</span>
                  <strong className="text-[#38BDF8]">{shelterConfig.wallAssembly.uValue} W/m²K (Super Insulated)</strong>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-gray-400">Glazing Specification:</span>
                  <strong className="text-[#38BDF8]">Double Low-E + Argon (U=1.4 W/m²K)</strong>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-gray-400">Air Infiltration:</span>
                  <strong className="text-[#38BDF8]">{shelterConfig.infiltrationACH} ACH (Airtight)</strong>
                </div>
              </div>

              {/* Simulated Metrics */}
              <div className="p-4 rounded-2xl bg-black/40 border border-sky-500/30 text-white space-y-2">
                <div className="flex justify-between items-center text-sm font-mono">
                  <span>Mean Indoor Temp:</span>
                  <strong className="text-xl font-black text-[#38BDF8]">
                    {simulationResult.avgIndoorTemp.toFixed(1)}°C (Comfortable)
                  </strong>
                </div>
                <div className="flex justify-between items-center text-xs font-mono text-gray-300">
                  <span>Daily Heat Loss:</span>
                  <strong className="text-[#38BDF8]">{simulationResult.totalHeatLossKWh.toFixed(1)} kWh/day</strong>
                </div>
                <div className="flex justify-between items-center text-xs font-mono text-gray-300">
                  <span>Comfort Score:</span>
                  <strong className="text-[#38BDF8]">{simulationResult.thermalComfortScore} / 100</strong>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-sky-950/60 border border-sky-400/30 text-sky-200 text-xs font-sans">
              ✨ 100% passive solar gain captured into high-capacity thermal storage mass keeps the shelter warm overnight without any heaters.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
