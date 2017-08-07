// require mongoose
var mongoose = require('mongoose');
// create the schema
var FixtureSchema = new mongoose.Schema({
    homeTeam: {type: String},
    awayTeam: {type: String},
    homeScore: {type: Number},
    awayScore: {type: Number}
})

var Fixture = mongoose.model('Fixture', FixtureSchema);