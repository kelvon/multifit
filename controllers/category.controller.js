const express   = require('express');
const Category   = require('../models/category.model');
const route     = express.Router();

var categoryPesq;
route.get('/count', (req, res) => {
    try{
        Category.find().count(function(err, count){
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

    Category.find().limit(12).then(result => {
        console.log(result);
        this.category = result;

        if(this.category == null){
            c = [];
            this.category = [];
        }else{
            c = this.category;
            this.category = [];
        }
    
        console.log(req.session.admin);
        res.render('page/categories', {
            admin: req.session.admin,
            categories: c
        });
    });
});

route.post('/', function(req, res) {   
    var c = [];

    sess = req.session;
    if(sess.admin == null || sess.admin == ""){
        res.redirect("./");
    }

    Category.find({name: new RegExp(req.body.pesquisa, "i")}).then(result => {
        console.log(result);
        this.categoryPesq = result;

        if(this.categoryPesq == null){
            c = [];
            this.categoryPesq = [];
        }else{
            c = this.categoryPesq;
            this.categoryPesq = [];
        }
    
        res.render('page/categories', {
            admin: req.session.admin,
            categories: c
        });
    });
});

route.get('/register-category', function(req, res) {   
    try{
        sess = req.session;
        if(sess.admin == null || sess.admin == ""){
            res.redirect("./");
        }

        var passedVariable = "";
        if(sess.error != null){
            passedVariable = sess.error;
        }

        res.render('page/register-category', {
            admin: req.session.admin,
            error: passedVariable
        });
    }catch(err){
        return res.send({ error: 'Erro ao retornar info do administrador!' });
    }
});

route.post('/auth2/register', (req, res) => {
    try{

        var category = new Category({
            name:         req.body.name,
            description:  req.body.description
        });

        category.save(function (err) {
            if (err) {
                return "Erro ao cadastrar!";
            }
        });
        
        Category.create(category);
        res.redirect("../../../categories")

    }catch(err){
        return "Erro ao cadastrar!";
    }
});

route.get('/edit-category/:categoryId', function(req, res) {   
    try{
        sess = req.session;
        if(sess.admin == null || sess.admin == ""){
            res.redirect("./");
        }

        var passedVariable = "";
        if(sess.error != null){
            passedVariable = sess.error;
        }

        Category.findById(req.params.categoryId).then(result => {
            console.log(result);
            this.category = result;

            console.log(req.session.admin);

            res.render('page/edit-category', {
                admin: req.session.admin,
                category: this.category,
                error: passedVariable
            });
        });
    }catch(err){
        return res.send({ error: 'Erro ao retornar info do administrador!' });
    }
});

route.post('/edit/:categoryId', (req, res) => {
    try{
        sess = req.session;
        if(sess.admin == null || sess.admin == ""){
            res.redirect("./");
        }

        Category.findByIdAndUpdate(req.params.categoryId, {
            name:         req.body.name,
            description:  req.body.description
        }, {new: true})
        .then(result => {
            
            console.log(result);
            res.redirect("../../../categories");

        }, (err) => {
            console.log(err);

            sess.error = err;
            res.redirect("../../../categories/edit-category/"+req.params.categoryId);
        });
        
    }catch(err){
        return res.send( err );
    }
});

route.get('/delete/:categoryId', (req, res) => {
    try{
        sess = req.session;
        if(sess.admin == null || sess.admin == ""){
            res.redirect("./");
        }

        Category.findByIdAndRemove(req.params.categoryId)
        .then(result => {
            res.redirect("../../../categories")
        }, (err) => {
            sess.error = err;
            res.redirect("../../../edit-category/"+req.params.categoryId);
        });
        
    }catch(err){
        return res.send( err );
    }
});

module.exports = app => app.use('/categories', route);