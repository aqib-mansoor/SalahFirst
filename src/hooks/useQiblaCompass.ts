import { useState, useEffect, useRef, useMemo } from 'react';
import { Magnetometer } from 'expo-sensors';
import {
  calculateQiblaBearing,
  calculateDistanceToKaaba,
  getCardinalDirection,
} from '@/utils/qiblaCalculations';

export const useQiblaCompass = (lat: number = 24.8607, lng: number = 67.0011) => {
  const [heading, setHeading] = useState<number>(0);
  const [hasSensor, setHasSensor] = useState<boolean>(true);
  const [needsCalibration, setNeedsCalibration] = useState<boolean>(false);
  const smoothHeadingRef = useRef<number>(0);

  const qiblaBearing = useMemo(() => calculateQiblaBearing(lat, lng), [lat, lng]);
  const distanceKm = useMemo(() => calculateDistanceToKaaba(lat, lng), [lat, lng]);
  const cardinal = useMemo(() => getCardinalDirection(qiblaBearing), [qiblaBearing]);

  useEffect(() => {
    let subscription: { remove: () => void } | null = null;
    let isMounted = true;

    const setupMagnetometer = async () => {
      try {
        const isAvailable = await Magnetometer.isAvailableAsync();
        if (!isMounted) return;

        if (!isAvailable) {
          setHasSensor(false);
          return;
        }

        Magnetometer.setUpdateInterval(50); // 50ms interval for smooth tracking

        subscription = Magnetometer.addListener((data) => {
          const { x, y, z } = data;
          let rawAngle = Math.atan2(-x, y) * (180 / Math.PI);
          if (rawAngle < 0) rawAngle += 360;

          // Check magnetic magnitude for interference (normal Earth field ~30-65 uT)
          const magnitude = Math.sqrt(x * x + y * y + z * z);
          if (magnitude > 0 && (magnitude < 20 || magnitude > 85)) {
            setNeedsCalibration(true);
          } else {
            setNeedsCalibration(false);
          }

          // Low-pass filter smoothing for steady compass rotation
          let diff = rawAngle - smoothHeadingRef.current;
          if (diff > 180) diff -= 360;
          if (diff < -180) diff += 360;

          smoothHeadingRef.current = (smoothHeadingRef.current + diff * 0.25 + 360) % 360;
          setHeading(Math.round(smoothHeadingRef.current));
        });
      } catch {
        if (isMounted) setHasSensor(false);
      }
    };

    setupMagnetometer();

    return () => {
      isMounted = false;
      if (subscription) subscription.remove();
    };
  }, []);

  const relativePointerAngle = (qiblaBearing - heading + 360) % 360;
  const isAligned =
    relativePointerAngle <= 4 || relativePointerAngle >= 356;

  return {
    heading,
    qiblaBearing,
    distanceKm,
    cardinal,
    relativePointerAngle,
    isAligned,
    hasSensor,
    needsCalibration,
  };
};
