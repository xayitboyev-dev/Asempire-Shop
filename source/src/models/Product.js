const { model, Schema } = require('mongoose');

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
    },
    image_link: {
        type: String,
        required: true
    },
    details: [
        {
            key: {
                type: String,
                required: true
            },
            value: {
                type: String,
                required: true
            },
        }
    ]
});

module.exports = model('products', productSchema);