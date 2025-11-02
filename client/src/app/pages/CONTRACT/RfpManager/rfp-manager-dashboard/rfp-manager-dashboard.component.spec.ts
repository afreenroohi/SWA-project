import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfpManagerDashboardComponent } from './rfp-manager-dashboard.component';

describe('RfpManagerDashboardComponent', () => {
  let component: RfpManagerDashboardComponent;
  let fixture: ComponentFixture<RfpManagerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RfpManagerDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RfpManagerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
