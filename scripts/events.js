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
            addClass(currentLetter, 'correct'); // Mark the letter as correct
            removeClass(currentLetter, 'current'); // Remove the current class from the current letter

            const nextLetter = currentLetter.nextElementSibling; // Get the next letter
            if (nextLetter) {
                addClass(nextLetter, 'current'); // Make the next letter the current letter
            }
        } else {
            addClass(currentLetter, 'incorrect'); // Mark the letter as incorrect
            // Store the number of incorrect attempts on this letter
            currentLetter.dataset.incorrectAttempts = (parseInt(currentLetter.dataset.incorrectAttempts) || 0) + 1;
        }
    }

    // Handle backspace input
    if (isBackspace) {
        if (currentLetter.classList.contains('incorrect') || currentLetter.classList.contains('correct')) {
            removeClass(currentLetter, 'incorrect'); // Remove incorrect class
            removeClass(currentLetter, 'correct'); // Remove correct class
        }

        // Remove incorrect attempt tracking
        delete currentLetter.dataset.incorrectAttempts;

        //Handle incorrect letter deletion
        const incorrectAttempt = currentLetter.previousElementSibling && currentLetter.previousElementSibling.classList.contains('incorrect') && currentLetter.previousElementSibling.dataset.originalLetter === currentLetter.textContent;
        if (incorrectAttempt) {
            incorrectAttempt.remove();
            addClass(currentLetter, 'current');
            return;
        }

        removeClass(currentLetter, 'current'); // Remove current class from current letter

        let prevLetter = currentLetter.previousElementSibling; // Get the previous letter

        if (prevLetter) {
            addClass(prevLetter, 'current'); // Make the previous letter the current letter
        } else {
            let prevWord = currentWord.previousElementSibling; // Get the previous word
            if (prevWord) {
                removeClass(currentWord, 'current');
                addClass(prevWord, 'current');

                let lastLetter = prevWord.querySelector('.letter:last-child');
                if (lastLetter) {
                    addClass(lastLetter, 'current');
                }
            }
        }
    }
    moveCursor();
});