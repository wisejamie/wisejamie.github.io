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

An interactive portfolio where users navigate by selecting baseball pitches. Each pitch is physically simulated (gravity, drag, Magnus-effect spin) from a release point ~60.5 ft away to a strike zone in the foreground. When the ball arrives it freezes and a full portfolio section panel slides in. The app should feel like a baseball analytics lab, not a normal portfolio.

The design language is: dark/cinematic indoor ballpark, dark green/navy background, warm gold highlights, off-white baseball surfaces, HUD overlays. Monospace fonts throughout.

## Architecture

Vite + React + TypeScript. `framer-motion` is installed and used for all panel/hint animations.
**Rendering: 2D CSS + SVG only. No Three.js.**

```
src/
  App.tsx                        # mounts <PitchLab />
  data/
    pitches.ts                   # PitchType interface, PITCHES[6], PITCH_FOR_SECTION map
    sections.ts                  # SectionMeta, SECTION_ORDER, SECTIONS map
    portfolio.ts                 # All portfolio content (~400 lines): About, Experience,
                                 #   Projects, Trips, Education, Contact data
  components/
    PitchLab.tsx                 # Scene root — owns state machine, layout, all handlers
    PlateScene.tsx               # Static SVG: dirt, plate, foul lines, batter boxes, rubber
    PitchSimulator.tsx           # rAF animation loop; renders ball + trail + ghost trail
    Baseball.tsx                 # SVG ball with spin-animated seam lines
    PitchTrail.tsx               # SVG stroke path drawn up to current frame
    MetricsHUD.tsx               # HUD overlay: speed, spin, H-break, V-break; ghost trail on hover
    SectionNav.tsx               # Desktop: left sidebar nav. Mobile: horizontal scrolling top bar.
    SectionPanel.tsx             # Animated slide-in panel wrapping section content
    SectionHint.tsx              # Onboarding hint arrow after first picker throw
    PitchPicker.tsx              # 6 pitch cards at bottom (3×2 grid on mobile)
    AboutSection.tsx             # Bio, photo, facts
    EducationSection.tsx         # Two interactive Topps-style baseball cards (flip animation)
    EducationBaseballCard.tsx    #   Topps 1987 style (McGill)
    EducationCardBack.tsx        #   Card back
    Topps1963CardDemo.tsx        #   Topps 1963 vintage style (UNSW)
    Topps1963CardBack.tsx        #   Card back
    ExperienceSection.tsx        # Role list with bullets and optional links
    ProjectsSection.tsx          # Project cards with stack + LinkChips
    TripsSection.tsx             # SVG world map + field notes list + photo carousel popup
    ContactCard.tsx              # Links, email, resume download
    LinkChips.tsx                # Colored badge links (GitHub, Demo, Paper, Devpost, etc.)
  lib/
    physics.ts                   # simulatePitch() → SimResult; Euler loop, aim refinement
    projection.ts                # project(), unproject(), projectStrikeZone(); pinhole camera
    variation.ts                 # createPitchAttempt(); per-throw variation + LHP/RHP mirroring
```

## State machine

```
idle  →(pitch selected from nav)→    throwing  →(ball arrives)→  frozen  →(dismiss)→  idle
idle  →(pitch selected from picker)→  throwing  →(ball arrives)→  frozen  →(dismiss)→  idle
```

**Key state in PitchLab:**
- `simState`: `'idle' | 'throwing' | 'frozen'`
- `fromSection`: whether current throw came from SectionNav (true) or PitchPicker (false)
  - When `frozen && fromSection`: SectionPanel slides in with content
  - When `frozen && !fromSection`: MetricsHUD shows; SectionHint shows if not yet seen
- `selectedTarget`: user-clicked plate coordinate (persists across throws; shows gold reticle)
- `crossingHistory`: last 5 pitch arrivals, shown as colored dots on the zone
- `pitcherHandedness`: `'RHP' | 'LHP'`; switching resets all throw state
- `playbackSpeed`: `0.25 | 0.5 | 0.75 | 1`; scales animation duration only
- `hasOpenedSection`: session flag — suppresses hint once any section has been viewed
- `hasSeenHint`: localStorage-backed — suppresses hint after first dismiss

**Keyboard shortcuts:**
- `Escape`: dismiss panel / clear target
- `← →`: navigate to adjacent section (only when `frozen && fromSection`)

## Simulation approach

**Precompute the full path at selection time, then tween along it.**

1. `createPitchAttempt(pitch, selectedTarget, handedness)` applies per-throw variation (velocity ±2 mph, spin ±5%, axis ±7°, command error) and mirrors for LHP
2. `simulatePitch(pitch, actualTarget)` runs an Euler loop (dt ≈ 0.001 s) with iterative aim refinement; returns `SimResult` with frames, referenceFrames (spinless path), flightTimeMs, movement
3. Both paths are downsampled to ~120 keyframes and projected to screen coords up front
4. `requestAnimationFrame` loop in PitchSimulator advances a frame index; trail and ball follow; MetricsHUD interpolates proportionally
5. On last frame: `simState → 'frozen'`; crossing marker added to history

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
`f` and `BASE_R` are tuned constants, not physically derived. `project()`, `unproject()`, and `projectStrikeZone()` live in `lib/projection.ts`.

## Pitch → section mapping

| Pitch              | Section    |
|--------------------|------------|
| Four-Seam Fastball | About      |
| Changeup           | Education  |
| Slider             | Experience |
| Curveball          | Projects   |
| Sinker             | Trips      |
| Cutter             | Contact    |

## UI layout

**Desktop (≥640px):**
- Left sidebar: SectionNav (180px wide, full height, vertically centered)
- Top-left: wordmark "JAMIE WISE / PORTFOLIO · 2026" (zIndex 6)
- Top-right: MetricsHUD during/after picker throw
- Bottom-left: RHP/LHP toggle (zIndex 10)
- Bottom-right: playback speed buttons 0.25x–1x (zIndex 10)
- Bottom-center: PitchPicker row
- SectionPanel slides in from the right (zIndex 8)

**Mobile (<640px):**
- Top bar: SectionNav with wordmark + scrollable section buttons (zIndex 5)
- Bottom: PitchPicker 3×2 grid (bottom: 70px)
- Bottom corners: handedness and speed controls (bottom: 14px)
- SectionPanel slides up from the bottom

## Data shapes (portfolio.ts)

- `AboutInfo`: name, title, bio, imageUrl, facts[]
- `ExperienceRole`: company, role, dates, location, bullets[], links[]?, publication?
- `Project`: name, subtitle?, stack[], bullets[], links[]?
- `TripEntry`: id, location, tagline?, description, date?, tags?, mapX, mapY, photos[]?
- `EducationEntry`: school, degree, dates, cardStyle (`'topps87' | 'topps63'`), highlights[], coursework[]
- `ContactInfo`: headline, subline, links[], resumePath

## Core product rule

The pitch simulation is the main interaction. The portfolio is revealed *through* the pitch. There is no static landing page — the user lands directly in the pitch lab.

## Deployment

GitHub Pages (static build from `dist/`). No backend, no server-side state. `localStorage` is used only for the hint dismissal flag (`pitchlab-hint-seen`).
