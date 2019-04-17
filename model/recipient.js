const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    CNIC: {type: String, required:true, unique: true,minlength:13,maxlength:13},
    name: String,
    phone:String
});

module.exports = mongoose.model('recipient', userSchema);