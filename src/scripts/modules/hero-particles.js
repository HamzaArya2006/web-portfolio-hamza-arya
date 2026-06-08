/**
 * Page-wide Background Particle System
 * Manages floating canvas particles that react to mouse movements,
 * form hover shapes, and react to section transitions.
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TAU = Math.PI * 2;

const SHAPES = {
  projects: [
    // Left bracket <
    { x1: -0.18, y1: -0.32, x2: -0.45, y2: 0 },
    { x1: -0.45, y1: 0, x2: -0.18, y2: 0.32 },
    // Right bracket >
    { x1: 0.18, y1: -0.32, x2: 0.45, y2: 0 },
    { x1: 0.45, y1: 0, x2: 0.18, y2: 0.32 },
    // Slash /
    { x1: 0.08, y1: -0.4, x2: -0.08, y2: 0.4 }
  ],
  contact: [
    // Envelope outer box
    { x1: -0.5, y1: -0.32, x2: 0.5, y2: -0.32 },
    { x1: 0.5, y1: -0.32, x2: 0.5, y2: 0.32 },
    { x1: 0.5, y1: 0.32, x2: -0.5, y2: 0.32 },
    { x1: -0.5, y1: 0.32, x2: -0.5, y2: -0.32 },
    // Envelope top flap fold
    { x1: -0.5, y1: -0.32, x2: 0, y2: 0.08 },
    { x1: 0, y1: 0.08, x2: 0.5, y2: -0.32 }
  ],
  pc: [
    // Monitor rectangle
    { x1: -0.45, y1: -0.3, x2: 0.45, y2: -0.3 },
    { x1: 0.45, y1: -0.3, x2: 0.45, y2: 0.15 },
    { x1: 0.45, y1: 0.15, x2: -0.45, y2: 0.15 },
    { x1: -0.45, y1: 0.15, x2: -0.45, y2: -0.3 },
    // Stand
    { x1: -0.15, y1: 0.15, x2: -0.15, y2: 0.25 },
    { x1: -0.15, y1: 0.25, x2: 0.15, y2: 0.25 },
    { x1: 0.15, y1: 0.25, x2: 0.15, y2: 0.15 }
  ],
  laptop: [
    // Base
    { x1: -0.5, y1: 0.2, x2: 0.5, y2: 0.2 },
    { x1: 0.5, y1: 0.2, x2: 0.5, y2: 0.3 },
    { x1: 0.5, y1: 0.3, x2: -0.5, y2: 0.3 },
    { x1: -0.5, y1: 0.3, x2: -0.5, y2: 0.2 },
    // Screen
    { x1: -0.4, y1: -0.25, x2: 0.4, y2: -0.25 },
    { x1: 0.4, y1: -0.25, x2: 0.4, y2: 0.2 },
    { x1: 0.4, y1: 0.2, x2: -0.4, y2: 0.2 },
    { x1: -0.4, y1: 0.2, x2: -0.4, y2: -0.25 }
  ],
  pen: [
    // Body
    { x1: -0.05, y1: -0.35, x2: 0.05, y2: -0.35 },
    { x1: 0.05, y1: -0.35, x2: 0.05, y2: 0.15 },
    { x1: 0.05, y1: 0.15, x2: -0.05, y2: 0.15 },
    { x1: -0.05, y1: 0.15, x2: -0.05, y2: -0.35 },
    // Tip
    { x1: -0.07, y1: 0.15, x2: 0, y2: 0.25 },
    { x1: 0, y1: 0.25, x2: 0.07, y2: 0.15 }
  ],
  html: [
    // Simplified "H"
    { x1: -0.35, y1: -0.3, x2: -0.35, y2: 0.3 },
    { x1: 0.35, y1: -0.3, x2: 0.35, y2: 0.3 },
    { x1: -0.35, y1: 0, x2: 0.35, y2: 0 }
  ],
  css: [
    // Simplified "C"
    { x1: 0.3, y1: -0.3, x2: -0.3, y2: -0.3 },
    { x1: -0.3, y1: -0.3, x2: -0.3, y2: 0.3 },
    { x1: -0.3, y1: 0.3, x2: 0.3, y2: 0.3 }
  ],
  js: [
    // Simplified "J" and "S"
    { x1: 0.3, y1: -0.3, x2: 0.3, y2: 0 },
    { x1: 0.3, y1: 0, x2: -0.1, y2: 0 },
    { x1: -0.1, y1: 0, x2: -0.1, y2: 0.2 },
    { x1: -0.1, y1: 0.2, x2: 0.3, y2: 0.2 },
    { x1: 0.3, y1: 0.2, x2: 0.3, y2: 0.3 },
    { x1: 0.3, y1: 0.3, x2: -0.2, y2: 0.3 },
    { x1: -0.2, y1: 0.3, x2: -0.2, y2: 0.15 }
  ],
  php: [
    // Simplified "P"
    { x1: -0.3, y1: -0.3, x2: -0.3, y2: 0.3 },
    { x1: -0.3, y1: -0.3, x2: 0.1, y2: -0.3 },
    { x1: 0.1, y1: -0.3, x2: 0.1, y2: -0.05 },
    { x1: 0.1, y1: -0.05, x2: -0.3, y2: -0.05 },
    // "H" part
    { x1: 0.15, y1: -0.3, x2: 0.15, y2: 0.3 },
    { x1: 0.15, y1: 0, x2: 0.45, y2: 0 }
  ],
  laravel: [
    // Simplified "L"
    { x1: -0.35, y1: -0.3, x2: -0.35, y2: 0.3 },
    { x1: -0.35, y1: 0.3, x2: 0.3, y2: 0.3 }
  ],
  cpp: [
    // Two "C" shapes side by side
    { x1: -0.35, y1: -0.3, x2: -0.15, y2: -0.3 },
    { x1: -0.15, y1: -0.3, x2: -0.15, y2: 0.3 },
    { x1: -0.15, y1: 0.3, x2: -0.35, y2: 0.3 },
    { x1: 0.15, y1: -0.3, x2: 0.35, y2: -0.3 },
    { x1: 0.35, y1: -0.3, x2: 0.35, y2: 0.3 },
    { x1: 0.35, y1: 0.3, x2: 0.15, y2: 0.3 }
  ],
  mysql: [
    // Simplified cylinder
    { x1: -0.3, y1: -0.3, x2: 0.3, y2: -0.3 },
    { x1: 0.3, y1: -0.3, x2: 0.3, y2: 0.3 },
    { x1: 0.3, y1: 0.3, x2: -0.3, y2: 0.3 },
    { x1: -0.3, y1: 0.3, x2: -0.3, y2: -0.3 }
  ],
  sqlserver: [
    // Square with inner line
    { x1: -0.35, y1: -0.35, x2: 0.35, y2: -0.35 },
    { x1: 0.35, y1: -0.35, x2: 0.35, y2: 0.35 },
    { x1: 0.35, y1: 0.35, x2: -0.35, y2: 0.35 },
    { x1: -0.35, y1: 0.35, x2: -0.35, y2: -0.35 },
    // Inner vertical line
    { x1: 0, y1: -0.35, x2: 0, y2: 0.35 }
  ]
};

// Particle shapes & colors
const TYPES = ['circle', 'plus', 'square'];
const COLORS_DARK = [
  'rgba(59, 130, 246, 0.75)',
  'rgba(99, 102, 241, 0.75)',
  'rgba(168, 85, 247, 0.65)',
  'rgba(255, 255, 255, 0.65)'
];
const COLORS_LIGHT = [
  'rgba(37, 99, 235, 0.8)',
  'rgba(67, 56, 202, 0.8)',
  'rgba(126, 34, 206, 0.75)',
  'rgba(15, 23, 42, 0.75)'
];

export function initHeroParticles(options = {}) {
  const canvas = document.getElementById('hero-particles-canvas');
  if (!canvas) return;

  const perfLite = options.perfLite || false;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer =
    !window.matchMedia || window.matchMedia('(pointer: fine)').matches;
  const compactViewport =
    window.innerWidth < 768 || window.innerHeight < 600;

  // Respect reduced-motion and skip the heavy canvas on fragile viewport profiles.
  if (prefersReducedMotion || perfLite || !finePointer || compactViewport) {
    canvas.style.display = 'none';
    return;
  }
  canvas.style.display = '';

  const isLightMode = () => document.documentElement.classList.contains('light') || document.documentElement.getAttribute('data-theme') === 'light';

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const particleCount = 300;
  const particles = [];

  let width = 0;
  let height = 0;
  let animationFrameId = null;
  let targetPoints = [];
  let activeMorph = null;
  let activeHoveredElement = null;
  let currentSectionMode = 'robot';
  let time = 0;
  let scaleFactor = 1.0;

  let currentSpeedLimit = 1.1;
  let currentSizeMultiplier = 1.0;

  // Mouse state
  const mouse = {
    x: null,
    y: null,
    targetX: null,
    targetY: null
  };

  // State variables for Holographic Glitch Grid
  let glitchTimer = 0;
  let isGlitching = false;
  let glitchIntensity = 0;

  // State variables for bento mode
  let hoveredBentoTile = null;

  // State variables for contact mode
  let focusedInput = null;

  // --- AI CORE STATE ---
  const CORE_SIZE = 60;
  const RING1_SIZE = 60;
  const RING2_SIZE = 60;
  const RING3_SIZE = particleCount - CORE_SIZE - RING1_SIZE - RING2_SIZE;
  // Note: we still use BODY_START for compatibility with connection logic
  const BODY_START = 0;

  let robotState = 'idle';   // 'sleeping'|'idle'|'alert'|'curious'|'excited'
  let mouseVelocity = 0;
  let mouseVelocityAvg = 0;  // smoothed over many frames (habit tracking)
  let lastRobotMX = null;
  let lastRobotMY = null;
  let idleFrames = 0;
  const IDLE_THRESHOLD = 90;    // ~1.5s  → alert→idle transition
  const SLEEP_THRESHOLD = 600;  // ~10s   → idle→sleeping

  // Click rapidity — decays over time, spikes on click
  let clickRapidity = 0;

  // Dwell: grows when mouse stays within a small radius
  let dwellX = null;
  let dwellY = null;
  let dwellFrames = 0;

  // Autonomous look for sleeping/idle states
  let autoLookAngle = 0;

  // Blink state
  let blinkTimer = 0;         // counts down, 0 = no blink
  let nextBlinkAt = 180 + Math.random() * 240;

  // Per-particle depth cache (for robot coloring)
  const particleDepth = new Float32Array(particleCount);

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function randomInt(min, max) {
    return Math.floor(randomBetween(min, max + 1));
  }

  function handleResize() {
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const baseScale = width / 960;
    scaleFactor = Math.max(0.35, Math.min(1.8, baseScale));
    ctx.clearRect(0, 0, width, height);
  }

  function getValidSegments(segments) {
    return segments
      .map(seg => {
        if (![seg.x1, seg.y1, seg.x2, seg.y2].every(Number.isFinite)) {
          return null;
        }
        const length = Math.hypot(seg.x2 - seg.x1, seg.y2 - seg.y1);
        return length > 0 ? { ...seg, length } : null;
      })
      .filter(Boolean);
  }

  function sampleSegments(segments, jitter = 0.018) {
    const validSegments = getValidSegments(segments);
    const totalLength = validSegments.reduce((sum, seg) => sum + seg.length, 0);

    if (!Number.isFinite(totalLength) || totalLength <= 0) return [];

    const points = [];

    for (let i = 0; i < particleCount; i++) {
      const targetDistance = (i / particleCount) * totalLength;
      let walked = 0;
      let selected = validSegments[validSegments.length - 1];

      for (let j = 0; j < validSegments.length; j++) {
        const seg = validSegments[j];
        if (walked + seg.length >= targetDistance) {
          selected = seg;
          break;
        }
        walked += seg.length;
      }

      const t = selected.length > 0 ? (targetDistance - walked) / selected.length : 0.5;
      const jitterX = (Math.random() - 0.5) * jitter;
      const jitterY = (Math.random() - 0.5) * jitter;

      points.push({
        x: selected.x1 + t * (selected.x2 - selected.x1) + jitterX,
        y: selected.y1 + t * (selected.y2 - selected.y1) + jitterY
      });
    }

    return points;
  }

  function getShapeTargets(shapeName) {
    const segments = SHAPES[shapeName];
    return segments ? sampleSegments(segments) : [];
  }

  function initParticles() {
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2.5 + 1.2,
        type: TYPES[Math.floor(Math.random() * TYPES.length)],
        colorIndex: Math.floor(Math.random() * 4),
        phase: Math.random() * TAU,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        angle: Math.random() * TAU,
        targetOffset: Math.floor(Math.random() * particleCount),
        team: i % 2 === 0 ? 'blue' : 'purple',
        flash: 0,
        raceProgress: Math.random() * TAU,
        raceSpeed: randomBetween(0.008, 0.02),
        raceBoost: 0
      });
    }
  }

  function limitSpeed(p, maxSpeed) {
    const speed = Math.hypot(p.vx, p.vy);
    if (speed > maxSpeed) {
      p.vx = (p.vx / speed) * maxSpeed;
      p.vy = (p.vy / speed) * maxSpeed;
    }
  }

  // Wraps particles on boundary screen edge
  function wrapParticle(p) {
    const margin = 28;
    if (p.x < -margin) p.x = width + margin;
    if (p.x > width + margin) p.x = -margin;
    if (p.y < -margin) p.y = height + margin;
    if (p.y > height + margin) p.y = -margin;
  }

  function clampParticle(p) {
    p.x = Math.min(width, Math.max(0, p.x));
    p.y = Math.min(height, Math.max(0, p.y));
  }

  // Standard mouse avoidance for loose floating modes
  function applyCursorRepulsion(p) {
    if (mouse.x === null || mouse.y === null) return;
    const dx = p.x - mouse.x;
    const dy = p.y - mouse.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 0.001 && dist < 120) {
      const force = (120 - dist) / 120;
      p.vx += (dx / dist) * force * 0.65;
      p.vy += (dy / dist) * force * 0.65;
    }
  }

  function getTargetForParticle(targets, p, idx) {
    if (!targets.length) return null;
    return targets[(idx + p.targetOffset) % targets.length];
  }

  // Helper for drawing rounded speech bubbles backward-compatibly
  function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  // --- SECTION-SPECIFIC LOGIC ---

  // 1. Interactive Robot AI (Hero)
  function updateRobotMode() {
    const cx = width / 2;
    const cy = height / 2;

    // --- Glitch tick ---
    if (isGlitching) {
      glitchTimer--;
      if (glitchTimer <= 0) { isGlitching = false; glitchIntensity = 0; }
    }

    // --- Mouse velocity & habit tracking ---
    const hasMouse = mouse.x !== null && mouse.y !== null;
    if (hasMouse) {
      if (lastRobotMX !== null) {
        const spd = Math.hypot(mouse.x - lastRobotMX, mouse.y - lastRobotMY);
        mouseVelocity = mouseVelocity * 0.75 + spd * 0.25;
        mouseVelocityAvg = mouseVelocityAvg * 0.997 + spd * 0.003; // long-term habit
      }
      lastRobotMX = mouse.x;
      lastRobotMY = mouse.y;
      idleFrames = 0;

      // Dwell detection: mouse staying within 18px
      if (dwellX === null) { dwellX = mouse.x; dwellY = mouse.y; dwellFrames = 0; }
      const dwellDist = Math.hypot(mouse.x - dwellX, mouse.y - dwellY);
      if (dwellDist < 18) {
        dwellFrames++;
      } else {
        dwellX = mouse.x; dwellY = mouse.y; dwellFrames = 0;
      }
    } else {
      mouseVelocity *= 0.9;
      idleFrames++;
      dwellFrames = 0;
      dwellX = null; dwellY = null;
      lastRobotMX = null; lastRobotMY = null;
    }

    // Click rapidity decays
    clickRapidity = Math.max(0, clickRapidity - 0.008);

    // --- Robot state machine ---
    if (isGlitching) {
      robotState = 'excited';
    } else if (idleFrames > SLEEP_THRESHOLD) {
      robotState = 'sleeping';
    } else if (idleFrames > IDLE_THRESHOLD) {
      robotState = 'idle';
    } else if (mouseVelocity > 12) {
      robotState = 'excited';
    } else if (mouseVelocity > 4 || clickRapidity > 0.3) {
      robotState = 'curious';
    } else {
      robotState = 'alert';
    }

    // Excited users trigger micro-glitches
    if (robotState === 'excited' && !isGlitching && Math.random() < 0.018 + clickRapidity * 0.04) {
      isGlitching = true;
      glitchIntensity = 0.4 + mouseVelocity / 40;
      glitchTimer = 12 + Math.floor(mouseVelocity);
    }

    // Autonomous look target for sleeping/idle
    autoLookAngle += robotState === 'sleeping' ? 0.003 : 0.007;
    const autoLookR = robotState === 'sleeping' ? 0.15 : 0.25;
    const autoLX = cx + Math.cos(autoLookAngle) * cx * autoLookR;
    const autoLY = cy + Math.sin(autoLookAngle * 0.7) * cy * autoLookR;

    // Effective look target
    const lookTargetX = hasMouse ? mouse.x : autoLX;
    const lookTargetY = hasMouse ? mouse.y : autoLY;

    // Normalised look direction (-1..1)
    const lookNX = (lookTargetX - cx) / (width / 2 + 1);
    const lookNY = (lookTargetY - cy) / (height / 2 + 1);

    // Breathing / pulse
    const breatheScale = 1 + Math.sin(time * 0.018) * (robotState === 'sleeping' ? 0.04 : 0.015);

    // Blink
    nextBlinkAt--;
    if (nextBlinkAt <= 0) {
      blinkTimer = 8;
      nextBlinkAt = 200 + Math.random() * 300 - (clickRapidity * 80);
    }
    if (blinkTimer > 0) blinkTimer--;
    const blinkScale = blinkTimer > 0 ? Math.max(0.05, 1 - (blinkTimer / 8) * 0.95) : 1;

    // Sphere rotation: mirrors head turning toward cursor
    const sphereRotY = time * 0.003 + lookNX * 0.55;
    const sphereRotX = lookNY * 0.35;
    const cosRY = Math.cos(sphereRotY), sinRY = Math.sin(sphereRotY);
    const cosRX = Math.cos(sphereRotX), sinRX = Math.sin(sphereRotX);

    // Sphere radius reacts to state
    const baseRadius = 195 * scaleFactor * breatheScale;
    const excitedJitter = robotState === 'excited' ? (Math.random() - 0.5) * 18 * glitchIntensity : 0;
    const sphereRadius = baseRadius + excitedJitter;

    // Dwell orbit: particles swirl toward cursor if user dwells
    const dwellStrength = Math.min(dwellFrames / 120, 1);

    particles.forEach((p, idx) => {
      let tx, ty;

      let sx, sy, sz;

      if (idx < CORE_SIZE) {
        // Core: Dense inner sphere
        const phi = Math.acos(1 - 2 * (idx + 0.5) / CORE_SIZE);
        const theta = Math.PI * (1 + Math.sqrt(5)) * idx + time * 0.05;
        sx = Math.sin(phi) * Math.cos(theta);
        sy = Math.cos(phi);
        sz = Math.sin(phi) * Math.sin(theta);
        
        // Scale down core radius
        const r = (sphereRadius * 0.35) * (1 + blinkScale * 0.1); 
        sx *= r; sy *= r; sz *= r;
      } else if (idx < CORE_SIZE + RING1_SIZE) {
        // Ring 1: Horizontal orbit
        const localIdx = idx - CORE_SIZE;
        const angle = (localIdx / RING1_SIZE) * TAU + time * 0.02;
        const r = sphereRadius * 0.7;
        sx = Math.cos(angle) * r;
        sy = Math.sin(angle * 2) * 10; // Slight wave
        sz = Math.sin(angle) * r;
      } else if (idx < CORE_SIZE + RING1_SIZE + RING2_SIZE) {
        // Ring 2: Vertical orbit
        const localIdx = idx - (CORE_SIZE + RING1_SIZE);
        const angle = (localIdx / RING2_SIZE) * TAU - time * 0.015;
        const r = sphereRadius * 0.85;
        sx = Math.cos(angle) * r;
        sy = Math.sin(angle) * r;
        sz = Math.cos(angle * 2) * 15;
      } else {
        // Ring 3: Data nodes floating around
        const localIdx = idx - (CORE_SIZE + RING1_SIZE + RING2_SIZE);
        const phi = Math.acos(1 - 2 * (localIdx + 0.5) / RING3_SIZE);
        const theta = Math.PI * (1 + Math.sqrt(5)) * localIdx - time * 0.008;
        const r = sphereRadius * 1.1 + Math.sin(time * 0.01 + localIdx) * 20;
        sx = Math.sin(phi) * Math.cos(theta) * r;
        sy = Math.cos(phi) * r;
        sz = Math.sin(phi) * Math.sin(theta) * r;
      }

      // Add mouse look rotation
      const sx1 = sx * cosRY - sz * sinRY;
      const sz1 = sx * sinRY + sz * cosRY;
      const sy1 = sy * cosRX - sz1 * sinRX;
      const sz2 = sy * sinRX + sz1 * cosRX;

      // Store depth for coloring
      particleDepth[idx] = sz2 / sphereRadius; 

      const perspective = 420 / (420 - sz2 * 110 / sphereRadius);
      tx = cx + sx1 * perspective;
      ty = cy + sy1 * perspective;

      // Dwell: particles slowly orbit toward cursor
      if (dwellStrength > 0 && hasMouse) {
        const dDX = mouse.x - tx;
        const dDY = mouse.y - ty;
        const dDist = Math.hypot(dDX, dDY) + 1;
        const orbitAngle = Math.atan2(dDY, dDX) + Math.PI / 2;
        tx += Math.cos(orbitAngle) * 30 * dwellStrength * (dDist < 120 ? 1 : 0);
        ty += Math.sin(orbitAngle) * 30 * dwellStrength * (dDist < 120 ? 1 : 0);
      }

      // Glitch distortion
      if (isGlitching && Math.random() > 0.55) {
        tx += (Math.random() - 0.5) * 160 * glitchIntensity;
        ty += (Math.random() - 0.5) * 55 * glitchIntensity;
      }

      // Spring toward target — eyes are snappier
      const spring = 0.07;
      const damp = 0.83;
      p.vx = (p.vx + (tx - p.x) * spring) * damp;
      p.vy = (p.vy + (ty - p.y) * spring) * damp;
      limitSpeed(p, isGlitching ? 22 : (6.5));
      p.x += p.vx;
      p.y += p.vy;
    });
  }

  // 2. Fighting Mode (Story)
  function updateFightMode() {
    let blueSumX = 0, blueSumY = 0, blueCount = 0;
    let purpleSumX = 0, purpleSumY = 0, purpleCount = 0;

    particles.forEach(p => {
      if (p.team === 'blue') {
        blueSumX += p.x;
        blueSumY += p.y;
        blueCount++;
      } else {
        purpleSumX += p.x;
        purpleSumY += p.y;
        purpleCount++;
      }
    });

    const avgBlueX = blueCount ? blueSumX / blueCount : width * 0.25;
    const avgBlueY = blueCount ? blueSumY / blueCount : height / 2;
    const avgPurpleX = purpleCount ? purpleSumX / purpleCount : width * 0.75;
    const avgPurpleY = purpleCount ? purpleSumY / purpleCount : height / 2;

    particles.forEach((p) => {
      // Attract to opposing team's center of mass
      const targetX = p.team === 'blue' ? avgPurpleX : avgBlueX;
      const targetY = p.team === 'blue' ? avgPurpleY : avgBlueY;

      const dx = targetX - p.x;
      const dy = targetY - p.y;
      const dist = Math.hypot(dx, dy) || 1;

      p.vx += (dx / dist) * 0.18;
      p.vy += (dy / dist) * 0.18;

      // Chaotic drift
      p.vx += (Math.random() - 0.5) * 0.25;
      p.vy += (Math.random() - 0.5) * 0.25;

      // Cursor scattering
      if (mouse.x !== null && mouse.y !== null) {
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mdist = Math.hypot(mdx, mdy);
        if (mdist < 140) {
          const force = (140 - mdist) / 140;
          p.vx += (mdx / mdist) * force * 1.5;
          p.vy += (mdy / mdist) * force * 1.5;
        }
      }

      p.vx *= 0.94;
      p.vy *= 0.94;
      limitSpeed(p, 5.0);

      p.x += p.vx;
      p.y += p.vy;

      // Wall boundaries bounce
      const margin = 30;
      if (p.x < margin) { p.x = margin; p.vx *= -1; }
      if (p.x > width - margin) { p.x = width - margin; p.vx *= -1; }
      if (p.y < margin) { p.y = margin; p.vy *= -1; }
      if (p.y > height - margin) { p.y = height - margin; p.vy *= -1; }

      if (p.flash > 0) p.flash--;
    });

    // Resolve team collisions
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        if (p1.team !== p2.team) {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 22) {
            const angle = Math.atan2(dy, dx);
            const force = 2.2;
            p1.vx += Math.cos(angle) * force;
            p1.vy += Math.sin(angle) * force;
            p2.vx -= Math.cos(angle) * force;
            p2.vy -= Math.sin(angle) * force;

            p1.flash = 12;
            p2.flash = 12;
          }
        }
      }
    }
  }

  // 3. Wave Mode (Services default)
  function updateWaveMode() {
    particles.forEach((p, idx) => {
      const tx = (idx / particleCount) * width;
      const waveAmp = 90;
      const waveFreq = 0.004;
      const waveSpeed = 0.025;
      const ty = height / 2 + Math.sin(time * waveSpeed + tx * waveFreq + p.phase) * waveAmp;

      p.vx = (p.vx + (tx - p.x) * 0.04) * 0.85;
      p.vy = (p.vy + (ty - p.y) * 0.04) * 0.85;

      if (mouse.x !== null && mouse.y !== null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          p.vy += (dy / dist) * force * 4.5;
        }
      }

      limitSpeed(p, 4.5);
      p.x += p.vx;
      p.y += p.vy;
    });
  }

  // 4. Bento Mode (About)
  function updateBentoMode() {
    let rect = null;
    if (hoveredBentoTile) {
      rect = hoveredBentoTile.getBoundingClientRect();
    }

    particles.forEach((p, idx) => {
      if (rect) {
        const w = rect.width;
        const h = rect.height;
        const perimeter = 2 * (w + h);
        const perimeterRatio = idx / particleCount;
        const d = perimeterRatio * perimeter;

        let tx, ty;
        if (d < w) {
          tx = rect.left + d;
          ty = rect.top;
        } else if (d < w + h) {
          tx = rect.left + w;
          ty = rect.top + (d - w);
        } else if (d < 2 * w + h) {
          tx = rect.left + w - (d - w - h);
          ty = rect.top + h;
        } else {
          tx = rect.left;
          ty = rect.top + h - (d - 2 * w - h);
        }

        tx += (Math.random() - 0.5) * 6;
        ty += (Math.random() - 0.5) * 6;

        p.vx = (p.vx + (tx - p.x) * 0.085) * 0.82;
        p.vy = (p.vy + (ty - p.y) * 0.085) * 0.82;
        limitSpeed(p, 5.5);
      } else {
        p.vx += (Math.random() - 0.5) * 0.12;
        p.vy += (Math.random() - 0.5) * 0.12;
        p.vx *= 0.95;
        p.vy *= 0.95;
        limitSpeed(p, 1.2);
      }

      p.x += p.vx;
      p.y += p.vy;

      if (!rect) {
        wrapParticle(p);
      } else {
        clampParticle(p);
      }
    });
  }

  // 5. Constellation Mode (Skills)
  function updateConstellationMode() {
    particles.forEach((p) => {
      p.vx += (Math.random() - 0.5) * 0.08;
      p.vy += (Math.random() - 0.5) * 0.08;

      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 160) {
          const force = (160 - dist) / 160;
          p.vx += (dx / dist) * force * 0.22;
          p.vy += (dy / dist) * force * 0.22;
        }
      }

      p.vx *= 0.96;
      p.vy *= 0.96;
      limitSpeed(p, 1.8);

      p.x += p.vx;
      p.y += p.vy;
      wrapParticle(p);
    });
  }

  // 6. Racing Mode (Projects)
  function updateRacingMode() {
    particles.forEach((p, idx) => {
      let speed = p.raceSpeed;
      if (p.raceBoost > 0) {
        p.raceBoost--;
        speed *= 2.8;
      }

      p.raceProgress = (p.raceProgress + speed) % TAU;

      const ringIdx = idx % 3;
      const radiusX = Math.min(width * 0.42, 140 + ringIdx * 80);
      const radiusY = Math.min(height * 0.34, 90 + ringIdx * 50);

      const tx = width / 2 + Math.cos(p.raceProgress) * radiusX;
      const ty = height / 2 + Math.sin(p.raceProgress) * radiusY;

      p.vx = (p.vx + (tx - p.x) * 0.055) * 0.85;
      p.vy = (p.vy + (ty - p.y) * 0.055) * 0.85;

      if (mouse.x !== null && mouse.y !== null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 70) {
          p.raceBoost = 20;
        }
      }

      limitSpeed(p, 8.0);
      p.x += p.vx;
      p.y += p.vy;
    });
  }

  // 7. Nexus Mode (Contact)
  function updateNexusMode() {
    let focusRect = null;
    if (focusedInput) {
      focusRect = focusedInput.getBoundingClientRect();
    }

    particles.forEach((p, idx) => {
      if (focusRect) {
        const w = focusRect.width;
        const h = focusRect.height;
        const perimeter = 2 * (w + h);
        const perimeterRatio = idx / particleCount;
        const d = perimeterRatio * perimeter;

        let tx, ty;
        if (d < w) {
          tx = focusRect.left + d;
          ty = focusRect.top;
        } else if (d < w + h) {
          tx = focusRect.left + w;
          ty = focusRect.top + (d - w);
        } else if (d < 2 * w + h) {
          tx = focusRect.left + w - (d - w - h);
          ty = focusRect.top + h;
        } else {
          tx = focusRect.left;
          ty = focusRect.top + h - (d - 2 * w - h);
        }

        tx += (Math.random() - 0.5) * 5;
        ty += (Math.random() - 0.5) * 5;

        p.vx = (p.vx + (tx - p.x) * 0.08) * 0.82;
        p.vy = (p.vy + (ty - p.y) * 0.08) * 0.82;
        limitSpeed(p, 6.0);
      } else {
        // Interactive Nexus / Swirl
        const angle = (idx / particleCount) * Math.PI * 2 + time * 0.003;
        const radius = Math.min(width, height) * 0.28 + Math.sin(time * 0.02 + idx) * 60;
        
        let tx = width / 2 + Math.cos(angle) * radius;
        let ty = height / 2 + Math.sin(angle) * radius;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy);
          
          if (dist < 350) {
            const mouseAngle = Math.atan2(dy, dx);
            const force = (350 - dist) / 350;
            
            // Swirl tangentially around the mouse
            tx = mouse.x - Math.cos(mouseAngle + Math.PI/2) * 120 * force;
            ty = mouse.y - Math.sin(mouseAngle + Math.PI/2) * 120 * force;
            
            // Pull slightly towards mouse
            tx -= dx * 0.3 * force;
            ty -= dy * 0.3 * force;
          }
        }

        p.vx = (p.vx + (tx - p.x) * 0.05) * 0.88;
        p.vy = (p.vy + (ty - p.y) * 0.05) * 0.88;
        limitSpeed(p, 6.5);
      }

      p.x += p.vx;
      p.y += p.vy;
      clampParticle(p);
    });
  }

  // --- MORPHING / SWARMING ---

  function updateMorphParticle(p, idx) {
    const target = getTargetForParticle(targetPoints, p, idx);
    if (!target) return;

    let cx = width / 2;
    let cy = height / 2;
    let shapeScale = Math.min(width, height) * 0.45;

    if (activeHoveredElement) {
      const rect = activeHoveredElement.getBoundingClientRect();
      cx = rect.left + rect.width / 2;
      cy = rect.top + rect.height / 2;
      shapeScale = Math.max(80, Math.min(rect.width, rect.height) * 1.0);
    }

    const tx = cx + target.x * shapeScale;
    const ty = cy + target.y * shapeScale;

    p.vx *= 0.55;
    p.vy *= 0.55;
    p.x += (tx - p.x) * 0.095;
    p.y += (ty - p.y) * 0.095;
    p.x += Math.sin(time * 0.08 + idx) * 0.12;
    p.y += Math.cos(time * 0.08 + idx) * 0.12;

    clampParticle(p);
  }

  // --- DRAWING ---

  function drawParticle(p, idx) {
    let drawSize = p.size * currentSizeMultiplier;
    if (activeMorph) {
      drawSize = p.size * 2.2 * currentSizeMultiplier;
    } else if (currentSectionMode === 'racing' && p.raceBoost > 0) {
      drawSize = p.size * 1.8 * currentSizeMultiplier;
    }

    const isLight = isLightMode();
    let drawColor = isLight ? COLORS_LIGHT[p.colorIndex] : COLORS_DARK[p.colorIndex];
    if (currentSectionMode === 'robot') {
      if (isGlitching) {
        // Frantic colour during glitch
        const r = Math.random();
        if (r < 0.35)      drawColor = isLight ? `rgba(8, 145, 178, ${0.8 + Math.random() * 0.2})` : `rgba(6, 182, 212, ${0.8 + Math.random() * 0.2})`;
        else if (r < 0.65) drawColor = isLight ? `rgba(219, 39, 119, ${0.8 + Math.random() * 0.2})` : `rgba(236, 72, 153, ${0.8 + Math.random() * 0.2})`;
        else               drawColor = isLight ? `rgba(15, 23, 42, ${0.5 + Math.random() * 0.5})` : `rgba(255,255,255, ${0.5 + Math.random() * 0.5})`;
      } else {
        // Body sphere: depth-based shading (front = bright, back = dim)
        let depth = particleDepth[idx]; // -1 (back) to 1 (front)
        if (isNaN(depth)) depth = 0; // safeguard
        const t = (depth + 1) / 2;       // 0..1
        const alpha = 0.3 + t * 0.6;

        if (robotState === 'sleeping') {
          drawColor = isLight ? `rgba(30, 64, 175, ${alpha * 0.5})` : `rgba(14, 100, 180, ${alpha * 0.5})`;
        } else if (robotState === 'excited') {
          // Excited: shift toward purple/magenta
          drawColor = idx % 3 === 0
            ? (isLight ? `rgba(126, 34, 206, ${alpha})` : `rgba(168, 85, 247, ${alpha})`)
            : (isLight ? `rgba(14, 165, 233, ${alpha})` : `rgba(56, 189, 248, ${alpha})`);
        } else {
          // Normal: electric-blue gradient by depth
          drawColor = idx % 4 === 0
            ? (isLight ? `rgba(37, 99, 235, ${alpha})` : `rgba(99, 179, 255, ${alpha})`)
            : (isLight ? `rgba(2, 132, 199, ${alpha})` : `rgba(14, 165, 233, ${alpha})`);
        }
      }
    } else if (currentSectionMode === 'fight') {
      if (p.flash > 0) {
        drawColor = `rgba(255, 255, 255, ${0.5 + p.flash / 12})`;
      } else {
        drawColor = p.team === 'blue' ? 'rgba(59, 130, 246, 0.85)' : 'rgba(168, 85, 247, 0.85)';
      }
    } else if (currentSectionMode === 'racing' && p.raceBoost > 0) {
      drawColor = `rgba(6, 182, 212, ${0.7 + p.raceBoost / 20 * 0.3})`;
    }

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.strokeStyle = drawColor;
    ctx.fillStyle = drawColor;
    ctx.lineWidth = activeMorph ? 2.0 : 1.0;

    if (p.type === 'plus') {
      ctx.beginPath();
      ctx.moveTo(-drawSize, 0);
      ctx.lineTo(drawSize, 0);
      ctx.moveTo(0, -drawSize);
      ctx.lineTo(0, drawSize);
      ctx.stroke();
    } else if (p.type === 'square') {
      ctx.strokeRect(-drawSize / 2, -drawSize / 2, drawSize, drawSize);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, drawSize / 2, 0, TAU);
      ctx.fill();
    }
    ctx.restore();
  }

  // --- ANIMATION LOOP ---

  function animate() {
    time++;

    const fade = currentSectionMode === 'racing' ? 0.12 : 0.18;
    const isLight = isLightMode();
    ctx.fillStyle = isLight ? `rgba(255, 255, 255, ${fade})` : `rgba(0, 0, 0, ${fade})`;
    ctx.fillRect(0, 0, width, height);

    if (mouse.targetX !== null && mouse.targetY !== null) {
      if (mouse.x === null) {
        mouse.x = mouse.targetX;
        mouse.y = mouse.targetY;
      } else {
        mouse.x += (mouse.targetX - mouse.x) * 0.12;
        mouse.y += (mouse.targetY - mouse.y) * 0.12;
      }
    }

    // Interactive pulse from mouse
    if (currentSectionMode === 'robot' && !isGlitching && mouse.x !== null) {
        // subtle pulse ring
    }

    if (activeMorph) {
      particles.forEach((p, idx) => {
        p.angle += p.rotationSpeed;
        updateMorphParticle(p, idx);
        drawParticle(p, idx);
      });
    } else {
      if (currentSectionMode === 'robot') {
        updateRobotMode();
      } else if (currentSectionMode === 'fight') {
        updateFightMode();
      } else if (currentSectionMode === 'wave') {
        updateWaveMode();
      } else if (currentSectionMode === 'bento') {
        updateBentoMode();
      } else if (currentSectionMode === 'constellation') {
        updateConstellationMode();
      } else if (currentSectionMode === 'racing') {
        updateRacingMode();
      } else if (currentSectionMode === 'nexus') {
        updateNexusMode();
      }

      particles.forEach((p, idx) => {
        p.angle += p.rotationSpeed;

        const isStructured = currentSectionMode === 'robot' ||
                            (currentSectionMode === 'bento' && hoveredBentoTile) ||
                            (currentSectionMode === 'nexus' && focusedInput);

        if (!isStructured) {
          applyCursorRepulsion(p);
        }
        drawParticle(p, idx);
      });

      // Draw connection lines
      if (currentSectionMode === 'constellation') {
        ctx.lineWidth = 0.6;
        const connectDist = 85;
        for (let i = 0; i < particles.length; i++) {
          const p1 = particles[i];
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.hypot(dx, dy);
            if (dist < connectDist) {
              const alpha = ((connectDist - dist) / connectDist) * 0.26;
              ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      }

      // Robot: connect body sphere particles + draw eye-glow accents
      if (currentSectionMode === 'robot' && !isGlitching) {
        ctx.lineWidth = 0.3;
        const connectDist = 58;
        for (let i = BODY_START; i < particles.length; i++) {
          const p1 = particles[i];
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.hypot(dx, dy);
            if (dist < connectDist) {
              const depth = (particleDepth[i] + 1) / 2; // 0..1 front bias
              const alpha = ((connectDist - dist) / connectDist) * 0.35 * depth;
              ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }

       
      }
    }

    // Removed speech bubbles

    animationFrameId = requestAnimationFrame(animate);
  }

  // --- LISTENERS & BINDINGS ---

  function handleMouseMove(e) {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
  }

  function handleMouseLeave() {
    mouse.targetX = null;
    mouse.targetY = null;
    mouse.x = null;
    mouse.y = null;
  }

  function handleClickBurst(e) {
    if (currentSectionMode === 'robot') {
      if (typeof e.clientX !== 'number' || typeof e.clientY !== 'number') return;
      if (e.target && e.target.closest('a, button, input, textarea, [role="button"], [data-theme-toggle]')) return;

      // Spike click-rapidity habit
      clickRapidity = Math.min(clickRapidity + 0.35, 2.0);

      // Scale glitch intensity with how "hyper" the user is
      isGlitching = true;
      glitchIntensity = 0.8 + clickRapidity * 0.6;
      glitchTimer = 30 + Math.floor(clickRapidity * 20);

      // Force-wake from sleep
      if (robotState === 'sleeping') {
        nextBlinkAt = 5;   // immediate blink
        robotState = 'alert';
      }

      // Radial scatter from click point (body only; eyes spring back on their own)
      particles.forEach((p, idx) => {
        if (idx < BODY_START) return; // don't scatter eyes — let them track
        const dx = p.x - e.clientX;
        const dy = p.y - e.clientY;
        const dist = Math.hypot(dx, dy) + 1;
        if (dist < 220 * scaleFactor) {
          const force = ((220 * scaleFactor - dist) / 55) * (1 + clickRapidity * 0.4);
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      });
      return;
    }

    // Default scatter burst for other modes
    particles.forEach(p => {
      const angle = Math.random() * TAU;
      const force = Math.random() * 3 + 2;
      p.vx = Math.cos(angle) * force;
      p.vy = Math.sin(angle) * force;
    });
  }

  // Keyboard easter egg: press 'g' to force a glitch
  function handleKeyDown(e) {
    if (currentSectionMode !== 'robot') return;
    
    // Ignore input text areas or form fields
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;

    if (e.key && e.key.toLowerCase() === 'g') {
      isGlitching = true;
      glitchIntensity = 1.0;
      glitchTimer = 30; // Lasts ~0.5 seconds at 60fps
    }
  }

  function setMorphTarget(shapeName) {
    if (shapeName === activeMorph) return;

    if (shapeName) {
      targetPoints = getShapeTargets(shapeName);
      if (!targetPoints.length) return;
      activeMorph = shapeName;
    } else {
      activeMorph = null;
      targetPoints = [];
      particles.forEach(p => {
        p.vx *= 0.45;
        p.vy *= 0.45;
      });
    }
  }

  function handleDocumentOver(e) {
    const target = e.target;
    if (!target) return;

    const morphEl = target.closest('[data-morph]');
    if (morphEl) {
      const shape = morphEl.getAttribute('data-morph');
      if (SHAPES[shape]) {
        activeHoveredElement = morphEl;
        setMorphTarget(shape);
      }
    }

    const bentoEl = target.closest('.bento-tile');
    if (bentoEl) {
      hoveredBentoTile = bentoEl;
    }
  }

  function handleDocumentOut(e) {
    const target = e.target;
    if (!target) return;

    const morphEl = target.closest('[data-morph]');
    if (morphEl) {
      const related = e.relatedTarget;
      if (!related || !related.closest || related.closest('[data-morph]') !== morphEl) {
        activeHoveredElement = null;
        setMorphTarget(null);
      }
    }

    const bentoEl = target.closest('.bento-tile');
    if (bentoEl) {
      const related = e.relatedTarget;
      if (!related || !related.closest || related.closest('.bento-tile') !== bentoEl) {
        hoveredBentoTile = null;
      }
    }
  }

  function handleFocusIn(e) {
    if (e.target && e.target.closest('#contact form input, #contact form textarea')) {
      focusedInput = e.target;
    }
  }

  function handleFocusOut(e) {
    if (e.target && e.target.closest('#contact form input, #contact form textarea')) {
      focusedInput = null;
    }
  }

  const sections = [
    { id: '#top', mode: 'robot', speed: 1.1, sizeMultiplier: 1.0 },
    { id: '#story', mode: 'fight', speed: 0.7, sizeMultiplier: 1.0 },
    { id: '#services', mode: 'wave', speed: 1.2, sizeMultiplier: 1.0 },
    { id: '#about', mode: 'bento', speed: 0.6, sizeMultiplier: 0.8 },
    { id: '#skills', mode: 'constellation', speed: 1.0, sizeMultiplier: 1.0 },
    { id: '#projects', mode: 'racing', speed: 2.2, sizeMultiplier: 1.2 },
    { id: '#contact', mode: 'nexus', speed: 1.2, sizeMultiplier: 1.0 }
  ];

  const scrollTriggers = [];

  sections.forEach((sec) => {
    const el = document.querySelector(sec.id);
    if (!el) return;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: (self) => {
        if (self.isActive) {
          setSectionState(sec.mode, sec.speed, sec.sizeMultiplier);
        }
      }
    });
    scrollTriggers.push(trigger);
  });

  function setSectionState(mode, speed, sizeMultiplier) {
    const previousMode = currentSectionMode;
    currentSectionMode = mode;
    currentSpeedLimit = speed;
    currentSizeMultiplier = sizeMultiplier;

    if (previousMode === 'robot' && mode !== 'robot') {
      isGlitching = false;
      glitchTimer = 0;
      glitchIntensity = 0;
    }

    if (activeMorph && !activeHoveredElement) {
      activeMorph = null;
      targetPoints = [];
    }
  }

  // Scroll velocity: fast scroll excites the robot
  let lastScrollY = window.scrollY;
  function handleScroll() {
    if (currentSectionMode !== 'robot') return;
    const delta = Math.abs(window.scrollY - lastScrollY);
    lastScrollY = window.scrollY;
    if (delta > 8) {
      mouseVelocity = Math.min(mouseVelocity + delta * 0.4, 40);
    }
  }

  // Double-click: robot does a strong glitch burst
  function handleDblClick(e) {
    if (currentSectionMode !== 'robot') return;
    if (e.target && e.target.closest('a, button, input, textarea')) return;
    isGlitching = true;
    glitchIntensity = 2.0;
    glitchTimer = 60;
    clickRapidity = Math.min(clickRapidity + 0.8, 2.0);
    // All body particles burst outward then snap back
    particles.forEach((p, idx) => {
      if (idx < BODY_START) return;
      const angle = Math.random() * TAU;
      p.vx += Math.cos(angle) * (4 + Math.random() * 6);
      p.vy += Math.sin(angle) * (4 + Math.random() * 6);
    });
  }

  // Bind all event listeners
  document.addEventListener('mouseover', handleDocumentOver);
  document.addEventListener('mouseout', handleDocumentOut);
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('click', handleClickBurst);
  document.addEventListener('dblclick', handleDblClick);
  document.addEventListener('mouseleave', handleMouseLeave);
  document.addEventListener('focusin', handleFocusIn);
  document.addEventListener('focusout', handleFocusOut);
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('resize', handleResize);
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Initial trigger & run
  handleResize();
  initParticles();
  setSectionState('robot', 1.1, 1.0);
  animate();

  // Return destructor
  return () => {
    cancelAnimationFrame(animationFrameId);
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('scroll', handleScroll);
    document.removeEventListener('mouseover', handleDocumentOver);
    document.removeEventListener('mouseout', handleDocumentOut);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('click', handleClickBurst);
    document.removeEventListener('dblclick', handleDblClick);
    document.removeEventListener('mouseleave', handleMouseLeave);
    document.removeEventListener('focusin', handleFocusIn);
    document.removeEventListener('focusout', handleFocusOut);
    window.removeEventListener('keydown', handleKeyDown);
    scrollTriggers.forEach(t => t.kill());
  };
}


export function initDashboardParticles(canvasId, isDarkTheme) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width, height;
  let particles = [];
  const particleCount = 45;
  const DASHBOARD_COLORS = [
    'rgba(245, 158, 11, 0.75)', // amber
    'rgba(16, 185, 129, 0.75)', // emerald
    'rgba(244, 63, 94, 0.65)',  // rose
    'rgba(14, 165, 233, 0.65)'  // sky
  ];

  function resize() {
    width = canvas.parentElement.clientWidth;
    height = canvas.parentElement.clientHeight;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function init() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 2 + 1,
        color: DASHBOARD_COLORS[Math.floor(Math.random() * DASHBOARD_COLORS.length)]
      });
    }
  }

  let rafId;
  function animate() {
    const isLightMode = () => document.documentElement.classList.contains('light') || document.documentElement.getAttribute('data-theme') === 'light';
    const isLight = isLightMode();
    ctx.fillStyle = isLight ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, width, height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });

    rafId = requestAnimationFrame(animate);
  }

  resize();
  init();
  animate();

  window.addEventListener('resize', resize);
  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener('resize', resize);
  };
}
