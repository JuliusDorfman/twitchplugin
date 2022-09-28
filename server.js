require('dotenv').config();
const request = require('request');


//OAUTH
const getToken = (url, callback) => {

  const options =  {
    url: process.env.GET_TOKEN,
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
    console.log('Body', body);

    callback(res);
  });
};


var accessToken = '';
getToken(process.env.GET_TOKEN, (res)=> {
  console.log(res.body);
  accessToken = res.body.access_token;
});

setTimeout(()=> {
  console.log('accessToken', accessToken);
}, 1000);

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


setTimeout(() =>{
  getGames(process.env.getGames, accessToken, (response) =>{

  })
}, 1000)