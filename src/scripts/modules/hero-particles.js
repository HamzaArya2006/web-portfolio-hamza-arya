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
  'rgba(59, 130, 246, 0.75)',
  'rgba(99, 102, 241, 0.75)',
  'rgba(168, 85, 247, 0.65)',
  'rgba(255, 255, 255, 0.65)'
];

export function initHeroParticles(options = {}) {
  const canvas = document.getElementById('hero-particles-canvas');
  if (!canvas) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Respect user preference for reduced motion
  if (prefersReducedMotion) {
    canvas.style.display = 'none';
    return;
  }

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

  let currentSpeedLimit = 1.1;
  let currentSizeMultiplier = 1.0;

  // Mouse state
  const mouse = {
    x: null,
    y: null,
    targetX: null,
    targetY: null
  };

  // State variables for robot mode
  let blinkTimer = 0;
  let nextBlinkTime = 150;
  let winkTimer = 0;
  let winkingEye = 'right';
  
  // Persistent anger states
  let isAnnoyed = false;
  let thanksTimer = 0;
  let activeQuote = '';
  let activeDevilQuote = '';
  let activeAngelQuote = '';
  let typedKeys = '';

  const ANNOYED_QUOTES = ["f&%k!", "OUCH!", "STOP IT!", "HEY!", "WTF?", "DO NOT TOUCH!"];
  const DEVIL_QUOTES = ["KEEP HITTING!", "SMASH IT!", "DO IT AGAIN!", "HIT HIM!", "HE DESERVES IT!"];
  const ANGEL_QUOTES = ["TYPE 'SORRY'!", "APOLOGIZE!", "BE KIND!", "PLEASE STOP!", "SAY SORRY!"];

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

  // 1. Robot Face Mode (Hero)
  function updateRobotMode() {
    blinkTimer++;
    if (blinkTimer >= nextBlinkTime) {
      blinkTimer = 0;
      nextBlinkTime = randomInt(180, 320);
    }
    if (winkTimer > 0) {
      winkTimer--;
    }

    let lookX = 0;
    let lookY = 0;

    if (mouse.x !== null && mouse.y !== null) {
      const dx = mouse.x - width / 2;
      const dy = mouse.y - height / 2;
      const dist = Math.hypot(dx, dy) || 1;
      
      const maxLook = 18;
      lookX = (dx / dist) * Math.min(maxLook, dist * 0.05);
      lookY = (dy / dist) * Math.min(maxLook, dist * 0.05);
    }

    const isBlinking = blinkTimer < 12;
    const isHappy = thanksTimer > 0;

    // Proportional scale factor based on screen width for smartwatch, mobile, tablet, desktop, 4K/8K/16K screens
    const baseScale = width / 960;
    const scaleFactor = Math.max(0.35, Math.min(1.8, baseScale));

    // Peeking centers placed directly at left & right window borders
    const dcx = 20 * scaleFactor; // Left peeking Devil
    const dcy = height / 2;
    const acx = width - 20 * scaleFactor; // Right peeking Angel
    const acy = height / 2;

    particles.forEach((p, idx) => {
      let tx, ty;

      if (isAnnoyed) {
        // --- ANNOYED SPLIT STATE ---
        if (idx < 100) {
          // Centered Face (Head Squircle outline, G2 curvature G=3.2)
          const angle = (idx / 100) * Math.PI * 2;
          const w = 155 * scaleFactor;
          const h = 125 * scaleFactor;
          const n = 3.2;
          const cos = Math.cos(angle);
          const sin = Math.sin(angle);
          const sx = Math.sign(cos) * Math.pow(Math.abs(cos), 2 / n);
          const sy = Math.sign(sin) * Math.pow(Math.abs(sin), 2 / n);

          tx = width / 2 + sx * w + lookX * 0.15;
          ty = height / 2 + sy * h + lookY * 0.15;
        } else if (idx < 120) {
          // Centered Left Eye (angry slanted line \)
          const t = (idx - 100) / 19;
          const eyeCX = width / 2 - 50 * scaleFactor + lookX * 0.15;
          const eyeCY = height / 2 - 20 * scaleFactor + lookY * 0.15;
          tx = eyeCX + (-12 + t * 24) * scaleFactor;
          ty = eyeCY + (-8 + t * 16) * scaleFactor;
        } else if (idx < 140) {
          // Centered Right Eye (angry slanted line /)
          const t = (idx - 120) / 19;
          const eyeCX = width / 2 + 50 * scaleFactor + lookX * 0.15;
          const eyeCY = height / 2 - 20 * scaleFactor + lookY * 0.15;
          tx = eyeCX + (-12 + t * 24) * scaleFactor;
          ty = eyeCY + (8 - t * 16) * scaleFactor;
        } else if (idx < 180) {
          // Centered Mouth (frowning curve)
          const t = (idx - 140) / 39;
          const mouthW = 70 * scaleFactor;
          const xOffset = -mouthW / 2 + t * mouthW;
          tx = width / 2 + xOffset + lookX * 0.15;
          ty = height / 2 + 35 * scaleFactor - (xOffset * xOffset) * (0.008 / scaleFactor) + lookY * 0.15;
        } else if (idx < 240) {
          // --- DEVIL (Left Peeking) ---
          const dIdx = idx - 180;
          if (dIdx < 25) {
            // Outline
            const angle = (dIdx / 25) * Math.PI * 2;
            tx = dcx + Math.cos(angle) * 55 * scaleFactor;
            ty = dcy + Math.sin(angle) * 55 * scaleFactor;
          } else if (dIdx < 32) {
            // Left Horn
            const progress = (dIdx - 25) / 6;
            tx = dcx - (18 + progress * 14) * scaleFactor;
            ty = dcy - (48 + progress * 18) * scaleFactor;
          } else if (dIdx < 39) {
            // Right Horn
            const progress = (dIdx - 32) / 6;
            tx = dcx + (18 + progress * 14) * scaleFactor;
            ty = dcy - (48 + progress * 18) * scaleFactor;
          } else if (dIdx < 44) {
            // Left Eye (slanted /)
            const progress = (dIdx - 39) / 4;
            tx = dcx + (-22 + progress * 11) * scaleFactor;
            ty = dcy - (5 + progress * 7) * scaleFactor;
          } else if (dIdx < 49) {
            // Right Eye (slanted \)
            const progress = (dIdx - 44) / 4;
            tx = dcx + (11 + progress * 11) * scaleFactor;
            ty = dcy + (-12 + progress * 7) * scaleFactor;
          } else {
            // Smirk Mouth
            const progress = (dIdx - 49) / 10;
            const xOffset = (-18 + progress * 36) * scaleFactor;
            tx = dcx + xOffset;
            ty = dcy + 16 * scaleFactor + (xOffset * xOffset) * (0.008 / scaleFactor);
          }
        } else {
          // --- ANGEL (Right Peeking) ---
          const aIdx = idx - 240;
          if (aIdx < 25) {
            // Outline
            const angle = (aIdx / 25) * Math.PI * 2;
            tx = acx + Math.cos(angle) * 55 * scaleFactor;
            ty = acy + Math.sin(angle) * 55 * scaleFactor;
          } else if (aIdx < 40) {
            // Halo ring peeking
            const angle = ((aIdx - 25) / 15) * Math.PI * 2;
            tx = acx + Math.cos(angle) * 25 * scaleFactor;
            ty = acy - 72 * scaleFactor + Math.sin(angle) * 5 * scaleFactor;
          } else if (aIdx < 45) {
            // Left Eye peeking (Happy Arch ^)
            const progress = (aIdx - 40) / 4;
            const angle = Math.PI + progress * Math.PI;
            tx = acx - 18 * scaleFactor + Math.cos(angle) * 8 * scaleFactor;
            ty = acy - 10 * scaleFactor + Math.sin(angle) * 5 * scaleFactor;
          } else if (aIdx < 50) {
            // Right Eye
            const progress = (aIdx - 45) / 4;
            const angle = Math.PI + progress * Math.PI;
            tx = acx + 18 * scaleFactor + Math.cos(angle) * 8 * scaleFactor;
            ty = acy - 10 * scaleFactor + Math.sin(angle) * 5 * scaleFactor;
          } else {
            // Smiling Mouth
            const progress = (aIdx - 50) / 9;
            const xOffset = (-18 + progress * 36) * scaleFactor;
            tx = acx + xOffset;
            ty = acy + 15 * scaleFactor + (xOffset * xOffset) * (0.01 / scaleFactor);
          }
        }
      } else {
        // --- NORMAL / HAPPY COMPLEMENT ---
        if (idx < 150) {
          // Head outline (Pro Squircle n=3.2)
          const angle = (idx / 150) * Math.PI * 2;
          const w = 240 * scaleFactor;
          const h = 180 * scaleFactor;
          const n = 3.2;
          const cos = Math.cos(angle);
          const sin = Math.sin(angle);
          const sx = Math.sign(cos) * Math.pow(Math.abs(cos), 2 / n);
          const sy = Math.sign(sin) * Math.pow(Math.abs(sin), 2 / n);

          tx = width / 2 + sx * w + lookX * 0.2;
          ty = height / 2 + sy * h + lookY * 0.2;
        } else if (idx < 200) {
          // Left Eye
          const eyeCX = width / 2 - 80 * scaleFactor + lookX;
          const eyeCY = height / 2 - 25 * scaleFactor + lookY;

          if (isHappy) {
            const progress = (idx - 150) / 49;
            const angle = Math.PI + progress * Math.PI;
            tx = eyeCX + Math.cos(angle) * 20 * scaleFactor;
            ty = eyeCY + 5 * scaleFactor + Math.sin(angle) * 12 * scaleFactor;
          } else {
            const angle = ((idx - 150) / 50) * Math.PI * 2;
            const r = 24 * scaleFactor;
            let yScale = 1.0;
            if (isBlinking || (winkTimer > 0 && winkingEye === 'left')) {
              yScale = 0.1;
            }
            tx = eyeCX + Math.cos(angle) * r;
            ty = eyeCY + Math.sin(angle) * r * yScale;
          }
        } else if (idx < 250) {
          // Right Eye
          const eyeCX = width / 2 + 80 * scaleFactor + lookX;
          const eyeCY = height / 2 - 25 * scaleFactor + lookY;

          if (isHappy) {
            const progress = (idx - 200) / 49;
            const angle = Math.PI + progress * Math.PI;
            tx = eyeCX + Math.cos(angle) * 20 * scaleFactor;
            ty = eyeCY + 5 * scaleFactor + Math.sin(angle) * 12 * scaleFactor;
          } else {
            const angle = ((idx - 200) / 50) * Math.PI * 2;
            const r = 24 * scaleFactor;
            let yScale = 1.0;
            if (isBlinking || (winkTimer > 0 && winkingEye === 'right')) {
              yScale = 0.1;
            }
            tx = eyeCX + Math.cos(angle) * r;
            ty = eyeCY + Math.sin(angle) * r * yScale;
          }
        } else {
          // Neutral simple smile mouth line
          const progress = (idx - 250) / 49;
          const mouthW = 100 * scaleFactor;
          const xOffset = -mouthW / 2 + progress * mouthW;
          const yOffset = 42 * scaleFactor + (xOffset * xOffset) * (0.0028 / scaleFactor);
          tx = width / 2 + xOffset + lookX * 0.4;
          ty = height / 2 + yOffset + lookY * 0.4;
        }
      }

      p.vx = (p.vx + (tx - p.x) * 0.075) * 0.82;
      p.vy = (p.vy + (ty - p.y) * 0.075) * 0.82;
      limitSpeed(p, 6.0);
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
    if (activeMorph) {
      drawSize = p.size * 2.2 * currentSizeMultiplier;
    } else if (currentSectionMode === 'racing' && p.raceBoost > 0) {
      drawSize = p.size * 1.8 * currentSizeMultiplier;
    }

    let drawColor = p.color;
    if (currentSectionMode === 'robot') {
      if (isAnnoyed) {
        if (idx >= 180 && idx < 240) {
          drawColor = 'rgba(239, 68, 68, 0.95)'; // Devil Red
        } else if (idx >= 240) {
          drawColor = 'rgba(251, 191, 36, 0.95)'; // Angel Gold
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

    if (thanksTimer > 0) {
      thanksTimer--;
    }

    const dcy = height / 2;
    const acy = height / 2;

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

      particles.forEach((p, idx) => {
        p.angle += p.rotationSpeed;

        const isStructured = currentSectionMode === 'robot' ||
                            (currentSectionMode === 'bento' && hoveredBentoTile) ||
                            (currentSectionMode === 'heart' && focusedInput);

        if (!isStructured) {
          applyCursorRepulsion(p);
        }
        drawParticle(p, idx);
      });

      // Draw constellation grid lines
      if (currentSectionMode === 'constellation') {
        ctx.lineWidth = 0.6;
        for (let i = 0; i < particles.length; i++) {
          const p1 = particles[i];
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 85) {
              const alpha = ((85 - dist) / 85) * 0.26;
              ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      }
    }

    // Render cyber-styled speech bubble when hit/annoyed in robot mode
    const showBubble = isAnnoyed || (thanksTimer > 0);
    if (currentSectionMode === 'robot' && showBubble && activeQuote) {
      ctx.save();
      const fontSize = Math.max(10, Math.round(16 * scaleFactor));
      ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`;
      const textWidth = ctx.measureText(activeQuote).width;
      const padX = 16 * scaleFactor;
      const padY = 8 * scaleFactor;
      const bw = textWidth + padX * 2;
      const bh = 32 * scaleFactor;
      const bx = width / 2 - bw / 2;
      const currentH = (isAnnoyed ? 125 : 180) * scaleFactor;
      const by = height / 2 - currentH - bh - 16 * scaleFactor; // Stays perfectly above the head!

      // Semi-transparent dark glass backing
      ctx.fillStyle = 'rgba(15, 15, 25, 0.9)';
      ctx.strokeStyle = isAnnoyed ? 'rgba(244, 63, 94, 0.6)' : 'rgba(16, 185, 129, 0.6)';
      ctx.lineWidth = 1.5;
      
      drawRoundedRect(ctx, bx, by, bw, bh, 6);
      ctx.fill();
      ctx.stroke();

      // Pointy arrow pointing down
      ctx.beginPath();
      ctx.moveTo(width / 2 - 8 * scaleFactor, by + bh);
      ctx.lineTo(width / 2, by + bh + 8 * scaleFactor);
      ctx.lineTo(width / 2 + 8 * scaleFactor, by + bh);
      ctx.closePath();
      ctx.fillStyle = 'rgba(15, 15, 25, 0.9)';
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(width / 2 - 8 * scaleFactor, by + bh);
      ctx.lineTo(width / 2, by + bh + 8 * scaleFactor);
      ctx.lineTo(width / 2 + 8 * scaleFactor, by + bh);
      ctx.stroke();

      // Sleek text rendering
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(activeQuote, width / 2, by + bh / 2);
      ctx.restore();
    }

    // Render side bubbles for Devil & Angel peeking at window borders
    if (currentSectionMode === 'robot' && isAnnoyed) {
      // 1. Devil speech bubble (Left side peeking border, 20px offset)
      if (activeDevilQuote) {
        ctx.save();
        const fontSize = Math.max(9, Math.round(13 * scaleFactor));
        ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`;
        const textWidth = ctx.measureText(activeDevilQuote).width;
        const bw = textWidth + 20 * scaleFactor;
        const bh = 26 * scaleFactor;
        const bx = dcx; // Dynamically placed at Devil's center x (20 * scaleFactor)
        const by = dcy - 110 * scaleFactor;

        ctx.fillStyle = 'rgba(20, 10, 10, 0.9)';
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
        ctx.lineWidth = 1.5;
        drawRoundedRect(ctx, bx, by, bw, bh, 5);
        ctx.fill();
        ctx.stroke();

        // Pointy arrow towards left border peeker
        ctx.beginPath();
        ctx.moveTo(bx + 15 * scaleFactor, by + bh);
        ctx.lineTo(bx + 5 * scaleFactor, by + bh + 8 * scaleFactor);
        ctx.lineTo(bx + 25 * scaleFactor, by + bh);
        ctx.closePath();
        ctx.fillStyle = 'rgba(20, 10, 10, 0.9)';
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(activeDevilQuote, bx + bw / 2, by + bh / 2);
        ctx.restore();
      }

      // 2. Angel speech bubble (Right side peeking border, 20px offset)
      if (activeAngelQuote) {
        ctx.save();
        const fontSize = Math.max(9, Math.round(13 * scaleFactor));
        ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`;
        const textWidth = ctx.measureText(activeAngelQuote).width;
        const bw = textWidth + 20 * scaleFactor;
        const bh = 26 * scaleFactor;
        const bx = acx - bw; // Dynamically placed relative to Angel's center x
        const by = acy - 110 * scaleFactor;

        ctx.fillStyle = 'rgba(10, 15, 20, 0.9)';
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)';
        ctx.lineWidth = 1.5;
        drawRoundedRect(ctx, bx, by, bw, bh, 5);
        ctx.fill();
        ctx.stroke();

        // Pointy arrow towards right border peeker
        ctx.beginPath();
        ctx.moveTo(bx + bw - 25 * scaleFactor, by + bh);
        ctx.lineTo(bx + bw - 5 * scaleFactor, by + bh + 8 * scaleFactor);
        ctx.lineTo(bx + bw - 15 * scaleFactor, by + bh);
        ctx.closePath();
        ctx.fillStyle = 'rgba(10, 15, 20, 0.9)';
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(activeAngelQuote, bx + bw / 2, by + bh / 2);
        ctx.restore();
      }
    }

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
      const dx = e.clientX - width / 2;
      const dy = e.clientY - height / 2;
      const dist = Math.hypot(dx, dy);
      
      // Hit checking
      const hitRadius = isAnnoyed ? 155 : 220;
      if (dist < hitRadius) {
        isAnnoyed = true; // Stays annoyed until apology typed
        activeQuote = ANNOYED_QUOTES[Math.floor(Math.random() * ANNOYED_QUOTES.length)];
        activeDevilQuote = DEVIL_QUOTES[Math.floor(Math.random() * DEVIL_QUOTES.length)];
        activeAngelQuote = ANGEL_QUOTES[Math.floor(Math.random() * ANGEL_QUOTES.length)];

        // Shake particles
        particles.forEach(p => {
          const pdx = p.x - e.clientX;
          const pdy = p.y - e.clientY;
          const pdist = Math.hypot(pdx, pdy) || 1;
          if (pdist < 220) {
            p.vx += (pdx / pdist) * randomBetween(3, 6);
            p.vy += (pdy / pdist) * randomBetween(3, 6);
          }
        });
      } else {
        // Normal wink on click outside head bounds
        winkTimer = 25;
        winkingEye = Math.random() > 0.5 ? 'left' : 'right';
      }
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

  // Keyboard easter egg: type 'sorry' to clear robot annoyance
  function handleKeyDown(e) {
    if (currentSectionMode !== 'robot' || !isAnnoyed) return;
    
    // Ignore input text areas or form fields
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;

    if (e.key && e.key.length === 1) {
      typedKeys = (typedKeys + e.key.toLowerCase()).slice(-5);
      if (typedKeys === 'sorry') {
        isAnnoyed = false;
        thanksTimer = 120; // 2 seconds of happy reaction
        activeQuote = "Apology accepted! 😊";
        typedKeys = '';
      }
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
    currentSectionMode = mode;
    currentSpeedLimit = speed;
    currentSizeMultiplier = sizeMultiplier;

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
  window.addEventListener('keydown', handleKeyDown);
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
    window.removeEventListener('keydown', handleKeyDown);
    scrollTriggers.forEach(t => t.kill());
  };
}
