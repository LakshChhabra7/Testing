import React, { useState, useMemo } from 'react';
import { useShelter } from '../context/ShelterContext';
import { 
  ALL_FULL_SCENARIOS, 
  WEATHER_DATA, 
  SYNTHETIC_MATERIALS, 
  SHELTER_DESIGNS, 
  OUTPUT_BENEFITS, 
  DATA_DICTIONARY,
  FullScenarioData 
} from '../data/syntheticDataset';
import { 
  Database, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Layers, 
  Sun, 
  Thermometer, 
  Compass, 
  Download, 
  Info,
  BookOpen,
  Sliders,
  Award
} from 'lucide-react';

export const DatasetExplorerPage: React.FC = () => {
  const { updateShelterConfig, setClimate, setActiveTab } = useShelter();
  const [activeSheet, setActiveSheet] = useState<
    'scenarios' | 'weather' | 'materials' | 'designs' | 'outputs' | 'dictionary'
  >('scenarios');

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const [filterMatch, setFilterMatch] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedScenario, setSelectedScenario] = useState<FullScenarioData | null>(ALL_FULL_SCENARIOS[0] || null);

  // Filtered Scenarios
  const filteredScenarios = useMemo(() => {
    return ALL_FULL_SCENARIOS.filter(sc => {
      const matchSearch = 
        sc.Scenario_ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sc.Design_ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sc.Location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sc.Month.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchLoc = filterLocation === 'all' || sc.Location.toLowerCase() === filterLocation.toLowerCase();
      const matchType = filterMatch === 'all' || sc.Match_Type.toLowerCase() === filterMatch.toLowerCase();
      const matchStat = filterStatus === 'all' || sc.output?.Recommended_Status.toLowerCase() === filterStatus.toLowerCase();

      return matchSearch && matchLoc && matchType && matchStat;
    });
  }, [searchTerm, filterLocation, filterMatch, filterStatus]);

  // Load a scenario into the active digital twin
  const handleLoadScenarioIntoStudio = (sc: FullScenarioData) => {
    // Map location to zone
    const locLower = sc.Location.toLowerCase();
    if (locLower.includes('leh')) setClimate('ladakh');
    else if (locLower.includes('jaisalmer') || locLower.includes('rajasthan')) setClimate('rajasthan');
    else if (locLower.includes('delhi')) setClimate('delhi');
    else if (locLower.includes('lucknow')) setClimate('lucknow');
    else if (locLower.includes('bengaluru')) setClimate('bengaluru');
    else if (locLower.includes('chennai')) setClimate('chennai');

    updateShelterConfig({
      name: `${sc.Design_ID} (${sc.Location} - ${sc.Month})`,
      wwrSouth: Math.min(0.6, Math.max(0.05, sc.Opening_to_Wall_Ratio * 2)),
      infiltrationACH: sc.output?.Estimated_ACH || 0.5
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
              <Database className="w-4 h-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold font-display text-slate-900">
              Empirical Scenarios &amp; Data Explorer
            </h1>
            <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 text-xs font-mono font-bold">
              228 EMPIRICAL SCENARIOS
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1 font-sans">
            Complete dataset comprising 72 weather profiles, 20 materials, 40 prototype designs, 228 coupled scenarios, and comprehensive thermodynamic output benefits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-white border border-sky-200 font-mono text-xs font-bold text-slate-900 shadow-sm">
            TOTAL SCENARIOS: 228
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Sheet Selector Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-sky-200">
          {[
            { id: 'scenarios', label: '228 Coupled Scenarios', count: ALL_FULL_SCENARIOS.length },
            { id: 'weather', label: 'Weather Data (72 Mo)', count: WEATHER_DATA.length },
            { id: 'materials', label: 'Material Properties (20)', count: SYNTHETIC_MATERIALS.length },
            { id: 'designs', label: 'Shelter Designs (D01-D40)', count: SHELTER_DESIGNS.length },
            { id: 'outputs', label: 'Output Benefits & PMV', count: OUTPUT_BENEFITS.length },
            { id: 'dictionary', label: 'Data Dictionary (52 Fields)', count: DATA_DICTIONARY.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSheet(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                activeSheet === tab.id
                  ? 'bg-slate-900 text-[#38BDF8] border border-sky-400/40 shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-sky-50 border border-sky-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className="px-1.5 py-0.2 rounded bg-black/10 text-[10px] font-mono">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* 1. SCENARIOS TAB */}
        {activeSheet === 'scenarios' && (
          <div className="space-y-4">
            {/* Filter and Search Bar */}
            <div className="p-4 rounded-2xl bg-white border border-sky-200/80 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="flex-1 min-w-[240px] relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search Scenario (e.g. S001, Leh, D01, July)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-sky-50/60 rounded-xl text-xs font-medium focus:outline-none border border-transparent focus:border-sky-400"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                {/* Location Filter */}
                <select
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="p-2 bg-sky-50 border border-sky-200 rounded-xl font-medium focus:outline-none cursor-pointer"
                >
                  <option value="all">All Locations (6)</option>
                  <option value="leh">Leh</option>
                  <option value="jaisalmer">Jaisalmer</option>
                  <option value="delhi">Delhi</option>
                  <option value="lucknow">Lucknow</option>
                  <option value="bengaluru">Bengaluru</option>
                  <option value="chennai">Chennai</option>
                </select>

                {/* Match Type */}
                <select
                  value={filterMatch}
                  onChange={(e) => setFilterMatch(e.target.value)}
                  className="p-2 bg-sky-50 border border-sky-200 rounded-xl font-medium focus:outline-none cursor-pointer"
                >
                  <option value="all">All Matches</option>
                  <option value="matched">Matched Only</option>
                  <option value="mismatched">Mismatched Only</option>
                </select>

                {/* Status */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="p-2 bg-sky-50 border border-sky-200 rounded-xl font-medium focus:outline-none cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="recommended">Recommended</option>
                  <option value="not recommended">Not Recommended</option>
                </select>
              </div>
            </div>

            {/* Scenarios Table & Detail Inspector Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Scenarios Table (8 COLS) */}
              <div className="lg:col-span-8 bg-white rounded-2xl border border-sky-200/80 shadow-sm overflow-hidden">
                <div className="p-3 bg-slate-900 text-white flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-[#38BDF8]">
                    SCENARIOS MATRIX ({filteredScenarios.length} shown)
                  </span>
                  <span className="text-[10px] text-gray-400">CLICK ROW TO INSPECT</span>
                </div>

                <div className="max-h-[620px] overflow-y-auto">
                  <table className="w-full text-left text-xs font-mono border-collapse">
                    <thead className="sticky top-0 bg-sky-50 border-b border-sky-200 text-slate-900">
                      <tr>
                        <th className="p-2.5">ID</th>
                        <th className="p-2.5">Design</th>
                        <th className="p-2.5">Location</th>
                        <th className="p-2.5">Month</th>
                        <th className="p-2.5">T_out</th>
                        <th className="p-2.5">T_in</th>
                        <th className="p-2.5">U-Value</th>
                        <th className="p-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sky-100">
                      {filteredScenarios.map((sc) => {
                        const isSelected = selectedScenario?.Scenario_ID === sc.Scenario_ID;
                        const isRec = sc.output?.Recommended_Status === 'Recommended';
                        return (
                          <tr
                            key={sc.Scenario_ID}
                            onClick={() => setSelectedScenario(sc)}
                            className={`cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-sky-100 font-bold'
                                : 'hover:bg-sky-50/50'
                            }`}
                          >
                            <td className="p-2.5 font-bold text-slate-900">{sc.Scenario_ID}</td>
                            <td className="p-2.5 text-slate-700">{sc.Design_ID}</td>
                            <td className="p-2.5">{sc.Location}</td>
                            <td className="p-2.5 text-slate-500">{sc.Month}</td>
                            <td className="p-2.5">{sc.Outdoor_Temperature_C}°C</td>
                            <td className="p-2.5 text-[#D76F30] font-bold">
                              {sc.output?.Estimated_Indoor_Temperature_C.toFixed(1)}°C
                            </td>
                            <td className="p-2.5">{sc.U_value_Wm2K.toFixed(2)}</td>
                            <td className="p-2.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                isRec
                                  ? 'bg-sky-100 text-sky-800'
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {sc.output?.Recommended_Status || 'Evaluated'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Scenario Detail Inspector (4 COLS) */}
              <div className="lg:col-span-4 space-y-4">
                {selectedScenario ? (
                  <div className="p-5 rounded-2xl bg-slate-900 text-white border border-sky-400/30 shadow-xl space-y-4 font-mono">
                    <div className="flex items-center justify-between pb-2 border-b border-sky-400/30">
                      <div>
                        <span className="text-[10px] text-[#38BDF8] block font-bold">
                          SCENARIO INSPECTOR
                        </span>
                        <h3 className="text-base font-bold text-white">
                          {selectedScenario.Scenario_ID} — {selectedScenario.Location} ({selectedScenario.Month})
                        </h3>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-[#D76F30]/20 text-[#E99A68] text-[10px] font-bold">
                        {selectedScenario.Match_Type}
                      </span>
                    </div>

                    {/* Highlights */}
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between p-2 rounded bg-white/5">
                        <span className="text-gray-400">Design Prototype:</span>
                        <strong className="text-white">{selectedScenario.Design_ID}</strong>
                      </div>
                      <div className="flex justify-between p-2 rounded bg-white/5">
                        <span className="text-gray-400">Outdoor Temp:</span>
                        <strong className="text-[#E99A68]">{selectedScenario.Outdoor_Temperature_C}°C</strong>
                      </div>
                      <div className="flex justify-between p-2 rounded bg-white/5">
                        <span className="text-gray-400">Estimated Indoor:</span>
                        <strong className="text-[#38BDF8]">{selectedScenario.output?.Estimated_Indoor_Temperature_C.toFixed(1)}°C</strong>
                      </div>
                      <div className="flex justify-between p-2 rounded bg-white/5">
                        <span className="text-gray-400">Envelope U-Value:</span>
                        <strong className="text-white">{selectedScenario.U_value_Wm2K.toFixed(3)} W/m²K</strong>
                      </div>
                      <div className="flex justify-between p-2 rounded bg-white/5">
                        <span className="text-gray-400">Comfort Score:</span>
                        <strong className="text-[#38BDF8]">{selectedScenario.output?.Comfort_Score_0to100.toFixed(1)} / 100</strong>
                      </div>
                    </div>

                    {/* Recommendation Reason */}
                    {selectedScenario.output?.Primary_Recommendation_Reason && (
                      <div className="p-3 rounded-xl bg-slate-800/80 border border-sky-400/20 text-xs">
                        <span className="text-[#38BDF8] font-bold block text-[10px] uppercase mb-1">
                          Optimization Feedback
                        </span>
                        <p className="text-gray-200 text-[11px] leading-relaxed">
                          {selectedScenario.output.Primary_Recommendation_Reason}
                        </p>
                      </div>
                    )}

                    <button
                      onClick={() => handleLoadScenarioIntoStudio(selectedScenario)}
                      className="w-full py-2.5 px-4 bg-[#D76F30] hover:bg-[#c45e22] text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Load into Design Studio &amp; 3D Viewer</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-white border border-sky-200 text-center text-xs text-slate-500">
                    Select a scenario from the table to inspect details.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. WEATHER DATA TAB */}
        {activeSheet === 'weather' && (
          <div className="bg-white rounded-2xl border border-sky-200/80 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-[#38BDF8]">
                METEOROLOGICAL DATASET ({WEATHER_DATA.length} MONTHLY RECORDS ACROSS 6 CITIES)
              </span>
              <span>Synthetic_Dataset.xlsx : Weather_Data</span>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead className="sticky top-0 bg-sky-50 border-b border-sky-200 text-slate-900">
                  <tr>
                    <th className="p-2.5">Location</th>
                    <th className="p-2.5">Month</th>
                    <th className="p-2.5">Season</th>
                    <th className="p-2.5">Outdoor Temp (°C)</th>
                    <th className="p-2.5">Relative Humidity (%)</th>
                    <th className="p-2.5">Wind Speed (m/s)</th>
                    <th className="p-2.5">Solar (W/m²)</th>
                    <th className="p-2.5">Rainfall (mm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-100">
                  {WEATHER_DATA.map((w, idx) => (
                    <tr key={idx} className="hover:bg-sky-50/50">
                      <td className="p-2.5 font-bold text-slate-900">{w.Location}</td>
                      <td className="p-2.5">{w.Month}</td>
                      <td className="p-2.5 text-slate-500">{w.Season}</td>
                      <td className="p-2.5 font-bold text-[#D76F30]">{w.Outdoor_Temperature_C}°C</td>
                      <td className="p-2.5">{w.Relative_Humidity_pct}%</td>
                      <td className="p-2.5">{w.Wind_Speed_ms} m/s</td>
                      <td className="p-2.5 text-sky-700">{w.Solar_Radiation_Wm2.toFixed(1)}</td>
                      <td className="p-2.5">{w.Rainfall_mm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. MATERIAL PROPERTIES TAB */}
        {activeSheet === 'materials' && (
          <div className="bg-white rounded-2xl border border-sky-200/80 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-[#38BDF8]">
                THERMOPHYSICAL MATERIAL SPECIFICATIONS ({SYNTHETIC_MATERIALS.length} MATERIALS)
              </span>
              <span>Synthetic_Dataset.xlsx : Material_Properties</span>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead className="sticky top-0 bg-sky-50 border-b border-sky-200 text-slate-900">
                  <tr>
                    <th className="p-2.5">ID</th>
                    <th className="p-2.5">Material Name</th>
                    <th className="p-2.5">Category</th>
                    <th className="p-2.5">k (W/mK)</th>
                    <th className="p-2.5">Density (kg/m³)</th>
                    <th className="p-2.5">Specific Heat (J/kgK)</th>
                    <th className="p-2.5">Emissivity</th>
                    <th className="p-2.5">Cold Suitability</th>
                    <th className="p-2.5">Hot-Dry Suitability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-100">
                  {SYNTHETIC_MATERIALS.map((m) => (
                    <tr key={m.Material_ID} className="hover:bg-sky-50/50">
                      <td className="p-2.5 font-bold text-slate-900">{m.Material_ID}</td>
                      <td className="p-2.5 font-semibold">{m.Material_Name}</td>
                      <td className="p-2.5 text-slate-500">{m.Material_Category}</td>
                      <td className="p-2.5 font-bold text-[#D76F30]">{m.Thermal_Conductivity_k_WmK}</td>
                      <td className="p-2.5">{m.Density_kgm3}</td>
                      <td className="p-2.5">{m.Specific_Heat_JkgK}</td>
                      <td className="p-2.5">{m.Emissivity}</td>
                      <td className="p-2.5 text-xs">{m.Suitability_Cold_Climate}</td>
                      <td className="p-2.5 text-xs">{m.Suitability_Hot_Dry_Climate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. SHELTER DESIGNS TAB */}
        {activeSheet === 'designs' && (
          <div className="bg-white rounded-2xl border border-sky-200/80 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-[#38BDF8]">
                PRE-ENGINEERED PROTOTYPE DESIGNS ({SHELTER_DESIGNS.length} DESIGNS D01-D40)
              </span>
              <span>Synthetic_Dataset.xlsx : Shelter_Design</span>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead className="sticky top-0 bg-sky-50 border-b border-sky-200 text-slate-900">
                  <tr>
                    <th className="p-2.5">Design ID</th>
                    <th className="p-2.5">Target Archetype</th>
                    <th className="p-2.5">Dimensions (L×W×H)</th>
                    <th className="p-2.5">Orientation</th>
                    <th className="p-2.5">Wall Mat</th>
                    <th className="p-2.5">Insulation</th>
                    <th className="p-2.5">WWR</th>
                    <th className="p-2.5">Occupants</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-100">
                  {SHELTER_DESIGNS.map((d) => (
                    <tr key={d.Design_ID} className="hover:bg-sky-50/50">
                      <td className="p-2.5 font-bold text-slate-900">{d.Design_ID}</td>
                      <td className="p-2.5 font-semibold text-slate-800">{d.Climate_Archetype}</td>
                      <td className="p-2.5">{d.Shelter_Length_m}m × {d.Shelter_Width_m}m × {d.Shelter_Height_m}m</td>
                      <td className="p-2.5 text-[#D76F30] font-bold">{d.Orientation}</td>
                      <td className="p-2.5">{d.Wall_Material_ID} ({d.Wall_Thickness_mm}mm)</td>
                      <td className="p-2.5">{d.Insulation_Material_ID} ({d.Insulation_Thickness_mm}mm)</td>
                      <td className="p-2.5 text-sky-700">{(d.Opening_to_Wall_Ratio * 100).toFixed(1)}%</td>
                      <td className="p-2.5">{d.Number_of_Occupants}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. DATA DICTIONARY TAB */}
        {activeSheet === 'dictionary' && (
          <div className="bg-white rounded-2xl border border-sky-200/80 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-[#38BDF8]">
                DATA DICTIONARY &amp; THERMAL FIELD DEFINITIONS ({DATA_DICTIONARY.length} FIELDS)
              </span>
              <span>Synthetic_Dataset.xlsx : Data_Dictionary</span>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead className="sticky top-0 bg-sky-50 border-b border-sky-200 text-slate-900">
                  <tr>
                    <th className="p-2.5">Column Name</th>
                    <th className="p-2.5">Sheet</th>
                    <th className="p-2.5">Meaning</th>
                    <th className="p-2.5">Unit</th>
                    <th className="p-2.5">Engineering Relevance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-100">
                  {DATA_DICTIONARY.map((dict, idx) => (
                    <tr key={idx} className="hover:bg-sky-50/50">
                      <td className="p-2.5 font-bold text-slate-900">{dict.Column_Name}</td>
                      <td className="p-2.5 text-slate-500">{dict.Sheet}</td>
                      <td className="p-2.5 font-sans text-xs">{dict.Meaning}</td>
                      <td className="p-2.5 text-[#D76F30] font-bold">{dict.Unit}</td>
                      <td className="p-2.5 font-sans text-xs text-slate-700">{dict.Why_it_Matters_for_PS51}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
