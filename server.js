const express = require('express');
const fs = require('fs');
const app = express();
const port = 5500;

app.get('/', (req, res) => res.send('Hello World!'));
