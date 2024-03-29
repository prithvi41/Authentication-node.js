const Client = require("pg").Client; 
require("dotenv").config();

const client = new Client({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE
});

client.connect();

module.exports = client;
