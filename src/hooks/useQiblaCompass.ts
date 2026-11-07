import { useState, useEffect, useRef } from 'react';
import { Magnetometer } from 'expo-sensors';
import {
  calculateQiblaBearing,
  calculateDistanceToKaaba,
  getCardinalDirection,
} from '@/utils/qiblaCalculations';

export const useQiblaCompass = (lat: number = 32.9328, lng: number = 72.8553) => {
  const [heading, setHeading] = useState<number>(0);
  const [hasSensor, setHasSensor] = useState<boolean>(true);
  const smoothHeadingRef = useRef<number>(0);

  const qiblaBearing = calculateQiblaBearing(lat, lng);
  const distanceKm = calculateDistanceToKaaba(lat, lng);
  const cardinal = getCardinalDirection(qiblaBearing);

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

        Magnetometer.setUpdateInterval(60); // 60ms interval

        subscription = Magnetometer.addListener((data) => {
          const { x, y } = data;
          let rawAngle = Math.atan2(-x, y) * (180 / Math.PI);
          if (rawAngle < 0) rawAngle += 360;

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
  };
};

