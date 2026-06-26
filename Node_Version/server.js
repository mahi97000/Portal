const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const PORT = process.env.PORT || 3000;

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

const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Normalize URL path and strip query parameters
    let urlPath = req.url.split('?')[0];

    // Handle mock API for database operations (matches PHP endpoint api.php)
    if (urlPath === '/api.php') {
        const dbFile = path.join(__dirname, 'database.json');
        
        if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    const decoded = JSON.parse(body);
                    fs.writeFile(dbFile, JSON.stringify(decoded, null, 4), 'utf8', (err) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ status: "error", message: "Failed to write database file" }));
                        } else {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ status: "success", message: "Database saved successfully" }));
                        }
                    });
                } catch (e) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ status: "error", message: "Invalid JSON data" }));
                }
            });
            return;
        } else if (req.method === 'GET') {
            fs.readFile(dbFile, 'utf8', (err, content) => {
                if (err) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        students: [],
                        settings: {},
                        bookStock: 0,
                        inquiries: [],
                        tasks: []
                    }));
                } else {
                    const acceptEncoding = req.headers['accept-encoding'] || '';
                    if (acceptEncoding.includes('gzip')) {
                        zlib.gzip(content, (gzipErr, compressed) => {
                            if (gzipErr) {
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(content);
                            } else {
                                res.writeHead(200, {
                                    'Content-Type': 'application/json',
                                    'Content-Encoding': 'gzip'
                                });
                                res.end(compressed);
                            }
                        });
                    } else {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(content);
                    }
                }
            });
            return;
        }
    }

    // Default to index.html for root path
    let filePath = path.join(__dirname, urlPath === '/' ? 'index.html' : urlPath);

    // Prevent directory traversal attacks
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Forbidden');
        return;
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1><p>The requested file was not found.</p>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${error.code}`, 'utf-8');
            }
        } else {
            // Apply Gzip compression for text assets (html, css, js, json, svg)
            const acceptEncoding = req.headers['accept-encoding'] || '';
            const compressable = /text|javascript|json|svg/.test(contentType);

            if (compressable && acceptEncoding.includes('gzip')) {
                zlib.gzip(content, (err, compressed) => {
                    if (err) {
                        res.writeHead(200, { 'Content-Type': contentType });
                        res.end(content);
                    } else {
                        res.writeHead(200, {
                            'Content-Type': contentType,
                            'Content-Encoding': 'gzip'
                        });
                        res.end(compressed);
                    }
                });
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content);
            }
        }
    });
});

server.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`⚡ EDIZ IT Portal (Node.js version) running!`);
    console.log(`🚀 Access local website: http://localhost:${PORT}`);
    console.log(`==================================================`);
});