const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema({
    videoId: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    username: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    }
}, { timestamps: true })

const Comment = mongoose.model('Comment', commentSchema)
module.exports = { Comment }
