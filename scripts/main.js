import { newGame } from "./game.js";
import { generateWords } from "./utils.js";
import { displayMetricsTable, updateChart } from "./tracking.js";
import "./events.js";

const wordsContainer = document.getElementById("game-container");
const newGameButton = document.getElementById("new-game-button");

async function restoreMetrics() {
  const metricsData = JSON.parse(localStorage.getItem("metrics")) || [];
  if (metricsData.length > 0) {
    updateChart(metricsData); // Assuming the updateChart function needs metrics data
    displayMetricsTable(metricsData); // Same for displayMetricsTable
  }
}

async function startGame() {
  const words = await generateWords(wordsContainer); // Wait for words to be generated
  newGame(words); // Assuming newGame needs words to start
  restoreMetrics();
}

// Function to handle game restart
function restartGame() {
  location.reload();
}

// Attach event listeners for game restart
newGameButton.addEventListener("click", restartGame);
document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    restartGame();
  }
});

startGame();
