// script.js
const status = document.getElementById('status');
const canvas = document.getElementById('map');
const ctx = canvas.getContext('2d');
const netStatus = document.getElementById('network-status');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const nextStepBtn = document.getElementById('nextStepBtn');
const modeSelect = document.getElementById('modeSelect');
const locationSelect = document.getElementById('locationSelect');
const distanceText = document.getElementById('distance');
const stepsText = document.getElementById('steps');
const timeText = document.getElementById('time');
const caloriesText = document.getElementById('calories');
const goalInput = document.getElementById('stepGoal');
const progressBar = document.getElementById('goalProgress');
const shareBtn = document.getElementById('shareBtn');

let walkHistory = JSON.parse(localStorage.getItem('walkHistory')) || [];
let path = [];
let totalDistance = 0;
let totalSteps = 0;
let startTime = null;
let watchId = null;
let timerInterval = null;
let currentLocation = null;
let isWalking = false;
let tenMinNotified = false;

function toCanvasCoords(lat, lon) {
  return {
    x: (lon + 180) * (canvas.width / 360),
    y: (90 - lat) * (canvas.height / 180)
  };
}

function drawPath() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 1; i < path.length; i++) {
    const start = toCanvasCoords(path[i - 1].lat, path[i - 1].lon);
    const end = toCanvasCoords(path[i].lat, path[i].lon);
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = 'blue';
    ctx.stroke();
  }
  if (path.length) {
    const { lat, lon } = path[path.length - 1];
    const pos = toCanvasCoords(lat, lon);
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 4, 0, 2 * Math.PI);
    ctx.fillStyle = 'green';
    ctx.fill();
  }
}

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function updateStats(lat, lon) {
  if (!isWalking) return;
  if (currentLocation) {
    const dist = haversine(currentLocation.lat, currentLocation.lon, lat, lon);
    if (dist > 0.2) {
      totalDistance += dist;
      totalSteps += Math.floor(dist / 0.75);
    }
  }
  currentLocation = { lat, lon };
  path.push(currentLocation);
  drawPath();

  distanceText.textContent = totalDistance.toFixed(1);
  stepsText.textContent = totalSteps;
  caloriesText.textContent = (totalSteps * 0.04).toFixed(1);

  const goal = parseInt(goalInput.value) || 0;
  if (goal > 0) {
    const percent = Math.min((totalSteps / goal) * 100, 100);
    progressBar.style.width = `${percent}%`;
    progressBar.textContent = `${Math.floor(percent)}%`;
  }
}

function updateTime() {
  if (!isWalking || !startTime) return;
  const seconds = Math.floor((Date.now() - startTime) / 1000);
  timeText.textContent = `${seconds}s`;

  if (seconds >= 600 && !tenMinNotified) {
    sendNotification("🎉 You walked for 10 minutes. Great job!");
    tenMinNotified = true;
  }
}

function sendNotification(message) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(message);
  } else if ("Notification" in window && Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification(message);
      }
    });
  }
}

function saveHistory() {
  walkHistory.push({ distance: totalDistance, steps: totalSteps });
  localStorage.setItem('walkHistory', JSON.stringify(walkHistory));

  const ctxHist = document.getElementById('historyChart').getContext('2d');
  new Chart(ctxHist, {
    type: 'bar',
    data: {
      labels: walkHistory.map((_, i) => `Walk ${i + 1}`),
      datasets: [{
        label: 'Distance (m)',
        data: walkHistory.map(w => w.distance),
        backgroundColor: 'lightgreen'
      }]
    }
  });
}

startBtn.onclick = () => {
  isWalking = true;
  totalDistance = 0;
  totalSteps = 0;
  path = [];
  currentLocation = null;
  tenMinNotified = false;
  drawPath();
  startTime = Date.now();
  timeText.textContent = '0s';
  timerInterval = setInterval(updateTime, 1000);
  shareBtn.style.display = 'inline-block';

  if (modeSelect.value === 'simulate') {
    locationSelect.style.display = 'inline-block';
    nextStepBtn.style.display = 'inline-block';
    stopBtn.style.display = 'inline-block';
  } else {
    locationSelect.style.display = 'none';
    stopBtn.style.display = 'inline-block';
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(pos => {
        const { latitude, longitude } = pos.coords;
        status.textContent = `📍 Lat: ${latitude.toFixed(5)}, Lon: ${longitude.toFixed(5)}`;
        updateStats(latitude, longitude);
      }, () => {
        status.textContent = 'Unable to get location';
      }, { enableHighAccuracy: true });
    }
  }
};

stopBtn.onclick = () => {
  isWalking = false;
  clearInterval(timerInterval);
  timerInterval = null;
  startTime = null;
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
  saveHistory();
  stopBtn.style.display = 'none';
  nextStepBtn.style.display = 'none';
};

nextStepBtn.onclick = () => {
  if (!isWalking) return;
  if (!currentLocation) {
    const locations = {
      mumbai: { lat: 19.07283, lon: 72.88261 },
      delhi: { lat: 28.6139, lon: 77.2090 },
      hyderabad: { lat: 17.385, lon: 78.4867 }
    };
    currentLocation = locations[locationSelect.value];
  }
  const newLat = currentLocation.lat + (Math.random() - 0.5) * 0.0004;
  const newLon = currentLocation.lon + (Math.random() - 0.5) * 0.0004;
  updateStats(newLat, newLon);
};

shareBtn.onclick = () => {
  const message = `I just walked ${(totalDistance / 1000).toFixed(2)}km and burned ${(totalSteps * 0.04).toFixed(1)} calories using #EcoWalk!`;
  const shareUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(shareUrl, '_blank');
};

if ('connection' in navigator) {
  const conn = navigator.connection;
  conn.addEventListener('change', () => {
    netStatus.textContent = conn.downlink < 1 ? 'Slow connection!' : '';
  });
  netStatus.textContent = conn.downlink < 1 ? 'Slow connection!' : '';
} else {
  netStatus.textContent = 'Network API not supported';
};
