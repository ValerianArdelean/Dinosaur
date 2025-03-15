const MIN_DINO_HEIGHT = 10;
const MAX_DINO_HEIGHT = 28;
const START_GRID = 10;
const GROUND_FLOOR = 32;
const GRID_HEIGHT = 34;
const GRID_WIDTH = 74;
const DINO_POS = 22;
const DINO_SHAPE = [
	[0, 1], [0, 2], [1, 1], [1, 2], [2, 1],
	[2, -1], [3, -1], [3, 0], [3, 1], [3, 2], [4, 1], [4, 0], [4,-1],
	[5, 1], [5, -1]
];
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
const GAME_OVER_SHAPE = [
	// G
	[18, 18], [18, 19], [18, 20], [18, 21], [18, 22],
	[19, 18], [20, 18], [21, 18], [22, 18],
	[22, 19], [22, 20], [22, 21], [22, 22],
	[21, 22], [20, 22],
	[20, 20], [20, 21], [20, 22],
	// A
	[18, 26], [19, 25], [19, 27], [20, 24], [20, 28],
	[20, 24], [20, 25], [20, 26], [20, 27], [20, 28],
	[21, 24], [22, 24], [21, 28], [22, 28],
	// M
	[18, 30], [19, 30], [20, 30], [21, 30], [22, 30],
	[20, 32], [19, 31],
	[19, 33],
	[18, 34], [19, 34], [20, 34], [21, 34], [22, 34],
	// E
	[18, 36], [18, 37], [18, 38], [18, 39], [18, 40],
	[19, 36], [20, 36], [21, 36], [22, 36],
	[20, 37], [20, 38],
	[22, 36], [22, 37], [22, 38], [22, 39], [22, 40],
	// O
	[18, 46], [18, 45], [18, 47], [18, 44], [20, 43], [19, 43],
	[21, 43], [19, 48], [20, 48], [21, 48],
	[22, 46], [22, 45], [22, 44], [22, 47],
	// V
	[22, 52], [21, 51], [20, 50],
	[21, 53], [20, 54],
	[19, 50], [19, 54], [18, 50], [18, 54],
	// E
	[18, 56], [18, 57], [18, 58], [18, 59], [18, 60],
	[19, 56], [20, 56], [21, 56], [22, 56],
	[20, 57], [20, 58],
	[22, 56], [22, 57], [22, 58], [22, 59], [22, 60],
	// R
	[18, 63], [19, 62], [20, 62], [21, 62], [22, 62],
	[18, 63], [18, 64], [18, 65], [19, 66],
	[20, 63], [20, 64], [20, 65],
	[21, 65], [22, 66],
];

let game = {
	grid : document.getElementById("game"),
	scoreElement : document.getElementById("score"),
	dinoHeight : 28,
	jumps : 0,
	gameOver : false,
	gameRunning : false,
	time : {interval : 0, elapsed : 0, minutes : 0, seconds : 0}
}

function handleButton(button) {
	button.textContent = prompt("Enter name:");
}

function startTimer() {
	const MINUTE_IN_SECONDS = 60;
	const SECOND_IN_MILLISECONDS = 1000;
	game.time.elapsed = 0;

	game.time.interval = setInterval(() => {
		++game.time.elapsed;
		game.time.minutes = String(Math.floor(game.time.elapsed / MINUTE_IN_SECONDS)).padStart(2, '0');
		game.time.seconds = String(game.time.elapsed % MINUTE_IN_SECONDS).padStart(2, '0');
		game.scoreElement.innerText = `${game.time.minutes}:${game.time.seconds}`;
	}, SECOND_IN_MILLISECONDS);
}

function createCells() {
	for (let i = START_GRID; i <= GRID_HEIGHT; ++i) {
		let line = document.createElement("div");
		line.classList.add("flex", "wrap", "line");
		for (let j = START_GRID; j <= GRID_WIDTH; ++j) {
			let cell = document.createElement("div");
			cell.id = `${i}${j}`;
			cell.classList.add("cell", "relative");
			line.appendChild(cell);
		}
		game.grid.appendChild(line);
	}
}

function createGround() {
	function createCell(line, col, status) {
		let cell = selectCell(line, col);
		let span = document.createElement("span");
		cell.appendChild(span);
		cell.classList[status]("runway", "relative");
	}
	
	for (let i = START_GRID; i < GRID_WIDTH; ++i) {
		createCell(GRID_HEIGHT - 1, i, "add");
	}
}

function updateHighestTime() {
	if (game.scoreElement.innerText > document.getElementById("HighestScore").innerText) {
		document.getElementById("HighestScore").innerText = game.scoreElement.innerText;
	}
}

function updateCoordinates(sign) {
	let newHeight = game.dinoHeight + sign;
	if (newHeight > MIN_DINO_HEIGHT && newHeight <= MAX_DINO_HEIGHT) {
		game.dinoHeight = newHeight;
	}
}

function selectCell(line, col) {
	return document.getElementById(`${line}${col}`);
}

function toggleCells(status, shape, line, col) {
	shape.forEach(([x, y]) => {
		selectCell(line + x, col + y).classList[status]("gray");
	});
}

function gameOver() {
	game.gameOver = true;
	toggleCells("add", GAME_OVER_SHAPE, 0, 0);
}

function updateCactusDisplay(column, status, type, shape) {
	shape[type].forEach(([x, y]) => {
		if (column - y > START_GRID) {
			let cell = selectCell(GROUND_FLOOR - x, column - y);
			if (cell.classList.contains("gray") && status == "add") {
				gameOver();
				clearInterval(game.time.interval);
				updateHighestTime();
			}
			cell.classList[status]("gray");
		}
	});
}

function displayCactus() {
	const SPEED = 30;
	let noCactuses = Math.floor(Math.random() * 2) + 1;
	let cactusPos = GRID_WIDTH - 2;
	let cactus = setInterval(function () {
		updateCactusDisplay(cactusPos, "remove", noCactuses, CACTUS_SHAPE);
		--cactusPos;
		updateCactusDisplay(cactusPos, "add", noCactuses, CACTUS_SHAPE);
		if (game.gameOver) {
			clearInterval(cactus);
		}
	}, SPEED);
}

function startGame() {
	const RATE = 1100;
	if (!game.gameRunning) {
		game.gameRunning = true;
		let cactuses = setInterval(function () {
			displayCactus();
			if (game.gameOver) {
				clearInterval(cactuses);
			}
		}, RATE);
		startTimer();
	}
}

function handleKeyboardInput() {
	document.addEventListener('keydown', function(event) {
		if (event.key === 'ArrowUp') {
			startGame();
			if (game.jumps == 0) {
				jumpDino();
			}
			++game.jumps;
		}
	});
}

function jumpDino() {
	const VELOCITY = [[15, 10], [30, 2], [50, 1]];
	const SPEED = 0;
	const TIME = 1;
	const MAX_HEIGHT = 3;
	let height = 0, direction = 1;
	function startTimer(speed, steps, sign) {
		let step = 0;
		let timer = setInterval(function() {
			toggleCells("remove", DINO_SHAPE, game.dinoHeight, DINO_POS);
			updateCoordinates(sign);
			toggleCells("add", DINO_SHAPE, game.dinoHeight, DINO_POS);
			++step;
			if (step == steps) {
				clearInterval(timer);
				height += direction;
				if (height == MAX_HEIGHT) {
					direction = -1;
					height = 2;
				}
				startTimer(VELOCITY[height][SPEED], VELOCITY[height][TIME], -direction);
			}
			if (game.dinoHeight == MAX_DINO_HEIGHT - 1 && direction == -1) {
				game.jumps = 0;
			}
		}, speed);
	}
	startTimer(VELOCITY[height][SPEED], VELOCITY[height][TIME], -direction);
}

function restart() {
	game.grid.innerHTML = "";
	createCells();
	createGround();
	toggleCells("add", DINO_SHAPE, game.dinoHeight, DINO_POS);
	game.gameOver = false;
	game.gameRunning = false;
	game.time.minutes = 0;
	game.time.seconds = 0;
}

createCells();
createGround();
toggleCells("add", DINO_SHAPE, game.dinoHeight, DINO_POS);
handleKeyboardInput();
