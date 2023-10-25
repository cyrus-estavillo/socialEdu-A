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

app.get("/postsForEachUser/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const postLists = await Post.find({author: id});
    res.status(201).json({postLists}); 
  }
  catch(e) {
    res.status(400).json("Error with getting posts for each user");
  }
});

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
  const { text, tags } = req.body;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) { // if user is not logged in
      res.status(404).json("User Not Logged in");
      return;
    }
    else {  // user loggin in
      try {
        const postSpecific = await Post.create({
          text: text,
          author: info.id,
          tags: tags
        });
        res.status(201).json({ postSpecific });
      }
      catch (e) {
        res.status(400).json("Error with Posting");
      }
    }
  })
})

app.delete("/post/:id", async (req, res) => {
  const { token } = req.cookies;
  const { id } = req.params;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) { // if user is not logged in
      res.status(404).json("User Not Logged in");
      return;
    }
    else {  // user loggin in
      try {
        const postSpecific = await Post.findById(id);
        if (info.id == postSpecific.author.toString()) {
          const commentList = postSpecific.comment;
          for (var i = 0; i < commentList.length; i++) {
            await Comment.findByIdAndDelete(commentList[i]._id);
          }
          await Post.findByIdAndDelete(id);
          res.status(201).json("Successful Deletion");
        }
        else {
          res.status(404).json("This is not your post to delete");
        }
      }
      catch (e) {
        res.status(400).json("Error with Deleting");
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

app.get("/userLikedPosts", async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      res.status(404).json("User Not Logged in");
      return;
    }
    else {
      try {
        const userSpecific = await User.findById(info.id);
        const userLikedPosts = userSpecific.liked;
        const result = [];
        for (var i = 0; i < userLikedPosts.length; i++) {
          const likedPosts = await Post.findById(userLikedPosts[i]);
          result.push(likedPosts);
        }
        res.status(201).json({ result });
      }
      catch (e) {
        res.status(400).json("Error with getting the liked posts");
      }
    }
  })
})

app.get("/userLiked", async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      res.status(404).json("User Not Logged in");
      return;
    }
    else {
      try {
        const userSpecific = await User.findById(info.id);
        const userLikedPosts = userSpecific.liked;
        res.status(201).json({ userLikedPosts });
      }
      catch (e) {
        res.status(400).json("Error with not getting Like IDs");
      }
    }
  })
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
        const receivingUser = await User.findById(postSpecific.author);
        const userSpecific = await User.findById(info.id);
        if (userSpecific.liked.includes(postSpecific._id)) { // if user has already liked the post
          userSpecific.liked = userSpecific.liked.filter((postId) => postId.toString() !== postSpecific._id.toString()); // remove the post from liked array
          postSpecific.likes = postSpecific.likes - 1; // decrement the likes
          receivingUser.notifications = receivingUser.notifications.filter((notif) => notif.postID.toString() !== id || notif.sendingUser.toString() !== info.id || notif.action.toString() !== "liked");
          await receivingUser.save(); // update receiving info 
          await userSpecific.save(); // update user info
          await postSpecific.save(); // update post information
          res.status(201).json("User disliked the post");
          return;
        }

        userSpecific.liked.push(id); // add the post to liked array of user's account
        postSpecific.likes = postSpecific.likes + 1; // increment the likes

        receivingUser.notifications.push({
          postID: id,
          sendingUser: info.id,
          action: "liked"
        })

        await receivingUser.save(); // update receiving info 
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



app.get("/likeCount/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const postSpecific = await Post.findById(id);
    res.status(201).json({ likeCount: postSpecific.likes });
  }
  catch (e) {
    res.status(400).json("Error retrieving the like count");
  }
});


app.get("/comment", async (req, res) => {
  try {
    const commentList = await Comment.find();
    res.status(201).json(commentList);
  }
  catch (e) {
    res.status(400).json("Error retrieving comments");
  }
})

app.get("/comment/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const commentSpecific = await Comment.find(id);
    res.status(201).json(commentSpecific);
  }
  catch (e) {
    res.status(400).json("Error retrieving the comment")
  }
})

app.get("/commentsByPost/:id", async (req, res) => {
  const { id } = req.params; // post id
  try {
    const postSpecific = await Post.findById(id);
    const comments = postSpecific.comment;
    const commentsWithDescription = [];
    for (var i = 0; i < comments.length; i++) {
      const commentsSpecific = await Comment.findById(comments[i]);
      commentsWithDescription.push(commentsSpecific);
    }
    res.status(201).json({ commentsWithDescription });
  }
  catch (e) {
    res.status(400).json("Cannot retrieve comments for a post");
  }
})

/*app.post("/comment/:id", async (req, res) => {
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
});*/

app.post("/comment/:id", async (req, res) => {
  const { token } = req.cookies;
  const { id } = req.params;
  const { text } = req.body;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      res.status(404).json("User Not Logged in");
      return;
    }
    else {
      try {
        const postSpecific = await Post.findById(id);
        const receivingUser = await User.findById(postSpecific.author);
        const commentSpecific = await Comment.create({
          text: text,
          commentAuthor: info.id,
          postID: id
        });
        postSpecific.comment.push(commentSpecific._id);

        receivingUser.notifications.push({
          postID: id,
          sendingUser: info.id,
          action: "commented"
        })

        await receivingUser.save(); // update receiving info 
        await postSpecific.save();
        res.status(201).json("Successfully commented")
      }
      catch (e) {
        res.status(400).json("Error with Commenting");
      }
    }
  })
})


app.delete("/comment/:commentId", async (req, res) => {
  const { token } = req.cookies;
  const { commentId } = req.params;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      res.status(404).json("User Not Logged in");
      return;
    }
    const comment = await Comment.findById(commentId);
    const post = await Post.findById(comment.postID);
    const receivingUser = await User.findById(post.author);
    if (info.id === comment.commentAuthor.toString()) {
      post.comment = post.comment.filter((com) => com.toString() !== commentId);
      receivingUser.notifications = receivingUser.notifications.filter((notif) => notif.postID.toString() !== post._id.toString() || notif.sendingUser.toString() !== info.id || notif.action.toString() !== "commented");
      await Comment.findByIdAndDelete(commentId);
      await receivingUser.save();
      await post.save();
      res.status(200).json("Comment deleted");
    } else {
      res.status(400).json("Could not delete comment since this is not your comment");
    }
  });
});

app.get("/allNotif/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const userSpecific = await User.findById(id);
    const notifList = userSpecific.notifications.reverse();
    res.status(201).json({ notifList })
  }
  catch (e) {
    res.status(400).json("Could not retrieve all notifications");
  }
})


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
        const found = userSpecific.following.find((e) => e.toString() == id.toString());
        if (!found) {
          userSpecific.following.push(id);
          await userSpecific.save();
          res.status(201).json(`Added to Following ${id}`)
          return;
        }
        res.status(400).json("Already added following")
      }
      catch (e) {
        res.status(400).json("Error with Adding Following");
      }
    }
  })
})

app.get("/getFollowingRecommendations", async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      res.status(404).json("User Not Logged in");
      return;
    }
    else {
      try {
        const userSpecific = await User.findById(info.id);
        const userFollowing = userSpecific.following;
        let userList = await User.find();
        const userStringIds = [];
        for (var i = 0; i < userFollowing.length; i++) {
          userStringIds.push(userFollowing[i].toString());
        }
        userList = userList.filter((u) => !userStringIds.includes(u._id.toString()) && info.id.toString() !== u._id.toString());
        console.log(userList);
        res.status(201).json({ userList })
      }
      catch (e) {
        res.status(400).json("Error with Getting Following Recommendations");
      }
    }
  })
})


app.get("/getUserPosts", async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      res.status(404).json("User Not Logged in");
      return;
    }
    else {
      try {
        const postLists = await Post.find().sort({ date: -1, timestamp: -1 });
        const userPosts = postLists.filter((post) => post.author.toString() === info.id);
        res.status(201).json({ userPosts });
      }
      catch (e) {
        res.status(400).json("Could not get user's posts");
      }
    }
  })
})

app.get("/getFollowerPosts", async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      res.status(404).json("User Not Logged in");
      return;
    }
    else {
      try {
        const userSpecific = await User.findById(info.id);
        const userFollowers = userSpecific.following;
        const postsJson = await Post
          .find({ author: { $in: userFollowers } })
          .sort({ date: -1, timestamp: -1 })
        res.status(201).json({ postsJson });
      }
      catch (e) {
        res.status(400).json("Error with Getting Follower's Posts");
      }
    }
  })
})

app.post("/addPreferences", async (req, res) => {
  const { token } = req.cookies;
  const { preferTags } = req.body;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      res.status(404).json("User Not Logged in");
      return;
    }
    else {
      try {
        const userSpecific = await User.findById(info.id);
        if (userSpecific.preferences.length > 0) {
          res.status(400).json("Preferences is already set.");
          return;
        }
        userSpecific.preferences = preferTags;
        await userSpecific.save();
        res.status(201).json("Successfully set preferences");
      }
      catch (e) {
        res.status(400).json("Error with Posting Preferences");
      }
    }
  })
})

app.get("/getRecommendedPosts", async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      res.status(404).json("User Not Logged in");
      return;
    }
    else {
      try {
        const userSpecific = await User.findById(info.id);
        const userPreferences = userSpecific.preferences; 
        
        const postList = await Post.find().sort({ date: -1, timestamp: -1 });

        const postRes = []
        for(var i = 0; i < postList.length; i++) {
            const tagList = postList[i].tags;
            for(var j = 0; j < tagList.length; j++) {
                if(userPreferences.includes(tagList[j])) {
                  postRes.push(postList[i]);
                  break;
                }
            }
        }
        res.status(201).json({postRes}); 
      }
      catch (e) {
        res.status(400).json("Error with Getting Recommendations");
      }
    }
  })
})



/* ##### SEARCH ##### */

app.get('/search/posts', async (req, res) => {
  const searchQuery = req.query.q;
  try {
      const results = await Post.find({
          $or: [
              { "text": { $regex: searchQuery, $options: 'i' } },
              { "tags": { $regex: searchQuery, $options: 'i' } }
          ]
      });
      res.status(200).json(results);
  } catch (e) {
      res.status(400).json({ error: "An error occurred while searching for posts" });
  }
});



app.get('/search/users', async (req, res) => {
  const searchQuery = req.query.q;
  try {
      const results = await User.find({
          $or: [
              { "username": { $regex: searchQuery, $options: 'i' } },
              { "name": { $regex: searchQuery, $options: 'i' } }
          ]
      });
      res.status(200).json(results);
  } catch (e) {
      res.status(400).json({ error: "An error occurred while searching for users" });
  }
});



app.get('/getPostsByQuery', async (req, res) => {
  const searchQuery = req.query.q;
  try {
      const results = await Post.find({
          $or: [
              { "text": { $regex: searchQuery, $options: 'i' } },
              { "tags": { $regex: searchQuery, $options: 'i' } }
          ]
      });
      res.status(200).json(results);
  } catch (e) {
      res.status(400).json({ error: "An error occurred while searching for posts" });
  }
});





app.listen(3001, () => {
  console.log("Server is on port 3001..")
})


// pranetallu
// 2LJEQQ8JE7EISp0s