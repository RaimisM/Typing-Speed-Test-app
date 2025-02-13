import { addClass, removeClass } from './utils.js';
import { gameOver, gameTimer, moveCursor, moveToNextWord } from './game.js';

document.getElementById('game').addEventListener('keyup', function (event) {
    const key = event.key.toLowerCase();
    let currentWord = document.querySelector('.word.current');
    let currentLetter = document.querySelector('.letter.current');

    if (!currentLetter) return;

    const expected = currentLetter.innerHTML.toLowerCase();
    const isLetter = key.length === 1 && key !== ' ';
    const isSpace = key === ' ';
    const isBackspace = key === 'backspace';

    if (document.getElementById('game').classList.contains('over')) {
        return;
    }

    console.log({ key, expected });

    if (!window.timer && (isLetter || isSpace || isBackspace)) {
        window.gameStart = new Date().getTime();

        window.timer = setInterval(() => {
            const currentTime = new Date().getTime();
            const timePassed = currentTime - window.gameStart;
            const timeLeft = gameTimer - timePassed;
            if (timeLeft <= 0) {
                gameOver();
                return;
            }
            document.getElementById('timer').innerHTML = Math.floor(timeLeft / 1000);
        }, 1000);
    }

    if (isLetter) {
        if (key === expected) {
            addClass(currentLetter, 'correct');
            removeClass(currentLetter, 'current');

            const nextLetter = currentLetter.nextElementSibling;
            if (nextLetter) {
                addClass(nextLetter, 'current');
            } else {
                const space = document.createElement('span');
                space.classList.add('space');
                space.textContent = ' ';
                console.log('Word completed');
            }
        } else {
            addClass(currentLetter, 'incorrect');
            const incorrectLetter = document.createElement('span');
            incorrectLetter.innerHTML = key;
            incorrectLetter.className = 'incorrect letter added';
            currentLetter.parentNode.insertBefore(incorrectLetter, currentLetter);
        }
    }



    if (isBackspace) {
    if (currentLetter.classList.contains('incorrect') || currentLetter.classList.contains('correct')) {
        removeClass(currentLetter, 'incorrect');
        removeClass(currentLetter, 'correct');
    }

    // Remove 'current' class from the current letter
    removeClass(currentLetter, 'current');

    // Find and remove the 'incorrect' letter if it exists
    const incorrectLetter = currentLetter.parentNode.querySelector('.incorrect.letter.added');
    if (incorrectLetter) {
        incorrectLetter.remove();
    }

    // Move the cursor to the previous letter or word
    let prevLetter = currentLetter.previousElementSibling;
    if (prevLetter) {
        addClass(prevLetter, 'current');
    } else {
        let prevWord = currentWord.previousElementSibling;
        if (prevWord) {
            // Move to the previous word
            removeClass(currentWord, 'current');
            addClass(prevWord, 'current');
            // Move to the last letter of the previous word
            let lastLetter = prevWord.querySelector('.letter:last-child');
            if (lastLetter) {
                addClass(lastLetter, 'current');
            }
        }
    }
}
moveCursor();
});
