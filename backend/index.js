const express = require('express');
const bodyParser = require('body-parser');
const user = require('./routes/user');
// const yelp = require('./routes/yelp');
const favorites = require('./routes/favorites');
const InitiateMongoServer = require('./config/db');
const cors = require('cors');

// Initiate Mongo Server
InitiateMongoServer();

const app = express();
// app.use(cors());
app.use(express.json());


// PORT
const PORT = process.env.PORT || 3002;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  next();
});
/**
 * Router Middleware
 * Router = /user/*
 * Method - *
 */
app.use('/user', user);

// /**
//  * Router = /yelp/*
//  * Method - *
//  */
// app.use('/yelp', yelp);

app.use('/favorites', favorites);

  // let post1 = {
  //   title: "Hello",
  //   number: "4159906637",
  //   address: "2210 Haste St"
  // }
  
  // let post2 = {
  //   title: "Hello",
  //   number: "4159906637",
  //   address: "2210 Haste St"
  // }
  
  // let post3 = {
  //   title: "Hello",
  //   number: "4159906637",
  //   address: "2210 Haste St"
  // }
  // let post4 = {
  //   title: "Hello",
  //   number: "4159906637",
  //   address: "2210 Haste St"
  // }
  // let post5 = {
  //   title: "Hello",
  //   number: "4159906637",
  //   address: "2210 Haste St"
  // }
  // let post6 = {
  //   title: "Hello",
  //   number: "4159906637",
  //   address: "2210 Haste St"
  // }
  // let data= {1:post1, 2:post2, 3:post3, 4:post4, 5:post5, 6:post6}
  
app.get('/favorites', (req, res) => {
    res.send(Object.values(data))
})


  // post1 = {
  //   title: "Hello World",
  //   number: "4159906637",
  //   address: "2210 Haste St"
  // }
  
  // post2 = {
  //   title: "It's your lovely restaurant Pho le",
  //   number: "4159906637",
  //   address: "2210 Haste St"
  // }
  
  // post3 = {
  //   title: "Sheeeeeeeeeeeeeeeeeeeesh",
  //   number: "4159906637",
  //   address: "2210 Haste St"
  // }
  // post4 = {
  //   title: "HelloHelloHelloHelloHelloHelloHello",
  //   number: "4159906637",
  //   address: "2210 Haste St"
  // }
  // post5 = {
  //   title: "HelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHello",
  //   number: "4159906637",
  //   address: "2210 Haste St"
  // }
  // post6 = {
  //   title: "HelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHello",
  //   number: "4159906637",
  //   address: "2210 Haste St"
  // }
  // data= {1:post1, 2:post2, 3:post3, 4:post4, 5:post5, 6:post6}
  
  
app.get('/favorites', (req, res) => {
    res.send(Object.values(data))
})

app.get('/', (req, res) => {
    res.json({ message : 'API Working' });
});

app.listen(PORT, (req, res) => {
    console.log(`Server Started at PORT ${PORT}`);
});