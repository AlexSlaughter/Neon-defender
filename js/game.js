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

// ---------- Mode demo (pilot automàtic, ?demo a la URL) ----------
const DEMO = new URLSearchParams(location.search).has('demo');
let demoTime = 0;

function demoPilot(dt) {
  demoTime += dt;
  const targetX = W / 2 + Math.sin(demoTime * 0.9) * (W / 2 - 60);
  keys.ArrowLeft = player.x > targetX + 10;
  keys.ArrowRight = player.x < targetX - 10;
  keys.Space = true;
}

// ---------- Fons d'estrelles amb paral·laxi ----------
const STAR_LAYERS = [
  { count: 70, speed: 30, size: 1, alpha: 0.4 },
  { count: 45, speed: 70, size: 1.6, alpha: 0.7 },
  { count: 20, speed: 140, size: 2.4, alpha: 1 },
];
const stars = [];
STAR_LAYERS.forEach(layer => {
  for (let i = 0; i < layer.count; i++) {
    stars.push({ x: rand(0, W), y: rand(0, H), layer });
  }
});

function updateStars(dt) {
  for (const s of stars) {
    s.y += s.layer.speed * dt;
    if (s.y > H) { s.y = -2; s.x = rand(0, W); }
  }
}

function drawStars() {
  for (const s of stars) {
    ctx.globalAlpha = s.layer.alpha;
    ctx.fillStyle = s.layer.size > 2 ? '#9ff8ff' : '#ffffff';
    ctx.fillRect(s.x, s.y, s.layer.size, s.layer.size * (s.layer.size > 2 ? 3 : 1));
  }
  ctx.globalAlpha = 1;
}

// Graella synthwave en perspectiva a la part inferior
let gridOffset = 0;
function drawGrid(dt) {
  gridOffset = (gridOffset + dt * 40) % 40;
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 43, 214, 0.18)';
  ctx.lineWidth = 1;
  const horizon = H * 0.62;
  for (let i = 0; i < 12; i++) {
    const t = ((i * 40 + gridOffset) / 480);
    const y = horizon + (H - horizon) * t * t;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }
  for (let i = -10; i <= 10; i++) {
    ctx.beginPath();
    ctx.moveTo(W / 2 + i * 20, horizon);
    ctx.lineTo(W / 2 + i * 120, H);
    ctx.stroke();
  }
  ctx.restore();
}

// ---------- Jugador ----------
const player = {
  x: W / 2,
  y: H - 80,
  w: 34,
  h: 38,
  speed: 360,
  tilt: 0,
};

function updatePlayer(dt) {
  let dx = 0, dy = 0;
  if (keys.ArrowLeft || keys.KeyA) dx -= 1;
  if (keys.ArrowRight || keys.KeyD) dx += 1;
  if (keys.ArrowUp || keys.KeyW) dy -= 1;
  if (keys.ArrowDown || keys.KeyS) dy += 1;
  if (dx && dy) { dx *= Math.SQRT1_2; dy *= Math.SQRT1_2; }

  player.x = clamp(player.x + dx * player.speed * dt, player.w / 2, W - player.w / 2);
  player.y = clamp(player.y + dy * player.speed * dt, H * 0.4, H - player.h / 2 - 4);
  // Inclinació suau de la nau quan es mou de costat
  player.tilt += (dx * 0.35 - player.tilt) * Math.min(1, dt * 10);
}

function drawShip(x, y, tilt, color = '#00f0ff') {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(tilt);
  // Flama del motor (parpelleja)
  const flame = 10 + Math.random() * 8;
  ctx.fillStyle = '#ff9a2b';
  ctx.shadowColor = '#ff6a00';
  ctx.shadowBlur = 20;
  ctx.beginPath();
  ctx.moveTo(-6, 14); ctx.lineTo(0, 14 + flame); ctx.lineTo(6, 14);
  ctx.fill();
  // Cos de la nau
  ctx.shadowColor = color;
  ctx.shadowBlur = 18;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.fillStyle = 'rgba(0, 240, 255, 0.12)';
  ctx.beginPath();
  ctx.moveTo(0, -19);
  ctx.lineTo(17, 16);
  ctx.lineTo(6, 10);
  ctx.lineTo(-6, 10);
  ctx.lineTo(-17, 16);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // Cabina
  ctx.fillStyle = '#ff2bd6';
  ctx.shadowColor = '#ff2bd6';
  ctx.beginPath();
  ctx.ellipse(0, -2, 3.5, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// ---------- Projectils ----------
const bullets = [];      // dispars del jugador
const enemyBullets = []; // dispars enemics
let fireCooldown = 0;
const FIRE_RATE = 0.16;  // segons entre dispars

function playerShoot() {
  bullets.push({ x: player.x, y: player.y - 20, vx: 0, vy: -720, r: 3, color: '#00f0ff' });
}

function updateBullets(dt) {
  fireCooldown -= dt;
  if (keys.Space && fireCooldown <= 0) {
    playerShoot();
    fireCooldown = FIRE_RATE;
  }
  for (const list of [bullets, enemyBullets]) {
    for (let i = list.length - 1; i >= 0; i--) {
      const b = list[i];
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      if (b.y < -20 || b.y > H + 20 || b.x < -20 || b.x > W + 20) list.splice(i, 1);
    }
  }
}

function drawBullets() {
  ctx.save();
  ctx.shadowBlur = 14;
  for (const b of bullets) {
    ctx.shadowColor = b.color;
    ctx.fillStyle = b.color;
    ctx.fillRect(b.x - 2, b.y - 9, 4, 18);
  }
  for (const b of enemyBullets) {
    ctx.shadowColor = b.color;
    ctx.fillStyle = b.color;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// ---------- Enemics ----------
// Cada tipus té un comportament i aspecte diferent
const ENEMY_TYPES = {
  drone:  { r: 16, hp: 1, speed: 90,  color: '#ff2bd6', score: 100, shoots: false },
  zigzag: { r: 15, hp: 2, speed: 110, color: '#b44bff', score: 150, shoots: true },
  diver:  { r: 14, hp: 1, speed: 70,  color: '#ffe02b', score: 200, shoots: false },
  tank:   { r: 24, hp: 6, speed: 45,  color: '#ff5a2b', score: 400, shoots: true },
};
const enemies = [];
let spawnTimer = 1;

function spawnEnemy(type, x = rand(40, W - 40), y = -30) {
  const def = ENEMY_TYPES[type];
  enemies.push({
    type, x, y, r: def.r, hp: def.hp, maxHp: def.hp,
    color: def.color, score: def.score, speed: def.speed,
    t: rand(0, 10), baseX: x, vx: 0, vy: def.speed,
    shootTimer: rand(1, 2.5), hitFlash: 0,
  });
}

function updateEnemies(dt) {
  spawnTimer -= dt;
  if (spawnTimer <= 0) {
    const types = ['drone', 'drone', 'zigzag', 'diver', 'tank'];
    spawnEnemy(types[Math.floor(Math.random() * types.length)]);
    spawnTimer = rand(0.5, 1.3);
  }

  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    e.t += dt;
    e.hitFlash = Math.max(0, e.hitFlash - dt);

    switch (e.type) {
      case 'zigzag':
        e.y += e.speed * dt;
        e.x = e.baseX + Math.sin(e.t * 3) * 70;
        break;
      case 'diver':
        // Baixa lentament i, quan és a prop, es llança cap al jugador
        if (e.y < H * 0.3) {
          e.y += e.speed * dt;
        } else {
          if (!e.dived) {
            const ang = Math.atan2(player.y - e.y, player.x - e.x);
            e.vx = Math.cos(ang) * 380;
            e.vy = Math.sin(ang) * 380;
            e.dived = true;
          }
          e.x += e.vx * dt;
          e.y += e.vy * dt;
        }
        break;
      default:
        e.y += e.speed * dt;
    }

    const def = ENEMY_TYPES[e.type];
    if (def.shoots && e.y > 0) {
      e.shootTimer -= dt;
      if (e.shootTimer <= 0) {
        const ang = Math.atan2(player.y - e.y, player.x - e.x);
        enemyBullets.push({ x: e.x, y: e.y, vx: Math.cos(ang) * 220, vy: Math.sin(ang) * 220, r: 5, color: '#ff3b6b' });
        e.shootTimer = rand(1.4, 2.6);
      }
    }

    if (e.y > H + 50 || e.x < -60 || e.x > W + 60) enemies.splice(i, 1);
  }
}

function drawEnemy(e) {
  ctx.save();
  ctx.translate(e.x, e.y);
  const color = e.hitFlash > 0 ? '#ffffff' : e.color;
  ctx.strokeStyle = color;
  ctx.fillStyle = color + '22';
  ctx.shadowColor = color;
  ctx.shadowBlur = 16;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  switch (e.type) {
    case 'drone': { // hexàgon que gira
      ctx.rotate(e.t * 2);
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        ctx.lineTo(Math.cos(a) * e.r, Math.sin(a) * e.r);
      }
      break;
    }
    case 'zigzag': // rombe
      ctx.moveTo(0, -e.r); ctx.lineTo(e.r, 0); ctx.lineTo(0, e.r); ctx.lineTo(-e.r, 0);
      break;
    case 'diver': // triangle apuntant cap al jugador
      ctx.rotate(e.dived ? Math.atan2(e.vy, e.vx) - Math.PI / 2 : 0);
      ctx.moveTo(0, e.r); ctx.lineTo(e.r, -e.r); ctx.lineTo(-e.r, -e.r);
      break;
    case 'tank': // octàgon gran amb nucli
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
        ctx.lineTo(Math.cos(a) * e.r, Math.sin(a) * e.r);
      }
      break;
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // Nucli brillant
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(0, 0, e.type === 'tank' ? 6 : 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// ---------- Estat de la partida ----------
const game = {
  state: 'playing', // 'playing' | 'gameover'
  score: 0,
  lives: 3,
  invuln: 0,        // segons d'invulnerabilitat després de rebre un cop
  combo: 0,         // enemics seguits abatuts sense rebre mal
  comboTimer: 0,
  stateTimer: 0,
};
const floatingTexts = []; // "+100" que apareixen en abatre enemics

function resetGame() {
  Object.assign(game, { state: 'playing', score: 0, lives: 3, invuln: 2, combo: 0, comboTimer: 0, stateTimer: 0 });
  enemies.length = 0;
  bullets.length = 0;
  enemyBullets.length = 0;
  floatingTexts.length = 0;
  player.x = W / 2;
  player.y = H - 80;
  spawnTimer = 1;
}

// ---------- Col·lisions (cercle contra cercle) ----------
const PLAYER_R = 14;
const hit = (a, ar, b, br) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2 < (ar + br) ** 2;

function addScore(points, x, y) {
  game.combo++;
  game.comboTimer = 2;
  const mult = Math.min(1 + Math.floor(game.combo / 5), 5); // x1..x5 segons el combo
  const total = points * mult;
  game.score += total;
  floatingTexts.push({ text: `+${total}`, x, y, life: 1, color: mult > 1 ? '#ffe02b' : '#ffffff' });
}

function killEnemy(index) {
  const e = enemies[index];
  addScore(e.score, e.x, e.y);
  enemies.splice(index, 1);
}

function damagePlayer() {
  if (game.invuln > 0) return;
  game.lives--;
  game.invuln = 2;
  game.combo = 0;
  if (game.lives <= 0) {
    game.state = 'gameover';
    game.stateTimer = 0;
  }
}

function handleCollisions() {
  // Dispars del jugador contra enemics
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    for (let j = enemies.length - 1; j >= 0; j--) {
      const e = enemies[j];
      if (hit(b, b.r, e, e.r)) {
        bullets.splice(i, 1);
        e.hp--;
        e.hitFlash = 0.08;
        if (e.hp <= 0) killEnemy(j);
        break;
      }
    }
  }
  // Dispars enemics contra el jugador
  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    if (hit(enemyBullets[i], enemyBullets[i].r, player, PLAYER_R) && game.invuln <= 0) {
      enemyBullets.splice(i, 1);
      damagePlayer();
    }
  }
  // Xoc directe entre enemic i jugador
  for (let j = enemies.length - 1; j >= 0; j--) {
    if (hit(enemies[j], enemies[j].r, player, PLAYER_R) && game.invuln <= 0) {
      killEnemy(j);
      damagePlayer();
    }
  }
}

function updateFloatingTexts(dt) {
  for (let i = floatingTexts.length - 1; i >= 0; i--) {
    const f = floatingTexts[i];
    f.y -= 40 * dt;
    f.life -= dt;
    if (f.life <= 0) floatingTexts.splice(i, 1);
  }
}

// ---------- HUD ----------
function drawHUD() {
  neonText(`PUNTS ${String(game.score).padStart(6, '0')}`, 20, 26, 20, '#00f0ff', 'left');
  // Vides com a petites naus
  for (let i = 0; i < game.lives; i++) {
    ctx.save();
    ctx.translate(W - 30 - i * 30, 26);
    ctx.scale(0.5, 0.5);
    drawShip(0, 0, 0, '#ff2bd6');
    ctx.restore();
  }
  const mult = Math.min(1 + Math.floor(game.combo / 5), 5);
  if (mult > 1) neonText(`COMBO x${mult}`, W / 2, 26, 20, '#ffe02b');

  for (const f of floatingTexts) {
    ctx.globalAlpha = Math.max(0, f.life);
    neonText(f.text, f.x, f.y, 16, f.color);
  }
  ctx.globalAlpha = 1;
}

function drawGameOver() {
  ctx.fillStyle = 'rgba(5, 1, 12, 0.6)';
  ctx.fillRect(0, 0, W, H);
  neonText('GAME OVER', W / 2, H / 2 - 30, 64, '#ff2bd6');
  neonText(`Puntuació: ${game.score}`, W / 2, H / 2 + 30, 24, '#00f0ff');
  if (Math.floor(game.stateTimer * 2) % 2 === 0) {
    neonText('Prem ENTER per tornar a jugar', W / 2, H / 2 + 80, 18, '#c9b8ff');
  }
}

// ---------- Bucle principal ----------
let last = performance.now();
let gridDt = 0;

function update(dt) {
  gridDt = dt;
  updateStars(dt);
  game.stateTimer += dt;

  if (game.state === 'gameover') {
    if (keys.Enter || (DEMO && game.stateTimer > 3)) resetGame();
    return;
  }

  if (DEMO) demoPilot(dt);
  game.invuln = Math.max(0, game.invuln - dt);
  game.comboTimer -= dt;
  if (game.comboTimer <= 0) game.combo = 0;

  updatePlayer(dt);
  updateBullets(dt);
  updateEnemies(dt);
  handleCollisions();
  updateFloatingTexts(dt);
}

function draw() {
  ctx.fillStyle = '#05010c';
  ctx.fillRect(0, 0, W, H);
  drawGrid(gridDt);
  drawStars();
  enemies.forEach(drawEnemy);
  drawBullets();
  // La nau parpelleja mentre és invulnerable
  if (game.state === 'playing' && (game.invuln <= 0 || Math.floor(game.invuln * 10) % 2 === 0)) {
    drawShip(player.x, player.y, player.tilt);
  }
  drawHUD();
  if (game.state === 'gameover') drawGameOver();
}

function loop(now) {
  const dt = Math.min((now - last) / 1000, 0.05); // segons, limitat per evitar salts
  last = now;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

// En mode demo, ?warp=N simula N segons de joc abans de començar (útil per a captures)
const WARP = DEMO ? Number(new URLSearchParams(location.search).get('warp')) || 0 : 0;
for (let t = 0; t < WARP; t += 1 / 60) update(1 / 60);

requestAnimationFrame(loop);
