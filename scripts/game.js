import { addClass, removeClass, randomWord, splitWord } from './utils.js';
import { getWpm } from './typing.js';

const wordsContainer = document.getElementById('game-container');

export const gameTimer = 60 * 1000;
window.timer = null;

export async function newGame() {
    wordsContainer.innerHTML = '';

    // Add 200 words to the game container
    for (let i = 0; i < 200; i++) {
        const word = await randomWord(); // Wait for a valid word
        wordsContainer.innerHTML += splitWord(word);
    }

    // Set first word and first letter as current
    addClass(document.querySelector('.word'), 'current');
    addClass(document.querySelector('.word .letter'), 'current');
    moveCursor();
    window.timer = null;
    window.gameStart = null;
}

// Game over function
export function gameOver() {
    clearInterval(window.timer);
    addClass(document.getElementById('game'), 'over');
    document.getElementById('timer').innerHTML = `WPM: ${getWpm()}`;
    console.log('Game over!');
}

// Function to move cursor position
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
            document.querySelectorAll('.letter.current').forEach(element => removeClass(element, 'current'));
            addClass(firstLetter, 'current');
        }
    }
}
