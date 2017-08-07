import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from "app/http.service";
import { CookieService } from "angular2-cookie/services/cookies.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private _httpService: HttpService, private _router: Router, private _cookieService:CookieService) { }
  
  currentUser = '';
  user = {name: '', password: ''};
  incorrectPW = false;

  ngOnInit() {
    this.currentUser = this._cookieService.get('username');
    if (this.currentUser != ''){
      console.log('You are already logged in! Redirecting to dashboard');
      this._router.navigate(['/dashboard']);
    }
  }

  login(){
    // retrieve user
    this._httpService.retrieveUser(this.user)
    .then((data) => {
      
      console.log("we posted the user to the DB in component.ts, the data is: ", data);

      if (data == false) {
        console.log('incorrect password');
        this.incorrectPW = true;
      }
      else {
        console.log('you habe logged in');
        
        //making a cookie --- passing in the name
        this._cookieService.put('username', this.user.name);
        this._router.navigate(['/dashboard']);
      }
      
    })
    .catch((err) => {
      console.log("unable to retrieve user", err);
    })

  }

}
