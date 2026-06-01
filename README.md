# Puzzle Lab

Puzzle Lab ist ein Browser-Puzzle-Game für Games Lab von Sawazki Electronics.

## Live-Seite

- Puzzle Lab: https://jakobsawazki.github.io/puzzle-lab/
- Games Lab: https://jakobsawazki.github.io/mini-games/

## Features

- Eigenes Bild hochladen und automatisch in ein quadratisches Puzzle umwandeln.
- Beispielmotive, falls kein eigenes Bild verwendet werden soll.
- Schwierigkeitsstufen:
  - Leicht: 3 x 3, 9 Teile
  - Mittel: 4 x 4, 16 Teile
  - Schwer: 6 x 6, 36 Teile
- Klick- und Drag-Tausch von Puzzleteilen.
- Züge, Timer, Teilezahl und Fortschritt.
- Vorschau-Modus und Abschlussanzeige.

## Dokumentation

- [Puzzle Lab Dokumentation](./docs/puzzle-lab-dokumentation.md)

## Lokale Vorschau

```powershell
python -m http.server 4175 --bind 127.0.0.1
```

Danach `http://127.0.0.1:4175/` öffnen.

## GitHub Pages

Das Projekt besteht aus statischem HTML, CSS und JavaScript und kann aus dem `main`-Branch-Root veröffentlicht werden.
