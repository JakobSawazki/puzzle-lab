# Puzzle Lab

Puzzle Lab ist ein Browser-Puzzle-Game für Games Lab von Sawazki Electronics.

## Live-Seite

- Puzzle Lab: https://jakobsawazki.github.io/puzzle-lab/
- Games Lab: https://jakobsawazki.github.io/mini-games/

## Features

- Eigenes Bild hochladen und automatisch in ein quadratisches Puzzle umwandeln.
- Acryl-Naturmotive und fotorealistische Tiermotive, falls kein eigenes Bild verwendet werden soll.
- Schwierigkeitsstufen:
  - Leicht: 3 x 3, 9 Teile
  - Mittel: 4 x 4, 16 Teile
  - Schwer: 6 x 6, 36 Teile
- Echte Jigsaw-Optik mit Laschen und Aussparungen.
- Eigenes Puzzle-Lab-Logo im Spiel-Header.
- Aktualisiertes Games-Lab-Logo im Brand-Bereich.
- Gemischte Teileablage und separater Puzzle-Tisch zum Platzieren der Teile.
- Drag-and-drop sowie Klick-Auswahl für Puzzleteile.
- Züge, Timer, Teilezahl und Fortschritt, optional ausblendbar.
- Vorschau-Modus und Abschlussanzeige erst nach korrekt gelöstem Puzzle.

## Dokumentation

- [Puzzle Lab Dokumentation](./docs/puzzle-lab-dokumentation.md)

## Lokale Vorschau

```powershell
python -m http.server 4175 --bind 127.0.0.1
```

Danach `http://127.0.0.1:4175/` öffnen.

## GitHub Pages

Das Projekt besteht aus statischem HTML, CSS und JavaScript und kann aus dem `main`-Branch-Root veröffentlicht werden.
