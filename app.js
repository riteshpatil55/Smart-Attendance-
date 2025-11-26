const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const exportBtn = document.getElementById('exportBtn');
const statusEl = document.getElementById('status');
const attTableBody = document.querySelector('#attTable tbody');
const dateLabel = document.getElementById('dateLabel');
const dbArea = document.getElementById('dbArea');
const saveDbBtn = document.getElementById('saveDbBtn');
const loadSampleBtn = document.getElementById('loadSampleBtn');

let recognition;
let listening = false;

const sampleDB = [
  {"name": "Ritesh Patil", "usn": "1CD23CS002"},
  {"name": "Chandu GR", "usn": "1CD23CS001"},
  {"name": "Anoop", "usn": "1CD23CS003"}
];

function todayDateStr() {
  return new Date().toISOString().slice(0,10);
}
dateLabel.textContent = todayDateStr();

function loadDB() {
  const data = localStorage.getItem('studentDB');
  dbArea.value = data || JSON.stringify(sampleDB, null, 2);
}
function getDB() {
  try { return JSON.parse(dbArea.value); }
  catch { return sampleDB; }
}
saveDbBtn.onclick = () => {
  localStorage.setItem('studentDB', dbArea.value);
  alert('Saved!');
};
loadSampleBtn.onclick = () => {
  dbArea.value = JSON.stringify(sampleDB, null, 2);
};

function initRecognition() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SR();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.onstart = () => {
    listening = true;
    statusEl.textContent = 'Listening...';
  };
  recognition.onend = () => {
    listening = false;
    statusEl.textContent = 'Idle';
  };
  recognition.onresult = e => {
    const text = e.results[0][0].transcript;
    statusEl.textContent = 'Heard: ' + text;
    markAttendance(text);
  };
}
function normalize(s) {
  return s.toLowerCase().trim();
}

function markAttendance(spoken) {
  const db = getDB();
  const name = normalize(spoken);
  const matched = db.find(s => normalize(s.name) === name);
  const time = new Date().toLocaleTimeString();

  const row = matched ?
    {name: matched.name, usn: matched.usn} :
    {name: spoken, usn: "UNKNOWN"};

  saveRecord(row.name, row.usn, time);
  addRow(row.name, row.usn, time);
}

function saveRecord(name, usn, time) {
  const key = 'attendance_' + todayDateStr();
  const list = JSON.parse(localStorage.getItem(key) || '[]');
  list.push({name, usn, time, date: todayDateStr()});
  localStorage.setItem(key, JSON.stringify(list));
}

function addRow(name, usn, time) {
  attTableBody.insertAdjacentHTML('afterbegin',
    `<tr><td>${name}</td><td>${usn}</td><td>${time}</td><td>✔</td></tr>`);
}

function loadToday() {
  const key = 'attendance_' + todayDateStr();
  const list = JSON.parse(localStorage.getItem(key) || '[]');
  list.reverse().forEach(r => addRow(r.name, r.usn, r.time));
}

exportBtn.onclick = () => {
  const key = 'attendance_' + todayDateStr();
  const list = JSON.parse(localStorage.getItem(key) || '[]');
  if (!list.length) return alert('Nothing to export!');
  const rows = list.map(r => `${r.name},${r.usn},${r.time},${r.date}`).join('\n');
  download(`Name,USN,Time,Date\n${rows}`);
};
function download(text) {
  const blob = new Blob([text], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `attendance_${todayDateStr()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

startBtn.onclick = () => {
  if (!recognition) initRecognition();
  recognition.start();
  startBtn.disabled = true;
  stopBtn.disabled = false;
};
stopBtn.onclick = () => {
  recognition.stop();
  startBtn.disabled = false;
  stopBtn.disabled = true;
};

window.onload = () => {
  loadDB();
  loadToday();
  initRecognition();
};
