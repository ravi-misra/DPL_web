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

module.exports = mongoose.model('Authority', AuthoritySchema);