const mongoose = require("mongoose");
const {model, Schema} = mongoose;

const GroupSchema = new Schema({
    name: {type: String}, 
    members: [{type: Schema.Types.ObjectId, ref: 'User'}], 
    messages: [{
        content: {type: String},
        author: {type: Schema.Types.ObjectId, ref: 'User'}
    }]
});

const GroupModel = new model('Group', GroupSchema);

module.exports = GroupModel;