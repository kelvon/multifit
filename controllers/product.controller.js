const express   = require('express');
const mongoose  = require('mongoose');
const Product   = require('../models/product.model');
const Category  = require('../models/category.model');
const route     = express.Router();

var productPesq;
var categoryInfo;

route.get('/count', (req, res) => {
    try{
        Product.find().count(function(err, count){
            console.log(count);
            return res.send({ count: count });
        })
    }catch(err){
        return res.send({ error: 'Erro ao retornar total do registro!' });
    }
});

route.get('/getAllCategory', function(req, res) {   
    Category.find().then(result => {
        console.log(result);
        return res.send({category: result});
    });
});

route.get('/', function(req, res) {
    var c = [];

    sess = req.session;
    if(sess.admin == null || sess.admin == ""){
        res.redirect("./");
    }

    Product.find().limit(12).then(result => {
        console.log(result);
        this.product = result;

        if(this.product == null){
            c = [];
            this.product = [];
        }else{
            c = this.product;
            this.product = [];
        }
    
        console.log(req.session.admin);
        res.render('page/product', {
            admin: req.session.admin,
            products: c
        });
    });
});

route.post('/', function(req, res) {   
    var c = [];

    sess = req.session;
    if(sess.admin == null || sess.admin == ""){
        res.redirect("./");
    }

    Product.find({name: new RegExp(req.body.pesquisa, "i")}).then(result => {
        console.log(result);
        this.productPesq = result;

        if(this.productPesq == null){
            c = [];
            this.productPesq = [];
        }else{
            c = this.productPesq;
            this.productPesq = [];
        }
    
        res.render('page/product', {
            admin: req.session.admin,
            products: c
        });
    });
});

route.get('/register-product', function(req, res) {   
    try{
        sess = req.session;
        if(sess.admin == null || sess.admin == ""){
            res.redirect("./");
        }

        var passedVariable = "";
        if(sess.error != null){
            passedVariable = sess.error;
        }

        res.render('page/register-product', {
            admin: req.session.admin,
            error: passedVariable
        });
    }catch(err){
        return res.send({ error: 'Erro ao retornar info do administrador!' });
    }
});

route.post('/auth2/register', (req, res) => {
    try{

        var product = new Product({
            categoryId:   mongoose.Types.ObjectId(req.body.categoryID),
            name:         req.body.name,
            description:  req.body.description,
            price:        req.body.price,
            priceDescont: req.body.priceDescont
        });

        product.save(function (err) {
            if (err) {
                return "Erro ao cadastrar!";
            }
        });
        
        Product.create(product);
        res.redirect("../../../products")

    }catch(err){
        return "Erro ao cadastrar!";
    }
});

route.get('/edit-product/:productId', function(req, res) {   
    try{
        sess = req.session;
        if(sess.admin == null || sess.admin == ""){
            res.redirect("./");
        }

        var passedVariable = "";
        if(sess.error != null){
            passedVariable = sess.error;
        }

        Product.findById(req.params.productId).then(result => {
            console.log(result);
            this.product = result;

            Category.findById(result.categoryId).then(result2 => {
                console.log(result2);
                this.categoryInfo = result2;

                if(this.categoryInfo != null){
                    console.log(req.session.admin);
                    res.render('page/edit-product', {
                        admin: req.session.admin,
                        product: this.product,
                        category: this.categoryInfo,
                        error: passedVariable
                    });
                }else{

                    this.categoryInfo = [{name: 'Nenhuma categoria referenciada!'}];

                    console.log(req.session.admin);
                    res.render('page/edit-product', {
                        admin: req.session.admin,
                        product: this.product,
                        category: this.categoryInfo,
                        error: passedVariable
                    });
                }
            });
        });
    }catch(err){
        return res.send({ error: 'Erro ao retornar info do administrador!' });
    }
});

route.post('/edit/:productId', (req, res) => {
    try{
        sess = req.session;
        if(sess.admin == null || sess.admin == ""){
            res.redirect("./");
        }

        Product.findByIdAndUpdate(req.params.productId, {
            name:         req.body.name,
            description:  req.body.description,
            price:        req.body.price,
            priceDescont: req.body.priceDescont
        }, {new: true})
        .then(result => {
            
            console.log(result);
            res.redirect("../../../products");

        }, (err) => {
            console.log(err);

            sess.error = err;
            res.redirect("../../../products/edit-product/"+req.params.productId);
        });
        
    }catch(err){
        return res.send( err );
    }
});

route.post('/edit-product/alter-category/:productId', (req, res) => {
    try{
        sess = req.session;
        if(sess.admin == null || sess.admin == ""){
            res.redirect("./");
        }

        Product.findByIdAndUpdate(req.params.productId, {
            categoryId:   mongoose.Types.ObjectId(req.body.categoryID),
        }, {new: true})
        .then(result => {
            
            console.log(result);
            res.redirect("../../../products");

        }, (err) => {
            console.log(err);

            sess.error = err;
            res.redirect("../../../products/edit-product/"+req.params.productId);
        });
        
    }catch(err){
        return res.send( err );
    }
});

route.get('/delete/:productId', (req, res) => {
    try{
        sess = req.session;
        if(sess.admin == null || sess.admin == ""){
            res.redirect("./");
        }

        Product.findByIdAndRemove(req.params.productId)
        .then(result => {
            res.redirect("../../../products")
        }, (err) => {
            sess.error = err;
            res.redirect("../../../edit-product/"+req.params.productId);
        });
        
    }catch(err){
        return res.send( err );
    }
});

module.exports = app => app.use('/products', route);