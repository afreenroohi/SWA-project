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

      if(environment.testlogin) {
        return true;
      }

      if (!this.oauthService.hasValidAccessToken()) {
        this.oauthService.tryLogin({
          onTokenReceived: context => {
            this.router.navigate(['rfp/home']);
          }
        });
      }
     
      if (!this.oauthService.hasValidAccessToken()) {
        this.oauthService.initImplicitFlow();
        return false;
      }
      
      return true;
  }
  
}
