const mongoose = require("mongoose");
const {model, Schema} = mongoose;

const PostSchema = new Schema({
    text: {type: String, required: true}, 
    author: {type: Schema.Types.ObjectId, ref: 'User', required: true}
});

const PostModel = new model('Post', PostSchema);

module.exports = PostModel;