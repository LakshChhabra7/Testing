import { Material } from '../types';

export const MATERIALS_DATABASE: Material[] = [
  {
    id: 'mat_burnt_brick',
    name: 'Standard Burnt Clay Brick',
    category: 'masonry',
    thermalConductivity: 0.81, // W/(m·K)
    density: 1800, // kg/m³
    specificHeat: 880, // J/(kg·K)
    solarAbsorptivity: 0.70,
    thermalEmissivity: 0.90,
    defaultThicknessMm: 230,
    embodiedCarbonKgCO2: 220,
    costIndex: 4,
    description: 'Conventional modular Indian clay brick masonry. Moderate thermal mass, high embodied energy.',
    localAvailability: ['Pan-India', 'Plains', 'Urban centers']
  },
  {
    id: 'mat_cseb',
    name: 'Compressed Stabilized Earth Block (CSEB)',
    category: 'natural_mass',
    thermalConductivity: 0.75,
    density: 1850,
    specificHeat: 950,
    solarAbsorptivity: 0.65,
    thermalEmissivity: 0.92,
    defaultThicknessMm: 230,
    embodiedCarbonKgCO2: 45,
    costIndex: 3,
    description: 'Soil stabilized with 5-8% cement or lime. Exceptional ecological profile and high thermal damping.',
    localAvailability: ['Ladakh', 'Auroville', 'Rural & semi-urban India']
  },
  {
    id: 'mat_rammed_earth',
    name: 'Compacted Rammed Earth',
    category: 'natural_mass',
    thermalConductivity: 1.10,
    density: 2100,
    specificHeat: 1100,
    solarAbsorptivity: 0.72,
    thermalEmissivity: 0.90,
    defaultThicknessMm: 300,
    embodiedCarbonKgCO2: 30,
    costIndex: 3,
    description: 'Monolithic mass wall constructed from local soil and aggregate. Outstanding diurnal thermal lag (10-12 hours).',
    localAvailability: ['Ladakh', 'Himachal', 'Rajasthan', 'Deccan']
  },
  {
    id: 'mat_aac_block',
    name: 'Autoclaved Aerated Concrete (AAC)',
    category: 'masonry',
    thermalConductivity: 0.16,
    density: 550,
    specificHeat: 1050,
    solarAbsorptivity: 0.55,
    thermalEmissivity: 0.88,
    defaultThicknessMm: 200,
    embodiedCarbonKgCO2: 140,
    costIndex: 5,
    description: 'Micro-porous lightweight block providing both structural envelope and moderate thermal insulation.',
    localAvailability: ['Pan-India cities', 'Industrial hubs']
  },
  {
    id: 'mat_stone_masonry',
    name: 'Granite / Basalt Stone Masonry',
    category: 'masonry',
    thermalConductivity: 2.30,
    density: 2600,
    specificHeat: 800,
    solarAbsorptivity: 0.78,
    thermalEmissivity: 0.93,
    defaultThicknessMm: 350,
    embodiedCarbonKgCO2: 50,
    costIndex: 5,
    description: 'Heavy quarry stone wall. Very high density and thermal storage, low thermal resistance.',
    localAvailability: ['Himalayas', 'Rajasthan', 'Deccan Plateau']
  },
  {
    id: 'mat_puf_insulation',
    name: 'Polyurethane Foam (PUF / PIR)',
    category: 'insulation',
    thermalConductivity: 0.024,
    density: 38,
    specificHeat: 1450,
    solarAbsorptivity: 0.40,
    thermalEmissivity: 0.85,
    defaultThicknessMm: 50,
    embodiedCarbonKgCO2: 320,
    costIndex: 7,
    description: 'Closed-cell rigid foam core with superior thermal resistivity. Essential for sub-zero high-altitude envelopes.',
    localAvailability: ['Industrial suppliers', 'Prefab contractors']
  },
  {
    id: 'mat_eps_insulation',
    name: 'Expanded Polystyrene (EPS)',
    category: 'insulation',
    thermalConductivity: 0.035,
    density: 22,
    specificHeat: 1300,
    solarAbsorptivity: 0.35,
    thermalEmissivity: 0.85,
    defaultThicknessMm: 60,
    embodiedCarbonKgCO2: 180,
    costIndex: 4,
    description: 'Cost-effective rigid insulation board with low moisture absorption.',
    localAvailability: ['Pan-India']
  },
  {
    id: 'mat_rockwool',
    name: 'Mineral Rockwool Batt',
    category: 'insulation',
    thermalConductivity: 0.038,
    density: 64,
    specificHeat: 1000,
    solarAbsorptivity: 0.50,
    thermalEmissivity: 0.88,
    defaultThicknessMm: 75,
    embodiedCarbonKgCO2: 110,
    costIndex: 6,
    description: 'Non-combustible basalt fiber insulation. Excellent acoustic dampening and vapor permeability.',
    localAvailability: ['Major industrial centers']
  },
  {
    id: 'mat_aerogel',
    name: 'Silica Aerogel Nanoporous Blanket',
    category: 'insulation',
    thermalConductivity: 0.015,
    density: 150,
    specificHeat: 1200,
    solarAbsorptivity: 0.30,
    thermalEmissivity: 0.82,
    defaultThicknessMm: 20,
    embodiedCarbonKgCO2: 450,
    costIndex: 10,
    description: 'Ultra-advanced nanotechnology insulator providing highest R-value per millimeter thickness.',
    localAvailability: ['Specialty aerospace & defense suppliers']
  },
  {
    id: 'mat_wood_fiber',
    name: 'Treated Timber / Wood Board',
    category: 'finishing',
    thermalConductivity: 0.13,
    density: 500,
    specificHeat: 1600,
    solarAbsorptivity: 0.60,
    thermalEmissivity: 0.90,
    defaultThicknessMm: 25,
    embodiedCarbonKgCO2: -150, // Net carbon sink
    costIndex: 6,
    description: 'Renewable interior and exterior timber cladding. Adds warm finish and minor thermal buffer.',
    localAvailability: ['Himalayan timber markets', 'Kerala', 'Northeast']
  },
  {
    id: 'mat_straw_bale',
    name: 'Agricultural Straw Bale (Compressed)',
    category: 'natural_mass',
    thermalConductivity: 0.065,
    density: 110,
    specificHeat: 1800,
    solarAbsorptivity: 0.55,
    thermalEmissivity: 0.90,
    defaultThicknessMm: 350,
    embodiedCarbonKgCO2: -250, // Carbon negative
    costIndex: 2,
    description: 'Bio-waste agricultural crop residue compressed into thick insulated building envelopes.',
    localAvailability: ['Punjab', 'Haryana', 'UP agricultural belts']
  },
  {
    id: 'mat_reflective_foil',
    name: 'Radiant Aluminum Barrier Foil',
    category: 'finishing',
    thermalConductivity: 205.0,
    density: 2700,
    specificHeat: 900,
    solarAbsorptivity: 0.12, // High reflectivity
    thermalEmissivity: 0.05, // Ultra-low emissivity
    defaultThicknessMm: 1,
    embodiedCarbonKgCO2: 85,
    costIndex: 4,
    description: 'Micro-thin reflective foil rejecting up to 95% of radiative heat transfer across air cavities.',
    localAvailability: ['Pan-India']
  }
];

export const GLAZING_DATABASE = {
  single_clear: {
    id: 'single_clear',
    name: 'Single Glazing (6mm Clear Float)',
    uValue: 5.7, // W/(m²·K)
    shgc: 0.82,  // Solar Heat Gain Coefficient
    vlt: 0.88,   // Visible Light Transmittance
    costIndex: 1
  },
  double_clear: {
    id: 'double_clear',
    name: 'Double Glazing (6-12-6 Air Gap)',
    uValue: 2.8,
    shgc: 0.70,
    vlt: 0.78,
    costIndex: 3
  },
  double_low_e: {
    id: 'double_low_e',
    name: 'Double Glazed Low-E (Argon Filled)',
    uValue: 1.4,
    shgc: 0.42,
    vlt: 0.65,
    costIndex: 6
  },
  triple_argon: {
    id: 'triple_argon',
    name: 'Triple Glazed Low-E + Krypton/Argon',
    uValue: 0.8,
    shgc: 0.35,
    vlt: 0.58,
    costIndex: 9
  }
};
