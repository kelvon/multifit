const express   = require('express');
const mongoose  = require('mongoose');
const Orders    = require('../models/order.model');
const Item      = require('../models/item.model');
const Product   = require('../models/product.model');
const Users     = require('../models/users.model');
const Admin     = require('../models/admin.model');
const FormasPag = require('../models/formaspag.model');
const route     = express.Router();

var namePesq;
var categoryInfo;

route.get('/count', (req, res) => {
    try{
        Orders.find().count(function(err, count){
            console.log(count);
            return res.send({ count: count });
        })
    }catch(err){
        return res.send({ error: 'Erro ao retornar total do registro!' });
    }
});

route.get('/getAllUsers', function(req, res) {   
    Users.find().then(result => {
        console.log(result);
        return res.send({users: result});
    });
});

route.get('/getAllAdmin', function(req, res) {   
    Admin.find().then(result => {
        console.log(result);
        return res.send({admin: result});
    });
});

route.get('/getAcceptOrder', function(req, res){
    Orders.find({ situation: 'A' }).count(function(err, count){
        console.log(count);
        return res.send({ count: count });
    });
});

route.get('/getAllFormasPag', function(req, res) {   
    FormasPag.find().then(result => {
        console.log(result);
        return res.send({formas: result});
    });
});

route.get('/', function(req, res) {
    var c = [];
    var u = [];

    sess = req.session;
    if(sess.admin == null || sess.admin == ""){
        res.redirect("./");
    }

    Orders.find({ situation: 'P' }).limit(12).then(result => {
        console.log("result: "+result);
        this.order = result;

        if(this.order != null){
            c = this.order;
            Users.find().then(result2 => {

                console.log("result2: "+result2);
                FormasPag.find().then(result3 => {
                    console.log(result3);
                    console.log(req.session.admin);

                    res.render('page/order', {
                        admin: req.session.admin,
                        orders: JSON.parse(JSON.stringify(c)),
                        users:  JSON.parse(JSON.stringify(result2)),
                        formaspag: JSON.parse(JSON.stringify(result3))
                    });
                });
            });
        }
    });
});

route.get('/list-accept-order', function(req, res) {
    var c = [];
    var u = [];

    sess = req.session;
    if(sess.admin == null || sess.admin == ""){
        res.redirect("./");
    }

    Orders.find({ situation: 'A'  }).then(result => {
        console.log("result: "+result);
        this.order = result;

        if(this.order != null){
            c = this.order;
            Users.find().then(result2 => {
                console.log("result2: "+result2);
                FormasPag.find().then(result3 => {
                    console.log(result3);
                    console.log(req.session.admin);

                    res.render('page/accept-order', {
                        admin: req.session.admin,
                        orders: JSON.parse(JSON.stringify(c)),
                        users:  JSON.parse(JSON.stringify(result2)),
                        formaspag: JSON.parse(JSON.stringify(result3))
                    });
                });
            });
        }
    });
});

route.get('/list-cancel-order', function(req, res) {
    var c = [];
    var u = [];

    sess = req.session;
    if(sess.admin == null || sess.admin == ""){
        res.redirect("./");
    }

    Orders.find({ situation: 'C'  }).then(result => {
        console.log("result: "+result);
        this.order = result;

        if(this.order != null){
            c = this.order;
            Users.find().then(result2 => {
                console.log("result2: "+result2);
                FormasPag.find().then(result3 => {
                    console.log(result3);
                    console.log(req.session.admin);

                    res.render('page/cancel-order', {
                        admin: req.session.admin,
                        orders: JSON.parse(JSON.stringify(c)),
                        users:  JSON.parse(JSON.stringify(result2)),
                        formaspag: JSON.parse(JSON.stringify(result3))
                    });
                });
            });
        }
    });
});

route.get('/accept-order/:orderId', function(req, res){
    try{
        sess = req.session;
        if(sess.admin == null || sess.admin == ""){
            res.redirect("./");
        }

        Orders.findByIdAndUpdate(req.params.orderId, {
            situation:  'P',
        }, {new: true})
        .then(result => {
            req.app.io.emit('orderAccept', Orders);
            res.redirect("../../../order/list-accept-order")
        }, (err) => {
            sess.error = err;
            res.redirect("../../../order/list-accept-order");
        });
        
    }catch(err){
        return res.send( err );
    }
})

route.get('/finalize/:orderId', function(req, res){
    try{
        sess = req.session;
        if(sess.admin == null || sess.admin == ""){
            res.redirect("./");
        }

        Orders.findByIdAndUpdate(req.params.orderId, {
            situation:  'F',
        }, {new: true})
        .then(result => {
            req.app.io.emit('orderFinalize', Orders);
            res.redirect("../../../order")
        }, (err) => {
            sess.error = err;
            res.redirect("../../../order");
        });
        
    }catch(err){
        return res.send( err );
    }
})

route.post('/finalize2/:orderId', function(req, res){
    try{
        sess = req.session;
        if(sess.admin == null || sess.admin == ""){
            res.redirect("./");
        }

        Orders.findByIdAndUpdate(req.params.orderId, {
            situation:  'F',
            formaspagId: mongoose.Types.ObjectId(req.body.formapagID),
        }, {new: true})
        .then(result => {
            req.app.io.emit('orderFinalize', Orders);
            res.redirect("../../../order")
        }, (err) => {
            sess.error = err;
            res.redirect("../../../order");
        });
        
    }catch(err){
        return res.send( err );
    }
})

route.get('/cancel/:orderId', function(req, res){
    try{
        sess = req.session;
        if(sess.admin == null || sess.admin == ""){
            res.redirect("./");
        }

        Orders.findByIdAndUpdate(req.params.orderId, {
            situation:  'C',
        }, {new: true})
        .then(result => {

            Item.update({ orderId: mongoose.Types.ObjectId(req.params.orderId)}, { situation: 'C' }).then(result3 =>{
                console.log(result3);
                
                req.app.io.emit('cancelAnalitycorder', order);
                res.redirect('../../../order');
            });
        }, (err) => {
            sess.error = err;
            res.redirect("../../../order");
        });
        
    }catch(err){
        return res.send( err );
    }
})

route.get('/cancel2/:orderId', function(req, res){
    try{
        sess = req.session;
        if(sess.admin == null || sess.admin == ""){
            res.redirect("./");
        }

        Orders.findByIdAndUpdate(req.params.orderId, {
            situation:  'C',
        }, {new: true})
        .then(result => {

            Item.update({ orderId: mongoose.Types.ObjectId(req.params.orderId)}, { situation: 'C' }).then(result3 =>{
                console.log(result3);
                
                req.app.io.emit('cancelAnalitycorder', order);
                res.redirect('../../../order/list-accept-order');
            });
        }, (err) => {
            sess.error = err;
            res.redirect("../../../order/list-accept-order");
        });
        
    }catch(err){
        return res.send( err );
    }
})

/*
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

route.get('/register-order', function(req, res) {   
    try{
        sess = req.session;
        if(sess.admin == null || sess.admin == ""){
            res.redirect("./");
        }

        var passedVariable = "";
        if(sess.error != null){
            passedVariable = sess.error;
        }

        res.render('page/register-order', {
            admin: req.session.admin,
            error: passedVariable
        });
    }catch(err){
        return res.send({ error: 'Erro ao retornar info do administrador!' });
    }
});

route.post('/auth2/register', (req, res) => {
    try{

        var statusReg;
        if(req.body.pag == "S"){
            statusReg = "S";
        }else{
            statusReg = "N";
        }

        var order = new Orders({
            clienteId:  mongoose.Types.ObjectId(req.body.clienteID),
            userId:     mongoose.Types.ObjectId(req.body.adminID),
            date:       req.body.date,
            hour:       req.body.hour,
            priceTotal: '0,00',
            situation:  'A',
            status:     statusReg
        });

        order.save(function (err) {
            if (err) {
                return "Erro ao cadastrar!";
            }
        });
        
        Orders.create(order);
        req.app.io.emit('order', order);
        res.redirect("../../../order")

    }catch(err){
        return "Erro ao cadastrar!";
    }
});

route.post('/insert-timing/:orderId', (req, res) => {
    try{
        sess = req.session;
        if(sess.admin == null || sess.admin == ""){
            res.redirect("./");
        }

        Orders.findByIdAndUpdate(req.params.orderId, {
            timing:  req.body.hour_timing+":"+req.body.min_timing+":"+req.body.seconds_timing,
        }, {new: true})
        .then(result => {
            res.redirect("../../../order")
        }, (err) => {
            sess.error = err;
            res.redirect("../../../order");
        });
        
    }catch(err){
        return res.send( err );
    }
});

route.get('/info-order/:orderId', function(req, res) {   
    try{
        sess = req.session;
        if(sess.admin == null || sess.admin == ""){
            res.redirect("./");
        }

        var passedVariable = "";
        if(sess.error != null){
            passedVariable = sess.error;
        }

        Orders.findById(req.params.orderId).then(result => {
            console.log(result);
            this.order = result;

            Item.find({ 
                orderId: mongoose.Types.ObjectId(req.params.orderId)
            }).then(result2 => {

                console.log("result2: "+result2);
                console.log(req.session.admin);

                Users.find().then(result3 => {

                    console.log("result3: "+result3);
                    console.log(req.session.admin);

                    Product.find().then(result4 => {
                        console.log("result4: "+result4);

                        FormasPag.find().then(result5 => {
                            console.log(result5);
                            console.log(req.session.admin);

                            res.render('page/info-order', {
                                admin  : req.session.admin,
                                order  : this.order,
                                users  : JSON.parse(JSON.stringify(result3)),
                                item   : JSON.parse(JSON.stringify(result2)),
                                product: JSON.parse(JSON.stringify(result4)),
                                formaspag: JSON.parse(JSON.stringify(result5)),
                                error  : passedVariable
                            });
                        });
                    });
                });
            });
        });
    }catch(err){
        return res.send({ error: 'Erro ao retornar info do administrador!' });
    }
});

route.get('/delete/:orderId', (req, res) => {
    try{
        sess = req.session;
        if(sess.admin == null || sess.admin == ""){
            res.redirect("./");
        }

        Orders.findByIdAndRemove(req.params.orderId)
        .then(result => {
            req.app.io.emit('cancelAnalitycorder', order);
            res.redirect("../../../order")
        }, (err) => {
            sess.error = err;
            res.redirect("../../../edit-order/"+req.params.orderId);
        });
        
    }catch(err){
        return res.send( err );
    }
});

module.exports = app => app.use('/order', route);