import { addClass, removeClass, randomWord, splitWord } from './utils.js';
import { getWpm, startTimer, startWpmTracking, trackKeystrokes } from './typing.js'; // Make sure trackKeystrokes is imported

const wordsContainer = document.getElementById('game-container');

export const gameTimer = 60 * 1000;
window.timer = null;
window.gameStart = null;
window.gameOver = false;

export async function newGame() {
    wordsContainer.innerHTML = '';
    window.gameOver = false; // Reset the game over flag

    // Generate 200 random words and add to the game container
    for (let i = 0; i < 200; i++) {
        const word = await randomWord();
        wordsContainer.innerHTML += splitWord(word);
    }

    // Set first word and letter as current
    addClass(document.querySelector('.word'), 'current');
    addClass(document.querySelector('.word .letter'), 'current');
    moveCursor();

    window.timer = null;
    window.gameStart = null;

    // Start the game on the first keypress
    document.addEventListener('keydown', startGameOnFirstKeypress, { once: true });
}

// Start the game when the first key is pressed
function startGameOnFirstKeypress(event) {
    if (!window.gameStart) {
        window.gameStart = new Date().getTime();
        startTimer();
        startWpmTracking();
    }
}

// Prevent typing if the game is over
document.addEventListener('keydown', (event) => {
    if (window.gameOver) {
        event.preventDefault(); // Stop the key press
        return;
    }

    handleTyping(event); // Call the function that processes typing
});

function handleTyping(event) {
    if (window.gameOver) return; // Ensure typing is blocked when game is over

    trackKeystrokes(event); // Track the keystrokes for accuracy
}

// Game over function
export function gameOver() {
    console.log("Game over triggered!"); // Debugging
    clearInterval(window.timer);
    window.gameOver = true; // Set game over flag

    addClass(document.getElementById('game'), 'over');

    const wpm = getWpm();
    document.getElementById('wpmTracker').textContent = `${wpm}`;
    document.getElementById('timer').textContent = "0"; // Ensure timer shows 0

    console.log("Game Over flag set:", window.gameOver); // Check if flag is set
}

// Move cursor function
export function moveCursor() {
    const nextLetter = document.querySelector('.letter.current');
    const cursor = document.getElementById('cursor');

    if (cursor && nextLetter) {
        const rect = nextLetter.getBoundingClientRect();
        cursor.style.top = `${rect.top}px`;
        cursor.style.left = `${rect.left}px`;
    }
}

// Move to the next word
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

