const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {type : String, unique : true},
    salt: String,
    hash: String,
    name: String,
    email: String,
    profilePic: String,
    bio: String,
    wishlist : [String],
    visited :  [String],
    // lists is an object, where the keys are the list names and the values are arrays of listing ids
    lists : Object
});

const User = mongoose.model('User', userSchema);

module.exports = User;