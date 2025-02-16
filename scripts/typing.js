// get previously saved metrics from localStorage
let metricsData = JSON.parse(localStorage.getItem('metrics')) || [];
let chart;

const getElement = (id) => document.getElementById(id);

// Create chart based on metrics data
function createChart() {
    const ctx = getElement('metricsChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: metricsData.map((_, index) => `Attempt ${index + 1}`),
            datasets: [
                { label: 'Speed (WPM)', data: metricsData.map(item => item.wpm), borderColor: 'blue', fill: false },
                { label: 'Accuracy (%)', data: metricsData.map(item => item.accuracy), borderColor: 'red', fill: false }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { title: { display: true, text: 'Attempt' } },
                y: { title: { display: true, text: 'Value' }, beginAtZero: true }
            }
        }
    });
}

// Update chart
export function updateChart() {
    if (!chart) return createChart();
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
    if (metricsData.length < 2) return;
    const prevMetrics = metricsData[metricsData.length - 2];
    const changes = [
        `WPM ${prevMetrics.wpm < currentMetrics.wpm ? '+' : ''}${(currentMetrics.wpm - prevMetrics.wpm).toFixed(2)}`,
        `Accuracy ${prevMetrics.accuracy < currentMetrics.accuracy ? '+' : ''}${(currentMetrics.accuracy - prevMetrics.accuracy).toFixed(2)}%`
    ];
    alert(`Improvement: ${changes.join(', ')}`);
}

createChart();
displayMetricsTable();

import { gameOver } from './game.js';

let correctKeystrokes = 0;
let totalKeystrokes = 0;
window.gameActive = false;
window.gameStart = null;
let wpmInterval = null;

// Start the timer for the game
export function startTimer() {
    let timeLeft = 60;
    const timerElement = getElement('timer');
    timerElement.textContent = timeLeft;
    clearInterval(window.timer);

    window.timer = setInterval(() => {
        if (--timeLeft <= 0) {
            clearInterval(window.timer);
            storeMetrics(correctKeystrokes, totalKeystrokes);
            gameOver();
        }
        timerElement.textContent = timeLeft;
    }, 1000);
}

// Tracking WPM
export function startWpmTracking() {
    const wpmTracker = getElement('wpmTracker');
    clearInterval(wpmInterval);

    wpmInterval = setInterval(() => {
        if (!window.gameActive || window.gameOver) {
            clearInterval(wpmInterval);
            return;
        }
        wpmTracker.textContent = getWpm();
    }, 100);
}

// Track keystrokes during the game
export function trackKeystrokes(event) {
    if (window.gameOver) return;
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

    const currentWord = document.querySelector('.word.current');
    if (currentWord?.getBoundingClientRect().top > 250) {
        getElement('game-container').style.marginTop =
            `${parseInt(getComputedStyle(getElement('game-container')).marginTop, 10) - 35}px`;
    }
}


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
    metricsData.push(newMetrics);
    localStorage.setItem('metrics', JSON.stringify(metricsData));
    updateAccuracy();
    updateChart();
    displayMetricsTable();
    displayImprovement(newMetrics);
}