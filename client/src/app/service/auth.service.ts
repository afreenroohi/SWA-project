import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private TOKEN_KEY = 'kaar_token';
  private USER_KEY = 'kaar_user';
  private EXP_KEY = 'kaar_exp';

  constructor(private router: Router) {}

  // Save session after login
  setSession(token: string, user: any, expiresInSeconds: number) {
    const expiry = Date.now() + expiresInSeconds * 1000;

    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    localStorage.setItem(this.EXP_KEY, expiry.toString());
  }

  // Read token
  get token(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Check login status
  isLoggedIn(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    return !!token;
  }

  // Auto-remove expired token
  checkSessionExpiry() {
    if (!this.token) {
      this.logout();
    }
  }

  // Logout
  logout() {
    // Clear auth tokens
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.EXP_KEY);
    
    // Clear all other session data
    localStorage.removeItem('username');
    localStorage.removeItem('ROLERFP');
    localStorage.removeItem('ROLEBUD');
    localStorage.removeItem('ID');
    localStorage.removeItem('Dep');
    localStorage.removeItem('DepTxt');
    localStorage.removeItem('CC');
    localStorage.removeItem('CA');
    localStorage.removeItem('CommitteeName');
    localStorage.removeItem('LogdInUsrID');
    localStorage.removeItem('CMTID');
    localStorage.removeItem('ROLEOP');
    localStorage.removeItem('ROLEEV');
    localStorage.removeItem('ROLEQP');
    localStorage.removeItem('ROLEDP');
    localStorage.removeItem('ROLEMG');
    localStorage.removeItem('ROLETE');
    localStorage.removeItem('ContractDep');
    localStorage.removeItem('CocDep');
    localStorage.removeItem('RoleCOC');
    
    // Clear session storage
    sessionStorage.clear();

    // Force page reload to reset component state
    window.location.href = '/rfp/home';
  }
}