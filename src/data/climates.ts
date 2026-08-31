import { ClimateProfile, ClimateZoneId } from '../types';

export const CLIMATE_PROFILES: Record<ClimateZoneId, ClimateProfile> = {
  ladakh: {
    id: 'ladakh',
    name: 'Leh, Ladakh',
    region: 'High Altitude Cold-Arid (Western Himalayas)',
    classification: 'Zone I - Cold & Dry (NBC / ECBC India)',
    latitude: 34.1526,
    longitude: 77.5771,
    altitudeM: 3500,
    description: 'Sub-zero temperatures with intense high-altitude solar radiation (high UV/clearness index) and extreme diurnal temperature swings.',
    seasonSummary: 'Severe Winter (Sub-Zero Baseline)',
    thermalChallenge: 'Massive night-time conduction losses (-15°C ambient), freezing winds, high heating degree days.',
    designStrategy: 'Direct solar gain capture on South facade, massive Trombe/earth thermal storage, super-insulated envelope (U < 0.25 W/m²K), air-tight buffer zones.',
    designWinterTemp: -12.5,
    designSummerTemp: 24.0,
    hourlyAmbientTemp: [
      -12.0, -13.2, -14.1, -14.8, -15.0, -14.2, -12.5, -9.0, -5.2, -1.8, 1.2, 3.5,
      4.2, 4.0, 2.8, 0.5, -2.4, -5.5, -8.0, -9.8, -10.5, -11.0, -11.5, -11.8
    ],
    hourlySolarIrradiance: [
      0, 0, 0, 0, 0, 0, 45, 260, 520, 740, 890, 960,
      940, 850, 680, 440, 180, 20, 0, 0, 0, 0, 0, 0
    ],
    hourlyRelativeHumidity: [
      42, 44, 46, 48, 50, 48, 42, 35, 28, 24, 20, 18,
      18, 19, 22, 26, 32, 36, 38, 40, 41, 42, 42, 42
    ],
    hourlyWindSpeed: [
      2.1, 1.8, 1.6, 1.5, 1.4, 1.8, 2.8, 4.2, 5.1, 5.8, 6.2, 6.5,
      6.8, 6.4, 5.5, 4.2, 3.2, 2.5, 2.2, 2.1, 2.0, 2.1, 2.0, 2.0
    ]
  },

  rajasthan: {
    id: 'rajasthan',
    name: 'Jaisalmer, Rajasthan',
    region: 'Thar Desert (Hot-Arid)',
    classification: 'Zone II - Hot & Dry (ECBC India)',
    latitude: 26.9157,
    longitude: 70.9083,
    altitudeM: 225,
    description: 'Scorching daytime direct solar radiation, high dry-bulb temperatures exceeding 42°C, and rapid night-time radiative cooling to clear skies.',
    seasonSummary: 'Peak Summer Heatwave',
    thermalChallenge: 'Excessive envelope solar thermal transmission, indoor overheating, dust storms, high cooling load.',
    designStrategy: 'High thermal mass envelope for 8-10 hour thermal damping (decrement factor < 0.15), deep shading overhangs, reflective cool roof coatings, night flush ventilation.',
    designWinterTemp: 8.0,
    designSummerTemp: 44.5,
    hourlyAmbientTemp: [
      28.5, 27.2, 26.0, 25.2, 24.8, 25.5, 28.0, 31.5, 35.2, 38.8, 41.5, 43.2,
      44.0, 43.8, 42.5, 40.8, 38.2, 35.0, 32.8, 31.2, 30.1, 29.5, 29.0, 28.8
    ],
    hourlySolarIrradiance: [
      0, 0, 0, 0, 0, 0, 60, 310, 580, 810, 950, 1020,
      1010, 930, 770, 540, 260, 40, 0, 0, 0, 0, 0, 0
    ],
    hourlyRelativeHumidity: [
      38, 40, 42, 45, 46, 42, 35, 28, 22, 18, 15, 14,
      14, 15, 16, 18, 22, 26, 30, 33, 35, 36, 37, 38
    ],
    hourlyWindSpeed: [
      2.5, 2.2, 2.0, 1.9, 1.8, 2.4, 3.5, 4.8, 5.8, 6.6, 7.2, 7.5,
      7.6, 7.2, 6.3, 5.0, 4.0, 3.2, 2.8, 2.6, 2.5, 2.4, 2.5, 2.5
    ]
  },

  delhi: {
    id: 'delhi',
    name: 'New Delhi (NCR)',
    region: 'Northern Plains (Composite Climate)',
    classification: 'Zone III - Composite (ECBC India)',
    latitude: 28.6139,
    longitude: 77.2090,
    altitudeM: 216,
    description: 'Bimodal extreme climate with freezing winter fog (down to 4°C) and oppressive pre-monsoon heat (>42°C) combined with high monsoon humidity.',
    seasonSummary: 'Winter-Summer Transition Period',
    thermalChallenge: 'Adaptive envelope needed: high solar capture in winter vs complete solar rejection and insulation in summer.',
    designStrategy: 'Balanced thermal mass with switchable or seasonal external shading, low-E double glazing, dynamic ventilation controls.',
    designWinterTemp: 5.5,
    designSummerTemp: 42.0,
    hourlyAmbientTemp: [
      11.0, 10.2, 9.5, 9.0, 8.8, 9.2, 10.8, 13.5, 16.8, 19.5, 22.0, 23.5,
      24.0, 23.8, 22.5, 20.2, 17.5, 15.0, 13.5, 12.6, 12.0, 11.6, 11.4, 11.2
    ],
    hourlySolarIrradiance: [
      0, 0, 0, 0, 0, 0, 30, 180, 410, 620, 760, 820,
      810, 730, 580, 370, 130, 10, 0, 0, 0, 0, 0, 0
    ],
    hourlyRelativeHumidity: [
      78, 82, 85, 88, 90, 88, 80, 70, 60, 52, 46, 42,
      42, 44, 48, 55, 62, 68, 72, 74, 75, 76, 77, 78
    ],
    hourlyWindSpeed: [
      1.2, 1.0, 0.9, 0.8, 0.8, 1.1, 1.6, 2.4, 3.0, 3.5, 3.8, 4.0,
      4.1, 3.8, 3.2, 2.5, 1.9, 1.5, 1.4, 1.3, 1.2, 1.2, 1.2, 1.2
    ]
  },

  lucknow: {
    id: 'lucknow',
    name: 'Lucknow, Uttar Pradesh',
    region: 'Central Gangetic Basin',
    classification: 'Zone III - Subtropical / Composite',
    latitude: 26.8467,
    longitude: 80.9462,
    altitudeM: 123,
    description: 'Subtropical climate with intense winter inversions/fog and hot pre-monsoon winds (Loo).',
    seasonSummary: 'Winter Cold Spell',
    thermalChallenge: 'Dense morning fog dampens early solar radiation; rapid evening heat loss.',
    designStrategy: 'Roof insulation to prevent cold-bridge radiation loss, airtight door seals, south-southeast orientation bias.',
    designWinterTemp: 6.0,
    designSummerTemp: 41.5,
    hourlyAmbientTemp: [
      12.0, 11.1, 10.4, 9.8, 9.5, 10.0, 11.5, 14.0, 17.5, 20.2, 22.8, 24.2,
      24.8, 24.5, 23.2, 21.0, 18.2, 15.8, 14.2, 13.4, 12.8, 12.5, 12.2, 12.1
    ],
    hourlySolarIrradiance: [
      0, 0, 0, 0, 0, 0, 20, 150, 380, 590, 730, 790,
      780, 700, 550, 340, 110, 10, 0, 0, 0, 0, 0, 0
    ],
    hourlyRelativeHumidity: [
      82, 85, 88, 91, 93, 90, 82, 72, 62, 54, 48, 44,
      44, 46, 50, 58, 66, 72, 76, 78, 80, 81, 81, 82
    ],
    hourlyWindSpeed: [
      1.1, 0.9, 0.8, 0.7, 0.7, 1.0, 1.5, 2.2, 2.8, 3.2, 3.5, 3.6,
      3.7, 3.5, 2.9, 2.3, 1.7, 1.4, 1.2, 1.1, 1.1, 1.1, 1.1, 1.1
    ]
  },

  bengaluru: {
    id: 'bengaluru',
    name: 'Bengaluru, Karnataka',
    region: 'Deccan Plateau',
    classification: 'Zone IV - Moderate (ECBC India)',
    latitude: 12.9716,
    longitude: 77.5946,
    altitudeM: 920,
    description: 'Elevated plateau with pleasant year-round temperatures, cool evenings, and gentle breezes.',
    seasonSummary: 'Mild Summer',
    thermalChallenge: 'Urban heat island effect and midday glare.',
    designStrategy: 'Cross-ventilation, optimized fenestration with horizontal shading, medium thermal mass, green/cool roofs.',
    designWinterTemp: 15.0,
    designSummerTemp: 34.0,
    hourlyAmbientTemp: [
      20.5, 19.8, 19.2, 18.8, 18.5, 19.0, 21.0, 23.8, 26.5, 29.0, 31.0, 32.2,
      32.8, 32.5, 31.4, 29.8, 27.8, 25.5, 23.8, 22.6, 21.8, 21.2, 20.8, 20.6
    ],
    hourlySolarIrradiance: [
      0, 0, 0, 0, 0, 0, 50, 280, 540, 760, 900, 970,
      960, 880, 720, 490, 220, 30, 0, 0, 0, 0, 0, 0
    ],
    hourlyRelativeHumidity: [
      68, 71, 74, 77, 80, 75, 66, 56, 48, 42, 37, 34,
      34, 35, 38, 44, 52, 58, 62, 64, 65, 66, 67, 68
    ],
    hourlyWindSpeed: [
      2.0, 1.8, 1.6, 1.5, 1.5, 1.8, 2.5, 3.4, 4.1, 4.6, 5.0, 5.2,
      5.3, 5.1, 4.5, 3.8, 3.0, 2.5, 2.2, 2.1, 2.0, 2.0, 2.0, 2.0
    ]
  },

  chennai: {
    id: 'chennai',
    name: 'Chennai, Tamil Nadu',
    region: 'Coromandel Coastal Belt',
    classification: 'Zone V - Warm & Humid (ECBC India)',
    latitude: 13.0827,
    longitude: 80.2707,
    altitudeM: 7,
    description: 'High humidity (>75%), narrow diurnal temperature swings, and strong reliance on sea breeze convective cooling.',
    seasonSummary: 'Summer Monsoon Pre-Period',
    thermalChallenge: 'High latent heat load, low skin evaporative cooling potential, humid sticky conditions.',
    designStrategy: 'Maximum induced natural cross-ventilation, large shaded operable openings, low thermal mass (lightweight walls), elevated stilt/vented roofs.',
    designWinterTemp: 21.0,
    designSummerTemp: 38.5,
    hourlyAmbientTemp: [
      28.0, 27.5, 27.0, 26.8, 26.5, 27.2, 29.0, 31.5, 33.8, 35.5, 36.8, 37.5,
      37.8, 37.4, 36.2, 34.5, 32.8, 31.0, 30.0, 29.4, 29.0, 28.6, 28.3, 28.1
    ],
    hourlySolarIrradiance: [
      0, 0, 0, 0, 0, 0, 45, 260, 510, 730, 870, 940,
      930, 850, 690, 460, 200, 25, 0, 0, 0, 0, 0, 0
    ],
    hourlyRelativeHumidity: [
      84, 86, 88, 90, 92, 88, 80, 73, 67, 63, 59, 57,
      56, 58, 62, 68, 74, 78, 80, 82, 83, 84, 84, 84
    ],
    hourlyWindSpeed: [
      2.8, 2.5, 2.3, 2.2, 2.1, 2.6, 3.8, 5.0, 6.0, 6.8, 7.4, 7.8,
      8.0, 7.8, 7.0, 5.9, 4.8, 3.9, 3.4, 3.1, 3.0, 2.9, 2.9, 2.8
    ]
  }
};
