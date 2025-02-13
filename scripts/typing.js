// combined.js (or whatever you name the file)

// Chart.js initialization and functions
let metricsData = JSON.parse(localStorage.getItem('metrics')) || [];
let chart;

function createChart() {
    const ctx = document.getElementById('metricsChart').getContext('2d');

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: metricsData.map((item, index) => `Attempt ${index + 1}`),
            datasets: [{
                label: 'Speed (WPM)',
                data: metricsData.map(item => item.wpm),
                borderColor: 'blue',
                fill: false
            },
            {
                label: 'Accuracy (%)',
                data: metricsData.map(item => item.accuracy),
                borderColor: 'red',
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Attempt'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Value'
                    },
                    beginAtZero: true
                }
            }
        }
    });
}

function updateChart() {
    if (!chart) {
        createChart();
        return;
    }

    chart.data.labels = metricsData.map((item, index) => `Attempt ${index + 1}`);
    chart.data.datasets[0].data = metricsData.map(item => item.wpm);
    chart.data.datasets[1].data = metricsData.map(item => item.accuracy);
    chart.update();
}

function displayMetricsTable() {
    const tableBody = document.getElementById('metricsTableBody');
    tableBody.innerHTML = '';

    metricsData.forEach((item, index) => {
        const row = tableBody.insertRow();
        const attemptCell = row.insertCell();
        const wpmCell = row.insertCell();
        const accuracyCell = row.insertCell();

        attemptCell.textContent = index + 1;
        wpmCell.textContent = item.wpm;
        accuracyCell.textContent = item.accuracy;
    });
}

function displayImprovement(currentMetrics) {
    const improvementDiv = document.getElementById('improvement');
    if (metricsData.length > 1) {
        const previousMetrics = metricsData[metricsData.length - 2];
        const wpmDiff = currentMetrics.wpm - previousMetrics.wpm;
        const accuracyDiff = currentMetrics.accuracy - previousMetrics.accuracy;

        let message = "Improvement: ";
        if (wpmDiff > 0) {
            message += `WPM +${wpmDiff.toFixed(2)}`;
        } else if (wpmDiff < 0) {
            message += `WPM ${wpmDiff.toFixed(2)}`;
        } else {
            message += `WPM 0`;
        }
         message += ", ";
        if (accuracyDiff > 0) {
            message += `Accuracy +${accuracyDiff.toFixed(2)}%`;
        } else if (accuracyDiff < 0) {
            message += `Accuracy ${accuracyDiff.toFixed(2)}%`;
        } else {
            message += `Accuracy 0%`;
        }
        improvementDiv.textContent = message;

    } else {
        improvementDiv.textContent = ""; // Clear on first attempt
    }
}

createChart();
displayMetricsTable();


// Typing game logic and functions
import { gameOver } from './game.js'; // Import gameOver

let correctKeystrokes = 0;
let totalKeystrokes = 0;
window.gameActive = false;
window.gameStart = null;
let wpmInterval = null;

export function startTimer() {
    const timerElement = document.getElementById('timer');
    let timeLeft = 60; // Or 60, as you prefer
    timerElement.textContent = timeLeft;

    window.timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(window.timer);
            timerElement.textContent = "0";
            storeMetrics(correctKeystrokes, totalKeystrokes); // Call storeMetrics
            gameOver();
        }
    }, 1000);
}

export function startWpmTracking() {
    const wpmTracker = document.getElementById('wpmTracker');
    wpmInterval = setInterval(() => {
        if (!window.gameActive || window.gameOver) {
            clearInterval(wpmInterval);
            return;
        }
        const wpm = getWpm(); // Call imported getWpm
        if (wpmTracker) {
            wpmTracker.textContent = `${wpm}`;
        }
    }, 100);
}

export function trackKeystrokes(event) {
    if (window.gameOver) return;

    if (!window.gameActive) {
        window.gameActive = true;
        window.gameStart = new Date().getTime();
        startTimer();
        startWpmTracking();
    }

    const typedLetter = event.key;
    const currentLetter = document.querySelector('.letter.current');
    const correct = currentLetter && currentLetter.textContent === typedLetter;

    if (correct) {
        correctKeystrokes++;
    }
    totalKeystrokes++;
    updateAccuracy();
}

function updateAccuracy() {
    const accuracyElement = document.getElementById('accuracy');
    const accuracy = totalKeystrokes > 0 ? Math.round((correctKeystrokes / totalKeystrokes) * 100) : 0;
    accuracyElement.textContent = `${accuracy}`;
}

export function getWpm() {
    if (!window.gameActive) return 0;
    const words = [...document.querySelectorAll('.word')];
    const lastTypedWord = document.querySelector('.word.current');
    const lastTypedIndex = words.indexOf(lastTypedWord);
    const typedWords = lastTypedIndex > 0 ? words.slice(0, lastTypedIndex) : [];

    const correctWords = typedWords.filter(word => {
        const letters = [...word.children];
        return letters.some(letter => letter.classList.contains('correct')) &&
               !letters.some(letter => letter.classList.contains('incorrect'));
    });

    const timeElapsed = (new Date().getTime() - window.gameStart) / 60000;
    return timeElapsed > 0 ? Math.round(correctWords.length / timeElapsed) : 0;
}

document.addEventListener('keydown', trackKeystrokes);

export function storeMetrics(correct, total) {
    const wpm = getWpm();
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

    const newMetrics = { wpm, accuracy };
    metricsData.push(newMetrics);
    localStorage.setItem('metrics', JSON.stringify(metricsData));

    updateChart();
    displayMetricsTable();
    displayImprovement(newMetrics);
}