import { addClass, removeClass, generateWords, splitWord } from "./utils.js";
import {
  getWpm,
  startTimer,
  startWpmTracking,
  trackKeystrokes,
  updateAccuracy,
} from "./tracking.js";

// DOM elements
const wordsContainer = document.getElementById("game-container"); // Container for the words
const timerElement = document.getElementById("timer"); // Element to display the timer
const wpmElement = document.getElementById("wpmTracker"); // Element to display WPM
const accuracyElement = document.getElementById("accuracy"); // Element to display accuracy
const gameElement = document.getElementById("game"); // Main game container
const cursorElement = document.getElementById("cursor"); // The cursor element

// Game variables
export const gameTimer = 60 * 1000;
window.timer = null;
window.gameStart = null;
window.gameOver = false;
window.gameActive = false;

// Function to start a new game
export async function newGame() {
  console.log("Starting a new game...");
  wordsContainer.innerHTML = ""; // Clear the words container
  window.gameOver = false;
  window.gameActive = false;
  removeClass(gameElement, "over");

  const words = await generateWords(wordsContainer);

  // Store words and initial game state in session and local storage
  sessionStorage.setItem("initialWords", JSON.stringify(words));
  sessionStorage.setItem("initialTimer", "60");
  sessionStorage.setItem("initialAccuracy", "0");
  localStorage.setItem("savedWords", JSON.stringify(words)); // Save words for reset

  // Set styling for the first word and letter
  addClass(wordsContainer.querySelector(".word"), "current");
  addClass(wordsContainer.querySelector(".word .letter"), "current");
  moveCursor();

  window.timer = null;
  window.gameStart = null;

  console.log("New game started with fresh words.");
  // Start game on the first keypress
  document.addEventListener("keydown", startGameOnFirstKeypress, {
    once: true,
  });
}

// Function to reset the game
function resetGame() {
  console.log("Resetting game...");
  window.totalKeystrokes = 0; // Reset keystroke count
  window.correctKeystrokes = 0; // Reset correct keystroke count
  window.gameStart = null; // Reset game start time
  updateAccuracy(); // Update displayed accuracy

  // Clear timer if it's running
  if (window.timer) {
    clearInterval(window.timer);
    window.timer = null;
    timerElement.textContent = "60";
  }

  wpmElement.textContent = "0";
  accuracyElement.textContent = "0";

  // Retrieve saved words or start a new game
  const savedWords = JSON.parse(sessionStorage.getItem("initialWords")) || [];
  if (savedWords.length > 0) {
    wordsContainer.innerHTML = "";
    savedWords.forEach((word) => (wordsContainer.innerHTML += splitWord(word))); // Add saved words
    addClass(wordsContainer.querySelector(".word"), "current");
    addClass(wordsContainer.querySelector(".word .letter"), "current");
    moveCursor();
    console.log("Game reset with previous session words.");
  } else {
    console.log("No previous words found. Starting a new game...");
    newGame();
  }

  window.gameOver = false;
  window.gameActive = false;
  console.log("Game fully reset: Timer, WPM, Accuracy, Cursor.");
}

// Event listener for Escape key to reset the game
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    resetGame();
  }
});

// Function to start the game on the first keypress
function startGameOnFirstKeypress(event) {
  if (!window.gameActive && event.key.length === 1) {
    console.log("First key press detected:", event.key);
    window.gameActive = true;
    window.gameStart = new Date().getTime();

    // Start timer and WPM tracking
    if (!window.timer) {
      console.log("Starting timer...");
      startTimer();
      startWpmTracking();
    }
  }
}

// Event listener for keydown events during the game
document.addEventListener("keydown", (event) => {
  if (window.gameOver) {
    event.preventDefault(); // Prevent further input if game is over
    return;
  }
  handleTyping(event);
});

// Function to handle typing input
function handleTyping(event) {
  if (window.gameOver || !window.gameActive) return;
  if (event.key.length === 1 || event.key === "Backspace") {
    trackKeystrokes(event);
  }
}

// Function to end the game
export function gameOver() {
  clearInterval(window.timer); // Stop the timer
  window.gameOver = true; // Set game over
  window.gameActive = false; // Set game inactive
  addClass(gameElement, "over");

  wpmElement.textContent = getWpm(); // Display final WPM
  timerElement.textContent = "0"; // Set timer display to 0
}

// Function to move the cursor
export function moveCursor() {
  const nextLetter = document.querySelector(".letter.current"); // Get the current letter
  const nextWord = document.querySelector(".word.current"); // Get the current word

  // Position cursor at the beginning of the current letter or word
  if (cursorElement && nextLetter) {
    const rect = nextLetter.getBoundingClientRect();
    cursorElement.style.top = `${rect.top}px`;
    cursorElement.style.left = `${rect.left}px`;
  } else if (cursorElement && nextWord) {
    const rect = nextWord.getBoundingClientRect();
    cursorElement.style.top = `${rect.top}px`;
    cursorElement.style.left = `${rect.right}px`; // Position at the end of the word
  }
}

// Function to move to the next word
export function moveToNextWord() {
  const currentWord = document.querySelector(".word.current");
  if (!currentWord) return;
  removeClass(currentWord, "current");
  let nextWord = currentWord.nextElementSibling;
  while (nextWord && nextWord.textContent.trim() === "") {
    nextWord = nextWord.nextElementSibling;
  }

  if (nextWord) {
    addClass(nextWord, "current"); // Add 'current' class to the next word
    const firstLetter = nextWord.querySelector(".letter");
    if (firstLetter) {
      document
        .querySelectorAll(".letter.current")
        .forEach((el) => removeClass(el, "current"));
      addClass(firstLetter, "current");
    }
  }
}

// Event listener for spacebar to move to the next word
document.addEventListener("keydown", (event) => {
  if (event.key === " ") {
    event.preventDefault();
    const currentWord = document.querySelector(".word.current");
    const remainingLetters = currentWord.querySelectorAll(
      ".letter:not(.correct)"
    );

    // Mark remaining letters as incorrect
    if (remainingLetters.length > 0) {
      remainingLetters.forEach((letter) => addClass(letter, "incorrect"));
    }

    moveToNextWord();
  }
});
