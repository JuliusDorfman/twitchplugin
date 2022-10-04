// IMPORTS
require('dotenv').config();
const express = require('express');
const router = express.Router();
const { controller } = require('./gamesController');
// const server = require('./server');
const request = require('request');

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

                resolve({accessToken: callback(res)});
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
    
        request.get(gamesOptions, (err, incoming_res, body) => {
            if(err) {
                console.log('ERROR GET GAMES', err);
            }
            let topGames = JSON.parse(body);
            console.log("FULL RESPONSE: ", JSON.parse(body))
            callback(topGames);
        });
    }

    var accessToken = '';
    getToken(process.env.TOKEN_URI, (res)=> {
        return accessToken = res.body.access_token;
        
    }).then((response) => {
        getGames(process.env.GET_GAMES, response.accessToken, (topGames) => {
            res.status(200).json({ Message: topGames.data});
            return topGames.data;
        });
    }).catch(err=> {
        console.error("ERROR FETCHING DATA", err);
    });

});


router.get('/getTopStreams', (req, res) => {

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

                resolve({accessToken: callback(res)});
            });
        })
    };

    const getTopStreams = (url, accessToken, callback) => {
        const streamOptions = {
            url: process.env.GET_STREAMS,
            method: 'GET', 
            headers: {
            'Client-ID': process.env.CLIENT_ID,
            'Authorization': 'Bearer ' + accessToken
            }
        };
    
        request.get(streamOptions, (err, incoming_res, body) => {
            if(err) {
                console.log('ERROR GET GAMES', err);
            }
            let topStreams = JSON.parse(body);
            console.log("FULL RESPONSE: ", JSON.parse(body))
            callback(topStreams);
        });
    }

    var accessToken = '';
    getToken(process.env.TOKEN_URI, (res)=> {
        return accessToken = res.body.access_token;
        
    }).then((response) => {
        getTopStreams(process.env.GET_GAMES, response.accessToken, (topStreams) => {
            res.status(200).json({ Message: topStreams.data});
            return topStreams.data;
        });
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