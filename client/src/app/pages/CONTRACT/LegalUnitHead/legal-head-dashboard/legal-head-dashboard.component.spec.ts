import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalHeadDashboardComponent } from './legal-head-dashboard.component';

describe('LegalHeadDashboardComponent', () => {
  let component: LegalHeadDashboardComponent;
  let fixture: ComponentFixture<LegalHeadDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LegalHeadDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalHeadDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
