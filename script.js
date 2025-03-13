const MIN_DINO_HEIGHT = 10;
const MAX_DINO_HEIGHT = 28;
const START_GRID = 10;
const GRID_HEIGHT = 34;
const GRID_WIDTH = 74;

let game = {
	grid : document.getElementById("game"),
	dinoCoordinates : [28, 22],
	jumps : 0,
	timerInterval : 0,
	elapsedTime : 0,
	scoreElement : document.getElementById("score"),
	minutes : 0,
	seconds : 0,
	gameOver : false,
	gameRunning : false
}

function handleButton(button) {
	button.textContent = prompt("Enter name:");
}

function startTimer() {
	game.elapsedTime = 0;

	game.timerInterval = setInterval(() => {
		++game.elapsedTime;
		game.minutes = String(Math.floor(game.elapsedTime / 60)).padStart(2, '0');
		game.seconds = String(game.elapsedTime % 60).padStart(2, '0');
		game.scoreElement.innerText = `${game.minutes}:${game.seconds}`;
	}, 1000);
}

function stopTimer() {
	clearInterval(game.timerInterval);
}

function createCells() {
	for (let i = START_GRID; i <= GRID_HEIGHT; ++i) {
		let line = document.createElement("div");
		line.classList.add("flex", "line");
		for (let j = START_GRID; j <= GRID_WIDTH; ++j) {
			let cell = document.createElement("div");
			cell.id = `${i}${j}`;
			cell.classList.add("cell");
			line.appendChild(cell);
		}
		game.grid.appendChild(line);
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

function updateCoordinates(sign) {
	let newHeight = game.dinoCoordinates[0] + sign;
	if (newHeight > MIN_DINO_HEIGHT && newHeight <= MAX_DINO_HEIGHT) {
		game.dinoCoordinates[0] = newHeight;
	}
}

function selectCell(line, col) {
	return document.getElementById(`${line}${col}`);
}

function updateDinoDisplay(status) {
	const DINO_SHAPE = [
		[0, 1], [0, 2], [1, 1], [1, 2], [2, 1],
		[2, -1], [3, -1], [3, 0], [3, 1], [3, 2], [4, 1], [4, 0], [4,-1],
		[5, 1], [5, -1]
	];
	
	DINO_SHAPE.forEach(([x, y]) => {
		selectCell(game.dinoCoordinates[0] + x, game.dinoCoordinates[1] + y).classList[status]("red");
	});
}

function gameOver() {
	const SENTENCE_SHAPE = [
		// G
		[18, 18], [18, 19], [18, 20], [18, 21], [18, 22], [18, 22],
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
				game.gameOver = true;
				gameOver();
				stopTimer();
				document.getElementById("HighestScore").innerHTML = document.getElementById("score").innerHTML;
			}
			cell.classList[status]("red");
		}
	});
}

function startGame() {
	if (!game.gameRunning) {
		game.gameRunning = true;
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
		if (game.gameOver) {
			clearInterval(cactus);
			if (j <= -6) {
				updateCactusDisplay(18 + j, "remove", noCactuses);
			}
		}
	}, 30);
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
			if (game.dinoCoordinates[0] == 27 && direction == -1) {
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
	updateDinoDisplay("add");
	game.gameOver = false;
	game.elapsedTime = 0;
	game.timerInterval = 0;
	game.minutes = 0;
	game.seconds = 0;
	game.jumps = 0;
	stopTimer();
}

createCells();
createGround();
updateDinoDisplay("add");
handleKeyboardInput();
