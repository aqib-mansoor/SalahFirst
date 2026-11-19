import { useState, useEffect, useRef, useMemo } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { Magnetometer, Accelerometer } from 'expo-sensors';
import {
  calculateQiblaBearing,
  calculateDistanceToKaaba,
  calculateMagneticDeclination,
  getCardinalDirection,
} from '@/utils/qiblaCalculations';
import { triggerHaptic } from '@/utils/haptics';

export type TurnDirection = 'left' | 'right' | 'aligned';

export const useQiblaCompass = (
  lat?: number | null,
  lng?: number | null,
  isActive: boolean = true
) => {
  const [heading, setHeading] = useState<number>(0);
  const [hasSensor, setHasSensor] = useState<boolean>(true);
  const [needsCalibration, setNeedsCalibration] = useState<boolean>(false);
  const [isTilted, setIsTilted] = useState<boolean>(false);
  const smoothHeadingRef = useRef<number>(0);
  const wasAlignedRef = useRef<boolean>(false);
  const gravityRef = useRef<{ x: number; y: number; z: number } | null>(null);

  const hasCoords = lat != null && lng != null && !isNaN(lat) && !isNaN(lng);
  const qiblaBearing = useMemo(
    () => (hasCoords ? calculateQiblaBearing(lat, lng) : 0),
    [lat, lng, hasCoords]
  );
  const magneticDeclination = useMemo(
    () => (hasCoords ? calculateMagneticDeclination(lat, lng) : 0),
    [lat, lng, hasCoords]
  );
  const distanceKm = useMemo(
    () => (hasCoords ? calculateDistanceToKaaba(lat, lng) : 0),
    [lat, lng, hasCoords]
  );
  const cardinal = useMemo(() => getCardinalDirection(qiblaBearing), [qiblaBearing]);

  useEffect(() => {
    if (!isActive) return;

    let magSub: { remove: () => void } | null = null;
    let accelSub: { remove: () => void } | null = null;
    let isMounted = true;

    const setupSensors = async () => {
      try {
        const isAvailable = await Magnetometer.isAvailableAsync();
        if (!isMounted) return;

        if (!isAvailable) {
          setHasSensor(false);
          return;
        }

        const isAccelAvailable = await Accelerometer.isAvailableAsync().catch(() => false);
        if (isAccelAvailable && isMounted) {
          Accelerometer.setUpdateInterval(100);
          accelSub = Accelerometer.addListener((acc) => {
            gravityRef.current = acc;
            const norm = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z) || 1;
            const tiltRad = Math.acos(Math.min(1, Math.abs(acc.z) / norm));
            const tiltDeg = (tiltRad * 180) / Math.PI;
            setIsTilted(tiltDeg > 32);
          });
        }

        Magnetometer.setUpdateInterval(50); // 50ms interval for smooth tracking

        magSub = Magnetometer.addListener((data) => {
          const { x, y, z } = data;
          let rawAngle = Math.atan2(-x, y) * (180 / Math.PI);

          // Apply 3D Pitch/Roll Tilt Compensation when Accelerometer gravity vector is present
          const g = gravityRef.current;
          if (g) {
            const gNorm = Math.sqrt(g.x * g.x + g.y * g.y + g.z * g.z);
            if (gNorm > 0.2) {
              const gx = g.x / gNorm;
              const gy = g.y / gNorm;
              const gz = g.z / gNorm;
              const pitch = Math.asin(-gy);
              const roll = Math.atan2(gx, gz);
              const cosP = Math.cos(pitch);
              const sinP = Math.sin(pitch);
              const cosR = Math.cos(roll);
              const sinR = Math.sin(roll);

              const xh = x * cosR + z * sinR;
              const yh = x * sinP * sinR + y * cosP - z * sinP * cosR;
              if (!isNaN(xh) && !isNaN(yh)) {
                rawAngle = Math.atan2(-xh, yh) * (180 / Math.PI);
              }
            }
          }

          // Convert Magnetic North heading to True Geographic North using local declination
          rawAngle = (rawAngle + magneticDeclination + 360) % 360;

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

    setupSensors();

    const appStateSub = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active') {
        if (!magSub) setupSensors();
      } else {
        if (magSub) {
          magSub.remove();
          magSub = null;
        }
        if (accelSub) {
          accelSub.remove();
          accelSub = null;
        }
      }
    });

    return () => {
      isMounted = false;
      appStateSub.remove();
      if (magSub) magSub.remove();
      if (accelSub) accelSub.remove();
    };
  }, [isActive, magneticDeclination]);

  const relativePointerAngle = (qiblaBearing - heading + 360) % 360;
  const isAligned = relativePointerAngle <= 4 || relativePointerAngle >= 356;

  // Tactile haptic pulse on exact alignment (only when tab is active)
  useEffect(() => {
    if (!isActive) return;
    if (isAligned && !wasAlignedRef.current) {
      triggerHaptic('success');
    }
    wasAlignedRef.current = isAligned;
  }, [isAligned, isActive]);

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
    isTilted,
  };
};
