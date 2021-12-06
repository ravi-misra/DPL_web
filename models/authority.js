const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const AuthoritySchema = new Schema({
    level: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    role: String,
    authority: String

});

AuthoritySchema.index({ level: 1, category: 1}, { unique: true });

module.exports = mongoose.model('Authority', AuthoritySchema);