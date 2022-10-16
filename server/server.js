require('dotenv').config({path: '/server'});
const chalk = require('chalk');
const express = require('express');
const port = process.env.PORT ? process.env.PORT : 7000;
// const connectDB = require('./config/mongoDB');
const cors = require('cors');

// Heroku cluster efficiency
// const CONCURRENCY = process.env.WEB_CURRENCY || 1;

// connectDB();

// ROUTES
const app = express();

app.listen(port, () => console.log(chalk.blueBright(`Server started on port ${port}. Listening...`)));

app.use(express.urlencoded({extended: false}));
app.use(cors());
app.use(express.json());

// Handle Routes 
app.use('/', require('./gamesRoutes'));

