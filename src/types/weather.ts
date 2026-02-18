/** Tempest Weather Station data types based on the WeatherFlow API */

export interface StationMeta {
  station_id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  timezone: string;
  firmware_revision: string;
  serial_number: string;
  device_id: number;
}

export interface CurrentObservation {
  timestamp: number;
  windLull: number;        // m/s
  windAvg: number;         // m/s
  windGust: number;        // m/s
  windDirection: number;   // degrees
  windSampleInterval: number; // seconds
  stationPressure: number; // MB
  airTemperature: number;  // °C
  relativeHumidity: number; // %
  illuminance: number;     // lux
  uvIndex: number;
  solarRadiation: number;  // W/m²
  rainAccumulated: number; // mm
  precipitationType: PrecipitationType;
  lightningStrikeAvgDistance: number; // km
  lightningStrikeCount: number;
  battery: number;         // Volts
  reportInterval: number;  // minutes
  localDayRainAccumulation: number; // mm
  feelsLike: number;       // °C (calculated)
  dewPoint: number;        // °C (calculated)
  wetBulbTemperature: number; // °C (calculated)
  heatIndex: number;       // °C (calculated)
  windChill: number;       // °C (calculated)
  pressureTrend: PressureTrend;
}

export enum PrecipitationType {
  None = 0,
  Rain = 1,
  Hail = 2,
  RainAndHail = 3,
}

export enum PressureTrend {
  Falling = 'falling',
  Steady = 'steady',
  Rising = 'rising',
}

export interface ForecastDay {
  dayNum: number;
  monthNum: number;
  conditions: string;
  icon: string;
  airTempHigh: number;   // °C
  airTempLow: number;    // °C
  precipProbability: number; // %
  precipType: string;
  sunrise: number;       // epoch
  sunset: number;        // epoch
}

export interface HourlyForecast {
  timestamp: number;
  conditions: string;
  icon: string;
  airTemperature: number;
  feelsLike: number;
  relativeHumidity: number;
  windAvg: number;
  windDirection: number;
  windGust: number;
  precipProbability: number;
  uvIndex: number;
}

export interface StationStatus {
  isOnline: boolean;
  lastReport: number;
  batteryLevel: number;
  signalStrength: number; // 0-4
  firmwareVersion: string;
}

export type TemperatureUnit = 'C' | 'F';
export type WindUnit = 'ms' | 'mph' | 'kph' | 'kts';
export type PressureUnit = 'mb' | 'inHg' | 'hPa';
export type RainUnit = 'mm' | 'in';

export interface UserPreferences {
  temperatureUnit: TemperatureUnit;
  windUnit: WindUnit;
  pressureUnit: PressureUnit;
  rainUnit: RainUnit;
  theme: string;
}

export type ThemeName = 'liquid-glass' | 'midnight-aurora' | 'desert-sunset' | 'arctic-frost';
