import { Component, OnInit } from '@angular/core';
import { CookieService } from "angular2-cookie/services/cookies.service";
import { HttpService } from "app/http.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private _httpService: HttpService, private _router: Router, private _cookieService:CookieService) { }

  ngOnInit() {
    this._cookieService.put('username', '');
  }

  redirectLogin() {
    this._router.navigate(['/login']);
  }

}
