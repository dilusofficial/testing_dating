const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: String,
    location: String,
    day: Number,
    month: Number,
    year: Number,
    gender: String,
    interests: [String],
    images: [{
        data: Buffer, 
        contentType: String, 
        filename: String 
    }]
});

const User = mongoose.model('user_description1', userSchema);

module.exports = User;