'use strict';
// require the libraries
const express = require('express'); //you have to do npm install
const app = express();
require('dotenv').config();
const PORT = process.env.PORT|| 3001;
const cors = require('cors'); //cors is the policeman

// app.use(express.static('./public'));
app.use(cors()); 
//cors only needed because our server doesnt have a front end, but the front end is out there

//routes
// app.get('/', (request,response) => response.send(('Hello hey this is my server')));
app.get('/hello', (request,response) => response.send(('Hi there. Working with Matt today')));

app.get('*',(request, response) => {response.status(404).send('this round does not exist')});
// turn the PORT on
app.listen(PORT, ()=> console.log(`app is up and running on city explorer: ${PORT}`));