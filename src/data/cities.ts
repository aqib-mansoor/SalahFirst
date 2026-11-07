import { calculateQiblaBearing } from '@/utils/qiblaCalculations';

export interface PresetCity {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  qiblaDegrees: number;
  methodName: string;
  region?: string;
}

const createCity = (
  id: string,
  name: string,
  country: string,
  latitude: number,
  longitude: number,
  methodName: string
): PresetCity => ({
  id,
  name,
  country,
  latitude,
  longitude,
  qiblaDegrees: calculateQiblaBearing(latitude, longitude),
  methodName,
});

export const PRESET_CITIES: PresetCity[] = [
  // Pakistan
  createCity('pk-1', 'Karachi', 'Pakistan', 24.8607, 67.0011, 'University of Islamic Sciences, Karachi'),
  createCity('pk-2', 'Lahore', 'Pakistan', 31.5204, 74.3587, 'University of Islamic Sciences, Karachi'),
  createCity('pk-3', 'Islamabad', 'Pakistan', 33.6844, 73.0479, 'University of Islamic Sciences, Karachi'),
  createCity('pk-4', 'Rawalpindi', 'Pakistan', 33.5651, 73.0169, 'University of Islamic Sciences, Karachi'),
  createCity('pk-5', 'Faisalabad', 'Pakistan', 31.4504, 73.135, 'University of Islamic Sciences, Karachi'),
  createCity('pk-6', 'Multan', 'Pakistan', 30.1575, 71.5249, 'University of Islamic Sciences, Karachi'),
  createCity('pk-7', 'Peshawar', 'Pakistan', 34.0151, 71.5249, 'University of Islamic Sciences, Karachi'),
  createCity('pk-8', 'Quetta', 'Pakistan', 30.1798, 66.975, 'University of Islamic Sciences, Karachi'),
  createCity('pk-9', 'Chakwal', 'Pakistan', 32.9328, 72.8553, 'University of Islamic Sciences, Karachi'),
  createCity('pk-10', 'Sialkot', 'Pakistan', 32.4945, 74.5229, 'University of Islamic Sciences, Karachi'),
  createCity('pk-11', 'Gujranwala', 'Pakistan', 32.1877, 74.1945, 'University of Islamic Sciences, Karachi'),
  createCity('pk-12', 'Hyderabad', 'Pakistan', 25.396, 68.3578, 'University of Islamic Sciences, Karachi'),

  // Saudi Arabia
  createCity('sa-1', 'Makkah', 'Saudi Arabia', 21.4225, 39.8262, 'Umm al-Qura University, Makkah'),
  createCity('sa-2', 'Madinah', 'Saudi Arabia', 24.5247, 39.5692, 'Umm al-Qura University, Makkah'),
  createCity('sa-3', 'Riyadh', 'Saudi Arabia', 24.7136, 46.6753, 'Umm al-Qura University, Makkah'),
  createCity('sa-4', 'Jeddah', 'Saudi Arabia', 21.5433, 39.1728, 'Umm al-Qura University, Makkah'),
  createCity('sa-5', 'Dammam', 'Saudi Arabia', 26.4207, 50.0888, 'Umm al-Qura University, Makkah'),

  // United Arab Emirates
  createCity('ae-1', 'Dubai', 'United Arab Emirates', 25.2048, 55.2708, 'Dubai (UAE)'),
  createCity('ae-2', 'Abu Dhabi', 'United Arab Emirates', 24.4539, 54.3773, 'Dubai (UAE)'),
  createCity('ae-3', 'Sharjah', 'United Arab Emirates', 25.3463, 55.4209, 'Dubai (UAE)'),
  createCity('ae-4', 'Ajman', 'United Arab Emirates', 25.4052, 55.5136, 'Dubai (UAE)'),

  // Qatar, Kuwait, Bahrain, Oman
  createCity('qa-1', 'Doha', 'Qatar', 25.2854, 51.531, 'Qatar Ministry of Awqaf'),
  createCity('kw-1', 'Kuwait City', 'Kuwait', 29.3759, 47.9774, 'State of Kuwait'),
  createCity('bh-1', 'Manama', 'Bahrain', 26.2285, 50.586, 'Muslim World League'),
  createCity('om-1', 'Muscat', 'Oman', 23.588, 58.3829, 'Muslim World League'),

  // Turkey & Egypt
  createCity('tr-1', 'Istanbul', 'Turkey', 41.0082, 28.9784, 'Diyanet, Turkey'),
  createCity('tr-2', 'Ankara', 'Turkey', 39.9334, 32.8597, 'Diyanet, Turkey'),
  createCity('tr-3', 'Konya', 'Turkey', 37.8746, 32.4932, 'Diyanet, Turkey'),
  createCity('eg-1', 'Cairo', 'Egypt', 30.0444, 31.2357, 'Egyptian General Authority'),
  createCity('eg-2', 'Alexandria', 'Egypt', 31.2001, 29.9187, 'Egyptian General Authority'),

  // United Kingdom & Europe
  createCity('uk-1', 'London', 'United Kingdom', 51.5074, -0.1278, 'Muslim World League'),
  createCity('uk-2', 'Birmingham', 'United Kingdom', 52.4862, -1.8904, 'Muslim World League'),
  createCity('uk-3', 'Manchester', 'United Kingdom', 53.4808, -2.2426, 'Muslim World League'),
  createCity('uk-4', 'Glasgow', 'United Kingdom', 55.8642, -4.2518, 'Muslim World League'),
  createCity('fr-1', 'Paris', 'France', 48.8566, 2.3522, 'Muslim World League'),
  createCity('de-1', 'Berlin', 'Germany', 52.52, 13.405, 'Muslim World League'),
  createCity('se-1', 'Stockholm', 'Sweden', 59.3293, 18.0686, 'Muslim World League'),
  createCity('no-1', 'Tromsø', 'Norway', 69.6492, 18.9553, 'Muslim World League'),

  // North America
  createCity('us-1', 'New York', 'United States', 40.7128, -74.006, 'ISNA (North America)'),
  createCity('us-2', 'Chicago', 'United States', 41.8781, -87.6298, 'ISNA (North America)'),
  createCity('us-3', 'Houston', 'United States', 29.7604, -95.3698, 'ISNA (North America)'),
  createCity('us-4', 'Los Angeles', 'United States', 34.0522, -118.2437, 'ISNA (North America)'),
  createCity('us-5', 'Dallas', 'United States', 32.7767, -96.797, 'ISNA (North America)'),
  createCity('ca-1', 'Toronto', 'Canada', 43.6532, -79.3832, 'ISNA (North America)'),
  createCity('ca-2', 'Montreal', 'Canada', 45.5017, -73.5673, 'ISNA (North America)'),
  createCity('ca-3', 'Vancouver', 'Canada', 49.2827, -123.1207, 'ISNA (North America)'),

  // East & South Asia
  createCity('jp-1', 'Tokyo', 'Japan', 35.6762, 139.6503, 'Muslim World League'),
  createCity('in-1', 'Delhi', 'India', 28.7041, 77.1025, 'University of Islamic Sciences, Karachi'),
  createCity('in-2', 'Mumbai', 'India', 19.076, 72.8777, 'University of Islamic Sciences, Karachi'),
  createCity('in-3', 'Hyderabad', 'India', 17.385, 78.4867, 'University of Islamic Sciences, Karachi'),
  createCity('bd-1', 'Dhaka', 'Bangladesh', 23.8103, 90.4125, 'University of Islamic Sciences, Karachi'),

  // Southeast Asia & Australia
  createCity('my-1', 'Kuala Lumpur', 'Malaysia', 3.139, 101.6869, 'MUIS Singapore'),
  createCity('id-1', 'Jakarta', 'Indonesia', -6.2088, 106.8456, 'MUIS Singapore'),
  createCity('sg-1', 'Singapore', 'Singapore', 1.3521, 103.8198, 'MUIS Singapore'),
  createCity('au-1', 'Sydney', 'Australia', -33.8688, 151.2093, 'Muslim World League'),
];

