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

export const getCardinalDirection = (deg: number): string => {
  const directions = [
    'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW',
  ];
  const index = Math.round(deg / 22.5) % 16;
  return directions[index];
};
