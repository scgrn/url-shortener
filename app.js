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

app.get('/stats/:shortCode', async (request, response) => {
    //  check if shortCode is in database
    connection.query('SELECT * FROM urls WHERE shortCode = ?', [request.params.shortCode], function(error, results) {
        if (error) {
            console.error(error.stack);
        }
        
        //  redirect if it is, otherwise 404
        if (results.length > 0) {
            response.render("stats");
        } else {
            response.status(404);
            response.render("missing");
        }
    });
});

app.post('/shorten', async (request, response) => {
    //  check if target url is in database already
    await connection.query('SELECT * FROM urls WHERE targetURL = ?', [request.body.targetURL], function(error, results) {
        if (results.length > 0) {
            console.log("ALREADY IN DB");
        } else {
            //  if not, generate short url and qr code
            var shortURL = Math.random().toString(36).substr(2, 6);
            
        }
    });

    response.render("result");
});

app.get('/:shortCode', async (request, response) => {
    //  check if shortCode is in database
    await connection.query('SELECT * FROM urls WHERE shortCode = ?', [request.params.shortCode], function(error, results) {
        if (error) {
            console.error(error.stack);
        }
        
        //  redirect if it is, otherwise 404
        if (results.length > 0) {
            //  TODO: increment hits
            
            response.redirect(results[0].targetURL);
        } else {
            response.status(404);
            response.render("missing");
        }
    });
});

// start server
const port = 80;
app.listen(port, () => {
    console.log(new Date().toISOString() + " | Server running at port " + port);
});

