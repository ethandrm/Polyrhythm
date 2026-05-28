let audioCtx;
let running = false;
let intervalId;

function start() {
  if (running) return;
  running = true;

  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  // 🔥 IMPORTANT: must be inside user click
  audioCtx.resume();

  // tiny “silent click” to unlock audio on iOS
  const unlock = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  gain.gain.value = 0;

  unlock.connect(gain);
  gain.connect(audioCtx.destination);

  unlock.start();
  unlock.stop(audioCtx.currentTime + 0.01);

  let a = 0;
  let b = 0;

  function getTempo() {
    return parseInt(document.getElementById("tempo")?.value || 180);
  }

  function tick() {
    if (!running) return;

    const interval = (60 / getTempo()) * 1000;
    const ratio = getRatio();

    const aMax = ratio[0];
    const bMax = ratio[1];

    if (a === 0) playClick(700);
    if (b === 0) playClick(350);

    a++;
    b++;

    if (a >= aMax) a = 0;
    if (b >= bMax) b = 0;

    setTimeout(tick, interval);
  }

  tick();
}

function stop() {
  running = false;
  clearTimeout(intervalId);
}

function getRatio() {
  return document.getElementById("ratio").value.split(",").map(Number);
}

function playClick(freq) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = "square";
  osc.frequency.value = freq;

  gain.gain.value = 0.05;

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.05);
}
