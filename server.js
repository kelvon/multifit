const express      = require('express');
var app            = express();
var http = require("http").Server(app);
var bodyParse      = require('body-parser');
var morgan         = require('morgan');
var cors           = require('cors');
var path           = require('path');
var logger         = require('morgan');
const session      = require('express-session');
var io             = require("socket.io")(http);

const Admin    = require('./models/admin.model');
const Users    = require('./models/users.model');
const Product  = require('./models/product.model');
const Category = require('./models/category.model');
const Order    = require('./models/order.model');

app.io = io;

app.use(morgan('dev'));
app.set('view engine', 'ejs');
app.use(express.static("public"));

app.use(session({
    secret: 'admin',
    resave: false,
    saveUninitialized: true
}));

app.use(function(req, res, next) {
    res.locals.admin = req.session.admin;
    next();
});

var sess;
var admin;
var clients;
var products;
var category;
var formaspag;
var order;
var item;

app.use(bodyParse.json());
app.use(bodyParse.urlencoded({ extended: false }));
//app.use(cors);

app.use((req, res, next) => {
    req.header("Access-Control-Allow-Orign", "*");
    req.header("Access-Control-Allow-Headers", "Orign, X-Requested-With, Content-Type, Accept");
    req.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PATCH, PUT, DELETE");
    next();
});

app.get('/', function(req, res) {
    sess = req.session;
    if(sess.admin != null){
        res.redirect("./principal");
    }
    res.render('page/index');
});

app.post('/login', function(req, res) {
    try{
        Admin.findOne({email: req.body.email}).then(result => {
            console.log(result);
            
            var jsonResult = JSON.parse(JSON.stringify(result));
            if(result != null){
                if(jsonResult.pass == req.body.senha){
                    sess = req.session;
                    sess.admin = JSON.stringify(result);

                    res.redirect("./principal");
                }else{
                    console.log("Senha incorreta!");
                    res.redirect("./");
                }
            }else{
                console.log("Email incorreto!");
                res.redirect("./");
            }
        });
    }catch(err){
        console.log("Email não encontrado!");
        res.redirect("./");
    }
});

app.get('/principal', function(req, res) {
    sess = req.session;
    if(sess.admin == null || sess.admin == ""){
        res.redirect("./");
    }

    console.log(req.session.admin);
    res.render('page/principal', {
        admin: req.session.admin,
    });
});

app.get('/logout', function(req, res) {
    sess = req.session;
    if(sess.admin != null){
        req.session.destroy();
        res.redirect("./");
    }
});

require('./controllers/users.controller')(app);
require('./controllers/admin.controller')(app);
require('./controllers/product.controller')(app);
require('./controllers/category.controller')(app);
require('./controllers/order.controller')(app);
require('./controllers/item.controller')(app);
require('./controllers/formaspag.controller')(app);

io.on('connection',function(socket){
    socket.on('order',function(data){
        console.log(data);
        socket.broadcast.emit('order',data);  
    });
 
});

let port = 1234;
http.listen(port, '0.0.0.0');

console.log('Server is up and running on port numner ' + port);