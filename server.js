// server.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;
app.use("/public/css", express.static(path.resolve(__dirname, 'public', 'css')))
app.use("/public/images", express.static(path.resolve(__dirname, 'public', 'images')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const homeRoute = require('./public/routes/home');
const bookRoute = require('./public/routes/book');

app.use('/home', homeRoute);
app.use('/book', bookRoute);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
