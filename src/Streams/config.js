const configs = {
    development: {
        SERVER_URI: 'https://localhost:7000/',
    },
    production: {
        SERVER_URI: 'HEROKU_URI',
    },
};

module.exports = configs;