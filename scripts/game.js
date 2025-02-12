import { addClass, removeClass, randomWord, splitWord } from './utils.js';
import { getWpm, startTimer, startWpmTracking, trackKeystrokes } from './typing.js'; // Make sure trackKeystrokes is imported

const wordsContainer = document.getElementById('game-container');

export const gameTimer = 60 * 1000;
window.timer = null;
window.gameStart = null;
window.gameOver = false;

export async function newGame() {
    console.log("Starting a new game...");
    wordsContainer.innerHTML = '';
    window.gameOver = false; // Reset the game over flag

    let words = []; // Store words for saving

    // Generate 200 random words and add to the game container
    for (let i = 0; i < 200; i++) {
        const word = await randomWord();
        words.push(word);
        wordsContainer.innerHTML += splitWord(word);
    }

    // Save words session
    localStorage.setItem("savedWords", JSON.stringify(words));

    // Set first word and letter as current
    addClass(document.querySelector('.word'), 'current');
    addClass(document.querySelector('.word .letter'), 'current');
    moveCursor();

    window.timer = null;
    window.gameStart = null;

    console.log("Timer state before adding event listener:", window.timer); // Log timer before adding listener

    // Start the game on the first keypress
    document.addEventListener('keydown', startGameOnFirstKeypress, { once: true });

    console.log("Game initialized, awaiting first key press...");
}





// Start the game when the first key is pressed
function startGameOnFirstKeypress(event) {
    if (!window.gameActive && event.key.length === 1) {
        console.log("First key press detected:", event.key);
        window.gameActive = true;
        window.gameStart = new Date().getTime();
        
        // Check if the timer is already running before starting it
        console.log("Timer before start:", window.timer);
        
        if (!window.timer) {  // Only start the timer if it's not already running
            console.log("Starting timer...");
            startTimer();   // Start the timer
            startWpmTracking();
        }
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
    const nextWord = document.querySelector('.word.current');
    const cursor = document.getElementById('cursor');
    cursor.style.top = (nextLetter || nextWord).getBoundingClientRect().top + 2 + 'px';
    cursor.style.left = (nextLetter || nextWord).getBoundingClientRect()[nextLetter ? 'left' : 'right'] + 'px';
}


// Move to the next word
// Function to move to the next word (your existing function)
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

// Add keydown listener for spacebar press
document.addEventListener('keydown', function(event) {
    // Check if spacebar is pressed (key code 32 or event.key === ' ')
    if (event.key === ' ' || event.keyCode === 32) {
        // Only move to the next word if `isSpace` is true
        if (isSpace) {
            // Mark the incorrect letters and move to the next word
            document.querySelectorAll('.word.current .letter:not(.correct)')
                .forEach(letter => addClass(letter, 'incorrect'));
            moveCursor();  // Move to the next word when spacebar is pressed
        }
    }
});



