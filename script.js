const circle = document.querySelector(".circle-timer");
const timerEl = document.getElementById("timer");
const roundInfo = document.getElementById("roundInfo");

let timerInterval = null;
let startTime = null;
let elapsed = 0;
let running = false;
let rounds = JSON.parse(localStorage.getItem("rounds") || "[]");
let round = rounds.length + 1;

function format(ms) {
  const totalSec = Math.floor(ms / 1000);
  const min = String(Math.floor(totalSec / 60)).padStart(2, "0");
  const sec = String(totalSec % 60).padStart(2, "0");
  return `${min}:${sec}`;
}

function updateTimer() {
  const now = Date.now();
  const diff = elapsed + (running ? now - startTime : 0);
  timerEl.textContent = format(diff);
}

function showRounds() {
  if (rounds.length === 0) {
    roundInfo.innerHTML = "";
    return;
  }
  const lastFive = rounds.slice(-5).reverse(); // Apgriež secību
  let html = "";
  lastFive.forEach((time, idx) => {
    html += `${rounds.length - idx}. ${format(time)}<br>`;
  });
  roundInfo.innerHTML = html;
}

// Lielais aplis sāk/aptur laiku
circle.addEventListener("click", () => {
  circle.classList.add("flash");
  setTimeout(() => circle.classList.remove("flash"), 300);

  if (!running) {
    // Start
    running = true;
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 100);
  } else {
    // Stop
    running = false;
    clearInterval(timerInterval);
    const now = Date.now();
    elapsed += now - startTime;
    rounds.push(elapsed);
    localStorage.setItem("rounds", JSON.stringify(rounds));
    showRounds();
    round++;
    elapsed = 0;
  }
  updateTimer();
});
const btn = document.getElementById("toggleBtn");

btn.addEventListener("click", () => {
  // Dzēš pēdējo round
  if (rounds.length > 0) {
    rounds.pop();
    localStorage.setItem("rounds", JSON.stringify(rounds));
    showRounds();
  }
});
showRounds();
updateTimer();
