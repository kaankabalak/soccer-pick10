import { Component, OnInit } from '@angular/core';
import { CookieService } from "angular2-cookie/services/cookies.service";
import { HttpService } from "app/http.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  fixture = {
    date: null,
    homeTeam: '',
    awayTeam: '',
    homeScore: 0,
    awayScore: 0
  }

  today = new Date(2017,5,22);

  date = {
    day: null,
    month: null,
    year: null
  }

  currentUser = {
    name: ''
  }

  predictions = {
    user: '',
    picks: []
  }

  fixtures = [];

  results = [];

  time = [];

  comparison = [];

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
        this.date.month = String("0" + (sampleDate.getMonth() + 1)).slice(-2);
        this.date.year = String(sampleDate.getFullYear());
        // send it to http service to get fixtures
        console.log('Retrieving matches for:', this.date.year + '-' + this.date.month + '-' + this.date.day);
        
        this._httpService.retrieveResults(this.date.year, this.date.month, this.date.day)
        .then((data) => {
          console.log("Showing fixtures", data.results);
          console.log(data.results.length);
          if( j == 0) {
            this.fixtures = [];
            this.results = [];
          }
          for (var i=0; i<data.results.length; i++) {
            if (data.results[i].sport_event.tournament.name == 'Major League Soccer') {
              this.fixtures.push(data.results[i]);
              this.results.push([data.results[i].sport_event_status.home_score,data.results[i].sport_event_status.away_score]);
              console.log(i);
            }
          }
        })
        .catch((err) => {
          console.log("unable to retrieve fixtures", err);
        })
      }

      this._httpService.retrievePredictions(this.currentUser)
      .then((data) => {
        console.log("Showing predictions", data[0].lastpredictions);
        console.log("pred length", data[0].lastpredictions.length);
        if (data[0].lastpredictions.length != 0) {
          this.predictions.picks = [];
          console.log('The picks are', this.predictions.picks);
          for (var i=0; i<data[0].lastpredictions.length; i++) {
            this.predictions.picks.push(data[0].lastpredictions[i]);
          }
          console.log('Final picks:', this.predictions.picks);

          for(var i=0; i < this.results.length; i++) {
            if(this.results[i][0] > this.results[i][1]) {
              //home win
              if(this.predictions.picks[i][0] > this.predictions.picks[i][1]) {
                // predictions match
                if(this.predictions.picks[i][0] == this.results[i][0] && this.predictions.picks[i][1] == this.results[i][1]){
                  // 3 points
                  this.comparison.push(3);
                }
                else {
                  // 1 point
                  this.comparison.push(1);
                }
              }
              else {
                // 0 points
                this.comparison.push(0);
              }
            }
            else if(this.results[i][0] == this.results[i][1]) {
              //draw
              if(this.predictions.picks[i][0] == this.predictions.picks[i][1]) {
                // predictions match
                if(this.predictions.picks[i][0] == this.results[i][0] && this.predictions.picks[i][1] == this.results[i][1]){
                  // 3 points
                  this.comparison.push(3);
                }
                else {
                  // 1 point
                  this.comparison.push(1);
                }
              }
              else {
                // 0 points
                this.comparison.push(0);
              }
            }
            else{
              //away win
              if(this.predictions.picks[i][0] < this.predictions.picks[i][1]) {
                // predictions match
                if(this.predictions.picks[i][0] == this.results[i][0] && this.predictions.picks[i][1] == this.results[i][1]){
                  // 3 points
                  this.comparison.push(3);
                }
                else {
                  // 1 point
                  this.comparison.push(1);
                }
              }
              else {
                // 0 points
                this.comparison.push(0);
              }
            }
          }
        }
        
      })
      .catch((err) => {
        console.log("unable to retrieve predictions", err);
      })

    }

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
