// require mongoose
var mongoose = require('mongoose');
// create the schema
var UserSchema = new mongoose.Schema({
    username: {type: String},
    password: {type: String},
    score: {type: Number},
    lastpredictions: {type: Array},
    predictions: {type: Array}
})

var User = mongoose.model('User', UserSchema); // We are setting this Schema in our Models as 'User'