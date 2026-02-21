import { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { StationMeta, RadarStation, RadarFrame } from '../types/weather';
import { GlassCard } from './GlassCard';
import { fetchNearestRadarStation, fetchRadarFrames, fetchRadarStationVcp } from '../api/tempestApi';

// Use a local caching proxy when available, otherwise hit the CDN directly
const TILE_HOST =
  (import.meta.env.VITE_RADAR_TILE_HOST as string | undefined)?.replace(/\/$/, '') ||
  'https://tilecache.rainviewer.com';

// ---------------------------------------------------------------------------
// VCP (Volume Coverage Pattern) labels
// ---------------------------------------------------------------------------
const VCP_INFO: Record<number, { label: string; mode: 'precip' | 'clear' }> = {
  12:  { label: 'VCP 12 · Convective',        mode: 'precip' },
  21:  { label: 'VCP 21 · Stratiform',         mode: 'precip' },
  31:  { label: 'VCP 31 · Clear Air (slow)',   mode: 'clear'  },
  32:  { label: 'VCP 32 · Clear Air (fast)',   mode: 'clear'  },
  35:  { label: 'VCP 35 · SAILS',              mode: 'precip' },
  112: { label: 'VCP 112 · AVSET',             mode: 'precip' },
  212: { label: 'VCP 212 · MESO-SAILS',        mode: 'precip' },
  215: { label: 'VCP 215 · Convective+',       mode: 'precip' },
};

// ---------------------------------------------------------------------------
// Custom divIcon markers — avoids Vite/Leaflet default-icon asset issues
// ---------------------------------------------------------------------------
function stationIcon(color: string) {
  return L.divIcon({
    className: '',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -14],
    html: `<svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="9" fill="${color}" opacity="0.92" stroke="white" stroke-width="1.5"/>
      <circle cx="11" cy="11" r="4" fill="white" opacity="0.85"/>
    </svg>`,
  });
}

// Radar scope (PPI sweep) icon
function radarIcon() {
  return L.divIcon({
    className: '',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -12],
    html: `<svg width="20" height="20" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
      <!-- Background circle -->
      <circle cx="15" cy="15" r="14" fill="#0d1f0d" stroke="#ff6d00" stroke-width="1.5"/>
      <!-- Range rings -->
      <circle cx="15" cy="15" r="9.5" fill="none" stroke="#ff6d00" stroke-width="0.7" opacity="0.45"/>
      <circle cx="15" cy="15" r="5" fill="none" stroke="#ff6d00" stroke-width="0.7" opacity="0.45"/>
      <!-- Sweep wedge (filled sector ~60°) -->
      <path d="M15 15 L15 1.5 A13.5 13.5 0 0 1 26.7 8.25 Z"
            fill="#ff6d00" opacity="0.25"/>
      <!-- Sweep leading edge -->
      <line x1="15" y1="15" x2="15" y2="1.5" stroke="#ff6d00" stroke-width="1.4" opacity="0.9"/>
      <!-- Center dot -->
      <circle cx="15" cy="15" r="2" fill="#ff6d00"/>
    </svg>`,
  });
}

// ---------------------------------------------------------------------------
// Format epoch to local time string
// ---------------------------------------------------------------------------
function fmtTime(epoch: number): string {
  return new Date(epoch * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ---------------------------------------------------------------------------
// Zoom handler — must live inside MapContainer to access map context
// ---------------------------------------------------------------------------
function MapZoomHandler({ onZoomEnd }: { onZoomEnd: () => void }) {
  useMapEvents({ zoomend: onZoomEnd });
  return null;
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
interface RadarCardProps {
  station: StationMeta;
}

export function RadarCard({ station }: RadarCardProps) {
  const [radarStation, setRadarStation] = useState<RadarStation | null>(null);
  const [vcp, setVcp] = useState<number | null>(null);
  const [frames, setFrames] = useState<RadarFrame[]>([]);
  const [frameIdx, setFrameIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [radarError, setRadarError] = useState<string | null>(null);
  const [loadedCount, setLoadedCount] = useState(0);
  // Track which zoom levels have already had all frames cached so we can skip
  // the loading overlay when returning to a previously-seen zoom.
  const [hasEverLoaded, setHasEverLoaded] = useState(false);

  const center: [number, number] = [station.latitude, station.longitude];
  const allLoaded = frames.length > 0 && loadedCount >= frames.length;
  // Only block the map with an overlay on the very first load.
  // After that, Leaflet handles tile transitions on zoom natively.
  const showLoadingOverlay = !hasEverLoaded && !allLoaded && frames.length > 0;

  // Load NWS nearest NEXRAD station, then fetch its live VCP
  useEffect(() => {
    fetchNearestRadarStation(station.latitude, station.longitude)
      .then(rs => {
        setRadarStation(rs);
        return fetchRadarStationVcp(rs.stationId);
      })
      .then(v => setVcp(v))
      .catch(() => setRadarError('Could not load radar station from NWS'));
  }, [station.latitude, station.longitude]);

  // Load RainViewer animated radar frames; clear zoom cache since paths changed,
  // then proactively warm the browser tile cache for all zoom levels.
  useEffect(() => {
    fetchRadarFrames()
      .then(f => {
        setFrames(f);
        setFrameIdx(f.length - 1);
        setLoadedCount(0);
      })
      .catch(() => setRadarError('Could not load radar frames'));
  }, [station.latitude, station.longitude]);

  // Once all frames are loaded for the first time, mark it and start playing
  useEffect(() => {
    if (allLoaded) {
      setHasEverLoaded(true);
      setPlaying(true);
    }
  }, [allLoaded]);

  // Animation loop — runs once initial load is done
  useEffect(() => {
    if (!playing || !hasEverLoaded || frames.length === 0) return;
    const id = setInterval(() => {
      setFrameIdx(i => {
        if (i === frames.length - 1) return i;
        return i + 1;
      });
    }, 400);
    return () => clearInterval(id);
  }, [playing, allLoaded, frames.length]);

  // Hold on last frame then loop back
  useEffect(() => {
    if (!playing || !hasEverLoaded || frames.length === 0 || frameIdx !== frames.length - 1) return;
    const id = setTimeout(() => setFrameIdx(0), 1200);
    return () => clearTimeout(id);
  }, [playing, allLoaded, frames.length, frameIdx]);

  const step = useCallback((dir: -1 | 1) => {
    setPlaying(false);
    setFrameIdx(i => Math.max(0, Math.min(frames.length - 1, i + dir)));
  }, [frames.length]);

  const handleFrameLoaded = useCallback(() => {
    setLoadedCount(n => n + 1);
  }, []);

  // After zoom, just resume — Leaflet scales old tiles until new ones arrive,
  // and the prefetch has already warmed the cache for zoom levels 5–10.
  const handleZoomEnd = useCallback(() => {
    if (hasEverLoaded) setPlaying(true);
  }, [hasEverLoaded]);

  const currentFrame = frames[frameIdx];

  return (
    <GlassCard className="radar-card" span={3}>
      <div className="card-header">
        {/* PPI radar scope — matches the map marker icon */}
        <svg className="card-icon" width="20" height="20" viewBox="0 0 30 30" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <circle cx="15" cy="15" r="13" stroke="currentColor" strokeWidth="1.5"/>
          <circle cx="15" cy="15" r="8.5" stroke="currentColor" strokeWidth="0.8" opacity="0.5"/>
          <circle cx="15" cy="15" r="4.5" stroke="currentColor" strokeWidth="0.8" opacity="0.5"/>
          <path d="M15 15 L15 2.2 A12.8 12.8 0 0 1 25.9 8.6 Z" fill="currentColor" opacity="0.3"/>
          <line x1="15" y1="15" x2="15" y2="2.2" stroke="currentColor" strokeWidth="1.4"/>
          <circle cx="15" cy="15" r="2" fill="currentColor"/>
        </svg>
        <span className="card-title">Radar</span>

        {radarStation && (
          <span className="radar-station-badge">
            {radarStation.stationId} · {Math.round(radarStation.distanceKm * 0.621371)} mi away
          </span>
        )}
        {vcp !== null && (() => {
          const info = VCP_INFO[vcp];
          return (
            <span className={`radar-vcp-badge radar-vcp-${info?.mode ?? 'precip'}`}>
              {info?.label ?? `VCP ${vcp}`}
            </span>
          );
        })()}

        <div className="radar-controls">
          <button className="radar-btn" onClick={() => step(-1)} title="Previous frame">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>
          </button>
          <button
            className="radar-btn radar-btn-play"
            onClick={() => setPlaying(p => !p)}
            title={playing ? 'Pause' : 'Play'}
            disabled={!hasEverLoaded}
          >
            {playing
              ? <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6zm8-14v14h4V5z"/></svg>
              : <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            }
          </button>
          <button className="radar-btn" onClick={() => step(1)} title="Next frame">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6zm10-12v12h2V6z"/></svg>
          </button>
          {currentFrame && (
            <span className="radar-timestamp">{fmtTime(currentFrame.time)}</span>
          )}
        </div>
      </div>

      {radarError && <div className="radar-error">{radarError}</div>}

      <div className="radar-map-container">
        <MapContainer
          center={center}
          zoom={7}
          maxZoom={7}
          className="radar-map"
          zoomControl={true}
          attributionControl={true}
        >
          {/* Resets tile cache and replays preload on zoom */}
          <MapZoomHandler onZoomEnd={handleZoomEnd} />


          {/* Dark CartoDB basemap */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            maxZoom={19}
          />

          {/* All radar frames rendered simultaneously — visible frame at full opacity,
              others at 0. Leaflet still fetches and caches tiles for opacity=0 layers,
              so by the time we animate they're already in the browser tile cache. */}
          {frames.map((frame, i) => (
            <TileLayer
              key={frame.path}
              url={`${TILE_HOST}${frame.path}/256/{z}/{x}/{y}/2/1_1.png`}
              opacity={i === frameIdx ? 0.65 : 0}
              attribution={i === 0 ? 'Radar &copy; <a href="https://rainviewer.com">RainViewer</a> / NEXRAD' : undefined}
              zIndex={i === frameIdx ? 500 : 499}
              updateWhenZooming={false}
              keepBuffer={4}
              eventHandlers={{ load: handleFrameLoaded }}
            />
          ))}

          {/* Weather station marker */}
          <Marker position={center} icon={stationIcon('#88c0d0')}>
            <Popup>
              <strong>{station.name}</strong><br />
              {station.latitude.toFixed(4)}°N, {Math.abs(station.longitude).toFixed(4)}°W
            </Popup>
          </Marker>

          {/* Nearest NEXRAD radar station */}
          {radarStation && (
            <>
              <Marker
                position={[radarStation.latitude, radarStation.longitude]}
                icon={radarIcon()}
              >
                <Popup>
                  <strong>{radarStation.stationId}</strong><br />
                  {radarStation.name}<br />
                  {Math.round(radarStation.distanceKm * 0.621371)} mi from station
                </Popup>
              </Marker>

              {/* 230 km effective range ring */}
              <Circle
                center={[radarStation.latitude, radarStation.longitude]}
                radius={230000}
                pathOptions={{
                  color: 'rgba(136, 192, 208, 0.35)',
                  weight: 1,
                  fillOpacity: 0,
                  dashArray: '4 6',
                }}
              />
            </>
          )}
        </MapContainer>

        {/* Loading overlay — only shown on first load, never during zoom */}
        {showLoadingOverlay && (
          <div className="radar-loading-overlay">
            <div className="radar-loading-bar-track">
              <div
                className="radar-loading-bar-fill"
                style={{ width: `${Math.round((loadedCount / frames.length) * 100)}%` }}
              />
            </div>
            <span className="radar-loading-label">
              Caching radar frames {loadedCount}/{frames.length}
            </span>
          </div>
        )}

        {/* Reflectivity color legend */}
        <div className="radar-legend">
          <span className="radar-legend-title">dBZ</span>
          <div className="radar-legend-bar" />
          <div className="radar-legend-ticks">
            <span>5</span>
            <span>20</span>
            <span>35</span>
            <span>50</span>
            <span>65+</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
