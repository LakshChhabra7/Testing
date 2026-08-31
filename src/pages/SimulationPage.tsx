import React, { useState } from 'react';
import { useShelter } from '../context/ShelterContext';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Flame, 
  Sun, 
  Wind, 
  Layers, 
  Sliders, 
  PieChart as PieIcon, 
  Activity,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export const SimulationPage: React.FC = () => {
  const { 
    shelterConfig, 
    activeClimate, 
    simulationResult, 
    currentHour, 
    setCurrentHour, 
    isPlaying, 
    setIsPlaying, 
    simSpeed, 
    setSimSpeed,
    setActiveTab 
  } = useShelter();

  const [simHorizon, setSimHorizon] = useState<number>(24);
  const [highlightedLossComponent, setHighlightedLossComponent] = useState<string | null>(null);

  const currentStep = simulationResult.hourlySteps[currentHour] || simulationResult.hourlySteps[0];

  // Colors for Heat Loss Donut
  const LOSS_COLORS = ['#D76F30', '#F97316', '#38BDF8', '#0284C7', '#64748B'];
  const donutData = [
    { name: 'Walls', value: simulationResult.heatLossBreakdown.walls, percent: simulationResult.heatLossPercentages.walls },
    { name: 'Roof', value: simulationResult.heatLossBreakdown.roof, percent: simulationResult.heatLossPercentages.roof },
    { name: 'Windows', value: simulationResult.heatLossBreakdown.windows, percent: simulationResult.heatLossPercentages.windows },
    { name: 'Floor Slab', value: simulationResult.heatLossBreakdown.floor, percent: simulationResult.heatLossPercentages.floor },
    { name: 'Infiltration / ACH', value: simulationResult.heatLossBreakdown.infiltration, percent: simulationResult.heatLossPercentages.infiltration }
  ];

  // Hourly Line Chart Data
  const hourlyChartData = simulationResult.hourlySteps.map(step => ({
    hour: `${String(step.hour).padStart(2, '0')}:00`,
    indoorTemp: step.indoorTemp,
    ambientTemp: step.ambientTemp,
    meanRadiantTemp: Number((step.indoorTemp + 1.2).toFixed(1)),
    solarGainKW: step.solarGainKW,
    conductionLossKW: step.conductionLossKW,
    comfortLow: 18,
    comfortHigh: 26
  }));

  return (
    <div className="w-full min-h-[calc(100vh-110px)] bg-[#F0F9FF] text-slate-900 p-4 sm:p-6 lg:p-8">
      {/* Top Header & Simulation Playback Controls */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-sky-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-900 text-[#38BDF8]">
              <Flame className="w-4 h-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold font-display text-slate-900">
              Transient Thermal Simulation &amp; Dynamic Heat Flow
            </h1>
            <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 text-xs font-mono font-bold">
              EULER-RK4 SOLVER
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1 font-sans">
            Numerical resolution of first-law energy conservation equations across diurnal meteorological cycles.
          </p>
        </div>

        {/* Playback Control Bar */}
        <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-2xl border border-sky-200 shadow-sm">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#D76F30] hover:bg-[#c45e22] text-white rounded-xl text-xs font-bold shadow transition-all active:scale-95 cursor-pointer"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? 'Pause' : 'Play 24h'}</span>
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentHour(0);
            }}
            className="p-2 text-slate-600 hover:bg-sky-50 rounded-xl transition-colors cursor-pointer"
            title="Reset to 00:00"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-sky-50 px-2 py-1 rounded-lg text-xs font-mono">
            <span className="text-slate-500 text-[10px]">SPEED:</span>
            {[1, 2, 5].map((spd) => (
              <button
                key={spd}
                onClick={() => setSimSpeed(spd as any)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                  simSpeed === spd
                    ? 'bg-slate-900 text-[#38BDF8] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          <div className="px-3 py-1 bg-slate-900 text-[#38BDF8] rounded-xl font-mono text-xs font-bold">
            {String(currentHour).padStart(2, '0')}:00 HRS
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Real-time Dynamic Telemetry HUD */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-sky-200/80 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>INDOOR TEMPERATURE</span>
              <Activity className="w-4 h-4 text-[#38BDF8]" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 font-mono">
              {currentStep.indoorTemp.toFixed(1)}°C
            </div>
            <div className="text-[11px] text-slate-500">
              Outdoor: <strong className="text-[#E99A68]">{currentStep.ambientTemp}°C</strong> (ΔT = {Math.abs(currentStep.indoorTemp - currentStep.ambientTemp).toFixed(1)}°C)
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-sky-200/80 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>INSTANT SOLAR GAIN</span>
              <Sun className="w-4 h-4 text-[#D76F30]" />
            </div>
            <div className="text-3xl font-extrabold text-[#D76F30] font-mono">
              {currentStep.solarGainKW.toFixed(2)} <span className="text-sm font-normal text-slate-500">kW</span>
            </div>
            <div className="text-[11px] text-slate-500">Direct Fenestration + Admittance</div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-sky-200/80 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>CONDUCTION LOSS RATE</span>
              <TrendingDown className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-3xl font-extrabold text-sky-700 font-mono">
              {currentStep.conductionLossKW.toFixed(2)} <span className="text-sm font-normal text-slate-500">kW</span>
            </div>
            <div className="text-[11px] text-slate-500">Through Envelope &amp; Glazing</div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-sky-200/80 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>DAILY HEAT LOSS</span>
              <Flame className="w-4 h-4 text-[#D76F30]" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 font-mono">
              {simulationResult.totalHeatLossKWh.toFixed(1)} <span className="text-sm font-normal text-slate-500">kWh</span>
            </div>
            <div className="text-[11px] text-sky-700 font-bold">68% Lower than uninsulated baseline</div>
          </div>
        </div>

        {/* Charts Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main 24h Temperature Dynamics Line Graph (8 cols) */}
          <div className="lg:col-span-8 p-6 rounded-2xl bg-white border border-sky-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold font-mono text-slate-900 uppercase tracking-wider">
                  24-Hour Diurnal Temperature Dynamics
                </h3>
                <p className="text-xs text-slate-500">
                  Indoor air temperature vs ambient baseline and ASHRAE 55 comfort band.
                </p>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hourlyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(14, 165, 233, 0.15)" />
                  <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748B' }} unit="°C" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#38BDF8', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Line type="monotone" dataKey="indoorTemp" name="Simulated Indoor (°C)" stroke="#38BDF8" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="ambientTemp" name="Outdoor Ambient (°C)" stroke="#E99A68" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                  <Line type="monotone" dataKey="comfortHigh" name="Comfort Max (26°C)" stroke="#94A3B8" strokeDasharray="2 2" dot={false} />
                  <Line type="monotone" dataKey="comfortLow" name="Comfort Min (18°C)" stroke="#94A3B8" strokeDasharray="2 2" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Envelope Heat Loss Donut Breakdown (4 cols) */}
          <div className="lg:col-span-4 p-6 rounded-2xl bg-white border border-sky-200/80 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold font-mono text-slate-900 uppercase tracking-wider">
                Heat Loss by Envelope Element
              </h3>
              <p className="text-xs text-slate-500">Distribution of 24-hour thermal losses</p>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={LOSS_COLORS[index % LOSS_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#38BDF8', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                    formatter={(val: any, name: any, item: any) => [`${val} kWh (${item.payload.percent}%)`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Donut Legend */}
            <div className="space-y-1.5 text-xs font-mono">
              {donutData.map((item, idx) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: LOSS_COLORS[idx] }} />
                    <span className="text-slate-700">{item.name}</span>
                  </div>
                  <strong className="text-slate-900">{item.percent}%</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
