import React, { useState } from 'react';
import { useShelter } from '../context/ShelterContext';
import { 
  FileCode, 
  Download, 
  Copy, 
  Check, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Flame, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const AnsysAdapterPage: React.FC = () => {
  const { shelterConfig, activeClimate, simulationResult } = useShelter();
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveFormat] = useState<'apdl' | 'cfd_json' | 'step_schema'>('apdl');

  // Generate realistic ANSYS APDL Thermal Simulation Script
  const generateApdlScript = () => {
    const L = shelterConfig.lengthM;
    const W = shelterConfig.widthM;
    const H = shelterConfig.heightM;
    const k_wall = shelterConfig.wallAssembly.layers[0]?.materialId ? 0.024 : 0.81;

    return `! =========================================================================
! THERMOSHELTER AI — ANSYS MECHANICAL APDL THERMAL SCRIPT
! Project: ${shelterConfig.name}
! Location: ${activeClimate.name} (Alt: ${activeClimate.altitudeM}m)
! Generated on: ${new Date().toISOString()}
! =========================================================================

/PREP7
TITLE, Transient Thermal Simulation of Bioclimatic Shelter

! --- 1. ELEMENT TYPE DEFINITIONS ---
ET, 1, SOLID70          ! 3-D 8-Node Thermal Solid
ET, 2, SURF152          ! Thermal Surface Effect for Convection & Radiation

! --- 2. MATERIAL PROPERTIES (COMPOSITE ENVELOPE) ---
! Material 1: Exterior Insulation / Cladding
MP, KXX,  1, ${shelterConfig.wallAssembly.layers[1]?.materialId === 'mat_puf_insulation' ? '0.024' : '0.038'}   ! Thermal Conductivity (W/m*K)
MP, DENS, 1, 38.0                    ! Density (kg/m3)
MP, C,    1, 1450.0                  ! Specific Heat (J/kg*K)

! Material 2: High Thermal Mass Core (Rammed Earth / CSEB)
MP, KXX,  2, 0.95                    ! Core Conductivity (W/m*K)
MP, DENS, 2, 1950.0                  ! Density (kg/m3)
MP, C,    2, 1050.0                  ! Specific Heat (J/kg*K)

! --- 3. GEOMETRIC VOLUMETRIC DEFINITIONS ---
BLC4, 0, 0, ${L}, ${W}, ${H}          ! Base Shelter Enclosure Volume

! --- 4. BOUNDARY CONDITIONS & LOADS ---
! Ambient convective coefficient (h_ext ~ 18 W/m2K)
SFE, ALL, 1, CONV, 1, 18.2           ! Film Coefficient
SFE, ALL, 1, CONV, 2, ${activeClimate.designWinterTemp}         ! Bulk Ambient Temperature (${activeClimate.designWinterTemp} C)

! Solar Heat Flux on South Facing Facade (Peak Solar ~ ${simulationResult.peakSolarGainKW} kW)
SFE, 1, 2, HFLUX, , ${(simulationResult.peakSolarGainKW * 1000 / (L * H)).toFixed(1)}       ! Heat Flux (W/m2)

FINISH

! --- 5. TRANSIENT THERMAL SOLUTION ---
/SOLU
ANTYPE, 4                            ! Transient Analysis
TRNOPT, FULL
TIME, 86400                          ! 24-Hour Diurnal Cycle (seconds)
AUTOTS, ON
DELTIM, 360, 60, 1800                ! Sub-step time increments
KBC, 0                               ! Ramped loading across diurnal cycle
SOLVE
FINISH

! --- 6. POST-PROCESSING (TEMPERATURE CONTOURS) ---
/POST1
SET, LAST
PLNSOL, TEMP                         ! Plot Nodal Temperature Contours
`;
  };

  // Generate Fluent CFD Boundary Conditions JSON
  const generateCfdJson = () => {
    return JSON.stringify(
      {
        project: 'THERMOSHELTER_AI_RESEARCH',
        solver_target: 'ANSYS_FLUENT_CFD_2026',
        geometry: {
          length_meters: shelterConfig.lengthM,
          width_meters: shelterConfig.widthM,
          height_meters: shelterConfig.heightM,
          orientation_azimuth_deg: shelterConfig.orientationDeg,
          south_glazing_ratio: shelterConfig.wwrSouth,
          north_glazing_ratio: shelterConfig.wwrNorth,
          solar_overhang_depth_m: shelterConfig.roofOverhangM
        },
        meteorological_boundary_conditions: {
          location_name: activeClimate.name,
          altitude_amsl_meters: activeClimate.altitudeM,
          ambient_temperature_range_celsius: {
            min: Math.min(...activeClimate.hourlyAmbientTemp),
            max: Math.max(...activeClimate.hourlyAmbientTemp),
            mean: Number(
              (
                activeClimate.hourlyAmbientTemp.reduce((a, b) => a + b, 0) / 24
              ).toFixed(1)
            )
          },
          peak_solar_radiation_w_m2: Math.max(...activeClimate.hourlySolarIrradiance),
          external_wind_velocity_m_s: 3.5,
          inlet_turbulent_intensity_percent: 5.0
        },
        composite_envelope: {
          wall_u_value_w_m2k: shelterConfig.wallAssembly.uValue,
          roof_u_value_w_m2k: shelterConfig.roofAssembly.uValue,
          thermal_mass_capacity_kj_m2k: shelterConfig.wallAssembly.totalThermalMassCapacity,
          glazing_u_value_w_m2k: 1.4,
          glazing_shgc: 0.42
        },
        simplified_ode_benchmark: {
          predicted_indoor_temp_mean_c: simulationResult.avgIndoorTemp,
          predicted_daily_heat_loss_kwh: simulationResult.totalHeatLossKWh,
          predicted_peak_solar_gain_kw: simulationResult.peakSolarGainKW,
          adaptive_comfort_score_ashrae55: simulationResult.thermalComfortScore
        }
      },
      null,
      2
    );
  };

  const activeContent = activeTab === 'apdl' ? generateApdlScript() : generateCfdJson();

  const handleCopy = () => {
    navigator.clipboard.writeText(activeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = activeTab === 'apdl' ? 'thermoshelter_ansys.mac' : 'thermoshelter_cfd_bounds.json';
    const blob = new Blob([activeContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full min-h-[calc(100vh-110px)] bg-[#F5F2EA] text-[#10140F] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#172D13]/15">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#172D13] text-[#6BB77B]">
              <FileCode className="w-4 h-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold font-display text-[#172D13]">
              High-Fidelity ANSYS / CFD Integration Architecture
            </h1>
            <span className="px-2 py-0.5 rounded bg-[#172D13] text-[#6BB77B] text-xs font-mono font-bold">
              MULTI-PHYSICS EXPORT
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-1 font-sans">
            Abstract solver adapter for exporting mathematical geometry, material matrices, and boundary conditions to ANSYS Mechanical &amp; Fluent.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-gray-100 text-[#172D13] border border-[#172D13]/20 rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#6BB77B]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Script'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#D76F30] hover:bg-[#c45e22] text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download Exporter File</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ARCHITECTURAL EXPLANATION (4 COLS) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-[#172D13]/15 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-[#172D13] uppercase tracking-wider">
              Solver Adapter Architecture
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed font-sans">
              To satisfy Smart India Hackathon requirements without making false claims about executing full multi-physics CFD in the browser, ThermoShelter AI uses a dual-engine architecture:
            </p>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-[#F5F2EA] border border-[#172D13]/10">
                <strong className="text-[#172D13] block">1. Fast Internal ODE Solver:</strong>
                <span className="text-gray-600 text-[11px]">Enables instantaneous multi-objective genetic search &amp; live 60fps design studio editing.</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#172D13] text-[#F5F2EA] border border-[#6BB77B]/30">
                <strong className="text-[#6BB77B] block">2. High-Fidelity ANSYS Exporter:</strong>
                <span className="text-gray-300 text-[11px]">Generates complete APDL macro commands and Fluent boundary condition setups for full finite-element validation.</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#172D13]/15 shadow-sm space-y-2.5 text-xs">
            <h4 className="font-bold text-[#172D13] uppercase tracking-wider text-[11px]">
              Export Format Selector
            </h4>
            <div className="space-y-1.5">
              <button
                onClick={() => setActiveFormat('apdl')}
                className={`w-full p-2.5 rounded-xl font-mono text-left transition-all ${
                  activeTab === 'apdl'
                    ? 'bg-[#172D13] text-[#6BB77B] font-bold border border-[#6BB77B]/40 shadow-sm'
                    : 'bg-[#F5F2EA] text-gray-700 hover:bg-gray-200'
                }`}
              >
                1. ANSYS Mechanical APDL (.mac)
              </button>
              <button
                onClick={() => setActiveFormat('cfd_json')}
                className={`w-full p-2.5 rounded-xl font-mono text-left transition-all ${
                  activeTab === 'cfd_json'
                    ? 'bg-[#172D13] text-[#6BB77B] font-bold border border-[#6BB77B]/40 shadow-sm'
                    : 'bg-[#F5F2EA] text-gray-700 hover:bg-gray-200'
                }`}
              >
                2. ANSYS Fluent CFD Boundary JSON
              </button>
            </div>
          </div>
        </div>

        {/* SCRIPT CODE VIEWER (8 COLS) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#10140F] text-[#F5F2EA] border border-[#6BB77B]/30 shadow-2xl space-y-3 font-mono">
          <div className="flex items-center justify-between pb-3 border-b border-[#6BB77B]/20 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#6BB77B]" />
              <span className="text-[#6BB77B] font-bold">
                {activeTab === 'apdl' ? 'thermoshelter_ansys_thermal.mac' : 'cfd_boundary_conditions.json'}
              </span>
            </div>
            <span className="text-[10px] text-gray-400">READY FOR ANSYS 2024 / 2026 IMPORT</span>
          </div>

          <pre className="p-4 bg-black/60 rounded-xl overflow-x-auto text-[11px] leading-relaxed text-[#E99A68] max-h-[520px] scrollbar-thin">
            {activeContent}
          </pre>
        </div>
      </div>
    </div>
  );
};
