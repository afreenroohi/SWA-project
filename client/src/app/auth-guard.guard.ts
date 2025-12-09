import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';
import { CommonService } from './service/common.service';
import { environment } from '../../src/environments/environment';
import { AuthService } from './service/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {

  constructor(private cs: CommonService,private router: Router, private oauthService: OAuthService, private authService: AuthService ){

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.authService.isLoggedIn()) {
      return true;
    }

    // No valid session, redirect to home
    this.router.navigate(['rfp/home']);
    return false;
  }
  
}
// import { Injectable } from '@angular/core';
// import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
// import { OAuthService } from 'angular-oauth2-oidc';
// import { Observable } from 'rxjs';
// import { CommonService } from './service/common.service';
// import { environment } from '../../src/environments/environment';


// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuardGuard implements CanActivate {

//   constructor(private cs: CommonService,private router: Router, private oauthService: OAuthService ){

//   }
//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
//     if(environment.testlogin) {
//         return true;
//       }
      
//       // Check for valid session token
//       const token = localStorage.getItem('kaar_token');
//       const userDetails = localStorage.getItem('kaar_user');

//       if (token && userDetails) {
//         return true;
//       }
      
//       // No valid session, redirect to home
//       this.router.navigate(['/']);
//       return false;
//   }
  
// }
