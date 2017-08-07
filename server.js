// Require the Express Module
var express = require('express');
// Require path
const path = require('path');
// Create an Express App
var app = express();
// Require body-parser (to receive post data from clients)
var bodyParser = require('body-parser');
// Integrate body-parser with our App
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, '/public/dist')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './client/views'));
// require the mongoose configuration file which does the rest for us
require('./server/config/mongoose.js');
// store the function in a variable
var routes_setter = require('./server/config/routes.js');
// invoke the function stored in routes_setter and pass it the "app" variable
routes_setter(app);
// Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
    var requestify = require('requestify'); 
    var mongoose = require('mongoose');
    var User = mongoose.model('User');
    console.log("listening on port 8000");
    var slkdlsakdl = new Date();
    console.log('day:', slkdlsakdl.getDay(), ',hours:', slkdlsakdl.getHours(), ',minutes:', slkdlsakdl.getMinutes(), ',seconds:', slkdlsakdl.getSeconds());

    var today;
    var processed;

    function checkDate() {
        while(true) {
            today = new Date();
            processed = false;

            if(today.getDay() == 1) {
                if(today.getHours() == 0 && today.getMinutes() == 0 && today.getSeconds() == 0 && processed == false) {
                    processed = true;
                    break;
                }
            }
        }
    }

    checkDate();
    

    console.log(today);
    // find the first monday after the current date and start creating fixtures
    var dateAdjuster = today;
    while(dateAdjuster.getDay() != 1) {
        dateAdjuster.setDate(dateAdjuster.getDate() - 1);
        console.log("Date is...", dateAdjuster, 'get day is:', dateAdjuster.getDay());
    }
    console.log("Final date:", dateAdjuster);

    var dateArray = [];
    var results = [];
    var name ='';

    for (var i=0; i<7; i++) {
        var day = dateAdjuster.getDate();
        var month = dateAdjuster.getMonth();
        var year = dateAdjuster.getFullYear();
        
        console.log('the date is:', dateAdjuster.getDate(), '-', dateAdjuster.getMonth(), '-', dateAdjuster.getFullYear())
        var newDate = new Date(year,month,day);
        dateArray.push(newDate);
        dateAdjuster.setDate(dateAdjuster.getDate() + 1);
    }

    console.log('dateArray is', dateArray);

    // make api calls
    setTimeout(function() {
        requestify.get('https://api.sportradar.us/soccer-t3/am/en/schedules/' + String(dateArray[0].getFullYear()) + '-' + String("0" + (dateArray[0].getMonth() + 1)).slice(-2) + '-' + String("0" + dateArray[0].getDate()).slice(-2) + '/results.json?api_key=mxew68mcceupmqum95ggnffx')
        .then(function(response) {
            // Get the response body
            // console.log(response.getBody().results);
            for (var i=0; i<response.getBody().results.length; i++) {
                if (response.getBody().results[i].sport_event.tournament.name == 'Major League Soccer') {
                    results.push([response.getBody().results[i].sport_event_status.home_score,response.getBody().results[i].sport_event_status.away_score]);
                }
            }
            console.log('Results after 0:', results);
            // // find all users
            User.find({})
            .then(data => {
                console.log(data);
                for(var j=0; j<data.length; j++) {
                    name = data[j].username;
                    for(var i=0; i < results.length; i++) {
                        console.log('data predictions', data[j].predictions);
                        if(results[i][0] > results[i][1]) {
                            //home win
                            if(data[j].predictions[i][0] > data[j].predictions[i][1]) {
                                // predictions match
                                if(data[j].predictions[i][0] == results[i][0] && data[j].predictions[i][1] == results[i][1]){
                                    // 3 points
                                    User.findOne({username: name}, function (err, user) {
                                        user.score += 3;
                                        user.save(function (err) {
                                            if(err) {
                                                console.error('ERROR!');
                                            }
                                            else{
                                                console.log('no errors');
                                            }
                                        });
                                    });
                                }
                                else {
                                    // 1 point
                                    console.log('1 points home win');
                                    User.findOne({username: name}, function (err, user) {
                                        user.score += 1;
                                        user.save(function (err) {
                                            if(err) {
                                                console.error('ERROR!');
                                            }
                                            else{
                                                console.log('no errors');
                                            }
                                        });
                                    });
                                }
                            }
                            else {
                                    // 0 points
                            }
                        }
                        else if(results[i][0] == results[i][1]) {
                        //draw
                            if(data[j].predictions[i][0] == data[j].predictions[i][1] && data[j].predictions[i][0] != null) {
                                // predictions match
                                if(data[j].predictions[i][0] == results[i][0] && data[j].predictions[i][1] == results[i][1]){
                                    // 3 points
                                    User.findOne({username: name}, function (err, user) {
                                        user.score += 3;
                                        user.save(function (err) {
                                            if(err) {
                                                console.error('ERROR!');
                                            }
                                            else{
                                                console.log('no errors');
                                            }
                                        });
                                    });
                                }
                                else {
                                    // 1 point
                                    console.log('1 points tie');
                                    User.findOne({username: name}, function (err, user) {
                                        user.score += 1;
                                        user.save(function (err) {
                                            if(err) {
                                                console.error('ERROR!');
                                            }
                                            else{
                                                console.log('no errors');
                                            }
                                        });
                                    });
                                }
                            }
                            else {
                                    // 0 points
                            }
                        }
                        else{
                            //away win
                            if(predictions[i][0] < predictions[i][1]) {
                                // predictions match
                                if(data[j].predictions[i][0] == results[i][0] && data[j].predictions[i][1] == results[i][1]){
                                    // 3 points
                                    User.findOne({username: name}, function (err, user) {
                                        user.score += 3;
                                        user.save(function (err) {
                                            if(err) {
                                                console.error('ERROR!');
                                            }
                                            else{
                                                console.log('no errors');
                                            }
                                        });
                                    });
                                }
                                else {
                                    // 1 point
                                    console.log('1 points away win');
                                    User.findOne({username: name}, function (err, user) {
                                        user.score += 1;
                                        user.save(function (err) {
                                            if(err) {
                                                console.error('ERROR!');
                                            }
                                            else{
                                                console.log('no errors');
                                            }
                                        });
                                    });
                                }
                            }
                            else {
                                    // 0 points
                            }
                        }
                    }
                }

            })
            .catch(err => {
                console.log('error', err);
            })

            User.find({}).sort({score:-1})
            .then(data => {
                for(var i=0; i<data.length; i++) {
                    var temp = data[i].lastpredictions;
                    data[i].lastpredictions = data[i].predictions;
                    data[i].predictions = temp;
                }
            })
            .catch(err => {
                console.log('error', err);
            });

        })
        .catch(function(err) {
            console.log(err);
        });
    }, 18000);
    setTimeout(function() {
        requestify.get('https://api.sportradar.us/soccer-t3/am/en/schedules/' + String(dateArray[1].getFullYear()) + '-' + String("0" + (dateArray[1].getMonth() + 1)).slice(-2) + '-' + String("0" + dateArray[1].getDate()).slice(-2) + '/results.json?api_key=mxew68mcceupmqum95ggnffx')
        .then(function(response) {
            // Get the response body
            // console.log(response.getBody().results);
            for (var i=0; i<response.getBody().results.length; i++) {
                if (response.getBody().results[i].sport_event.tournament.name == 'Major League Soccer') {
                    results.push([response.getBody().results[i].sport_event_status.home_score,response.getBody().results[i].sport_event_status.away_score]);
                }
            }
            console.log('Results after 1:', results);
        })
        .catch(function(err) {
            console.log(err);
        });
    }, 15000);
    setTimeout(function() {
        requestify.get('https://api.sportradar.us/soccer-t3/am/en/schedules/' + String(dateArray[2].getFullYear()) + '-' + String("0" + (dateArray[2].getMonth() + 1)).slice(-2) + '-' + String("0" + dateArray[2].getDate()).slice(-2) + '/results.json?api_key=mxew68mcceupmqum95ggnffx')
        .then(function(response) {
            // Get the response body
            // console.log(response.getBody().results);
            for (var i=0; i<response.getBody().results.length; i++) {
                if (response.getBody().results[i].sport_event.tournament.name == 'Major League Soccer') {
                    results.push([response.getBody().results[i].sport_event_status.home_score,response.getBody().results[i].sport_event_status.away_score]);
                }
            }
            console.log('Results after 2:', results);
        })
        .catch(function(err) {
            console.log(err);
        });
    }, 12000);
    setTimeout(function() {
        requestify.get('https://api.sportradar.us/soccer-t3/am/en/schedules/' + String(dateArray[3].getFullYear()) + '-' + String("0" + (dateArray[3].getMonth() + 1)).slice(-2) + '-' + String("0" + dateArray[3].getDate()).slice(-2) + '/results.json?api_key=mxew68mcceupmqum95ggnffx')
        .then(function(response) {
            // Get the response body
            // console.log(response.getBody().results);
            for (var i=0; i<response.getBody().results.length; i++) {
                if (response.getBody().results[i].sport_event.tournament.name == 'Major League Soccer') {
                    results.push([response.getBody().results[i].sport_event_status.home_score,response.getBody().results[i].sport_event_status.away_score]);
                }
            }
            console.log('Results after 3:', results);
        })
        .catch(function(err) {
            console.log(err);
        });
    }, 9000);
    setTimeout(function() {
        requestify.get('https://api.sportradar.us/soccer-t3/am/en/schedules/' + String(dateArray[4].getFullYear()) + '-' + String("0" + (dateArray[4].getMonth() + 1)).slice(-2) + '-' + String("0" + dateArray[4].getDate()).slice(-2) + '/results.json?api_key=mxew68mcceupmqum95ggnffx')
        .then(function(response) {
            // Get the response body
            // console.log(response.getBody().results);
            for (var i=0; i<response.getBody().results.length; i++) {
                if (response.getBody().results[i].sport_event.tournament.name == 'Major League Soccer') {
                    results.push([response.getBody().results[i].sport_event_status.home_score,response.getBody().results[i].sport_event_status.away_score]);
                }
            }
            console.log('Results after 4:', results);
        })
        .catch(function(err) {
            console.log(err);
        });
    }, 6000);
    setTimeout(function() {
        requestify.get('https://api.sportradar.us/soccer-t3/am/en/schedules/' + String(dateArray[5].getFullYear()) + '-' + String("0" + (dateArray[5].getMonth() + 1)).slice(-2) + '-' + String("0" + dateArray[5].getDate()).slice(-2) + '/results.json?api_key=mxew68mcceupmqum95ggnffx')
        .then(function(response) {
            // Get the response body
            // console.log(response.getBody().results);
            for (var i=0; i<response.getBody().results.length; i++) {
                if (response.getBody().results[i].sport_event.tournament.name == 'Major League Soccer') {
                    results.push([response.getBody().results[i].sport_event_status.home_score,response.getBody().results[i].sport_event_status.away_score]);
                }
            }
            console.log('Results after 5:', results);
        })
        .catch(function(err) {
            console.log(err);
        });
    }, 3000);
    setTimeout(function() {
        requestify.get('https://api.sportradar.us/soccer-t3/am/en/schedules/' + String(dateArray[6].getFullYear()) + '-' + String("0" + (dateArray[6].getMonth() + 1)).slice(-2) + '-' + String("0" + dateArray[6].getDate()).slice(-2) + '/results.json?api_key=mxew68mcceupmqum95ggnffx')
        .then(function(response) {
            // Get the response body
            // console.log(response.getBody().results);
            for (var i=0; i<response.getBody().results.length; i++) {
                if (response.getBody().results[i].sport_event.tournament.name == 'Major League Soccer') {
                    results.push([response.getBody().results[i].sport_event_status.home_score,response.getBody().results[i].sport_event_status.away_score]);
                }
            }
            console.log('Results after 6:', results);

        })
        .catch(function(err) {
            console.log(err);
        });
    }, 1500);


})
