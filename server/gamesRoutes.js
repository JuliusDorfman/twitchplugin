// IMPORTS
require('dotenv').config();
const express = require('express');
const router = express.Router();
const { controller } = require('./gamesController');
// const server = require('./server');
const request = require('request');
const chalk = require('chalk');
const twitchChat = chalk.hex('#8510d8').bgWhiteBright;
// MONGODB REQUIREMENTS
const Streamers = require('./models/streamerModel');
const tmi = require('tmi.js');

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
            // console.log("FULL RESPONSE: ", JSON.parse(body))
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

// Globally accessable Access Token
// var accessToken = '';
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
            // console.log("FULL RESPONSE: ", JSON.parse(body))
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
// Connect to Channel Chat
const WebSocketClient = require('websocket').client;
const client = new WebSocketClient();

router.get('/getTwitchChat', (req, res) =>{
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
        });
    };

    var accessToken = '';
    getToken(process.env.TOKEN_URI, (res)=> {
        return accessToken = res.body.access_token;
    }).then(() => {
    // TODO: exponential backoff approach to reconnect  
    //       i.e. try connecting in 1 second... 2... 4... ect...
        // Initialize options using tmi node package
        const tmiClient = new tmi.Client({
            options: { debug: true },
            connection: {
                reconnect: true,
                secure: true,
            },
            identity: {
                username: process.env.TWITCH_USERNAME,
                password: process.env.TWITCH_BOT_ACCESS_TOKEN,
            },
            channels: ['stateoftwitchart', 'dorfroe'],
        })

        tmiClient.on('connectFailed', function(error) {
            console.log('Connect Error: ' + error.toString());
        })
       
        tmiClient.on('connecting', (address, port) => {
            chalk.yellow(console.log("Connecting..."))
        })

        // Listening
        tmiClient.on('connected', (channel, tags, message, self) => {
            console.log(twitchChat.underline(`Twitch Chat WebSocket Client Connected. Now Listening...`));

            if (self) return;
  
            tmiClient.say(channel, `@${tags.username}, `);
           

            // // Send CAP (optional), PASS, and NICK messages
    
            
        
            // // connection.sendUTF('JOIN #bar,#foo');
        })
        let chatCounter = 0;
        let chatInput = [];
        console.log('initial chat counter', chatCounter);
        tmiClient.on('chat', (channel, tags, message, self) => {
            if (self) return;
            console.log('channel', channel);
            // console.log('tags', tags);
            console.log('username', tags['display-name']);
            console.log('Message', message);
            chatInput.push(message);
            chatCounter += 1;
            if (chatCounter === 2) {
                tmiClient.disconnect().then(()=> {
                    chalk.bgBlackBright.bold.blueBright(console.log('Return Data', chatInput));
                    res.status(200).json({chatInput: chatInput})
                    return {chatInput: chatInput};
                    chatCounter = 0;
                    chatInput = [];
                }).catch(err =>{
                    throw err;
                })
            }
            console.log('chatCounter', chatCounter);
        })

        
        
        tmiClient.connect('ws://irc-ws.chat.twitch.tv:80').catch(console.error)
        

    }).catch(err => {
        chalk.red(console.log("Error getting Auth for Chatbot", err));
        // console.log("Error getting Auth for Chatbot", err)
    });


    


})

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