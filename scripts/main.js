import { newGame, gameOver, moveCursor } from './game.js';
import { randomWord, splitWord } from './utils.js'; // Import functions to generate and format words
import { startTimer, storeMetrics, getWpm, displayMetricsTable, updateChart, updateAccuracy } from './typing.js'; // Import updateChart
import './events.js';

const wordsContainer = document.getElementById('game-container');

// Function to generate words and save the initial game state in sessionStorage
async function generateWords() {
    wordsContainer.innerHTML = ''; // Clear the game container
    let words = []; // Array to store words

    // Generate and display words
    for (let i = 0; i < 200; i++) {
        const word = await randomWord(); // Get random word
        words.push(word); // Add word to the array
        wordsContainer.innerHTML += splitWord(word); // Display word in game container
    }

    // Save the initial game state to sessionStorage
    sessionStorage.setItem("initialWords", JSON.stringify(words));
    sessionStorage.setItem("initialTimer", 60); // Set initial timer value to 60 seconds
    sessionStorage.setItem("initialAccuracy", 0); // Set initial accuracy (can track later)
}

function restoreMetrics() {
    const metricsData = JSON.parse(localStorage.getItem('metrics')) || [];
    if (metricsData.length > 0) {
        updateChart(); // Ensure the chart is updated
        displayMetricsTable(); // Optionally, display the metrics in a table
    }
}

// Ensure words are loaded before starting the game
async function startGame() {
    await generateWords(); // Generate and store words in sessionStorage
    newGame(); // Start the game logic
}

// Handle 'New Game' button click to reload the page and reset everything
document.getElementById('new-game-button').addEventListener('click', function () {
    location.reload(); // Reload page to reset game
});

// Listen for 'Enter' key press to reload the page
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        location.reload(); // Reload page if 'Enter' is pressed
    }
});



startGame(); // Start the game when the page loads
