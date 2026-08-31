import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  CandidateDesign, 
  ClimateProfile, 
  ClimateZoneId, 
  OptimizationConstraints, 
  OptimizationObjective, 
  OptimizationState, 
  ShelterConfig, 
  SimulationResult 
} from '../types';
import { CLIMATE_PROFILES } from '../data/climates';
import { 
  calculateCompositeAssembly, 
  createDefaultFloorAssembly, 
  createDefaultRoofAssembly, 
  createDefaultWallAssembly 
} from '../physics/compositeWall';
import { runTransientThermalSimulation } from '../physics/thermalSolver';
import { runFullOptimizationSync } from '../physics/optimizationEngine';
import confetti from 'canvas-confetti';

interface ShelterContextType {
  activeClimateId: ClimateZoneId;
  activeClimate: ClimateProfile;
  setClimate: (zone: ClimateZoneId) => void;
  
  shelterConfig: ShelterConfig;
  updateShelterConfig: (updates: Partial<ShelterConfig>) => void;
  
  simulationResult: SimulationResult;
  recalculateSimulation: () => void;
  
  currentHour: number;
  setCurrentHour: (h: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  simSpeed: number;
  setSimSpeed: (spd: number) => void;
  
  optimizationState: OptimizationState;
  startOptimization: (objective: OptimizationObjective, constraints: OptimizationConstraints) => Promise<void>;
  applyCandidateConfig: (candidate: CandidateDesign) => void;
  
  isJudgeMode: boolean;
  setIsJudgeMode: (active: boolean) => void;
  judgeStep: number;
  setJudgeStep: (step: number) => void;
  
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  loadPresetDemo: (zoneId?: ClimateZoneId) => void;
  baselineConventionalResult: SimulationResult;
}

const ShelterContext = createContext<ShelterContextType | null>(null);

export const ShelterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [activeClimateId, setActiveClimateId] = useState<ClimateZoneId>('ladakh');
  const activeClimate = CLIMATE_PROFILES[activeClimateId] || CLIMATE_PROFILES.ladakh;

  // Initialize Default Shelter for Ladakh
  const [shelterConfig, setShelterConfig] = useState<ShelterConfig>(() => ({
    id: 'shelter_ladakh_demo',
    name: 'Himalayan Bioclimatic Research Shelter',
    locationId: 'ladakh',
    lengthM: 6.0,
    widthM: 4.0,
    heightM: 3.0,
    orientationDeg: 0, // 0 = South Facing
    roofType: 'sloped_single',
    roofPitchDeg: 12,
    roofOverhangM: 0.5,
    wallAssembly: createDefaultWallAssembly('ladakh'),
    roofAssembly: createDefaultRoofAssembly('ladakh'),
    floorAssembly: createDefaultFloorAssembly(),
    glazingType: 'double_low_e',
    wwrSouth: 0.42,
    wwrNorth: 0.08,
    wwrEast: 0.12,
    wwrWest: 0.10,
    shadingType: 'insulated_shutter',
    infiltrationACH: 0.4,
    occupantCount: 3,
    hasThermalStorageWall: true,
    thermalStorageMassKg: 6500
  }));

  // Transient Simulation State
  const [simulationResult, setSimulationResult] = useState<SimulationResult>(() => 
    runTransientThermalSimulation(shelterConfig, activeClimate, 24)
  );

  // Baseline Conventional un-insulated shelter for comparison
  const [baselineConventionalResult, setBaselineConventionalResult] = useState<SimulationResult>(() => {
    const uninsulatedConfig: ShelterConfig = {
      ...shelterConfig,
      name: 'Conventional Single-Brick Shelter (Uninsulated)',
      wallAssembly: calculateCompositeAssembly('Conventional 230mm Brick Wall', [
        { id: 'b1', materialId: 'mat_burnt_brick', thicknessMm: 230 }
      ]),
      roofAssembly: calculateCompositeAssembly('Uninsulated Metal/Concrete Roof', [
        { id: 'b2', materialId: 'mat_stone_masonry', thicknessMm: 120 }
      ]),
      glazingType: 'single_clear',
      wwrSouth: 0.15,
      wwrNorth: 0.15,
      wwrEast: 0.15,
      wwrWest: 0.15,
      shadingType: 'none',
      infiltrationACH: 1.8,
      hasThermalStorageWall: false,
      thermalStorageMassKg: 0
    };
    return runTransientThermalSimulation(uninsulatedConfig, activeClimate, 24);
  });

  const [currentHour, setCurrentHour] = useState<number>(13); // Start at 13:00 (peak sun)
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [simSpeed, setSimSpeed] = useState<number>(1.0);

  // Optimization State
  const [optimizationState, setOptimizationState] = useState<OptimizationState>({
    isRunning: false,
    currentStep: 0,
    totalSteps: 6,
    currentStepText: 'Ready',
    evaluatedCandidatesCount: 0,
    bestCandidate: null,
    candidatesHistory: [],
    convergenceCurve: []
  });

  // Judge Mode State
  const [isJudgeMode, setIsJudgeMode] = useState<boolean>(false);
  const [judgeStep, setJudgeStep] = useState<number>(1);

  // Recalculate Simulation whenever config or climate changes
  const recalculateSimulation = useCallback(() => {
    const res = runTransientThermalSimulation(shelterConfig, activeClimate, 24);
    setSimulationResult(res);

    // Also update baseline comparison
    const uninsulatedConfig: ShelterConfig = {
      ...shelterConfig,
      name: 'Conventional Single-Brick Shelter (Uninsulated)',
      wallAssembly: calculateCompositeAssembly('Conventional 230mm Brick Wall', [
        { id: 'b1', materialId: 'mat_burnt_brick', thicknessMm: 230 }
      ]),
      roofAssembly: calculateCompositeAssembly('Uninsulated Metal/Concrete Roof', [
        { id: 'b2', materialId: 'mat_stone_masonry', thicknessMm: 120 }
      ]),
      glazingType: 'single_clear',
      wwrSouth: 0.15,
      wwrNorth: 0.15,
      wwrEast: 0.15,
      wwrWest: 0.15,
      shadingType: 'none',
      infiltrationACH: 1.8,
      hasThermalStorageWall: false,
      thermalStorageMassKg: 0
    };
    setBaselineConventionalResult(runTransientThermalSimulation(uninsulatedConfig, activeClimate, 24));
  }, [shelterConfig, activeClimate]);

  useEffect(() => {
    recalculateSimulation();
  }, [shelterConfig, activeClimate, recalculateSimulation]);

  // Handle Climate Change
  const setClimate = (zoneId: ClimateZoneId) => {
    setActiveClimateId(zoneId);
    setShelterConfig(prev => ({
      ...prev,
      locationId: zoneId,
      wallAssembly: createDefaultWallAssembly(zoneId),
      roofAssembly: createDefaultRoofAssembly(zoneId)
    }));
  };

  const updateShelterConfig = (updates: Partial<ShelterConfig>) => {
    setShelterConfig(prev => ({ ...prev, ...updates }));
  };

  // Simulation Timeline Playback Loop
  useEffect(() => {
    if (!isPlaying) return;
    const intervalMs = Math.max(200, 1000 / simSpeed);
    const timer = setInterval(() => {
      setCurrentHour(prev => (prev + 1) % 24);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [isPlaying, simSpeed]);

  // Run Optimization Engine with Progressive Step Animation
  const startOptimization = async (
    objective: OptimizationObjective,
    constraints: OptimizationConstraints
  ) => {
    setOptimizationState(prev => ({
      ...prev,
      isRunning: true,
      currentStep: 1,
      currentStepText: 'Generating Latin Hypercube & Bioclimatic design candidates...'
    }));

    const stepDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

    await stepDelay(600);
    setOptimizationState(prev => ({
      ...prev,
      currentStep: 2,
      currentStepText: 'Evaluating transient solar geometry and envelope heat flux...'
    }));

    await stepDelay(650);
    setOptimizationState(prev => ({
      ...prev,
      currentStep: 3,
      currentStepText: 'Testing multi-layer composite assemblies and phase lag...'
    }));

    await stepDelay(700);
    setOptimizationState(prev => ({
      ...prev,
      currentStep: 4,
      currentStepText: 'Running genetic crossover and mutation on azimuth and WWR...'
    }));

    await stepDelay(750);
    setOptimizationState(prev => ({
      ...prev,
      currentStep: 5,
      currentStepText: 'Calculating Pareto front and ranking fitness scores...'
    }));

    const results = runFullOptimizationSync(shelterConfig, activeClimate, objective, constraints);

    await stepDelay(500);
    setOptimizationState({
      isRunning: false,
      currentStep: 6,
      totalSteps: 6,
      currentStepText: 'Optimization complete. Optimal bioclimatic configuration discovered.',
      evaluatedCandidatesCount: results.allCandidates.length,
      bestCandidate: results.bestCandidate,
      candidatesHistory: results.allCandidates,
      convergenceCurve: results.convergenceCurve
    });

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6BB77B', '#D76F30', '#172D13']
      });
    } catch {
      // ignore
    }
  };

  const applyCandidateConfig = (candidate: CandidateDesign) => {
    setShelterConfig(candidate.config);
  };

  const loadPresetDemo = (zoneId: ClimateZoneId = 'ladakh') => {
    setClimate(zoneId);
    setShelterConfig({
      id: `shelter_${zoneId}_demo`,
      name: `${CLIMATE_PROFILES[zoneId].name} High-Efficiency Prototype`,
      locationId: zoneId,
      lengthM: 6.0,
      widthM: 4.0,
      heightM: 3.0,
      orientationDeg: 0,
      roofType: 'sloped_single',
      roofPitchDeg: 14,
      roofOverhangM: 0.6,
      wallAssembly: createDefaultWallAssembly(zoneId),
      roofAssembly: createDefaultRoofAssembly(zoneId),
      floorAssembly: createDefaultFloorAssembly(),
      glazingType: 'double_low_e',
      wwrSouth: zoneId === 'ladakh' ? 0.48 : 0.20,
      wwrNorth: 0.08,
      wwrEast: 0.12,
      wwrWest: 0.08,
      shadingType: zoneId === 'ladakh' ? 'insulated_shutter' : 'overhang_60cm',
      infiltrationACH: 0.35,
      occupantCount: 3,
      hasThermalStorageWall: true,
      thermalStorageMassKg: 7500
    });
    setCurrentHour(13);
  };

  return (
    <ShelterContext.Provider
      value={{
        activeClimateId,
        activeClimate,
        setClimate,
        shelterConfig,
        updateShelterConfig,
        simulationResult,
        recalculateSimulation,
        currentHour,
        setCurrentHour,
        isPlaying,
        setIsPlaying,
        simSpeed,
        setSimSpeed,
        optimizationState,
        startOptimization,
        applyCandidateConfig,
        isJudgeMode,
        setIsJudgeMode,
        judgeStep,
        setJudgeStep,
        activeTab,
        setActiveTab,
        loadPresetDemo,
        baselineConventionalResult
      }}
    >
      {children}
    </ShelterContext.Provider>
  );
};

export const useShelter = () => {
  const context = useContext(ShelterContext);
  if (!context) {
    throw new Error('useShelter must be used within a ShelterProvider');
  }
  return context;
};
