const { app, BrowserWindow, ipcMain } = require('electron');

const path = require('path');
const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200, // Set these to whatever is convenient
    height: 600,

    // Needed to include communication between render and main processes
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // mainWindow.setMenu(null);
  mainWindow.webContents.openDevTools(); // Uncomment to open the DevTools automatically

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true,
  }));

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  app.quit();
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// Example code for sending messages here from the main process to press keys
const { keyboard, Key } = require('@nut-tree/nut-js');
keyboard.config.autoDelayMs = 1;

ipcMain.on("A_KEY_DOWN", async (event,arg) => {keyboard.pressKey(Key.A)});
ipcMain.on("A_KEY_UP", async (event,arg) => {keyboard.releaseKey(Key.A)});
