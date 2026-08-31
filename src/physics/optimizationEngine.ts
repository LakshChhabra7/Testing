import { 
  CandidateDesign, 
  ClimateProfile, 
  OptimizationConstraints, 
  OptimizationObjective, 
  ShelterConfig 
} from '../types';
import { runTransientThermalSimulation } from './thermalSolver';
import { calculateCompositeAssembly } from './compositeWall';

export function calculateCandidateScore(
  result: ReturnType<typeof runTransientThermalSimulation>,
  objective: OptimizationObjective
): number {
  const comfort = result.thermalComfortScore;
  const comfortHoursRatio = result.adaptiveComfortHours / (result.hourlySteps.length || 24);
  const heatingDemand = result.heatingDemandKWhPerDay;
  const heatLoss = result.totalHeatLossKWh;
  const solarGain = result.totalSolarGainKWh;
  const tempSwing = result.diurnalSwingIndoor;

  switch (objective) {
    case 'thermal_comfort':
      // Heavily weigh comfort hours + low temperature fluctuation
      return Math.round(comfort * 0.6 + comfortHoursRatio * 30 + Math.max(0, 10 - tempSwing * 1.5));

    case 'min_heat_loss':
      // Heavily penalize heat loss
      const lossScore = Math.max(0, 100 - (heatLoss * 1.8));
      return Math.round(lossScore * 0.7 + comfort * 0.3);

    case 'max_passive_gain':
      // Maximize solar fraction while keeping max temp <= 26°C
      const solarScore = Math.min(100, (solarGain / Math.max(1, heatLoss)) * 100);
      const overheatPenalty = result.maxIndoorTemp > 27 ? (result.maxIndoorTemp - 27) * 8 : 0;
      return Math.max(0, Math.round(solarScore * 0.6 + comfort * 0.4 - overheatPenalty));

    case 'min_energy':
      const energyPenalty = (heatingDemand + result.coolingDemandKWhPerDay) * 2.5;
      return Math.max(0, Math.round(100 - energyPenalty));

    case 'balanced':
    default:
      return Math.round(
        comfort * 0.40 +
        result.passiveSolarFraction * 0.25 +
        Math.max(0, 100 - heatLoss * 1.5) * 0.20 +
        (result.maxIndoorTemp <= 25 && result.minIndoorTemp >= 16 ? 15 : 0)
      );
  }
}

export function generateCandidateConfigurations(
  baseConfig: ShelterConfig,
  climate: ClimateProfile,
  constraints: OptimizationConstraints,
  count: number = 24
): ShelterConfig[] {
  const candidates: ShelterConfig[] = [];

  // Add the base config
  candidates.push(JSON.parse(JSON.stringify(baseConfig)));

  // Parameter grids
  const orientations = [-30, -15, 0, 15, 30]; // degrees from South
  const insulationDepths = constraints.maxBudgetTier === 'low' ? [30, 50] : [50, 75, 100, 120];
  const massDepths = [150, 200, 250, 300];
  const southWWRs = climate.id === 'ladakh' ? [0.35, 0.45, 0.55] : [0.15, 0.25, 0.35];
  const northWWRs = [0.05, 0.08, 0.12];
  const glazings = constraints.maxBudgetTier === 'low' 
    ? ['double_clear', 'double_low_e'] as const 
    : ['double_low_e', 'triple_argon'] as const;

  for (let i = 0; i < count; i++) {
    const ori = orientations[i % orientations.length];
    const insThick = insulationDepths[(i * 2) % insulationDepths.length];
    const massThick = massDepths[(i * 3) % massDepths.length];
    const sWWR = southWWRs[(i + 1) % southWWRs.length];
    const nWWR = northWWRs[i % northWWRs.length];
    const glaz = glazings[i % glazings.length];

    // Build optimized wall layers
    const wallLayers = climate.id === 'ladakh' ? [
      { id: `opt_w1_${i}`, materialId: 'mat_reflective_foil', thicknessMm: 2 },
      { id: `opt_w2_${i}`, materialId: 'mat_puf_insulation', thicknessMm: insThick },
      { id: `opt_w3_${i}`, materialId: 'mat_rammed_earth', thicknessMm: massThick },
      { id: `opt_w4_${i}`, materialId: 'mat_wood_fiber', thicknessMm: 20 }
    ] : [
      { id: `opt_w1_${i}`, materialId: 'mat_stone_masonry', thicknessMm: massThick },
      { id: `opt_w2_${i}`, materialId: 'mat_rockwool', thicknessMm: insThick },
      { id: `opt_w3_${i}`, materialId: 'mat_cseb', thicknessMm: 150 }
    ];

    const wallAssembly = calculateCompositeAssembly(`Optimized Bio-Envelope Gen-${i + 1}`, wallLayers);

    const roofLayers = [
      { id: `opt_r1_${i}`, materialId: 'mat_reflective_foil', thicknessMm: 2 },
      { id: `opt_r2_${i}`, materialId: 'mat_puf_insulation', thicknessMm: insThick + 25 },
      { id: `opt_r3_${i}`, materialId: 'mat_wood_fiber', thicknessMm: 30 }
    ];
    const roofAssembly = calculateCompositeAssembly(`High-Performance R-Roof Gen-${i + 1}`, roofLayers);

    const candidate: ShelterConfig = {
      ...baseConfig,
      id: `candidate_gen_${i + 1}`,
      name: `Optimized Shelter Gen-${i + 1}`,
      orientationDeg: ori,
      wallAssembly,
      roofAssembly,
      glazingType: glaz,
      wwrSouth: sWWR,
      wwrNorth: nWWR,
      wwrEast: 0.10,
      wwrWest: 0.08,
      roofOverhangM: climate.id === 'rajasthan' ? 0.75 : 0.45,
      shadingType: climate.id === 'ladakh' ? 'insulated_shutter' : 'overhang_60cm',
      infiltrationACH: 0.35, // tight envelope
      hasThermalStorageWall: true,
      thermalStorageMassKg: massThick * 25
    };

    candidates.push(candidate);
  }

  return candidates;
}

export function runFullOptimizationSync(
  baseConfig: ShelterConfig,
  climate: ClimateProfile,
  objective: OptimizationObjective,
  constraints: OptimizationConstraints
): {
  bestCandidate: CandidateDesign;
  allCandidates: CandidateDesign[];
  convergenceCurve: { step: number; score: number; avgScore: number }[];
} {
  const configs = generateCandidateConfigurations(baseConfig, climate, constraints, 20);
  const candidateResults: CandidateDesign[] = [];
  const convergenceCurve: { step: number; score: number; avgScore: number }[] = [];

  let highestScore = -1;
  let bestCandidate: CandidateDesign | null = null;
  let runningScoreSum = 0;

  configs.forEach((cfg, idx) => {
    const simResult = runTransientThermalSimulation(cfg, climate, 24);
    const score = calculateCandidateScore(simResult, objective);
    runningScoreSum += score;

    const candidate: CandidateDesign = {
      id: cfg.id,
      rank: 0,
      config: cfg,
      result: simResult,
      score,
      generation: Math.floor(idx / 4) + 1,
      isBaseline: idx === 0
    };

    if (score > highestScore || bestCandidate === null) {
      highestScore = score;
      bestCandidate = candidate;
    }

    candidateResults.push(candidate);
    convergenceCurve.push({
      step: idx + 1,
      score: highestScore,
      avgScore: Math.round(runningScoreSum / (idx + 1))
    });
  });

  // Sort and assign ranks
  candidateResults.sort((a, b) => b.score - a.score);
  candidateResults.forEach((c, idx) => {
    c.rank = idx + 1;
  });

  return {
    bestCandidate: bestCandidate || candidateResults[0],
    allCandidates: candidateResults,
    convergenceCurve
  };
}
