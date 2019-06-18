// Basic init
const {app, BrowserWindow} = require('electron');

// Let electron reloads by itself when webpack watches changes in ./app/
// require('electron-reload')(__dirname);

// To avoid being garbage collected
let mainWindow;

app.on('ready', () => {
    const mainScreen = require('electron').screen.getPrimaryDisplay();
    const dimensions = mainScreen.size;
    mainWindow = new BrowserWindow({
        width: dimensions.width,
        height: dimensions.height,
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.loadURL(`file://${__dirname}/app/index.html`);

    // mainWindow.toggleDevTools()
});
