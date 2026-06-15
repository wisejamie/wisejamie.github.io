# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # start dev server with HMR
npm run build      # type-check then build to dist/
npm run lint       # ESLint
npm run preview    # serve the production build locally
```

No test suite is configured yet.

## What this project is

An interactive portfolio where users navigate by selecting baseball pitches. Each pitch is physically simulated (gravity, drag, Magnus-effect spin) from a release point ~60.5 ft away to a strike zone in the foreground. When the ball arrives it freezes and a portfolio section reveals around it. The app should feel like a baseball analytics lab, not a normal portfolio.

The design language is: dark/cinematic indoor ballpark, dark green/navy background, warm gold highlights, off-white baseball surfaces, HUD overlays.

## Architecture

The codebase is a blank Vite + React + TypeScript scaffold. `framer-motion` is already installed.

**Phase 1 rendering: 2D CSS + SVG only. No Three.js.**

```
src/
  App.tsx                     # mounts <PitchLab />
  data/
    pitches.ts                # PitchType interface + 6 pitch records
    sections.ts               # SectionId → display metadata
  components/
    PitchLab.tsx              # scene root, owns state machine + simulation trigger
    PitchPicker.tsx           # horizontal row of 6 pitch cards
    PitchSimulator.tsx        # full-viewport SVG: ball, trail, strike zone
    Baseball.tsx              # SVG circle with seam lines
    PitchTrail.tsx            # SVG path drawn up to current frame
    StrikeZone.tsx            # SVG rectangle, glows on freeze
    MetricsHUD.tsx            # fixed overlay: speed, spin, break, time
  lib/
    physics.ts                # simulatePitch(pitch) → Vec3[] precomputed path
    projection.ts             # project(Vec3, svgW, svgH) → {x, y, radius}
```

## State machine

```
idle  →(pitch selected)→  throwing  →(ball arrives)→  frozen  →(dismiss)→  idle
```

`PitchLab` owns the state. `PitchSimulator` owns the animation loop (`requestAnimationFrame`).

## Simulation approach

**Precompute the full path at selection time, then tween along it.**

1. `simulatePitch(pitch)` runs the Euler loop (dt ≈ 0.001 s) until y ≤ 0, returns `Vec3[]`
2. Downsample to ~120 keyframes for rendering
3. `project()` converts all physical coords to SVG screen coords up front
4. `requestAnimationFrame` loop advances a frame index; trail draws up to current index; ball sits at current index; metrics interpolate proportionally
5. On last frame: state → `frozen`

## Physics + projection

```
x = horizontal (catcher left/right), y = dist from plate (release 60.5 → 0), z = height (ft)
acceleration = gravity + drag + Magnus spin force
```

Perspective projection (pinhole, camera ~5 ft behind plate):
```
screenX = vanishX + x * f / (y + eyeDist)
screenY = vanishY - (z - eyeHeight) * f / (y + eyeDist)
ballRadius = BASE_R * f / (y + eyeDist)
```
`f` and `BASE_R` are tuned constants, not physically derived.

## Pitch → section mapping

| Pitch              | Section   |
|--------------------|-----------|
| Four-Seam Fastball | About     |
| Changeup           | Education |
| Slider             | Experience|
| Curveball/Sweeper  | Projects  |
| Sinker             | Skills    |
| Cutter             | Contact   |

## Core product rule

The pitch simulation is the main interaction. The portfolio is revealed *through* the pitch. There is no static landing page — the user lands directly in the pitch lab.

## Build phases

1. Pitch simulator (picker → ball movement → trail → freeze → metrics HUD)
2. Cinematic scene (perspective tunnel, ball depth/scale, stadium atmosphere)
3. Portfolio panels (section reveal, placeholder cards, keyboard nav, reduced-motion)
4. Polish (physics tuning, mobile, GitHub Pages deploy)

## Deployment target

GitHub Pages (static build from `dist/`). No backend.
