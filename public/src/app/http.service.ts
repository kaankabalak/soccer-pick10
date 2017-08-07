import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs';

@Injectable()
export class HttpService {

  constructor(private _http: Http) { }

  addNewUser(user){
    console.log("Adding new user", user);
    return this._http.post("/create", user)
    .map(data => data.json())
    .toPromise()
  }

  retrieveUser(user){
    console.log("Retrieve user method:", user);
    return this._http.post("/getuser", user)
    .map(data => data.json())
    .toPromise()
  }

  retrieveAllUsers(){
    console.log("Get all users");
    return this._http.get("/allusers")
    .map(data => data.json())
    .toPromise()
  }

  retrieveResults(year, month, day){
    return this._http.get("https://api.sportradar.us/soccer-t3/am/en/schedules/" + year + "-" + month + "-" + day + "/results.json?api_key=mxew68mcceupmqum95ggnffx")
    .map(data => data.json())
    .toPromise()
  }
  
  retrieveFixtures(year, month, day){
    return this._http.get("https://api.sportradar.us/soccer-t3/am/en/schedules/" + year + "-" + month + "-" + day + "/schedule.json?api_key=mxew68mcceupmqum95ggnffx")
    .map(data => data.json())
    .toPromise()
  }

  submitPredictions(predictions){
    console.log("we are passing in the predictions in the service", predictions);
    return this._http.post("/submitpredictions", predictions)
    .map(data => data.json())
    .toPromise()
  }

  retrievePredictions(user){
    console.log("we are passing in the predictions in the service", user);
    return this._http.post("/getpredictions", user)
    .map(data => data.json())
    .toPromise()
  }

}
