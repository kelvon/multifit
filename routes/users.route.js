const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const user_controller = require('../controllers/users.controller');

// a simple test url to check that all of our files are communicating correctly.
router.get('/', (req, res) => {
    /*
    var db = require('../db');
    var Users = db.Mongoose.model('users', db.UsersSchema, 'users');
    Users.find({}).lean().exec(function(e, docs){
       res.json(docs);
       res.end();
    });
    */
   res.status(500).json({ success: 'Conseguiu' });
})

router.post('/', async(req, res) => {
    res.send({user: req.body.firstname});
    /*
    var db = require('../db');
    
    var Users = db.Mongoose.model('users', db.UsersSchema, 'users');
    var users = new Users({
        firstname:   req.body.firstname,
        lastname:    req.body.lastname,
        telefone:    req.body.telefone,
        email:       req.body.email,
        endereco:    req.body.endereco,
        complemento: req.body.complemento,
        referencia:  req.body.referencia,
        bairro:      req.body.bairro,
        cidade:      req.body.cidade,
        uf:          req.body.uf,
        active:      'N'
    });

    users.save(function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            res.end();
            return;
        }

        res.json(users);
        res.end();
    });
    */
})

module.exports = router;