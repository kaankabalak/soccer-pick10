var users = require('../controllers/users.js');
var fixtures = require('../controllers/fixtures.js');
const path = require('path');
module.exports = function(app) {
    app.post('/create', function(req, res) {
        users.create(req,res);
    })

    app.get('/allusers', function(req, res) {
        users.getAllUsers(req,res);
    })

    app.post('/getuser', function(req, res) {
        users.getUser(req,res);
    })

    app.post('/submitpredictions', function(req, res) {
        users.submitPredictions(req,res);
    })

    app.post('/getpredictions', function(req, res) {
        users.getPredictions(req,res);
    })

    app.all('*', (req, res) => {
        res.sendFile(path.resolve
        ('public/dist/index.html'));
    });
}