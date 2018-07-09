const mongoose = require('../db')
const ObjectId = mongoose.Schema.Types.ObjectId;

let ProductSchema = new mongoose.Schema({
    categoryId: {
        type: ObjectId,
        ref: 'Category'
    },
    name:   {
        type: String,
        require: true
    },
    description:   { 
        type: String,
        require: true
    },
    price:   {
        type: String,
        require: true
    },
    priceDescont:   { 
        type: String,
        require: true
    },
    img:   { 
        type: String,
        require: false
    }
});

// Export the model
module.exports = mongoose.model('Product', ProductSchema);