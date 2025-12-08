import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private sessionExpiredSubject = new BehaviorSubject<boolean>(false);
  public sessionExpired$ = this.sessionExpiredSubject.asObservable();
  
  private sessionCheckInterval: any;

  constructor(
    private oauthService: OAuthService,
    private router: Router
  ) {
    this.startSessionCheck();
  }

  /**
   * Start periodic session validation
   */
  startSessionCheck(): void {
    // Check session every 5 minutes
    this.sessionCheckInterval = setInterval(() => {
      this.validateSession();
    }, 5 * 60 * 1000);
  }

  /**
   * Stop session checking
   */
  stopSessionCheck(): void {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
    }
  }

  /**
   * Validate current session
   */
  validateSession(): boolean {
    if (!this.oauthService.hasValidAccessToken()) {
      this.handleSessionExpired();
      return false;
    }

    const tokenExpiry = this.oauthService.getAccessTokenExpiration();
    if (tokenExpiry && tokenExpiry < Date.now()) {
      this.handleSessionExpired();
      return false;
    }

    return true;
  }

  /**
   * Handle session expiration
   */
  private handleSessionExpired(): void {
    this.sessionExpiredSubject.next(true);
    this.clearSession();
    this.router.navigate(['/']);
  }

  /**
   * Clear all session data
   */
  clearSession(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.oauthService.logOut();
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  /**
   * Get current user token
   */
  getToken(): string | null {
    return this.oauthService.getAccessToken();
  }

  /**
   * Get token expiration time
   */
  getTokenExpiration(): number | null {
    return this.oauthService.getAccessTokenExpiration();
  }

  /**
   * Refresh token if needed
   */
  refreshTokenIfNeeded(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.oauthService.hasValidAccessToken()) {
        this.oauthService.silentRefresh().then(() => {
          resolve(true);
        }).catch(() => {
          this.handleSessionExpired();
          resolve(false);
        });
      } else {
        resolve(true);
      }
    });
  }
}