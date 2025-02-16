// get previously saved metrics from localStorage
let metricsData = JSON.parse(localStorage.getItem('metrics')) || [];
let chart;

const getElement = (id) => document.getElementById(id);

// Create chart based on metrics data
function createChart() {
    const ctx = getElement('metricsChart').getContext('2d'); // Get canvas context for the chart
    chart = new Chart(ctx, {
        type: 'line', // Chart type
        data: {
            labels: metricsData.map((_, index) => `Attempt ${index + 1}`), // Labels for chart
            datasets: [
                { label: 'Speed (WPM)', data: metricsData.map(item => item.wpm), borderColor: 'blue', fill: false },
                { label: 'Accuracy (%)', data: metricsData.map(item => item.accuracy), borderColor: 'red', fill: false }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { title: { display: true, text: 'Attempt' } }, // X title
                y: { title: { display: true, text: 'Value' }, beginAtZero: true } // Y title
            }
        }
    });
}

// Update chart
export function updateChart() {
    if (!chart) return createChart(); // Create chart if it doesn't exist
    chart.data.labels = metricsData.map((_, index) => `Attempt ${index + 1}`);
    chart.data.datasets[0].data = metricsData.map(item => item.wpm);
    chart.data.datasets[1].data = metricsData.map(item => item.accuracy);
    chart.update();
}

// Display data in a table format
export function displayMetricsTable() {
    const tableBody = getElement('metricsTableBody');
    tableBody.innerHTML = metricsData.map((item, index) =>
        `<tr><td>${index + 1}</td><td>${item.wpm}</td><td>${item.accuracy}</td></tr>`
    ).join('');
}

// Display improvement in performance
function displayImprovement(currentMetrics) {
    if (metricsData.length < 2) return; // No improvement if less than 2 attempts
    const prevMetrics = metricsData[metricsData.length - 2];
    const changes = [
        `WPM ${prevMetrics.wpm < currentMetrics.wpm ? '+' : ''}${(currentMetrics.wpm - prevMetrics.wpm).toFixed(2)}`,
        `Accuracy ${prevMetrics.accuracy < currentMetrics.accuracy ? '+' : ''}${(currentMetrics.accuracy - prevMetrics.accuracy).toFixed(2)}%`
    ];
    alert(`Improvement: ${changes.join(', ')}`); // Alert the improvement
}

createChart(); // Show chart when page loads
displayMetricsTable();

import { gameOver } from './game.js';

let correctKeystrokes = 0; // Track correct keystrokes
let totalKeystrokes = 0; // Track total keystrokes
window.gameActive = false; // Check if the game is active
window.gameStart = null; // Start time of the game
let wpmInterval = null; // Store WPM

// Start the timer for the game
export function startTimer() {
    let timeLeft = 60; // main timer
    const timerElement = getElement('timer');
    timerElement.textContent = timeLeft;
    clearInterval(window.timer);

    window.timer = setInterval(() => {
        if (--timeLeft <= 0) {
            clearInterval(window.timer); // Stop timer when time is up
            storeMetrics(correctKeystrokes, totalKeystrokes); // Store the metrics when game ends
            gameOver(); // Trigger game over logic
        }
        timerElement.textContent = timeLeft;
    }, 1000);
}

// Tracking WPM
export function startWpmTracking() {
    const wpmTracker = getElement('wpmTracker');
    clearInterval(wpmInterval); // Clear any existing interval

    wpmInterval = setInterval(() => {
        if (!window.gameActive || window.gameOver) { // Stop tracking if the game is over
            clearInterval(wpmInterval);
            return;
        }
        wpmTracker.textContent = getWpm(); // Update WPM display
    }, 100);
}

// Track keystrokes during the game
export function trackKeystrokes(event) {
    if (window.gameOver) return; // Prevent tracking if the game is over
    if (!window.gameActive) {
        window.gameActive = true;
        window.gameStart = Date.now();
        startTimer();
        startWpmTracking();
    }

    const currentLetter = document.querySelector('.letter.current');
    if (currentLetter && currentLetter.textContent === event.key) correctKeystrokes++;
    totalKeystrokes++;
    updateAccuracy();
    // Adjust the game container based on word position
    const currentWord = document.querySelector('.word.current');
    if (currentWord?.getBoundingClientRect().top > 250) {
        getElement('game-container').style.marginTop = 
            `${parseInt(getComputedStyle(getElement('game-container')).marginTop, 10) - 35}px`;
    }
}

document.addEventListener('keydown', trackKeystrokes);

// Update the accuracy display
export function updateAccuracy() {
    getElement('accuracy').textContent = 
        totalKeystrokes > 0 ? Math.round((correctKeystrokes / totalKeystrokes) * 100) : 0;
}

// Calculate WPM
export function getWpm() {
    if (!window.gameActive) return 0;
    const words = [...document.querySelectorAll('.word')];
    const typedWords = words.slice(0, words.indexOf(document.querySelector('.word.current')));
    const correctWords = typedWords.filter(word =>
        [...word.children].some(letter => letter.classList.contains('correct')) &&
        ![...word.children].some(letter => letter.classList.contains('incorrect'))
    );
    return Math.round(correctWords.length / ((Date.now() - window.gameStart) / 60000)) || 0;
}

// Store data to localStorage and update
export function storeMetrics(correct, total) {
    const newMetrics = { wpm: getWpm(), accuracy: total > 0 ? Math.round((correct / total) * 100) : 0 };
    metricsData.push(newMetrics); // Add new data to the array
    localStorage.setItem('metrics', JSON.stringify(metricsData)); // Save data to localStorage
    updateAccuracy(); // Update accuracy display
    updateChart(); // Update the chart
    displayMetricsTable(); // Update the metrics table
    displayImprovement(newMetrics); // Display improvement in performance
}
