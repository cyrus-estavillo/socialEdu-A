const mongoose = require("mongoose");
const {model, Schema} = mongoose;

const PostSchema = new Schema({
    text: {type: String, required: true}, 
    author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    likes: {type: Number, default: 0},
    tags: [{type: String}],
    comment: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}], // Array of comments associated with the post
    date: {type: Date, default: Date.now},  // Stores the current date and time
    timestamp: {type: Number, default: Date.now()}  // Stores the current time in milliseconds

});

const PostModel = new model('Post', PostSchema);

module.exports = PostModel;