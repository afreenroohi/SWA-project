import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RFPMaintenanceComponent } from './rfp-maintenance.component';

describe('RfpMaintenanceComponent', () => {
  let component: RFPMaintenanceComponent;
  let fixture: ComponentFixture<RFPMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RFPMaintenanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RFPMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
