import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        title: "Stok Takip",
        icon: path.join(__dirname, '../public/vite.svg'), // Using vite logo as placeholder icon
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, // For simplicity in this use case, though preload is better practice for security
        },
    });

    // In production, load the built index.html
    // In development, you might want to load localhost, but for the built exe we load the file.
    if (app.isPackaged) {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    } else {
        // For local dev with electron
        mainWindow.loadURL('http://localhost:5173');
        // mainWindow.loadFile(path.join(__dirname, '../dist/index.html')); // Test build locally
    }
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
