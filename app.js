'use strict';

require('dotenv').config();

const express = require('express');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'static')));

app.get('/', (request, response) => {
    response.render("index");
})

// start server
const port = 80;
app.listen(port, () => {
    console.log(new Date().toISOString() + " | Server running at port " + port);
});

