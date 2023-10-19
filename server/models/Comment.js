const mongoose = require("mongoose");
const {model, Schema} = mongoose;

const CommentSchema = new Schema({
    text: {type: String, required: true},
    commentAuthor: {type: Schema.Types.ObjectId, ref: 'User', required: true}, // author of the comment
    postID: {type: Schema.Types.ObjectId, ref: 'Post', required: true},
    //taggedUsers: [{type: Schema.Types.ObjectId, ref: 'User'}] // array of user ID's that are tagged in a comment, for notifications later
});

const CommentModel = new model('Comment', CommentSchema);

module.exports = CommentModel;