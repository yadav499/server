const mongoose = require('mongoose');
// code for handle signup
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isAdmin: { type: Boolean, default: false }
});
const User = mongoose.model('AuthUser', userSchema);

module.exports = User;