import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BidstobapprovedDashboardComponent } from './bidstobapproved-dashboard.component';

describe('BidstobapprovedDashboardComponent', () => {
  let component: BidstobapprovedDashboardComponent;
  let fixture: ComponentFixture<BidstobapprovedDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BidstobapprovedDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BidstobapprovedDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
