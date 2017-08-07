var mongoose = require('mongoose');
var Fixture = mongoose.model('Fixture');
module.exports = {
    find_all: function(req,res) {
        Fixture.find({})
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.json(err);
            console.log('error');
        })
    },
    // create: function(req, res) {
    //     console.log('POST DATA', req.body);
    //     User.create(req.body)
    //     .then(data => {
    //         res.json(data);
    //     })
    //     .catch(err => {
    //         res.json(err);
    //         console.log('error');
    //     })
    // }
}