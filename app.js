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
    response.render("index", { appTitle: process.env.APP_TITLE });
})

app.get('/stats/:shortCode', (request, response) => {
    //  check if shortCode is in database
    connection.query('SELECT * FROM urls WHERE shortCode = ?', [request.params.shortCode], function(error, results) {
        if (error) {
            console.error(error.stack);
        }

        //  redirect if it is, otherwise 404
        if (results.length > 0) {
            response.render("stats", {
                appTitle: process.env.APP_TITLE,
                targetURL: results[0].targetURL,
                shortURL: process.env.APP_BASE_URL + results[0].shortCode,
                dateCreated: results[0].dateCreated.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                dateLastHit: results[0].dateLastHit.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                hits: results[0].hits
            });
        } else {
            response.status(404);
            response.render("missing", { appTitle: process.env.APP_TITLE });
        }
    });
});

app.post('/create', async (request, response) => {
    //  check if target url is in database already
    await connection.query('SELECT * FROM urls WHERE targetURL = ?', [request.body.targetURL], function(error, results) {
        var shortCode;
        
        if (results.length > 0) {
            shortCode = results[0].shortCode;
        } else {
            //  if not, generate short url and write to database
            shortCode = Math.random().toString(36).substr(2, 6);
            
            connection.query("INSERT INTO urls (targetURL, shortCode, dateCreated, dateLastHit, hits) VALUES (?, ?, ?, ?, ?)",
                [request.body.targetURL, shortCode, new Date(), new Date(), 0], function(error, results) {

                if (error) {
                    console.error(error.stack);
                }
            });
        }

        response.render("result", {
            appTitle: process.env.APP_TITLE,
            shortURL: process.env.APP_BASE_URL + shortCode,
            statsURL: process.env.APP_BASE_URL + "stats/" + shortCode,
        });
    });
});

app.get('/:shortCode', async (request, response) => {
    //  check if shortCode is in database
    await connection.query('SELECT * FROM urls WHERE shortCode = ?', [request.params.shortCode], function(error, results) {
        if (error) {
            console.error(error.stack);
        }
        
        //  redirect if it is, otherwise 404
        if (results.length > 0) {
            //  increment hits
            connection.query('UPDATE urls SET hits = ? WHERE shortCode = ?', [results[0].hits + 1, request.params.shortCode]);

            response.redirect(results[0].targetURL);
        } else {
            response.status(404);
            response.render("missing", { appTitle: process.env.APP_TITLE });
        }
    });
});

// start server
const port = 80;
app.listen(port, () => {
    console.log(new Date().toISOString() + " | Server running at port " + port);
});

