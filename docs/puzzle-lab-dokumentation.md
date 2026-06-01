# Puzzle Lab Dokumentation

Stand: 2026-06-01

## Kurzüberblick

Puzzle Lab ist das zweite Live-Game im Games Lab. Nutzer können ein eigenes Bild hochladen oder eines der mitgelieferten Motive auswählen. Das Bild wird zu einem quadratischen Jigsaw-Puzzle verarbeitet.

Live-Seiten:

- Puzzle Lab: https://jakobsawazki.github.io/puzzle-lab/
- Games Lab: https://jakobsawazki.github.io/mini-games/

## Spielprinzip

- Das aktuelle Bild wird im Browser als quadratisches Puzzle-Motiv verwendet.
- Die Grafik wird in echte Jigsaw-Teile mit Laschen und Aussparungen geteilt.
- Alle Teile starten gemischt in einer eigenen Teileablage.
- Spieler ziehen oder klicken Teile aus der Ablage auf den Puzzle-Tisch.
- Falsch platzierte Teile bleiben sichtbar liegen und können erneut bewegt werden.
- Das Puzzle ist gelöst, wenn jedes Teil an seiner Originalposition liegt.
- Die Abschlussanzeige erscheint erst nach vollständig korrekt gelöstem Puzzle.

## Schwierigkeitsstufen

| Stufe | Raster | Teile |
| --- | --- | --- |
| Leicht | 3 x 3 | 9 |
| Mittel | 4 x 4 | 16 |
| Schwer | 6 x 6 | 36 |

## Bedienung

- Bild über den Upload wählen oder ein Beispielmotiv anklicken.
- Schwierigkeit über Leicht, Mittel oder Schwer setzen.
- Puzzleteil anklicken und anschließend eine Position auf dem Puzzle-Tisch wählen.
- Alternativ ein Teil per Drag-and-drop auf den Tisch ziehen.
- Ein bereits platziertes Teil kann zurück in die Ablage gezogen oder durch ein anderes Teil ersetzt werden.
- Statuswerte wie Zeit, Züge und Fortschritt können ausgeblendet werden.

## Assets

- `assets/games-lab-logo.png`: Gemeinsames Games-Lab-Logo mit Labor- und Gaming-Motiv.
- `assets/puzzle-lab-logo.png`: Eigenes Puzzle-Lab-Logo für Header und Browser-Icon.
- `assets/samples/forest-stream.jpg`: Acryl-Naturmotiv Waldlichtung.
- `assets/samples/mountain-lake.jpg`: Acryl-Naturmotiv Bergsee.
- `assets/samples/coastal-meadow.jpg`: Acryl-Naturmotiv Küstenwiese.
- `assets/samples/red-fox.jpg`: Fotorealistisches Tiermotiv Rotfuchs.
- `assets/samples/kingfisher.jpg`: Fotorealistisches Tiermotiv Eisvogel.
- `assets/samples/young-deer.jpg`: Fotorealistisches Tiermotiv Reh.

Die Beispielbilder wurden als Rasterbilder generiert und lokal ins Projekt kopiert.

## Technischer Aufbau

```text
puzzle-lab/
  assets/
    games-lab-logo.png
    puzzle-lab-logo.png
    samples/
      coastal-meadow.jpg
      forest-stream.jpg
      kingfisher.jpg
      mountain-lake.jpg
      red-fox.jpg
      young-deer.jpg
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
| v0.2 | `205067e` | Futuristische Beispielbilder durch Acryl-Naturmotive ersetzt |
| v0.3 | `4d8cafd` | Jigsaw-Teile, separate Ablage, Puzzle-Tisch, ausblendbarer Status und drei Tiermotive |
| v0.4 | `1473594` | Eigenes Puzzle-Lab-Logo und links ausgerichtete Stage-Überschrift |
| v0.5 | aktueller Stand | Aktualisiertes gemeinsames Games-Lab-Logo |

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
- Weitere Beispielbilder im Sawazki-Electronics-Stil.
- Optionaler Freiform-Modus ohne sichtbare Rasterplätze.
