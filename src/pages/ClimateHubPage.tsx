import React, { useState } from 'react';
import { useShelter } from '../context/ShelterContext';
import { CLIMATE_PROFILES } from '../data/climates';
import { ClimateZoneId } from '../types';
import { 
  SunMedium, 
  MapPin, 
  Thermometer, 
  Sun, 
  Wind, 
  Droplets, 
  Activity, 
  ShieldCheck, 
  Radio, 
  Sliders, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';

export const ClimateHubPage: React.FC = () => {
  const { activeClimateId, setClimate, activeClimate, setActiveTab } = useShelter();
  const [dataSource, setDataSource] = useState<'dataset' | 'live_api'>('dataset');
  const [timeHorizon, setTimeHorizon] = useState<'1day' | '7days' | '30days'>('1day');

  // Format 24-hour chart dataset
  const chartData = activeClimate.hourlyAmbientTemp.map((temp, hour) => ({
    hour: `${String(hour).padStart(2, '0')}:00`,
    temperature: temp,
    solarIrradiance: activeClimate.hourlySolarIrradiance[hour],
    humidity: activeClimate.hourlyRelativeHumidity[hour],
    windSpeed: activeClimate.hourlyWindSpeed[hour],
    comfortBandLow: 18.0,
    comfortBandHigh: 26.0
  }));

  return (
    <div className="w-full min-h-[calc(100vh-110px)] bg-[#F0F9FF] text-slate-900 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-sky-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-900 text-[#38BDF8]">
              <SunMedium className="w-4 h-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold font-display text-slate-900">
              Climate Intelligence &amp; Meteorological Hub
            </h1>
            <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 text-xs font-mono font-bold">
              SOLAR &amp; WEATHER VECTORS
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1 font-sans">
            Diurnal temperature swings, solar radiation profiles, humidity, and adaptive comfort envelope across representative climatic zones.
          </p>
        </div>

        {/* Climate Region Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {(Object.keys(CLIMATE_PROFILES) as ClimateZoneId[]).map((zoneId) => {
            const isSelected = activeClimateId === zoneId;
            return (
              <button
                key={zoneId}
                onClick={() => setClimate(zoneId)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-[#38BDF8] border border-sky-400/50 shadow-md'
                    : 'bg-white text-slate-700 hover:bg-sky-50 border border-sky-200'
                }`}
              >
                {CLIMATE_PROFILES[zoneId].name.split(',')[0]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-sky-200/80 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>DESIGN WINTER AMBIENT</span>
              <Thermometer className="w-4 h-4 text-[#D76F30]" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">
              {activeClimate.designWinterTemp}°C
            </div>
            <div className="text-[11px] text-slate-500">Extreme Winter Night Floor</div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-sky-200/80 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>DESIGN SUMMER PEAK</span>
              <Sun className="w-4 h-4 text-[#D76F30]" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">
              {activeClimate.designSummerTemp}°C
            </div>
            <div className="text-[11px] text-slate-500">Extreme Summer Solstice Peak</div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-sky-200/80 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>PEAK SOLAR IRRADIANCE</span>
              <SunMedium className="w-4 h-4 text-[#0284C7]" />
            </div>
            <div className="text-2xl font-extrabold text-[#0284C7] font-mono">
              {Math.max(...activeClimate.hourlySolarIrradiance)} W/m²
            </div>
            <div className="text-[11px] text-slate-500">Direct Normal + Diffuse Flux</div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-sky-200/80 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>ALTITUDE (AMSL)</span>
              <MapPin className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">
              {activeClimate.altitudeM} m
            </div>
            <div className="text-[11px] text-slate-500">{activeClimate.classification.split(' - ')[0]}</div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Diurnal Temp vs Comfort Band Chart (8 cols) */}
          <div className="lg:col-span-8 p-6 rounded-2xl bg-white border border-sky-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold font-mono text-slate-900 uppercase tracking-wider">
                  24-Hour Diurnal Temperature vs ASHRAE 55 Adaptive Comfort Band
                </h3>
                <p className="text-xs text-slate-500">
                  Visualizing outdoor temperature deficit relative to the 18°C–26°C human thermal comfort threshold.
                </p>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D76F30" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#D76F30" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="colorComfort" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(14, 165, 233, 0.15)" />
                  <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748B' }} unit="°C" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#38BDF8', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Area type="monotone" dataKey="temperature" name="Ambient Temp (°C)" stroke="#D76F30" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTemp)" />
                  <Area type="monotone" dataKey="comfortBandHigh" name="Comfort Upper (26°C)" stroke="#38BDF8" strokeDasharray="3 3" fillOpacity={1} fill="url(#colorComfort)" />
                  <Area type="monotone" dataKey="comfortBandLow" name="Comfort Lower (18°C)" stroke="#0284C7" strokeDasharray="3 3" fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Solar Radiation Flux Curve (4 cols) */}
          <div className="lg:col-span-4 p-6 rounded-2xl bg-white border border-sky-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold font-mono text-slate-900 uppercase tracking-wider">
                  Solar Radiation Profile
                </h3>
                <p className="text-xs text-slate-500">Hourly incident flux (W/m²)</p>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(14, 165, 233, 0.15)" />
                  <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748B' }} unit="W" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#38BDF8', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="solarIrradiance" name="Solar Radiation (W/m²)" stroke="#0284C7" strokeWidth={2} fillOpacity={1} fill="url(#colorSolar)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bioclimatic Strategy Recommendation Card */}
        <div className="p-6 rounded-2xl bg-slate-900 text-white border border-sky-400/30 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-sky-400/30">
            <span className="text-xs font-mono font-bold text-[#38BDF8]">
              CLIMATE-SPECIFIC PASSIVE STRATEGY: {activeClimate.name.toUpperCase()}
            </span>
            <span className="text-xs font-mono text-gray-400">
              {activeClimate.region}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
            <div className="space-y-1">
              <strong className="text-[#E99A68] block font-mono text-xs uppercase">1. Thermal Challenge:</strong>
              <p className="text-gray-300 font-sans">{activeClimate.thermalChallenge}</p>
            </div>
            <div className="space-y-1">
              <strong className="text-[#38BDF8] block font-mono text-xs uppercase">2. Architectural Strategy:</strong>
              <p className="text-gray-300 font-sans">{activeClimate.designStrategy}</p>
            </div>
          </div>

          <div className="pt-3 border-t border-sky-500/20 flex justify-end">
            <button
              onClick={() => setActiveTab('studio')}
              className="py-2 px-4 bg-[#D76F30] hover:bg-[#c45e22] text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Apply Strategy to Design Studio</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
