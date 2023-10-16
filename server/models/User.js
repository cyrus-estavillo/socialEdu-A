const mongoose = require("mongoose");
const {model, Schema} = mongoose;

const UserSchema = new Schema({
    name: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true, unique: true},
    following: [{type: Schema.Types.ObjectId, ref: 'User'}],
    liked: [{type: Schema.Types.ObjectId, ref: 'Post'}]
})

const UserModel = model('User', UserSchema);
module.exports = UserModel;