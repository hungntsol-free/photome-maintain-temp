const mongoose = require("mongoose")
const Schema = mongoose.Schema

const NewfeedSchema = new Schema({
    id_User: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: false,
    },
    image: {
        type: String,
        required: true,
    },
    like: {
        type: Number,
        default: 0,
    },
    comment: {
        type: Number,
        default: 0,
    },
    id_impact: {
        type: String,
        required: false,
    },
    allIdReact: [String],
    registration_data: {
        type: Date,
        default: Date.now,
    }
})

module.exports = Newfeed = mongoose.model("newfeed", NewfeedSchema)