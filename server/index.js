const express = require("express");
const cors = require('cors');
const app = express();
const mongoose = require("mongoose"); 
const bcrypt = require("bcrypt");
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const User = require("./models/User.js");

mongoose.connect('mongodb+srv://pranetallu:2LJEQQ8JE7EISp0s@cluster0.fskrd0v.mongodb.net/');

const salt = bcrypt.genSaltSync(10);
const secret = 'dsadsaewqerffrfrgrgrgbth5657';

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  allowedHeaders: 'Content-Type'
}));

app.use(express.json()); // parses reequest JSON data 

app.use(cookieParser()); // cookie parser


const db = mongoose.connection;

db.on('error', (error) => {
  console.error('Connection error:', error);
});

db.once('open', () => {
  console.log('MongoDB connection successful');
});

app.post('/signup', async (req, res) => {
  const { name, username, password } = req.body;
  try {
    const newUser = await User.create({
      name: name, 
      username: username,
      password: password
    });
    res.status(201).json({ newUser });
  }
  catch (e) {
    res.status(400).json( "Use different username / password" );
  }
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  if(!userDoc) {
    res.status(404).json("Invalid username");
    return; 
  } 
  if (password === userDoc.password) {
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) {
        throw err;
      }
      else {
        res.cookie('token', token).json({
          id: userDoc._id,
          username
        });
      }
    });
  }
  else {
    res.status(400).json("Invalid Password")
  }
})

app.post('/logout', (req, res) => {
  res.cookie('token', '').json('logged out');
})

app.get("/allUsers", async(req, res) => {
  try {
    const userList = await User.find();
    res.status(201).json({userList}); 
  }
  catch(e) {
    res.status(400).json({ e }); 
  }
})

app.listen(3001, () => {
    console.log("Server is on port 3001..")
})


  // pranetallu
  // 2LJEQQ8JE7EISp0s