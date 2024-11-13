const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    active: { type: Boolean, default: true },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true }
});

module.exports = mongoose.model('User', userSchema);
