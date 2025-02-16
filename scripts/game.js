import { addClass, removeClass, randomWord, splitWord } from './utils.js';
import { getWpm, startTimer, startWpmTracking, trackKeystrokes } from './typing.js';

const wordsContainer = document.getElementById('game-container');

export const gameTimer = 60 * 1000;
window.timer = null;
window.gameStart = null;
window.gameOver = false;

export async function newGame() {
    console.log("Starting a new game...");
    wordsContainer.innerHTML = '';
    window.gameOver = false;

    let words = []; // Store words for saving

    // Generate 200 random word
    for (let i = 0; i < 200; i++) {
        const word = await randomWord();
        words.push(word);
        wordsContainer.innerHTML += splitWord(word);
    }

    localStorage.setItem("savedWords", JSON.stringify(words));

    // Set first word and letter as current
    addClass(document.querySelector('.word'), 'current');
    addClass(document.querySelector('.word .letter'), 'current');
    moveCursor();

    window.timer = null;
    window.gameStart = null;

    console.log("Timer state before adding event listener:", window.timer);

    // Start the game on the first press
    document.addEventListener('keydown', startGameOnFirstKeypress, { once: true });

    console.log("Game initialized, awaiting first key press...");
}





// Start the game when the first key is pressed
function startGameOnFirstKeypress(event) {
    if (!window.gameActive && event.key.length === 1) {
        console.log("First key press detected:", event.key);
        window.gameActive = true;
        window.gameStart = new Date().getTime();

        console.log("Timer before start:", window.timer);
        if (!window.timer) {
            console.log("Starting timer...");
            startTimer();
            startWpmTracking();
        }
    }
}




// Prevent typing if the game is over
document.addEventListener('keydown', (event) => {
    if (window.gameOver) {
        event.preventDefault();
        return;
    }

    handleTyping(event);
});

function handleTyping(event) {
    if (window.gameOver) return;

    trackKeystrokes(event);
}

// Game over function
export function gameOver() {
    clearInterval(window.timer);
    window.gameOver = true;

    addClass(document.getElementById('game'), 'over');

    const wpm = getWpm();
    document.getElementById('wpmTracker').textContent = `${wpm}`;
    document.getElementById('timer').textContent = "0";
}

// Move cursor function
export function moveCursor() {
    const nextLetter = document.querySelector('.letter.current');
    const nextWord = document.querySelector('.word.current');
    const cursor = document.getElementById('cursor');

    console.log(cursor, nextLetter);
    if (cursor && nextLetter) {
        const rect = nextLetter.getBoundingClientRect();
        cursor.style.top = `${rect.top}px`;
        cursor.style.left = `${rect.left}px`;
    } else {
        const rect = nextWord.getBoundingClientRect();
        console.log(rect);
        cursor.style.top = `${rect.top}px`;
        cursor.style.left = `${rect.right}px`;
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

document.addEventListener('keydown', function(event) {
    if (event.key === ' ') {

        const currentWord = document.querySelector('.word.current');

        // Find remaining untyped letters (letters that are not marked as "correct")
        const remainingLetters = currentWord.querySelectorAll('.letter:not(.correct)');

        if (remainingLetters.length > 0) {
            // Only mark letters incorrect if the word is unfinished
            remainingLetters.forEach(letter => addClass(letter, 'incorrect'));
        }

        moveToNextWord();
    }
});






