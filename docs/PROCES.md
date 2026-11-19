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

---

## Pas 2 – Nau del jugador i fons d'estrelles

**Funcionalitat implementada:** la nau del jugador dibuixada amb línies neó i una flama de motor que parpelleja; moviment amb fletxes o WASD; fons d'estrelles amb 3 capes de paral·laxi i una graella *synthwave* en perspectiva que es desplaça. També s'ha afegit un **mode demo** (`index.html?demo`) on un pilot automàtic juga sol.

**Prompt utilitzat:**
> Afegeix la nau del jugador a game.js: dibuixa-la amb línies neó cian amb shadowBlur, una cabina rosa i una flama de motor taronja que parpellegi. S'ha de moure amb les fletxes i amb WASD, sense sortir del canvas, normalitzant la velocitat en diagonal i amb una petita inclinació quan es mou de costat. Afegeix també un fons d'estrelles amb 3 capes de paral·laxi a diferents velocitats i una graella synthwave en perspectiva a la part de baix. Finalment, afegeix un mode demo activable amb ?demo a la URL on la nau es mogui sola i dispari, per poder fer captures del joc.

**Decisions i característiques interessants:**
- **Paral·laxi:** cada capa d'estrelles té velocitat, mida i opacitat diferents; això dona sensació de profunditat amb molt poc codi.
- **Normalització diagonal:** en moure's en diagonal es multiplica per `√½` perquè la nau no vagi més ràpida que en línia recta.
- La inclinació de la nau s'interpola (`tilt += (objectiu - tilt) * dt * 10`) per tenir un moviment suau en lloc d'un canvi brusc.
- La graella usa una funció quadràtica (`t*t`) perquè les línies horitzontals s'acostin entre elles prop de l'horitzó, simulant perspectiva.
- El mode demo ens ha permès fer captures automàtiques amb Edge en mode *headless*.

**Captura:** `docs/captures/pas2.png`

---

## Pas 3 – Dispars i enemics

**Funcionalitat implementada:** el jugador dispara làsers amb `Espai` (amb cadència limitada) i apareixen 4 tipus d'enemics amb formes i comportaments diferents:

| Enemic | Forma | Comportament | Vida | Punts |
|---|---|---|---|---|
| Drone | Hexàgon rosa que gira | Baixa recte | 1 | 100 |
| Zigzag | Rombe lila | Baixa fent ziga-zaga i dispara | 2 | 150 |
| Diver | Triangle groc | Baixa i es llança en picat cap al jugador | 1 | 200 |
| Tank | Octàgon taronja | Lent, resistent i dispara | 6 | 400 |

Els enemics que disparen apunten els projectils cap a la posició del jugador.

**Prompt utilitzat:**
> Afegeix dispars: amb la tecla Espai la nau dispara làsers cian cap amunt amb un temps mínim entre dispars. Després crea un sistema d'enemics amb 4 tipus definits en un objecte de configuració (drone, zigzag, diver i tank), cadascun amb forma geomètrica neó, color, vida, velocitat i punts diferents. El drone baixa recte, el zigzag fa una ona sinusoïdal, el diver baixa i quan arriba a un terç de la pantalla es llança cap al jugador, i el tank és lent i resistent. El zigzag i el tank han de disparar projectils dirigits cap al jugador. Elimina els objectes que surten de la pantalla.

**Problema trobat i solució:** en fer les captures amb Edge *headless* el joc gairebé no avançava, perquè el navegador sense finestra limita `requestAnimationFrame`. Es va demanar a la IA:
> Les captures en headless surten buides perquè no avancen fotogrames. Afegeix un paràmetre ?warp=N al mode demo que simuli N segons de joc abans del primer dibuix.

Ara `index.html?demo&warp=7` mostra el joc tal com estaria després de 7 segons.

**Decisions i característiques interessants:**
- Els tipus d'enemic es defineixen en un objecte `ENEMY_TYPES` (configuració separada de la lògica), així afegir-ne un de nou és trivial.
- Es fa servir `Math.atan2` per calcular l'angle cap al jugador, tant per al picat del *diver* com per als dispars dirigits.
- Els arrays es recorren **de darrere cap endavant** quan s'eliminen elements amb `splice`, per no saltar-se cap element.
- `hitFlash` es prepara perquè l'enemic brilli en blanc quan rebi un impacte (s'utilitza al pas 4).

**Captura:** `docs/captures/pas3.png`

---

## Pas 4 – Col·lisions, vides i puntuació

**Funcionalitat implementada:** detecció de col·lisions (làser→enemic, dispar enemic→jugador i xoc directe), 3 vides, 2 segons d'invulnerabilitat (la nau parpelleja) després de rebre un cop, puntuació amb **multiplicador de combo** (x1 a x5), textos flotants "+100" en abatre un enemic, HUD amb la puntuació i les vides, i pantalla de *Game Over* amb `Enter` per tornar a jugar.

**Prompt utilitzat:**
> Implementa les col·lisions amb detecció cercle contra cercle: els làsers del jugador resten vida als enemics (que han de brillar en blanc un moment en rebre l'impacte) i en arribar a 0 moren i sumen punts; els dispars enemics i els xocs directes treuen una vida al jugador. El jugador té 3 vides i 2 segons d'invulnerabilitat després de cada cop, durant els quals la nau parpelleja. Afegeix un sistema de combo: cada 5 enemics seguits sense que passin 2 segons augmenta el multiplicador fins a x5. Mostra textos flotants amb els punts guanyats, un HUD amb la puntuació a l'esquerra i les vides com a naus petites a la dreta, i una pantalla de GAME OVER que permeti reiniciar amb Enter.

**Decisions i característiques interessants:**
- **Col·lisió cercle-cercle:** es compara la distància al quadrat amb `(r1 + r2)²`, evitant l'arrel quadrada (més ràpid). És suficientment precís per a formes neó petites.
- La **invulnerabilitat temporal** evita perdre diverses vides de cop si toquen alhora un enemic i un dispar.
- L'estat de la partida es concentra en un objecte `game` i la funció `resetGame()` torna tot a l'estat inicial; això facilita reiniciar i, més endavant, afegir menús.
- El multiplicador de combo premia jugar de manera agressiva sense rebre cops.
- En mode demo, el joc es reinicia sol 3 segons després del *Game Over*.

**Captura:** `docs/captures/pas4.png`

---

## Pas 5 – Partícules i efectes visuals

**Funcionalitat implementada:** sistema de partícules: explosions de colors en destruir enemics, espurnes en cada impacte de làser, **ones expansives** (anells que creixen i s'esvaeixen), **tremolor de pantalla** (*screen shake*) proporcional a l'explosió, flaix blanc quan el jugador rep un cop i una estela de foc que surt del motor de la nau.

**Prompt utilitzat:**
> Fes el joc molt més espectacular visualment. Crea un sistema de partícules genèric: quan mor un enemic ha d'explotar en partícules del seu color amb fregament perquè frenin, més una ona expansiva en forma d'anell neó. Les explosions grans (tank i quan el jugador rep un cop) han de tenir més partícules, un tremolor de pantalla i un flaix blanc. Afegeix espurnes petites quan un làser impacta i una estela de partícules taronja i rosa sortint del motor de la nau. Usa globalCompositeOperation 'lighter' perquè els colors brillin en superposar-se.

**Decisions i característiques interessants:**
- Una sola funció `spawnParticles()` serveix per a explosions, espurnes i estela: canviant nombre, velocitat, vida i mida s'obtenen efectes molt diferents.
- **Fregament:** la velocitat de cada partícula es multiplica per `(1 - 2.5·dt)` a cada fotograma, de manera que l'explosió és ràpida al principi i després es frena, com a la vida real.
- **`globalCompositeOperation = 'lighter'`**: els colors de les partícules se sumen quan se superposen i produeixen un efecte lluminós típic de l'estètica neó.
- El **screen shake** es fa amb un simple `ctx.translate()` aleatori abans de dibuixar el món; l'HUD es dibuixa després perquè no tremoli i es pugui llegir.
- Aquests efectes (*game feel* o *juice*) no canvien la jugabilitat però fan que el joc sigui molt més satisfactori.

**Captura:** `docs/captures/pas5.png`
