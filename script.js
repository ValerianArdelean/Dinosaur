function handleButton(button) {
	const userInput = prompt("Enter name:");
	button.textContent = userInput;
}

let grid = document.getElementById("game");

function createCells() {
	for (let i = 10; i < 35; ++i) {
		let line = document.createElement("div");
		line.classList.add("flex", "line");
		for (let j = 10; j < 75; ++j) {
			let cell = document.createElement("div");
			cell.id = `${i}${j}`;
			cell.classList.add("cell");
			line.appendChild(cell);
		}
		grid.appendChild(line);
	}
}

function createGround() {
	function ground(line, col, status) {
		cell = selectCell(line, col);
		span = document.createElement("span");
		cell.appendChild(span);
		cell.classList[status]("runway");
	}
	for (let i = -8; i < 57; ++i) {
		ground(33, 18 + i, "add");
	}
}

let timerInterval;
let elapsedTime = 0;

function startTimer() {
	const scoreElement = document.getElementById("score");
	elapsedTime = 0;

	timerInterval = setInterval(() => {
		elapsedTime++;
		const minutes = String(Math.floor(elapsedTime / 60)).padStart(2, '0');
		const seconds = String(elapsedTime % 60).padStart(2, '0');
		scoreElement.innerText = `${minutes}:${seconds}`;
	}, 1000);
}

function stopTimer() {
	clearInterval(timerInterval);
}

let coordinates = [28, 22];
let gameOver = false;

const MIN_HEIGHT = 10;
const MAX_HEIGHT = 28;

function updateCoordinates(sign) {
	let newHeight = coordinates[0] + sign;
	if (newHeight > MIN_HEIGHT && newHeight <= MAX_HEIGHT) {
		coordinates[0] = newHeight;
	}
}

function selectCell(line, col) {
	return document.getElementById(`${line}${col}`);
}

function updateDinoDisplay(status) {
	const DINO_SHAPE = [
		[0, 1], [0, 2], [1, 1], [1, 2], [2, 1],// head, neck
		[2, -1], [3, -1], [3, 0], [3, 1], [3, 2], [4, 1], [4, 0], [4,-1],// body, tail, hand
		[5, 1], [5, -1]//legs
	];
	DINO_SHAPE.forEach(([x, y]) => {
		selectCell(coordinates[0] + x, coordinates[1] + y).classList[status]("red");
	});
}

function gameO() {
	const SENTENCE_SHAPE = [
		// G
		[18, 18], [18, 19], [18, 20], [18, 21], [18, 22], [18, 22], // Top bar
		[19, 18], [20, 18], [21, 18], [22, 18], // Left vertical
		[22, 19], [22, 20], [22, 21], [22, 22], // Bottom bar
		[21, 22], [20, 22], // Right vertical
		[20, 20], [20, 21], [20, 22], // Middle bar

		// A
		[18, 26], [19, 25], [19, 27], [20, 24], [20, 28],
		[20, 24], [20, 25], [20, 26], [20, 27], [20, 28], // Middle bar
		[21, 24], [22, 24], [21, 28], [22, 28],
		

		// M
		[18, 30], [19, 30], [20, 30], [21, 30], [22, 30], // Left vertical
		[20, 32], [19, 31], // Middle diagonal up
		[19, 33], // Right vertical
		[18, 34], [19, 34], [20, 34], [21, 34], [22, 34], // Small middle base

		// E
		[18, 36], [18, 37], [18, 38], [18, 39], [18, 40], // Top bar
		[19, 36], [20, 36], [21, 36], [22, 36], // Left vertical
		[20, 37], [20, 38], // Middle bar
		[22, 36], [22, 37], [22, 38], [22, 39], [22, 40], // Bottom bar

		// Space between "GAME" and "OVER"

		// O
		[18, 46], [18, 45], [18, 47], [18, 44], [20, 43], [19, 43], [21, 43], [19, 48], [20, 48], [21, 48],
		[22, 46], [22, 45], [22, 44], [22, 47],

		// V
		[22, 52], [21, 51], [20, 50],
		[21, 53], [20, 54],
		[19, 50], [19, 54], [18, 50], [18, 54],

		// E
		[18, 56], [18, 57], [18, 58], [18, 59], [18, 60], // Top bar
		[19, 56], [20, 56], [21, 56], [22, 56], // Left vertical
		[20, 57], [20, 58], // Middle bar
		[22, 56], [22, 57], [22, 58], [22, 59], [22, 60], // Bottom bar

		// R
		[18, 63], [19, 62], [20, 62], [21, 62], [22, 62], // Left vertical
		[18, 63], [18, 64], [18, 65], [19, 66],
		[20, 63], [20, 64], [20, 65],
		[21, 65], [22, 66],
	];

	SENTENCE_SHAPE.forEach(([x, y]) => {
		selectCell(x, y).classList.add("red");
	});
}

function updateCactusDisplay(column, status, type) {
	const CACTUS_SHAPE = [[], [
		[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0],
		[2, 1], [2, 2], [3, 2],
		[1, -1], [1, -2], [2, -2], [3, -2]
	], [
		[0, 0], [1, 0], [2, 0], [3, 0], [4, 0],
		[2, 1], [2, 2], [3, 2],
		[1, -1], [1, -2], [2, -2],

		[0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4],
		[2, 5], [2, 6], [3, 6],
		[1, 3], [1, 2]
	]];

	CACTUS_SHAPE[type].forEach(([x, y]) => {
		if (column - y > 10) {
			let cell = selectCell(32 - x, column - y);
			if (cell.classList.contains("red") && status == "add") {
				gameOver = true;
				gameO();
				stopTimer();
				document.getElementById("HighestScore").innerHTML = document.getElementById("score").innerHTML;
			}
			cell.classList[status]("red");
		}
	});
}

let gameRunning = false;

function startGame() {
	if (!gameRunning) {
		gameRunning = true;
		setInterval(displayCactuses, 1100);
		startTimer();
	}
}

function displayCactuses() {
	let noCactuses = Math.floor(Math.random() * 2) + 1;
	let j = 54;
	let cactus = setInterval(function () {
		updateCactusDisplay(18 + j, "remove", noCactuses);
		--j;
		updateCactusDisplay(18 + j, "add", noCactuses);
		if (gameOver) {
			clearInterval(cactus);
			if (j <= -6) {
				updateCactusDisplay(18 + j, "remove", noCactuses);
			}
		}
	}, 30);
}

let jumps = 0;
function handleKeyboardInput() {
	document.addEventListener('keydown', function(event) {
		if (event.key === 'ArrowUp') {
			startGame();
			if (jumps == 0) {
				jumpDino();
			}
			++jumps;
		}
	});
}

function jumpDino() {
	const VELOCITY = [[15, 10], [30, 2], [50, 1]];
	const SPEED = 0;
	const TIME = 1;
	let height = 0, direction = 1;
	function startTimer(speed, steps, sign) {
		let step = 0;
		let timer = setInterval(function() {
			updateDinoDisplay("remove");
			updateCoordinates(sign);
			updateDinoDisplay("add");
			++step;
			if (step == steps) {
				clearInterval(timer);
				height += direction;
				if (height == 3) {
					direction = -1;
					height = 2;
				}
				startTimer(VELOCITY[height][SPEED], VELOCITY[height][TIME], -direction);
			}
			if (coordinates[0] == 27 && direction == -1) {
				jumps = 0;
			}
		}, speed);
	}
	startTimer(VELOCITY[height][SPEED], VELOCITY[height][TIME], -direction);
}

function restart() {
	grid.innerHTML = "";
	createCells();
	createGround();
	updateDinoDisplay("add");
	gameOver = false;
	elapsedTime = 0;
}

createCells();
createGround();
updateDinoDisplay("add");
handleKeyboardInput();
