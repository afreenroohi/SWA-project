import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BidstobeopenFinancialofficerDashboardComponent } from './bidstobeopen-financialofficer-dashboard.component';

describe('BidstobeopenFinancialofficerDashboardComponent', () => {
  let component: BidstobeopenFinancialofficerDashboardComponent;
  let fixture: ComponentFixture<BidstobeopenFinancialofficerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BidstobeopenFinancialofficerDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BidstobeopenFinancialofficerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
