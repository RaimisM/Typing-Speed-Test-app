export function addClass(element, name) {
    element.classList.add(name);
}

export function removeClass(element, name) {
    if (element) element.classList.remove(name);
}

let words = [];
let wordsCount = 0;

// Fetch words from JSON file
async function loadWords() {
    try {
        const response = await fetch('../data/words.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        words = await response.json();
        wordsCount = words.length;
        console.log("Words loaded:", words);
    } catch (error) {
        console.error('Error loading words:', error);
    }
}
loadWords();

export async function randomWord() {
    if (words.length === 0) {
        console.warn('Words not loaded yet, waiting...');
        await loadWords();
    }

    const word = words[Math.floor(Math.random() * words.length)];
    if (!word) {
        console.error("randomWord() returned an invalid word:", word);
        return '';
    }
    return word;
}

export function splitWord(word) {
    if (typeof word !== 'string') {
        console.error("splitWord received invalid word:", word);
        return '';
    }
    return `<span class="word">
        <span class="letter">${word.split('').join('</span><span class="letter">')}</span>
    </span>`;
}
