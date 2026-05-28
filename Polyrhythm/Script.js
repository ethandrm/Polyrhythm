let audioCtx;
let running = false;
let intervalId;

function start() {
  if (running) return;
  running = true;

  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  audioCtx.resume();

  let a = 0;
  let b = 0;

  function getTempo() {
    return parseInt(document.getElementById("tempo").value);
  }

  function getInterval() {
    const bpm = getTempo();
    return (60 / bpm) * 1000;
  }

  function tick() {
    if (!running) return;

    const interval = getInterval();
    const ratio = getRatio();

    const aMax = ratio[0];
    const bMax = ratio[1];

    // ONLY the two voices (clean polyrhythm)
    if (a === 0) {
      playClick(700); // voice A
    }

    if (b === 0) {
      playClick(350); // voice B
    }

    a++;
    b++;

    if (a >= aMax) a = 0;
    if (b >= bMax) b = 0;

    intervalId = setTimeout(tick, interval);
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