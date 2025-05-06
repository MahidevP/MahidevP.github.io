let timers = [];
let history = [];

function startTimer() {
  const label = document.getElementById("timerLabel").value;
  const name = document.getElementById("timerName").value;
  const category = document.getElementById("category").value;
  const priority = document.getElementById("priority").value;
  const hours = parseInt(document.getElementById("hours").value) || 0;
  const minutes = parseInt(document.getElementById("minutes").value) || 0;
  const seconds = parseInt(document.getElementById("seconds").value) || 0;
  const repeat = document.getElementById("repeatTimer").checked;

  if (!name || (!hours && !minutes && !seconds)) {
    alert("Please enter a name and valid time.");
    return;
  }

  const duration = hours * 3600 + minutes * 60 + seconds;
  const id = Date.now();

  const timer = {
    id,
    label,
    name,
    category,
    priority,
    duration,
    remaining: duration,
    interval: null,
    repeat,
    paused: false,
  };

  timers.push(timer);
  runTimer(timer);
  renderTimers();
}

function runTimer(timer) {
  timer.interval = setInterval(() => {
    if (!timer.paused) {
      timer.remaining--;
      renderTimers();
      if (timer.remaining <= 0) {
        clearInterval(timer.interval);
        alert(`Timer "${timer.name}" finished!`);
        history.push(timer);
        if (timer.repeat) {
          timer.remaining = timer.duration;
          runTimer(timer);
        }
        renderTimers();
        renderHistory();
      }
    }
  }, 1000);
}

function renderTimers() {
  const container = document.getElementById("activeTimers");
  container.innerHTML = "<h2>Active Timers</h2>";

  timers.forEach(timer => {
    const div = document.createElement("div");
    div.className = timer.category;

    const progress = 100 * (timer.remaining / timer.duration);

    div.innerHTML = `
      <strong>${timer.label} - ${timer.name}</strong><br>
      Category: ${timer.category} | Priority: ${timer.priority}<br>
      Time left: ${formatTime(timer.remaining)}<br>
      <div class="progress-bar" style="width:${progress}%;"></div>
      <button onclick="pauseTimer(${timer.id})">${timer.paused ? 'Resume' : 'Pause'}</button>
      <button onclick="removeTimer(${timer.id})">Remove</button>
    `;

    container.appendChild(div);
  });
}

function pauseTimer(id) {
  const timer = timers.find(t => t.id === id);
  if (timer) {
    timer.paused = !timer.paused;
    renderTimers();
  }
}

function removeTimer(id) {
  const index = timers.findIndex(t => t.id === id);
  if (index !== -1) {
    clearInterval(timers[index].interval);
    timers.splice(index, 1);
    renderTimers();
  }
}

function resetAllTimers() {
  timers.forEach(t => clearInterval(t.interval));
  timers = [];
  renderTimers();
}

function formatTime(s) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h}h ${m}m ${sec}s`;
}

function renderHistory() {
  const list = document.getElementById("historyList");
  list.innerHTML = '';
  history.forEach(t => {
    const li = document.createElement("li");
    li.textContent = `${t.label} - ${t.name} (${t.category}, ${t.priority})`;
    list.appendChild(li);
  });
}

function quickStartTimer(seconds) {
  document.getElementById("timerLabel").value = "Quick";
  document.getElementById("timerName").value = `Quick ${seconds / 60}min`;
  document.getElementById("category").value = "work";
  document.getElementById("priority").value = "medium";
  document.getElementById("hours").value = 0;
  document.getElementById("minutes").value = seconds / 60;
  document.getElementById("seconds").value = 0;
  startTimer();
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}
