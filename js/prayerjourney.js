'use strict';
const hamburger     = document.getElementById('hamburger');
const mobileMenu    = document.getElementById('mobileMenu');
const mobileBackdrop= document.getElementById('mobileBackdrop');

function openMobileMenu() {
  hamburger.classList.add('open');
  mobileMenu.style.display = 'block';
  mobileBackdrop.classList.add('open');
  // Small tick to trigger CSS transition
  requestAnimationFrame(() => {
    requestAnimationFrame(() => mobileMenu.classList.add('open'));
  });
}

function closeMobileMenu() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  mobileBackdrop.classList.remove('open');
  // Wait for transition before hiding completely
  mobileMenu.addEventListener('transitionend', () => {
    if (!mobileMenu.classList.contains('open')) {
      mobileMenu.style.display = 'none';
    }
  }, { once: true });
}

hamburger.addEventListener('click', () => {
  if (mobileMenu.classList.contains('open')) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
});

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMobileMenu();
});

// Close when window resizes back to desktop
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) closeMobileMenu();
});


/* ════════════════════════════════════════
   2. SVG JOURNEY PATH
   Draws a snake/zigzag dashed path through
   all the status circles, exactly like the
   original design.
════════════════════════════════════════ */
function drawJourneyPath() {
  const journey = document.getElementById('journey');
  const svgEl   = document.getElementById('journeyPath');
  const steps   = [...document.querySelectorAll('.step')];
  const firstSheikh = document.getElementById('firstSheikh');
  if (!steps.length) return;

  const jRect = journey.getBoundingClientRect();
  const W = journey.offsetWidth;
  const H = journey.scrollHeight;

  // نقطة البداية من الشيخ الأول
  const fsRect = firstSheikh.getBoundingClientRect();
  const startPt = {
    x: fsRect.left - jRect.left + fsRect.width / 2,
    y: fsRect.top  - jRect.top  + fsRect.height,
  };

  // باقي النقاط من الدوائر
  const circlePts = steps.map(step => {
    const circle = step.querySelector('.status-circle');
    const r = circle.getBoundingClientRect();
    return {
      x: r.left - jRect.left + r.width  / 2,
      y: r.top  - jRect.top  + r.height / 2,
    };
  });

  const pts = [startPt, ...circlePts];

  // نفس كود رسم المسار الموجود عندك
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i], p1 = pts[i + 1];
    const midY = (p0.y + p1.y) / 2;
    d += ` C ${p0.x.toFixed(1)} ${midY.toFixed(1)},`
       +   ` ${p1.x.toFixed(1)} ${midY.toFixed(1)},`
       +   ` ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
  }

  svgEl.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svgEl.setAttribute('width',  W);
  svgEl.setAttribute('height', H);

  svgEl.innerHTML = `
    <path d="${d}" fill="none" stroke="#a0956e"
      stroke-width="2.5" stroke-dasharray="10 8"
      stroke-linecap="round" opacity="0.7"/>`;
}

// Draw once fonts/layout are ready, redraw on resize
window.addEventListener('load',   drawJourneyPath);
window.addEventListener('resize', drawJourneyPath);
// Also redraw after a short delay in case webfonts shift layout
setTimeout(drawJourneyPath, 500);


/* ════════════════════════════════════════
   3. DETAIL OVERLAY
════════════════════════════════════════ */
const overlay     = document.getElementById('detailOverlay');
const detailClose = document.getElementById('detailClose');
const detailNum   = document.getElementById('detailNum');
const detailTitle = document.getElementById('detailTitle');
const detailDesc  = document.getElementById('detailDesc');
const detailBegin = document.getElementById('detailBegin');

// Open overlay when a non-locked step-card is clicked
document.querySelectorAll('.step-card').forEach(card => {

  card.addEventListener('click', e => {

    const step = card.closest('.step');
    const status = step.dataset.status;

    // فقط المراحل المقفلة
    if(status === 'locked'){
      e.preventDefault();
      return;
    }

    // Step 1 يفتح lesson1 مباشرة
    if(step.dataset.step === "1"){
      return;
    }

    // باقي المراحل تفتح الـ Overlay
    e.preventDefault();

    detailNum.textContent =
    `Step ${step.dataset.step}`;

    detailTitle.textContent =
    step.dataset.title;

    detailDesc.textContent =
    step.dataset.desc;

    detailBegin.textContent =
    status === 'done'
      ? 'Review Lesson →'
      : 'Begin Lesson →';

    overlay.classList.add('open');

    document.body.style.overflow =
    'hidden';

  });

});

function closeOverlay() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

detailClose.addEventListener('click', closeOverlay);
overlay.addEventListener('click', e => {
  if (e.target === overlay) closeOverlay();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeOverlay();
});

// Begin button — navigate to lesson page
detailBegin.addEventListener('click', () => {

  const stepNumber =
  detailNum.textContent.replace("Step ","");

  if(stepNumber === "1"){
      window.location.href =
      "lesson1.html";
      return;
  }

  if(stepNumber === "2"){
      window.location.href =
      "lesson2.html";
      return;
  }

});

/* ==================================
   LEVEL UNLOCK SYSTEM
================================== */

document.addEventListener("DOMContentLoaded", () => {

    const steps =
    document.querySelectorAll(".step");

    steps.forEach(step => {

        const level =
        parseInt(step.dataset.step);

        if(level === 1) return;

        const previousPassed =
        localStorage.getItem(
            `level${level-1}Passed`
        );

        if(previousPassed === "true"){

            step.dataset.status =
            "inprogress";

            step.classList.remove(
                "locked-step"
            );

            const circle =
            step.querySelector(
                ".status-circle"
            );

            if(circle){

                circle.classList.remove(
                    "locked"
                );

                circle.classList.add(
                    "inprogress"
                );

            }

        }

    });

});