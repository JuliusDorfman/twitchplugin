const path = require ('path');
require('dotenv').config({path: path.join(__dirname, '/')});

// require('dotenv').config({path: '/server'});
const chalk = require('chalk');
const request = require('request');
const express = require('express');
const port = process.env.PORT || 7000;
const connectDB = require('./config/mongoDB');
const cors = require('cors');

// connectDB();






// ROUTES
const app = express();

app.listen(port, () => console.log(chalk.blueBright(`Server started on port ${port}. Listening...`)));

app.use(express.urlencoded({extended: false}));
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('/build'));
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
	});
}




// Handle Routes 
app.use('/', require('./gamesRoutes'));
