const express = require("express");
const app = express();
const mongoose = require("mongoose"); 

mongoose.connect('mongodb+srv://pranetallu:2LJEQQ8JE7EISp0s@cluster0.fskrd0v.mongodb.net/');

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('Connection error:', error);
});

db.once('open', () => {
  console.log('MongoDB connection successful');
});


app.listen(3001, () => {
    console.log("Server is on port 3001..")
})


  // pranetallu
  // 2LJEQQ8JE7EISp0s