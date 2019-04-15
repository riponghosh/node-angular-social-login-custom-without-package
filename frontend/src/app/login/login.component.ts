import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private _loginService:LoginService,private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
  	this.checkSocialCodeExistence();
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

  checkSocialCodeExistence(){
    let code=this.activatedRoute.snapshot.queryParams.code;
    if(code){
    	this._loginService.serverfacebookCodeSend(code)
    	.subscribe(
    		res=>{
    			console.log(res)
    		},
    		err=>{
    			console.log(err)
    		}
    		)
    }
    console.log(this.activatedRoute.snapshot);
  }

}
