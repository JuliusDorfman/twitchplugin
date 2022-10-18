const path = require ('path');
require('dotenv').config({path: path.join(__dirname, 'server' ,'/')});

// require('dotenv').config({path: '/server'});
const chalk = require('chalk');
const express = require('express');
// const connectDB = require(path.resolve(__dirname, 'server', 'config', 'mongoDB'));
const cors = require('cors');
const bodyParser = require('body-parser');
// const allowedOrigins = ['https://state-of-twitch-art.herokuapp.com/api/']
// connectDB();





// ROUTES
const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());
const port = process.env.PORT || 7000;

app.use('/api', require(path.resolve(__dirname, 'server', 'gamesRoutes.js'), next =>{
// app.use('/api', (req, res) =>{
	res.header("Access-Control-Allow-Origin", "https://state-of-twitch-art.herokuapp.com/"); // update to match the domain you will make the request from
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.set('Content-Type', 'application/json');
}));
// });

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, 'build')));
	// app.get('*', (req, res) => {
	app.get('/*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
	});
}

app.listen(port, () => console.log(chalk.blueBright(`Server started on port ${port}. Listening...`)));

// Handle Routes 