const mongoose = require("mongoose");
const {model, Schema} = mongoose;

const CommentSchema = new Schema({
    text: {type: String, required: true},
    commentPerson: {type: Schema.Types.ObjectId, ref: 'User', required: true},
}); 

const CommentModel = new model('Comment', CommentSchema);

module.exports = CommentModel;