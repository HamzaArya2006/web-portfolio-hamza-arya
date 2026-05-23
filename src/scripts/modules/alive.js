import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initCustomCursor } from './cursor.js';

gsap.registerPlugin(ScrollTrigger);

const ALIVE_BOUND = Symbol('aliveMotionBound');

export function initAliveMotion(options = {}) {
  const perfLite = options.perfLite || false;
  if (document.body[ALIVE_BOUND]) return;
  document.body[ALIVE_BOUND] = true;

  // Add active JS class for layouts
  document.documentElement.classList.add('js-active');

  // Defer slightly to ensure DOM is ready
  setTimeout(() => {
    initHeroAnimations({ perfLite });
    initStorySequence({ perfLite });
    initServicesAnimation({ perfLite });
    initAboutAnimation({ perfLite });
    initProjectsAnimation({ perfLite });
    initMagneticButtons({ perfLite });
    initCustomCursor();
    // createScrollMeter({ perfLite }); // Removed per user request
    bindSceneSections();
    bindProjectChapters();
  }, 100);
}

export function refreshAliveMotion() {
  setTimeout(() => {
    ScrollTrigger.refresh();
    bindProjectChapters();
  }, 100);
}

function initHeroAnimations({ perfLite = false } = {}) {
  const heroTitleLines = document.querySelectorAll('.clip-text-reveal');
  const heroItems = document.querySelectorAll('.gsap-hero-item');
  const heroScroll = document.querySelector('.gsap-hero-scroll');
  const heroGlows = document.querySelectorAll('.hero-glow');

  const tl = gsap.timeline();

  if (heroTitleLines.length) {
    tl.fromTo(heroTitleLines,
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, stagger: 0.2, ease: 'power4.out', delay: 0.2 }
    );
  }

  if (heroItems.length) {
    tl.fromTo(heroItems,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out' },
      "-=0.8"
    );
  }

  if (heroScroll) {
    tl.fromTo(heroScroll,
      { opacity: 0 },
      { opacity: 1, duration: 1 },
      "-=0.5"
    );
  }

  if (perfLite) return;

  // Hero Parallax on Scroll (Animate inner container, leaving section flow layout static)
  const heroSection = document.querySelector('.gsap-hero');
  const heroContainer = heroSection ? heroSection.querySelector('.container-pro') : null;
  if (heroSection && heroContainer) {
    gsap.to(heroContainer, {
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      },
      y: 100,
      opacity: 0.15,
      ease: 'none'
    });
  }

  // Ambient glow floating
  if (heroGlows.length) {
    heroGlows.forEach((glow) => {
      gsap.to(glow, {
        x: () => Math.random() * 100 - 50,
        y: () => Math.random() * 100 - 50,
        rotation: () => Math.random() * 360,
        duration: 10 + Math.random() * 10,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    });

    // Mouse tracking for glows
    if (heroSection) {
      heroSection.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth - 0.5) * 100;
        const yPos = (clientY / window.innerHeight - 0.5) * 100;

        gsap.to(heroGlows[0], { x: xPos * 2, y: yPos * 2, duration: 2, ease: 'power2.out' });
        if (heroGlows[1]) gsap.to(heroGlows[1], { x: -xPos * 2, y: -yPos * 2, duration: 2.5, ease: 'power2.out' });
      });
    }
  }
}

function initStorySequence({ perfLite = false } = {}) {
  const storyContainer = document.querySelector('.gsap-story-section');
  const cards = document.querySelectorAll('.gsap-card');
  const textGroup = document.querySelector('.gsap-story-text');

  if (!storyContainer || cards.length === 0) return;

  if (perfLite) {
    gsap.fromTo(cards,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: storyContainer,
          start: "top 75%",
          toggleActions: "play none none reverse"
        }
      }
    );
    return;
  }

  // Setup initial states in 3D depth stack spacing safely
  gsap.set(cards, { transformPerspective: 1000, force3D: true });
  if (cards[0]) gsap.set(cards[0], { x: 0, yPercent: 0, z: 0, opacity: 1, scale: 1, rotate: 0 });
  if (cards[1]) gsap.set(cards[1], { x: 0, yPercent: 8, z: -80, opacity: 0.6, scale: 0.94, rotate: 0 });
  if (cards[2]) gsap.set(cards[2], { x: 0, yPercent: 16, z: -160, opacity: 0.3, scale: 0.88, rotate: 0 });

  // Unified ScrollTrigger timeline for rock-solid pinning & animation synchronization
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: storyContainer,
      start: 'top top',
      end: '+=250%',
      pin: true,
      scrub: true,
      anticipatePin: 1
    }
  });

  if (cards.length >= 3) {
    // Card 0 swipes left (off screen) and Card 1 & 2 step forward
    tl.to(cards[0], { xPercent: -120, rotate: -8, opacity: 0, scale: 0.9, duration: 1.2, ease: "power2.inOut" })
      .to(cards[1], { yPercent: 0, z: 0, opacity: 1, scale: 1, duration: 1.2, ease: "power2.inOut" }, "<")
      .to(cards[2], { yPercent: 8, z: -80, opacity: 0.6, scale: 0.94, duration: 1.2, ease: "power2.inOut" }, "<")
      
    // Card 1 swipes right (off screen) and Card 2 steps forward
      .to(cards[1], { xPercent: 120, rotate: 8, opacity: 0, scale: 0.9, duration: 1.2, ease: "power2.inOut" }, "+=0.3")
      .to(cards[2], { yPercent: 0, z: 0, opacity: 1, scale: 1, duration: 1.2, ease: "power2.inOut" }, "<");
  }

  // Parallax the text slightly
  tl.to(textGroup, { y: -45, duration: tl.duration() }, 0);

  // Appended timeline pause for dead-scroll buffer, allowing user to view last state before unpinning
  tl.to({}, { duration: 0.8 });
}

function initServicesAnimation({ perfLite = false } = {}) {
  const section = document.querySelector('.gsap-services-section');
  const container = document.querySelector('.gsap-services-container');
  const cards = gsap.utils.toArray('.gsap-services-container .service-card');
  const textGroup = document.querySelector('.gsap-services-text');

  if (!section || !container || !cards.length) return;

  if (perfLite || window.innerWidth < 1024) {
    gsap.fromTo(cards,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );
    return;
  }

  // Setup initial states for absolute cards in 3D depth stack
  gsap.set(cards, { transformPerspective: 1000, force3D: true });
  cards.forEach((card, i) => {
    if (i === 0) {
      gsap.set(card, { x: 0, yPercent: 0, z: 0, opacity: 1, scale: 1, rotate: 0 });
    } else if (i === 1) {
      gsap.set(card, { x: 0, yPercent: 6, z: -40, opacity: 0.7, scale: 0.96, rotate: 0 });
    } else if (i === 2) {
      gsap.set(card, { x: 0, yPercent: 12, z: -80, opacity: 0.35, scale: 0.92, rotate: 0 });
    } else {
      gsap.set(card, { x: 0, yPercent: 18, z: -120, opacity: 0, scale: 0.88, rotate: 0 });
    }
  });

  // Unified ScrollTrigger timeline for pinning
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: '+=450%', // optimized duration
      pin: true,
      scrub: true,
      anticipatePin: 1
    }
  });

  if (cards.length > 1) {
    for (let i = 0; i < cards.length - 1; i++) {
      const timeOffset = i === 0 ? 0 : "+=0.3";
      const swipeDir = i % 2 === 0 ? -120 : 120;
      const rotateAngle = i % 2 === 0 ? -6 : 6;

      // Swipe current card
      tl.to(cards[i], { xPercent: swipeDir, rotate: rotateAngle, opacity: 0, scale: 0.9, duration: 1.2, ease: "power2.inOut" }, timeOffset);

      // Step up next card
      tl.to(cards[i + 1], { yPercent: 0, z: 0, opacity: 1, scale: 1, duration: 1.2, ease: "power2.inOut" }, "<");

      // Step up second next card
      if (i + 2 < cards.length) {
        tl.to(cards[i + 2], { yPercent: 6, z: -40, opacity: 0.7, scale: 0.96, duration: 1.2, ease: "power2.inOut" }, "<");
      }

      // Reveal third next card in background
      if (i + 3 < cards.length) {
        tl.to(cards[i + 3], { yPercent: 12, z: -80, opacity: 0.35, scale: 0.92, duration: 1.2, ease: "power2.inOut" }, "<");
      }
    }
  }

  // Parallax the text slightly
  if (textGroup) {
    tl.to(textGroup, { y: -45, duration: tl.duration() }, 0);
  }

  // Appended timeline pause for dead-scroll buffer
  tl.to({}, { duration: 0.8 });
}

function initAboutAnimation({ perfLite = false } = {}) {
  const section = document.querySelector('.gsap-about-section');
  const left = document.querySelector('.gsap-about-left');
  const bento = document.querySelector('.bento-grid');
  const textElem = left ? left.querySelector('.gsap-about-text') : null;

  const tiles = bento ? bento.querySelectorAll('.bento-tile') : [];

  if (!section || !left) return;

  // Split text into spans for scrubbing
  let spans = [];
  if (textElem) {
    const words = textElem.innerText.split(' ');
    textElem.innerHTML = '';
    words.forEach(word => {
      const span = document.createElement('span');
      span.innerText = word + ' ';
      textElem.appendChild(span);
    });
    spans = textElem.querySelectorAll('span');
  }

  const isDesktop = window.innerWidth >= 1024;

  if (perfLite || !isDesktop) {
    // Fallback: simple fade in
    if (spans.length) {
      gsap.fromTo(spans,
        { color: "rgba(255,255,255,0.25)" },
        {
          color: "rgba(255,255,255,1)",
          stagger: 0.05,
          duration: 1,
          scrollTrigger: {
            trigger: textElem,
            start: "top 80%",
            end: "bottom 50%",
            scrub: true
          }
        }
      );
    }
    if (tiles.length) {
      gsap.fromTo(tiles,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          scrollTrigger: {
            trigger: bento,
            start: "top 75%"
          }
        }
      );
    }
    return;
  }

  // Full desktop animation with pinning
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "+=250%",
      pin: true,
      scrub: true,
      anticipatePin: 1
    }
  });

  if (spans.length) {
    tl.fromTo(spans,
      { color: "rgba(255,255,255,0.25)" },
      { color: "rgba(255,255,255,1)", stagger: 0.05, duration: 1.2, ease: "none" },
      0
    );
  }

  if (tiles.length) {
    tl.fromTo(tiles,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.7, ease: "power2.out", stagger: 0.15 },
      "+=0.3"
    );
  }

  // Buffer to avoid jitter at end
  tl.to({}, { duration: 0.8 });
}













function initProjectsAnimation({ perfLite = false } = {}) {
  const section = document.querySelector('.gsap-projects-section');
  const wrapper = document.querySelector('.gsap-projects-wrapper');
  const left = document.querySelector('.gsap-projects-left');
  const cards = gsap.utils.toArray('.gsap-project-card');

  if (!section || !wrapper || !cards.length) return;

  const isDesktop = window.innerWidth >= 1024;

  if (perfLite || !isDesktop) {
    // Lite mode fallback: sequential fade-in
    gsap.fromTo(cards,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: wrapper,
          start: "top 75%"
        }
      }
    );
    return;
  }

  // Set initial states for project cards
  cards.forEach((card, idx) => {
    if (idx === 0) {
      gsap.set(card, { y: 0, opacity: 1, scale: 1, z: 0, rotateX: 0, transformOrigin: "50% 50%" });
    } else {
      gsap.set(card, { yPercent: 120, opacity: 0, scale: 0.95, rotateX: 5, z: 0, transformOrigin: "50% 50%" });
    }
  });

  // Pin section and stack
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "+=220%",
      pin: true,
      scrub: true, // Silk smooth scrub
      anticipatePin: 1
    }
  });

  // Fade out left column slightly at the end
  if (left) {
    tl.to(left, { opacity: 0.4, y: -20, duration: 1 }, "+=0.8");
  }

  // Stack cards sequence with smooth in/out easing
  for (let i = 1; i < cards.length; i++) {
    const cardTime = (i - 1) * 1.2;

    // Slide up Card i to cover
    tl.to(cards[i], {
      yPercent: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      rotateX: 0,
      z: 0,
      duration: 1.2,
      ease: "power1.inOut"
    }, cardTime);

    // Simultaneously push back previous cards
    for (let j = 0; j < i; j++) {
      const factor = i - j;
      const yTarget = -factor * 20;
      const scaleTarget = 1 - factor * 0.03;
      const zTarget = -factor * 40;
      const opacityTarget = 1 - factor * 0.25;

      tl.to(cards[j], {
        y: yTarget,
        scale: scaleTarget,
        z: zTarget,
        opacity: opacityTarget,
        duration: 1.2,
        ease: "power1.inOut"
      }, cardTime);
    }
  }

  // Appended timeline pause for dead-scroll buffer
  tl.to({}, { duration: 0.8 });
}


function initMagneticButtons({ perfLite = false } = {}) {
  if (perfLite) return;
  const magnets = document.querySelectorAll('.magnetic-btn');
  magnets.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(btn, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.6,
        ease: 'power3.out'
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.3)'
      });
    });
  });
}

function createScrollMeter({ perfLite = false } = {}) {
  if (perfLite) return;
  if (document.querySelector('.motion-progress')) return;
  const meter = document.createElement('div');
  meter.className = 'motion-progress';
  meter.setAttribute('aria-hidden', 'true');
  document.body.appendChild(meter);

  // Use ScrollTrigger to update progress meter
  gsap.to(meter, {
    scrollTrigger: {
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        meter.style.setProperty('--scroll-progress', self.progress);
      }
    }
  });
}

function bindSceneSections() {
  const scenes = gsap.utils.toArray('[data-scene]');
  scenes.forEach(scene => {
    ScrollTrigger.create({
      trigger: scene,
      start: "top 60%",
      onEnter: () => scene.classList.add('scene-active'),
      onLeaveBack: () => scene.classList.remove('scene-active')
    });
  });
}

function bindProjectChapters() {
  const chapters = gsap.utils.toArray('[data-project-chapter]');
  chapters.forEach(chapter => {
    if (chapter.dataset.stBound) return;
    chapter.dataset.stBound = 'true';
    ScrollTrigger.create({
      trigger: chapter,
      start: "top 80%",
      onEnter: () => chapter.classList.add('is-active'),
      onLeaveBack: () => chapter.classList.remove('is-active')
    });
  });
}
