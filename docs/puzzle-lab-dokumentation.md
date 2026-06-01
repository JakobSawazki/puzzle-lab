# Puzzle Lab Dokumentation

Stand: 2026-06-01

## Kurzüberblick

Puzzle Lab ist das zweite Live-Game im Games Lab. Nutzer können ein eigenes Bild hochladen oder eines der mitgelieferten Motive auswählen. Das Bild wird zu einem quadratischen Tile-Puzzle verarbeitet.

Live-Seiten:

- Puzzle Lab: https://jakobsawazki.github.io/puzzle-lab/
- Games Lab: https://jakobsawazki.github.io/mini-games/

## Spielprinzip

- Das aktuelle Bild wird mittig quadratisch zugeschnitten.
- Die Grafik wird in gleich große Kacheln geteilt.
- Die Teile werden gemischt.
- Spieler tauschen zwei Teile per Klick oder Drag-and-drop.
- Das Puzzle ist gelöst, wenn jedes Teil wieder an seiner Originalposition liegt.

## Schwierigkeitsstufen

| Stufe | Raster | Teile |
| --- | --- | --- |
| Leicht | 3 x 3 | 9 |
| Mittel | 4 x 4 | 16 |
| Schwer | 6 x 6 | 36 |

## Assets

- `assets/games-lab-logo.png`: Games-Lab-Logo.
- `assets/samples/forest-stream.jpg`: Acryl-Naturmotiv Waldlichtung.
- `assets/samples/mountain-lake.jpg`: Acryl-Naturmotiv Bergsee.
- `assets/samples/coastal-meadow.jpg`: Acryl-Naturmotiv Küstenwiese.

Die Beispielbilder wurden als Acryl-Natur-Rasterbilder generiert und lokal ins Projekt kopiert.

## Technischer Aufbau

```text
puzzle-lab/
  assets/
    games-lab-logo.png
    samples/
      coastal-meadow.jpg
      forest-stream.jpg
      mountain-lake.jpg
  docs/
    puzzle-lab-dokumentation.md
  game.js
  index.html
  styles.css
  README.md
```

## Versionszustände

| Version | Commit | Inhalt |
| --- | --- | --- |
| v0.1 | `733979c` | Erstes Puzzle Lab mit Upload, Beispielbildern und drei Schwierigkeitsstufen |
| v0.2 | aktueller Stand | Futuristische Beispielbilder durch Acryl-Naturmotive ersetzt |

## Lokale Entwicklung

```powershell
cd "G:\Meine Ablage\Codex\puzzle-lab"
python -m http.server 4175 --bind 127.0.0.1
```

Danach im Browser öffnen:

```text
http://127.0.0.1:4175/
```

Syntaxcheck:

```powershell
node --check game.js
```

## Nächste sinnvolle Schritte

- Optionale Highscore- oder Bestzeit-Funktion pro Schwierigkeitsstufe.
- Zusätzliche Puzzle-Formen oder unregelmäßige Jigsaw-Kanten.
- Mehr Beispielbilder im Sawazki-Electronics-Stil.
