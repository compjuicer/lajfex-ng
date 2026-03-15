# lajfex-ng

Web UI for controlling LIFX lights over LAN.

## Stack

- **Frontend** — Vue 3 + iro.js (HSV sliders)
- **Backend** — Express + node-lifx-lan
- **Build** — Vite (frontend), esbuild (backend)

## Config

Edit `src/config.json` before running:

```json
{
  "lights": [
    { "color": "ff6600", "address": { "mac": "D0:73:D5:xx:xx:xx", "ip": "192.168.1.x" } }
  ],
  "duration": 100
}
```

- `color` — default hex color (no `#`)
- `duration` — transition time in milliseconds

## Dev

```sh
npm install
npm run dev
```

Vite dev server runs on `http://localhost:8888`. The Express API is served as Vite middleware — no separate server process needed.

## Production

```sh
npm run build
npm start
```

`build` produces `dist/` with the frontend bundle and a self-contained `dist/server.cjs`. `start` runs the server which serves the frontend from `dist/` and handles API requests.

## API

| Route | Description |
|---|---|
| `GET /api/on` | Turn all lights on |
| `GET /api/off` | Turn all lights off |
| `GET /api/flip` | Toggle on/off |
| `GET /api/reset` | Reset all lights to config colors |
| `GET /api/set/:index/:color` | Set light by index to hex color (no `#`) |
| `GET /api/random/:index` | Set light by index to a random color |

On startup the server turns all lights off so software state is in sync with hardware state.
