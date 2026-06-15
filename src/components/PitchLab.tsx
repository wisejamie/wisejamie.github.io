import { useState, useCallback, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { PitchType, SectionId } from '../data/pitches';
import { PITCH_FOR_SECTION } from '../data/pitches';
import { SECTIONS } from '../data/sections';
import { simulatePitch, downsample } from '../lib/physics';
import {
  project,
  projectStrikeZone,
  unproject,
  TARGET_CLAMP,
} from '../lib/projection';
import type { ScreenPos, ZoneScreenRect } from '../lib/projection';
import { PitchSimulator } from './PitchSimulator';
import { PitchPicker } from './PitchPicker';
import { MetricsHUD } from './MetricsHUD';
import { PlateScene } from './PlateScene';
import { SectionNav } from './SectionNav';
import { SectionPanel } from './SectionPanel';
import { EducationBaseballCard } from './EducationBaseballCard';
import { EDUCATION_ENTRIES } from '../data/portfolio';
import { createPitchAttempt } from '../lib/variation';
import type { Handedness } from '../lib/variation';

type SimState = 'idle' | 'throwing' | 'frozen';

const DISPLAY_FRAMES = 120;

// Pixel padding beyond zone rect that counts as a "zone click"
const ZONE_CLICK_PADDING = 60;

export interface CrossingMarker {
  x: number;
  z: number;
  pitchId: string;
  pitchName: string;
  color: string;
}

export function PitchLab() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: window.innerWidth, h: window.innerHeight });

  const [simState, setSimState] = useState<SimState>('idle');
  const [selectedPitch, setSelectedPitch] = useState<PitchType | null>(null);
  const [framePath, setFramePath] = useState<ScreenPos[]>([]);
  const [zone, setZone] = useState<ZoneScreenRect | null>(null);
  const [flightTimeMs, setFlightTimeMs] = useState(450);
  const [throwProgress, setThrowProgress] = useState(0);

  const [playbackSpeed, setPlaybackSpeed] = useState(0.5);

  const [selectedTarget, setSelectedTarget] = useState<{ x: number; z: number } | null>(null);
  const [crossingHistory, setCrossingHistory] = useState<CrossingMarker[]>([]);
  const pendingMarkerRef = useRef<CrossingMarker | null>(null);

  // Per-throw state: varied pitch copy for MetricsHUD + intended target for reticle
  const [throwPitch, setThrowPitch] = useState<PitchType | null>(null);
  const [intendedTarget, setIntendedTarget] = useState<{ x: number; z: number } | null>(null);

  const [pitcherHandedness, setPitcherHandedness] = useState<Handedness>('RHP');
  // Whether the current/last throw was triggered by the section nav (shows panel) or the pitch picker (doesn't)
  const [fromSection, setFromSection] = useState(false);

  // Resize observer
  useEffect(() => {
    const obs = new ResizeObserver(entries => {
      const e = entries[0];
      if (e) setDims({ w: e.contentRect.width, h: e.contentRect.height });
    });
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  // Reproject zone on dimension change
  useEffect(() => {
    setZone(projectStrikeZone(dims.w, dims.h));
  }, [dims]);

  const handleHandednessChange = useCallback((h: Handedness) => {
    if (h === pitcherHandedness) return;
    setPitcherHandedness(h);
    setCrossingHistory([]);
    setSimState('idle');
    setSelectedPitch(null);
    setThrowPitch(null);
    setIntendedTarget(null);
    setFramePath([]);
    setThrowProgress(0);
  }, [pitcherHandedness]);

  const handleSelect = useCallback((pitch: PitchType) => {
    const attempt = createPitchAttempt(pitch, selectedTarget, pitcherHandedness);
    const {
      frames: rawFrames,
      flightTimeMs: ftMs,
      movement,
    } = simulatePitch(attempt.pitch, attempt.actualTarget);
    const measuredPitch = {
      ...attempt.pitch,
      movement,
    };
    const display = downsample(rawFrames, DISPLAY_FRAMES);
    const projected = display.map(f => project(f.pos, dims.w, dims.h));

    const arrival = rawFrames[rawFrames.length - 1].pos;
    pendingMarkerRef.current = {
      x: arrival.x,
      z: arrival.z,
      pitchId: pitch.id + pitcherHandedness,
      pitchName: pitch.name,
      color: pitch.colorLabel,
    };

    setSelectedPitch(pitch);
    setThrowPitch(measuredPitch);
    setIntendedTarget(attempt.intendedTarget);
    setFramePath(projected);
    setFlightTimeMs(ftMs);
    setThrowProgress(0);
    setSimState('throwing');
  }, [dims, selectedTarget, pitcherHandedness]);

  const handleSectionSelect = useCallback((sectionId: SectionId) => {
    setFromSection(true);
    handleSelect(PITCH_FOR_SECTION[sectionId]);
  }, [handleSelect]);

  const handlePickerSelect = useCallback((pitch: PitchType) => {
    setFromSection(false);
    handleSelect(pitch);
  }, [handleSelect]);

  const handleArrive = useCallback(() => {
    setSimState('frozen');
    if (pendingMarkerRef.current) {
      const marker = pendingMarkerRef.current;
      setCrossingHistory(prev => {
        const next = [...prev, marker];
        return next.length > 5 ? next.slice(-5) : next;
      });
      pendingMarkerRef.current = null;
    }
  }, []);

  const handleDismiss = useCallback(() => {
    setSimState('idle');
    setSelectedPitch(null);
    setThrowPitch(null);
    setIntendedTarget(null);
    setFramePath([]);
    setThrowProgress(0);
    setFromSection(false);
  }, []);

  const handleProgress = useCallback((p: number) => {
    setThrowProgress(p);
  }, []);

  // Click handler: frozen → dismiss; idle + near zone → set target
  const handleContainerClick = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;

    if (simState === 'frozen') {
      handleDismiss();
      return;
    }
    if (simState === 'throwing') return;

    if (zone) {
      const { clientX: sx, clientY: sy } = e;
      const inZoneArea =
        sx >= zone.left - ZONE_CLICK_PADDING &&
        sx <= zone.right + ZONE_CLICK_PADDING &&
        sy >= zone.top - ZONE_CLICK_PADDING &&
        sy <= zone.bottom + ZONE_CLICK_PADDING;

      if (inZoneArea) {
        const { x, z } = unproject(sx, sy, dims.w, dims.h);
        setSelectedTarget({
          x: Math.max(TARGET_CLAMP.xMin, Math.min(TARGET_CLAMP.xMax, x)),
          z: Math.max(TARGET_CLAMP.zMin, Math.min(TARGET_CLAMP.zMax, z)),
        });
      }
    }
  }, [simState, zone, dims, handleDismiss]);

  // Escape key: frozen → dismiss; idle + target set → clear target
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (simState === 'frozen') {
        handleDismiss();
      } else if (simState === 'idle' && selectedTarget !== null) {
        setSelectedTarget(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [simState, selectedTarget, handleDismiss]);

  const frozen = simState === 'frozen';
  const throwing = simState === 'throwing';
  const isMobile = dims.w < 640;

  // During a throw or freeze: show the pitcher's intended target for this attempt.
  // In idle: show the user's persistent clicked target (if any).
  const displayTarget = (throwing || frozen) ? intendedTarget : selectedTarget;

  // CLEAR TARGET button left offset — push right of the section nav on desktop
  const clearTargetLeft = isMobile ? 16 : 192;

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        background: '#0e1a12',
        overflow: 'hidden',
        userSelect: 'none',
        cursor: simState === 'idle' ? 'crosshair' : 'default',
      }}
    >
      {/* Vanishing-point horizon line */}
      <div style={{
        position: 'absolute',
        top: `${dims.h * 0.38}px`,
        left: 0,
        right: 0,
        height: 1,
        background: 'rgba(255,255,255,0.05)',
        pointerEvents: 'none',
      }} />

      {/* Static scene: dirt, plate, foul lines, mound marker */}
      <PlateScene svgWidth={dims.w} svgHeight={dims.h} handedness={pitcherHandedness} />

      {/* Always-on SVG: zone, target reticle, crossing markers */}
      {zone && (
        <svg
          width={dims.w}
          height={dims.h}
          style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
        >
          {/* Strike zone */}
          <rect
            x={zone.left}
            y={zone.top}
            width={zone.right - zone.left}
            height={zone.bottom - zone.top}
            fill="none"
            stroke={frozen ? '#f5a623' : 'rgba(255,255,255,0.28)'}
            strokeWidth={frozen ? 2.5 : 1.5}
            rx={2}
          />

          {/* Zone quadrant guides (faint) */}
          <line
            x1={(zone.left + zone.right) / 2} y1={zone.top}
            x2={(zone.left + zone.right) / 2} y2={zone.bottom}
            stroke="rgba(255,255,255,0.07)" strokeWidth={1}
          />
          <line
            x1={zone.left} y1={(zone.top + zone.bottom) / 2}
            x2={zone.right} y2={(zone.top + zone.bottom) / 2}
            stroke="rgba(255,255,255,0.07)" strokeWidth={1}
          />

          {/* Target reticle */}
          {displayTarget && (() => {
            const sp = project({ x: displayTarget.x, y: 0, z: displayTarget.z }, dims.w, dims.h);
            const isCustom = selectedTarget !== null;
            const color = isCustom ? '#f5a623' : 'rgba(255,255,255,0.35)';
            const R = 8;
            return (
              <g>
                <circle cx={sp.x} cy={sp.y} r={R} fill="none" stroke={color} strokeWidth={1.5} />
                <line x1={sp.x - R - 4} y1={sp.y} x2={sp.x + R + 4} y2={sp.y} stroke={color} strokeWidth={1} />
                <line x1={sp.x} y1={sp.y - R - 4} x2={sp.x} y2={sp.y + R + 4} stroke={color} strokeWidth={1} />
              </g>
            );
          })()}

          {/* Crossing markers — last 5 pitches */}
          {crossingHistory.map((marker, i) => {
            const sp = project({ x: marker.x, y: 0, z: marker.z }, dims.w, dims.h);
            const opacity = 0.4 + (i / Math.max(1, crossingHistory.length - 1)) * 0.6;
            return (
              <g key={`${marker.pitchId}-${i}`}>
                <circle
                  cx={sp.x} cy={sp.y} r={5}
                  fill={marker.color}
                  opacity={opacity}
                />
                <title>{marker.pitchName}</title>
              </g>
            );
          })}

          {/* Instruction label below zone */}
          {simState === 'idle' && (
            <text
              x={(zone.left + zone.right) / 2}
              y={zone.bottom + 18}
              textAnchor="middle"
              fontSize={10}
              fill="rgba(255,255,255,0.3)"
              fontFamily="ui-monospace, Consolas, monospace"
              letterSpacing="0.08em"
            >
              {selectedTarget
                ? 'TARGET SET · ESC to clear'
                : 'CLICK TO SET TARGET · THEN CHOOSE A PITCH'}
            </text>
          )}
        </svg>
      )}

      {/* Ball + trail (only during throw / frozen) */}
      {selectedPitch && framePath.length > 0 && (throwing || frozen) && (
        <PitchSimulator
          key={selectedPitch.id + String(flightTimeMs)}
          path={framePath}
          pitch={selectedPitch}
          svgWidth={dims.w}
          svgHeight={dims.h}
          flightTimeMs={flightTimeMs}
          playbackSpeed={playbackSpeed}
          frozen={frozen}
          onArrive={handleArrive}
          onProgress={handleProgress}
        />
      )}

      {/* Metrics HUD — during throw always; when frozen only for pitch-picker throws (section throws use SectionPanel) */}
      {selectedPitch && (throwing || (frozen && !fromSection)) && (
        <MetricsHUD
          pitch={throwPitch ?? selectedPitch}
          section={SECTIONS[selectedPitch.section]}
          progress={frozen ? 1 : throwProgress}
          frozen={frozen}
        />
      )}

      {/* Section navigation */}
      <SectionNav
        simState={simState}
        activeSectionId={selectedPitch?.section ?? null}
        onSelect={handleSectionSelect}
        containerWidth={dims.w}
      />

      {/* Section panel — animates in when frozen */}
      <AnimatePresence>
        {frozen && fromSection && selectedPitch && (
          <SectionPanel
            key={selectedPitch.section}
            sectionId={selectedPitch.section}
            pitch={throwPitch}
            onClose={handleDismiss}
            isMobile={isMobile}
          >
            {selectedPitch.section === 'education' && (
              <EducationBaseballCard
                entry={EDUCATION_ENTRIES[0]}
                isMobile={isMobile}
                cardWidth={isMobile ? 180 : 240}
              />
            )}
          </SectionPanel>
        )}
      </AnimatePresence>

      {/* Reset target button */}
      {selectedTarget && simState !== 'throwing' && (
        <button
          onClick={(e) => { e.stopPropagation(); setSelectedTarget(null); }}
          style={{
            position: 'absolute',
            top: 16,
            left: clearTargetLeft,
            background: 'rgba(0,0,0,0.55)',
            border: '1px solid rgba(245,166,35,0.4)',
            borderRadius: 4,
            color: '#f5a623',
            fontFamily: 'monospace',
            fontSize: 10,
            letterSpacing: '0.06em',
            padding: '5px 10px',
            cursor: 'pointer',
            zIndex: 10,
          }}
        >
          CLEAR TARGET
        </button>
      )}

      {/* Pitch picker */}
      <PitchPicker
        onSelect={handlePickerSelect}
        selectedId={selectedPitch?.id ?? null}
        disabled={throwing}
      />

      {/* Handedness toggle — bottom left, mirrors speed control layout */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          left: 16,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          fontFamily: 'monospace',
          fontSize: 10,
        }}
        onClick={e => e.stopPropagation()}
      >
        {(['RHP', 'LHP'] as const).map(h => (
          <button
            key={h}
            onClick={() => handleHandednessChange(h)}
            disabled={throwing}
            style={{
              background: pitcherHandedness === h ? 'rgba(245,166,35,0.15)' : 'rgba(0,0,0,0.55)',
              border: `1px solid ${pitcherHandedness === h ? '#f5a623' : 'rgba(255,255,255,0.15)'}`,
              borderRadius: 3,
              color: pitcherHandedness === h ? '#f5a623' : '#555',
              cursor: throwing ? 'not-allowed' : 'pointer',
              fontFamily: 'monospace',
              fontSize: 10,
              letterSpacing: '0.05em',
              padding: '4px 7px',
              opacity: throwing ? 0.5 : 1,
            }}
          >
            {h}
          </button>
        ))}
      </div>

      {/* Playback speed control — rendered after PitchPicker so it sits on top */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          right: 16,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          fontFamily: 'monospace',
          fontSize: 10,
        }}
        onClick={e => e.stopPropagation()}
      >
        <span style={{ color: '#555', marginRight: 4, letterSpacing: '0.05em' }}>SPEED</span>
        {([0.25, 0.5, 0.75, 1] as const).map(s => (
          <button
            key={s}
            onClick={() => setPlaybackSpeed(s)}
            disabled={throwing}
            style={{
              background: playbackSpeed === s ? 'rgba(245,166,35,0.15)' : 'rgba(0,0,0,0.55)',
              border: `1px solid ${playbackSpeed === s ? '#f5a623' : 'rgba(255,255,255,0.15)'}`,
              borderRadius: 3,
              color: playbackSpeed === s ? '#f5a623' : '#555',
              cursor: throwing ? 'not-allowed' : 'pointer',
              fontFamily: 'monospace',
              fontSize: 10,
              padding: '4px 7px',
              opacity: throwing ? 0.5 : 1,
            }}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  );
}
