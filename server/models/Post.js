const mongoose = require("mongoose");
const {model, Schema} = mongoose;

const PostSchema = new Schema({
    text: {type: String, required: true}, 
    author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    likes: {type: Number, default: 0},
    tags: [{type: String}],
    comment: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
});

const PostModel = new model('Post', PostSchema);

module.exports = PostModel;