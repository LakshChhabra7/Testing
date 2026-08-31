// Solar Geometry & Irradiance Decomposition Model

export interface SolarAngles {
  altitudeDeg: number; // Beta (0-90°)
  azimuthDeg: number;  // Gamma_s (0-360°, North=0, East=90, South=180, West=270)
  zenithDeg: number;   // Theta_z
  cosIncidenceSouth: number;
  cosIncidenceNorth: number;
  cosIncidenceEast: number;
  cosIncidenceWest: number;
  cosIncidenceRoof: number;
}

export function calculateSolarAngles(
  latitudeDeg: number,
  hourOfDay: number, // 0..23 (can be fractional like 13.5)
  dayOfYear: number = 15 // Jan 15 for winter analysis
): SolarAngles {
  const deg2rad = Math.PI / 180;
  const rad2deg = 180 / Math.PI;

  const latRad = latitudeDeg * deg2rad;

  // Solar declination (Cooper's formula)
  const declinationDeg = 23.45 * Math.sin(deg2rad * ((360 / 365) * (284 + dayOfYear)));
  const decRad = declinationDeg * deg2rad;

  // Solar hour angle (omega = 15° per hour from solar noon at 12:00)
  const hourAngleDeg = (hourOfDay - 12) * 15;
  const omegaRad = hourAngleDeg * deg2rad;

  // Solar altitude beta: sin(beta) = sin(phi)*sin(delta) + cos(phi)*cos(delta)*cos(omega)
  const sinAltitude = Math.sin(latRad) * Math.sin(decRad) + Math.cos(latRad) * Math.cos(decRad) * Math.cos(omegaRad);
  const altitudeRad = Math.asin(Math.max(-1, Math.min(1, sinAltitude)));
  const altitudeDeg = Math.max(0, altitudeRad * rad2deg);

  const zenithDeg = 90 - altitudeDeg;
  const zenithRad = zenithDeg * deg2rad;

  // Solar azimuth gamma_s: cos(gamma_s) = (sin(beta)*sin(phi) - sin(delta)) / (cos(beta)*cos(phi))
  let azimuthDeg = 180; // default south
  if (altitudeDeg > 0.1) {
    const cosAz = (Math.sin(altitudeRad) * Math.sin(latRad) - Math.sin(decRad)) / 
                  (Math.cos(altitudeRad) * Math.cos(latRad) + 1e-6);
    const clampedCosAz = Math.max(-1, Math.min(1, cosAz));
    const azRad = Math.acos(clampedCosAz);
    azimuthDeg = hourOfDay <= 12 ? (180 - azRad * rad2deg) : (180 + azRad * rad2deg);
    if (azimuthDeg < 0) azimuthDeg += 360;
  }

  // Angle of incidence for vertical walls (tilt = 90°)
  // cos(theta) = cos(beta) * cos(gamma_s - surface_azimuth)
  const computeCosIncidence = (surfaceAzimuthDeg: number): number => {
    if (altitudeDeg <= 0) return 0;
    const diffAzRad = (azimuthDeg - surfaceAzimuthDeg) * deg2rad;
    const val = Math.cos(altitudeRad) * Math.cos(diffAzRad);
    return Math.max(0, val);
  };

  const cosIncidenceSouth = computeCosIncidence(180);
  const cosIncidenceNorth = computeCosIncidence(0);
  const cosIncidenceEast = computeCosIncidence(90);
  const cosIncidenceWest = computeCosIncidence(270);
  const cosIncidenceRoof = altitudeDeg > 0 ? Math.cos(zenithRad) : 0; // horizontal roof

  return {
    altitudeDeg: Number(altitudeDeg.toFixed(2)),
    azimuthDeg: Number(azimuthDeg.toFixed(2)),
    zenithDeg: Number(zenithDeg.toFixed(2)),
    cosIncidenceSouth: Number(cosIncidenceSouth.toFixed(3)),
    cosIncidenceNorth: Number(cosIncidenceNorth.toFixed(3)),
    cosIncidenceEast: Number(cosIncidenceEast.toFixed(3)),
    cosIncidenceWest: Number(cosIncidenceWest.toFixed(3)),
    cosIncidenceRoof: Number(cosIncidenceRoof.toFixed(3))
  };
}

export function calculateIncidentIrradianceOnSurfaces(
  globalHorizontalIrradiance: number,
  solarAngles: SolarAngles,
  shelterOrientationDeg: number = 0 // Rotation offset from South
) {
  // Global horizontal decomposition (Perez/Erbs model approximation)
  const gh = globalHorizontalIrradiance;
  if (gh <= 0 || solarAngles.altitudeDeg <= 0) {
    return { south: 0, north: 0, east: 0, west: 0, roof: 0 };
  }

  const diffuseFraction = 0.25 + 0.15 * Math.sin((solarAngles.altitudeDeg * Math.PI) / 180);
  const diffuseHorizontal = gh * diffuseFraction;
  const directHorizontal = gh - diffuseHorizontal;
  const directNormal = solarAngles.cosIncidenceRoof > 0.05 
    ? directHorizontal / solarAngles.cosIncidenceRoof 
    : 0;

  // Effective surface angles rotated by shelter orientation
  const deg2rad = Math.PI / 180;
  const altRad = solarAngles.altitudeDeg * deg2rad;
  const solAz = solarAngles.azimuthDeg;

  const getSurfaceIrradiance = (baseAzimuth: number): number => {
    const surfaceAzimuth = (baseAzimuth + shelterOrientationDeg + 360) % 360;
    const diffAzRad = (solAz - surfaceAzimuth) * deg2rad;
    const cosInc = Math.max(0, Math.cos(altRad) * Math.cos(diffAzRad));
    
    const directComponent = directNormal * cosInc;
    const diffuseComponent = diffuseHorizontal * 0.5; // view factor to sky 0.5 for vertical wall
    const groundReflected = gh * 0.2 * 0.5; // albedo ~0.2
    
    return directComponent + diffuseComponent + groundReflected;
  };

  return {
    south: Math.round(getSurfaceIrradiance(180)),
    north: Math.round(getSurfaceIrradiance(0)),
    east: Math.round(getSurfaceIrradiance(90)),
    west: Math.round(getSurfaceIrradiance(270)),
    roof: Math.round(gh)
  };
}
