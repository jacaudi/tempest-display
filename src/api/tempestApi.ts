/**
 * Tempest WeatherFlow API client
 *
 * REST API base: https://swd.weatherflow.com/swd/rest
 * WebSocket: wss://ws.weatherflow.com/swd/data
 *
 * All methods currently return stub data.
 * Replace with real fetch calls when connecting to the live API.
 */

import type {
  CurrentObservation,
  StationMeta,
  ForecastDay,
  HourlyForecast,
  StationStatus,
} from '../types/weather';
import {
  stubCurrentObservation,
  stubStationMeta,
  stubForecast,
  stubHourlyForecast,
  stubStationStatus,
} from './stubData';

const API_BASE = 'https://swd.weatherflow.com/swd/rest';

/**
 * In production, the token is obtained via:
 * 1. Personal Access Token (Settings → Data Authorizations → Create Token at tempestwx.com)
 * 2. OAuth flow for third-party apps
 */
let _apiToken: string | null = null;

export function setApiToken(token: string) {
  _apiToken = token;
}

export function getApiToken(): string | null {
  return _apiToken;
}

// ---------------------------------------------------------------------------
// Station metadata
// GET /stations?token={token}
// ---------------------------------------------------------------------------
export async function fetchStationMeta(
  _stationId?: number
): Promise<StationMeta> {
  // TODO: Replace with real API call
  // const res = await fetch(`${API_BASE}/stations?token=${_apiToken}`);
  // const data = await res.json();
  // return parseStationMeta(data);
  void _stationId;
  void API_BASE;
  return Promise.resolve({ ...stubStationMeta });
}

// ---------------------------------------------------------------------------
// Current observations
// GET /observations/stn/{station_id}?token={token}
// ---------------------------------------------------------------------------
export async function fetchCurrentObservation(
  _stationId?: number
): Promise<CurrentObservation> {
  // TODO: Replace with real API call
  // const res = await fetch(
  //   `${API_BASE}/observations/stn/${stationId}?token=${_apiToken}`
  // );
  // const data = await res.json();
  // return parseObservation(data.obs[0]);
  void _stationId;
  return Promise.resolve({
    ...stubCurrentObservation,
    timestamp: Date.now() / 1000,
  });
}

// ---------------------------------------------------------------------------
// Forecast
// GET /better_forecast?station_id={station_id}&token={token}
// ---------------------------------------------------------------------------
export async function fetchForecast(
  _stationId?: number
): Promise<ForecastDay[]> {
  // TODO: Replace with real API call
  // const res = await fetch(
  //   `${API_BASE}/better_forecast?station_id=${stationId}&token=${_apiToken}`
  // );
  // const data = await res.json();
  // return parseForecast(data.forecast.daily);
  void _stationId;
  return Promise.resolve([...stubForecast]);
}

// ---------------------------------------------------------------------------
// Hourly forecast
// GET /better_forecast?station_id={station_id}&token={token}
// (parsed from the hourly portion of the same response)
// ---------------------------------------------------------------------------
export async function fetchHourlyForecast(
  _stationId?: number
): Promise<HourlyForecast[]> {
  void _stationId;
  return Promise.resolve([...stubHourlyForecast]);
}

// ---------------------------------------------------------------------------
// Station status / health
// GET /observations/device/{device_id}?token={token}
// ---------------------------------------------------------------------------
export async function fetchStationStatus(
  _deviceId?: number
): Promise<StationStatus> {
  void _deviceId;
  return Promise.resolve({
    ...stubStationStatus,
    lastReport: Date.now() / 1000 - 45,
  });
}

// ---------------------------------------------------------------------------
// WebSocket connection for real-time data
// wss://ws.weatherflow.com/swd/data?token={token}
// ---------------------------------------------------------------------------
export function connectWebSocket(
  _deviceId: number,
  _onObservation: (obs: CurrentObservation) => void
): { close: () => void } {
  // TODO: Implement real WebSocket connection
  // const ws = new WebSocket(`wss://ws.weatherflow.com/swd/data?token=${_apiToken}`);
  // ws.onopen = () => {
  //   ws.send(JSON.stringify({
  //     type: 'listen_start',
  //     device_id: deviceId,
  //     id: 'tempest-display',
  //   }));
  // };
  // ws.onmessage = (event) => {
  //   const msg = JSON.parse(event.data);
  //   if (msg.type === 'obs_st') {
  //     onObservation(parseObservation(msg.obs[0]));
  //   }
  // };
  // return { close: () => ws.close() };

  // Stub: simulate updates every 60 seconds
  const interval = setInterval(() => {
    const jitter = (base: number, range: number) =>
      base + (Math.random() - 0.5) * range;
    _onObservation({
      ...stubCurrentObservation,
      timestamp: Date.now() / 1000,
      airTemperature: jitter(stubCurrentObservation.airTemperature, 1),
      windAvg: Math.max(0, jitter(stubCurrentObservation.windAvg, 1.5)),
      windGust: Math.max(0, jitter(stubCurrentObservation.windGust, 2)),
      windDirection: (stubCurrentObservation.windDirection + Math.floor(Math.random() * 30 - 15) + 360) % 360,
      relativeHumidity: Math.min(100, Math.max(0, jitter(stubCurrentObservation.relativeHumidity, 3))),
      solarRadiation: Math.max(0, jitter(stubCurrentObservation.solarRadiation, 50)),
    });
  }, 60000);

  return { close: () => clearInterval(interval) };
}
