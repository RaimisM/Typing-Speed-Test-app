export function startWpmTracking() {
    if (!window.gameStart) return;

    // Create an interval to update the WPM every 100 milliseconds (0.1s)
    const wpmInterval = setInterval(() => {
        const wpm = getWpm(); // Get the current WPM
        const wpmTracker = document.getElementById('wpmTracker');
        if (wpmTracker) {
            wpmTracker.textContent = `WPM: ${wpm}`; // Update the WPM in the div
        }
    }, 100); // Update every 100 milliseconds

    // Optional: Clear the interval when the game ends
    window.onGameEnd = () => clearInterval(wpmInterval); // You can set this event when the game ends
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
