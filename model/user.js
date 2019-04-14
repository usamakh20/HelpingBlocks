const mongoose = require('mongoose');
const bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR=10;

const userSchema = new mongoose.Schema({
    email: {type: String, required:true, unique: true},
    password: {type: String, required:true},
    firstName: String,
    lastName: String,
    donations:[String]
});

userSchema.pre('save',function(next){
    const user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        callback(null, isMatch);
    });
};

const user = mongoose.model('user', userSchema);

module.exports = user;