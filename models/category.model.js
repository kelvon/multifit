const mongoose = require('../db')

let CategorySchema = new mongoose.Schema({
    name:   {
        type: String,
        require: true
    },
    description:   { 
        type: String,
        require: true
    }
});

// Export the model
module.exports = mongoose.model('Category', CategorySchema);