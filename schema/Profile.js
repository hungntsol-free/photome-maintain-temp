const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ProfileSchema = new Schema({
    id_User: {
        type: String,
        required: true,
    },
    birthday: {
        type: String,
        required: false,
    },
    avatar: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    sex: {
        type: String,
        required: false,
    },
    intro: {
        type: String,
        required: false,
    },
    job: {
        type: String,
        required: false,
    },
    iconjob: {
        type: String,
        required: false,
    },
    post: {
        type: Number,
        default: 0,
    },
    follow: {
        type: Number,
        default: 0,
    },
    following: {
        type: Number,
        default: 0,
    },
    registration_data: {
        type: Date,
        default: Date.now,
    }
})

module.exports = Profile = mongoose.model("profile", ProfileSchema)