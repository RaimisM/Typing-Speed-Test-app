import { addClass, removeClass } from './utils.js';
import { gameOver, gameTimer, moveCursor } from './game.js';

const gameElement = document.getElementById('game');
const timerElement = document.getElementById('timer');

// Event listener for keyup events on the game element
gameElement.addEventListener('keyup', function (event) {
    const key = event.key.toLowerCase();
    let currentWord = document.querySelector('.word.current');
    let currentLetter = document.querySelector('.letter.current');

    if (!currentLetter) return;

    const expected = currentLetter.textContent.toLowerCase();
    const isLetter = key.length === 1 && key !== ' ';
    const isBackspace = key === 'backspace';

    if (gameElement.classList.contains('over')) {
        return;
    }

    console.log({ key, expected });

    if (!window.timer && (isLetter || isBackspace)) {
        window.gameStart = new Date().getTime(); 

        window.timer = setInterval(() => {
            const currentTime = new Date().getTime();
            const timePassed = currentTime - window.gameStart;
            const timeLeft = gameTimer - timePassed;

            if (timeLeft <= 0) {
                gameOver();
                return;
            }

            timerElement.textContent = Math.floor(timeLeft / 1000);
        }, 1000);
    }

    // Handle letter input
    if (isLetter) {
        if (key === expected) {
            addClass(currentLetter, 'correct'); // Mark as correct
            removeClass(currentLetter, 'current'); // Remove "current" class

            const nextLetter = currentLetter.nextElementSibling;
            if (nextLetter) {
                addClass(nextLetter, 'current'); // Move to the next letter
            }
        } else {
            addClass(currentLetter, 'incorrect'); // Mark expected letter as incorrect

            // Store incorrect attempts count
            currentLetter.dataset.incorrectAttempts = (parseInt(currentLetter.dataset.incorrectAttempts) || 0) + 1;

            // Create a span for the incorrect letter
            const incorrectSpan = document.createElement("span");
            incorrectSpan.textContent = key;
            addClass(incorrectSpan, "incorrect-letter"); // Apply styling class
            incorrectSpan.dataset.isExtra = "true";
            currentLetter.parentNode.insertBefore(incorrectSpan, currentLetter);
        }
    }

    // Handle backspace input
    if (isBackspace) {
        let prevLetter = currentLetter.previousElementSibling; // Get previous letter

        // Deleting an inserted incorrect letter
        if (prevLetter && prevLetter.classList.contains("incorrect-letter")) {
            prevLetter.remove(); // Remove incorrect letter
            return; // Stop further execution (cursor stays in place)
        }

        // Removing correct/incorrect marking from an expected letter
        if (currentLetter.classList.contains("incorrect") || currentLetter.classList.contains("correct")) {
            removeClass(currentLetter, "incorrect");
            removeClass(currentLetter, "correct");
            delete currentLetter.dataset.incorrectAttempts;
        }

        // Move cursor back
        removeClass(currentLetter, "current");
        if (prevLetter) {
            addClass(prevLetter, "current");
        } else {
            let prevWord = currentWord.previousElementSibling;
            if (prevWord) {
                removeClass(currentWord, "current");
                addClass(prevWord, "current");

                let lastLetter = prevWord.querySelector(".letter:last-child");
                if (lastLetter) {
                    addClass(lastLetter, "current");
                }
            }
        }
    }
    moveCursor();
});