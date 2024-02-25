'use strict';

require('dotenv').config();

const express = require('express');
const mysql = require('mysql');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'static')));

const connection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

connection.connect((error) => {
    if (error) {
        console.error(error.stack);
    }
});

app.get('/', (request, response) => {
    response.render("index");
})

app.get('/stats/:shortCode', (request, response) => {
    //  check if shortCode is in database
    //  redirect if it is, otherwise 404
    //  console.log(request.params.shortCode);
})

app.post('/shorten', (request, response) => {
    //  check if target url is in database already
    //  if not, generate short url and qr code
})

app.get('/:shortCode', (request, response) => {
    //  check if shortCode is in database
    //  redirect if it is, otherwise 404
});

// start server
const port = 80;
app.listen(port, () => {
    console.log(new Date().toISOString() + " | Server running at port " + port);
});

