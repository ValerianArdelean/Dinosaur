document.getElementById("btn1").addEventListener("click", function() {
	const userInput = prompt("Enter name:");
	if (userInput !== null && userInput.trim() !== "") {
		this.textContent = userInput;
	}
});

function createCells () {
	let grid = document.getElementById("game");
	for (let i = 10; i < 35; ++i) {
		let line = document.createElement("div");
		line.id = `${i}`;
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

createCells();

let coordonates = [28, 20];
let head = document.getElementById(`${coordonates[0]}${coordonates[1]}`);
head.classList.add("red");

function jump() {
	let i = 0;
	let goingUp = true;

	let jumpInterval = setInterval(() => {
		head.classList.remove("red");

		// Determine movement direction
		let newX = goingUp ? coordonates[0] - 1 : coordonates[0] + 1;
		let newHead = document.getElementById(`${newX}${coordonates[1]}`);

		// Stop if out of bounds or no valid cell
		if (!newHead) {
			clearInterval(jumpInterval);
			return;
		}

		// Move head to new position
		coordonates[0] = newX;
		head = newHead;
		head.classList.add("red");

		++i;

		// If we reach 10 steps, start falling down
		if (i >= 10) {
			goingUp = false;
		}

		// Stop movement after 20 steps (10 up + 10 down)
		if (i >= 20) {
			clearInterval(jumpInterval);
		}
	}, 30); // Smooth movement with delay
}


function handleKeyboardInputs() {
	document.addEventListener('keydown', function(event) {
		jump();
	});
}

handleKeyboardInputs();
