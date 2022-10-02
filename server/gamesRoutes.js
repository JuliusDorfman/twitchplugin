require('dotenv').config();
const express = require('express');
const router = express.Router();
const { controller } = require('./gamesController');
// const server = require('./server');
const request = require('request');

// ------------------------------------------------------
//Twitch OAUTH

const getToken = (url, callback) => {
    const options =  {
        url: process.env.TOKEN_URL,
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
    
        callback(res);
    });
};
// ------------------------------------------------------

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
        console.log(`Status: ${res.statusCode}`);
        console.log(JSON.parse(body));
        });
    }
  
    var accessToken = '';
    getToken(process.env.TOKEN_URL, (res)=> {
        // console.log(res.body);
        accessToken = res.body.access_token;
        setTimeout(()=> {
            getGames(process.env.GET_GAMES, accessToken, (response) =>{
        
            });
        })
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