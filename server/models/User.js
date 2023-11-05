const mongoose = require("mongoose");
const {model, Schema} = mongoose;

const UserSchema = new Schema({
    name: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true, unique: true},
    following: [{type: Schema.Types.ObjectId, ref: 'User'}],
    liked: [{type: Schema.Types.ObjectId, ref: 'Post'}],
    preferences: [{type: String}], 
    notifications: [{
        postID: {type: Schema.Types.ObjectId, ref: 'Post'},    // id of the post commented / liked  
        sendingUser: {type: Schema.Types.ObjectId, ref: 'User'}, // id of the user who commented / liked (info.id)
        action: {type: String} // action type stored as string, either "liked" or "commented"
    }],
    groups: [{type: Schema.Types.ObjectId, ref: 'Group'}]

})

const UserModel = model('User', UserSchema);
module.exports = UserModel;