const board = document.querySelector("#puzzleBoard");
const pieceTray = document.querySelector("#pieceTray");
const trayCount = document.querySelector("#trayCount");
const placedCount = document.querySelector("#placedCount");
const imageUpload = document.querySelector("#imageUpload");
const sampleList = document.querySelector("#sampleList");
const difficultyButtons = document.querySelector("#difficultyButtons");
const previewImage = document.querySelector("#previewImage");
const previewToggle = document.querySelector("#previewToggle");
const shuffleButton = document.querySelector("#shuffleButton");
const statusToggle = document.querySelector("#statusToggle");
const statGrid = document.querySelector("#statGrid");
const moveCount = document.querySelector("#moveCount");
const timer = document.querySelector("#timer");
const pieceCount = document.querySelector("#pieceCount");
const progressCount = document.querySelector("#progressCount");
const completeBanner = document.querySelector("#completeBanner");
const completeSummary = document.querySelector("#completeSummary");

const SVG_NS = "http://www.w3.org/2000/svg";
const XLINK_NS = "http://www.w3.org/1999/xlink";

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
  },
  {
    id: "red-fox",
    name: "Rotfuchs",
    src: "./assets/samples/red-fox.jpg"
  },
  {
    id: "kingfisher",
    name: "Eisvogel",
    src: "./assets/samples/kingfisher.jpg"
  },
  {
    id: "young-deer",
    name: "Reh",
    src: "./assets/samples/young-deer.jpg"
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
  trayOrder: [],
  selectedPieceId: null,
  draggedPieceId: null,
  moves: 0,
  startedAt: null,
  timerId: null,
  solved: false,
  previewMode: false,
  statsVisible: true,
  edgeMap: null,
  puzzleId: 0
};

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function elapsedSeconds() {
  return state.startedAt ? Math.floor((Date.now() - state.startedAt) / 1000) : 0;
}

function startTimer() {
  stopTimer();
  state.startedAt = Date.now();
  timer.textContent = "00:00";
  state.timerId = setInterval(() => {
    timer.textContent = formatTime(elapsedSeconds());
  }, 1000);
}

function stopTimer() {
  if (state.timerId) {
    clearInterval(state.timerId);
    state.timerId = null;
  }
}

function createEdgeMap(rows, cols) {
  return {
    vertical: Array.from({ length: rows }, () =>
      Array.from({ length: Math.max(cols - 1, 0) }, () => (Math.random() > 0.5 ? 1 : -1))
    ),
    horizontal: Array.from({ length: Math.max(rows - 1, 0) }, () =>
      Array.from({ length: cols }, () => (Math.random() > 0.5 ? 1 : -1))
    )
  };
}

function createPieces() {
  const { rows, cols } = state.difficulty;
  const total = rows * cols;
  state.edgeMap = createEdgeMap(rows, cols);
  state.pieces = Array.from({ length: total }, (_, index) => ({
    id: `piece-${state.puzzleId}-${index}`,
    correctIndex: index,
    currentSlot: null
  }));
  state.trayOrder = state.pieces.map((piece) => piece.id);
  shuffleTrayOrder();
}

function shuffleTrayOrder() {
  for (let index = state.trayOrder.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [state.trayOrder[index], state.trayOrder[randomIndex]] = [
      state.trayOrder[randomIndex],
      state.trayOrder[index]
    ];
  }
}

function getPieceById(pieceId) {
  return state.pieces.find((piece) => piece.id === pieceId);
}

function removeFromTrayOrder(pieceId) {
  state.trayOrder = state.trayOrder.filter((id) => id !== pieceId);
}

function addToTrayOrder(pieceId) {
  removeFromTrayOrder(pieceId);
  state.trayOrder.push(pieceId);
}

function isSolved() {
  return state.pieces.length > 0 && state.pieces.every((piece) => piece.currentSlot === piece.correctIndex);
}

function countCorrectPieces() {
  return state.pieces.filter((piece) => piece.currentSlot === piece.correctIndex).length;
}

function countPlacedPieces() {
  return state.pieces.filter((piece) => piece.currentSlot !== null).length;
}

function updateStats() {
  const total = state.pieces.length;
  const correct = countCorrectPieces();
  const placed = countPlacedPieces();
  const remaining = total - placed;

  moveCount.textContent = state.moves.toString();
  pieceCount.textContent = total.toString();
  progressCount.textContent = `${correct}/${total}`;
  trayCount.textContent = remaining.toString();
  placedCount.textContent = `${placed}/${total}`;
}

function getPieceEdges(pieceIndex) {
  const { rows, cols } = state.difficulty;
  const row = Math.floor(pieceIndex / cols);
  const col = pieceIndex % cols;

  return {
    top: row === 0 ? 0 : -state.edgeMap.horizontal[row - 1][col],
    right: col === cols - 1 ? 0 : state.edgeMap.vertical[row][col],
    bottom: row === rows - 1 ? 0 : state.edgeMap.horizontal[row][col],
    left: col === 0 ? 0 : -state.edgeMap.vertical[row][col - 1]
  };
}

function edgeTop(edge, depth) {
  if (edge === 0) {
    return "L 100 0";
  }
  return `L 34 0 C 36 ${-edge * depth} 64 ${-edge * depth} 66 0 L 100 0`;
}

function edgeRight(edge, depth) {
  if (edge === 0) {
    return "L 100 100";
  }
  return `L 100 34 C ${100 + edge * depth} 36 ${100 + edge * depth} 64 100 66 L 100 100`;
}

function edgeBottom(edge, depth) {
  if (edge === 0) {
    return "L 0 100";
  }
  return `L 66 100 C 64 ${100 + edge * depth} 36 ${100 + edge * depth} 34 100 L 0 100`;
}

function edgeLeft(edge, depth) {
  if (edge === 0) {
    return "L 0 0";
  }
  return `L 0 66 C ${-edge * depth} 64 ${-edge * depth} 36 0 34 L 0 0`;
}

function makePiecePath(edges) {
  const depth = 18;
  return [
    "M 0 0",
    edgeTop(edges.top, depth),
    edgeRight(edges.right, depth),
    edgeBottom(edges.bottom, depth),
    edgeLeft(edges.left, depth),
    "Z"
  ].join(" ");
}

function createPieceSvg(piece) {
  const { rows, cols } = state.difficulty;
  const row = Math.floor(piece.correctIndex / cols);
  const col = piece.correctIndex % cols;
  const pathData = makePiecePath(getPieceEdges(piece.correctIndex));
  const clipId = `clip-${piece.id}`;

  const svg = document.createElementNS(SVG_NS, "svg");
  svg.classList.add("piece-svg");
  svg.setAttribute("viewBox", "-18 -18 136 136");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");

  const defs = document.createElementNS(SVG_NS, "defs");
  const clipPath = document.createElementNS(SVG_NS, "clipPath");
  clipPath.setAttribute("id", clipId);
  clipPath.setAttribute("clipPathUnits", "userSpaceOnUse");

  const clipShape = document.createElementNS(SVG_NS, "path");
  clipShape.setAttribute("d", pathData);
  clipPath.append(clipShape);
  defs.append(clipPath);

  const backer = document.createElementNS(SVG_NS, "path");
  backer.classList.add("piece-backer");
  backer.setAttribute("d", pathData);

  const image = document.createElementNS(SVG_NS, "image");
  image.setAttribute("href", state.imageData);
  image.setAttributeNS(XLINK_NS, "href", state.imageData);
  image.setAttribute("x", (-col * 100).toString());
  image.setAttribute("y", (-row * 100).toString());
  image.setAttribute("width", (cols * 100).toString());
  image.setAttribute("height", (rows * 100).toString());
  image.setAttribute("preserveAspectRatio", "none");
  image.setAttribute("clip-path", `url(#${clipId})`);

  const outline = document.createElementNS(SVG_NS, "path");
  outline.classList.add("piece-outline");
  outline.setAttribute("d", pathData);

  svg.append(defs, backer, image, outline);
  return svg;
}

function createPieceElement(piece, area) {
  const button = document.createElement("button");
  button.className = "jigsaw-piece";
  button.type = "button";
  button.draggable = !state.solved;
  button.dataset.pieceId = piece.id;
  button.dataset.area = area;
  button.setAttribute("aria-label", `Puzzleteil ${piece.correctIndex + 1}`);
  button.classList.toggle("is-selected", state.selectedPieceId === piece.id);
  button.classList.toggle("is-correct", area === "board" && piece.currentSlot === piece.correctIndex);
  button.append(createPieceSvg(piece));
  return button;
}

function renderBoard() {
  const { rows, cols } = state.difficulty;
  const total = rows * cols;
  const piecesBySlot = new Map();

  state.pieces.forEach((piece) => {
    if (piece.currentSlot !== null) {
      piecesBySlot.set(piece.currentSlot, piece);
    }
  });

  board.innerHTML = "";
  board.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
  board.style.gridTemplateRows = `repeat(${rows}, minmax(0, 1fr))`;
  board.style.setProperty("--preview-image", `url("${state.imageData}")`);
  board.classList.toggle("is-preview", state.previewMode);
  board.classList.toggle("has-selection", state.selectedPieceId !== null);

  for (let slotIndex = 0; slotIndex < total; slotIndex += 1) {
    const slot = document.createElement("div");
    const piece = piecesBySlot.get(slotIndex);

    slot.className = "slot";
    slot.dataset.slot = slotIndex.toString();
    slot.setAttribute("role", "button");
    slot.setAttribute("tabindex", "0");
    slot.setAttribute("aria-label", `Puzzle-Position ${slotIndex + 1}`);
    slot.classList.toggle("has-piece", Boolean(piece));
    slot.classList.toggle("is-correct", Boolean(piece && piece.currentSlot === piece.correctIndex));
    slot.classList.toggle("is-target", state.selectedPieceId !== null && !state.solved);

    if (piece) {
      slot.append(createPieceElement(piece, "board"));
    }

    board.append(slot);
  }
}

function renderTray() {
  const trayPieces = state.trayOrder
    .map((pieceId) => getPieceById(pieceId))
    .filter((piece) => piece && piece.currentSlot === null);

  pieceTray.innerHTML = "";
  pieceTray.classList.toggle("is-empty", trayPieces.length === 0);
  pieceTray.classList.toggle("has-selection", state.selectedPieceId !== null);

  trayPieces.forEach((piece) => {
    pieceTray.append(createPieceElement(piece, "tray"));
  });
}

function renderAll() {
  renderTray();
  renderBoard();
  updateStats();
}

function placePiece(pieceId, slotIndex) {
  const incoming = getPieceById(pieceId);
  if (!incoming || state.solved) {
    return;
  }

  const previousSlot = incoming.currentSlot;
  if (previousSlot === slotIndex) {
    state.selectedPieceId = null;
    renderAll();
    return;
  }

  const occupant = state.pieces.find((piece) => piece.currentSlot === slotIndex && piece.id !== incoming.id);
  if (occupant) {
    occupant.currentSlot = previousSlot;
    if (previousSlot === null) {
      addToTrayOrder(occupant.id);
    }
  }

  incoming.currentSlot = slotIndex;
  removeFromTrayOrder(incoming.id);
  state.moves += 1;
  state.selectedPieceId = null;

  if (isSolved()) {
    finishPuzzle();
    return;
  }

  renderAll();
}

function returnPieceToTray(pieceId) {
  const piece = getPieceById(pieceId);
  if (!piece || state.solved) {
    return;
  }

  if (piece.currentSlot === null) {
    state.selectedPieceId = null;
    renderAll();
    return;
  }

  piece.currentSlot = null;
  addToTrayOrder(piece.id);
  state.moves += 1;
  state.selectedPieceId = null;
  renderAll();
}

function finishPuzzle() {
  state.solved = true;
  stopTimer();
  completeSummary.textContent = `${state.moves} Züge in ${formatTime(elapsedSeconds())}`;
  renderAll();
  completeBanner.hidden = false;
}

function toggleSelectedPiece(pieceId) {
  if (state.solved) {
    return;
  }

  state.selectedPieceId = state.selectedPieceId === pieceId ? null : pieceId;
  renderAll();
}

function handleBoardClick(event) {
  const pieceButton = event.target.closest(".jigsaw-piece");
  if (pieceButton) {
    toggleSelectedPiece(pieceButton.dataset.pieceId);
    return;
  }

  const slot = event.target.closest(".slot");
  if (slot && state.selectedPieceId) {
    placePiece(state.selectedPieceId, Number(slot.dataset.slot));
  }
}

function handleTrayClick(event) {
  const pieceButton = event.target.closest(".jigsaw-piece");
  if (pieceButton) {
    toggleSelectedPiece(pieceButton.dataset.pieceId);
    return;
  }

  if (state.selectedPieceId) {
    returnPieceToTray(state.selectedPieceId);
  }
}

function handleSlotKeyDown(event) {
  const slot = event.target.closest(".slot");
  if (!slot || !state.selectedPieceId || !["Enter", " "].includes(event.key)) {
    return;
  }

  event.preventDefault();
  placePiece(state.selectedPieceId, Number(slot.dataset.slot));
}

function handleDragStart(event) {
  const pieceButton = event.target.closest(".jigsaw-piece");
  if (!pieceButton || state.solved) {
    return;
  }

  state.draggedPieceId = pieceButton.dataset.pieceId;
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", state.draggedPieceId);
}

function handleDragEnd() {
  state.draggedPieceId = null;
}

function handleDragOver(event) {
  if (state.draggedPieceId) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }
}

function handleBoardDrop(event) {
  event.preventDefault();
  const slot = event.target.closest(".slot");
  const pieceId = state.draggedPieceId || event.dataTransfer.getData("text/plain");

  if (slot && pieceId) {
    placePiece(pieceId, Number(slot.dataset.slot));
  }

  state.draggedPieceId = null;
}

function handleTrayDrop(event) {
  event.preventDefault();
  const pieceId = state.draggedPieceId || event.dataTransfer.getData("text/plain");

  if (pieceId) {
    returnPieceToTray(pieceId);
  }

  state.draggedPieceId = null;
}

function renderSamples() {
  sampleList.innerHTML = "";
  samples.forEach((sample) => {
    const button = document.createElement("button");
    const image = document.createElement("img");

    button.className = "sample-button";
    button.type = "button";
    button.dataset.sample = sample.id;
    button.setAttribute("aria-label", `${sample.name} auswählen`);
    button.classList.toggle("is-active", state.imageSrc === sample.src);

    image.src = sample.src;
    image.alt = "";
    image.loading = "lazy";
    button.append(image);
    sampleList.append(button);
  });
}

function renderDifficulties() {
  difficultyButtons.innerHTML = "";
  difficulties.forEach((difficulty) => {
    const total = difficulty.rows * difficulty.cols;
    const button = document.createElement("button");
    const label = document.createElement("strong");
    const count = document.createElement("span");

    button.className = "difficulty-button";
    button.type = "button";
    button.dataset.difficulty = difficulty.id;
    button.classList.toggle("is-active", state.difficulty.id === difficulty.id);

    label.textContent = difficulty.label;
    count.textContent = `${total} Teile`;
    button.append(label, count);
    difficultyButtons.append(button);
  });
}

function syncStatusVisibility() {
  statGrid.hidden = !state.statsVisible;
  statusToggle.setAttribute("aria-pressed", state.statsVisible.toString());
  statusToggle.textContent = state.statsVisible ? "Status ausblenden" : "Status einblenden";
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
  state.puzzleId += 1;
  state.selectedPieceId = null;
  state.draggedPieceId = null;
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
  startTimer();
  renderSamples();
  renderDifficulties();
  syncStatusVisibility();
  renderAll();
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
  previewToggle.textContent = state.previewMode ? "Vorschau ausblenden" : "Vorschau zeigen";
  renderAll();
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

board.addEventListener("click", handleBoardClick);
board.addEventListener("keydown", handleSlotKeyDown);
board.addEventListener("dragstart", handleDragStart);
board.addEventListener("dragend", handleDragEnd);
board.addEventListener("dragover", handleDragOver);
board.addEventListener("drop", handleBoardDrop);
pieceTray.addEventListener("click", handleTrayClick);
pieceTray.addEventListener("dragstart", handleDragStart);
pieceTray.addEventListener("dragend", handleDragEnd);
pieceTray.addEventListener("dragover", handleDragOver);
pieceTray.addEventListener("drop", handleTrayDrop);
imageUpload.addEventListener("change", handleUpload);
shuffleButton.addEventListener("click", () => newPuzzle({ keepImage: true }));
previewToggle.addEventListener("click", togglePreview);
statusToggle.addEventListener("click", () => {
  state.statsVisible = !state.statsVisible;
  syncStatusVisibility();
});

prepareImage(state.imageSrc, state.imageName);
renderSamples();
renderDifficulties();
syncStatusVisibility();
newPuzzle({ keepImage: true });
