const mongoose = require('mongoose')
const Schema = mongoose.Schema

const likeSchema = new Schema({
    videoId: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true })

// Ensure a user can only like a video once
likeSchema.index({ videoId: 1, userId: 1 }, { unique: true })

const Like = mongoose.model('Like', likeSchema)
module.exports = { Like }
