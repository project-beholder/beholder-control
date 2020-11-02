const ipcRenderer = require('electron').ipcRenderer;
const Beholder = require('beholder-detection');

// Code for if I can get key press working on front side
// const { keyboard, Key, mouse, left, right, up, down, screen } = require("@nut-tree/nut-js");
// In keyboard.class.js, I have set the keyboard delay to 0 Ms
// Attach listener in the main process with the given ID
// keyboard.config.autoDelayMs = 1;

// Vars for detecting a good feeling button
let wasMarkerPresent = false;
const BUTTON_TIMEOUT = 100;
let buttonTimer = BUTTON_TIMEOUT;
let markerButton;

// code written in here will be executed once when the page loads
function init() {
  // Initialize beholder
  Beholder.init('#beholder-root');
  markerButton = Beholder.getMarker(3);
  
  requestAnimationFrame(update);
}

let lastTime = Date.now();
// code written in here will be executed every frame
function update() {
  const currentTime = Date.now();
  const delta = currentTime - lastTime;
  lastTime = currentTime;

  Beholder.update();

  requestAnimationFrame(update);

  buttonTimer -= delta;

  // This is the logic for a single key press using marker 3
  if (markerButton.present) {
    buttonTimer = BUTTON_TIMEOUT;
    if (!wasMarkerPresent) {
      wasMarkerPresent = true;

      // Send a key down event to the main process
      ipcRenderer.send('A_KEY_DOWN');
    }
  }

  if (wasMarkerPresent && !markerButton.present && buttonTimer <= 0) {
    wasMarkerPresent = false;

    // Send a key up event to the main process
    ipcRenderer.send('A_KEY_UP');
  }
}

window.onload = init;

