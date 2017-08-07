import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from "app/http.service";

@Component({
  selector: 'app-leaderboards',
  templateUrl: './leaderboards.component.html',
  styleUrls: ['./leaderboards.component.css']
})
export class LeaderboardsComponent implements OnInit {

  constructor(private _httpService: HttpService, private _router: Router) { }

  users = [];

  ngOnInit() {
    // retrieve user
    this._httpService.retrieveAllUsers()
    .then((data) => {
      console.log("Showing users", data);
      this.users = [];
      for (var i=0; i<data.length; i++) {
        this.users.push(data[i]);
      }
    })
    .catch((err) => {
      console.log("unable to retrieve user", err);
    })
  }

}
