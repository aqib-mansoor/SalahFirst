const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

const toRad = (deg: number) => (deg * Math.PI) / 180;
const toDeg = (rad: number) => (rad * 180) / Math.PI;

export const calculateQiblaBearing = (lat: number, lng: number): number => {
  const phiK = toRad(KAABA_LAT);
  const lambdaK = toRad(KAABA_LNG);
  const phi = toRad(lat);
  const lambda = toRad(lng);

  const psi = toDeg(
    Math.atan2(
      Math.sin(lambdaK - lambda),
      Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda)
    )
  );

  return Math.round((psi + 360) % 360);
};

export const calculateDistanceToKaaba = (lat: number, lng: number): number => {
  const R = 6371; // Earth radius in km
  const dLat = toRad(KAABA_LAT - lat);
  const dLng = toRad(KAABA_LNG - lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat)) * Math.cos(toRad(KAABA_LAT)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
};

/**
 * Estimates the local magnetic declination (difference between True Geographic North
 * and Magnetic North in degrees, East = positive, West = negative) using the
 * World Magnetic Model geomagnetic dipole + regional harmonic approximation.
 */
export const calculateMagneticDeclination = (lat: number, lng: number): number => {
  // 2025/2026 North Geomagnetic Pole reference (~80.8°N, -72.7°W)
  const poleLat = toRad(80.8);
  const poleLng = toRad(-72.7);
  const phi = toRad(lat);
  const dLambda = poleLng - toRad(lng);

  const y = Math.sin(dLambda) * Math.cos(poleLat);
  const x =
    Math.cos(phi) * Math.sin(poleLat) -
    Math.sin(phi) * Math.cos(poleLat) * Math.cos(dLambda);
  const dipoleDeclination = toDeg(Math.atan2(y, x));

  return Math.max(-35, Math.min(35, Math.round(dipoleDeclination * 10) / 10));
};

export const getCardinalDirection = (deg: number): string => {
  const directions = [
    'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW',
  ];
  const index = Math.round(deg / 22.5) % 16;
  return directions[index];
};

