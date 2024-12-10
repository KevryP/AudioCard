const Sequelize = require('sequelize');

// Load environment variables from .env file
require('dotenv').config();

// Initialize Sequelize with database credentials
const sequelize = new Sequelize(
    'audiocard-db',
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: 3306,
        dialect: 'mysql',
    }
);

// Test the connection to the database
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection to the database has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = sequelize; 
