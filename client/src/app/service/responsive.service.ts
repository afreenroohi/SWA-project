import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, Observable } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';

export interface BreakpointState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
  screenWidth: number;
}

@Injectable({
  providedIn: 'root'
})
export class ResponsiveService {
  private breakpoints = {
    mobile: 768,
    tablet: 992,
    desktop: 1200
  };

  private breakpointSubject = new BehaviorSubject<BreakpointState>(this.getBreakpointState());
  public breakpoint$: Observable<BreakpointState> = this.breakpointSubject.asObservable();

  constructor() {
    // Listen to window resize events
    fromEvent(window, 'resize')
      .pipe(
        debounceTime(100),
        map(() => this.getBreakpointState()),
        startWith(this.getBreakpointState())
      )
      .subscribe(state => this.breakpointSubject.next(state));
  }

  private getBreakpointState(): BreakpointState {
    const width = window.innerWidth;
    
    return {
      isMobile: width < this.breakpoints.mobile,
      isTablet: width >= this.breakpoints.mobile && width < this.breakpoints.tablet,
      isDesktop: width >= this.breakpoints.tablet && width < this.breakpoints.desktop,
      isLargeDesktop: width >= this.breakpoints.desktop,
      screenWidth: width
    };
  }

  // Convenience methods
  isMobile(): boolean {
    return this.breakpointSubject.value.isMobile;
  }

  isTablet(): boolean {
    return this.breakpointSubject.value.isTablet;
  }

  isDesktop(): boolean {
    return this.breakpointSubject.value.isDesktop;
  }

  isLargeDesktop(): boolean {
    return this.breakpointSubject.value.isLargeDesktop;
  }

  getScreenWidth(): number {
    return this.breakpointSubject.value.screenWidth;
  }

  // Check if screen is mobile or tablet (for touch interfaces)
  isTouchDevice(): boolean {
    return this.isMobile() || this.isTablet();
  }

  // Check if screen is desktop or larger
  isDesktopOrLarger(): boolean {
    return this.isDesktop() || this.isLargeDesktop();
  }
}