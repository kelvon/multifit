const express = require('express');
const Users   = require('../models/users.model');
const route   = express.Router();

var clientsPesq;

route.get('/count', (req, res) => {
    try{
        Users.find().count(function(err, count){
            console.log(count);
            return res.send({ count: count });
        })
    }catch(err){
        return res.send({ error: 'Erro ao retornar total do registro!' });
    }
});

route.get('/', function(req, res) {
    var c = [];

    sess = req.session;
    if(sess.admin == null || sess.admin == ""){
        res.redirect("./");
    }

    Users.find().limit(12).then(result => {
        console.log(result);
        this.clients = result;

        if(this.clients == null){
            c = [];
            this.clients = [];
        }else{
            c = this.clients;
            this.clients = [];
        }
    
        console.log(req.session.admin);
        res.render('page/clients', {
            admin: req.session.admin,
            users: c
        });
    });
});

route.post('/', function(req, res) {   
    var c = [];

    sess = req.session;
    if(sess.admin == null || sess.admin == ""){
        res.redirect("./");
    }

    Users.find({firstname: new RegExp(req.body.pesquisa, "i")}).then(result => {
        console.log(result);
        this.clientsPesq = result;

        if(this.clientsPesq == null){
            c = [];
            this.clientsPesq = [];
        }else{
            c = this.clientsPesq;
            this.clientsPesq = [];
        }
    
        res.render('page/clients', {
            admin: req.session.admin,
            users: c
        });
    });
});

route.get('/register-client', function(req, res) {   
    try{
        sess = req.session;
        if(sess.admin == null || sess.admin == ""){
            res.redirect("./");
        }

        var passedVariable = "";
        if(sess.error != null){
            passedVariable = sess.error;
        }

        res.render('page/register-client', {
            admin: req.session.admin,
            error: passedVariable
        });
    }catch(err){
        return res.send({ error: 'Erro ao retornar info do administrador!' });
    }
});

route.post('/auth2/register', (req, res) => {
    try{

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
        });

        users.save(function (err) {
            if (err) {
                return "Erro ao cadastrar!";
            }
        });
        
        Users.create(users);
        res.redirect("../../../clients")

    }catch(err){
        return "Erro ao cadastrar!";
    }
});

route.post('/authphone2/register', (req, res) => {
    try{

        console.log(req.body);
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
        });

        users.save(function (err) {
            if (err) {
                return "Erro ao cadastrar!";
            }
        });
        
        Users.create(users);  
        console.log(users);

        req.app.io.emit('registerNewUser', users);
        return "Cadastrado com sucesso!";

    }catch(err){
        return err;
    }
});

route.get('/edit-client/:clientId', function(req, res) {   
    try{
        sess = req.session;
        if(sess.admin == null || sess.admin == ""){
            res.redirect("./");
        }

        var passedVariable = "";
        if(sess.error != null){
            passedVariable = sess.error;
        }

        Users.findById(req.params.clientId).then(result => {
            console.log(result);
            this.clients = result;

            console.log(req.session.admin);

            res.render('page/edit-client', {
                admin: req.session.admin,
                user: this.clients,
                error: passedVariable
            });
        });
    }catch(err){
        return res.send({ error: 'Erro ao retornar info do administrador!' });
    }
});

route.post('/edit/:userId', (req, res) => {
    try{
        sess = req.session;
        if(sess.admin == null || sess.admin == ""){
            res.redirect("./");
        }

        Users.findByIdAndUpdate(req.params.userId, {
            firstname  :   req.body.firstname,
            lastname   :   req.body.lastname,
            telefone   :   req.body.telefone,
            email      :   req.body.email,
            endereco   :   req.body.endereco,
            complemento:   req.body.complemento,
            referencia :   req.body.referencia,
            bairro     :   req.body.bairro,
            cidade     :   req.body.cidade
        }, {new: true})
        .then(result => {
            
            console.log(result);
            res.redirect("../../../clients");

        }, (err) => {
            console.log(err);

            sess.error = err;
            res.redirect("../../../clients/edit-client/"+req.params.userId);
        });
        
    }catch(err){
        return res.send( err );
    }
});

route.get('/delete/:userId', (req, res) => {
    try{
        sess = req.session;
        if(sess.admin == null || sess.admin == ""){
            res.redirect("./");
        }

        Users.findByIdAndRemove(req.params.userId)
        .then(result => {
            res.redirect("../../../clients")
        }, (err) => {
            sess.error = err;
            res.redirect("../../../edit-client/"+req.params.userId);
        });
        
    }catch(err){
        return res.send( err );
    }
});

module.exports = app => app.use('/clients', route);