// Electron Entry Point
const { app, BrowserWindow } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev');

function createWindow () {
    const mainWindow = new BrowserWindow({
        width: 1366,
        height: 768,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    if (isDev) {
        // Connect to React Local Server while devloping
        mainWindow.loadURL('http://localhost:3000/');
        mainWindow.webContents.openDevTools()
    } else {
        // Read React distribution from `npm run build`
        mainWindow.loadFile('./build/index.html');
    }
}

app.whenReady().then(() => {
    createWindow()
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})