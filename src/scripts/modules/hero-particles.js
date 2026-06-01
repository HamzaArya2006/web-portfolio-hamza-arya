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
const COLORS = [
  'rgba(0, 243, 255, 0.85)',   // Neon Cyan
  'rgba(11, 72, 221, 0.85)',   // Deep Blue
  'rgba(255, 0, 255, 0.8)',    // Magenta (Glitch)
  'rgba(0, 180, 255, 0.7)'     // Lighter Blue
];

const FACE_NODES = [
  // Outer silhouette
  {x: 0, y: -140, z: -20}, {x: 40, y: -130, z: -10}, {x: 80, y: -100, z: 0}, {x: 110, y: -50, z: 20}, {x: 120, y: 10, z: 30}, 
  {x: 110, y: 50, z: 20}, {x: 130, y: 70, z: 40}, {x: 100, y: 80, z: 30}, {x: 105, y: 100, z: 35}, {x: 80, y: 120, z: 10}, 
  {x: 50, y: 140, z: 0}, {x: 0, y: 150, z: -10}, {x: -50, y: 130, z: -20}, {x: -90, y: 90, z: -40}, {x: -110, y: 40, z: -50}, 
  {x: -120, y: -20, z: -50}, {x: -100, y: -80, z: -40}, {x: -60, y: -120, z: -30}, {x: -30, y: -135, z: -25},
  // Inner structures
  {x: 20, y: -100, z: -10}, {x: 60, y: -70, z: 10}, {x: 80, y: -20, z: 20}, {x: 80, y: 30, z: 20}, {x: 50, y: 60, z: 10},
  {x: 10, y: 80, z: 0}, {x: -30, y: 60, z: -20}, {x: -60, y: 20, z: -30}, {x: -60, y: -30, z: -30}, {x: -30, y: -70, z: -20},
  {x: 30, y: -40, z: 0}, {x: 50, y: -10, z: 10}, {x: 40, y: 30, z: 0}, {x: 10, y: 40, z: -10}, {x: -20, y: 10, z: -20}, {x: -20, y: -30, z: -20},
  {x: 20, y: -60, z: -10}, {x: 35, y: 80, z: -5}, {x: 65, y: 100, z: 5}, {x: 90, y: 20, z: 25}, {x: 100, y: -30, z: 25}, {x: 80, y: -90, z: 5},
  {x: 40, y: -110, z: -10}, {x: -20, y: -110, z: -20}, {x: -50, y: -90, z: -30}, {x: -80, y: -40, z: -40}, {x: -80, y: 10, z: -40}, {x: -70, y: 60, z: -30},
  {x: -40, y: 100, z: -20}, {x: 10, y: 110, z: -5}, {x: 45, y: -55, z: 0}, {x: 60, y: 15, z: 10}, {x: 85, y: 50, z: 15}, {x: 75, y: -10, z: 15},
  // Extra detail points
  {x: 60, y: -10, z: 15}, {x: 90, y: 40, z: 20}, {x: 70, y: 70, z: 10}, {x: 30, y: 100, z: -5}, {x: -10, y: 70, z: -15}, {x: -40, y: 40, z: -25},
  {x: -10, y: -50, z: -15}, {x: 10, y: -20, z: -5}, {x: 40, y: 10, z: 5}, {x: 20, y: 60, z: -5}, {x: -50, y: -10, z: -25}, {x: -30, y: 30, z: -20}
];

// Pre-bake the face connections ONCE so we don't calculate them every frame (O(1) instead of O(N^2))
const PRE_BAKED_CONNECTIONS = [];
for (let i = 0; i < FACE_NODES.length; i++) {
  for (let j = i + 1; j < FACE_NODES.length; j++) {
    const dx = FACE_NODES[i].x - FACE_NODES[j].x;
    const dy = FACE_NODES[i].y - FACE_NODES[j].y;
    if (Math.hypot(dx, dy) < 48) {
      PRE_BAKED_CONNECTIONS.push([i, j]);
    }
  }
}

export function initHeroParticles(options = {}) {
  const canvas = document.getElementById('hero-particles-canvas');
  if (!canvas) return;

  const perfLite = options.perfLite || false;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer =
    !window.matchMedia || window.matchMedia('(pointer: fine)').matches;
  const compactViewport =
    window.innerWidth < 1024 || window.innerHeight < 720;

  // Respect reduced-motion and skip the heavy canvas on fragile viewport profiles.
  if (prefersReducedMotion || perfLite || !finePointer || compactViewport) {
    canvas.style.display = 'none';
    return;
  }
  canvas.style.display = '';

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // HMR Failsafe: Kill any existing ghost loops spawned by Vite hot-reloads
  if (canvas.dataset.animationFrameId) {
    cancelAnimationFrame(parseInt(canvas.dataset.animationFrameId));
  }

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const particleCount = 220; // Reduced from 300 for maximum performance
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

  // Glitch effect state
  let glitchTimer = 0;

  // State variables for bento mode
  let hoveredBentoTile = null;

  // State variables for contact mode
  let focusedInput = null;

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
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        z: (Math.random() - 0.5) * 200,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        vz: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2.5 + 1.2,
        scaleZ: 1.0,
        type: TYPES[Math.floor(Math.random() * TYPES.length)],
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
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

  // 1. Holographic Wireframe AI Mode (Hero)
  function updateRobotMode() {
    let lookX = 0;
    let lookY = 0;

    if (mouse.x !== null && mouse.y !== null) {
      const dx = mouse.x - width / 2;
      const dy = mouse.y - height / 2;
      // 3D rotation angles mapping
      lookX = dx * 0.0006;
      lookY = dy * 0.0006;
    }

    if (glitchTimer > 0) glitchTimer--;
    const isGlitching = glitchTimer > 0 || Math.random() < 0.015;

    const perspective = 300;

    particles.forEach((p, idx) => {
      let tx, ty, tz;

      if (idx < 120) {
        // SOUNDWAVE (Left side) - Multiple overlapping frequencies for realism
        const bars = 15;
        const barIndex = idx % bars;
        const particleInBar = Math.floor(idx / bars);
        const totalInBar = 120 / bars;
        
        // Complex perlin-like noise simulation
        const freq1 = Math.sin(time * 0.1 + barIndex * 0.5);
        const freq2 = Math.cos(time * 0.07 + barIndex * 0.3) * 0.5;
        const freq3 = Math.sin(time * 0.15 - barIndex * 0.1) * 0.25;
        const compoundFreq = freq1 + freq2 + freq3;
        
        const barHeight = 40 + Math.abs(compoundFreq) * 140 * scaleFactor;
        
        // Soundwave stays slightly further back
        tz = 80; 
        
        const waveStartX = width * 0.18;
        const barSpacing = 16 * scaleFactor;
        tx = waveStartX + barIndex * barSpacing;
        
        const yOffset = (particleInBar / (totalInBar - 1) - 0.5) * barHeight;
        ty = height / 2 + yOffset;

        if (isGlitching && Math.random() > 0.6) {
          tx += (Math.random() - 0.5) * 40;
          p.color = Math.random() > 0.5 ? 'rgba(0, 243, 255, 0.9)' : 'rgba(255, 0, 255, 0.9)';
        } else {
          p.color = 'rgba(0, 243, 255, 0.85)';
        }

      } else if (idx < 120 + FACE_NODES.length) {
        // AI WIREFRAME FACE (Right side) - True 3D projection
        const faceIdx = idx - 120;
        const node = FACE_NODES[faceIdx];
        
        const cosX = Math.cos(lookY * -1);
        const sinX = Math.sin(lookY * -1);
        const cosY = Math.cos(lookX);
        const sinY = Math.sin(lookX);
        
        let nx = node.x * scaleFactor;
        let ny = node.y * scaleFactor;
        let nz = node.z * scaleFactor;

        // Apply Y-axis rotation
        let rx = nx * cosY + nz * sinY;
        let rz = -nx * sinY + nz * cosY;
        
        // Apply X-axis rotation
        let ry = ny * cosX - rz * sinX;
        rz = ny * sinX + rz * cosX;

        // Elastic Mouse Distortion
        const faceCX = width * 0.65;
        const faceCY = height / 2;
        let globalNx = faceCX + rx;
        let globalNy = faceCY + ry;
        
        if (mouse.x !== null && mouse.y !== null) {
          const mdx = globalNx - mouse.x;
          const mdy = globalNy - mouse.y;
          const dist = Math.hypot(mdx, mdy) || 0.001; // Prevent NaN freeze!
          if (dist < 180) {
            const force = Math.pow((180 - dist) / 180, 2);
            // Elastic push outward and back in Z
            rx += (mdx / dist) * force * 50;
            ry += (mdy / dist) * force * 50;
            rz -= force * 100; 
          }
        }

        // Breathing effect
        rx += Math.sin(time * 0.02 + faceIdx) * 3;
        ry += Math.cos(time * 0.025 + faceIdx) * 3;

        tx = faceCX + rx;
        ty = faceCY + ry;
        tz = rz;
        
        if (isGlitching && Math.random() > 0.8) {
          tx += (Math.random() - 0.5) * 60;
          tz += (Math.random() - 0.5) * 60;
          p.color = Math.random() > 0.5 ? 'rgba(255, 0, 255, 0.9)' : 'rgba(11, 72, 221, 0.9)';
        } else {
          p.color = idx % 3 === 0 ? 'rgba(0, 243, 255, 0.85)' : 'rgba(11, 72, 221, 0.85)';
        }

      } else {
        // FREE ROAMING DUST
        tx = p.x + (Math.random() - 0.5) * 10;
        ty = p.y + (Math.random() - 0.5) * 10;
        tz = p.z + (Math.random() - 0.5) * 10;
        
        tx += (width * 0.65 - p.x) * 0.005;
        ty += (height / 2 - p.y) * 0.005;
        tz += (0 - p.z) * 0.005;
        p.color = 'rgba(0, 243, 255, 0.3)';
      }

      // Spring physics
      p.vx = (p.vx + (tx - p.x) * 0.09) * 0.78;
      p.vy = (p.vy + (ty - p.y) * 0.09) * 0.78;
      p.vz = (p.vz + (tz - p.z) * 0.09) * 0.78;
      
      const speed = Math.hypot(p.vx, p.vy, p.vz);
      if (speed > 8.0) {
        p.vx = (p.vx / speed) * 8.0;
        p.vy = (p.vy / speed) * 8.0;
        p.vz = (p.vz / speed) * 8.0;
      }
      
      p.x += p.vx;
      p.y += p.vy;
      p.z += p.vz;
      
      // Calculate 3D scale based on depth
      const pz = perspective + p.z;
      p.scaleZ = pz > 1 ? perspective / pz : 0.01;
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

  // 7. Heart Mode (Contact)
  function updateHeartMode() {
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
        const angle = (idx / particleCount) * Math.PI * 2;
        const sin = Math.sin(angle);
        const hx = 16 * Math.pow(sin, 3);
        const hy = -(13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle));

        const pulse = 1.0 + Math.sin(time * 0.08) * 0.07;
        const scale = Math.min(width, height) * 0.014 * pulse;

        const tx = width / 2 + hx * scale;
        const ty = height / 2 + hy * scale;

        p.vx = (p.vx + (tx - p.x) * 0.065) * 0.84;
        p.vy = (p.vy + (ty - p.y) * 0.065) * 0.84;
        limitSpeed(p, 5.0);
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
    
    // Apply 3D scale if in robot mode
    if (currentSectionMode === 'robot' && p.scaleZ) {
      drawSize *= p.scaleZ;
    }

    if (activeMorph) {
      drawSize = p.size * 2.2 * currentSizeMultiplier;
    } else if (currentSectionMode === 'racing' && p.raceBoost > 0) {
      drawSize = p.size * 1.8 * currentSizeMultiplier;
    }

    let drawColor = p.color;
    if (currentSectionMode === 'fight') {
      if (p.flash > 0) {
        drawColor = `rgba(255, 255, 255, ${0.5 + p.flash / 12})`;
      } else {
        drawColor = p.team === 'blue' ? 'rgba(59, 130, 246, 0.85)' : 'rgba(168, 85, 247, 0.85)';
      }
    } else if (currentSectionMode === 'racing' && p.raceBoost > 0) {
      drawColor = `rgba(6, 182, 212, ${0.7 + p.raceBoost / 20 * 0.3})`;
    }

    ctx.save();
    
    // Soft glow for realism in robot mode
    if (currentSectionMode === 'robot') {
      ctx.shadowBlur = 8;
      ctx.shadowColor = drawColor;
    }
    
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

    if (currentSectionMode === 'robot') {
      ctx.clearRect(0, 0, width, height);
      animationFrameId = requestAnimationFrame(animate);
      canvas.dataset.animationFrameId = animationFrameId;
      return;
    }

    // Crucial: reset blending mode before clearing canvas!
    ctx.globalCompositeOperation = 'source-over';

    const fade = currentSectionMode === 'racing' ? 0.12 : 0.18;
    ctx.fillStyle = `rgba(0, 0, 0, ${fade})`;
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

    // Removed old robot timers

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
      } else if (currentSectionMode === 'heart') {
        updateHeartMode();
      }

      // Z-sorting is unnecessary with additive blending, removing it saves massive CPU!
      if (currentSectionMode === 'robot') {
        ctx.globalCompositeOperation = 'screen';
      } else {
        ctx.globalCompositeOperation = 'source-over';
      }

      particles.forEach((p, idx) => {
        p.angle += p.rotationSpeed;

        const isStructured = currentSectionMode === 'robot' ||
                            (currentSectionMode === 'bento' && hoveredBentoTile) ||
                            (currentSectionMode === 'heart' && focusedInput);

        if (!isStructured) {
          applyCursorRepulsion(p);
        }
        drawParticle(p);
      });

      // Draw pre-baked geometry (O(1) Ultra-Fast Rendering)
      if (currentSectionMode === 'robot') {
        ctx.lineWidth = 1.0;
        ctx.strokeStyle = (glitchTimer > 0 || Math.random() < 0.005) ? `rgba(255, 0, 255, 0.45)` : `rgba(0, 243, 255, 0.35)`;
        
        ctx.beginPath();
        for (let i = 0; i < PRE_BAKED_CONNECTIONS.length; i++) {
          const [a, b] = PRE_BAKED_CONNECTIONS[i];
          const p1 = particles[120 + a];
          const p2 = particles[120 + b];
          if (!p1 || !p2) continue;
          
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
        }
        ctx.stroke();
        
      } else if (currentSectionMode === 'constellation') {
        // Fast O(N) random connecting for constellation mode
        ctx.lineWidth = 0.6;
        ctx.strokeStyle = `rgba(99, 102, 241, 0.2)`;
        ctx.beginPath();
        for (let i = 0; i < particles.length; i++) {
          const p1 = particles[i];
          for (let j = 1; j < 5; j++) {
            if (i + j >= particles.length) break;
            const p2 = particles[i + j];
            if (Math.abs(p1.x - p2.x) < 80 && Math.abs(p1.y - p2.y) < 80) {
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
            }
          }
        }
        ctx.stroke();
      }
    }

    // Holographic effects complete

    animationFrameId = requestAnimationFrame(animate);
    canvas.dataset.animationFrameId = animationFrameId;
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
      // Trigger glitch
      glitchTimer = 20; 
      
      // Localized burst
      particles.forEach((p, idx) => {
        const pdx = p.x - e.clientX;
        const pdy = p.y - e.clientY;
        const pdist = Math.hypot(pdx, pdy) || 1;
        if (pdist < 180) {
          p.vx += (pdx / pdist) * randomBetween(6, 12);
          p.vy += (pdy / pdist) * randomBetween(6, 12);
          if (idx % 2 === 0) p.color = 'rgba(255, 0, 255, 0.9)'; // Glitch magenta
        }
      });
      return;
    }

    // Default scatter burst
    particles.forEach(p => {
      const angle = Math.random() * TAU;
      const force = Math.random() * 3 + 2;
      p.vx = Math.cos(angle) * force;
      p.vy = Math.sin(angle) * force;
    });
  }

  // Removed keyboard easter egg

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
    { id: '#contact', mode: 'heart', speed: 0.9, sizeMultiplier: 1.0 }
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

    // Lightweight adjustment: fade canvas on hero section to save composite/paint overhead
    if (canvas) {
      canvas.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      if (mode === 'robot') {
        canvas.style.opacity = '0';
      } else {
        canvas.style.opacity = '0.5';
      }
    }

    if (previousMode === 'robot' && mode !== 'robot') {
      glitchTimer = 0;
    }

    if (activeMorph && !activeHoveredElement) {
      activeMorph = null;
      targetPoints = [];
    }
  }

  // Bind all event listeners
  document.addEventListener('mouseover', handleDocumentOver);
  document.addEventListener('mouseout', handleDocumentOut);
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('click', handleClickBurst);
  document.addEventListener('mouseleave', handleMouseLeave);
  document.addEventListener('focusin', handleFocusIn);
  document.addEventListener('focusout', handleFocusOut);
  window.addEventListener('resize', handleResize);

  // Initial trigger & run
  handleResize();
  initParticles();
  setSectionState('robot', 1.1, 1.0);
  animate();

  // Return destructor
  return () => {
    cancelAnimationFrame(animationFrameId);
    window.removeEventListener('resize', handleResize);
    document.removeEventListener('mouseover', handleDocumentOver);
    document.removeEventListener('mouseout', handleDocumentOut);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('click', handleClickBurst);
    document.removeEventListener('mouseleave', handleMouseLeave);
    document.removeEventListener('focusin', handleFocusIn);
    document.removeEventListener('focusout', handleFocusOut);
    scrollTriggers.forEach(t => t.kill());
  };
}
