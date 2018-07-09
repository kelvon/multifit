const express   = require('express');
const FormasPag   = require('../models/formaspag.model');
const route     = express.Router();

var formaspagPesq;
route.get('/count', (req, res) => {
    try{
        FormasPag.find().count(function(err, count){
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

    FormasPag.find().limit(12).then(result => {
        console.log(result);
        this.formaspag = result;

        if(this.formaspag == null){
            c = [];
            this.formaspag = [];
        }else{
            c = this.formaspag;
            this.formaspag = [];
        }
    
        console.log(req.session.admin);
        res.render('page/formas-pag', {
            admin: req.session.admin,
            formaspag: c
        });
    });
});

route.post('/', function(req, res) {   
    var c = [];

    sess = req.session;
    if(sess.admin == null || sess.admin == ""){
        res.redirect("./");
    }

    FormasPag.find({name: new RegExp(req.body.pesquisa, "i")}).then(result => {
        console.log(result);
        this.formaspagPesq = result;

        if(this.formaspagPesq == null){
            c = [];
            this.formaspagPesq = [];
        }else{
            c = this.formaspagPesq;
            this.formaspagPesq = [];
        }
    
        res.render('page/formas-pag', {
            admin: req.session.admin,
            formaspag: c
        });
    });
});

route.get('/register-formas-pag', function(req, res) {   
    try{
        sess = req.session;
        if(sess.admin == null || sess.admin == ""){
            res.redirect("./");
        }

        var passedVariable = "";
        if(sess.error != null){
            passedVariable = sess.error;
        }

        res.render('page/register-formas-pag', {
            admin: req.session.admin,
            error: passedVariable
        });
    }catch(err){
        return res.send({ error: 'Erro ao retornar info do administrador!' });
    }
});

route.post('/auth2/register', (req, res) => {
    try{

        var formaspag = new FormasPag({
            name:         req.body.name
        });

        formaspag.save(function (err) {
            if (err) {
                return "Erro ao cadastrar!";
            }
        });
        
        FormasPag.create(formaspag);
        res.redirect("../../../formas-pag")

    }catch(err){
        return "Erro ao cadastrar!";
    }
});

route.get('/edit-formas-pag/:formaspagId', function(req, res) {   
    try{
        sess = req.session;
        if(sess.admin == null || sess.admin == ""){
            res.redirect("./");
        }

        var passedVariable = "";
        if(sess.error != null){
            passedVariable = sess.error;
        }

        FormasPag.findById(req.params.formaspagId).then(result => {
            console.log(result);
            this.formaspag = result;

            console.log(req.session.admin);

            res.render('page/edit-formas-pag', {
                admin: req.session.admin,
                formaspag: this.formaspag,
                error: passedVariable
            });
        });
    }catch(err){
        return res.send({ error: 'Erro ao retornar info do administrador!' });
    }
});

route.post('/edit/:formaspagId', (req, res) => {
    try{
        sess = req.session;
        if(sess.admin == null || sess.admin == ""){
            res.redirect("./");
        }

        FormasPag.findByIdAndUpdate(req.params.formaspagId, {
            name:         req.body.name
        }, {new: true})
        .then(result => {
            
            console.log(result);
            res.redirect("../../../formas-pag");

        }, (err) => {
            console.log(err);

            sess.error = err;
            res.redirect("../../../formas-pag/edit-formas-pag/"+req.params.categoryId);
        });
        
    }catch(err){
        return res.send( err );
    }
});

route.get('/delete/:formaspagId', (req, res) => {
    try{
        sess = req.session;
        if(sess.admin == null || sess.admin == ""){
            res.redirect("./");
        }

        FormasPag.findByIdAndRemove(req.params.formaspagId)
        .then(result => {
            res.redirect("../../../formas-pag")
        }, (err) => {
            sess.error = err;
            res.redirect("../../../formas-pag");
        });
        
    }catch(err){
        return res.send( err );
    }
});

module.exports = app => app.use('/formas-pag', route);