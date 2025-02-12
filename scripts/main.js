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

// Set up "New Game" button
document.getElementById('new-game-button').addEventListener('click', async function () {
    gameOver();
    newGame();
});

startGame();
