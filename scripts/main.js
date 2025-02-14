import { newGame, gameOver, moveCursor } from './game.js';
import { randomWord, splitWord } from './utils.js';
import './events.js';


const wordsContainer = document.getElementById('game-container');

// Function to generate words and save session
async function generateWords() {
    wordsContainer.innerHTML = '';

    let words = []; // Store words for session saving

    for (let i = 0; i < 200; i++) {
        const word = await randomWord();
        words.push(word);
        wordsContainer.innerHTML += splitWord(word);
    }


    localStorage.setItem("savedWords", JSON.stringify(words));
}

// Ensure words are loaded before starting the game
async function startGame() {
    await generateWords();
    newGame();
    moveCursor();
}

// Handle 'New Game' button click to reload the page and reset everything
document.getElementById('new-game-button').addEventListener('click', function () {
    location.reload();
});

// Listen for 'Enter' key press to reload the page
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        location.reload();
    }
});

// Restore session when Escape is pressed
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        let savedWords = localStorage.getItem("savedWords");
        if (savedWords) {
            wordsContainer.innerHTML = ''; // Clear existing words
            let words = JSON.parse(savedWords);

            // Rebuild words on screen
            words.forEach(word => {
                wordsContainer.innerHTML += splitWord(word);
            });

            moveCursor(); // Move cursor to start
            console.log("Session restored!");
        } else {
            console.log("No saved session found!");
        }
    }
});



startGame();
