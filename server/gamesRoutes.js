// IMPORTS
require('dotenv').config();
const express = require('express');
const router = express.Router();
const path = require ('path');
const { controller } = require('./gamesController');
// const server = require('./server');
const request = require('request');
const chalk = require('chalk');
const twitchChat = chalk.hex('#8510d8').bgWhiteBright;
const app = express();
const fs = require('fs');
// app.use('/images', express.static(path.join(__dirname, 'server', 'state-diffusion')));

// MONGODB REQUIREMENTS
const Streamers = require('./models/streamerModel');
const tmi = require('tmi.js');

// AWS S3 REQUIREMENTS
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    region: process.env.AMZ_BUCKET_REGION,
    accessKeyId: process.env.AMZ_ACCESS_KEY,
    secretAccessKey: process.env.AMZ_SECRET_KEY
})

// MULTER REQUIREMENTS
// const multer = require('multer');
// const { uploadFile } = require('./s3');
// const upload = multer({ dest: 'uploads' })
// Required for running Python
const { spawn } = require('child_process');

// ------------------------------------------------------
// // @desc Get Test Route
// router.get('/', controller.getTestRoute);

router.get('/test', (req, res) => {
    console.log('Get Test Route: ', res.statusCode);
    res.status(200).json({ Message: 'Get Test Route'});
});
// Twitch Token Request (No Scope)
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


// // @ desc Get Top Games from Twitch
// router.get('/', controller.getTopGames);

router.get('/getTopGames', (req, res) => {
   
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



// ------------------------------------------------------
// // @ desc Streams with highest current viewers from Twitch
// ------------------------------------------------------

router.get('/getTopStreams', (req, res) => {

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
            // console.log("FULL RESPONSE: ", incoming_res.toJSON())
            callback(topStreams);
        });
    }

    
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
// // @ desc Single Streamer Channel
// ------------------------------------------------------

router.post('/getStreamerChannel', (req, res) => {
    let query = req.body.streamerName
    console.log("req", req.body.streamerName);

    const getStreamerChannel = (url, accessToken, callback) => {
        const streamOptions = {
            url: process.env.GET_CHANNEL + `/?query=${query}&first=10`,
            method: 'GET', 
            headers: {
                'Client-ID': process.env.CLIENT_ID,
                'Authorization': 'Bearer ' + accessToken,
            },
        };
    
        request.get(streamOptions, (err, incoming_res, body) => {
            if(err) {
                console.log('ERROR GET GAMES', err);
            }
            let streamerChannel = JSON.parse(body);
            console.log("FULL RESPONSE: ", incoming_res.toJSON())
            callback(streamerChannel);
        });
    }

    getToken(process.env.TOKEN_URI, (res)=> {
        return accessToken = res.body.access_token;
        
    }).then((response) => {
        getStreamerChannel(process.env.GET_CHANNEL, response.accessToken, (streamerChannel) => {
            console.log("streamerChannel", streamerChannel)
            res.status(200).json({ Message: streamerChannel.data});
            return streamerChannel.data;
        });
    }).catch(err=> {
        console.error("ERROR FETCHING DATA", err);
    });

})



// ------------------------------------------------------
// Connect to a Channels Chatroom
// ------------------------------------------------------
const WebSocketClient = require('websocket').client;
const client = new WebSocketClient();

router.post('/getTwitchChat', (req, res, body) =>{

    let channelToJoin = req.body.channelToJoin;
    
    
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
            channels: [channelToJoin],
        })

        tmiClient.on('connectFailed', function(error) {
            console.log('Connect Error: ' + error.toString());
        })
       
        tmiClient.on('connecting', (address, port) => {
            console.log(chalk.yellow("Connecting..."))
        })


  

        // Client's Chat Regulatory Variables
        let chatCounter = 0;
        let chatInput = [];
        let connected = false;
        // Listening...
        tmiClient.on('connected', (channel, tags, message, self) => {
            console.log(twitchChat.underline(`Twitch Chat WebSocket Client Connected. Now Listening...`));
            console.log(chalk.cyan(`Connecting to channel: ${channelToJoin}`))
            if (self) return;
  
            tmiClient.say(channel, `@${tags.username}`);

            // TODO: Send CAP, PASS, and NICK messages
            // TODO: Not needed since wont be connected for more than a few seconds
            connected = true;
                        
            clientTimemout();
        })
        let chatTimeoutFunction =() => {
            if (connected) {
                tmiClient.disconnect()
                    .then((data) =>{
                    console.log('Channel Chat Timeout. Chat not active enough.');
                    res.json({
                        chatInput: 'Channel Chat Timeout. Chat not active enough.',
                        noChat: true
                    })
                    clearTimeout(chatTimeoutFunction);
                    connected = false;
                    chatCounter = 0;
                    chatInput = [];
                })
            }
        }
       
        let clientTimemout =() => setTimeout(chatTimeoutFunction, 60000)
        
        tmiClient.on('chat', (channel, tags, message, self) => {
            if (self) return;
            console.log('channel', channel);
            // console.log('tags', tags);
            console.log('username', tags['display-name']);
            console.log('Message', message);
            chatInput.push(message);
            chatCounter += 1;
            if (chatCounter === 10) {
                tmiClient.disconnect().then(()=> {
                    chalk.bold.blueBright(console.log('Return Data', chatInput));
                    res.status(200).json({
                        chatInput: chatInput,
                        noChat: false
                    })
                    chatCounter = 0;
                    chatInput = [];
                    connected = false;
                    clearTimeout(clientTimemout);
                }).catch(err =>{
                    console.log("Error on Chat: ", err)
                    throw err;
                })
            }
            console.log('chatCounter', chatCounter);
        })
        
        tmiClient.connect('ws://irc-ws.chat.twitch.tv:80')
            .then(res => {
                
            })
            .catch(err => {
                // res.send({err: "Disconnected"})
            })

    }).catch(err => {
        console.log(chalk.red("Error getting Auth for Chatbot", err));
    });

})

// ------------------------------------------------------
// @desc Create a Python Child Process for Stable Diffusion Art Generator
// ------------------------------------------------------
router.post('/postRenderChatArt', (req, res, body) => {
    // const pythonPath = path.join(__dirname, 'stable-diffusion', 'text2img.py');
    const pythonPath = path.join(__dirname, 'dreamstudio.py');
    let artPrompt = req.body.artPrompt;
  
    artPrompt = artPrompt.join().replaceAll(",", " ");
    console.log(chalk.yellow.underline('Art Generation Prompt: '));
    console.log(chalk.yellowBright(artPrompt));

    return new Promise((resolve, reject) => {
        // console.log("Done1")
        callPythonScript = (artPrompt) => {
            const childPython = spawn('python', [pythonPath, artPrompt], {
                cwd: process.cwd(),
                detached: false,
                stdio: ["inherit"]
            });
        //    console.log("Done4")
           let finalResponse = '';
           childPython.stdout.on('data', function(message) {
                // console.log("Done8")
                console.log(chalk.yellowBright("Image Filename: ", message));
                // console.log("Done9")
                finalResponse += message.toString();
                
            });
            childPython.stdout.on('end', ()=>{
                // console.log("Done10: ");
                console.log("DONE11:")
                res.json({artFileName: finalResponse})


                // UNUSED MULTER S3 FOR UPLOADING SAVED FILES
                // let imagePath = '100822Oct10-green-61.png';
                // uploadFileToAWS(finalResponse);
            })
        }

        // console.log("Done2")
        resolve(pythonPromise());
        // console.log("Done5")
    });


    async function pythonPromise() {
        try {
            // console.log("Done3")
            const pythonPromiseResult = await callPythonScript(artPrompt);
            // console.log("Done6: ", pythonPromiseResult)
        } catch(err) {
            throw err
        }
        // console.log("Done7")
    }
// console.log("Never Reached")
   
})

// ------------------------------------------------------
// @desc Upload Generated Art Image to Amazon Web Services S3 Service
// ------------------------------------------------------

router.post('/uploadFileAWS', (req, res) => {
    // Read content from the file
    console.log('filename: ', req.body)
    fileName = req.body.fileName.trim()
    // let publicPath = path.join(__dirname, '../src/Assets/', fileName.trim());
    // console.log("publicPath: ", publicPath);
    // let serverPath = path.join(__dirname, 'stable-diffusion', 'generatedimages.py', fileName.trim());
    console.log('PRE FIX',fileName);

    let firstPointer = 0;
    let secondPointer = 0;
    let firstChar = '<';
    let secondChar = '>';
    let removedString = ''
    for (let i = 0; i < fileName.length; i++) {
        if (fileName[i]===firstChar){
            firstPointer = i;
        }
        if (fileName[i]===secondChar){
            secondPointer = i+1;
        }
        if (firstPointer !== 0 && secondPointer !== 0) {
            
          break
        }
    }
    
    removedString = fileName.slice(firstPointer, secondPointer);

    fileName = fileName.replace(removedString, '');

    console.log("POST FIX", fileName);


    let serverPath = path.join(__dirname, 'generatedimages', fileName);
    // console.log("serverPath: ", serverPath);



    


    const fileContent = fs.createReadStream(serverPath)
        
        console.log("fileContent", fileContent.path);
        
        
        const parms = {
            Bucket: process.env.AMZ_BUCKET_NAME,
            Key: fileName.trim(),
            Body: fileContent,
            ACL: 'public-read',
            ContentType: "image/png",
        };
        
        s3.upload(parms, (err, data) => {
            if (err) {
                throw err;
            }
            console.log("File Uploaded: ", data.Location);
            res.send({s3ImageAddress: data.Location});
    })
})


module.exports = router;



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


