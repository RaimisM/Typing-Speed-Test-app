import { gameOver } from './game.js';

let correctKeystrokes = 0;  // Tracks the correct keystrokes
let totalKeystrokes = 0;    // Tracks the total keystrokes (correct + incorrect)

export function startTimer() {
    const timerElement = document.getElementById('timer');
    let timeLeft = 20; // Set your desired time

    timerElement.textContent = timeLeft;

    window.timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(window.timer); // Stop timer
            timerElement.textContent = "0"; // Ensure it shows 0
            gameOver(); // Call game over
        }
    }, 1000);
}

// Live WPM tracking
export function startWpmTracking() {
    if (!window.gameStart) return;

    const wpmTracker = document.getElementById('wpmTracker');

    const wpmInterval = setInterval(() => {
        if (window.gameOver) {
            clearInterval(wpmInterval); // Stop WPM updates when game ends
            return;
        }

        const wpm = getWpm();
        if (wpmTracker) {
            wpmTracker.textContent = `${wpm}`; // Update WPM in real-time
        }
    }, 100);
}

// Track keystrokes for accuracy
export function trackKeystrokes(event) {
    if (window.gameOver) return; // Block keystrokes if game is over

    const typedLetter = event.key; // Get the typed letter (assuming only one letter is typed at a time)

    const currentLetter = document.querySelector('.letter.current');
    const correct = currentLetter && currentLetter.textContent === typedLetter;

    if (correct) {
        correctKeystrokes++; // Increment correct keystrokes
    }

    totalKeystrokes++; // Increment total keystrokes (correct + incorrect)

    updateAccuracy(); // Update the accuracy display
}

// Update accuracy
function updateAccuracy() {
    const accuracyElement = document.getElementById('accuracy');
    const accuracy = totalKeystrokes > 0 ? Math.round((correctKeystrokes / totalKeystrokes) * 100) : 0;
    accuracyElement.textContent = `${accuracy}`; // Display accuracy
}

// Get words per minute (WPM)
export function getWpm() {
    if (!window.gameStart) return 0;

    const words = [...document.querySelectorAll('.word')];
    const lastTypedWord = document.querySelector('.word.current');
    const lastTypedIndex = words.indexOf(lastTypedWord);
    const typedWords = lastTypedIndex > 0 ? words.slice(0, lastTypedIndex) : [];

    const correctWords = typedWords.filter(word => {
        const letters = [...word.children];
        const incorrectLetter = letters.some(letter => letter.classList.contains('incorrect'));
        const correctLetter = letters.some(letter => letter.classList.contains('correct'));
        return !incorrectLetter && correctLetter;
    });

    const timeElapsed = (new Date().getTime() - window.gameStart) / 60000;
    return timeElapsed > 0 ? Math.round(correctWords.length / timeElapsed) : 0;
}
