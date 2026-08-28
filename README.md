> [!IMPORTANT]
> ## This project has moved
>
> **tempest-display has been succeeded by [stormglass](https://github.com/jacaudi/stormglass).**
>
> Stormglass is the same idea, finished: this dashboard was carried over and
> rebuilt on top of a real backend, so it reads live observations from your own
> Tempest station over UDP instead of running on stub data. It also stores your
> history, exports metrics, and ships as a single container.
>
> If you came here looking for a Tempest weather dashboard, go to
> **[jacaudi/stormglass](https://github.com/jacaudi/stormglass)** instead.
>
> This repository was **archived on 28 August 2026** and is now read-only. It
> stays online for reference only — it is no longer maintained, and its open
> pull requests were closed at archive time.

# tempest-display

A weather station dashboard SPA for [WeatherFlow Tempest](https://weatherflow.com/tempest-weather-system/) stations. Built with React 19 + TypeScript, served by a Go static-file server embedded in a single scratch Docker image.

## Features

- **Live cards** — temperature, wind compass, humidity ring, pressure gauge, rain, solar & UV, lightning, station health
- **7-day forecast strip** and **almanac** (record highs/lows, sunrise/sunset, moon phase)
- **Glassmorphism UI** with six selectable themes (Liquid Glass, Midnight Aurora, Desert Sunset, Nord, Tokyo Night, Catppuccin Mocha, The Grid)
- **Real-time updates** via WebSocket (`obs_st` stream), unit conversion (°C/°F, m/s/mph/kph/kts, mb/inHg, mm/in)
- **Single binary** — Vite build embedded via `go:embed`, runs from a scratch image (~12 MB)

## Quick Start

```bash
docker build -t tempest-display .
docker run -p 3000:3000 tempest-display
# open http://localhost:3000
```

> The app currently runs on **stub data**. See [docs/api-integration.md](docs/api-integration.md) for wiring up a live backend.

## Development

```bash
npm install
npm run dev        # Vite dev server at http://localhost:5173
```

```bash
# Build production image
docker build -t tempest-display .
```

## Configuration

| Build arg | Default | Description |
|---|---|---|
| `VITE_ENABLE_RADAR` | `true` | Include the animated NEXRAD radar card |
| `VITE_RADAR_TILE_HOST` | _(RainViewer CDN)_ | Override radar tile host (e.g. local nginx cache) |

## Project Structure

```
src/
  components/   # One file per card + shared GlassCard, WeatherIcon
  hooks/        # useWeatherData (data fetching), useUnits (unit prefs)
  api/          # tempestApi.ts (fetch fns), stubData.ts (dev fixtures)
  types/        # weather.ts — all shared TypeScript interfaces
  themes/       # CSS variable sets for each theme
server/
  main.go       # Go static-file server with go:embed
Dockerfile      # Multi-stage: node build → go build → scratch
```

## Radar (feature branch)

Animated NEXRAD radar via RainViewer tiles lives on `claude/radar-feature`. It includes a docker-compose nginx caching proxy (`nginx/`) and the full `RadarCard` component. See [docs/radar.md](docs/radar.md).

## Backend

The display is designed to pair with [tempestwx-utilities](https://github.com/jacaudi/tempestwx-utilities), a Prometheus exporter for Tempest stations. See [issue #35](https://github.com/jacaudi/tempestwx-utilities/issues/35) for the proposed JSON API server that will power live data.
