import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class LoginService {
	public authServerBaseUrl = 'http://localhost:4200';
	public config = {
		"linkedin":{
			"clientId":"client-id",
			"redirectURI" : this.authServerBaseUrl+"/login/linkdin"
		},
		"facebook":{
			"clientId":"client-id",
			"redirectURI" : this.authServerBaseUrl+"/login"
		},
		"google":{
			"clientId":"client-id",
			"redirectURI" : this.authServerBaseUrl+"/login/google"
		}
	};
	constructor(private http:HttpClient) { }

	facebookLogin(){
		window.location.href = 'https://www.facebook.com/v2.8/dialog/oauth?client_id='+this.config.facebook.clientId+'&redirect_uri='+this.config.facebook.redirectURI+'&scope=email';
	}

	googleLogin(){
		window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id='+this.config.google.clientId+'&redirect_uri='+this.config.google.redirectURI+'&scope=email%20profile';
	}

	linkedinLogin(){
		window.location.href = 'https://www.linkedin.com/oauth/v2/authorization?client_id='+this.config.linkedin.clientId+'&redirect_uri='+this.config.linkedin.redirectURI+'&response_type=code';
	}

	serverfacebookCodeSend(code){
		return this.http.post<any>("localhost:3000/facebook/login",{'code':code});
	}
}
