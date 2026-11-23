const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const http = require('http');

let mainWindow = null;
let serverInstance = null;
const SERVER_PORT = 31415; // Dedicated port for desktop app

// Determine database location (Persistent in AppData when packaged)
function getDatabasePath() {
    if (app.isPackaged) {
        const userDataDir = app.getPath('userData');
        const dbPath = path.join(userDataDir, 'database.json');
        
        // If not initialized in userData, copy default database.json
        if (!fs.existsSync(dbPath)) {
            const bundledDb = path.join(__dirname, 'database.json');
            if (fs.existsSync(bundledDb)) {
                try {
                    fs.copyFileSync(bundledDb, dbPath);
                } catch (e) {
                    console.error('Failed to copy bundled database to userData:', e);
                }
            } else {
                fs.writeFileSync(dbPath, JSON.stringify({ students: [], settings: {} }, null, 2));
            }
        }
        return dbPath;
    }
    return path.join(__dirname, 'database.json');
}

// Start embedded background server
function startEmbeddedServer() {
    return new Promise((resolve, reject) => {
        const dbFilePath = getDatabasePath();
        const baseDir = __dirname;

        const MIME_TYPES = {
            '.html': 'text/html; charset=utf-8',
            '.css': 'text/css',
            '.js': 'text/javascript',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.ico': 'image/x-icon'
        };

        serverInstance = http.createServer((req, res) => {
            // Enable CORS
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

            if (req.method === 'OPTIONS') {
                res.writeHead(204);
                res.end();
                return;
            }

            let urlPath = req.url.split('?')[0];

            // Handle send-sms proxy endpoint
            if (urlPath === '/api/send-sms' || (urlPath === '/api.php' && req.url.includes('action=send_sms'))) {
                const queryParams = new URLSearchParams(req.url.split('?')[1] || '');
                const apiKey = queryParams.get('api_key') || '';
                const senderId = queryParams.get('senderid') || '';
                const number = queryParams.get('number') || '';
                const message = queryParams.get('message') || '';
                
                if (!apiKey || !senderId || !number || !message) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ status: "error", message: "Missing SMS parameters" }));
                    return;
                }
                
                const https = require('https');
                const targetUrl = `https://bulksmsbd.net/api/smsapi?api_key=${encodeURIComponent(apiKey)}&senderid=${encodeURIComponent(senderId)}&number=${encodeURIComponent(number)}&message=${encodeURIComponent(message)}`;
                
                https.get(targetUrl, (apiRes) => {
                    let data = '';
                    apiRes.on('data', (chunk) => { data += chunk; });
                    apiRes.on('end', () => {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(data);
                    });
                }).on('error', (err) => {
                    res.writeHead(502, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ status: "error", message: "SMS gateway connection failed: " + err.message }));
                });
                return;
            }

            // Handle API operations for database (GET / POST to /api.php or /database.json)
            if (urlPath === '/api.php' || urlPath === '/database.json') {
                if (req.method === 'GET') {
                    fs.readFile(dbFilePath, 'utf8', (err, data) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ status: "error", message: "Failed to read database: " + err.message }));
                            return;
                        }
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(data);
                    });
                    return;
                }

                if (req.method === 'POST') {
                    let body = '';
                    req.on('data', chunk => { body += chunk.toString(); });
                    req.on('end', () => {
                        try {
                            const parsed = JSON.parse(body);
                            fs.writeFile(dbFilePath, JSON.stringify(parsed, null, 2), 'utf8', (err) => {
                                if (err) {
                                    res.writeHead(500, { 'Content-Type': 'application/json' });
                                    res.end(JSON.stringify({ status: "error", message: "Failed to save database: " + err.message }));
                                    return;
                                }
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ status: "success", message: "Database saved successfully" }));
                            });
                        } catch (parseErr) {
                            res.writeHead(400, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ status: "error", message: "Invalid JSON body: " + parseErr.message }));
                        }
                    });
                    return;
                }
            }

            // Static file serving
            if (urlPath === '/' || urlPath === '') {
                urlPath = '/admin.html';
            }

            const safePath = path.normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[\/\\])+/, '');
            let filePath = path.join(baseDir, safePath);

            // If path is directory, serve index.html
            if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
                filePath = path.join(filePath, 'index.html');
            }

            fs.readFile(filePath, (err, content) => {
                if (err) {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('404 Not Found');
                    return;
                }
                const ext = path.extname(filePath).toLowerCase();
                const contentType = MIME_TYPES[ext] || 'application/octet-stream';
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content);
            });
        });

        serverInstance.listen(SERVER_PORT, '127.0.0.1', () => {
            console.log(`Embedded server running on http://127.0.0.1:${SERVER_PORT}`);
            resolve();
        });

        serverInstance.on('error', (err) => {
            console.error('Server error:', err);
            reject(err);
        });
    });
}

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 860,
        minWidth: 1080,
        minHeight: 700,
        title: 'EDIZ IT Institute - Management Portal',
        icon: path.join(__dirname, 'Logo-05.png'),
        backgroundColor: '#0f172a',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    // Hide standard menu bar for sleek modern desktop look
    mainWindow.setMenuBarVisibility(false);

    mainWindow.loadURL(`http://127.0.0.1:${SERVER_PORT}/admin.html`);

    // Handle external links by opening them in user's default browser
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('http://') || url.startsWith('https://')) {
            shell.openExternal(url);
            return { action: 'deny' };
        }
        return { action: 'allow' };
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// IPC Handlers
ipcMain.handle('app:get-version', () => {
    return app.getVersion();
});

ipcMain.handle('app:open-external', (event, url) => {
    if (url) shell.openExternal(url);
});

ipcMain.handle('app:print', (event, options) => {
    if (mainWindow) {
        mainWindow.webContents.print(options || {});
    }
});

ipcMain.handle('app:backup-database', async () => {
    const dbPath = getDatabasePath();
    const today = new Date().toISOString().split('T')[0];
    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
        title: 'Save Database Backup',
        defaultPath: `ediz_database_backup_${today}.json`,
        filters: [{ name: 'JSON Files', extensions: ['json'] }]
    });

    if (!canceled && filePath) {
        fs.copyFileSync(dbPath, filePath);
        return { success: true, path: filePath };
    }
    return { success: false, canceled: true };
});

ipcMain.handle('app:restore-database', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
        title: 'Select Database Backup File to Restore',
        filters: [{ name: 'JSON Files', extensions: ['json'] }],
        properties: ['openFile']
    });

    if (!canceled && filePaths.length > 0) {
        const sourcePath = filePaths[0];
        try {
            const data = fs.readFileSync(sourcePath, 'utf8');
            JSON.parse(data); // Validate JSON format
            const dbPath = getDatabasePath();
            fs.writeFileSync(dbPath, data, 'utf8');
            if (mainWindow) {
                mainWindow.reload();
            }
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }
    return { success: false, canceled: true };
});

// App Lifecycle
app.whenReady().then(async () => {
    try {
        await startEmbeddedServer();
        createMainWindow();
    } catch (err) {
        dialog.showErrorBox('Startup Error', 'Failed to start local server: ' + err.message);
        app.quit();
    }

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('will-quit', () => {
    if (serverInstance) {
        serverInstance.close();
    }
});
