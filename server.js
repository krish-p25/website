const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const https = require('https');

//Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname)));
app.set('etag', false)
app.use(bodyParser.json());
app.use(cors());
app.disable('x-powered-by');

// Middleware to set cache-control headers for all routes
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});

//HTTPS server
var options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
}
https.createServer(options, app).listen(443, () => {
    console.log(new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' }), 'HTTPS Server running on port 443');
});

//HTTP server
app.listen(80, () => {
    console.log(new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' }), 'HTTP Server running on port 80');
});

//Routes
app.get('/', (req, res) => res.send('Hello World!'));

app.get('/contact', (req, res) => {
    res.setHeader('x-created-by', 'kp')
    res.sendFile('contact.html', { root: __dirname });
})

//Error handling
process.on('uncaughtException', (err) => {
    console.log('Uncaught Exception')
    console.log(new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' }), err)
})

//404 Pager
app.get('*', function (req, res) {
    res.setHeader('x-created-by', 'kp')
    res.send('Page 404');
});