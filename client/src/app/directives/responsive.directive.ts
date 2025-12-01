import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ResponsiveService } from '../service/responsive.service';

@Directive({
  selector: '[appResponsive]'
})
export class ResponsiveDirective implements OnInit, OnDestroy {
  @Input() appResponsive: 'mobile' | 'tablet' | 'desktop' | 'mobile-tablet' | 'desktop-up' = 'mobile';
  
  private destroy$ = new Subject<void>();
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private responsiveService: ResponsiveService
  ) {}

  ngOnInit(): void {
    this.responsiveService.breakpoint$
      .pipe(takeUntil(this.destroy$))
      .subscribe(breakpoint => {
        const shouldShow = this.shouldShowForBreakpoint(breakpoint);
        
        if (shouldShow && !this.hasView) {
          this.viewContainer.createEmbeddedView(this.templateRef);
          this.hasView = true;
        } else if (!shouldShow && this.hasView) {
          this.viewContainer.clear();
          this.hasView = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private shouldShowForBreakpoint(breakpoint: any): boolean {
    switch (this.appResponsive) {
      case 'mobile':
        return breakpoint.isMobile;
      case 'tablet':
        return breakpoint.isTablet;
      case 'desktop':
        return breakpoint.isDesktop;
      case 'mobile-tablet':
        return breakpoint.isMobile || breakpoint.isTablet;
      case 'desktop-up':
        return breakpoint.isDesktop || breakpoint.isLargeDesktop;
      default:
        return true;
    }
  }
}