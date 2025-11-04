
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Import backend handler
const backendHandler = require('./backend/index.js').handler;

// Import frontend handler
const frontendHandler = require('./frontend/index.js').handler;

const PORT = 53252;

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    try {
        // Route API requests to backend
        if (pathname.startsWith('/prod/') || pathname.startsWith('/coaches') || pathname.startsWith('/counties') || pathname.startsWith('/zip-codes')) {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            
            req.on('end', async () => {
                const event = {
                    httpMethod: req.method,
                    path: pathname,
                    pathParameters: extractPathParameters(pathname),
                    queryStringParameters: parsedUrl.query,
                    body: body || null,
                    headers: req.headers
                };
                
                try {
                    const response = await backendHandler(event);
                    res.writeHead(response.statusCode, response.headers);
                    res.end(response.body);
                } catch (error) {
                    console.error('Backend error:', error);
                    res.writeHead(500, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({error: 'Internal server error'}));
                }
            });
        }
        // Route root and frontend requests
        else if (pathname === '/' || pathname === '/index.html') {
            const event = {
                httpMethod: req.method,
                path: pathname,
                headers: req.headers
            };
            
            const response = await frontendHandler(event);
            res.writeHead(response.statusCode, response.headers);
            res.end(response.body);
        }
        // Serve static files
        else {
            const filePath = path.join(__dirname, pathname);
            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
                const ext = path.extname(filePath);
                const contentType = getContentType(ext);
                
                res.writeHead(200, {'Content-Type': contentType});
                fs.createReadStream(filePath).pipe(res);
            } else {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.end('Not Found');
            }
        }
    } catch (error) {
        console.error('Server error:', error);
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Internal Server Error');
    }
});

function extractPathParameters(pathname) {
    const parts = pathname.split('/');
    if (parts.length >= 4 && (parts[2] === 'coaches' || parts[1] === 'coaches')) {
        const id = parts[parts.length - 1];
        if (id && id !== 'coaches') {
            return { id: id };
        }
    }
    return null;
}

function getContentType(ext) {
    const types = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml'
    };
    return types[ext] || 'text/plain';
}

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🎾 Find Your Tennis Coach test server running at http://localhost:${PORT}`);
    console.log('📍 Enhanced features available:');
    console.log('   - County-based search');
    console.log('   - Skill level filtering (Beginner, Intermediate, Advanced)');
    console.log('   - Weekend availability filter');
    console.log('   - Holiday availability filter');
    console.log('');
    console.log('🔗 API Endpoints:');
    console.log(`   - GET http://localhost:${PORT}/coaches`);
    console.log(`   - GET http://localhost:${PORT}/counties`);
    console.log(`   - GET http://localhost:${PORT}/zip-codes`);
    console.log('');
    console.log('🔍 Example searches:');
    console.log(`   - County: http://localhost:${PORT}/coaches?county=Los Angeles`);
    console.log(`   - Skill Level: http://localhost:${PORT}/coaches?skill_level=Beginner`);
    console.log(`   - Weekend Available: http://localhost:${PORT}/coaches?weekend_available=true`);
    console.log(`   - Combined: http://localhost:${PORT}/coaches?county=Orange&skill_level=Intermediate&weekend_available=true`);
});

// Set environment variables for testing
process.env.DYNAMODB_TABLE = 'find-your-tennis-coach-coaches';
process.env.AWS_REGION = 'us-east-1';

