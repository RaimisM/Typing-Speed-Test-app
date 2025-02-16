export function addClass(element, name) {
    element.classList.add(name);
}

export function removeClass(element, name) {
    if (element) element.classList.remove(name);
}

let words = [];
let wordsLoaded = false; // Track if words are ready

// Fetch words from JSON file
async function loadWords() {
    if (wordsLoaded) return; // Avoid reloading unnecessarily

    try {
        const response = await fetch('../data/words.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        words = await response.json();
        wordsLoaded = true; // Mark as loaded
        console.log("Words loaded:", words);
    } catch (error) {
        console.error('Error loading words:', error);
    }
}

// Ensure words are loaded before calling randomWord
export async function randomWord() {
    if (!wordsLoaded) {
        console.warn('Waiting for words to load...');
        await loadWords(); // Ensure words are loaded before using them
    }

    if (words.length === 0) {
        console.error("No words available!");
        return '';
    }

    const word = words[Math.floor(Math.random() * words.length)];
    return word || ''; // Prevent returning undefined
}

// Split a word into <span> elements for each letter
export function splitWord(word) {
    if (typeof word !== 'string') {
        console.error("splitWord received invalid word:", word);
        return '';
    }

    return `<span class="word">
        ${word.split('').map(char =>
            char === ' ' ? `<span class="space">&nbsp;</span>` : `<span class="letter">${char}</span>`
        ).join('')}</span>`;
}

