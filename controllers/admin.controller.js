const express = require('express');
const Admin   = require('../models/admin.model');

const route   = express.Router();

route.get('/', function(req, res) {
    var c = [];

    sess = req.session;
    if(sess.admin == null || sess.admin == ""){
        res.redirect("./");
    }

    Admin.find().limit(12).then(result => {
        console.log(result);
        this.admin = result;

        if(this.admin == null){
            c = [];
            this.admin = [];
        }else{
            c = this.admin;
            this.admin = [];
        }
    
        console.log(req.session.admin);
        res.render('page/admin', {
            admin: req.session.admin,
            admins: c
        });
    });
});

route.post('/', function(req, res) {   
    var c = [];

    sess = req.session;
    if(sess.admin == null || sess.admin == ""){
        res.redirect("./");
    }

    Admin.find({fullname: new RegExp(req.body.pesquisa, "i")}).then(result => {
        console.log(result);
        this.adminsPesq = result;

        if(this.adminsPesq == null){
            c = [];
            this.adminsPesq = [];
        }else{
            c = this.adminsPesq;
            this.adminsPesq = [];
        }
    
        res.render('page/clients', {
            admin: req.session.admin,
            admins: c
        });
    });
});

route.get('/register-admin', function(req, res) {   
    try{
        sess = req.session;
        if(sess.admin == null || sess.admin == ""){
            res.redirect("./");
        }

        var passedVariable = "";
        if(sess.error != null){
            passedVariable = sess.error;
        }

        res.render('page/register-admin', {
            admin: req.session.admin,
            error: passedVariable
        });
    }catch(err){
        return res.send({ error: 'Erro ao retornar info do administrador!' });
    }
});

route.get('/edit-admin/:adminId', function(req, res) {   
    try{
        sess = req.session;
        if(sess.admin == null || sess.admin == ""){
            res.redirect("./");
        }

        var passedVariable = "";
        if(sess.error != null){
            passedVariable = sess.error;
        }

        Admin.findById(req.params.adminId).then(result => {
            console.log(result);
            this.admin = result;

            console.log(req.session.admin);

            res.render('page/edit-admin', {
                admin: req.session.admin,
                admins: this.admin,
                error: passedVariable
            });
        });
    }catch(err){
        return res.send({ error: 'Erro ao retornar info do administrador!' });
    }
});

route.post('/auth2/register', (req, res) => {
    try{

        var admin = new Admin({
            fullname:   req.body.fullname,
            user:       req.body.user,
            telefone:   req.body.telefone,
            email:      req.body.email,
            pass:       req.body.pass,
            type:       req.body.type
        });

        admin.save(function (err) {
            if (err) {
                return "Erro ao cadastrar!";
            }
        });
        
        Admin.create(admin);
        res.redirect("../../../admin")

    }catch(err){
        return res.send( err );
    }
});

route.post('/edit/:adminId', (req, res) => {
    try{
        
        Admin.findByIdAndUpdate(req.params.adminId, {
            fullname:   req.body.fullname,
            user:       req.body.user,
            telefone:   req.body.telefone,
            email:      req.body.email,
            pass:       req.body.pass
        }, {new: true})
        .then(result => {
            console.log(result);
            res.redirect("../../../admin");
        }, (err) => {
            console.log(err);

            sess.error = err;
            res.redirect("../../../admin/edit-admin/"+req.params.adminId);
        });
        
    }catch(err){
        return res.send( err );
    }
});

route.get('/delete/:adminId', (req, res) => {
    try{
        sess = req.session;
        if(sess.admin == null || sess.admin == ""){
            res.redirect("./");
        }

        Admin.findByIdAndRemove(req.params.adminId)
        .then(result => {
            res.redirect("../../../admin")
        }, (err) => {
            sess.error = err;
            res.redirect("../../../admin");
        });
        
    }catch(err){
        return res.send( err );
    }
});

module.exports = app => app.use('/admin', route);