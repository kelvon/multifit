var mongoose = require('mongoose');

mongoose.connect(
    'mongodb://adminmultifit:admin288@ds125871.mlab.com:25871/multifit'
    , {useMongoClient: true}
);

mongoose.Promise = global.Promise;
module.exports = mongoose;