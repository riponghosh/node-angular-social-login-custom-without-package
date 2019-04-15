import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private _loginService:LoginService) { }

  ngOnInit() {
  }

  facebookSignIn(){
  	this._loginService.facebookLogin();
  }

  googleSignIn(){
  	this._loginService.googleLogin();
  }

  linkedinSignIn(){
  	this._loginService.linkedinLogin()
  }

}
