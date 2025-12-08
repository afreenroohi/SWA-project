import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';
import { CommonService } from './service/common.service';
import { environment } from '../../src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {

  constructor(private cs: CommonService,private router: Router, private oauthService: OAuthService ){

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      // Allow access in test mode
      if(environment.testlogin) {
        return true;
      }

      // Check if user has valid access token
      if (!this.oauthService.hasValidAccessToken()) {
        // Try to get token from storage first
        this.oauthService.tryLogin({
          onTokenReceived: context => {
            // Token received successfully, allow navigation
            return true;
          }
        });
      }
     
      // If still no valid token, redirect to login
      if (!this.oauthService.hasValidAccessToken()) {
        // Clear any existing session data
        localStorage.clear();
        sessionStorage.clear();
        
        // Redirect to login
        this.oauthService.initImplicitFlow();
        return false;
      }
      
      // Check if token is expired
      const tokenExpiry = this.oauthService.getAccessTokenExpiration();
      if (tokenExpiry && tokenExpiry < Date.now()) {
        // Token expired, clear session and redirect to login
        localStorage.clear();
        sessionStorage.clear();
        this.oauthService.logOut();
        return false;
      }
      
      return true;
  }
  
}
