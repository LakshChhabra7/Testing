import rawDataset from './synthetic/dataset.json';

export interface WeatherRecord {
  Location: string;
  Latitude: number;
  Longitude: number;
  Elevation_m: number;
  Region_Climate_Type: string;
  Month: string;
  Month_Number: number;
  Season: string;
  Date_Representative: string;
  Location_Month_Key: string;
  Outdoor_Temperature_C: number;
  Relative_Humidity_pct: number;
  Wind_Speed_ms: number;
  Wind_Direction: string;
  Solar_kWh_m2_day: number;
  Solar_Radiation_Wm2: number;
  Rainfall_mm: number;
  Seasonal_Pressure_Adjustment_hPa: number;
  Atmospheric_Pressure_hPa: number;
  Data_Source_Label: string;
}

export interface SyntheticMaterialRecord {
  Material_ID: string;
  Material_Name: string;
  Material_Category: string;
  Thermal_Conductivity_k_WmK: number;
  Density_kgm3: number;
  Specific_Heat_JkgK: number;
  Emissivity: number;
  Thickness_Min_mm: number;
  Thickness_Max_mm: number;
  Thickness_Mid_mm: number;
  Thermal_Resistance_R_m2KW: number;
  Moisture_Resistance: string;
  Durability: string;
  Weight_Category: string;
  Approximate_Relative_Cost: string;
  Suitability_Cold_Climate: string;
  Suitability_Hot_Dry_Climate: string;
  Suitability_Hot_Humid_Climate: string;
  Suitability_Temporary_Shelter: string;
  Advantages: string;
  Limitations: string;
  Data_Source_Label: string;
}

export interface ShelterDesignRecord {
  Design_ID: string;
  Climate_Archetype: string;
  Shelter_Length_m: number;
  Shelter_Width_m: number;
  Shelter_Height_m: number;
  Floor_Area_m2: number;
  Volume_m3: number;
  Orientation: string;
  Wall_Material_ID: string;
  Roof_Material_ID: string;
  Floor_Material_ID: string;
  Insulation_Material_ID: string;
  Wall_Thickness_mm: number;
  Roof_Thickness_mm: number;
  Insulation_Thickness_mm: number;
  Window_Opening_Area_m2: number;
  Gross_Wall_Area_m2: number;
  Net_Wall_Area_m2: number;
  Opening_to_Wall_Ratio: number;
  Ventilation_Type: string;
  Number_of_Openings: number;
  Shading_Type: string;
  Roof_Type: string;
  Roof_Reflectivity_Albedo: number;
  Number_of_Occupants: number;
  Activity_Level: string;
  Clothing_Level_clo: number;
  Shelter_Usage_Duration_hrs: number;
  Data_Source_Label: string;
}

export interface CombinedScenarioRecord {
  Scenario_ID: string;
  Design_ID: string;
  Climate_Archetype: string;
  Match_Type: string;
  Location: string;
  Month: string;
  Location_Month_Key: string;
  Outdoor_Temperature_C: number;
  Relative_Humidity_pct: number;
  Wind_Speed_ms: number;
  Solar_Radiation_Wm2: number;
  Rainfall_mm: number;
  Wall_Material_ID: string;
  Wall_k_WmK: number;
  Wall_Thickness_mm: number;
  Insulation_Material_ID: string;
  Insulation_k_WmK: number;
  Insulation_Thickness_mm: number;
  Wall_R_m2KW: number;
  Insulation_R_m2KW: number;
  Air_Film_R_m2KW: number;
  Total_R_m2KW: number;
  U_value_Wm2K: number;
  Net_Wall_Area_m2: number;
  Window_Opening_Area_m2: number;
  Volume_m3: number;
  Opening_to_Wall_Ratio: number;
  Number_of_Occupants: number;
  Activity_Level: string;
  Clothing_Level_clo: number;
  Data_Source_Label: string;
}

export interface OutputBenefitsRecord {
  Scenario_ID: string;
  Estimated_ACH: number;
  Ventilation_Loss_Coefficient_WK: number;
  Conductive_Loss_Coefficient_WK: number;
  Total_Loss_Coefficient_WK: number;
  Effective_Solar_Aperture_m2: number;
  Estimated_Heat_Gain_W: number;
  Estimated_Indoor_Temperature_C: number;
  Indoor_Outdoor_Temp_Difference_C: number;
  Estimated_Heat_Loss_W: number;
  Adaptive_Comfort_Neutral_Temp_C: number;
  Adaptive_Comfort_Deviation_C: number;
  Comfort_Band_Status: string;
  Comfort_Score_0to100: number;
  PMV_Approximate_LowConfidence: number;
  PPD_Approximate_pct_LowConfidence: number;
  Estimated_Heating_Requirement_W: number;
  Estimated_Cooling_Requirement_W: number;
  Energy_Requirement_W: number;
  Thermal_Performance_Score_0to100: number;
  Overall_Shelter_Suitability_Score_0to100: number;
  Recommended_Status: string;
  Primary_Recommendation_Reason: string;
  Data_Source_Label: string;
}

export interface DataDictionaryRecord {
  Column_Name: string;
  Sheet: string;
  Meaning: string;
  Unit: string;
  Data_Type: string;
  Possible_Range: string;
  Source_Type: string;
  Real_or_Synthetic: string;
  Why_it_Matters_for_PS51: string;
}

export const WEATHER_DATA = (rawDataset.Weather_Data || []) as WeatherRecord[];
export const SYNTHETIC_MATERIALS = (rawDataset.Material_Properties || []) as SyntheticMaterialRecord[];
export const SHELTER_DESIGNS = (rawDataset.Shelter_Design || []) as ShelterDesignRecord[];
export const COMBINED_SCENARIOS = (rawDataset.Combined_Scenarios || []) as CombinedScenarioRecord[];
export const OUTPUT_BENEFITS = (rawDataset.Output_Benefits || []) as OutputBenefitsRecord[];
export const DATA_DICTIONARY = (rawDataset.Data_Dictionary || []) as DataDictionaryRecord[];

// Join scenarios with their output benefits
export interface FullScenarioData extends CombinedScenarioRecord {
  output?: OutputBenefitsRecord;
}

export const ALL_FULL_SCENARIOS: FullScenarioData[] = COMBINED_SCENARIOS.map(sc => {
  const out = OUTPUT_BENEFITS.find(o => o.Scenario_ID === sc.Scenario_ID);
  return {
    ...sc,
    output: out
  };
});
