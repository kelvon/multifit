const mongoose = require('../db')
const ObjectId = mongoose.Schema.Types.ObjectId;

let OrderSchema = new mongoose.Schema({
    clienteId: {
        type: ObjectId,
        ref: 'Users'
    },
    userId:   {
        type: ObjectId,
        ref: 'Admin'
    },
    formaspagId:   {
        type: ObjectId,
        ref: 'FormasPag'
    },
    date:   { 
        type: String,
        require: true
    },
    hour:   {
        type: String,
        require: true
    },
    timing: {
        type: String,
        require: false
    },
    priceTotal:   { 
        type: String,
        require: true
    },
    situation:   { 
        type: String,
        require: false
    },
    status:   { 
        type: String,
        require: false
    }
});

// Export the model
module.exports = mongoose.model('Orders', OrderSchema);