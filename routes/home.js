// home.js
const express = require('express');
const path = require('path');
const route = express.Router(); // изменено на route

route.get('/', (req, res) => {
    const iPath = path.resolve(__dirname, '../views/index.html');
    res.sendFile(iPath);
});

module.exports = route;
