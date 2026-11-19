// =====================================================
//  NEON DEFENDER - joc arcade amb Canvas i JavaScript
// =====================================================
'use strict';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;

// ---------- Entrada de teclat ----------
const keys = {};
window.addEventListener('keydown', e => {
  keys[e.code] = true;
  if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
});
window.addEventListener('keyup', e => { keys[e.code] = false; });

// ---------- Utilitats ----------
const rand = (min, max) => Math.random() * (max - min) + min;
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

function neonText(text, x, y, size, color, align = 'center') {
  ctx.save();
  ctx.font = `bold ${size}px "Courier New", monospace`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.shadowColor = color;
  ctx.shadowBlur = 16;
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
  ctx.restore();
}

// ---------- Bucle principal ----------
let last = performance.now();

function update(dt) {
  // La lògica del joc s'afegirà als passos següents
}

function draw() {
  ctx.fillStyle = '#05010c';
  ctx.fillRect(0, 0, W, H);
  neonText('NEON DEFENDER', W / 2, H / 2 - 20, 48, '#00f0ff');
  neonText('Pas 1: estructura base preparada', W / 2, H / 2 + 30, 18, '#ff2bd6');
}

function loop(now) {
  const dt = Math.min((now - last) / 1000, 0.05); // segons, limitat per evitar salts
  last = now;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
