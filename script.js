let workout = [
  { name: "Bench Press", sets: [ {}, {}, {}, {} ] },
  { name: "Overhead Press", sets: [ {}, {}, {} ] },
  { name: "Dips", sets: [ {}, {}, {} ] },
  { name: "Plank", sets: [ {}, {}, {} ] }
];

let history = JSON.parse(localStorage.getItem("history") || "[]");
const workoutDiv = document.getElementById("workout");
const historyDiv = document.getElementById("historyList");
const restTimer = document.getElementById("restTimer");
let restInterval = null;
let restDuration = 90;

function renderWorkout() {
  workoutDiv.innerHTML = "";
  workout.forEach((ex, i) => {
    const exDiv = document.createElement("div");
    exDiv.className = "exercise";
    exDiv.innerHTML = `<h3>${ex.name}</h3>`;
    ex.sets.forEach((set, j) => {
      const setDiv = document.createElement("div");
      setDiv.innerHTML = `
        Set ${j+1}:
        <input type="number" id="w-${i}-${j}" placeholder="kg" value="${set.weight||''}"> kg
        <input type="number" id="r-${i}-${j}" placeholder="reps" value="${set.reps||''}"> reps
        <button onclick="markSet(${i},${j})">✅</button>
      `;
      exDiv.appendChild(setDiv);
    });
    workoutDiv.appendChild(exDiv);
  });
}
renderWorkout();

function markSet(i,j) {
  const w = parseFloat(document.getElementById(`w-${i}-${j}`).value);
  const r = parseInt(document.getElementById(`r-${i}-${j}`).value);
  workout[i].sets[j] = { weight: w, reps: r };
  startRest();
  saveData();
}

function startRest() {
  let remaining = restDuration;
  clearInterval(restInterval);
  restTimer.innerText = `Rest: ${remaining}s`;
  restInterval = setInterval(() => {
    remaining--;
    restTimer.innerText = `Rest: ${remaining}s`;
    if (remaining <= 0) {
      clearInterval(restInterval);
      restTimer.innerText = "Go!";
      if ("vibrate" in navigator) navigator.vibrate([200, 100, 200]);
      new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg").play();
    }
  }, 1000);
}

function saveData() {
  localStorage.setItem("workout", JSON.stringify(workout));
}

document.getElementById("startBtn").onclick = () => {
  localStorage.setItem("startTime", Date.now());
  alert("Workout started!");
};
document.getElementById("endBtn").onclick = () => {
  const start = parseInt(localStorage.getItem("startTime") || Date.now());
  const elapsedMin = Math.round((Date.now()-start)/60000);
  history.unshift({ date: new Date().toLocaleString(), workout, elapsedMin });
  localStorage.setItem("history", JSON.stringify(history));
  alert("Workout saved!");
  renderHistory();
};

function renderHistory() {
  historyDiv.innerHTML = history.map(h => `
    <div>
      <b>${h.date}</b> — ${h.elapsedMin} min<br/>
      ${h.workout.map(ex => ex.name + " ").join(", ")}
    </div>
  `).join("<hr>");
}
renderHistory();
