document.getElementById("btn1").addEventListener("click", function() {
	const userInput = prompt("Enter name:");
	if (userInput !== null && userInput.trim() !== "") {
		this.textContent = userInput;
	}
});
