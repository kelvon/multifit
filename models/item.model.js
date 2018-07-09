const mongoose = require('../db')
const ObjectId = mongoose.Schema.Types.ObjectId;

let ItemSchema = new mongoose.Schema({
    orderId: {
        type: ObjectId,
        ref: 'Order'
    },
    productId:   {
        type: ObjectId,
        ref: 'Product'
    },
    qtde:   { 
        type: String,
        require: true
    },
    descont:   {
        type: String,
        require: true
    },
    price:   { 
        type: String,
        require: true
    },
    situation:   { 
        type: String,
        require: false
    }
});

// Export the model
module.exports = mongoose.model('Item', ItemSchema);