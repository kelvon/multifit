const mongoose = require('../db')

let UsersSchema = new mongoose.Schema({
    firstname:   {
        type: String,
        require: true
    },
    lastname:   { 
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
    endereco:   { 
        type: String,
        require: true
    },
    complemento:   { 
        type: String,
        require: true
    },
    referencia:   { 
        type: String,
        require: true
    },
    bairro:   { 
        type: String,
        require: true
    },
    cidade:   { 
        type: String,
        require: true
    },
    uf:   { 
        type: String,
        require: true
    },
});

// Export the model
module.exports = mongoose.model('Users', UsersSchema);