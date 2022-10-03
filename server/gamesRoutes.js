// IMPORTS
require('dotenv').config();
const express = require('express');
const router = express.Router();
const { controller } = require('./gamesController');
// const server = require('./server');
const request = require('request');
const axios = require('axios');
const asyncHandler = require('express-async-handler');

// MONGODB REQUIREMENTS
const Streamers = require('./models/streamerModel');


// ------------------------------------------------------
// // @desc Get Test Route
// router.get('/', controller.getTestRoute);

router.get('/test', (req, res) => {
    console.log('Get Test Route: ', res.statusCode);
    res.status(200).json({ Message: 'Get Test Route'});
});
// ------------------------------------------------------

// ------------------------------------------------------
// // @ desc Get Top Games from Twitch
// router.get('/', controller.getTopGames);

router.get('/getTopGames', (req, res) => {
    console.log('Get Top Games: ', res.statusCode);
    res.status(200).json({ Message: 'Get Top Games'});
    
    const getToken = (url, callback) => {
        return new Promise((resolve, reject) => {
            const options =  {
                url: process.env.TOKEN_URI,
                json: true,
                body: {
                    client_id: process.env.CLIENT_ID,
                    client_secret: process.env.CLIENT_SECRET,
                    grant_type: 'client_credentials'
                }
            };
        
            request.post(options, (err, res, body) => {
                if(err) {
                    return console.log('ERROR: ', err);
                }
                console.log(`Status: ${res.statusCode}`);
                // console.log('Body', body);
            
                resolve({accessToken: callback(res)});
                // reject({Message: reject});
            });
        })
   
    };

    const getGames = (url, accessToken, callback) => {
        const gamesOptions = {
            url: process.env.GET_GAMES,
            method: 'GET', 
            headers: {
            'Client-ID': process.env.CLIENT_ID,
            'Authorization': 'Bearer ' + accessToken
            }
        };
    
        request.get(gamesOptions, (err, res, body) => {
            if(err) {
                console.log('ERROR GET GAMES', err);
            }
            let topGames = JSON.parse(body);
            console.log(`Status: ${res.statusCode}`);
            console.log("RESPONSE: ", JSON.parse(body));
            return topGames.json;
        });
    }

    var accessToken = '';
    getToken(process.env.TOKEN_URI, (res)=> {
        console.log(res.body);
        return accessToken = res.body.access_token;
        
    }).then((response) => {
        getGames(process.env.GET_GAMES, response.accessToken, (response) =>{
            res.json(response);
        })
    }).catch(err=> {
        console.error("ERROR FETCHING DATA", err);
    });

   

});
// ------------------------------------------------------

 
// NOTE: Can also chain route functions router.route('/').get(getTestRoute).get(getTopGames);

// router.post('/', (req, res) => {
//     res.status(200).json({ Message: 'post top games routes'});
// })

// router.put('/:id', (req, res) => {
//     res.status(200).json({ Message: `Update ${id}`});
// })

// router.delete('/:id', (req, res) => {
//     res.status(200).json({ Message: `Delete ${id}`});
// })



module.exports = router;