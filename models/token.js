const mongoose = require('mongoose');


const { Schema } = mongoose;

const tokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date.now()
    },
    expiresAt: {
        type: Date,
        default: Date.now + 1000 * 60
    }
})

module.exports = mongoose.model('Token', tokenSchema)