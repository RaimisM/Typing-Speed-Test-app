import { gameOver } from './game.js';

let correctKeystrokes = 0;  // Tracks the correct keystrokes
let totalKeystrokes = 0;    // Tracks the total keystrokes (correct + incorrect)

window.gameActive = false; // Game starts only after first keystroke

export function startTimer() {
    const timerElement = document.getElementById('timer');
    let timeLeft = 60;
    timerElement.textContent = timeLeft;

    window.timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(window.timer);
            timerElement.textContent = "0";
            gameOver();
        }
    }, 1000);
}

// Live WPM tracking
export function startWpmTracking() {
    const wpmTracker = document.getElementById('wpmTracker');

    const wpmInterval = setInterval(() => {
        if (!window.gameActive || window.gameOver) {
            clearInterval(wpmInterval);
            return;
        }

        const wpm = getWpm();
        if (wpmTracker) {
            wpmTracker.textContent = `${wpm}`;
        }
    }, 100);
}

// Track keystrokes for accuracy and start the game
export function trackKeystrokes(event) {
    if (window.gameOver) return;

    // Start game on first key press
    if (!window.gameActive) {
        window.gameActive = true;
        window.gameStart = new Date().getTime(); // Start timer
        startTimer();
        startWpmTracking();
    }

    const typedLetter = event.key;
    const currentLetter = document.querySelector('.letter.current');
    const correct = currentLetter && currentLetter.textContent === typedLetter;

    if (correct) {
        correctKeystrokes++;
    }

    totalKeystrokes++;
    updateAccuracy();
}

// Update accuracy
function updateAccuracy() {
    const accuracyElement = document.getElementById('accuracy');
    const accuracy = totalKeystrokes > 0 ? Math.round((correctKeystrokes / totalKeystrokes) * 100) : 0;
    accuracyElement.textContent = `${accuracy}`;
}

// Get words per minute (WPM)
export function getWpm() {
    if (!window.gameActive) return 0;

    const words = [...document.querySelectorAll('.word')];
    const lastTypedWord = document.querySelector('.word.current');
    const lastTypedIndex = words.indexOf(lastTypedWord);
    const typedWords = lastTypedIndex > 0 ? words.slice(0, lastTypedIndex) : [];

    const correctWords = typedWords.filter(word => {
        const letters = [...word.children];
        return letters.some(letter => letter.classList.contains('correct')) &&
               !letters.some(letter => letter.classList.contains('incorrect'));
    });

    const timeElapsed = (new Date().getTime() - window.gameStart) / 60000;
    return timeElapsed > 0 ? Math.round(correctWords.length / timeElapsed) : 0;
}

// Reset game when "Esc" key is pressed
function resetGameOnEsc(event) {
    if (event.key === "Escape") {
        resetGame();
    }
}

// Reset game values and wait for typing to start
function resetGame() {
    console.log("Resetting game...");
    correctKeystrokes = 0;
    totalKeystrokes = 0;
    window.gameActive = false; // Reset game state
    window.gameStart = null;
    window.gameOver = false;

    // Reset WPM, accuracy, and timer
    document.getElementById('wpmTracker').textContent = '0';
    document.getElementById('accuracy').textContent = '0';
    document.getElementById('timer').textContent = '60';

    clearInterval(window.timer); // Stop timer

}

