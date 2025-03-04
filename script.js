document.getElementById("btn1").addEventListener("click", function() {
	const userInput = prompt("Enter name:");
	this.textContent = userInput;
});

function createCells () {
	let grid = document.getElementById("game");
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

let coordonates = [28, 20];

function updateCoordonates(sign) {
	coordonates[0] += parseInt(sign);
}

function selectCell(line, col) {
	return document.getElementById(`${line}${col}`);
}

function dino(status) {
	const DINO_SHAPE = [
		[0, 1], [0, 2], [1, 1], [1, 2], [2, 1],// head, neck
		[2, -1], [3, -1], [3, 0], [3, 1], [3, 2], [4, 1], [4, 0], [4,-1],// body, tail, hand
		[5, 1], [5, -1]//legs
	];
	DINO_SHAPE.forEach(([dx, dy]) => {
		selectCell(coordonates[0] + dx, coordonates[1] + dy).classList[status]("red");
	});
}

function handleKeyboardInput() {
	document.addEventListener('keydown', function(event) {
		if (event.key === 'ArrowUp') {
			const SPEEDS = [[15, 5], [30, 2], [50, 1]], SPEED = 0, STEP = 1;
			let height = 0, direction = 1;
			function startTimer(speed, steps, sign) {
				let step = 0;
				let timer = setInterval(function() {
					dino("remove");
					updateCoordonates(sign);
					dino("add");
					++step;
					if (step == steps) {
						clearInterval(timer);
						height += direction;
						if (height == 3) {
							direction = -1;
							height = 2;
						}
						startTimer(SPEEDS[height][SPEED], SPEEDS[height][STEP], -direction);
					}
				}, speed);
			}
			startTimer(SPEEDS[height][SPEED], SPEEDS[height][STEP], -direction);
		}
	});
}

createCells();
dino("add");
handleKeyboardInput();
