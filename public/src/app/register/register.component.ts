import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from "app/http.service";
import { CookieService } from "angular2-cookie/services/cookies.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private _httpService: HttpService, private _router: Router, private _cookieService:CookieService) { }
  
  currentUser = '';
  user = {username: '', password: '', confirmpw: '', score: 0};

  ngOnInit() {
    this.currentUser = this._cookieService.get('username');
    if (this.currentUser != ''){
      console.log('You are already logged in! Redirecting to dashboard');
      this._router.navigate(['/dashboard']);
    }
  }

  submitForm(){
    //making a cookie --- passing in the name
    this._cookieService.put('username', this.user.username);

    console.log(this.user.username);

    this._httpService.addNewUser(this.user)
    .then((data) => {
        console.log('Received user data:', data);
        console.log('Registration successful');
        //making a cookie --- passing in the name
        this._cookieService.put('username', this.user.username);
        this._router.navigate(['/dashboard']);
    })
    .catch((err) => {
        console.log('Could not create user:', err);
    })

    // this._httpService.retrieveUser(this.user)
    // .then((data) => {
    //   console.log("we posted the user to the DB in component.ts, the data is: ", data);
    //   this._router.navigate(['/dashboard']);
    // })
    // .catch((err) => {
    //   console.log("unable to retrieve user", err);
    // })

  }

}
