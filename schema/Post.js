const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    description: {
        type: String,
    },
    photo: {
        type: String,
    },
    username: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('Post', PostSchema)