// main.js
import { newGame, gameOver, moveCursor } from './game.js';
import { randomWord, splitWord } from './utils.js';
import { startTimer, startWpmTracking, trackKeystrokes, storeMetrics, getWpm, displayMetricsTable, updateChart, updateAccuracy } from './typing.js';
import './events.js';

const wordsContainer = document.getElementById('game-container');

async function generateWords() {
    wordsContainer.innerHTML = '';
    let words = [];

    for (let i = 0; i < 200; i++) {
        const word = await randomWord();
        words.push(word);
        wordsContainer.innerHTML += splitWord(word);
    }

    sessionStorage.setItem("initialWords", JSON.stringify(words));
    sessionStorage.setItem("initialTimer", 60);
    sessionStorage.setItem("initialAccuracy", 0);
}

function restoreMetrics() {
    const metricsData = JSON.parse(localStorage.getItem('metrics')) || [];
    if (metricsData.length > 0) {
        updateChart();
        displayMetricsTable();
    }
}

async function startGame() {
    await generateWords();
    newGame();  // Call newGame first
    restoreMetrics(); // Then restore metrics
}

document.getElementById('new-game-button').addEventListener('click', function () {
    location.reload();
});

document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        location.reload();
    }
});

startGame();