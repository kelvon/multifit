const express   = require('express');
const mongoose  = require('mongoose');
const Item      = require('../models/item.model');
const Orders    = require('../models/order.model');
const Category  = require('../models/category.model');
const Product   = require('../models/product.model');
const route     = express.Router();

var namePesq;
var categoryInfo;

route.get('/count', (req, res) => {
    try{
        Item.find().count(function(err, count){
            console.log(count);
            return res.send({ count: count });
        })
    }catch(err){
        return res.send({ error: 'Erro ao retornar total do registro!' });
    }
});

route.get('/getAllCategories', function(req, res) {   
    Category.find().then(result => {
        console.log(result);
        return res.send({category: result});
    });
});

route.get('/getAllProducts/:categoryId', function(req, res) {   
    Product.find({categoryId: mongoose.Types.ObjectId(req.params.categoryId)}).then(result => {
        console.log(result);
        return res.send({product: result});
    });
});

route.get('/getProduct/:productId', function(req, res) {   
    Product.findOne({ _id: mongoose.Types.ObjectId(req.params.productId)}).then(result => {
        console.log(result);
        return res.send({product: result});
    });
});

/*
route.get('/', function(req, res) {
    var c = [];
    var u = [];

    sess = req.session;
    if(sess.admin == null || sess.admin == ""){
        res.redirect("./");
    }

    Orders.find().limit(12).then(result => {
        console.log("result: "+result);
        this.order = result;

        if(this.order != null){
            c = this.order;
            Users.find().then(result2 => {

                console.log("result2: "+result2);
                console.log(req.session.admin);

                res.render('page/order', {
                    admin: req.session.admin,
                    orders: JSON.parse(JSON.stringify(c)),
                    users:  JSON.parse(JSON.stringify(result2))
                });
            });
        }
    });
});

route.post('/', function(req, res) {   
    var c = [];

    sess = req.session;
    if(sess.admin == null || sess.admin == ""){
        res.redirect("./");
    }

    Orders.find({name: new RegExp(req.body.pesquisa, "i")}).then(result => {
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
*/

route.post('/auth2/register/:orderId', (req, res) => {
    try{

        var itemOrder = new Item({
            orderId:    mongoose.Types.ObjectId(req.params.orderId),
            productId:  mongoose.Types.ObjectId(req.body.productID),
            qtde:       req.body.item_value,
            descont:    req.body.descont,
            price:      req.body.price_unit.replace(".", ","),
            situation:  'A',
        });

        itemOrder.save(function (err) {
            if (err) {
                return "Erro ao cadastrar!";
            }
        });
        
        Item.create(itemOrder).then(result => {
            Orders.findById(req.params.orderId).then(result2 => {
                console.log(result2);
                this.order = result2;
                this.order.priceTotal = (parseFloat(this.order.priceTotal.replace(",", "."))
                    + (parseInt(result.qtde) * (parseFloat(result.price.replace(",", ".")) - 
                    (parseFloat(result.price.replace(',', '.'))*parseInt(result.descont)/100)))).toFixed(2).toString().replace(".", ",");
    
                Orders.update({_id: req.params.orderId}, this.order, 
                function(err, response){
                    if(err){
                        sess.error = err;
                    }

                    res.redirect("../../../order")
                });
            });
        });

    }catch(err){
        return "Erro ao cadastrar!";
    }
});

route.get('/cancel/:itemId', (req, res) => {
    try{
        sess = req.session;
        if(sess.admin == null || sess.admin == ""){
            res.redirect("./");
        }

        Item.findById(req.params.itemId)
        .then(result => {

            console.log(result);
            Orders.findById(result.orderId).then(result2 => {
                console.log(result2);
                
                this.order = result2;
                this.order.priceTotal = (parseFloat(this.order.priceTotal.replace(",", "."))
                    - (parseInt(result.qtde) * (parseFloat(result.price.replace(",", ".")) - 
                    (parseFloat(result.price.replace(',', '.'))*parseInt(result.descont)/100)))).toFixed(2).toString().replace(".", ",");
    
                Orders.update({_id: result.orderId}, this.order, 
                function(err, response){
                    if(err){
                        sess.error = err;
                    }

                    Item.update({ _id: mongoose.Types.ObjectId(result._id)}, { situation: 'C' }).then(result3 =>{
                        console.log(result3);
                        res.redirect('../../../order/info-order/'+result.orderId);
                    });
                });
            });
        }, (err) => {
            sess.error = err;
            res.redirect("../../../info-order/"+req.params.orderId);
        });
        
    }catch(err){
        return res.send( err );
    }
});

module.exports = app => app.use('/item', route);