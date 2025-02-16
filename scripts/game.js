import { addClass, removeClass, randomWord, splitWord } from './utils.js';
import { getWpm, startTimer, startWpmTracking, trackKeystrokes } from './typing.js';

const wordsContainer = document.getElementById('game-container');

export const gameTimer = 60 * 1000;
window.timer = null;
window.gameStart = null;
window.gameOver = false;
window.gameActive = false;

export async function newGame() {
    console.log("Starting a new game...");
    wordsContainer.innerHTML = '';
    window.gameOver = false;
    window.gameActive = false;

    let words = [];

    for (let i = 0; i < 200; i++) {
        const word = await randomWord();
        words.push(word);
        wordsContainer.innerHTML += splitWord(word);
    }

    sessionStorage.setItem("initialWords", JSON.stringify(words));
    sessionStorage.setItem("initialTimer", "60");
    sessionStorage.setItem("initialAccuracy", "0");

    localStorage.setItem("savedWords", JSON.stringify(words));

    addClass(document.querySelector('.word'), 'current');
    addClass(document.querySelector('.word .letter'), 'current');
    moveCursor();

    window.timer = null;
    window.gameStart = null;

    console.log("New game started with fresh words.");
    document.addEventListener('keydown', startGameOnFirstKeypress, { once: true });
}

function resetGame() {
    console.log("Resetting game...");

    if (window.timer) {
        clearInterval(window.timer);
        window.timer = null;
        document.getElementById('timer').textContent = "60";
    }

    document.getElementById('wpmTracker').textContent = "0";
    document.getElementById('accuracy').textContent = "0";
    sessionStorage.setItem("initialAccuracy", "0");

    const savedWords = JSON.parse(sessionStorage.getItem('initialWords')) || [];

    if (savedWords.length > 0) {
        wordsContainer.innerHTML = '';
        savedWords.forEach(word => {
            wordsContainer.innerHTML += splitWord(word);
        });

        addClass(document.querySelector('.word'), 'current');
        addClass(document.querySelector('.word .letter'), 'current');
        moveCursor();

        console.log("Game reset with previous session words.");
    } else {
        console.log("No previous words found. Starting a new game...");
        newGame();
    }

    window.gameOver = false;
    window.gameActive = false;
    window.gameStart = null;

    console.log("Game fully reset: Timer, WPM, Accuracy, Cursor.");
}

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        resetGame();
    }
});

function startGameOnFirstKeypress(event) {
    if (!window.gameActive && event.key.length === 1) {
        console.log("First key press detected:", event.key);
        window.gameActive = true;
        window.gameStart = new Date().getTime();

        if (!window.timer) {
            console.log("Starting timer...");
            startTimer();
            startWpmTracking();
        }
    }
}

document.addEventListener('keydown', (event) => {
    if (window.gameOver) {
        event.preventDefault();
        return;
    }

    handleTyping(event);
});

function handleTyping(event) {
    if (window.gameOver) return;
    if (!window.gameActive) return;

    trackKeystrokes(event);
}

export function gameOver() {
    clearInterval(window.timer);
    window.gameOver = true;
    window.gameActive = false;

    addClass(document.getElementById('game'), 'over');

    const wpm = getWpm();
    document.getElementById('wpmTracker').textContent = `${wpm}`;
    document.getElementById('timer').textContent = "0";
}

export function moveCursor() {
    const nextLetter = document.querySelector('.letter.current');
    const nextWord = document.querySelector('.word.current');
    const cursor = document.getElementById('cursor');

    if (cursor && nextLetter) {
        const rect = nextLetter.getBoundingClientRect();
        cursor.style.top = `${rect.top}px`;
        cursor.style.left = `${rect.left}px`;
    } else {
        const rect = nextWord.getBoundingClientRect();
        cursor.style.top = `${rect.top}px`;
        cursor.style.left = `${rect.right}px`;
    }
}

export function moveToNextWord() {
    const currentWord = document.querySelector('.word.current');
    if (!currentWord) return;
    removeClass(currentWord, 'current');
    let nextWord = currentWord.nextElementSibling;
    while (nextWord && nextWord.textContent.trim() === '') {
        nextWord = nextWord.nextElementSibling;
    }

    if (nextWord) {
        addClass(nextWord, 'current');
        const firstLetter = nextWord.querySelector('.letter');
        if (firstLetter) {
            document.querySelectorAll('.letter.current').forEach(el => removeClass(el, 'current'));
            addClass(firstLetter, 'current');
        }
    }
}

document.addEventListener('keydown', function (event) {
    if (event.key === ' ') {
        const currentWord = document.querySelector('.word.current');
        const remainingLetters = currentWord.querySelectorAll('.letter:not(.correct)');

        if (remainingLetters.length > 0) {
            remainingLetters.forEach(letter => addClass(letter, 'incorrect'));
        }

        moveToNextWord();
    }
});