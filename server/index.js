require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const path = require('path');
const router = require('./router.js');

const app = express();

// Middle Ware
app.use(morgan('dev'));
app.use(express.json());

app.use(router);

app.listen(process.env.PORT);
console.log(`Listening on port: ${prcess.env.PORT}`);