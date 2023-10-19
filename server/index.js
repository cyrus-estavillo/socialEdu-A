const express = require("express");
const cors = require('cors');
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const User = require("./models/User.js");
const Post = require("./models/Post.js");
const Comment = require("./models/Comment.js");

mongoose.connect('mongodb+srv://pranetallu:2LJEQQ8JE7EISp0s@cluster0.fskrd0v.mongodb.net/');

// 'mongodb+srv://pranetallu:2LJEQQ8JE7EISp0s@cluster0.fskrd0v.mongodb.net/'

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
  catch (e) { // if username already exists
    res.status(400).json("Use different username / password");
  }
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  if (!userDoc) { // if username does not exist
    res.status(404).json("Invalid username");
    return;
  }
  if (password === userDoc.password) { // if password is correct
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

app.get('/profile', (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) {
      throw err;
    }
    else {
      res.json(info);
    }
  })
  res.json(req.cookies);
})

app.post('/logout', (req, res) => {
  res.cookie('token', '').json('logged out');
})

app.get("/user/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const userSpecific = await User.findById(id);
    res.status(201).json({ userSpecific });
  }
  catch (e) {
    res.status(400).json("Error getting the user");
  }
})

app.get("/allUsers", async (req, res) => {
  try {
    const userList = await User.find();
    res.status(201).json({ userList });
  }
  catch (e) {
    res.status(400).json({ e });
  }
})

app.post("/post", async (req, res) => {
  const { token } = req.cookies;
  const { text } = req.body;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) { // if user is not logged in
      res.status(404).json("User Not Logged in");
      return;
    }
    else {  // user loggin in
      try {
        const postSpecific = await Post.create({
          text: text,
          author: info.id
        });
        res.status(201).json({ postSpecific });
      }
      catch (e) {
        res.status(400).json("Error with Posting");
      }
    }
  })
})

app.get("/allPost", async (req, res) => {
  try {
    const postLists = await Post.find().sort({ date: -1, timestamp: -1 });
    res.status(201).json({ postLists });
  }
  catch (e) {
    res.status(400).json({ e });
  }
})

app.get("/userLikedPosts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const likedPosts = await User.findById(id);
    const likedP = likedPosts.liked; 
    res.status(201).json({ likedP });
  }
  catch (e) {
    res.status(400).json("Could not retrieve liked posts");
  }
})

app.post("/like/:id", async (req, res) => {
  const { token } = req.cookies;
  const { id } = req.params;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      res.status(404).json("User Not Logged in");
      return;
    }
    else {
      try {
        const postSpecific = await Post.findById(id);
        const userSpecific = await User.findById(info.id);
        if (userSpecific.liked.includes(postSpecific._id)) { // if user has already liked the post
          userSpecific.liked = userSpecific.liked.filter((postId) => postId.toString() !== postSpecific._id.toString()); // remove the post from liked array
          postSpecific.likes = postSpecific.likes - 1; // decrement the likes
          await userSpecific.save(); // update user info
          await postSpecific.save(); // update post information
          res.status(201).json("User disliked the post");
          return;
        }

        userSpecific.liked.push(id); // add the post to liked array of user's account
        postSpecific.likes = postSpecific.likes + 1; // increment the likes

        await userSpecific.save(); // update user info
        await postSpecific.save(); // update post information
        res.status(201).json("Successfully liked the post");
      }
      catch (e) {
        res.status(400).json("Error with Liking the Post");
      }
    }
  })
})

<<<<<<< Updated upstream
app.get("/comment", async (req, res) => {
  try {
    const commentList = Comment.find();
    res.status(201).json(commentList);
  }
  catch (e) {
    res.status(400).json("Error retrieving comments");
  }
})

app.get("/comment/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const commentSpecific = Comment.find(id);
    res.status(201).json(commentSpecific);
  }
  catch (e) {
    res.status(400).json("Error retrieving the comment")
  }
})
=======
/* ##### COMMENTS ##### */
>>>>>>> Stashed changes

app.post("/comment/:id", async (req, res) => {
  const { token } = req.cookies;
  const { id } = req.params;
  const { text } = req.body;

  jwt.verify(token, secret, {}, async (err, info) => {
      if (err) {
          res.status(404).json("User Not Logged in");
          return;
      } else {
          // Step 2.1: Extract tagged usernames from the comment text
          const regex = /@[a-zA-Z0-9_]+/g;
          const matches = text.match(regex);
          const taggedUsernames = matches ? matches.map(match => match.substring(1)) : [];

          // Step 2.2: Convert usernames to user IDs
          const taggedUsers = await User.find({ username: { $in: taggedUsernames } }).select('_id');
          const taggedUserIds = taggedUsers.map(user => user._id); // Create array of user IDs that were tagged in comment

          console.log(`Tagged user IDs: ${taggedUserIds}`);

          // Step 2.3: Create the comment with taggedUserIds
          try {
              const postSpecific = await Post.findById(id);
              const commentSpecific = await Comment.create({
                  text: text,
                  commentPerson: info.id,
                  taggedUsers: taggedUserIds  // Array of user IDs that were tagged in comment
              });
              postSpecific.comment.push(commentSpecific._id);
              await postSpecific.save();

              // Step 2.4: Notify tagged users (This could be a separate function)
              // FIXME: For now, let's just log it
              console.log(`Notify these user IDs: ${taggedUserIds}`);

              res.status(201).json("Successfully commented");
          } catch (e) {
              res.status(400).json("Error with Commenting");
          }
      }
  });
});


app.delete("/comment/:commentId", async (req, res) => {
  const { token } = req.cookies;
  const { commentId } = req.params;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      res.status(404).json("User Not Logged in");
      return;
    }
    const comment = await Comment.findById(commentId);
    const post = await Post.findById(comment.post);
    if (info.id === comment.commentPerson.toString() || info.id === post.author.toString()) {
      await Comment.findByIdAndDelete(commentId);
      res.status(200).json("Comment deleted");
    } else {
      res.status(403).json("Unauthorized");
    }
  });
});


/*
app.post("/addFollowing/:id", async (req, res) => {
  const { id } = req.params;
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      res.status(404).json("User Not Logged in");
      return;
    }
    else {
      try {
        const userSpecific = await User.findById(info.id);
        userSpecific.following.push(id);
        await userSpecific.save();
        res.status(201).json(`Added to Following ${id}`)
      }
      catch (e) {
        res.status(400).json("Error with Adding Followers");
      }
    }
  }
})
});
*/

app.listen(3001, () => {
  console.log("Server is on port 3001..")
})


// pranetallu
// 2LJEQQ8JE7EISp0s