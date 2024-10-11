require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;
const indexPath = path.resolve(__dirname, '..', 'dist', 'index.html');
const { getMetadata } = require("./apis");
const formatHTML = require("./formatHTML");
const queryString = require("querystring");


app.get(["/index.html", "/", ""], (req, res, next) => {
    fs.readFile(indexPath, 'utf8', async (err, htmlData) => {
        if (err) {
            console.error('Error during file reading', err);
            return res.status(404).end();
        }
        const meta = await getMetadata("/");
        const data = formatHTML(htmlData, meta, req.url);
        return res.send(data);
    });
});

// static resources should just be served as they are
app.use(express.static(
    path.resolve(__dirname, '..', 'dist'),
    { maxAge: '30d' },
));


app.get('/*', (req, res, next) => {
    fs.readFile(indexPath, 'utf8', async (err, htmlData) => {
        if (err) {
            console.error('Error during file reading', err);
            return res.status(404).end()
        }
        const meta = await getMetadata(req.path, req.query);
        const data = formatHTML(htmlData, meta, req.url);
        return res.send(data);
    });
});

// listening...
app.listen(PORT, (error) => {
    if (error) {
        return console.log('Error during app startup', error);
    }
    console.log("listening on " + PORT + "...");
});