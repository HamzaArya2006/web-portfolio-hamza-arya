const fs = require('fs');

let content = fs.readFileSync('src/scripts/modules/hero-particles.js', 'utf8');

// 1. Update COLORS
content = content.replace(
  "const COLORS = [\n  'rgba(59, 130, 246, 0.75)',\n  'rgba(99, 102, 241, 0.75)',\n  'rgba(168, 85, 247, 0.65)',\n  'rgba(255, 255, 255, 0.65)'\n];",
  `const COLORS_DARK = [
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
];`
);

// 2. Add isLightMode helper
content = content.replace(
  "canvas.style.display = '';\n\n  const ctx = canvas.getContext('2d');",
  "canvas.style.display = '';\n\n  const isLightMode = () => document.documentElement.classList.contains('light') || document.documentElement.getAttribute('data-theme') === 'light';\n\n  const ctx = canvas.getContext('2d');"
);

// 3. Add colorIndex
content = content.replace(
  "type: TYPES[Math.floor(Math.random() * TYPES.length)],\n        color: COLORS[Math.floor(Math.random() * COLORS.length)],",
  "type: TYPES[Math.floor(Math.random() * TYPES.length)],\n        colorIndex: Math.floor(Math.random() * 4),"
);

// 4. Replace drawColor in drawParticle
content = content.replace(
  "let drawColor = p.color;",
  "const isLight = isLightMode();\n    let drawColor = isLight ? COLORS_LIGHT[p.colorIndex] : COLORS_DARK[p.colorIndex];"
);

// 5. Fix robot color references in drawParticle
content = content.replace(
  /drawColor = `rgba\(56, 189, 248, \$\{irisBrightness\}\)`;/g,
  "drawColor = isLight ? `rgba(14, 165, 233, ${irisBrightness})` : `rgba(56, 189, 248, ${irisBrightness})`;"
);
content = content.replace(
  "drawColor = 'rgba(220, 245, 255, 0.98)';",
  "drawColor = isLight ? 'rgba(15, 23, 42, 0.9)' : 'rgba(220, 245, 255, 0.98)';"
);
content = content.replace(
  "drawColor = `rgba(14, 100, 180, ${alpha * 0.5})`;",
  "drawColor = isLight ? `rgba(30, 64, 175, ${alpha * 0.5})` : `rgba(14, 100, 180, ${alpha * 0.5})`;"
);
content = content.replace(
  "? `rgba(168, 85, 247, ${alpha})`\n            : `rgba(56, 189, 248, ${alpha})`;",
  "? (isLight ? `rgba(126, 34, 206, ${alpha})` : `rgba(168, 85, 247, ${alpha})`)\n            : (isLight ? `rgba(14, 165, 233, ${alpha})` : `rgba(56, 189, 248, ${alpha})`);"
);
content = content.replace(
  "? `rgba(99, 179, 255, ${alpha})`\n            : `rgba(14, 165, 233, ${alpha})`;",
  "? (isLight ? `rgba(37, 99, 235, ${alpha})` : `rgba(99, 179, 255, ${alpha})`)\n            : (isLight ? `rgba(2, 132, 199, ${alpha})` : `rgba(14, 165, 233, ${alpha})`);"
);

// Fix glitch colors
content = content.replace(
  "drawColor = `rgba(6, 182, 212, ${0.8 + Math.random() * 0.2})`;",
  "drawColor = isLight ? `rgba(8, 145, 178, ${0.8 + Math.random() * 0.2})` : `rgba(6, 182, 212, ${0.8 + Math.random() * 0.2})`;"
);
content = content.replace(
  "drawColor = `rgba(236, 72, 153, ${0.8 + Math.random() * 0.2})`;",
  "drawColor = isLight ? `rgba(219, 39, 119, ${0.8 + Math.random() * 0.2})` : `rgba(236, 72, 153, ${0.8 + Math.random() * 0.2})`;"
);
content = content.replace(
  "drawColor = `rgba(255,255,255, ${0.5 + Math.random() * 0.5})`;",
  "drawColor = isLight ? `rgba(15, 23, 42, ${0.5 + Math.random() * 0.5})` : `rgba(255,255,255, ${0.5 + Math.random() * 0.5})`;"
);

// Fix fillStyle in animate() for light mode
content = content.replace(
  "const fade = currentSectionMode === 'racing' ? 0.12 : 0.18;\n    ctx.fillStyle = `rgba(0, 0, 0, ${fade})`;\n    ctx.fillRect(0, 0, width, height);",
  "const fade = currentSectionMode === 'racing' ? 0.12 : 0.18;\n    const isLight = isLightMode();\n    ctx.fillStyle = isLight ? `rgba(255, 255, 255, ${fade})` : `rgba(0, 0, 0, ${fade})`;\n    ctx.fillRect(0, 0, width, height);"
);

// 6. Change ROBOT AI to AI CORE Geometry
const robot_state_old = `  // --- ROBOT AI STATE ---
  // Particle allocation for robot mode:
  //   idx   0–29  : left eye  (20 iris + 10 pupil)
  //   idx  30–59  : right eye (20 iris + 10 pupil)
  //   idx  60–299 : body sphere (240 particles)
  const EYE_SIZE = 30;       // particles per eye
  const PUPIL_SIZE = 10;     // first N of each eye = pupil cluster
  const BODY_START = 60;     // body particles begin here
  const BODY_COUNT = particleCount - BODY_START;`;

const aicore_state_new = `  // --- AI CORE STATE ---
  const CORE_SIZE = 60;
  const RING1_SIZE = 60;
  const RING2_SIZE = 60;
  const RING3_SIZE = particleCount - CORE_SIZE - RING1_SIZE - RING2_SIZE;
  // Note: we still use BODY_START for compatibility with connection logic
  const BODY_START = 0;`;

content = content.replace(robot_state_old, aicore_state_new);

const update_robot_old = `    particles.forEach((p, idx) => {
      let tx, ty;

      const isEye = idx < BODY_START;
      const isLeftEye = idx < EYE_SIZE;
      const localIdx = isLeftEye ? idx : idx - EYE_SIZE;
      const isPupil = isEye && localIdx < PUPIL_SIZE;

      if (isEye) {
        // --- Eye geometry ---
        const eyeSide = isLeftEye ? -1 : 1;
        const eyeCX = cx + eyeSide * 65 * scaleFactor;
        const eyeCY = cy - 38 * scaleFactor;

        // Eyes rotate toward look target
        const eyeLeanX = lookNX * 6 * scaleFactor;
        const eyeLeanY = lookNY * 4 * scaleFactor;

        if (isPupil) {
          // Pupil: dense cluster that tracks cursor actively
          const pupilMaxOffset = 10 * scaleFactor;
          const pAngle = (localIdx / PUPIL_SIZE) * TAU;
          const pr = (localIdx / PUPIL_SIZE) * 4 * scaleFactor;
          tx = eyeCX + eyeLeanX + lookNX * pupilMaxOffset + Math.cos(pAngle) * pr;
          ty = eyeCY + eyeLeanY + lookNY * pupilMaxOffset + Math.sin(pAngle) * pr;
        } else {
          // Iris ring — squashes vertically during blink
          const irisIdx = localIdx - PUPIL_SIZE;
          const irisTotal = EYE_SIZE - PUPIL_SIZE;
          const irisAngle = (irisIdx / irisTotal) * TAU;
          const irisR = 20 * scaleFactor;
          tx = eyeCX + eyeLeanX + Math.cos(irisAngle) * irisR;
          ty = eyeCY + eyeLeanY + Math.sin(irisAngle) * irisR * blinkScale;
        }

        // Sleeping: eyes drift slightly closed (downward iris offset)
        if (robotState === 'sleeping') {
          ty += 5 * scaleFactor * (1 - blinkScale);
        }

      } else {
        // --- Fibonacci sphere body ---
        const bodyIdx = idx - BODY_START;
        const phi = Math.acos(1 - 2 * (bodyIdx + 0.5) / BODY_COUNT);
        const theta = Math.PI * (1 + Math.sqrt(5)) * bodyIdx;

        let sx = Math.sin(phi) * Math.cos(theta);
        let sy = Math.cos(phi);
        let sz = Math.sin(phi) * Math.sin(theta);

        // Y rotation (head yaw)
        const sx1 = sx * cosRY - sz * sinRY;
        const sz1 = sx * sinRY + sz * cosRY;
        // X rotation (head pitch)
        const sy1 = sy * cosRX - sz1 * sinRX;
        const sz2 = sy * sinRX + sz1 * cosRX;

        // Store depth for coloring
        particleDepth[idx] = sz2;

        const perspective = 420 / (420 - sz2 * 110);
        tx = cx + sx1 * sphereRadius * perspective;
        ty = cy + sy1 * sphereRadius * perspective;

        // Dwell: body particles slowly orbit toward cursor
        if (dwellStrength > 0 && hasMouse) {
          const dDX = mouse.x - tx;
          const dDY = mouse.y - ty;
          const dDist = Math.hypot(dDX, dDY) + 1;
          const orbitAngle = Math.atan2(dDY, dDX) + Math.PI / 2;
          tx += Math.cos(orbitAngle) * 30 * dwellStrength * (dDist < 120 ? 1 : 0);
          ty += Math.sin(orbitAngle) * 30 * dwellStrength * (dDist < 120 ? 1 : 0);
        }
      }`;

const update_robot_new = `    particles.forEach((p, idx) => {
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
      }`;

content = content.replace(update_robot_old, update_robot_new);

// Fix drawColor logic to remove eye concepts
content = content.replace(
`    // Robot-mode eye particles always draw as filled circles
    const robotEye = currentSectionMode === 'robot' && idx < BODY_START;
    const robotPupil = robotEye && (idx < PUPIL_SIZE || (idx >= EYE_SIZE && idx < EYE_SIZE + PUPIL_SIZE));

    if (robotPupil) {
      // Bright filled circle with soft glow
      ctx.shadowColor = 'rgba(180, 240, 255, 0.9)';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(0, 0, drawSize * 0.7, 0, TAU);
      ctx.fill();
      ctx.shadowBlur = 0;
    } else if (robotEye) {
      // Iris: thin bright stroke circle
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, drawSize * 0.55, 0, TAU);
      ctx.stroke();
    } else if (p.type === 'plus') {`,
`    if (p.type === 'plus') {`
);

// Remove eye specific connection lines
content = content.replace(/ \/\/ Faint glow circle around each eye centre[\s\S]*?\n        \}\);/g, "");

// Replace 'isEye ? 10 : 5.5'
content = content.replace("isEye ? 10 : 5.5", "6.5");
content = content.replace("const spring = isEye ? 0.11 : 0.07;", "const spring = 0.07;");
content = content.replace("const damp = isEye ? 0.78 : 0.83;", "const damp = 0.83;");

// Add dashboard particles export at the end of the file
content += `\n
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
    canvas.style.width = \`\${width}px\`;
    canvas.style.height = \`\${height}px\`;
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
`;

fs.writeFileSync('src/scripts/modules/hero-particles.js', content, 'utf8');
console.log('Patch applied successfully!');
