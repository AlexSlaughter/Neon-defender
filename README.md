# 🚀 Neon Defender

**Neon Defender** és un joc arcade d'acció espacial amb estètica *neó / synthwave* que s'executa directament al navegador.
El jugador pilota una nau que ha de defensar el sector d'onades d'enemics cada cop més difícils, recollir *power-ups* i derrotar un **boss** final.

Projecte de l'activitat **AB03 – Vibe Coding** (DAW2 · Optativa IA · Institut Camí de Mar): tot el codi s'ha desenvolupat pas a pas amb l'ajuda d'una IA (LLM), documentant el prompt de cada pas i fent un commit per pas.

## 🎮 Com jugar

1. Descarrega o clona el repositori.
2. Obre `index.html` amb qualsevol navegador modern (Chrome, Edge, Firefox). No cal instal·lar res ni cap servidor.

| Tecla | Acció |
|---|---|
| `←` `→` `↑` `↓` / `W` `A` `S` `D` | Moure la nau |
| `Espai` | Disparar |
| `P` | Pausa |
| `M` | Silenciar so |
| `Enter` | Començar / tornar a jugar |

En mòbil o tauleta: arrossega el dit per moure la nau (dispara automàticament).

## 🛠️ Tecnologia

| Tecnologia | Ús |
|---|---|
| **HTML5** | Estructura de la pàgina i element `<canvas>` |
| **CSS3** | Estètica neó, tipografia i disseny responsive |
| **JavaScript (ES6, vanilla)** | Lògica del joc, bucle d'animació (`requestAnimationFrame`), físiques i col·lisions |
| **Canvas 2D API** | Renderitzat de gràfics, partícules i efectes de brillantor (`shadowBlur`) |
| **Web Audio API** | Efectes de so sintetitzats en temps real (sense fitxers d'àudio) |
| **localStorage** | Desar la puntuació rècord |

Sense frameworks ni dependències externes.

## 📁 Estructura

```
ProjecteVibeCoding/
├── index.html        Pàgina principal amb el canvas
├── style.css         Estils neó
├── js/game.js        Tot el codi del joc
└── docs/
    ├── PROCES.md     Diari de desenvolupament: pas, prompt i resultat
    └── captures/     Captures de pantalla del procés
```

## 🤖 Procés de desenvolupament amb IA

El desenvolupament complet (pas, prompt utilitzat i decisions preses) està documentat a [`docs/PROCES.md`](docs/PROCES.md).
