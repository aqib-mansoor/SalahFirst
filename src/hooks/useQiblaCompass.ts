import { useState, useEffect, useRef, useMemo } from 'react';
import { Vibration } from 'react-native';
import { Magnetometer } from 'expo-sensors';
import {
  calculateQiblaBearing,
  calculateDistanceToKaaba,
  getCardinalDirection,
} from '@/utils/qiblaCalculations';

export type TurnDirection = 'left' | 'right' | 'aligned';

export const useQiblaCompass = (lat?: number | null, lng?: number | null) => {
  const [heading, setHeading] = useState<number>(0);
  const [hasSensor, setHasSensor] = useState<boolean>(true);
  const [needsCalibration, setNeedsCalibration] = useState<boolean>(false);
  const smoothHeadingRef = useRef<number>(0);
  const wasAlignedRef = useRef<boolean>(false);

  const hasCoords = lat != null && lng != null && !isNaN(lat) && !isNaN(lng);
  const qiblaBearing = useMemo(
    () => (hasCoords ? calculateQiblaBearing(lat, lng) : 0),
    [lat, lng, hasCoords]
  );
  const distanceKm = useMemo(
    () => (hasCoords ? calculateDistanceToKaaba(lat, lng) : 0),
    [lat, lng, hasCoords]
  );
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
  const isAligned = relativePointerAngle <= 4 || relativePointerAngle >= 356;

  // Tactile haptic pulse on exact alignment
  useEffect(() => {
    if (isAligned && !wasAlignedRef.current) {
      try {
        Vibration.vibrate(40);
      } catch {}
    }
    wasAlignedRef.current = isAligned;
  }, [isAligned]);

  const turnDirection: TurnDirection = isAligned
    ? 'aligned'
    : relativePointerAngle > 180
    ? 'left'
    : 'right';

  const turnDegrees = isAligned
    ? 0
    : Math.round(relativePointerAngle > 180 ? 360 - relativePointerAngle : relativePointerAngle);

  return {
    heading,
    qiblaBearing,
    distanceKm,
    cardinal,
    relativePointerAngle,
    isAligned,
    turnDirection,
    turnDegrees,
    hasSensor,
    needsCalibration,
  };
};
