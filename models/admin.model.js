const mongoose = require('../db')

let AdminSchema = new mongoose.Schema({
    fullname:   {
        type: String,
        require: true
    },
    user:   { 
        type: String,
        require: true
    },
    telefone:   {
        type: String,
        require: true
    },
    email:   { 
        type: String,
        require: true
    },
    pass: {
        type: String,
        require: true
    },
    type: {
        type: String,
        require: true
    }
});

// Export the model
module.exports = mongoose.model('Admin', AdminSchema);