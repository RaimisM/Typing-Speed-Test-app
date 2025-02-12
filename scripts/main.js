import { newGame, gameOver } from './game.js';
import { randomWord, splitWord } from './utils.js';
import './events.js';

const wordsContainer = document.getElementById('game-container');

async function generateWords() {
    wordsContainer.innerHTML = '';

    for (let i = 0; i < 200; i++) {
        const word = await randomWord();
        wordsContainer.innerHTML += splitWord(word);
    }
}

//Ensure words are loaded before starting the game
async function startGame() {
    await generateWords();
    newGame();
}

// Handle 'New Game' button click to reload the page and reset everything
document.getElementById('new-game-button').addEventListener('click', function () {
    location.reload(); // Reload the page to restart the game
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        location.reload(); // Reload the page to restart the game
    }
});

startGame();
