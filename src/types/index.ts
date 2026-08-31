// THERMOSHELTER AI — Area-Specific Passive Shelter Thermal Design & Simulation Platform

export type ClimateZoneId = 'ladakh' | 'rajasthan' | 'delhi' | 'lucknow' | 'bengaluru' | 'chennai';

export interface ClimateProfile {
  id: ClimateZoneId;
  name: string;
  region: string;
  classification: string;
  latitude: number;
  longitude: number;
  altitudeM: number;
  description: string;
  seasonSummary: string;
  thermalChallenge: string;
  designStrategy: string;
  hourlyAmbientTemp: number[]; // 24h diurnal curve [0..23] in °C
  hourlySolarIrradiance: number[]; // 24h W/m²
  hourlyRelativeHumidity: number[]; // 24h %
  hourlyWindSpeed: number[]; // 24h m/s
  designWinterTemp: number; // °C
  designSummerTemp: number; // °C
}

export type MaterialCategory = 'masonry' | 'insulation' | 'finishing' | 'natural_mass' | 'glazing' | 'core_composite';

export interface Material {
  id: string;
  name: string;
  category: MaterialCategory;
  thermalConductivity: number; // k in W/(m·K)
  density: number; // kg/m³
  specificHeat: number; // c_p in J/(kg·K)
  solarAbsorptivity: number; // alpha (0-1)
  thermalEmissivity: number; // epsilon (0-1)
  defaultThicknessMm: number; // mm
  embodiedCarbonKgCO2: number; // kg CO2 / m³
  costIndex: number; // relative 1-10
  description: string;
  localAvailability: string[];
}

export interface WallLayer {
  id: string;
  materialId: string;
  thicknessMm: number;
}

export interface CompositeAssembly {
  name: string;
  layers: WallLayer[];
  totalThicknessMm: number;
  rValue: number; // m²·K/W
  uValue: number; // W/(m²·K)
  totalThermalMassCapacity: number; // kJ/(m²·K)
  timeLagHours: number; // hours
  decrementFactor: number; // dimensionless (0-1)
}

export type RoofType = 'flat' | 'sloped_single' | 'gabled' | 'vaulted';
export type ShadingType = 'none' | 'overhang_30cm' | 'overhang_60cm' | 'louvers' | 'insulated_shutter';
export type GlazingType = 'single_clear' | 'double_clear' | 'double_low_e' | 'triple_argon';

export interface ShelterConfig {
  id: string;
  name: string;
  locationId: ClimateZoneId;
  lengthM: number; // X-dimension (m)
  widthM: number;  // Y-dimension (m)
  heightM: number; // Z-dimension (m)
  orientationDeg: number; // 0 = South-facing front, 90 = East, 180 = North, 270 = West
  roofType: RoofType;
  roofPitchDeg: number;
  roofOverhangM: number;
  
  // Envelopes
  wallAssembly: CompositeAssembly;
  roofAssembly: CompositeAssembly;
  floorAssembly: CompositeAssembly;
  
  // Glazing by orientation
  glazingType: GlazingType;
  wwrSouth: number; // Window-to-wall ratio South (0-0.8)
  wwrNorth: number; // Window-to-wall ratio North (0-0.8)
  wwrEast: number;  // Window-to-wall ratio East (0-0.8)
  wwrWest: number;  // Window-to-wall ratio West (0-0.8)
  
  // Passive & Infiltration
  shadingType: ShadingType;
  infiltrationACH: number; // Air changes per hour (0.2 to 2.5)
  occupantCount: number; // ~80W sensible heat each
  hasThermalStorageWall: boolean; // Trombe wall / interior heavy mass
  thermalStorageMassKg: number;
}

export interface HourlySimulationStep {
  hour: number;
  timeLabel: string;
  ambientTemp: number;
  indoorTemp: number;
  solAirTempSouth: number;
  solarIrradiance: number;
  solarGainKW: number;
  conductionLossKW: number;
  ventilationLossKW: number;
  radiationLossKW: number;
  internalGainKW: number;
  netHeatFlowKW: number;
  thermalStorageTemp: number;
  comfortPMV: number;
  comfortIndexPercent: number; // 0-100%
  isComfortable: boolean;
}

export interface SimulationResult {
  hourlySteps: HourlySimulationStep[];
  minIndoorTemp: number;
  maxIndoorTemp: number;
  avgIndoorTemp: number;
  diurnalSwingIndoor: number;
  minAmbientTemp: number;
  maxAmbientTemp: number;
  diurnalSwingAmbient: number;
  peakSolarGainKW: number;
  totalSolarGainKWh: number;
  totalHeatLossKWh: number;
  totalNetEnergyBalanceKWh: number;
  thermalComfortScore: number; // 0-100
  heatingDemandKWhPerDay: number;
  coolingDemandKWhPerDay: number;
  passiveSolarFraction: number; // 0-100%
  adaptiveComfortHours: number; // count of hours within 18°C-25°C
  heatLossBreakdown: {
    walls: number;
    roof: number;
    floor: number;
    windows: number;
    infiltration: number;
  };
  heatLossPercentages: {
    walls: number;
    roof: number;
    floor: number;
    windows: number;
    infiltration: number;
  };
}

export type OptimizationObjective = 
  | 'thermal_comfort'
  | 'min_heat_loss'
  | 'max_passive_gain'
  | 'min_energy'
  | 'balanced';

export interface OptimizationConstraints {
  maxBudgetTier: 'low' | 'medium' | 'high';
  maxWallThicknessMm: number;
  maxGlazingRatio: number;
  requireNaturalMaterials: boolean;
}

export interface CandidateDesign {
  id: string;
  rank: number;
  config: ShelterConfig;
  result: SimulationResult;
  score: number;
  generation: number;
  isBaseline?: boolean;
}

export interface OptimizationState {
  isRunning: boolean;
  currentStep: number;
  totalSteps: number;
  currentStepText: string;
  evaluatedCandidatesCount: number;
  bestCandidate: CandidateDesign | null;
  candidatesHistory: CandidateDesign[];
  convergenceCurve: { step: number; score: number; avgScore: number }[];
}

export type ViewerMode = 'physical' | 'thermal' | 'solar' | 'airflow' | 'exploded';
