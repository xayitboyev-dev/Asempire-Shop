const { model, Schema } = require('mongoose');

const userSchema = new Schema({
    first_name: {
        type: String,
    },
    last_name: {
        type: String,
    },
    username: {
        type: String,
    },
    uid: {
        type: Number,
        unique: true
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    role: {
        type: String,
        default: 'user'
    },
    idHistory: [
        { type: Number, required: true }
    ],
    transactions: [
        {
            payBy: {
                type: String,
                required: true
            },
            uuid: {
                type: String,
                required: true
            },
            tid: {
                type: String,
                required: true
            },
            count: {
                type: Number,
            },
            price: {
                type: Number,
            },
            productId: {
                type: String
            },
            name: {
                type: String,
                required: true,
            },
            pubgId: {
                type: Number,
            },
        }
    ]
});

module.exports = model('users', userSchema);