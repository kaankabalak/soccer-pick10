import { Component, OnInit } from '@angular/core';
import { CookieService } from "angular2-cookie/services/cookies.service";
import { HttpService } from "app/http.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  fixture = {
    date: null,
    homeTeam: '',
    awayTeam: '',
    homeScore: 0,
    awayScore: 0
  }

  today = new Date();

  date = {
    day: null,
    month: null,
    year: null
  }

  currentUser = {
    name: ''
  }

  fixtures = [];

  predictions = {
    user: '',
    picks: []
  }

  time = [];

  constructor(private _httpService: HttpService, private _cookieService:CookieService, private _router: Router) { }

  ngOnInit() {
    this.currentUser.name = this._cookieService.get('username');
    this.predictions.user = this.currentUser.name;
    if (this.currentUser.name == ''){
      console.log('please log in')
      this._router.navigate(['/login']);
    }
    else {
      // convert to GMT
      this.today.setTime(this.today.getTime() + (7 * 60 * 60 * 1000));
      console.log(this.today);
      // find the first monday after the current date and start creating fixtures
      var dateAdjuster = this.today;
      while(dateAdjuster.getDay() != 1) {
        dateAdjuster.setDate(dateAdjuster.getDate() - 1);
        console.log("Date is...", dateAdjuster);
      }
      console.log("Final date:", dateAdjuster);
      for (var j=0; j<7 ; j++) {

        this.delay(1000);

        var sampleDate = new Date();
        // for next week
        // sampleDate.setDate(dateAdjuster.getDate() + j);
        sampleDate.setDate(this.today.getDate() + j);
        // get day and month with zeros on front, and the year
        this.date.day = String("0" + sampleDate.getDate()).slice(-2);
        this.date.month = String("0" + (sampleDate.getMonth())).slice(-2);
        this.date.year = String(sampleDate.getFullYear());
        // send it to http service to get fixtures
        console.log('Retrieving matches for:', this.date.year + '-' + this.date.month + '-' + this.date.day);
        this._httpService.retrieveFixtures(this.date.year, this.date.month, this.date.day)
        .then((data) => {
          console.log("Showing fixtures", data.sport_events);
          console.log(data.sport_events.length);
          if( j == 0) {
            this.fixtures = [];
          }
          for (var i=0; i<data.sport_events.length; i++) {
            if (data.sport_events[i].tournament.name == 'Major League Soccer') {
              this.fixtures.push(data.sport_events[i]);
              this.predictions.picks.push([null,null]);
              let gameDate = new Date(data.sport_events[i].scheduled);
              let currDate = new Date();
              if (gameDate.getTime() > currDate.getTime()) {
                console.log('true:', gameDate, 'and', currDate);
                this.time.push(true);
              }
              else {
                this.time.push(false);
              }
              console.log(i);
            }
          }
        })
        .catch((err) => {
          console.log("unable to retrieve fixtures");
        })
      }
      
      this._httpService.retrievePredictions(this.currentUser)
      .then((data) => {
        console.log("Showing predictions", data[0].predictions);
        console.log("pred length", data[0].predictions.length);
        if (data[0].predictions.length != 0) {
          this.predictions.picks = [];
          console.log('The picks are', this.predictions.picks);
          for (var i=0; i<data[0].predictions.length; i++) {
            this.predictions.picks.push(data[0].predictions[i]);
          }
        }
        
      })
      .catch((err) => {
        console.log("unable to retrieve predictions", err);
      })

    }
  }

  clearScores() {
    this.predictions.picks = [];
    for(var i=0; i<this.fixtures.length;i++) {
      this.predictions.picks.push([null,null]);
    }
  }

  submitScores() {
    this._httpService.submitPredictions(this.predictions)
    .then((data) => {
      console.log("Predictions sent to the server: ", data);
    })
    .catch((err) => {
      console.log("unable to post to the DB");
    })
  }

  delay(milliseconds) {
    var counter= 0
        , start = new Date().getTime()
        , end = 0;
      while (counter < milliseconds) {
          end = new Date().getTime();
          counter = end - start;
      }
  }

}
