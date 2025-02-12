import { gameOver } from './game.js';


export function startTimer() {
    const timerElement = document.getElementById('timer');
    let timeLeft = 20;

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
            wpmTracker.textContent = `WPM: ${wpm}`;
        }
    }, 100);
}

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
