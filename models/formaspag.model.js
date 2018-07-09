const mongoose = require('../db')

let FormasPagSchema = new mongoose.Schema({
    name:   {
        type: String,
        require: true
    }
});

// Export the model
module.exports = mongoose.model('FormasPag', FormasPagSchema);