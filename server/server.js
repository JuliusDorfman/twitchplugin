require('dotenv').config({path: '/server'});
const chalk = require('chalk') ;
const request = require('request');
const express = require('express');
const port = process.env.PORT || 7000;
const connectDB = require('./config/mongoDB');


connectDB();

// ROUTES
const app = express();

app.listen(port, () => console.log(chalk.blueBright(`Server started on port ${port}. Listening...`)));

app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Handle Routes 
app.use('/', require('./gamesRoutes'));


// // //Twitch OAUTH
// const getToken = (url, callback) => {
//   const options =  {
//     url: process.env.TOKEN_URL,
//     json: true,
//     body: {
//       client_id: process.env.CLIENT_ID,
//       client_secret: process.env.CLIENT_SECRET,
//       grant_type: 'client_credentials'
//     }
//   };

//   request.post(options, (err, res, body) => {
//     if(err) {
//       return console.log('ERROR: ', err);
//     }
//     console.log(`Status: ${res.statusCode}`);
//     // console.log('Body', body);

//     callback(res);
//   });
// };


// var accessToken = '';
// getToken(process.env.TOKEN_URL, (res)=> {
//   // console.log(res.body);
//   accessToken = res.body.access_token;
// });

// // @desc test function to get access token
// setTimeout(()=> {
//   console.log('accessToken', accessToken);
// }, 1000);

// const getGames = (url, accessToken, callback) => {
//   const gamesOptions = {
//     url: process.env.GET_GAMES,
//     method: 'GET', 
//     headers: {
//       'Client-ID': process.env.CLIENT_ID,
//       'Authorization': 'Bearer ' + accessToken
//     }
//   };

//   request.get(gamesOptions, (err, res, body) => {
//     if(err) {
//       console.log('ERROR GET GAMES', err);
//     }
//     // console.log(`Status: ${res.statusCode}`);
//     // console.log(JSON.parse(body));
//   });
// }


// setTimeout(() =>{
//   getGames(process.env.getGames, accessToken, (response) =>{

//   })
// }, 2000);