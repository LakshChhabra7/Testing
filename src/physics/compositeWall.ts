import { CompositeAssembly, Material, WallLayer } from '../types';
import { MATERIALS_DATABASE } from '../data/materials';

export function getMaterialById(id: string): Material {
  const found = MATERIALS_DATABASE.find(m => m.id === id);
  if (found) return found;
  return MATERIALS_DATABASE[0]; // fallback
}

export function calculateCompositeAssembly(name: string, layers: WallLayer[]): CompositeAssembly {
  const R_si = 0.13; // Interior surface resistance (m²·K/W)
  const R_se = 0.04; // Exterior surface resistance (m²·K/W)

  let rValueLayers = 0;
  let totalThicknessMm = 0;
  let totalArealMass = 0; // kg/m²
  let totalHeatCapacity = 0; // kJ/(m²·K)
  let weightedThermalDiffusivity = 0; // m²/s

  layers.forEach(layer => {
    const mat = getMaterialById(layer.materialId);
    const dMeters = layer.thicknessMm / 1000.0;
    
    // R = d / k
    const rLayer = dMeters / (mat.thermalConductivity || 0.01);
    rValueLayers += rLayer;
    totalThicknessMm += layer.thicknessMm;

    // Thermal capacity = rho * c_p * d
    const massLayer = mat.density * dMeters;
    totalArealMass += massLayer;
    const capacityLayer = (mat.density * mat.specificHeat * dMeters) / 1000.0; // kJ/(m²·K)
    totalHeatCapacity += capacityLayer;

    // Thermal diffusivity alpha = k / (rho * c_p)
    const alpha = mat.thermalConductivity / (mat.density * mat.specificHeat);
    weightedThermalDiffusivity += alpha * dMeters;
  });

  const totalRValue = rValueLayers + R_si + R_se;
  const uValue = totalRValue > 0 ? 1.0 / totalRValue : 5.0;

  // Periodic thermal response (Mackey & Wright admittance approximation for 24h diurnal cycle)
  const totalThicknessMeters = totalThicknessMm / 1000.0;
  const avgDiffusivity = totalThicknessMeters > 0 
    ? (weightedThermalDiffusivity / totalThicknessMeters) 
    : 1e-7;
  
  const periodSeconds = 24 * 3600; // 86400s
  // penetration depth delta = sqrt( (alpha * T) / pi )
  const delta = Math.sqrt((avgDiffusivity * periodSeconds) / Math.PI);
  
  // Time lag phi (hours)
  let timeLagHours = 0;
  let decrementFactor = 1.0;
  
  if (delta > 0 && totalThicknessMeters > 0) {
    const x = totalThicknessMeters / delta;
    timeLagHours = Math.min(16, Math.max(0.5, (x / (2 * Math.PI)) * 24));
    decrementFactor = Math.min(1.0, Math.max(0.02, Math.exp(-x)));
  }

  return {
    name,
    layers,
    totalThicknessMm: Math.round(totalThicknessMm),
    rValue: Number(totalRValue.toFixed(3)),
    uValue: Number(uValue.toFixed(3)),
    totalThermalMassCapacity: Number(totalHeatCapacity.toFixed(1)),
    timeLagHours: Number(timeLagHours.toFixed(1)),
    decrementFactor: Number(decrementFactor.toFixed(3))
  };
}

export function createDefaultWallAssembly(zone: string): CompositeAssembly {
  if (zone === 'ladakh') {
    // Extreme cold: Rammed earth core + PUF insulation + timber interior
    return calculateCompositeAssembly('Ladakh Bio-Climatic Composite Wall', [
      { id: 'l1', materialId: 'mat_reflective_foil', thicknessMm: 2 },
      { id: 'l2', materialId: 'mat_puf_insulation', thicknessMm: 80 },
      { id: 'l3', materialId: 'mat_rammed_earth', thicknessMm: 250 },
      { id: 'l4', materialId: 'mat_wood_fiber', thicknessMm: 20 }
    ]);
  } else if (zone === 'rajasthan') {
    // Desert high mass: Stone/CSEB + cavity + light insulation + plaster
    return calculateCompositeAssembly('Desert High-Mass Wall', [
      { id: 'l1', materialId: 'mat_stone_masonry', thicknessMm: 200 },
      { id: 'l2', materialId: 'mat_rockwool', thicknessMm: 50 },
      { id: 'l3', materialId: 'mat_cseb', thicknessMm: 150 },
      { id: 'l4', materialId: 'mat_reflective_foil', thicknessMm: 2 }
    ]);
  } else {
    // Standard sustainable envelope: CSEB + EPS + render
    return calculateCompositeAssembly('Eco-Thermal Wall', [
      { id: 'l1', materialId: 'mat_burnt_brick', thicknessMm: 115 },
      { id: 'l2', materialId: 'mat_eps_insulation', thicknessMm: 50 },
      { id: 'l3', materialId: 'mat_aac_block', thicknessMm: 150 }
    ]);
  }
}

export function createDefaultRoofAssembly(zone: string): CompositeAssembly {
  if (zone === 'ladakh') {
    return calculateCompositeAssembly('Himalayan Insulated Cold Roof', [
      { id: 'r1', materialId: 'mat_reflective_foil', thicknessMm: 2 },
      { id: 'r2', materialId: 'mat_puf_insulation', thicknessMm: 100 },
      { id: 'r3', materialId: 'mat_wood_fiber', thicknessMm: 35 }
    ]);
  } else {
    return calculateCompositeAssembly('Cool-Coated Insulated Roof', [
      { id: 'r1', materialId: 'mat_reflective_foil', thicknessMm: 2 },
      { id: 'r2', materialId: 'mat_rockwool', thicknessMm: 75 },
      { id: 'r3', materialId: 'mat_aac_block', thicknessMm: 100 }
    ]);
  }
}

export function createDefaultFloorAssembly(): CompositeAssembly {
  return calculateCompositeAssembly('Insulated Earth Slab', [
    { id: 'f1', materialId: 'mat_stone_masonry', thicknessMm: 150 },
    { id: 'f2', materialId: 'mat_eps_insulation', thicknessMm: 50 },
    { id: 'f3', materialId: 'mat_wood_fiber', thicknessMm: 25 }
  ]);
}
