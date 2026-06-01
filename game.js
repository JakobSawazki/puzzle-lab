const board = document.querySelector("#puzzleBoard");
const imageUpload = document.querySelector("#imageUpload");
const sampleList = document.querySelector("#sampleList");
const difficultyButtons = document.querySelector("#difficultyButtons");
const previewImage = document.querySelector("#previewImage");
const previewToggle = document.querySelector("#previewToggle");
const shuffleButton = document.querySelector("#shuffleButton");
const moveCount = document.querySelector("#moveCount");
const timer = document.querySelector("#timer");
const pieceCount = document.querySelector("#pieceCount");
const progressCount = document.querySelector("#progressCount");
const completeBanner = document.querySelector("#completeBanner");
const completeSummary = document.querySelector("#completeSummary");

const samples = [
  {
    id: "forest-stream",
    name: "Waldlichtung",
    src: "./assets/samples/forest-stream.jpg"
  },
  {
    id: "mountain-lake",
    name: "Bergsee",
    src: "./assets/samples/mountain-lake.jpg"
  },
  {
    id: "coastal-meadow",
    name: "Küstenwiese",
    src: "./assets/samples/coastal-meadow.jpg"
  }
];

const difficulties = [
  { id: "easy", label: "Leicht", rows: 3, cols: 3 },
  { id: "medium", label: "Mittel", rows: 4, cols: 4 },
  { id: "hard", label: "Schwer", rows: 6, cols: 6 }
];

let state = {
  difficulty: difficulties[0],
  imageSrc: samples[0].src,
  imageName: samples[0].name,
  imageData: null,
  objectUrl: null,
  pieces: [],
  selectedIndex: null,
  moves: 0,
  startedAt: null,
  timerId: null,
  solved: false,
  previewMode: false,
  draggedIndex: null
};

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function startTimer() {
  if (state.timerId) {
    clearInterval(state.timerId);
  }

  state.startedAt = Date.now();
  timer.textContent = "00:00";
  state.timerId = setInterval(() => {
    const seconds = Math.floor((Date.now() - state.startedAt) / 1000);
    timer.textContent = formatTime(seconds);
  }, 1000);
}

function stopTimer() {
  if (state.timerId) {
    clearInterval(state.timerId);
    state.timerId = null;
  }
}

function createPieces() {
  const total = state.difficulty.rows * state.difficulty.cols;
  state.pieces = Array.from({ length: total }, (_, index) => index);
}

function isSolved() {
  return state.pieces.every((piece, index) => piece === index);
}

function countCorrectPieces() {
  return state.pieces.filter((piece, index) => piece === index).length;
}

function shufflePieces() {
  const total = state.pieces.length;
  do {
    for (let index = total - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [state.pieces[index], state.pieces[randomIndex]] = [state.pieces[randomIndex], state.pieces[index]];
    }
  } while (isSolved() && total > 1);
}

function updateStats() {
  const total = state.pieces.length;
  const correct = countCorrectPieces();
  moveCount.textContent = state.moves.toString();
  pieceCount.textContent = total.toString();
  progressCount.textContent = `${correct}/${total}`;
}

function tileBackgroundPosition(piece) {
  const { rows, cols } = state.difficulty;
  const x = piece % cols;
  const y = Math.floor(piece / cols);
  const xPosition = cols === 1 ? 0 : (x / (cols - 1)) * 100;
  const yPosition = rows === 1 ? 0 : (y / (rows - 1)) * 100;
  return `${xPosition}% ${yPosition}%`;
}

function renderBoard() {
  const { rows, cols } = state.difficulty;
  board.innerHTML = "";
  board.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
  board.style.gridTemplateRows = `repeat(${rows}, minmax(0, 1fr))`;
  board.classList.toggle("is-preview", state.previewMode);

  const visiblePieces = state.previewMode
    ? state.pieces.map((_, index) => index)
    : state.pieces;

  visiblePieces.forEach((piece, position) => {
    const tile = document.createElement("button");
    tile.className = "tile";
    tile.type = "button";
    tile.draggable = !state.previewMode && !state.solved;
    tile.dataset.index = position.toString();
    tile.dataset.piece = piece.toString();
    tile.style.backgroundImage = `url("${state.imageData}")`;
    tile.style.backgroundSize = `${cols * 100}% ${rows * 100}%`;
    tile.style.backgroundPosition = tileBackgroundPosition(piece);
    tile.setAttribute("aria-label", `Puzzleteil ${position + 1}`);
    tile.classList.toggle("is-selected", state.selectedIndex === position);
    tile.classList.toggle("is-correct", state.pieces[position] === position && !state.previewMode);
    board.append(tile);
  });

  updateStats();
}

function swapPieces(firstIndex, secondIndex) {
  if (firstIndex === secondIndex || state.solved || state.previewMode) {
    state.selectedIndex = null;
    renderBoard();
    return;
  }

  [state.pieces[firstIndex], state.pieces[secondIndex]] = [state.pieces[secondIndex], state.pieces[firstIndex]];
  state.moves += 1;
  state.selectedIndex = null;
  renderBoard();

  if (isSolved()) {
    finishPuzzle();
  }
}

function finishPuzzle() {
  state.solved = true;
  stopTimer();
  const seconds = state.startedAt ? Math.floor((Date.now() - state.startedAt) / 1000) : 0;
  completeSummary.textContent = `${state.moves} Züge in ${formatTime(seconds)}`;
  completeBanner.hidden = false;
  renderBoard();
}

function handleTileClick(event) {
  const tile = event.target.closest(".tile");
  if (!tile || state.solved || state.previewMode) {
    return;
  }

  const index = Number(tile.dataset.index);
  if (state.selectedIndex === null) {
    state.selectedIndex = index;
    renderBoard();
    return;
  }

  swapPieces(state.selectedIndex, index);
}

function handleDragStart(event) {
  const tile = event.target.closest(".tile");
  if (!tile || state.solved || state.previewMode) {
    return;
  }

  state.draggedIndex = Number(tile.dataset.index);
  event.dataTransfer.effectAllowed = "move";
}

function handleDragOver(event) {
  if (state.draggedIndex !== null) {
    event.preventDefault();
  }
}

function handleDrop(event) {
  event.preventDefault();
  const tile = event.target.closest(".tile");
  if (!tile || state.draggedIndex === null) {
    state.draggedIndex = null;
    return;
  }

  const dropIndex = Number(tile.dataset.index);
  swapPieces(state.draggedIndex, dropIndex);
  state.draggedIndex = null;
}

function renderSamples() {
  sampleList.innerHTML = "";
  samples.forEach((sample) => {
    const button = document.createElement("button");
    button.className = "sample-button";
    button.type = "button";
    button.dataset.sample = sample.id;
    button.setAttribute("aria-label", `${sample.name} auswählen`);
    button.innerHTML = `<img src="${sample.src}" alt="">`;
    button.classList.toggle("is-active", state.imageSrc === sample.src);
    sampleList.append(button);
  });
}

function renderDifficulties() {
  difficultyButtons.innerHTML = "";
  difficulties.forEach((difficulty) => {
    const total = difficulty.rows * difficulty.cols;
    const button = document.createElement("button");
    button.className = "difficulty-button";
    button.type = "button";
    button.dataset.difficulty = difficulty.id;
    button.innerHTML = `<strong>${difficulty.label}</strong><span>${total} Teile</span>`;
    button.classList.toggle("is-active", state.difficulty.id === difficulty.id);
    difficultyButtons.append(button);
  });
}

function prepareImage(src, name, { objectUrl = false } = {}) {
  if (state.objectUrl && state.objectUrl !== src) {
    URL.revokeObjectURL(state.objectUrl);
    state.objectUrl = null;
  }

  state.imageSrc = src;
  state.imageName = name;
  state.imageData = src;
  if (objectUrl) {
    state.objectUrl = src;
  }
  previewImage.src = state.imageData;
  previewImage.alt = `${name} Vorschau`;
}

async function newPuzzle({ keepImage = true } = {}) {
  state.selectedIndex = null;
  state.draggedIndex = null;
  state.moves = 0;
  state.solved = false;
  state.previewMode = false;
  previewToggle.setAttribute("aria-pressed", "false");
  previewToggle.textContent = "Vorschau zeigen";
  completeBanner.hidden = true;

  if (!keepImage || !state.imageData) {
    prepareImage(state.imageSrc, state.imageName);
  }

  createPieces();
  shufflePieces();
  startTimer();
  renderSamples();
  renderDifficulties();
  renderBoard();
}

async function selectSample(sampleId) {
  const sample = samples.find((item) => item.id === sampleId);
  if (!sample) {
    return;
  }

  prepareImage(sample.src, sample.name);
  await newPuzzle({ keepImage: true });
}

function selectDifficulty(difficultyId) {
  const difficulty = difficulties.find((item) => item.id === difficultyId);
  if (!difficulty) {
    return;
  }

  state.difficulty = difficulty;
  newPuzzle({ keepImage: true });
}

async function handleUpload(event) {
  const file = event.target.files?.[0];
  if (!file || !file.type.startsWith("image/")) {
    return;
  }

  const objectUrl = URL.createObjectURL(file);
  prepareImage(objectUrl, file.name.replace(/\.[^.]+$/, "") || "Eigenes Bild", { objectUrl: true });
  await newPuzzle({ keepImage: true });
}

function togglePreview() {
  state.previewMode = !state.previewMode;
  previewToggle.setAttribute("aria-pressed", state.previewMode.toString());
  previewToggle.textContent = state.previewMode ? "Puzzle zeigen" : "Vorschau zeigen";
  renderBoard();
}

sampleList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-sample]");
  if (button) {
    selectSample(button.dataset.sample);
  }
});

difficultyButtons.addEventListener("click", (event) => {
  const button = event.target.closest("[data-difficulty]");
  if (button) {
    selectDifficulty(button.dataset.difficulty);
  }
});

board.addEventListener("click", handleTileClick);
board.addEventListener("dragstart", handleDragStart);
board.addEventListener("dragover", handleDragOver);
board.addEventListener("drop", handleDrop);
imageUpload.addEventListener("change", handleUpload);
shuffleButton.addEventListener("click", () => newPuzzle({ keepImage: true }));
previewToggle.addEventListener("click", togglePreview);

prepareImage(state.imageSrc, state.imageName);
renderSamples();
renderDifficulties();
newPuzzle({ keepImage: true });
