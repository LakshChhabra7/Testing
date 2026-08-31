import { ClimateProfile, HourlySimulationStep, ShelterConfig, SimulationResult } from '../types';
import { GLAZING_DATABASE } from '../data/materials';
import { calculateSolarAngles, calculateIncidentIrradianceOnSurfaces } from './solarGeometry';

export function runTransientThermalSimulation(
  config: ShelterConfig,
  climate: ClimateProfile,
  horizonHours: number = 24
): SimulationResult {
  const glazing = GLAZING_DATABASE[config.glazingType] || GLAZING_DATABASE.double_low_e;

  // Geometry calculations
  const length = Math.max(2, config.lengthM);
  const width = Math.max(2, config.widthM);
  const height = Math.max(2, config.heightM);

  const floorArea = length * width; // m²
  const roofArea = floorArea * 1.05; // slight pitch multiplier
  const volume = floorArea * height; // m³

  // Surface gross areas
  const grossAreaSouth = length * height;
  const grossAreaNorth = length * height;
  const grossAreaEast = width * height;
  const grossAreaWest = width * height;

  // Window areas
  const winAreaSouth = grossAreaSouth * Math.min(0.8, Math.max(0, config.wwrSouth));
  const winAreaNorth = grossAreaNorth * Math.min(0.8, Math.max(0, config.wwrNorth));
  const winAreaEast = grossAreaEast * Math.min(0.8, Math.max(0, config.wwrEast));
  const winAreaWest = grossAreaWest * Math.min(0.8, Math.max(0, config.wwrWest));
  const totalWindowArea = winAreaSouth + winAreaNorth + winAreaEast + winAreaWest;

  // Net opaque wall areas
  const netWallSouth = Math.max(0, grossAreaSouth - winAreaSouth);
  const netWallNorth = Math.max(0, grossAreaNorth - winAreaNorth);
  const netWallEast = Math.max(0, grossAreaEast - winAreaEast);
  const netWallWest = Math.max(0, grossAreaWest - winAreaWest);
  const totalOpaqueWallArea = netWallSouth + netWallNorth + netWallEast + netWallWest;

  // U-values (W/m²K)
  const uWall = config.wallAssembly.uValue;
  const uRoof = config.roofAssembly.uValue;
  const uFloor = config.floorAssembly.uValue;
  const uWindow = glazing.uValue;
  const shgc = glazing.shgc;

  // Overall UA conductive coefficient (W/K)
  const UA_walls = totalOpaqueWallArea * uWall;
  const UA_roof = roofArea * uRoof;
  const UA_floor = floorArea * (uFloor * 0.4); // ground coupling reduction
  const UA_windows = totalWindowArea * uWindow;
  const UA_envelope = UA_walls + UA_roof + UA_floor + UA_windows;

  // Thermal Capacitance (J/K)
  const rho_air = 1.2; // kg/m³
  const cp_air = 1005; // J/kg·K
  const C_air = volume * rho_air * cp_air; // Air capacitance in Joules/K

  // Effective Internal / Structure Thermal Storage Mass
  const wallThermalMassKJ = totalOpaqueWallArea * (config.wallAssembly.totalThermalMassCapacity || 100);
  const extraStorageKJ = config.hasThermalStorageWall ? (config.thermalStorageMassKg * 0.9) : 0;
  const C_structure = (wallThermalMassKJ + extraStorageKJ) * 1000 * 0.4; // 40% actively coupled capacitance (J/K)

  // Internal gains: ~80W sensible per occupant + 50W base lighting/equipment
  const Q_internal_W = (config.occupantCount * 80) + 60;

  // Infiltration ventilation conductance (W/K): V * ACH / 3600 * rho * cp
  const H_vent = (volume * Math.max(0.1, config.infiltrationACH) / 3600) * rho_air * cp_air;

  // Time step for transient numerical integration (Euler with sub-stepping)
  const numStepsPerHour = 10;
  const dtSeconds = 3600 / numStepsPerHour;

  // Initial conditions: warm-up initialized to climate mean
  const initialTemp = (climate.hourlyAmbientTemp[0] + (climate.designWinterTemp < 0 ? 14 : 22)) / 2;
  let T_air = initialTemp;
  let T_mass = initialTemp;

  // Let solver run 2 warm-up cycles (48h) to reach steady periodic state
  const totalSimHours = 48 + horizonHours;
  const recordedSteps: HourlySimulationStep[] = [];

  let cumSolarKWh = 0;
  let cumHeatLossKWh = 0;
  let cumNetBalanceKWh = 0;

  let lossSumWalls = 0;
  let lossSumRoof = 0;
  let lossSumFloor = 0;
  let lossSumWindows = 0;
  let lossSumInfiltration = 0;

  for (let h = 0; h < totalSimHours; h++) {
    const hourOfDay = h % 24;
    const isRecording = h >= 48; // record only the final horizon

    const T_amb = climate.hourlyAmbientTemp[hourOfDay];
    const G_sol = climate.hourlySolarIrradiance[hourOfDay];
    const RH = climate.hourlyRelativeHumidity[hourOfDay];
    const windSpeed = climate.hourlyWindSpeed[hourOfDay];

    const solarAngles = calculateSolarAngles(climate.latitude, hourOfDay);
    const incidentRad = calculateIncidentIrradianceOnSurfaces(G_sol, solarAngles, config.orientationDeg);

    // Shading multiplier
    let shadingFactor = 1.0;
    if (config.shadingType === 'overhang_30cm') shadingFactor = 0.85;
    if (config.shadingType === 'overhang_60cm') shadingFactor = 0.68;
    if (config.shadingType === 'louvers') shadingFactor = 0.50;
    if (config.shadingType === 'insulated_shutter') {
      // closed at night to retain heat, open during day
      shadingFactor = (hourOfDay >= 8 && hourOfDay <= 17) ? 0.95 : 0.2;
    }

    // Solar heat gain transmitted through windows (Watts)
    const Q_solar_windows = (
      winAreaSouth * incidentRad.south +
      winAreaNorth * incidentRad.north +
      winAreaEast * incidentRad.east +
      winAreaWest * incidentRad.west
    ) * shgc * shadingFactor;

    // Sol-Air temperature for South wall (absorptivity alpha ~ 0.65, h_o ~ 17 W/m²K)
    const alpha_wall = 0.65;
    const h_exterior = 15.0 + 3.0 * windSpeed;
    const solAirSouth = T_amb + (alpha_wall * incidentRad.south) / h_exterior;

    // Sub-stepping numerical integration
    let avgIndoorSubstep = 0;
    let avgQcondSubstep = 0;
    let avgQventSubstep = 0;
    let avgQradSubstep = 0;
    let avgQsolarSubstep = 0;
    let avgNetFlowSubstep = 0;

    for (let step = 0; step < numStepsPerHour; step++) {
      // Conduction heat losses/gains (positive = loss from interior to outside)
      const Q_cond_walls = UA_walls * (T_air - T_amb);
      const Q_cond_roof = UA_roof * (T_air - T_amb);
      const Q_cond_floor = UA_floor * (T_air - (T_amb > 15 ? 18 : 8)); // dampened ground temp
      const Q_cond_windows = UA_windows * (T_air - T_amb);
      const Q_cond_total = Q_cond_walls + Q_cond_roof + Q_cond_floor + Q_cond_windows;

      // Ventilation/Infiltration loss (Watts)
      const Q_vent = H_vent * (T_air - T_amb);

      // Night radiative loss to clear sky (Stefan-Boltzmann simplified)
      const isNight = G_sol < 10;
      const Q_sky_rad = isNight ? (roofArea * 4.5 * Math.max(0, T_air - (T_amb - 6))) : 0;

      // Coupling between air and thermal mass core (h_c ~ 8 W/m²K)
      const h_mass_coupling = 600; // W/K internal mass surface conductance
      const Q_mass_to_air = h_mass_coupling * (T_mass - T_air);

      // Solar absorbed directly into interior mass (65% of transmitted solar hits mass)
      const Q_sol_to_mass = Q_solar_windows * 0.65;
      const Q_sol_to_air = Q_solar_windows * 0.35;

      // Governing differential equations:
      // dT_air / dt = (Q_sol_to_air + Q_internal + Q_mass_to_air - Q_cond_total - Q_vent - Q_sky_rad) / C_air
      const netAirPower = Q_sol_to_air + Q_internal_W + Q_mass_to_air - Q_cond_total - Q_vent - Q_sky_rad;
      const dT_air = (netAirPower / C_air) * dtSeconds;
      T_air += dT_air;

      // dT_mass / dt = (Q_sol_to_mass - Q_mass_to_air) / C_structure
      const netMassPower = Q_sol_to_mass - Q_mass_to_air;
      const dT_mass = (netMassPower / (C_structure || 1e6)) * dtSeconds;
      T_mass += dT_mass;

      avgIndoorSubstep += T_air;
      avgQcondSubstep += Q_cond_total;
      avgQventSubstep += Q_vent;
      avgQradSubstep += Q_sky_rad;
      avgQsolarSubstep += Q_solar_windows;
      avgNetFlowSubstep += netAirPower;
    }

    avgIndoorSubstep /= numStepsPerHour;
    avgQcondSubstep /= numStepsPerHour;
    avgQventSubstep /= numStepsPerHour;
    avgQradSubstep /= numStepsPerHour;
    avgQsolarSubstep /= numStepsPerHour;
    avgNetFlowSubstep /= numStepsPerHour;

    if (isRecording) {
      const stepHour = recordedSteps.length;
      const displayHour = stepHour % 24;
      const timeLabel = `${String(displayHour).padStart(2, '0')}:00`;

      // Comfort evaluation (Adaptive Comfort: optimal neutral temp ~ 17.8 + 0.31 * T_amb)
      const comfortNeutral = Math.min(26, Math.max(20, 17.8 + 0.31 * Math.max(10, T_amb)));
      const tempDiff = Math.abs(avgIndoorSubstep - comfortNeutral);
      const comfortScore = Math.max(0, Math.min(100, Math.round(100 - tempDiff * 9.5)));
      const isComfortable = avgIndoorSubstep >= 18.0 && avgIndoorSubstep <= 26.5;

      // PMV approximation (-3 cold to +3 hot)
      const pmv = Number(((avgIndoorSubstep - comfortNeutral) / 3.0).toFixed(2));

      const solarKW = Math.max(0, avgQsolarSubstep / 1000);
      const condLossKW = Math.max(0, avgQcondSubstep / 1000);
      const ventLossKW = Math.max(0, avgQventSubstep / 1000);
      const radLossKW = Math.max(0, avgQradSubstep / 1000);
      const intGainKW = Q_internal_W / 1000;

      cumSolarKWh += solarKW;
      cumHeatLossKWh += (condLossKW + ventLossKW + radLossKW);
      cumNetBalanceKWh += (avgNetFlowSubstep / 1000);

      lossSumWalls += (UA_walls * Math.max(0, avgIndoorSubstep - T_amb)) / 1000;
      lossSumRoof += (UA_roof * Math.max(0, avgIndoorSubstep - T_amb)) / 1000;
      lossSumFloor += (UA_floor * Math.max(0, avgIndoorSubstep - 10)) / 1000;
      lossSumWindows += (UA_windows * Math.max(0, avgIndoorSubstep - T_amb)) / 1000;
      lossSumInfiltration += (H_vent * Math.max(0, avgIndoorSubstep - T_amb)) / 1000;

      recordedSteps.push({
        hour: stepHour,
        timeLabel,
        ambientTemp: Number(T_amb.toFixed(1)),
        indoorTemp: Number(avgIndoorSubstep.toFixed(1)),
        solAirTempSouth: Number(solAirSouth.toFixed(1)),
        solarIrradiance: G_sol,
        solarGainKW: Number(solarKW.toFixed(2)),
        conductionLossKW: Number(condLossKW.toFixed(2)),
        ventilationLossKW: Number(ventLossKW.toFixed(2)),
        radiationLossKW: Number(radLossKW.toFixed(2)),
        internalGainKW: Number(intGainKW.toFixed(2)),
        netHeatFlowKW: Number((avgNetFlowSubstep / 1000).toFixed(2)),
        thermalStorageTemp: Number(T_mass.toFixed(1)),
        comfortPMV: pmv,
        comfortIndexPercent: comfortScore,
        isComfortable
      });
    }
  }

  // Aggregate Metrics
  const indoorTemps = recordedSteps.map(s => s.indoorTemp);
  const ambientTemps = recordedSteps.map(s => s.ambientTemp);

  const minIndoor = Math.min(...indoorTemps);
  const maxIndoor = Math.max(...indoorTemps);
  const avgIndoor = indoorTemps.reduce((a, b) => a + b, 0) / indoorTemps.length;

  const minAmb = Math.min(...ambientTemps);
  const maxAmb = Math.max(...ambientTemps);

  const peakSolarKW = Math.max(...recordedSteps.map(s => s.solarGainKW));
  const comfortHours = recordedSteps.filter(s => s.isComfortable).length;
  const avgComfortScore = Math.round(
    recordedSteps.reduce((sum, s) => sum + s.comfortIndexPercent, 0) / recordedSteps.length
  );

  // Passive solar fraction = Solar Gain / (Solar Gain + External Heating Needed)
  const totalHeatLoss = Math.max(1, cumHeatLossKWh);
  const passiveFraction = Math.min(100, Math.round((cumSolarKWh / totalHeatLoss) * 100));

  // Heating / cooling degree demand (KWh/day)
  let heatingDemand = 0;
  let coolingDemand = 0;
  recordedSteps.forEach(s => {
    if (s.indoorTemp < 18.0) {
      heatingDemand += (18.0 - s.indoorTemp) * (UA_envelope / 1000);
    } else if (s.indoorTemp > 26.0) {
      coolingDemand += (s.indoorTemp - 26.0) * (UA_envelope / 1000);
    }
  });

  const totalLossComponent = (lossSumWalls + lossSumRoof + lossSumFloor + lossSumWindows + lossSumInfiltration) || 1;

  return {
    hourlySteps: recordedSteps,
    minIndoorTemp: Number(minIndoor.toFixed(1)),
    maxIndoorTemp: Number(maxIndoor.toFixed(1)),
    avgIndoorTemp: Number(avgIndoor.toFixed(1)),
    diurnalSwingIndoor: Number((maxIndoor - minIndoor).toFixed(1)),
    minAmbientTemp: Number(minAmb.toFixed(1)),
    maxAmbientTemp: Number(maxAmb.toFixed(1)),
    diurnalSwingAmbient: Number((maxAmb - minAmb).toFixed(1)),
    peakSolarGainKW: Number(peakSolarKW.toFixed(2)),
    totalSolarGainKWh: Number(cumSolarKWh.toFixed(1)),
    totalHeatLossKWh: Number(cumHeatLossKWh.toFixed(1)),
    totalNetEnergyBalanceKWh: Number(cumNetBalanceKWh.toFixed(1)),
    thermalComfortScore: avgComfortScore,
    heatingDemandKWhPerDay: Number(heatingDemand.toFixed(1)),
    coolingDemandKWhPerDay: Number(coolingDemand.toFixed(1)),
    passiveSolarFraction: passiveFraction,
    adaptiveComfortHours: comfortHours,
    heatLossBreakdown: {
      walls: Number(lossSumWalls.toFixed(1)),
      roof: Number(lossSumRoof.toFixed(1)),
      floor: Number(lossSumFloor.toFixed(1)),
      windows: Number(lossSumWindows.toFixed(1)),
      infiltration: Number(lossSumInfiltration.toFixed(1))
    },
    heatLossPercentages: {
      walls: Math.round((lossSumWalls / totalLossComponent) * 100),
      roof: Math.round((lossSumRoof / totalLossComponent) * 100),
      floor: Math.round((lossSumFloor / totalLossComponent) * 100),
      windows: Math.round((lossSumWindows / totalLossComponent) * 100),
      infiltration: Math.round((lossSumInfiltration / totalLossComponent) * 100)
    }
  };
}
