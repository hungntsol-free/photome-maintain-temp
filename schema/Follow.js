const mongoose = require("mongoose")
const Schema = mongoose.Schema

const FollowSchema = new Schema({
    id_User: {
        type: String,
        required: true,
    },
    id_follow:{
        type:[String],
        required: true,
    },
    id_following:{
        type:[String],
        required: true,
    },
    registration_data: {
        type: Date,
        default: Date.now,
    }
})

module.exports = comment = mongoose.model("follow", FollowSchema)