const mongoose = require('mongoose');
var chalk = require("chalk");
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../.env')});

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(chalk.cyan.underline(`MONGO DATABASE CONNECTED: ${conn.connection.host}`));
    } catch(error) {
        console.log(chalk.red.underline(`ERROR CONNECTING TO MONGO DATABASE: ${error}`));
        process.exit(1);
    }
}

module.exports = connectDB;