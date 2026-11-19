# Diari de desenvolupament – Neon Defender (AB03 Vibe Coding)

**Eina d'IA utilitzada:** Claude (model Claude Opus 5.5, d'Anthropic) dins de l'aplicació Claude Code.
**Metodologia:** el desenvolupament s'ha dividit en 8 passos. A cada pas s'ha escrit un prompt a la IA, s'ha revisat i provat el codi generat al navegador i s'ha fet un commit amb `git`.

## Planificació de tasques

| Pas | Funcionalitat | Commit |
|---|---|---|
| 1 | README, estructura HTML/CSS i bucle d'animació | `Pas 1: estructura base del projecte i README` |
| 2 | Nau del jugador, moviment i fons d'estrelles amb paral·laxi | `Pas 2: nau del jugador i fons d'estrelles` |
| 3 | Dispars i enemics | `Pas 3: dispars i enemics` |
| 4 | Col·lisions, vides, puntuació i HUD | `Pas 4: col·lisions, vides i puntuació` |
| 5 | Efectes visuals: partícules, explosions, tremolor de pantalla | `Pas 5: partícules i efectes visuals` |
| 6 | Onades progressives, power-ups i boss final | `Pas 6: onades, power-ups i boss` |
| 7 | So amb Web Audio, menú, pausa, game over i rècord | `Pas 7: so, menús i rècord` |
| 8 | Controls tàctils i ajustos finals | `Pas 8: controls tàctils i poliment final` |

---

## Pas 1 – Estructura base del projecte

**Funcionalitat implementada:** README del projecte, pàgina `index.html` amb un `<canvas>` de 800×600, estils neó a `style.css` i un fitxer `js/game.js` amb el bucle principal del joc (`requestAnimationFrame`) i el càlcul del temps entre fotogrames (`dt`).

**Prompt utilitzat:**
> Vull fer un joc arcade d'espai amb estètica neó per al navegador, només amb HTML, CSS i JavaScript sense llibreries, que es pugui obrir fent doble clic a index.html. Crea el README.md explicant què fa l'aplicació i quines tecnologies utilitza, i l'estructura base: un index.html amb un canvas de 800x600, un style.css amb estil neó (cian i rosa sobre fons fosc, responsive) i un js/game.js amb el bucle d'animació amb requestAnimationFrame i delta time.

**Decisions i característiques interessants:**
- Es fa servir JavaScript *vanilla* i Canvas 2D: no cal servidor ni instal·lar dependències, i es pot provar a classe immediatament.
- El `dt` es limita a 0,05 s perquè, si canvies de pestanya, el joc no faci un salt gegant en tornar.
- El canvas té una resolució interna fixa (800×600) però s'escala amb CSS (`aspect-ratio` i `min()`) per adaptar-se a qualsevol pantalla.
- La funció `neonText()` aprofita `shadowBlur` del canvas per obtenir l'efecte de brillantor neó.

**Captura:** `docs/captures/pas1.png`
