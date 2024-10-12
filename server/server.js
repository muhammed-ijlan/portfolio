require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;
const indexPath = path.resolve(__dirname, '..', 'dist', 'index.html');
const { getMetadata } = require("./apis");
const formatHTML = require("./formatHTML");

app.get(["/index.html", "/", ""], async (req, res) => {
    try {
        const htmlData = fs.readFileSync(indexPath, 'utf8');
        const meta = await getMetadata("/");
        const data = formatHTML(htmlData, meta, req.url);
        res.send(data);
    } catch (err) {
        console.error('Error during file reading', err);
        res.status(404).end();
    }
});

// Static resources
app.use(express.static(path.resolve(__dirname, '..', 'dist'), { maxAge: '30d' }));

// Catch-all route for dynamic meta
app.get('/*', async (req, res) => {
    try {
        const htmlData = fs.readFileSync(indexPath, 'utf8');
        const meta = await getMetadata(req.path, req.query);
        const data = formatHTML(htmlData, meta, req.url);
        res.send(data);
    } catch (err) {
        console.error('Error during file reading', err);
        res.status(404).end();
    }
});

// Start the server
app.listen(PORT, (error) => {
    if (error) {
        console.error('Error during app startup', error);
    }
    console.log(`Listening on ${PORT}...`);
});
